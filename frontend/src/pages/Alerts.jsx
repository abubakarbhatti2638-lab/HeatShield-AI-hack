import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, MapPin, Thermometer, ShieldAlert, Loader2 } from 'lucide-react';
import apiService from '../services/apiService';
import clsx from 'clsx';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const data = await apiService.getAlerts();
        setAlerts(data);
      } catch (err) {
        setError('Failed to load system alerts.');
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, []);

  const getSeverityStyle = (severity) => {
    switch(severity) {
      case 'CRITICAL': return 'bg-danger/20 border-danger/50 text-danger';
      case 'WARNING': return 'bg-warning/20 border-warning/50 text-warning';
      default: return 'bg-primary/20 border-primary/50 text-primary';
    }
  };

  const getSeverityIconColor = (severity) => {
    switch(severity) {
      case 'CRITICAL': return 'text-danger';
      case 'WARNING': return 'text-warning';
      default: return 'text-primary';
    }
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          Heat Risk Alerts
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          Automated warnings for high and extreme thermal risk conditions
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
           <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      ) : error ? (
        <div className="glass-card border-danger/30 p-6 flex flex-col items-center justify-center text-center space-y-4">
           <ShieldAlert className="text-danger" size={48} />
           <p className="text-white text-lg">{error}</p>
        </div>
      ) : alerts.length === 0 ? (
        <div className="glass-card p-12 flex flex-col items-center justify-center text-center space-y-4">
           <ShieldAlert className="text-success" size={48} />
           <h3 className="text-white text-xl font-bold">No Active Alerts</h3>
           <p className="text-gray-400 text-sm max-w-md">Global thermal conditions are currently within normal safe operating thresholds for tracked zones.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map(alert => (
            <div key={alert.id} className={`glass-card p-6 border-l-4 transition-all hover:bg-white/5 ${
              alert.severity === 'CRITICAL' ? 'border-l-danger' : 
              alert.severity === 'WARNING' ? 'border-l-warning' : 'border-l-primary'
            }`}>
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                
                {/* Left Section: Context */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center space-x-3 flex-wrap gap-y-2">
                    <span className={clsx("px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider", getSeverityStyle(alert.severity))}>
                      {alert.severity}
                    </span>
                    <span className="flex items-center text-gray-300 text-sm font-medium">
                      <MapPin size={14} className="mr-1 text-gray-400" /> {alert.location}
                    </span>
                    <span className="flex items-center text-gray-400 text-xs">
                      <Clock size={12} className="mr-1" /> {formatTime(alert.time)}
                    </span>
                  </div>
                  
                  <p className="text-white text-lg font-medium leading-snug">
                    {alert.explanation}
                  </p>
                </div>

                {/* Right Section: Metrics */}
                <div className="flex md:flex-col items-center md:items-end justify-between bg-surfaceHighlight/50 p-4 rounded-xl border border-white/5 min-w-[200px]">
                  <div className="flex flex-col items-center md:items-end">
                     <span className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-1">Recorded Temp</span>
                     <div className="flex items-center text-2xl font-bold text-white">
                        <Thermometer size={20} className={clsx("mr-1", getSeverityIconColor(alert.severity))} />
                        {alert.temperature}°C
                     </div>
                  </div>
                  <div className="mt-0 md:mt-3 flex flex-col items-center md:items-end">
                     <span className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-1">Risk Level</span>
                     <span className={clsx("text-sm font-bold uppercase", getSeverityIconColor(alert.severity))}>
                        {alert.riskLevel}
                     </span>
                  </div>
                </div>
              </div>

              {/* Recommendations Area */}
              <div className="mt-5 pt-4 border-t border-white/10 flex items-start space-x-3">
                 <AlertTriangle size={18} className="text-gray-400 shrink-0 mt-0.5" />
                 <div>
                   <h4 className="text-sm font-semibold text-gray-300">Recommended Action</h4>
                   <p className="text-sm text-gray-400 mt-1">{alert.recommendedAction}</p>
                 </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Alerts;
