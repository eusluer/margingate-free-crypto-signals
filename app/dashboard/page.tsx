"use client";
import React, { useState } from "react";
import { useAuth } from "../../components/AuthProvider";
import { useRouter } from "next/navigation";
import AlarmList from "./AlarmList";
import SignalList from "./SignalList";
import CoinList from "./CoinList";
import RSIMap from "./RSIMap";
import CoinAnalysis from "./CoinAnalysis";
import UserGuide from "./UserGuide";

type TabType = "guide" | "alarms" | "signals" | "coins" | "rsi" | "analysis";

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("alarms");

  React.useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-slate-900 dark:to-gray-800">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-gray-600 dark:text-gray-400">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  const tabs = [
    {
      id: "alarms" as TabType,
      label: 'Smart Money Alerts',
      icon: "🔔",
      description: 'Volatile crypto setups - Educational analysis only',
      component: <AlarmList />
    },
    {
      id: "signals" as TabType,
      label: 'Price Action Signals',
      icon: "📊",
      description: 'Smart money concepts for education',
      component: <SignalList />
    },
    {
      id: "coins" as TabType,
      label: 'Coin List',
      icon: "💰",
      description: 'High-volatility crypto analysis',
      component: <CoinList />
    },
    {
      id: "rsi" as TabType,
      label: 'RSI Map',
      icon: "🎯",
      description: 'Momentum analysis for volatile pairs',
      component: <RSIMap />
    },
    {
      id: "analysis" as TabType,
      label: 'Coin Analysis',
      icon: "🔍",
      description: 'Special coin examination and detailed analysis',
      component: <CoinAnalysis />
    },
    {
      id: "guide" as TabType,
      label: 'How to Use?',
      icon: "📚",
      description: 'Step-by-step guide and basic concepts',
      component: <UserGuide />
    }
  ];

  const activeTabData = tabs.find(tab => tab.id === activeTab);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-slate-900 dark:to-gray-800">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-700/25 bg-[length:20px_20px] opacity-60" />
        
        <div className="relative z-10 p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-2">
                MarginGate Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Welcome, <span className="font-semibold text-blue-600 dark:text-blue-400">{user.email}</span>
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Smart Money Analysis Tool - Educational Purpose Only
              </p>
            </div>
            <button 
              onClick={signOut} 
              className="mt-4 sm:mt-0 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Logout
            </button>
          </div>

          {/* Risk Warning Banner */}
          <div className="mb-6 bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 rounded-xl p-4 shadow-lg">
            <div className="flex items-start gap-3">
              <span className="text-amber-600 dark:text-amber-400 text-2xl">⚠️</span>
              <div>
                <h3 className="font-bold text-amber-800 dark:text-amber-200 mb-1">Educational Analysis Tool</h3>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  MarginGate analyzes volatile cryptocurrencies using price action and smart money concepts for educational purposes. 
                  <strong> We do not provide trading advice.</strong> Always conduct your own analysis and implement proper risk management before making any trading decisions.
                </p>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-2 shadow-xl mb-6">
            <div className="flex flex-col sm:flex-row gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-200"
                  }`}
                >
                  <span className="text-xl">{tab.icon}</span>
                  <div className="text-left">
                    <div className="font-bold">{tab.label}</div>
                    <div className={`text-xs ${
                      activeTab === tab.id 
                        ? "text-blue-100" 
                        : "text-gray-500 dark:text-gray-400"
                    }`}>
                      {tab.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="transition-all duration-300 ease-in-out">
            {activeTabData?.component}
          </div>

          {/* Quick Stats Bar */}
          <div className="mt-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20 rounded-xl">
                <div className="text-2xl mb-2">📚</div>
                <div className="text-lg font-bold text-teal-700 dark:text-teal-400">Usage Guide</div>
                <div className="text-sm text-teal-600 dark:text-teal-500">Learn step by step</div>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl">
                <div className="text-2xl mb-2">🎯</div>
                <div className="text-lg font-bold text-green-700 dark:text-green-400">Smart Money Setups</div>
                <div className="text-sm text-green-600 dark:text-green-500">Volatile crypto analysis - Educational only</div>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl">
                <div className="text-2xl mb-2">📈</div>
                <div className="text-lg font-bold text-blue-700 dark:text-blue-400">Price Action Analysis</div>
                <div className="text-sm text-blue-600 dark:text-blue-500">Smart money concept tracking</div>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl">
                <div className="text-2xl mb-2">💎</div>
                <div className="text-lg font-bold text-purple-700 dark:text-purple-400">Market Tracking</div>
                <div className="text-sm text-purple-600 dark:text-purple-500">Real-time data</div>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl">
                <div className="text-2xl mb-2">🌡️</div>
                <div className="text-lg font-bold text-orange-700 dark:text-orange-400">RSI Map</div>
                <div className="text-sm text-orange-600 dark:text-orange-500">Momentum visualization</div>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 rounded-xl">
                <div className="text-2xl mb-2">🔍</div>
                <div className="text-lg font-bold text-indigo-700 dark:text-indigo-400">Coin Analysis</div>
                <div className="text-sm text-indigo-600 dark:text-indigo-500">Detailed examination</div>
              </div>
            </div>
          </div>

          {/* Comprehensive Risk Disclaimer */}
          <div className="mt-8 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-700 rounded-2xl p-6 shadow-xl">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-red-800 dark:text-red-300 flex items-center justify-center gap-2">
                <span className="text-2xl">⚠️</span>
                Critical Risk Notice
              </h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-3">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2">Tool Purpose</h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    MarginGate analyzes volatile cryptocurrencies using price action and smart money concepts. This is an educational analysis tool that identifies potential setups based on institutional trading patterns.
                  </p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2">No Trading Advice</h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    We do not provide buy/sell orders, investment recommendations, or financial advice. All signals are for educational analysis only.
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2">Leverage Trading Risks</h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    Focus on volatile cryptocurrencies suitable for leverage trading carries extreme risk. Leverage can amplify losses and result in total capital loss.
                  </p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2">Your Responsibility</h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    Always conduct your own analysis, implement strict risk management, and never risk more than you can afford to lose.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-amber-100 dark:bg-amber-900/20 rounded-lg text-center">
              <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                By using this platform, you acknowledge that cryptocurrency trading involves substantial risk and you are solely responsible for your trading decisions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 