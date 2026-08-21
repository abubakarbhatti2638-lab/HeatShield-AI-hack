const client = require('./client');

class HeatmapService {
  async getHeatmap(location) {
    const rawResponse = await client.request('get', `/heatmap?location=${encodeURIComponent(location)}`);
    return {
      location_id: location,
      timestamp: new Date().toISOString(),
      heatmap_url: rawResponse.heatmap_url,
      bounds: rawResponse.bounds,
      source: "FORTYGUARD"
    };
  }
}

module.exports = new HeatmapService();
