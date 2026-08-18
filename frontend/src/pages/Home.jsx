import React, { useState, useEffect, useRef } from 'react';
import { Search, Thermometer, Wind, Droplets, AlertTriangle, ShieldAlert, Zap, RefreshCw, MapPin } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import apiService from '../services/apiService';
import clsx from 'clsx';

const Home = () => {
  const [selectedLocation, setSelectedLocation] = useState({ name: 'London', lat: 51.5085, lon: -0.1257, country: 'United Kingdom' });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  const [isFahrenheit, setIsFahrenheit] = useState(false);
  const searchRef = useRef(null);

  const fetchData = async (location) => {
    setLoading(true);
    setError(null);
    try {
      const riskData = await apiService.getHeatRisk(location.lat, location.lon);
      setData(riskData);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to load live data from the weather service.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(selectedLocation);
  }, [selectedLocation]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

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

  const handleRefresh = () => {
    fetchData(selectedLocation);
  };

  const getRiskColor = (level) => {
    switch(level) {
      case 'LOW': return 'text-success';
      case 'MODERATE': return 'text-warning';
      case 'HIGH': return 'text-primary';
      case 'EXTREME': return 'text-danger';
      default: return 'text-gray-400';
    }
  };

  const getRiskBg = (level) => {
    switch(level) {
      case 'LOW': return 'bg-success/10 border-success/30';
      case 'MODERATE': return 'bg-warning/10 border-warning/30';
      case 'HIGH': return 'bg-primary/10 border-primary/30';
      case 'EXTREME': return 'bg-danger/10 border-danger/30';
      default: return 'bg-surface border-white/10';
    }
  };

  const formatTemp = (tempC) => {
    if (tempC == null) return '--';
    if (isFahrenheit) {
      return ((tempC * 9/5) + 32).toFixed(1);
    }
    return tempC.toFixed(1);
  };

  const formatTime = (date) => {
    if (!date) return '';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  // Create chart data based on hourly data if available, or simulate it like before
  const getChartData = () => {
    if (!data) return [];
    const base = data.weather.temperature;
    return Array.from({length: 24}).map((_, i) => {
      const hour = i;
      const peakDist = Math.abs(14 - hour);
      const tempC = base - (peakDist * 0.5) + (Math.random() * 2 - 1);
      return {
        time: `${hour}:00`,
        temperature: isFahrenheit ? parseFloat(((tempC * 9/5) + 32).toFixed(1)) : parseFloat(tempC.toFixed(1))
      };
    });
  };

  return (
    <div className="space-y-6">
      {/* Header / Controls */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            Urban Heat Intelligence 
            {loading && <RefreshCw className="animate-spin text-gray-500" size={16} />}
          </h2>
          <p className="text-gray-400 text-sm flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1">
            <span>Real-time analysis and risk assessment</span>
            {lastUpdated && (
              <span className="text-xs bg-surfaceHighlight px-2 py-1 rounded border border-white/10">
                Last updated: {formatTime(lastUpdated)}
              </span>
            )}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Unit Toggle */}
          <div className="glass-card flex items-center p-1 rounded-xl w-full sm:w-auto">
             <button 
                onClick={() => setIsFahrenheit(false)} 
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${!isFahrenheit ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'}`}
             >
               °C
             </button>
             <button 
                onClick={() => setIsFahrenheit(true)} 
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isFahrenheit ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'}`}
             >
               °F
             </button>
          </div>

          {/* Refresh Button */}
          <button 
            onClick={handleRefresh}
            disabled={loading}
            className="glass-card p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all disabled:opacity-50 w-full sm:w-auto flex justify-center"
            title="Refresh Data"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>

          {/* Search Bar */}
          <div className="relative w-full sm:w-72" ref={searchRef}>
            <div className="glass-card rounded-xl p-1 flex items-center z-20">
              <Search className="text-gray-400 ml-3 mr-2 shrink-0" size={18} />
              <input 
                type="text"
                placeholder={selectedLocation.name}
                value={searchQuery}
                onChange={handleSearch}
                onFocus={() => { if(searchResults.length > 0) setShowDropdown(true); }}
                className="bg-transparent text-white border-none focus:ring-0 outline-none w-full py-1.5 text-sm"
              />
            </div>
            
            {showDropdown && searchResults.length > 0 && (
              <div className="absolute top-full mt-2 w-full glass-card max-h-60 overflow-y-auto z-50 rounded-xl py-2">
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
      </div>

      {/* Content Area */}
      {loading && !data ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
          {[1,2,3,4].map(i => (
            <div key={i} className="glass-card h-32 rounded-2xl"></div>
          ))}
        </div>
      ) : error ? (
        <div className="glass-card border-danger/30 p-6 flex flex-col items-center justify-center text-center space-y-4">
           <ShieldAlert className="text-danger" size={48} />
           <p className="text-white text-lg">{error}</p>
           <button onClick={handleRefresh} className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm font-medium transition">
             Try Again
           </button>
        </div>
      ) : data ? (
        <div className="animate-in fade-in duration-500 space-y-6">
          {/* AI Heat Summary Alert */}
          {data.riskAnalysis.score >= 60 && (
            <div className={`border p-4 rounded-xl flex items-start space-x-4 ${getRiskBg(data.riskAnalysis.riskLevel)}`}>
               <AlertTriangle className={getRiskColor(data.riskAnalysis.riskLevel)} size={24} />
               <div>
                  <h4 className={`font-semibold ${getRiskColor(data.riskAnalysis.riskLevel)}`}>
                    AI Heat Alert: {data.riskAnalysis.riskLevel} RISK for {selectedLocation.name}
                  </h4>
                  <p className="text-sm mt-1 text-gray-300">{data.riskAnalysis.explanation}</p>
                  <ul className="text-sm mt-2 space-y-1 text-gray-400 list-disc list-inside">
                    {data.riskAnalysis.recommendations.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
               </div>
            </div>
          )}

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card p-6 flex flex-col justify-between">
              <div className="flex items-center justify-between text-gray-400">
                <span className="text-sm font-medium">Temperature</span>
                <Thermometer size={18} />
              </div>
              <div className="mt-4">
                <span className="text-4xl font-bold text-white">{formatTemp(data.weather.temperature)}°</span>
                <span className="text-gray-400 ml-1">{isFahrenheit ? 'F' : 'C'}</span>
              </div>
            </div>

            <div className="glass-card p-6 flex flex-col justify-between">
              <div className="flex items-center justify-between text-gray-400">
                <span className="text-sm font-medium">Feels Like</span>
                <Thermometer size={18} className="text-primary" />
              </div>
              <div className="mt-4">
                <span className="text-4xl font-bold text-white">{formatTemp(data.weather.apparentTemperature)}°</span>
                <span className="text-gray-400 ml-1">{isFahrenheit ? 'F' : 'C'}</span>
              </div>
            </div>

            <div className="glass-card p-6 flex flex-col justify-between">
              <div className="flex items-center justify-between text-gray-400">
                <span className="text-sm font-medium">Humidity</span>
                <Droplets size={18} className="text-blue-400" />
              </div>
              <div className="mt-4">
                <span className="text-4xl font-bold text-white">{data.weather.humidity}</span>
                <span className="text-gray-400 ml-1">%</span>
              </div>
            </div>

            <div className="glass-card p-6 flex flex-col justify-between">
              <div className="flex items-center justify-between text-gray-400">
                <span className="text-sm font-medium">Wind Speed</span>
                <Wind size={18} className="text-gray-300" />
              </div>
              <div className="mt-4">
                <span className="text-4xl font-bold text-white">{data.weather.windSpeed}</span>
                <span className="text-gray-400 ml-1">km/h</span>
              </div>
            </div>
          </div>

          {/* Charts & AI Analysis Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="glass-card p-6 lg:col-span-2">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-white">24-Hour Temperature Trend</h3>
                <div className="text-xs text-gray-500 bg-surfaceHighlight px-2 py-1 rounded">
                  Mock Trend
                </div>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={getChartData()}>
                    <defs>
                      <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis dataKey="time" stroke="#ffffff50" tick={{fill: '#ffffff50', fontSize: 12}} dy={10} />
                    <YAxis stroke="#ffffff50" tick={{fill: '#ffffff50', fontSize: 12}} dx={-10} domain={['dataMin - 2', 'dataMax + 2']} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#141419', borderColor: '#ffffff20', borderRadius: '8px' }}
                      itemStyle={{ color: '#f97316' }}
                    />
                    <Area type="monotone" dataKey="temperature" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorTemp)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass-card p-6 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-white">Risk Profile</h3>
                <span className={clsx("text-xs font-bold px-2 py-1 rounded border", getRiskBg(data.riskAnalysis.riskLevel), getRiskColor(data.riskAnalysis.riskLevel))}>
                  {data.riskAnalysis.riskLevel}
                </span>
              </div>
              
              <div className="flex-1 rounded-xl bg-surfaceHighlight/50 p-5 border border-white/5 relative flex flex-col justify-center">
                 <div className="flex items-center justify-between mb-4">
                   <div className="text-sm text-gray-400">Risk Score</div>
                   <div className="text-2xl font-bold text-white">{data.riskAnalysis.score}<span className="text-sm text-gray-500">/100</span></div>
                 </div>
                 
                 <div className="w-full bg-surface h-2 rounded-full overflow-hidden mb-6">
                   <div 
                     className={clsx("h-full rounded-full transition-all duration-1000", 
                       data.riskAnalysis.score < 30 ? 'bg-success' :
                       data.riskAnalysis.score < 60 ? 'bg-warning' :
                       data.riskAnalysis.score < 85 ? 'bg-primary' : 'bg-danger'
                     )}
                     style={{ width: `${data.riskAnalysis.score}%` }}
                   ></div>
                 </div>

                 <div className="mb-4 text-sm text-gray-300">
                   <p className="font-semibold text-white mb-2">Main Factors:</p>
                   <ul className="list-disc list-inside space-y-1 ml-1 text-gray-400">
                     {data.riskAnalysis.mainFactors?.map((factor, idx) => (
                       <li key={idx}>{factor}</li>
                     ))}
                   </ul>
                 </div>

                 <p className="text-sm text-gray-300 leading-relaxed relative z-10 border-t border-white/5 pt-4">
                   <strong className="text-white">Explanation: </strong>
                   {data.riskAnalysis.explanation}
                 </p>
                 <div className="mt-4 pt-4 border-t border-white/5 text-xs text-gray-500 italic">
                   {data.riskAnalysis.disclaimer || "HeatShield AI Estimate (Not an official medical or government warning)"}
                 </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Home;
