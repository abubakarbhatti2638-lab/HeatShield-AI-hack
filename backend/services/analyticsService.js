/**
 * Analytics Service
 * Generates structured, highly realistic historical trend data.
 */

class AnalyticsService {
  getTrends(locationName = "Current Location") {
    const hourlyData = [];
    const now = new Date();
    
    // Generate 24 hours of realistic temperature curve data
    for (let i = 24; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 3600000);
      const hour = time.getHours();
      
      // Base temp curve (cooler at night, hot in afternoon)
      let baseTemp = 25;
      if (hour >= 6 && hour <= 15) {
        baseTemp = 25 + (hour - 6) * 1.5; // rising temp
      } else if (hour > 15 && hour <= 20) {
        baseTemp = 38.5 - (hour - 15) * 1.2; // cooling down
      } else if (hour > 20 || hour < 6) {
        baseTemp = 25 - Math.abs(3 - hour) * 0.2; // night cooling
      }

      // Add some random noise
      const temp = parseFloat((baseTemp + (Math.random() * 1.5 - 0.75)).toFixed(1));
      
      // Simulate humidity inversely proportional to temp
      const humidity = Math.floor(80 - (temp - 20) * 1.5 + (Math.random() * 5 - 2.5));
      
      // Calculate apparent temperature
      const apparentTemp = parseFloat((temp + (humidity > 50 ? (humidity - 50) * 0.2 : 0)).toFixed(1));
      
      let riskScore = (apparentTemp / 45) * 100;
      riskScore = Math.min(100, Math.max(0, riskScore + (Math.random() * 5 - 2.5)));

      hourlyData.push({
        timestamp: time.toISOString(),
        timeLabel: `${hour.toString().padStart(2, '0')}:00`,
        temperature: temp,
        apparentTemperature: apparentTemp,
        humidity: Math.max(10, Math.min(100, humidity)),
        riskScore: Math.floor(riskScore)
      });
    }

    // Generate location comparison
    const comparisonData = [
      { city: locationName, avgTemp: 32.4, peakTemp: 38.5, avgRisk: 65 },
      { city: 'Dubai', avgTemp: 39.1, peakTemp: 46.2, avgRisk: 88 },
      { city: 'London', avgTemp: 22.5, peakTemp: 28.0, avgRisk: 30 },
      { city: 'Phoenix', avgTemp: 36.8, peakTemp: 43.1, avgRisk: 75 },
      { city: 'Singapore', avgTemp: 31.0, peakTemp: 33.5, avgRisk: 60 }
    ];

    return {
      trends24h: hourlyData,
      comparison: comparisonData,
      isDemoData: true // Emphasize that this is demo data
    };
  }
}

module.exports = new AnalyticsService();
