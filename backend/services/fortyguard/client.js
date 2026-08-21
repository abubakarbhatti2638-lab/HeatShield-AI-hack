const axios = require('axios');

class FortyGuardClient {
  constructor() {
    this.apiKey = process.env.FORTYGUARD_API_KEY;
    this.baseURL = 'https://api.fortyguard.com/v1'; // Simulated
  }

  async request(method, endpoint, data = null, options = {}) {
    if (!this.apiKey) {
      throw new Error("FORTYGUARD_API_KEY is not set.");
    }

    const maxRetries = options.maxRetries || 3;
    const timeout = options.timeout || 10000;
    
    let attempt = 0;
    while (attempt < maxRetries) {
      try {
        // If we had a real API, we'd use axios here.
        // For the hackathon MVP without endpoints, we simulate a network request.
        console.log(`[FortyGuard API] ${method.toUpperCase()} ${endpoint} (Attempt ${attempt + 1})`);
        
        // Simulating network delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Return mock data based on the endpoint, this will be replaced with:
        // const response = await axios({ method, url: `${this.baseURL}${endpoint}`, headers: { Authorization: `Bearer ${this.apiKey}` }, data, timeout });
        // return response.data;
        
        return this._generateMockResponse(endpoint, data);

      } catch (error) {
        attempt++;
        if (attempt >= maxRetries) {
          throw new Error(`FortyGuard API request failed after ${maxRetries} attempts: ${error.message}`);
        }
        // Exponential backoff
        const backoff = Math.pow(2, attempt) * 500;
        console.warn(`[FortyGuard API] Retry ${attempt} in ${backoff}ms...`);
        await new Promise(resolve => setTimeout(resolve, backoff));
      }
    }
  }

  async pollActivity(activityId, options = {}) {
    const maxPolls = options.maxPolls || 10;
    const pollInterval = options.pollInterval || 2000;
    
    let polls = 0;
    while (polls < maxPolls) {
      // Simulate polling status
      console.log(`[FortyGuard API] Polling activity ${activityId} (Poll ${polls + 1})`);
      await new Promise(resolve => setTimeout(resolve, pollInterval));
      
      // Randomly resolve after a few polls
      if (polls > 1 || Math.random() > 0.5) {
        return { status: 'COMPLETED', result_url: `/results/${activityId}` };
      }
      polls++;
    }
    throw new Error(`Polling timeout for activity ${activityId}`);
  }

  _generateMockResponse(endpoint, data) {
    if (endpoint.includes('/temperature')) {
      return { raw_temp: 40 + Math.random() * 3, raw_humidity: 45 + Math.random() * 10, apparent: 43 };
    }
    if (endpoint.includes('/environmental')) {
      return { wind_mps: 5, uv: 9, solar: 850 };
    }
    if (endpoint.includes('/heatmap')) {
      return { heatmap_url: 'https://api.fortyguard.com/v1/assets/heat_map_123.png', bounds: [25, 55, 25.1, 55.1] };
    }
    if (endpoint.includes('/intelligence')) {
      return { uhi_index: 0.8, cooling_score: 45, vulnerable_flag: true };
    }
    return { success: true };
  }
}

module.exports = new FortyGuardClient();
