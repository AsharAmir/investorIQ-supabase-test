from flask import Flask, request, jsonify
from flask_cors import CORS
from firebase_admin import credentials, firestore, initialize_app
import os
from dotenv import load_dotenv
import google.generativeai as genai
# Load environment variables from .env file
load_dotenv()


# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Initialize Firebase Admin
cred = credentials.Certificate('config/investoriq-79baa-firebase-adminsdk-k34ya-6eac8df930.json')
initialize_app(cred)
db = firestore.client()

# Initialize Gemini AI
GOOGLE_API_KEY = os.getenv('GEMINI_API_KEY')  # Get the API key from .env file
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-pro')

def calculate_roi(purchase_price, rehab_cost, arv, holding_costs):
    total_investment = purchase_price + rehab_cost + holding_costs
    net_profit = arv - total_investment
    roi = (net_profit / total_investment) * 100
    return roi

@app.route('/api/properties', methods=['GET'])
def get_properties():
    try:
        properties_ref = db.collection('properties')
        properties = [doc.to_dict() for doc in properties_ref.stream()]
        return jsonify(properties), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/properties', methods=['POST'])
def add_property():
    try:
        data = request.json
        doc_ref = db.collection('properties').document()
        data['id'] = doc_ref.id
        doc_ref.set(data)
        return jsonify({"id": doc_ref.id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/analyze-property', methods=['POST'])
def analyze_property():
    try:
        data = request.json
        roi = calculate_roi(
            float(data['purchasePrice']),
            float(data['rehabCost']),
            float(data['arv']),
            float(data['holdingCosts'])
        )
        return jsonify({"roi": roi}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/ask-ai', methods=['POST'])
def ask_ai():
    try:
        data = request.json
        property_details = data['property']
        question = data['question']

        prompt = f"""
        As a real estate investment expert, analyze this property and answer the following question:

        Property Details:
        - Address: {property_details['address']}
        - Price: ${property_details['price']}
        - Deal Type: {property_details['dealType']}
        - Description: {property_details.get('description', 'N/A')}

        Question: {question}

        Please provide a detailed analysis considering market conditions, potential risks, and opportunities.
        """

        response = model.generate_content(prompt)
        return jsonify({"response": response.text}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/advisor-requests', methods=['GET'])
def get_advisor_requests():
    try:
        requests_ref = db.collection('advisor_requests')
        requests = []
        for doc in requests_ref.stream():
            request_data = doc.to_dict()
            # Get property details
            property_doc = db.collection('properties').document(request_data['propertyId']).get()
            request_data['property'] = property_doc.to_dict()
            # Get user details
            user_doc = db.collection('users').document(request_data['userId']).get()
            request_data['user'] = user_doc.to_dict()
            requests.append(request_data)
        return jsonify(requests), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/advisor-requests', methods=['POST'])
def create_advisor_request():
    try:
        data = request.json
        doc_ref = db.collection('advisor_requests').document()
        data['id'] = doc_ref.id
        data['status'] = 'pending'
        data['createdAt'] = firestore.SERVER_TIMESTAMP
        doc_ref.set(data)
        return jsonify({"id": doc_ref.id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/advisor-requests/<request_id>', methods=['PUT'])
def update_advisor_request(request_id):
    try:
        data = request.json
        doc_ref = db.collection('advisor_requests').document(request_id)
        doc_ref.update(data)
        return jsonify({"success": True}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)