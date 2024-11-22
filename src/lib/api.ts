const API_URL = 'http://localhost:5000/api';

export const api = {
  async getProperties() {
    const response = await fetch(`${API_URL}/properties`);
    if (!response.ok) throw new Error('Failed to fetch properties');
    return response.json();
  },

  async addProperty(data: any) {
    const response = await fetch(`${API_URL}/properties`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to add property');
    return response.json();
  },

  async getAdvisorRequests() {
    const response = await fetch(`${API_URL}/advisor-requests`);
    if (!response.ok) throw new Error('Failed to fetch advisor requests');
    return response.json();
  },

  async createAdvisorRequest(data: any) {
    const response = await fetch(`${API_URL}/advisor-requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create advisor request');
    return response.json();
  },

  async updateAdvisorRequest(requestId: string, data: any) {
    const response = await fetch(`${API_URL}/advisor-requests/${requestId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update advisor request');
    return response.json();
  },
};