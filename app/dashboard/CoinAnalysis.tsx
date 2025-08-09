"use client";
import React, { useState, useMemo } from "react";
import useSWR from "swr";
import { fetchJson } from "../../lib/fetchJson";
import { getSignalsUrl, getCoinsUrl, getAlarmsUrl, getOHLCVUrl } from "../../lib/constants";
import { SignalsJson, CoinsJson, AlarmsJson, OHLCVDataJson, Alarm } from "../../lib/types";
import MiniChart from "../../components/MiniChart";

interface CoinData {
  symbol: string;
  price?: number;
  change?: number;
  volume?: number;
}

export default function CoinAnalysis() {
  const { data: signalsData } = useSWR<SignalsJson>(getSignalsUrl('en'), fetchJson, { refreshInterval: 60_000 });
  const { data: coinsData } = useSWR<CoinsJson>(getCoinsUrl('en'), fetchJson, { refreshInterval: 60_000 });
  const { data: alarmsData } = useSWR<AlarmsJson>(getAlarmsUrl('en'), fetchJson, { refreshInterval: 60_000 });
  const { data: ohlcvData } = useSWR<OHLCVDataJson>(getOHLCVUrl('en'), fetchJson, { refreshInterval: 60_000 });
  
  const [selectedCoin, setSelectedCoin] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  // Get all available coins
  const availableCoins = useMemo(() => {
    const coinSet = new Set<string>();
    
    if (signalsData) {
      Object.keys(signalsData.signals).forEach(symbol => coinSet.add(symbol));
    }
    if (coinsData) {
      coinsData.coins.forEach(coin => coinSet.add(coin.symbol));
    }
    if (alarmsData) {
      alarmsData.alarms.forEach(alarm => coinSet.add(alarm.symbol));
    }
    
    return Array.from(coinSet)
      .filter(symbol => symbol.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort();
  }, [signalsData, coinsData, alarmsData, searchQuery]);

  const getCoinData = (symbol: string) => {
    const coinInfo = coinsData?.coins.find(c => c.symbol === symbol);
    return {
      symbol,
      price: coinInfo?.lastPrice,
      change: coinInfo?.priceChangePercent,
      volume: coinInfo?.volume
    };
  };

  const getCoinSignals = (symbol: string) => {
    if (!signalsData?.signals[symbol]) return null;
    return signalsData.signals[symbol];
  };

  const getCoinAlarms = (symbol: string) => {
    if (!alarmsData) return [];
    return alarmsData.alarms.filter(alarm => alarm.symbol === symbol);
  };

  const getChartData = (symbol: string, interval: string = "4h") => {
    if (!ohlcvData?.data?.[symbol]?.[interval]) return [];
    return ohlcvData.data[symbol][interval].slice(-20).map((candle: any) => ({
      close: candle.close,
      time: candle.open_time
    }));
  };

  const getRSIColor = (rsi: number): string => {
    if (rsi >= 70) return "#ef4444";
    if (rsi <= 30) return "#22c55e";
    return "#eab308";
  };

  const getRSIStatus = (rsi: number): { status: string; color: string } => {
    if (rsi >= 70) return { status: "Overbought", color: "text-red-600 dark:text-red-400" };
    if (rsi <= 30) return { status: "Oversold", color: "text-green-600 dark:text-green-400" };
    return { status: "Normal", color: "text-gray-600 dark:text-gray-400" };
  };

  const translateAlarmToPriceAction = (alarm: Alarm): string => {
    if (alarm.type === "LONG") {
      if (alarm.rule.includes("BOS_up equilibrium")) {
        return `Resistance breakout followed by retracement in ${alarm.interval} timeframe. ${alarm.alarm_level?.toFixed(6)} level is critical for trend continuation.`;
      }
    } else if (alarm.type === "SHORT") {
      if (alarm.rule.includes("4h BOS_up + 30m last 20 CHoCH")) {
        return `Trend weakness in 30m after 4h bullish breakout. Bearish signal strengthening.`;
      }
    }
    return alarm.rule;
  };

  const handleCoinSelect = (symbol: string) => {
    setSelectedCoin(symbol);
    setIsDropdownOpen(false);
    setSearchQuery("");
  };

  if (!selectedCoin) {
    return (
      <div className="space-y-6">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl p-8">
          <div className="text-center">
            <div className="text-6xl mb-6">🔍</div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Coin Analysis
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Select a coin for detailed analysis. View RSI levels, alarms, signals, and chart data on a single page.
            </p>
            
            {/* Coin Selector Dropdown */}
            <div className="max-w-md mx-auto mb-8 relative">
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-lg flex items-center justify-between"
                >
                  <span className="text-gray-600 dark:text-gray-400">
                    {selectedCoin ? selectedCoin.replace('USDT', '') : 'Select coin...'}
                  </span>
                  <svg 
                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-50 max-h-96 overflow-hidden">
                    {/* Search Input */}
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <input
                        type="text"
                        placeholder="Search coin..."
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        onClick={e => e.stopPropagation()}
                      />
                    </div>

                    {/* Coins List */}
                    <div className="max-h-80 overflow-y-auto">
                      {availableCoins.length > 0 ? (
                        availableCoins.map(symbol => {
                          const coinData = getCoinData(symbol);
                          const isPositive = (coinData.change || 0) > 0;
                          
                          return (
                            <button
                              key={symbol}
                              onClick={() => handleCoinSelect(symbol)}
                              className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-between border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                            >
                              <div>
                                <div className="font-semibold text-gray-900 dark:text-white">
                                  {symbol.replace('USDT', '')}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {symbol}
                                </div>
                              </div>
                              
                              <div className="text-right">
                                {coinData.price && (
                                  <div className="text-sm font-mono text-gray-900 dark:text-white">
                                    ${coinData.price.toFixed(coinData.price < 1 ? 6 : 2)}
                                  </div>
                                )}
                                {coinData.change && (
                                  <div className={`text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                    {isPositive ? '+' : ''}{coinData.change.toFixed(2)}%
                                  </div>
                                )}
                              </div>
                            </button>
                          );
                        })
                      ) : (
                        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                          No coins found
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Click outside to close */}
              {isDropdownOpen && (
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsDropdownOpen(false)}
                />
              )}
            </div>

            {/* Popular Coins Quick Select */}
            <div className="max-w-4xl mx-auto">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
                Popular Coins
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {availableCoins.slice(0, 12).map(symbol => {
                  const coinData = getCoinData(symbol);
                  const isPositive = (coinData.change || 0) > 0;
                  
                  return (
                    <button
                      key={symbol}
                      onClick={() => handleCoinSelect(symbol)}
                      className="p-4 bg-white dark:bg-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-200 dark:border-gray-600"
                    >
                      <div className="text-sm font-bold text-gray-900 dark:text-white">
                        {symbol.replace('USDT', '')}
                      </div>
                      {coinData.change && (
                        <div className={`text-xs mt-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                          {isPositive ? '+' : ''}{coinData.change.toFixed(2)}%
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const coinData = getCoinData(selectedCoin);
  const signals = getCoinSignals(selectedCoin);
  const alarms = getCoinAlarms(selectedCoin);
  const chartData4h = getChartData(selectedCoin, "4h");
  const chartData30m = getChartData(selectedCoin, "30m");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSelectedCoin("")}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <span className="text-xl">←</span>
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {selectedCoin.replace('USDT', '')}
                <span className="text-lg text-gray-500 ml-2">/ USDT</span>
              </h1>
              {coinData.price && (
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-xl font-mono text-gray-900 dark:text-white">
                    ${coinData.price.toFixed(coinData.price < 1 ? 6 : 2)}
                  </span>
                  {coinData.change && (
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      coinData.change > 0 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                    }`}>
                      {coinData.change > 0 ? '+' : ''}{coinData.change.toFixed(2)}%
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="text-right">
            {coinData.volume && (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                24h Volume: {coinData.volume.toLocaleString("en-US", { 
                  notation: "compact",
                  maximumFractionDigits: 1
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Analysis Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RSI Analysis Card */}
        {signals && (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="text-2xl">📊</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">RSI Analysis</h3>
            </div>
            
            <div className="space-y-4">
              {Object.entries(signals).map(([interval, data]) => {
                if (typeof data.RSI !== 'number') return null;
                const rsiStatus = getRSIStatus(data.RSI);
                
                return (
                  <div key={interval} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-700 dark:text-gray-300">{interval}</span>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        data.RSI >= 70 ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                        data.RSI <= 30 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                        'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}>
                        {rsiStatus.status}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {data.RSI.toFixed(2)}
                      </div>
                      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-full">
                        <div 
                          className="h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${data.RSI}%`,
                            backgroundColor: getRSIColor(data.RSI)
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Chart Analysis Card */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="text-2xl">📈</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Price Movement</h3>
          </div>
          
          <div className="space-y-6">
            {chartData4h.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">4-Hour Chart</h4>
                <div className="h-24 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 flex items-center justify-center">
                  <MiniChart 
                    data={chartData4h} 
                    color={coinData.change && coinData.change > 0 ? "#10b981" : "#ef4444"}
                    positive={coinData.change ? coinData.change > 0 : true}
                  />
                </div>
              </div>
            )}
            
            {chartData30m.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">30-Minute Chart</h4>
                <div className="h-24 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 flex items-center justify-center">
                  <MiniChart 
                    data={chartData30m} 
                    color={coinData.change && coinData.change > 0 ? "#10b981" : "#ef4444"}
                    positive={coinData.change ? coinData.change > 0 : true}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Alarms Card */}
        {alarms.length > 0 && (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="text-2xl">🔔</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Active Alarms</h3>
              <div className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-semibold rounded-full">
                {alarms.length}
              </div>
            </div>
            
            <div className="space-y-4">
              {alarms.map((alarm, index) => (
                <div key={index} className={`p-4 rounded-xl border-l-4 ${
                  alarm.type === 'LONG' 
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-500' 
                    : 'bg-red-50 dark:bg-red-900/20 border-red-500'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`px-3 py-1 rounded-full text-xs font-bold text-white ${
                      alarm.type === 'LONG' ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                      {alarm.type}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {alarm.interval || '4h'}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {translateAlarmToPriceAction(alarm)}
                  </p>
                  {alarm.current_price && alarm.alarm_level && (
                    <div className="mt-3 grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-gray-500">Current: </span>
                        <span className="font-mono">${alarm.current_price.toFixed(6)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Target: </span>
                        <span className="font-mono">${alarm.alarm_level.toFixed(6)}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Signals Card */}
        {signals && (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="text-2xl">⚡</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Technical Signals</h3>
            </div>
            
            <div className="space-y-4">
              {Object.entries(signals).map(([interval, data]) => (
                <div key={interval} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">{interval}</h4>
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-green-600 dark:text-green-400 font-bold text-lg">
                        {data.FVG.length}
                      </div>
                      <div className="text-xs text-gray-500">FVG</div>
                    </div>
                    <div>
                      <div className="text-blue-600 dark:text-blue-400 font-bold text-lg">
                        {data.BOS.length}
                      </div>
                      <div className="text-xs text-gray-500">BOS</div>
                    </div>
                    <div>
                      <div className="text-purple-600 dark:text-purple-400 font-bold text-lg">
                        {data.CHoCH.length}
                      </div>
                      <div className="text-xs text-gray-500">CHoCH</div>
                    </div>
                  </div>
                  
                  {(data.FVG.length > 0 || data.BOS.length > 0 || data.CHoCH.length > 0) && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {data.FVG.length > 0 && (
                          <span className="mr-3">
                            📊 {data.FVG.filter(f => f.type === 'bullish').length} Bullish, {data.FVG.filter(f => f.type === 'bearish').length} Bearish FVG
                          </span>
                        )}
                        {data.BOS.length > 0 && (
                          <span className="mr-3">
                            🔥 {data.BOS.filter(b => b.type === 'BOS_up').length} Up, {data.BOS.filter(b => b.type === 'BOS_down').length} Down BOS
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* No Data Message */}
      {!signals && alarms.length === 0 && (
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl p-8 text-center">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            No Data Found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            No analysis data available for this coin yet. Please try another coin.
          </p>
        </div>
      )}
    </div>
  );
}