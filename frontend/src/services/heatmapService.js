/**
 * Heat Map Service
 * Abstraction layer for Heat Map Data.
 * Currently generates mock GeoJSON data around a center coordinate.
 * Designed to easily swap to FortyGuard API or similar later.
 */

const heatmapService = {
  /**
   * Fetches/Generates GeoJSON heatmap data for a given location
   * @param {number} centerLat 
   * @param {number} centerLon 
   * @param {number} baseTemp 
   * @returns {Promise<Object>} GeoJSON FeatureCollection
   */
  getHeatmapData: async (centerLat, centerLon, baseTemp = 35) => {
    // In a real implementation, this would be:
    // return axios.get(`https://api.fortyguard.com/heatmap?lat=${centerLat}&lon=${centerLon}`)
    
    // Simulating API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const features = [];
    
    // Generate 30 random heat zones around the center
    for (let i = 0; i < 30; i++) {
      // Random offset within roughly 5-10km
      const latOffset = (Math.random() - 0.5) * 0.1;
      const lonOffset = (Math.random() - 0.5) * 0.1;
      
      const lat = centerLat + latOffset;
      const lon = centerLon + lonOffset;
      
      // Random temperature variation (-3 to +7 from base temp)
      const temp = parseFloat((baseTemp + (Math.random() * 10 - 3)).toFixed(1));
      
      // Calculate risk level based on standard thresholds
      let riskLevel = 'LOW';
      if (temp >= 27 && temp < 32) riskLevel = 'MODERATE';
      else if (temp >= 32 && temp < 39) riskLevel = 'HIGH';
      else if (temp >= 39) riskLevel = 'EXTREME';

      features.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [lon, lat] // GeoJSON requires [longitude, latitude]
        },
        properties: {
          temperature: temp,
          riskLevel: riskLevel,
          radius: Math.floor(Math.random() * 800) + 400 // Radius in meters
        }
      });
    }

    // Add a big extreme zone right near the center sometimes for visual effect
    features.push({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [centerLon + 0.01, centerLat + 0.01]
      },
      properties: {
        temperature: parseFloat((baseTemp + 5).toFixed(1)),
        riskLevel: baseTemp + 5 >= 39 ? 'EXTREME' : 'HIGH',
        radius: 1500
      }
    });

    return {
      type: 'FeatureCollection',
      features: features
    };
  }
};

export default heatmapService;
