"use client";
import React, { useState, useMemo } from "react";
import useSWR from "swr";
import { fetchSmcPaData, AlarmData, SignalData, CoinData } from "../../lib/supabaseStorage";

export default function SmcPaAnalysis() {
  const { data, error, isLoading } = useSWR('smc-pa-data', fetchSmcPaData, { 
    refreshInterval: 60_000,
    revalidateOnFocus: true 
  });
  
  const [activeView, setActiveView] = useState<'overview' | 'alarms' | 'signals' | 'volatility'>('overview');
  const [selectedTimeframe, setSelectedTimeframe] = useState<'4h' | '2h' | '30m' | '15m'>('4h');

  // Process data for display
  const processedData = useMemo(() => {
    if (!data) return null;

    const longAlarms = data.alarms.filter((alarm: AlarmData) => alarm.type === 'LONG');
    const shortAlarms = data.alarms.filter((alarm: AlarmData) => alarm.type === 'SHORT');
    
    // Get most volatile coins
    const volatileCoins = data.coins
      .sort((a: CoinData, b: CoinData) => Math.abs(b.priceChangePercent) - Math.abs(a.priceChangePercent))
      .slice(0, 10);

    // Count signals by timeframe
    const signalCounts = Object.keys(data.signals).reduce((acc, symbol) => {
      const symbolSignals = data.signals[symbol];
      Object.keys(symbolSignals).forEach(timeframe => {
        if (!acc[timeframe]) acc[timeframe] = { FVG: 0, BOS: 0, CHoCH: 0 };
        acc[timeframe].FVG += symbolSignals[timeframe].FVG?.length || 0;
        acc[timeframe].BOS += symbolSignals[timeframe].BOS?.length || 0;
        acc[timeframe].CHoCH += symbolSignals[timeframe].CHoCH?.length || 0;
      });
      return acc;
    }, {} as any);

    return {
      totalAlarms: data.alarms.length,
      longAlarms: longAlarms.length,
      shortAlarms: shortAlarms.length,
      volatileCoins,
      signalCounts,
      recentAlarms: data.alarms.slice(0, 8),
      lastUpdate: data.last_update
    };
  }, [data]);

  if (isLoading) return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      <span className="ml-2">Loading SMC-PA analysis...</span>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-6">
      <p className="text-red-700 dark:text-red-300">Error loading SMC-PA data. Please try again later.</p>
    </div>
  );

  if (!processedData) return (
    <div className="text-center p-8 text-gray-500">No SMC-PA data available.</div>
  );

  return (
    <div className="space-y-6">
      {/* Header with Last Update */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Smart Money Concepts & Price Action Analysis
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              Real-time volatile crypto analysis for educational purposes
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 dark:text-gray-400">Last Update</p>
            <p className="text-sm font-mono text-blue-600 dark:text-blue-400">
              {processedData.lastUpdate ? new Date(processedData.lastUpdate).toLocaleString() : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-2 shadow-xl">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'alarms', label: 'Setup Alerts', icon: '🚨' },
            { id: 'signals', label: 'Signal Analysis', icon: '🔍' },
            { id: 'volatility', label: 'Volatility Map', icon: '⚡' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                activeView === tab.id
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeView === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Stats Cards */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6">
            <div className="text-3xl mb-2">🎯</div>
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">{processedData.totalAlarms}</div>
            <div className="text-sm text-blue-600 dark:text-blue-300">Active Setup Alerts</div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6">
            <div className="text-3xl mb-2">📈</div>
            <div className="text-2xl font-bold text-green-700 dark:text-green-400">{processedData.longAlarms}</div>
            <div className="text-sm text-green-600 dark:text-green-300">LONG Setups</div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-xl p-6">
            <div className="text-3xl mb-2">📉</div>
            <div className="text-2xl font-bold text-red-700 dark:text-red-400">{processedData.shortAlarms}</div>
            <div className="text-sm text-red-600 dark:text-red-300">SHORT Setups</div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6">
            <div className="text-3xl mb-2">⚡</div>
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">{processedData.volatileCoins.length}</div>
            <div className="text-sm text-purple-600 dark:text-purple-300">Volatile Assets</div>
          </div>
        </div>
      )}

      {/* Alarms Tab */}
      {activeView === 'alarms' && (
        <div className="space-y-4">
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-4">
            <p className="text-amber-800 dark:text-amber-200 text-sm">
              <strong>Educational Alert Analysis:</strong> These represent potential setups based on smart money concepts. 
              Always conduct your own analysis before making any trading decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {processedData.recentAlarms.map((alarm: AlarmData, index: number) => (
              <div key={index} className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-l-4 ${
                alarm.type === 'LONG' ? 'border-green-500' : 'border-red-500'
              }`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {alarm.symbol}
                    </h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      alarm.type === 'LONG' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                    }`}>
                      {alarm.type} Setup
                    </span>
                  </div>
                  {alarm.interval && (
                    <span className="bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 px-2 py-1 rounded text-sm">
                      {alarm.interval}
                    </span>
                  )}
                </div>

                <div className="space-y-2 text-sm">
                  {alarm.current_price && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Current Price:</span>
                      <span className="font-mono">${alarm.current_price.toFixed(6)}</span>
                    </div>
                  )}
                  {alarm.alarm_level && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Alert Level:</span>
                      <span className="font-mono">${alarm.alarm_level.toFixed(6)}</span>
                    </div>
                  )}
                  {alarm.bos_level && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">BOS Level:</span>
                      <span className="font-mono">${alarm.bos_level.toFixed(6)}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    <strong>Analysis:</strong> {alarm.rule}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Signals Tab */}
      {activeView === 'signals' && (
        <div className="space-y-6">
          {/* Timeframe Selector */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4">
            <div className="flex flex-wrap gap-2">
              {['4h', '2h', '30m', '15m'].map(tf => (
                <button
                  key={tf}
                  onClick={() => setSelectedTimeframe(tf as any)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedTimeframe === tf
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Signal Counts */}
          {processedData.signalCounts[selectedTimeframe] && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6">
                <div className="text-2xl mb-2">📊</div>
                <div className="text-2xl font-bold text-green-700 dark:text-green-400">
                  {processedData.signalCounts[selectedTimeframe].FVG}
                </div>
                <div className="text-sm text-green-600 dark:text-green-300">Fair Value Gaps</div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6">
                <div className="text-2xl mb-2">🔷</div>
                <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                  {processedData.signalCounts[selectedTimeframe].BOS}
                </div>
                <div className="text-sm text-blue-600 dark:text-blue-300">Break of Structure</div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6">
                <div className="text-2xl mb-2">🔄</div>
                <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">
                  {processedData.signalCounts[selectedTimeframe].CHoCH}
                </div>
                <div className="text-sm text-purple-600 dark:text-purple-300">Change of Character</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Volatility Tab */}
      {activeView === 'volatility' && (
        <div className="space-y-6">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">Most Volatile Assets (Educational Analysis)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {processedData.volatileCoins.map((coin: CoinData, index: number) => (
                <div key={coin.symbol} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">{coin.symbol}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      ${coin.lastPrice.toFixed(6)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${
                      coin.priceChangePercent >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {coin.priceChangePercent >= 0 ? '+' : ''}{coin.priceChangePercent.toFixed(2)}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Vol: {(coin.volume / 1000000).toFixed(1)}M
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Disclaimer */}
      <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-700 rounded-xl p-4">
        <p className="text-red-800 dark:text-red-300 text-sm">
          <strong>⚠️ Educational Tool Only:</strong> This analysis is for educational purposes and identifies potential 
          patterns based on smart money concepts. This is not financial advice. Always conduct your own research, 
          implement proper risk management, and never risk more than you can afford to lose.
        </p>
      </div>
    </div>
  );
}