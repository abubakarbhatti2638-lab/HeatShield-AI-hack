/**
 * AI Service Abstraction
 * Currently uses a heuristic-based mock engine to answer queries based on context.
 * Designed to be replaced with OpenAI/Gemini SDK calls in the future.
 */

class AIService {
  async generateResponse(query, context) {
    // Simulate network delay for API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const q = query.toLowerCase();
    
    // Provide a fallback if context isn't fully formed
    const locName = context?.location?.name || 'your current location';
    const risk = context?.heatRisk?.riskLevel || 'UNKNOWN';
    const temp = context?.weather?.temperature || '--';
    const apparent = context?.weather?.apparentTemperature || '--';
    const humidity = context?.weather?.humidity || '--';
    const wind = context?.weather?.windSpeed || '--';

    if (q.includes('what is the heat risk') || q.includes('current risk') || q.includes('how hot is it')) {
      return `Based on live data for **${locName}**, the current heat risk is **${risk}**. The actual temperature is ${temp}°C, but it feels like ${apparent}°C.`;
    }

    if (q.includes('why is the heat risk') || q.includes('why is it high') || q.includes('why is it extreme')) {
      if (!context.heatRisk?.explanation) {
        return `The risk is currently ${risk}. This is largely driven by the combination of ${temp}°C temperatures and ${humidity}% humidity.`;
      }
      return `The heat risk is evaluated as ${risk} because: \n\n"${context.heatRisk.explanation}" \n\nAdditional factors: ${context.heatRisk.mainFactors?.join('. ')}.`;
    }

    if (q.includes('humidity')) {
      if (humidity > 60) {
        return `The humidity in ${locName} is currently very high at **${humidity}%**. High humidity drastically reduces your body's ability to cool itself through sweating, making the ${temp}°C air feel much closer to ${apparent}°C.`;
      } else if (humidity < 30) {
        return `The humidity in ${locName} is currently low at **${humidity}%**. While this allows sweat to evaporate quickly, it drastically increases your risk of hidden dehydration.`;
      } else {
        return `The humidity in ${locName} is currently at a moderate **${humidity}%**. It is not significantly impacting the heat risk right now.`;
      }
    }

    if (q.includes('precautions') || q.includes('what should i do') || q.includes('safe') || q.includes('recommendation')) {
      if (context.heatRisk?.recommendations && context.heatRisk.recommendations.length > 0) {
        let recs = context.heatRisk.recommendations.map(r => `- ${r}`).join('\n');
        return `Given the **${risk}** risk level in ${locName}, HeatShield AI recommends the following:\n\n${recs}`;
      }
      return "Always stay hydrated, avoid strenuous activity during peak heat hours, and stay in air-conditioned environments if possible.";
    }

    if (q.includes('highest heat risk') || q.includes('hottest location')) {
      return "HeatShield AI currently analyzes locations on demand. Historically, dense urban corridors with low vegetation experience the highest 'Urban Heat Island' effects, resulting in localized extreme risk zones even when surrounding suburbs are cooler.";
    }

    // Default fallback
    return `I am analyzing the climate data for ${locName}. Currently it is ${temp}°C with ${humidity}% humidity, resulting in a **${risk}** risk level. Could you please specify your question regarding the heat risk, precautions, or specific weather factors?`;
  }
}

module.exports = new AIService();
