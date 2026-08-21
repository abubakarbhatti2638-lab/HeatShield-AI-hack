const client = require('./client');

class HeatIntelligenceService {
  async getIntelligence(location) {
    const rawResponse = await client.request('get', `/intelligence?location=${encodeURIComponent(location)}`);
    return {
      location_id: location,
      timestamp: new Date().toISOString(),
      urban_heat_island_index: rawResponse.uhi_index,
      cooling_score: rawResponse.cooling_score,
      vulnerable_demographics_impact: rawResponse.vulnerable_flag ? 'Severe' : 'Moderate',
      source: "FORTYGUARD"
    };
  }
}

module.exports = new HeatIntelligenceService();
