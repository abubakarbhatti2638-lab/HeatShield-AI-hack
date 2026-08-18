const weatherProvider = require('../services/weather/weatherProvider');
const heatRiskService = require('../services/heatRiskService');

exports.getHeatRisk = async (req, res) => {
  try {
    const { lat, lon } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    // Fetch current weather data to base the risk upon
    const weatherData = await weatherProvider.getCurrentWeather(lat, lon);
    
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
