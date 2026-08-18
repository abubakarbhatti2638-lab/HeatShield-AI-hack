const axios = require('axios');

class GeocodingService {
  async searchLocation(query) {
    try {
      const apiKey = process.env.OPENWEATHER_API_KEY;
      if (!apiKey) {
        throw new Error('OPENWEATHER_API_KEY environment variable is not set');
      }

      const url = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${apiKey}`;
      const response = await axios.get(url);
      
      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(loc => ({
        id: `${loc.lat}-${loc.lon}`, // OpenWeather geo doesn't return a unique ID, generating one
        name: loc.name,
        country: loc.country,
        admin1: loc.state, // state/province
        lat: loc.lat,
        lon: loc.lon
      }));
    } catch (error) {
      console.error('Error fetching geocoding data:', error.response?.data || error.message);
      throw new Error('Failed to search for location');
    }
  }
}

module.exports = new GeocodingService();
