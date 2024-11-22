import { useState } from "react";
import { Brain, X } from "lucide-react";
import type { Property } from "../types";

interface AskAIModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
}

export default function AskAIModal({
  property,
  isOpen,
  onClose,
}: AskAIModalProps) {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/ask-ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          property,
          question,
        }),
      });

      if (!response.ok) throw new Error("Failed to get AI response");

      const data = await response.json();
      setResponse(data.response);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to get AI response"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="relative bg-white rounded-xl max-w-2xl w-full p-8 shadow-2xl">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-indigo-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">
                AI Property Analysis
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Property Details
            </h3>
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Address</p>
                  <p className="text-gray-900">{property.address}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Price</p>
                  <p className="text-gray-900">
                    ${property.price.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Deal Type</p>
                  <p className="text-gray-900">{property.dealType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">IQ Score</p>
                  <p className="text-gray-900">{property.iqScore}/10</p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Question
              </label>
              <textarea
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Ask about investment potential, market analysis, or specific concerns..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-3"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Analyzing...
                </span>
              ) : (
                "Get AI Analysis"
              )}
            </button>
          </form>

          {response && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                AI Analysis
              </h3>
              <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-xl">
                <div className="prose prose-indigo">
                  {response.split("\n").map((paragraph, index) => (
                    <p key={index} className="text-gray-700 mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
