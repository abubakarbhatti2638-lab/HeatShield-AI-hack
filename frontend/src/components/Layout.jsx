import React, { useState, useEffect } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Map, BarChart2, Bot, BellRing, ThermometerSun, AlertTriangle, CheckCircle, Database } from 'lucide-react';

const Layout = () => {
  const navItems = [
    { name: 'Overview', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Heat Map', path: '/map', icon: <Map size={20} /> },
    { name: 'Analytics', path: '/analytics', icon: <BarChart2 size={20} /> },
    { name: 'AI Assistant', path: '/assistant', icon: <Bot size={20} /> },
    { name: 'Alerts', path: '/alerts', icon: <BellRing size={20} /> },
  ];

  const [apiStatus, setApiStatus] = useState({ loading: true, status: null, message: '' });

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        // Fallback to VITE_API_URL if needed, but relative should work in dev proxy
        const res = await fetch('http://localhost:5000/api/status');
        const data = await res.json();
        setApiStatus({ loading: false, status: data.status, message: data.message });
      } catch (err) {
        setApiStatus({ loading: false, status: 'ERROR', message: 'Connection unavailable' });
      }
    };
    fetchStatus();
    // Poll every 60s
    const interval = setInterval(fetchStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-surface border-r border-white/5 flex flex-col hidden md:flex">
        <div className="p-6 flex items-center space-x-3">
          <div className="bg-primary/20 p-2 rounded-lg text-primary">
            <ThermometerSun size={28} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">HeatShield<span className="text-primary">AI</span></h1>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>
        
        <div className="p-6 text-xs text-gray-500">
          <p>Protect the City.</p>
          <p>© 2026 HeatShield AI</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-surfaceHighlight via-background to-background">
        
        {/* Header (Mobile menu placeholder & Search area conceptually) */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 z-10 bg-background/50 backdrop-blur-sm">
          <div className="flex items-center space-x-4 md:hidden">
            <ThermometerSun className="text-primary" size={24} />
            <h1 className="text-lg font-bold text-white">HeatShield<span className="text-primary">AI</span></h1>
          </div>
          <div className="hidden md:flex items-center space-x-4">
             <div className="flex items-center space-x-2 bg-black/20 px-3 py-1.5 rounded-full border border-white/10">
                {apiStatus.loading ? (
                  <span className="text-sm font-medium text-gray-400">Checking data source...</span>
                ) : apiStatus.status === 'OK' ? (
                  <>
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <span className="text-sm font-bold text-green-400 tracking-wide">LIVE DATA</span>
                    <span className="text-sm font-medium text-gray-300 ml-1">Source: FortyGuard</span>
                  </>
                ) : apiStatus.status === 'DEMO' ? (
                  <>
                    <Database size={14} className="text-blue-400" />
                    <span className="text-sm font-medium text-blue-400">Data Source: DEMO SIMULATION</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle size={14} className="text-red-500" />
                    <span className="text-sm font-medium text-red-500">FortyGuard connection unavailable</span>
                  </>
                )}
             </div>
          </div>
          <div className="flex items-center space-x-4">
             {/* User Profile / Notifications */}
             <div className="w-10 h-10 rounded-full bg-surfaceHighlight border border-white/10 flex items-center justify-center">
               <span className="text-sm font-medium">HS</span>
             </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
