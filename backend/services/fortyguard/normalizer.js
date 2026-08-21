class DataNormalizer {
  /**
   * Normalizes FortyGuard raw temperature response to internal schema
   */
  normalizeTemperature(locationId, rawData) {
    return {
      location_id: locationId,
      timestamp: new Date().toISOString(),
      temperature: rawData.raw_temp,
      humidity: rawData.raw_humidity,
      apparent_temperature: rawData.apparent,
      source: "FORTYGUARD"
    };
  }

  normalizeEnvironmental(locationId, rawData) {
    return {
      location_id: locationId,
      timestamp: new Date().toISOString(),
      wind_speed: rawData.wind_mps,
      uv_index: rawData.uv,
      solar_radiation: rawData.solar,
      source: "FORTYGUARD"
    };
  }
}

module.exports = new DataNormalizer();
