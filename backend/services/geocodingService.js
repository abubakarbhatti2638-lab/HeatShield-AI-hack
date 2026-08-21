const axios = require('axios');

class GeocodingService {
  async searchLocation(query) {
    try {
      // Using Nominatim (OpenStreetMap) for geocoding since OpenWeather is removed.
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5`;
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'HeatShield-AI-Hackathon'
        }
      });
      
      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(loc => ({
        id: loc.place_id.toString(),
        name: loc.name,
        country: loc.display_name.split(',').pop().trim(), // basic extraction
        admin1: '', // Not always clean in Nominatim display_name, leaving blank or parsing could be complex
        lat: parseFloat(loc.lat),
        lon: parseFloat(loc.lon)
      }));
    } catch (error) {
      console.error('Error fetching geocoding data from Nominatim:', error.message);
      throw new Error('Failed to search for location');
    }
  }
}

module.exports = new GeocodingService();
