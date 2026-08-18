const analyticsService = require('../services/analyticsService');

exports.getAnalytics = (req, res) => {
  try {
    const { location } = req.query;
    const analyticsData = analyticsService.getTrends(location || "Current Location");
    
    res.status(200).json({ success: true, data: analyticsData });
  } catch (error) {
    console.error('Analytics Controller Error:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve analytics data' });
  }
};
