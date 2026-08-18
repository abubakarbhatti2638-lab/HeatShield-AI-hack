import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Layers } from 'lucide-react';
import apiService from '../services/apiService';
import heatmapService from '../services/heatmapService';
import MapWrapper from '../components/MapWrapper';

const HeatMap = () => {
  const [selectedLocation, setSelectedLocation] = useState({ name: 'London', lat: 51.5085, lon: -0.1257, country: 'United Kingdom' });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const [geoData, setGeoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Fetch GeoJSON data when location changes
  useEffect(() => {
    const fetchHeatmap = async () => {
      setLoading(true);
      try {
        // First get current base temp for realism, fallback to 35 if error
        let baseTemp = 35;
        try {
          const weather = await apiService.getWeather(selectedLocation.lat, selectedLocation.lon);
          if (weather && weather.temperature) {
            baseTemp = weather.temperature;
          }
        } catch(e) {
          console.warn("Could not fetch base weather, using default for heatmap", e);
        }

        const data = await heatmapService.getHeatmapData(selectedLocation.lat, selectedLocation.lon, baseTemp);
        setGeoData(data);
      } catch (err) {
        console.error("Failed to load heatmap data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchHeatmap();
  }, [selectedLocation]);

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim().length > 2) {
      try {
        const results = await apiService.searchLocations(query);
        setSearchResults(results);
        setShowDropdown(true);
      } catch (err) {
        console.error("Search failed");
      }
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  };

  const handleSelectLocation = (loc) => {
    setSelectedLocation(loc);
    setSearchQuery('');
    setShowDropdown(false);
  };

  return (
    <div className="space-y-4 h-[calc(100vh-8rem)] flex flex-col relative z-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-20">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            Urban Heat Map
            {loading && <span className="flex h-3 w-3 relative ml-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
            </span>}
          </h2>
          <p className="text-gray-400 text-sm">Interactive urban climate intelligence</p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-80" ref={searchRef}>
          <div className="glass-card rounded-xl p-1 flex items-center">
            <Search className="text-gray-400 ml-3 mr-2 shrink-0" size={18} />
            <input 
              type="text"
              placeholder={`Search location (e.g. ${selectedLocation.name})`}
              value={searchQuery}
              onChange={handleSearch}
              onFocus={() => { if(searchResults.length > 0) setShowDropdown(true); }}
              className="bg-transparent text-white border-none focus:ring-0 outline-none w-full py-1.5 text-sm"
            />
          </div>
          
          {showDropdown && searchResults.length > 0 && (
            <div className="absolute top-full mt-2 w-full glass-card max-h-60 overflow-y-auto z-50 rounded-xl py-2 shadow-2xl">
              {searchResults.map((loc) => (
                <div 
                  key={loc.id} 
                  onClick={() => handleSelectLocation(loc)}
                  className="px-4 py-2 hover:bg-white/10 cursor-pointer flex items-center space-x-2"
                >
                  <MapPin size={14} className="text-primary shrink-0" />
                  <div>
                    <div className="text-white text-sm font-medium">{loc.name}</div>
                    <div className="text-gray-500 text-xs">{loc.admin1 ? `${loc.admin1}, ` : ''}{loc.country}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 rounded-2xl overflow-hidden relative border border-white/10 shadow-2xl z-0">
         {/* The Map Component */}
         <MapWrapper center={[selectedLocation.lat, selectedLocation.lon]} geoData={geoData} />

         {/* Overlay Controls */}
         <div className="absolute top-4 right-4 p-3 flex flex-col space-y-3" style={{ zIndex: 400 }}>
           <button className="p-2 glass-card rounded-lg text-white hover:bg-white/10 transition" title="Toggle Layers">
             <Layers size={20} />
           </button>
         </div>

         {/* Legend Overlay */}
         <div className="absolute bottom-6 left-6 glass-card p-4 rounded-xl shadow-2xl" style={{ zIndex: 400 }}>
           <h4 className="text-sm font-bold text-white mb-3 tracking-wider uppercase">Heat Risk Level</h4>
           <div className="space-y-3">
             <div className="flex items-center space-x-3">
               <div className="w-4 h-4 rounded bg-success opacity-80"></div>
               <span className="text-sm text-gray-300">Low (&lt;27°C)</span>
             </div>
             <div className="flex items-center space-x-3">
               <div className="w-4 h-4 rounded bg-warning opacity-80"></div>
               <span className="text-sm text-gray-300">Moderate (27-32°C)</span>
             </div>
             <div className="flex items-center space-x-3">
               <div className="w-4 h-4 rounded bg-primary opacity-80"></div>
               <span className="text-sm text-gray-300">High (32-39°C)</span>
             </div>
             <div className="flex items-center space-x-3">
               <div className="w-4 h-4 rounded bg-danger opacity-80"></div>
               <span className="text-sm text-gray-300">Extreme (≥39°C)</span>
             </div>
           </div>
         </div>
      </div>
    </div>
  );
};

export default HeatMap;
