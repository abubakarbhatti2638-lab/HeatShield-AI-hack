const weatherProvider = require('../services/weather/weatherProvider');

exports.getWeather = async (req, res) => {
  try {
    const { lat, lon } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    const weatherData = await weatherProvider.getCurrentWeather(lat, lon);
    
    res.json({
      success: true,
      data: weatherData
    });
  } catch (error) {
    console.error('Weather Controller Error:', error);
    res.status(500).json({ error: 'Failed to retrieve weather data', details: error.message });
  }
};
