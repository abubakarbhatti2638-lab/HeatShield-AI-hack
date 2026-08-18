const axios = require('axios');

class OpenMeteoProvider {
  async getCurrentWeather(lat, lon) {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,relative_humidity_2m,apparent_temperature&daily=temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min&timezone=auto`;
      const response = await axios.get(url);
      
      const current = response.data.current;
      
      return {
        temperature: current.temperature_2m,
        apparentTemperature: current.apparent_temperature,
        humidity: current.relative_humidity_2m,
        windSpeed: current.wind_speed_10m,
        timestamp: current.time,
        hourly: response.data.hourly.temperature_2m.slice(0, 24),
        daily: {
            max: response.data.daily.temperature_2m_max[0],
            min: response.data.daily.temperature_2m_min[0]
        }
      };
    } catch (error) {
      console.error('Error fetching from Open-Meteo:', error.message);
      throw new Error('Failed to fetch Open-Meteo weather data');
    }
  }
}

module.exports = new OpenMeteoProvider();
