const client = require('./client');

class StatusService {
  async checkStatus() {
    try {
      await client.request('get', `/status`);
      return { status: 'OK', message: 'FortyGuard connection active', source: 'FORTYGUARD' };
    } catch (err) {
      return { status: 'ERROR', message: 'FortyGuard connection unavailable' };
    }
  }
}

module.exports = new StatusService();
