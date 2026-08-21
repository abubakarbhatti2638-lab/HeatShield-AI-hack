const { GoogleGenAI } = require('@google/genai');

/**
 * AI Service Abstraction
 * Uses Google Gemini API to answer queries based on context.
 */

class AIService {
  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not set. AI features may not work.");
    } else {
      this.ai = new GoogleGenAI({ apiKey: apiKey });
    }
  }

  async generateResponse(query, context) {
    if (!this.ai) {
      return "AI service is currently unavailable because GEMINI_API_KEY is missing. Please set it in your .env file.";
    }

    try {
      const locName = context?.location?.name || 'unknown location';
      const risk = context?.heatRisk?.riskLevel || 'UNKNOWN';
      const temp = context?.weather?.temperature || '--';
      const apparent = context?.weather?.apparentTemperature || '--';
      const humidity = context?.weather?.humidity || '--';
      const wind = context?.weather?.windSpeed || '--';

      const systemPrompt = `You are HeatShield AI, an intelligent assistant designed to provide safety advice and information about heat risks. 
Use the following context to answer the user's query clearly and concisely.
Context:
- Location: ${locName}
- Current Heat Risk Level: ${risk}
- Temperature: ${temp}°C
- Apparent Temperature (Feels Like): ${apparent}°C
- Humidity: ${humidity}%
- Wind Speed: ${wind} km/h
${context?.heatRisk?.explanation ? '- Risk Explanation: ' + context.heatRisk.explanation : ''}
${context?.heatRisk?.recommendations ? '- Recommendations: ' + context.heatRisk.recommendations.join(', ') : ''}`;

      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [{ text: `${systemPrompt}\n\nUser Query: ${query}` }] }
        ],
      });

      return response.text;
    } catch (error) {
      console.error('Error generating AI response:', error);
      return "Sorry, I am having trouble connecting to the AI service right now. Please try again later.";
    }
  }
}

module.exports = new AIService();
