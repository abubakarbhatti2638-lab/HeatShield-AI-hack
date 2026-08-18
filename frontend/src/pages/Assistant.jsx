import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import apiService from '../services/apiService';

const Assistant = () => {
  // We'll use the same default location as the dashboard for initial context
  const [selectedLocation, setSelectedLocation] = useState({ name: 'London', lat: 51.5085, lon: -0.1257 });
  const [contextData, setContextData] = useState(null);
  const [loadingContext, setLoadingContext] = useState(true);
  const [contextError, setContextError] = useState(false);

  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am HeatShield AI. I am currently analyzing climate data. How can I help you understand the heat risks today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestedQuestions = [
    "What is the heat risk here?",
    "Why is the heat risk high?",
    "How does humidity affect the current conditions?",
    "What precautions should people consider?",
    "Which location has the highest heat risk?"
  ];

  // Fetch current context so AI knows what we are talking about
  useEffect(() => {
    const fetchContext = async () => {
      setLoadingContext(true);
      setContextError(false);
      try {
        const riskData = await apiService.getHeatRisk(selectedLocation.lat, selectedLocation.lon);
        setContextData({
          location: selectedLocation,
          weather: riskData.weather,
          heatRisk: riskData.riskAnalysis
        });
      } catch (err) {
        setContextError(true);
        console.error("Failed to load context for AI");
      } finally {
        setLoadingContext(false);
      }
    };
    fetchContext();
  }, [selectedLocation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (queryText = input) => {
    if (!queryText.trim()) return;
    
    // Add user message immediately
    const newMessages = [...messages, { role: 'user', content: queryText }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      const response = await apiService.askAssistant(queryText, contextData);
      setMessages([...newMessages, { role: 'assistant', content: response.answer }]);
    } catch (err) {
      setMessages([...newMessages, { role: 'assistant', content: 'Sorry, I encountered an error communicating with the climate servers. Please try again later.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col xl:flex-row gap-6">
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col glass-card rounded-2xl overflow-hidden relative border border-white/10 shadow-2xl">
        
        {/* Chat Header */}
        <div className="bg-surfaceHighlight/50 p-4 border-b border-white/10 flex justify-between items-center z-10">
          <div className="flex items-center space-x-3">
            <div className="bg-primary/20 p-2 rounded-lg border border-primary/30">
              <Sparkles className="text-primary" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white leading-tight">HeatShield Assistant</h2>
              <p className="text-xs text-gray-400">Context-Aware Urban Climate AI</p>
            </div>
          </div>
          {loadingContext ? (
            <div className="text-xs text-gray-500 flex items-center"><Loader2 size={12} className="animate-spin mr-1"/> Syncing live data...</div>
          ) : contextError ? (
            <div className="text-xs text-danger flex items-center"><AlertCircle size={12} className="mr-1"/> Sync failed</div>
          ) : (
            <div className="text-xs text-success flex items-center"><div className="w-2 h-2 rounded-full bg-success mr-2 animate-pulse"></div> Context Synced</div>
          )}
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex max-w-[85%] sm:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2 space-x-reverse`}>
                
                {/* Avatar */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border ${
                  msg.role === 'user' ? 'bg-surfaceHighlight border-white/20 ml-3' : 'bg-primary/20 border-primary/30 mr-3'
                }`}>
                  {msg.role === 'user' ? <User size={16} className="text-gray-300" /> : <Bot size={16} className="text-primary" />}
                </div>

                {/* Message Bubble */}
                <div className={`p-4 rounded-2xl text-sm ${
                  msg.role === 'user' 
                  ? 'bg-surfaceHighlight border border-white/10 text-white rounded-br-sm' 
                  : 'bg-primary/10 border border-primary/20 text-gray-200 rounded-bl-sm'
                }`}>
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-end space-x-2">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border bg-primary/20 border-primary/30 mr-3">
                  <Bot size={16} className="text-primary" />
                </div>
                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 rounded-bl-sm flex space-x-2 items-center h-10">
                  <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-surfaceHighlight/30 border-t border-white/10">
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={loadingContext ? "Waiting for context sync..." : "Ask me anything about heat risks..."}
              disabled={loadingContext}
              className="w-full bg-surface border border-white/10 rounded-xl py-3 pl-4 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors disabled:opacity-50"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!input.trim() || isTyping || loadingContext}
              className="absolute right-2 p-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:hover:bg-primary"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar Area (Suggested Questions) */}
      <div className="w-full xl:w-80 flex flex-col space-y-4">
        <div className="glass-card p-5 rounded-2xl border border-white/10">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center">
            <Sparkles size={14} className="mr-2 text-primary" /> Suggested Queries
          </h3>
          <div className="space-y-2">
            {suggestedQuestions.map((q, i) => (
              <button 
                key={i}
                onClick={() => handleSendMessage(q)}
                disabled={isTyping || loadingContext}
                className="w-full text-left text-sm text-gray-400 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 p-3 rounded-xl transition-all disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Active Context Readout */}
        <div className="glass-card p-5 rounded-2xl border border-white/10 flex-1">
           <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
             Active Context Map
           </h3>
           {contextData ? (
             <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-500">Location</span>
                  <span className="text-gray-200">{contextData.location.name}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-500">Temperature</span>
                  <span className="text-gray-200">{contextData.weather.temperature}°C</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-gray-500">Humidity</span>
                  <span className="text-gray-200">{contextData.weather.humidity}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Risk Level</span>
                  <span className="font-bold text-primary">{contextData.heatRisk.riskLevel}</span>
                </div>
             </div>
           ) : (
             <div className="text-sm text-gray-500 italic">No context loaded yet.</div>
           )}
        </div>
      </div>

    </div>
  );
};

export default Assistant;
