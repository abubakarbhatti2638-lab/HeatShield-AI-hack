import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Component to dynamically change map center
const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 13, {
      duration: 1.5
    });
  }, [center, map]);
  return null;
};

const MapWrapper = ({ center, geoData }) => {
  const [mapKey, setMapKey] = useState(Date.now()); // Used to force GeoJSON re-render when data changes

  useEffect(() => {
    setMapKey(Date.now());
  }, [geoData]);

  // Styling function for the GeoJSON features
  const getRiskColor = (level) => {
    switch (level) {
      case 'LOW': return '#10b981'; // success
      case 'MODERATE': return '#f59e0b'; // warning
      case 'HIGH': return '#f97316'; // primary (orange)
      case 'EXTREME': return '#ef4444'; // danger (red)
      default: return '#3b82f6';
    }
  };

  const pointToLayer = (feature, latlng) => {
    const { temperature, riskLevel, radius } = feature.properties;
    const color = getRiskColor(riskLevel);

    // Create a circular marker representing a heat zone
    return L.circle(latlng, {
      radius: radius || 800,
      fillColor: color,
      fillOpacity: 0.4,
      color: color,
      weight: 1,
      opacity: 0.8
    }).bindTooltip(
      `
      <div style="background: #141419; color: white; padding: 8px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); font-family: sans-serif;">
        <div style="font-size: 18px; font-weight: bold; color: ${color};">${temperature}°C</div>
        <div style="font-size: 12px; color: #9ca3af; margin-top: 4px; text-transform: uppercase;">Risk: ${riskLevel}</div>
      </div>
      `,
      { direction: 'top', className: 'custom-leaflet-tooltip' }
    );
  };

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden relative" style={{ zIndex: 0 }}>
      {/* Inject custom tooltip CSS globally for Leaflet */}
      <style>{`
        .custom-leaflet-tooltip {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
        }
        .custom-leaflet-tooltip::before {
          display: none !important;
        }
        .leaflet-container {
          background-color: #0a0a0c !important; /* Match app background to prevent white flashes */
        }
      `}</style>

      <MapContainer 
        center={center} 
        zoom={13} 
        style={{ width: '100%', height: '100%' }}
        zoomControl={false} // Disable default zoom to add it elsewhere or keep UI clean
      >
        <MapUpdater center={center} />
        
        {/* Professional Dark Theme Map Tiles from CartoDB */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          maxZoom={20}
        />

        {geoData && (
          <GeoJSON 
            key={mapKey}
            data={geoData} 
            pointToLayer={pointToLayer}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default MapWrapper;
