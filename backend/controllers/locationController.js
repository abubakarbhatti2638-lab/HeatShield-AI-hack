const geocodingService = require('../services/geocodingService');

exports.searchLocations = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === '') {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const locations = await geocodingService.searchLocation(q);
    
    res.json({
      success: true,
      data: locations
    });
  } catch (error) {
    console.error('Location Controller Error:', error);
    res.status(500).json({ error: 'Failed to search locations', details: error.message });
  }
};
