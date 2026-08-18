const alertService = require('../services/alertService');

exports.getAlerts = (req, res) => {
  try {
    const alerts = alertService.getAlerts();
    res.status(200).json({ success: true, data: alerts });
  } catch (error) {
    console.error('Alert Controller Error:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve alerts' });
  }
};
