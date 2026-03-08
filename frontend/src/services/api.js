const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:8000/api' 
  : '/api';

export const api = {
  get: async (endpoint) => {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`);
      if (!response.ok) throw new Error('API Request Failed');
      return await response.json();
    } catch (err) {
      console.error('API GET Error:', err);
      throw err;
    }
  },
  post: async (endpoint, data) => {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('API Request Failed');
      return await response.json();
    } catch (err) {
      console.error('API POST Error:', err);
      throw err;
    }
  },
  put: async (endpoint, data) => {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
         method: 'PUT',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('API Request Failed');
      return await response.json();
    } catch (err) {
      console.error('API PUT Error:', err);
      throw err;
    }
  },
  patch: async (endpoint, data) => {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
         method: 'PATCH',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('API Request Failed');
      return await response.json();
    } catch (err) {
      console.error('API PATCH Error:', err);
      throw err;
    }
  }
};
