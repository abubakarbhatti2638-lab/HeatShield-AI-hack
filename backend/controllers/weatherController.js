const fortyguardProvider = require('../services/fortyguard');

exports.getWeather = async (req, res) => {
  try {
    const { lat, lon } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const locationStr = `${lat},${lon}`;
    const tempRes = await fortyguardProvider.getTemperature(locationStr);
    const envRes = await fortyguardProvider.getEnvironmentalParameters(locationStr);
    
    // Map to the format frontend expects
    const weatherData = {
      temperature: tempRes.temperature,
      apparentTemperature: tempRes.apparent_temperature,
      humidity: tempRes.humidity,
      windSpeed: envRes.wind_speed,
      timestamp: tempRes.timestamp
    };

    res.json({
      success: true,
      data: weatherData
    });
  } catch (error) {
    console.error('Weather Controller Error:', error);
    res.status(500).json({ error: 'Failed to retrieve weather data', details: error.message });
  }
};
