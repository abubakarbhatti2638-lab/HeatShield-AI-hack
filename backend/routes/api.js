const express = require('express');
const router = express.Router();

const weatherController = require('../controllers/weatherController');
const heatRiskController = require('../controllers/heatRiskController');
const locationController = require('../controllers/locationController');
const chatController = require('../controllers/chatController');

// Health Check
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'HeatShield AI API is running' });
});

// System Status (FortyGuard connectivity)
const fortyguardStatus = require('../services/fortyguard/status');
router.get('/status', async (req, res) => {
  const status = await fortyguardStatus.checkStatus();
  res.status(200).json(status);
});

// Location Routes
router.get('/locations/search', locationController.searchLocations);

// Weather Routes
router.get('/weather', weatherController.getWeather);

// Heat Risk Routes
router.get('/heat-risk', heatRiskController.getHeatRisk);

// AI Chat Routes
router.post('/chat', chatController.askAssistant);

// Alerts Routes
const alertController = require('../controllers/alertController');
router.get('/alerts', alertController.getAlerts);

// Analytics Routes
const analyticsController = require('../controllers/analyticsController');
router.get('/analytics/trends', analyticsController.getAnalytics);

module.exports = router;
