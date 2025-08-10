"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

// Animated Background Component
const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating geometric shapes */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 opacity-20">
        <svg viewBox="0 0 200 200" className="w-full h-full animate-spin" style={{ animationDuration: '20s' }}>
          <polygon points="100,10 190,50 190,150 100,190 10,150 10,50" 
                   fill="none" stroke="currentColor" strokeWidth="1" 
                   className="text-blue-500" />
        </svg>
      </div>
      
      {/* Large Candlestick Chart Animation - Top Right */}
      <div className="absolute top-10 right-10 w-96 h-64 opacity-35">
        <svg viewBox="0 0 400 250" className="w-full h-full">
          {/* Background grid */}
          <defs>
            <pattern id="tradingGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#6b7280" strokeWidth="0.5" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#tradingGrid)" />
          
          {/* Green candles */}
          <g className="animate-pulse">
            <rect x="30" y="90" width="12" height="45" fill="#22c55e" />
            <line x1="36" y1="75" x2="36" y2="145" stroke="#22c55e" strokeWidth="2" />
            <rect x="60" y="105" width="12" height="35" fill="#22c55e" />
            <line x1="66" y1="90" x2="66" y2="150" stroke="#22c55e" strokeWidth="2" />
            <rect x="120" y="80" width="12" height="50" fill="#22c55e" />
            <line x1="126" y1="65" x2="126" y2="140" stroke="#22c55e" strokeWidth="2" />
            <rect x="180" y="95" width="12" height="40" fill="#22c55e" />
            <line x1="186" y1="80" x2="186" y2="145" stroke="#22c55e" strokeWidth="2" />
            <rect x="240" y="85" width="12" height="55" fill="#22c55e" />
            <line x1="246" y1="70" x2="246" y2="150" stroke="#22c55e" strokeWidth="2" />
            <rect x="300" y="100" width="12" height="35" fill="#22c55e" />
            <line x1="306" y1="85" x2="306" y2="145" stroke="#22c55e" strokeWidth="2" />
          </g>
          {/* Red candles */}
          <g className="animate-pulse" style={{ animationDelay: '0.5s' }}>
            <rect x="90" y="115" width="12" height="25" fill="#ef4444" />
            <line x1="96" y1="100" x2="96" y2="150" stroke="#ef4444" strokeWidth="2" />
            <rect x="150" y="125" width="12" height="20" fill="#ef4444" />
            <line x1="156" y1="110" x2="156" y2="155" stroke="#ef4444" strokeWidth="2" />
            <rect x="210" y="130" width="12" height="15" fill="#ef4444" />
            <line x1="216" y1="115" x2="216" y2="155" stroke="#ef4444" strokeWidth="2" />
            <rect x="270" y="120" width="12" height="25" fill="#ef4444" />
            <line x1="276" y1="105" x2="276" y2="155" stroke="#ef4444" strokeWidth="2" />
            <rect x="330" y="135" width="12" height="15" fill="#ef4444" />
            <line x1="336" y1="120" x2="336" y2="160" stroke="#ef4444" strokeWidth="2" />
          </g>
          {/* Moving average line */}
          <path d="M25,120 Q80,110 150,115 Q220,125 290,120 Q340,115 370,110" 
                fill="none" stroke="#3b82f6" strokeWidth="3" 
                className="animate-pulse" style={{ animationDelay: '1s' }} strokeDasharray="5,5">
            <animate attributeName="stroke-dashoffset" values="0;10" dur="3s" repeatCount="indefinite"/>
          </path>
          {/* Volume bars */}
          <g opacity="0.6">
            <rect x="30" y="180" width="12" height="30" fill="#8b5cf6" />
            <rect x="60" y="185" width="12" height="25" fill="#8b5cf6" />
            <rect x="90" y="175" width="12" height="35" fill="#8b5cf6" />
            <rect x="120" y="170" width="12" height="40" fill="#8b5cf6" />
            <rect x="150" y="190" width="12" height="20" fill="#8b5cf6" />
          </g>
        </svg>
      </div>
      
      {/* Large Candlestick Chart Animation - Bottom Left */}
      <div className="absolute bottom-20 left-10 w-80 h-48 opacity-30">
        <svg viewBox="0 0 350 200" className="w-full h-full">
          <rect width="100%" height="100%" fill="url(#tradingGrid)" />
          
          {/* Bearish trend candles */}
          <g className="animate-pulse" style={{ animationDelay: '1.5s' }}>
            <rect x="25" y="60" width="10" height="40" fill="#22c55e" />
            <line x1="30" y1="50" x2="30" y2="110" stroke="#22c55e" strokeWidth="1.5" />
            <rect x="50" y="80" width="10" height="30" fill="#ef4444" />
            <line x1="55" y1="70" x2="55" y2="120" stroke="#ef4444" strokeWidth="1.5" />
            <rect x="75" y="95" width="10" height="25" fill="#ef4444" />
            <line x1="80" y1="85" x2="80" y2="130" stroke="#ef4444" strokeWidth="1.5" />
            <rect x="100" y="110" width="10" height="20" fill="#ef4444" />
            <line x1="105" y1="100" x2="105" y2="140" stroke="#ef4444" strokeWidth="1.5" />
            <rect x="125" y="125" width="10" height="15" fill="#ef4444" />
            <line x1="130" y1="115" x2="130" y2="150" stroke="#ef4444" strokeWidth="1.5" />
            <rect x="150" y="140" width="10" height="10" fill="#ef4444" />
            <line x1="155" y1="130" x2="155" y2="160" stroke="#ef4444" strokeWidth="1.5" />
            <rect x="175" y="135" width="10" height="20" fill="#22c55e" />
            <line x1="180" y1="125" x2="180" y2="165" stroke="#22c55e" strokeWidth="1.5" />
            <rect x="200" y="120" width="10" height="30" fill="#22c55e" />
            <line x1="205" y1="110" x2="205" y2="160" stroke="#22c55e" strokeWidth="1.5" />
            <rect x="225" y="100" width="10" height="35" fill="#22c55e" />
            <line x1="230" y1="90" x2="230" y2="145" stroke="#22c55e" strokeWidth="1.5" />
            <rect x="250" y="85" width="10" height="40" fill="#22c55e" />
            <line x1="255" y1="75" x2="255" y2="135" stroke="#22c55e" strokeWidth="1.5" />
          </g>
          {/* Trend line */}
          <path d="M20,80 Q100,120 180,140 Q230,130 280,100" 
                fill="none" stroke="#f59e0b" strokeWidth="2" 
                className="animate-pulse" strokeDasharray="4,4">
            <animate attributeName="stroke-dashoffset" values="0;8" dur="2.5s" repeatCount="indefinite"/>
          </path>
        </svg>
      </div>
      
      {/* Medium Candlestick Chart - Top Center */}
      <div className="absolute top-32 left-1/2 transform -translate-x-1/2 w-72 h-40 opacity-25">
        <svg viewBox="0 0 300 150" className="w-full h-full">
          <g className="animate-bounce" style={{ animationDuration: '4s' }}>
            <rect x="20" y="60" width="8" height="25" fill="#22c55e" />
            <line x1="24" y1="50" x2="24" y2="95" stroke="#22c55e" strokeWidth="1" />
            <rect x="40" y="70" width="8" height="20" fill="#ef4444" />
            <line x1="44" y1="60" x2="44" y2="100" stroke="#ef4444" strokeWidth="1" />
            <rect x="60" y="55" width="8" height="30" fill="#22c55e" />
            <line x1="64" y1="45" x2="64" y2="95" stroke="#22c55e" strokeWidth="1" />
            <rect x="80" y="75" width="8" height="15" fill="#ef4444" />
            <line x1="84" y1="65" x2="84" y2="100" stroke="#ef4444" strokeWidth="1" />
            <rect x="100" y="50" width="8" height="35" fill="#22c55e" />
            <line x1="104" y1="40" x2="104" y2="95" stroke="#22c55e" strokeWidth="1" />
            <rect x="120" y="80" width="8" height="10" fill="#ef4444" />
            <line x1="124" y1="70" x2="124" y2="100" stroke="#ef4444" strokeWidth="1" />
          </g>
        </svg>
      </div>
      
      {/* Line Chart Animation */}
      <div className="absolute bottom-32 left-20 w-72 h-32 opacity-35">
        <svg viewBox="0 0 300 120" className="w-full h-full">
          {/* Chart area */}
          <defs>
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05"/>
            </linearGradient>
          </defs>
          
          {/* Animated line chart */}
          <path d="M20,90 Q60,70 100,75 Q140,60 180,65 Q220,50 260,55" 
                fill="none" stroke="#10b981" strokeWidth="3" 
                className="animate-pulse">
            <animate attributeName="d" 
                     values="M20,90 Q60,70 100,75 Q140,60 180,65 Q220,50 260,55;
                             M20,85 Q60,65 100,80 Q140,55 180,70 Q220,45 260,60;
                             M20,90 Q60,70 100,75 Q140,60 180,65 Q220,50 260,55" 
                     dur="4s" repeatCount="indefinite"/>
          </path>
          
          {/* Area fill */}
          <path d="M20,90 Q60,70 100,75 Q140,60 180,65 Q220,50 260,55 L260,110 L20,110 Z" 
                fill="url(#chartGradient)">
            <animate attributeName="d" 
                     values="M20,90 Q60,70 100,75 Q140,60 180,65 Q220,50 260,55 L260,110 L20,110 Z;
                             M20,85 Q60,65 100,80 Q140,55 180,70 Q220,45 260,60 L260,110 L20,110 Z;
                             M20,90 Q60,70 100,75 Q140,60 180,65 Q220,50 260,55 L260,110 L20,110 Z" 
                     dur="4s" repeatCount="indefinite"/>
          </path>
          
          {/* Grid lines */}
          <g stroke="#6b7280" strokeWidth="0.5" opacity="0.3">
            <line x1="20" y1="30" x2="260" y2="30" />
            <line x1="20" y1="50" x2="260" y2="50" />
            <line x1="20" y1="70" x2="260" y2="70" />
            <line x1="20" y1="90" x2="260" y2="90" />
          </g>
        </svg>
      </div>
      
      {/* Small Candlestick Chart - Right Center */}
      <div className="absolute top-1/2 right-32 w-48 h-32 opacity-25">
        <svg viewBox="0 0 180 120" className="w-full h-full">
          <g className="animate-bounce" style={{ animationDuration: '3s' }}>
            <rect x="15" y="50" width="8" height="20" fill="#22c55e" />
            <line x1="19" y1="40" x2="19" y2="80" stroke="#22c55e" strokeWidth="1" />
            <rect x="35" y="60" width="8" height="15" fill="#ef4444" />
            <line x1="39" y1="50" x2="39" y2="85" stroke="#ef4444" strokeWidth="1" />
            <rect x="55" y="45" width="8" height="25" fill="#22c55e" />
            <line x1="59" y1="35" x2="59" y2="80" stroke="#22c55e" strokeWidth="1" />
            <rect x="75" y="65" width="8" height="12" fill="#ef4444" />
            <line x1="79" y1="55" x2="79" y2="85" stroke="#ef4444" strokeWidth="1" />
            <rect x="95" y="40" width="8" height="30" fill="#22c55e" />
            <line x1="99" y1="30" x2="99" y2="80" stroke="#22c55e" strokeWidth="1" />
            <rect x="115" y="70" width="8" height="10" fill="#ef4444" />
            <line x1="119" y1="60" x2="119" y2="90" stroke="#ef4444" strokeWidth="1" />
            <rect x="135" y="55" width="8" height="18" fill="#22c55e" />
            <line x1="139" y1="45" x2="139" y2="83" stroke="#22c55e" strokeWidth="1" />
          </g>
        </svg>
      </div>
      
      {/* Floating particles */}
      {[...Array(12)].map((_, i) => (
        <div key={i} 
             className={`absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-50 animate-ping`}
             style={{
               left: `${Math.random() * 100}%`,
               top: `${Math.random() * 100}%`,
               animationDelay: `${Math.random() * 3}s`,
               animationDuration: '3s'
             }} />
      ))}
      
      {/* Grid lines */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" className="text-blue-500"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      
      {/* Moving circuit lines */}
      <div className="absolute top-10 left-10 w-96 h-96 opacity-20">
        <svg viewBox="0 0 300 300" className="w-full h-full">
          <path d="M50,50 L150,50 L150,100 L250,100 L250,150 L50,150 Z" 
                fill="none" stroke="currentColor" strokeWidth="1" 
                className="text-green-400 animate-pulse" strokeDasharray="5,5">
            <animate attributeName="stroke-dashoffset" values="0;10" dur="2s" repeatCount="indefinite"/>
          </path>
        </svg>
      </div>
    </div>
  );
};

