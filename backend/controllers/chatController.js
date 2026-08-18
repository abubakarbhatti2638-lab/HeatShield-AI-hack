const aiService = require('../services/aiService');

const askAssistant = async (req, res) => {
  try {
    const { query, context } = req.body;

    if (!query) {
      return res.status(400).json({ success: false, error: 'Query is required' });
    }

    // Pass the query and context to the AI service
    const responseText = await aiService.generateResponse(query, context);

    res.status(200).json({
      success: true,
      data: {
        answer: responseText
      }
    });
  } catch (error) {
    console.error('AI Error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to generate AI response' });
  }
};

module.exports = {
  askAssistant
};
