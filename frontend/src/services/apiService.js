import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const apiService = {
  getHealth: async () => {
    try {
      const response = await axios.get(`${API_URL}/health`);
      return response.data;
    } catch (error) {
      console.error("Health check failed", error);
      throw error;
    }
  },

  searchLocations: async (query) => {
    try {
      const response = await axios.get(`${API_URL}/locations/search`, { params: { q: query } });
      return response.data.data;
    } catch (error) {
      console.error("Location search failed", error);
      throw error;
    }
  },
  
  getWeather: async (lat, lon) => {
    try {
      const response = await axios.get(`${API_URL}/weather`, { params: { lat, lon } });
      return response.data.data;
    } catch (error) {
      console.error("Weather fetch failed", error);
      throw error;
    }
  },

  getHeatRisk: async (lat, lon) => {
    try {
      const response = await axios.get(`${API_URL}/heat-risk`, { params: { lat, lon } });
      return response.data.data;
    } catch (error) {
      console.error("Heat risk fetch failed", error);
      throw error;
    }
  },

  askAssistant: async (query, context) => {
    try {
      const response = await axios.post(`${API_URL}/chat`, { query, context });
      return response.data.data;
    } catch (error) {
      console.error("AI Assistant request failed", error);
      throw error;
    }
  },

  getAlerts: async () => {
    try {
      const response = await axios.get(`${API_URL}/alerts`);
      return response.data.data;
    } catch (error) {
      console.error("Alerts fetch failed", error);
      throw error;
    }
  },

  getAnalytics: async (location) => {
    try {
      const response = await axios.get(`${API_URL}/analytics/trends`, { params: { location } });
      return response.data.data;
    } catch (error) {
      console.error("Analytics fetch failed", error);
      throw error;
    }
  }
};

export default apiService;