export default function Home() {
  const router = useRouter();
  const [scrollY, setScrollY] = useState(0);
  const [userCount, setUserCount] = useState(718);
  const [signalCount, setSignalCount] = useState(15420);
  const [activeUsers, setActiveUsers] = useState(142);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    
    // Animate counters
    const interval = setInterval(() => {
      setUserCount(prev => prev + Math.floor(Math.random() * 3));
      setSignalCount(prev => prev + Math.floor(Math.random() * 8));
      setActiveUsers(prev => {
        const change = Math.floor(Math.random() * 6) - 2;
        return Math.max(120, Math.min(180, prev + change));
      });
    }, 15000);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-slate-900 dark:to-gray-800">
      <div className="relative overflow-hidden">
        <AnimatedBackground />
        <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-700/25 bg-[length:20px_20px] opacity-60" />
        
        {/* Hero Section */}
        <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20">
          <div 
            className="transform transition-all duration-1000 ease-out"
            style={{ transform: `translateY(${scrollY * 0.3}px)` }}
          >
            <div className="text-center mb-8">
              <div className="flex flex-wrap justify-center gap-4 mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-300">{activeUsers} Active Now</span>
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                  <span className="text-sm font-medium text-purple-800 dark:text-purple-300">{userCount.toLocaleString()}+ Users</span>
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <span className="text-sm font-medium text-green-800 dark:text-green-300">{signalCount.toLocaleString()}+ Signals Generated</span>
                </div>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                MarginGate
              </h1>
              <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-slate-700 dark:text-slate-300">
                Free Crypto Trading Signals & Technical Analysis Platform
              </h2>
              
              <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
                Advanced price action analysis tool for leverage traders using smart money concepts
              </p>
              
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-4 max-w-4xl mx-auto mb-8">
                <div className="flex items-start gap-3">
                  <span className="text-amber-600 dark:text-amber-400 text-xl">⚠️</span>
                  <div className="text-sm text-amber-800 dark:text-amber-200">
                    <strong>Important Notice:</strong> MarginGate is an analytical tool only. We do not provide buy/sell orders or financial advice. Always conduct your own analysis and implement proper risk management before making any trading decisions.
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap justify-center gap-4 mb-10">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 rounded-full backdrop-blur-sm">
                  <span className="text-2xl">⚡</span>
                  <span className="text-sm font-medium">Instant Signals</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 rounded-full backdrop-blur-sm">
                  <span className="text-2xl">📊</span>
                  <span className="text-sm font-medium">Price Action Analysis</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 rounded-full backdrop-blur-sm">
                  <span className="text-2xl">🔔</span>
                  <span className="text-sm font-medium">Smart Alerts</span>
                </div>
              </div>
              
              <div className="space-y-4 mb-10">
                <button
                  onClick={() => router.push("/login")}
                  className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-2xl transition-all duration-300 transform hover:scale-105 text-lg mr-4"
                >
                  <span className="relative z-10">Get Free Access</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
                
                <div className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <span className="text-green-500">✓</span>
                  <span>Completely free platform</span>
                  <span className="mx-2">•</span>
                  <span className="text-green-500">✓</span>
                  <span>No hidden fees</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Premium Features Section */}
        <section className="relative py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white">
                Smart Money Analysis Tools for Leverage Trading
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
Analyze the most volatile cryptocurrencies using advanced price action and smart money concepts. Over {userCount}+ traders rely on our algorithms to identify high-probability setups.
              </p>
              
              {/* Real-time metrics bar */}
              <div className="flex flex-wrap justify-center gap-6 mt-8 mb-8">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-gray-800/60 rounded-full backdrop-blur-sm">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{activeUsers} traders online</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-gray-800/60 rounded-full backdrop-blur-sm">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">⚡ {Math.floor(Math.random() * 5) + 15} new signals today</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-gray-800/60 rounded-full backdrop-blur-sm">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">📈 {Math.floor(Math.random() * 20) + 45} cryptos analyzed</span>
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="group p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="text-4xl mb-4">🔔</div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Free Crypto Trading Alerts & Price Action Signals</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-4">Receive signals when smart money setups align in high-volatility cryptocurrencies. Our price action analysis identifies institutional patterns and optimal entry zones for leverage positions. Remember: These are analytical signals only - always conduct your own risk assessment.</p>
                <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">• BOS/CHoCH analysis • Trigger levels • Risk management</div>
              </div>
              
              <div className="group p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">FVG, BOS & CHoCH Technical Analysis</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-4">Advanced smart money concepts analysis including Fair Value Gaps where institutions fill orders, Break of Structure patterns showing trend continuation, and Change of Character signals indicating potential reversals. Perfect for volatile crypto pairs and leverage trading strategies.</p>
                <div className="text-sm text-green-600 dark:text-green-400 font-medium">• Fair Value Gap • Structure breaks • Character changes</div>
              </div>
              
              <div className="group p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Real-time RSI Momentum Tracking</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-4">Track momentum shifts in volatile crypto pairs using RSI heat maps. Identify extreme conditions where smart money typically enters or exits positions. Essential for timing leverage entries and managing high-risk positions.</p>
                <div className="text-sm text-purple-600 dark:text-purple-400 font-medium">• Momentum tracking • Overbought/oversold • Multiple timeframes</div>
              </div>
              
              <div className="group p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Detailed Cryptocurrency Market Analysis</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-4">Deep analysis of the most volatile cryptocurrencies favored by leverage traders. Focus on pairs with highest institutional interest and price action clarity. All data is for educational analysis - make your own trading decisions.</p>
                <div className="text-sm text-orange-600 dark:text-orange-400 font-medium">• Detailed coin analysis • Mini charts • Trend indicators</div>
              </div>
              
              <div className="group p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Live Market Data & Real-time Updates</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-4">Real-time price action monitoring for fast-moving crypto markets. Essential for leverage trading where timing is critical. Updates every 60 seconds to capture smart money movements and volatility spikes.</p>
                <div className="text-sm text-red-600 dark:text-red-400 font-medium">• Real-time data • Auto updates • Low latency</div>
              </div>
              
              <div className="group p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="text-4xl mb-4">📚</div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">User Guide</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-4">Learn to use the platform with maximum efficiency through step-by-step guides and glossary of terms.</p>
                <div className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">• Detailed guides • Terms glossary • Pro tips</div>
              </div>
            </div>
          </div>
        </section>

        {/* Free Access CTA Section */}
        <section className="relative py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Join {Math.floor(userCount/10)*10}+ Traders Using Free Crypto Signals
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of active traders using our completely free crypto signals platform with {signalCount.toLocaleString()}+ signals generated.
            </p>
            
            {/* Live Stats */}
            <div className="flex flex-wrap justify-center gap-6 mb-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">{activeUsers}</div>
                  <div className="text-blue-200 text-sm">Active Now</div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">{Math.floor(signalCount/1000)}K+</div>
                  <div className="text-blue-200 text-sm">Signals Generated</div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">24/7</div>
                  <div className="text-blue-200 text-sm">Live Analysis</div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-1">100%</div>
                  <div className="text-blue-200 text-sm">Free Forever</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 max-w-md mx-auto mb-8">
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-white mb-2">100%</div>
                <div className="text-blue-100 text-lg">FREE FOREVER</div>
              </div>
              
              <div className="space-y-3 mb-8 text-left">
                <div className="flex items-center gap-3 text-white">
                  <span className="text-green-400">✓</span>
                  <span>Unlimited trading signals</span>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <span className="text-green-400">✓</span>
                  <span>Professional FVG, BOS, CHoCH analysis</span>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <span className="text-green-400">✓</span>
                  <span>Real-time RSI momentum tracking</span>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <span className="text-green-400">✓</span>
                  <span>Detailed cryptocurrency analysis</span>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <span className="text-green-400">✓</span>
                  <span>Live market data feeds</span>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <span className="text-green-400">✓</span>
                  <span>Mobile-friendly dashboard</span>
                </div>
              </div>
              
              <button
                onClick={() => router.push("/login")}
                className="w-full px-8 py-4 bg-white text-blue-600 font-bold rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 text-lg mb-4"
              >
                Get Free Access Now
              </button>
              
              <div className="text-blue-100 text-sm">
                No credit card required - Always free
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 text-blue-100 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-green-400">🔒</span>
                <span>Secure registration</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">⚡</span>
                <span>Instant access</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">💯</span>
                <span>Always free</span>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section for SEO */}
        <section className="relative py-20 px-4 bg-slate-50 dark:bg-gray-900">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                Everything you need to know about our free crypto trading signals platform
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">
                  Is MarginGate really completely free?
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Yes! MarginGate is 100% free forever. We provide professional crypto trading signals, technical analysis tools, RSI tracking, and price action alerts at no cost. No hidden fees, no premium subscriptions - just free access to professional trading tools.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">
                  What are Smart Money Concepts and Price Action Analysis?
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Smart Money Concepts track institutional trading patterns. FVG (Fair Value Gap) shows where institutions fill large orders, BOS (Break of Structure) indicates trend continuation when key levels break, and CHoCH (Change of Character) signals potential reversals. Our tool identifies these patterns in volatile crypto pairs suitable for leverage trading. <strong>Important:</strong> These are educational signals only - not trading advice.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">
                  How accurate are your free crypto trading signals?
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Our signals use advanced price action analysis and technical indicators. While no trading signal is 100% accurate, our algorithms analyze market structure, momentum, and key levels to provide high-quality alerts. Remember to always do your own research and manage risk properly.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">
                  Which cryptocurrencies do you cover?
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  We provide signals and analysis for major cryptocurrencies including Bitcoin (BTC), Ethereum (ETH), and top altcoins. Our platform covers the most liquid and actively traded pairs to ensure you get reliable signals for profitable trading opportunities.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">
                  Do I need to register to use MarginGate?
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Yes, free registration is required to access your dashboard and trading signals. This helps us provide personalized alerts and maintain the platform. Registration is quick, secure, and doesn't require any payment information.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">
                  How often are trading signals updated?
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  Our platform provides real-time analysis with signals updated every 60 seconds. Market conditions change rapidly in crypto, so we ensure you get the latest technical analysis, RSI levels, and price action alerts as soon as they develop.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-l-4 border-red-500">
                <h3 className="text-xl font-bold mb-3 text-red-800 dark:text-red-300">
                  What about risk management and leverage trading?
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  <strong className="text-red-700 dark:text-red-400">Critical:</strong> MarginGate focuses on volatile cryptocurrencies suitable for leverage trading, which carries extreme risk. We provide analytical tools only - never trade signals or financial advice. You must: 1) Do your own analysis, 2) Implement strict risk management, 3) Never risk more than you can afford to lose, 4) Understand that leverage trading can result in total capital loss. <strong>Always trade responsibly.</strong>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Risk Disclaimer Section */}
        <section className="relative py-16 px-4 bg-red-50 dark:bg-red-900/10 border-t border-red-200 dark:border-red-800">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4 text-red-800 dark:text-red-300 flex items-center justify-center gap-3">
                <span className="text-4xl">⚠️</span>
                Important Risk Disclaimer
              </h2>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border-l-4 border-red-500">
              <div className="space-y-4 text-slate-700 dark:text-slate-300">
                <p className="font-semibold text-lg text-red-800 dark:text-red-300">
                  MarginGate is an Educational Analysis Tool Only
                </p>
                
                <div className="space-y-3">
                  <p>
                    <strong>• No Financial Advice:</strong> We do not provide buy/sell orders, investment advice, or trading recommendations. All signals and analysis are for educational and informational purposes only.
                  </p>
                  
                  <p>
                    <strong>• Leverage Trading Risks:</strong> This tool focuses on volatile cryptocurrencies suitable for leverage trading. Leverage trading carries extremely high risk and can result in total loss of capital.
                  </p>
                  
                  <p>
                    <strong>• Your Responsibility:</strong> You must conduct your own analysis, implement proper risk management, and make independent trading decisions. Never risk more than you can afford to lose.
                  </p>
                  
                  <p>
                    <strong>• Smart Money Concepts:</strong> Our analysis identifies patterns based on price action and smart money concepts, but these do not guarantee profitable trades or predict future market movements.
                  </p>
                  
                  <p>
                    <strong>• Volatility Warning:</strong> Cryptocurrencies are highly volatile and unpredictable. Past performance does not indicate future results. Market conditions can change rapidly.
                  </p>
                </div>
                
                <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-700">
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                    By using MarginGate, you acknowledge that cryptocurrency trading involves substantial risk of loss and may not be suitable for all investors. You are solely responsible for your trading decisions and their consequences.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <footer className="relative py-8 px-4 bg-slate-900 dark:bg-black">
          <div className="text-center">
            <p className="text-slate-400 text-sm">
              &copy; {new Date().getFullYear()} MarginGate. All rights reserved. | Free Crypto Trading Signals | Technical Analysis Tools
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
} 