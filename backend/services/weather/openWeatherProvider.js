const axios = require('axios');

class OpenWeatherProvider {
  async getCurrentWeather(lat, lon) {
    try {
      const apiKey = process.env.OPENWEATHER_API_KEY;
      if (!apiKey) {
        throw new Error('OPENWEATHER_API_KEY environment variable is not set');
      }

      // We use units=metric to get temperature in Celsius
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
      const response = await axios.get(url);
      
      const data = response.data;
      
      // OpenWeather provides wind speed in meter/sec when units=metric.
      // We convert it to km/h to match our Heat Risk engine requirements (m/s * 3.6 = km/h)
      const windSpeedKmh = data.wind.speed * 3.6;

      return {
        temperature: data.main.temp,
        apparentTemperature: data.main.feels_like,
        humidity: data.main.humidity,
        windSpeed: parseFloat(windSpeedKmh.toFixed(1)),
        timestamp: new Date(data.dt * 1000).toISOString(),
      };
    } catch (error) {
      console.error('Error fetching from OpenWeather:', error.response?.data || error.message);
      throw new Error('Failed to fetch OpenWeather data');
    }
  }
}

module.exports = new OpenWeatherProvider();
