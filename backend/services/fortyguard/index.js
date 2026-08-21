const temperature = require('./temperature');
const environmental = require('./environmental');
const heatmap = require('./heatmap');
const heatIntelligence = require('./heatIntelligence');
const status = require('./status');

// Helper to wrap old mock data into the new normalized format (temp until fully implemented)
const wrapResponse = (data) => ({
  data,
  metadata: { timestamp: new Date().toISOString(), source: 'FORTYGUARD' }
});

class FortyGuardFacade {
  async getTemperature(location) { return await temperature.getTemperature(location); }
  async getEnvironmentalParameters(location) { return await environmental.getParameters(location); }
  async getHeatmap(location) { return await heatmap.getHeatmap(location); }
  async getHeatIntelligence(location) { return await heatIntelligence.getIntelligence(location); }
  
  // Stubs for remaining tools (they belong in risk.js, alerts.js, etc.)
  async getTemperatureHistory(location) {
    return wrapResponse({ location, history: [{ time: 'T-1h', temperature: 33 }] });
  }
  async getTemperatureForecast(location) {
    return wrapResponse({ location, forecast: [{ time: 'T+1h', temperature: 35 }] });
  }
  async getLocationDetails(location) {
    return wrapResponse({ location, type: 'Urban Center' });
  }
  async calculateHeatRisk(location) {
    const temp = await this.getTemperature(location);
    return wrapResponse({ location, riskLevel: temp.temperature > 35 ? 'HIGH' : 'LOW' });
  }
  async compareLocations(locations) {
    return wrapResponse({ comparison: locations.map(l => ({ location: l, riskLevel: 'HIGH' })) });
  }
  async analyzeTemperatureTrend(location) {
    return wrapResponse({ location, trend: 'Rising rapidly' });
  }
  async createAlert(location, riskLevel, message) {
    return wrapResponse({ id: 'ALT-1', location, riskLevel, message });
  }
  async createResponsePlan(location, riskLevel) {
    return wrapResponse({ location, riskLevel, responsePlan: ['Hydrate', 'Monitor'] });
  }
  async saveIncident(location, description) {
    return wrapResponse({ id: 'INC-1', location, description });
  }
  async getActiveIncidents() {
    return wrapResponse({ activeIncidents: [] });
  }
  async acknowledgeAlert(alertId) {
    return wrapResponse({ success: true, alertId });
  }
}

module.exports = new FortyGuardFacade();
