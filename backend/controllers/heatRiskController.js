const fortyguardProvider = require('../services/fortyguard');
const heatRiskService = require('../services/heatRiskService');

exports.getHeatRisk = async (req, res) => {
  try {
    const { lat, lon } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    // Fetch current data to base the risk upon
    const locationStr = `${lat},${lon}`;
    const tempRes = await fortyguardProvider.getTemperature(locationStr);
    const envRes = await fortyguardProvider.getEnvironmentalParameters(locationStr);
    
    const weatherData = {
      temperature: tempRes.temperature,
      apparentTemperature: tempRes.apparent_temperature,
      humidity: tempRes.humidity,
      windSpeed: envRes.wind_speed,
      timestamp: tempRes.timestamp
    };
    
    // Calculate heat risk
    const riskAnalysis = heatRiskService.calculateRisk(
      weatherData.temperature,
      weatherData.apparentTemperature,
      weatherData.humidity,
      weatherData.windSpeed
    );

    res.json({
      success: true,
      data: {
        location: { lat, lon },
        weather: {
          temperature: weatherData.temperature,
          apparentTemperature: weatherData.apparentTemperature,
          humidity: weatherData.humidity,
          windSpeed: weatherData.windSpeed,
          timestamp: weatherData.timestamp
        },
        riskAnalysis
      }
    });
  } catch (error) {
    console.error('Heat Risk Controller Error:', error);
    res.status(500).json({ error: 'Failed to analyze heat risk', details: error.message });
  }
};
