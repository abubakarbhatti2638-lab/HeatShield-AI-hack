const { GoogleGenAI } = require('@google/genai');
const fortyguardProvider = require('./fortyguard'); // Uses fortyguard/index.js

/**
 * AI Service with Tool Calling (Agentic capabilities)
 * Uses Google Gemini API and real FortyGuard API data.
 */
class AIService {
  constructor() {
    const apiKey = process.env.LLM_API_KEY;
    if (!apiKey) {
      console.warn("LLM_API_KEY is not set. AI features may not work.");
    } else {
      this.ai = new GoogleGenAI({ apiKey: apiKey });
    }
    this.modelName = 'gemini-2.5-flash';
  }

  // Definition of the tools available to the AI agent
  getToolDefinitions() {
    return [
      {
        name: 'get_temperature',
        description: 'Get real-time temperature data for a location.',
        parameters: { type: 'OBJECT', properties: { location: { type: 'STRING' } }, required: ['location'] }
      },
      {
        name: 'get_environmental_parameters',
        description: 'Get humidity, wind speed, solar radiation, and UV index.',
        parameters: { type: 'OBJECT', properties: { location: { type: 'STRING' } }, required: ['location'] }
      },
      {
        name: 'get_heatmap',
        description: 'Get a heatmap URL and bounds for a location.',
        parameters: { type: 'OBJECT', properties: { location: { type: 'STRING' } }, required: ['location'] }
      },
      {
        name: 'get_heat_intelligence',
        description: 'Get heat intelligence (urban heat island effect, etc) for a location.',
        parameters: { type: 'OBJECT', properties: { location: { type: 'STRING' } }, required: ['location'] }
      },
      {
        name: 'get_temperature_history',
        description: 'Get recent temperature history for a location.',
        parameters: { type: 'OBJECT', properties: { location: { type: 'STRING' } }, required: ['location'] }
      },
      {
        name: 'get_temperature_forecast',
        description: 'Get upcoming temperature forecast for a location.',
        parameters: { type: 'OBJECT', properties: { location: { type: 'STRING' } }, required: ['location'] }
      },
      {
        name: 'get_location_details',
        description: 'Get details about a location (type, population density, green space).',
        parameters: { type: 'OBJECT', properties: { location: { type: 'STRING' } }, required: ['location'] }
      },
      {
        name: 'calculate_heat_risk',
        description: 'Calculate the heat risk level and score for a location.',
        parameters: { type: 'OBJECT', properties: { location: { type: 'STRING' } }, required: ['location'] }
      },
      {
        name: 'compare_locations',
        description: 'Compare multiple locations and return them sorted by highest heat risk.',
        parameters: { type: 'OBJECT', properties: { locations: { type: 'ARRAY', items: { type: 'STRING' } } }, required: ['locations'] }
      },
      {
        name: 'analyze_temperature_trend',
        description: 'Analyze if the temperature is rising or falling rapidly.',
        parameters: { type: 'OBJECT', properties: { location: { type: 'STRING' } }, required: ['location'] }
      },
      {
        name: 'create_alert',
        description: 'Create an alert for a specific location.',
        parameters: { type: 'OBJECT', properties: { location: { type: 'STRING' }, risk_level: { type: 'STRING' }, message: { type: 'STRING' } }, required: ['location', 'risk_level', 'message'] }
      },
      {
        name: 'create_response_plan',
        description: 'Create a step-by-step response plan for high heat conditions.',
        parameters: { type: 'OBJECT', properties: { location: { type: 'STRING' }, risk_level: { type: 'STRING' } }, required: ['location', 'risk_level'] }
      },
      {
        name: 'save_incident',
        description: 'Record a heat-related incident at a location.',
        parameters: { type: 'OBJECT', properties: { location: { type: 'STRING' }, description: { type: 'STRING' } }, required: ['location', 'description'] }
      },
      {
        name: 'get_active_incidents',
        description: 'Get a list of all currently active heat incidents.',
        parameters: { type: 'OBJECT', properties: {} }
      },
      {
        name: 'acknowledge_alert',
        description: 'Acknowledge an active alert by its ID.',
        parameters: { type: 'OBJECT', properties: { alert_id: { type: 'STRING' } }, required: ['alert_id'] }
      }
    ];
  }

  // Execute the tool locally based on the function name
  async executeTool(name, args) {
    switch (name) {
      case 'get_temperature': return await fortyguardProvider.getTemperature(args.location);
      case 'get_environmental_parameters': return await fortyguardProvider.getEnvironmentalParameters(args.location);
      case 'get_heatmap': return await fortyguardProvider.getHeatmap(args.location);
      case 'get_heat_intelligence': return await fortyguardProvider.getHeatIntelligence(args.location);
      case 'get_temperature_history': return await fortyguardProvider.getTemperatureHistory(args.location);
      case 'get_temperature_forecast': return await fortyguardProvider.getTemperatureForecast(args.location);
      case 'get_location_details': return await fortyguardProvider.getLocationDetails(args.location);
      case 'calculate_heat_risk': return await fortyguardProvider.calculateHeatRisk(args.location);
      case 'compare_locations': return await fortyguardProvider.compareLocations(args.locations);
      case 'analyze_temperature_trend': return await fortyguardProvider.analyzeTemperatureTrend(args.location);
      case 'create_alert': return await fortyguardProvider.createAlert(args.location, args.risk_level, args.message);
      case 'create_response_plan': return await fortyguardProvider.createResponsePlan(args.location, args.risk_level);
      case 'save_incident': return await fortyguardProvider.saveIncident(args.location, args.description);
      case 'get_active_incidents': return await fortyguardProvider.getActiveIncidents();
      case 'acknowledge_alert': return await fortyguardProvider.acknowledgeAlert(args.alert_id);
      default: throw new Error(`Unknown tool: ${name}`);
    }
  }

  async generateResponse(query, context) {
    if (!this.ai) {
      return { 
        actions: [], 
        response: "AI service is currently unavailable because LLM_API_KEY is missing. Please set it in your .env file." 
      };
    }

    const actions = [];
    const systemPrompt = `You are HeatShield AI, an intelligent agent designed to provide safety advice and information about heat risks using real FortyGuard API data. You MUST use the provided tools to retrieve real data. Do not invent temperatures or risks. Always base your answers on retrieved data.`;

    const chatSession = this.ai.chats.create({
      model: this.modelName,
      config: {
        systemInstruction: systemPrompt,
        tools: [{ functionDeclarations: this.getToolDefinitions() }],
      }
    });

    try {
      let response = await chatSession.sendMessage(query);

      // Agent Loop: keep running as long as the model calls a tool
      while (response.functionCalls && response.functionCalls.length > 0) {
        const functionResponses = [];
        
        for (const call of response.functionCalls) {
          console.log(`[AI Agent] Calling tool: ${call.name}`, call.args);
          actions.push({ tool: call.name, args: call.args, timestamp: new Date().toISOString() });
          
          try {
            const apiResponse = await this.executeTool(call.name, call.args);
            functionResponses.push({
              id: call.id,
              name: call.name,
              response: apiResponse
            });
          } catch (err) {
            console.error(`[AI Agent] Tool ${call.name} failed:`, err);
            functionResponses.push({
              id: call.id,
              name: call.name,
              response: { error: err.message }
            });
          }
        }

        // Send the tool results back to the model
        response = await chatSession.sendMessage(functionResponses);
      }

      return { actions, response: response.text };
    } catch (error) {
      console.error('[AI Agent] Error in agent loop:', error);
      return { 
        actions, 
        response: "Sorry, I encountered an error while trying to process your request." 
      };
    }
  }
}

module.exports = new AIService();
