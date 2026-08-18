const openMeteoProvider = require('./openMeteoProvider');
const openWeatherProvider = require('./openWeatherProvider');

class WeatherProvider {
  constructor() {
    this.provider = process.env.WEATHER_PROVIDER || 'openweather';
  }

  async getCurrentWeather(lat, lon) {
    if (this.provider === 'openweather') {
      return await openWeatherProvider.getCurrentWeather(lat, lon);
    } else if (this.provider === 'open-meteo') {
      return await openMeteoProvider.getCurrentWeather(lat, lon);
    } else if (this.provider === 'fortyguard') {
      throw new Error('FortyGuard integration not yet implemented');
    }
    throw new Error(`Unsupported weather provider: ${this.provider}`);
  }
}

module.exports = new WeatherProvider();
