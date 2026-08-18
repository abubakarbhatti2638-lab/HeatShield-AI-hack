const heatRiskService = require('../services/heatRiskService');

describe('HeatRiskService', () => {
  it('should return LOW risk for cool temperatures', () => {
    const result = heatRiskService.calculateRisk(20, 20, 40, 10);
    expect(result.riskLevel).toBe('LOW');
    expect(result.score).toBeLessThan(30);
    expect(result.disclaimer).toBe("HeatShield AI Estimate (Not an official medical or government warning)");
  });

  it('should return MODERATE risk for warm temperatures', () => {
    const result = heatRiskService.calculateRisk(29, 30, 50, 10);
    expect(result.riskLevel).toBe('MODERATE');
    expect(result.score).toBeGreaterThanOrEqual(30);
    expect(result.score).toBeLessThan(60);
  });

  it('should return HIGH risk for hot temperatures', () => {
    const result = heatRiskService.calculateRisk(35, 38, 60, 4);
    expect(result.riskLevel).toBe('HIGH');
    expect(result.score).toBeGreaterThanOrEqual(60);
    expect(result.score).toBeLessThan(85);
    expect(result.mainFactors).toContain('Stagnant air (low wind speed) reducing cooling');
    expect(result.mainFactors).toContain('High core temperature (38.0°C)');
  });

  it('should return EXTREME risk for very hot temperatures', () => {
    const result = heatRiskService.calculateRisk(40, 49, 65, 5);
    expect(result.riskLevel).toBe('EXTREME');
    expect(result.score).toBeGreaterThanOrEqual(85);
    expect(result.mainFactors).toContain('High humidity (65%) prevents sweat evaporation');
  });

  it('should adjust risk for hot wind (hair dryer effect)', () => {
    const result = heatRiskService.calculateRisk(40, 42, 20, 25);
    expect(result.mainFactors).toContain('Hot wind (25 km/h) increasing heat stress');
    expect(result.mainFactors).toContain('Low humidity (20%) accelerates dehydration');
  });
  
  it('should output the correct disclaimer on all results', () => {
    const result = heatRiskService.calculateRisk(30, 32, 50, 10);
    expect(result.disclaimer).toBe("HeatShield AI Estimate (Not an official medical or government warning)");
  });
});
