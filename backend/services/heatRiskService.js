/**
 * Heat Risk Service
 * Analyzes weather data and returns risk score, level, explanation, main factors, and recommendations.
 */

class HeatRiskService {
  /**
   * Calculate heat risk
   * @param {number} temp - Temperature in Celsius
   * @param {number} apparentTemp - Feels-like temperature in Celsius
   * @param {number} humidity - Relative humidity percentage
   * @param {number} windSpeed - Wind speed in km/h
   */
  calculateRisk(temp, apparentTemp, humidity, windSpeed) {
    let score = 0;
    const effectiveTemp = apparentTemp || temp;
    let mainFactors = [];

    // Transparent Scoring Logic
    if (effectiveTemp < 27) {
      score = (effectiveTemp / 27) * 20; // 0-20
    } else if (effectiveTemp >= 27 && effectiveTemp < 32) {
      score = 20 + ((effectiveTemp - 27) / 5) * 20; // 20-40
    } else if (effectiveTemp >= 32 && effectiveTemp < 39) {
      score = 40 + ((effectiveTemp - 32) / 7) * 30; // 40-70
    } else if (effectiveTemp >= 39 && effectiveTemp < 51) {
      score = 70 + ((effectiveTemp - 39) / 12) * 20; // 70-90
    } else {
      score = 90 + Math.min(10, (effectiveTemp - 51)); // 90-100
    }

    if (effectiveTemp >= 32) {
      mainFactors.push(`High core temperature (${effectiveTemp.toFixed(1)}°C)`);
    }

    // Humidity adjustment
    if (humidity > 60) {
      if (!apparentTemp) score += 5; // Fallback if apparent temp wasn't provided
      mainFactors.push(`High humidity (${humidity}%) prevents sweat evaporation`);
    } else if (humidity < 30) {
      mainFactors.push(`Low humidity (${humidity}%) accelerates dehydration`);
    }

    // Wind adjustment
    if (windSpeed > 15 && effectiveTemp < 38) {
      score -= 3;
      mainFactors.push(`Cooling effect from wind (${windSpeed} km/h)`);
    } else if (windSpeed > 15 && effectiveTemp >= 38) {
      // Hot wind actually heats the body like a hair dryer
      score += 2;
      mainFactors.push(`Hot wind (${windSpeed} km/h) increasing heat stress`);
    } else if (windSpeed < 5) {
      mainFactors.push('Stagnant air (low wind speed) reducing cooling');
    }

    // Ensure score is between 0 and 100
    score = Math.max(0, Math.min(100, Math.round(score)));

    let riskLevel = 'LOW';
    let explanation = '';
    let recommendations = [];

    if (score < 30) {
      riskLevel = 'LOW';
      explanation = 'Current conditions pose little to no heat-related risk to the general public.';
      recommendations = [
        'Enjoy outdoor activities.',
        'Stay hydrated as usual.'
      ];
    } else if (score < 60) {
      riskLevel = 'MODERATE';
      explanation = 'Elevated temperatures may cause discomfort for sensitive individuals or during prolonged exposure.';
      recommendations = [
        'Drink plenty of water.',
        'Wear light, loose-fitting clothing.',
        'Limit strenuous outdoor activity during peak sun hours.'
      ];
    } else if (score < 85) {
      riskLevel = 'HIGH';
      explanation = 'High heat conditions. Prolonged exposure or physical activity may lead to heat exhaustion or heat stroke.';
      recommendations = [
        'Stay in air-conditioned areas if possible.',
        'Drink water frequently, even if not thirsty.',
        'Check on elderly neighbors and vulnerable individuals.',
        'Avoid strenuous outdoor activities.'
      ];
    } else {
      riskLevel = 'EXTREME';
      explanation = 'Dangerous heat conditions. High risk of heat stroke or other heat-related illnesses for anyone exposed to the heat.';
      recommendations = [
        'Immediate danger: Stay indoors in an air-conditioned environment.',
        'Do not leave children or pets in vehicles.',
        'Drink plenty of fluids.',
        'Seek medical attention immediately if experiencing symptoms of heat stroke.'
      ];
    }

    return {
      score,
      riskLevel,
      explanation,
      mainFactors,
      recommendations,
      disclaimer: "HeatShield AI Estimate (Not an official medical or government warning)"
    };
  }
}

module.exports = new HeatRiskService();
