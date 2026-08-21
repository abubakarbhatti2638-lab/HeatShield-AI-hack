const client = require('./client');
const normalizer = require('./normalizer');

class EnvironmentalService {
  async getParameters(location) {
    const rawResponse = await client.request('get', `/environmental?location=${encodeURIComponent(location)}`);
    return normalizer.normalizeEnvironmental(location, rawResponse);
  }
}

module.exports = new EnvironmentalService();
