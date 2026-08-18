/**
 * Alert Service
 * Generates mock historical alerts and creates new live alerts if risk is HIGH/EXTREME.
 */

class AlertService {
  constructor() {
    this.mockAlerts = [
      {
        id: 'al-1',
        severity: 'CRITICAL',
        location: 'Dubai, UAE',
        temperature: 46.5,
        riskLevel: 'EXTREME',
        time: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
        explanation: 'Extreme heat combining with 60% humidity creating life-threatening conditions.',
        recommendedAction: 'Immediate danger. Cease all outdoor activities. Stay in air-conditioned environments.'
      },
      {
        id: 'al-2',
        severity: 'WARNING',
        location: 'Phoenix, USA',
        temperature: 42.1,
        riskLevel: 'HIGH',
        time: new Date(Date.now() - 3600000 * 5).toISOString(), // 5 hours ago
        explanation: 'Prolonged high temperatures with very low humidity increasing dehydration risks.',
        recommendedAction: 'Drink water frequently. Limit outdoor exposure.'
      },
      {
        id: 'al-3',
        severity: 'CRITICAL',
        location: 'New Delhi, India',
        temperature: 44.0,
        riskLevel: 'EXTREME',
        time: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
        explanation: 'Severe heatwave causing grid strain and extreme apparent temperatures.',
        recommendedAction: 'Stay indoors. Check on vulnerable populations.'
      }
    ];
  }

  getAlerts() {
    return this.mockAlerts.sort((a, b) => new Date(b.time) - new Date(a.time));
  }
}

module.exports = new AlertService();
