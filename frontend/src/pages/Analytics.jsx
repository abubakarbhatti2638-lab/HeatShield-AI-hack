import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Loader2, Activity, Info, MapPin } from 'lucide-react';
import apiService from '../services/apiService';
import clsx from 'clsx';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await apiService.getAnalytics();
        setData(response);
      } catch (err) {
        setError('Failed to load analytics data.');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#141419] border border-white/20 p-3 rounded-lg shadow-xl">
          <p className="text-gray-400 text-xs mb-2 font-bold uppercase tracking-wider">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm font-medium" style={{ color: entry.color }}>
              {entry.name}: {entry.value}{entry.name.includes('Temp') ? '°C' : entry.name.includes('Humidity') ? '%' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-8rem)]">
         <div className="flex flex-col items-center space-y-4">
            <Loader2 className="animate-spin text-primary" size={40} />
            <p className="text-gray-400">Loading comprehensive analytics...</p>
         </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-8rem)]">
         <div className="glass-card border-danger/30 p-8 flex flex-col items-center justify-center text-center space-y-4">
            <Activity className="text-danger" size={48} />
            <p className="text-white text-lg">{error || 'No data available'}</p>
         </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            Climate Analytics
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Deep dive into thermal metrics and risk trends
          </p>
        </div>
        
        {data.isDemoData && (
          <div className="bg-primary/20 border border-primary/30 px-3 py-1.5 rounded-full flex items-center text-xs text-primary font-medium">
            <Info size={14} className="mr-1.5" />
            Showing Demo / Historical Data
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 24h Temperature vs Apparent Temperature Trend */}
        <div className="glass-card p-6 flex flex-col">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white">24h Temperature Trend</h3>
            <p className="text-sm text-gray-500">Actual vs. Apparent (Feels Like) Temperature</p>
          </div>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.trends24h} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorApparent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="timeLabel" stroke="#ffffff50" tick={{fill: '#ffffff50', fontSize: 12}} dy={10} />
                <YAxis stroke="#ffffff50" tick={{fill: '#ffffff50', fontSize: 12}} dx={-10} domain={['dataMin - 2', 'dataMax + 2']} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" name="Temperature" dataKey="temperature" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorTemp)" />
                <Area type="monotone" name="Apparent Temp" dataKey="apparentTemperature" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorApparent)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Heat Risk Trend */}
        <div className="glass-card p-6 flex flex-col">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white">Heat Risk Index</h3>
            <p className="text-sm text-gray-500">24-hour calculated risk score (0-100)</p>
          </div>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.trends24h} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="timeLabel" stroke="#ffffff50" tick={{fill: '#ffffff50', fontSize: 12}} dy={10} />
                <YAxis stroke="#ffffff50" tick={{fill: '#ffffff50', fontSize: 12}} dx={-10} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Bar name="Risk Score" dataKey="riskScore" radius={[4, 4, 0, 0]}>
                  {data.trends24h.map((entry, index) => (
                    <cell key={`cell-${index}`} fill={
                      entry.riskScore >= 85 ? '#ef4444' : 
                      entry.riskScore >= 60 ? '#f97316' : 
                      entry.riskScore >= 30 ? '#f59e0b' : '#10b981'
                    } />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Humidity Trend */}
        <div className="glass-card p-6 flex flex-col">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white">Humidity Dynamics</h3>
            <p className="text-sm text-gray-500">Relative humidity over 24 hours</p>
          </div>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.trends24h} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="timeLabel" stroke="#ffffff50" tick={{fill: '#ffffff50', fontSize: 12}} dy={10} />
                <YAxis stroke="#ffffff50" tick={{fill: '#ffffff50', fontSize: 12}} dx={-10} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" name="Humidity" dataKey="humidity" stroke="#3b82f6" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Global Location Comparison */}
        <div className="glass-card p-6 flex flex-col">
          <div className="mb-6 flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold text-white">Global Thermal Comparison</h3>
              <p className="text-sm text-gray-500">Comparing key indices across major cities</p>
            </div>
            <MapPin size={20} className="text-gray-400" />
          </div>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data.comparison}>
                <PolarGrid stroke="#ffffff20" />
                <PolarAngleAxis dataKey="city" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Radar name="Peak Temp (°C)" dataKey="peakTemp" stroke="#ef4444" fill="#ef4444" fillOpacity={0.4} />
                <Radar name="Avg Risk (0-100)" dataKey="avgRisk" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Analytics;
