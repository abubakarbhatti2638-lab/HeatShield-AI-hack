const client = require('./client');
const normalizer = require('./normalizer');

class TemperatureService {
  async getTemperature(location) {
    const rawResponse = await client.request('get', `/temperature?location=${encodeURIComponent(location)}`);
    return normalizer.normalizeTemperature(location, rawResponse);
  }
}

module.exports = new TemperatureService();
