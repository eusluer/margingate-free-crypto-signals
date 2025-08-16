"use client";
import React, { useState, useMemo } from "react";
import useSWR from "swr";
import { fetchJson } from "../../lib/fetchJson";
import { getSignalsUrl } from "../../lib/constants";
import { SignalsJson } from "../../lib/types";

const timeframes = ["4h", "2h", "30m", "15m"] as const;

interface RSIData {
  symbol: string;
  rsi4h?: number;
  rsi2h?: number;
  rsi30m?: number;
  rsi15m?: number;
}

export default function RSIMap() {
  const { data, error, isLoading } = useSWR<SignalsJson>(getSignalsUrl('en'), fetchJson, { 
    refreshInterval: 300_000,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    dedupingInterval: 60_000
  });
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("4h");
  const [symbolFilter, setSymbolFilter] = useState("");
  const [hoveredCoin, setHoveredCoin] = useState<{coin: RSIData, rsi: number, x: number, y: number} | null>(null);

  const rsiData = useMemo(() => {
    if (!data) return [];
    
    const rsiMap: RSIData[] = [];
    
    Object.entries(data.signals).forEach(([symbol, intervals]) => {
      const coinData: RSIData = { symbol };
      
      if (intervals["4h"]?.RSI !== undefined) coinData.rsi4h = intervals["4h"].RSI;
      if (intervals["2h"]?.RSI !== undefined) coinData.rsi2h = intervals["2h"].RSI;
      if (intervals["30m"]?.RSI !== undefined) coinData.rsi30m = intervals["30m"].RSI;
      if (intervals["15m"]?.RSI !== undefined) coinData.rsi15m = intervals["15m"].RSI;
      
      rsiMap.push(coinData);
    });
    
    return rsiMap.filter(coin => 
      !symbolFilter || coin.symbol.toLowerCase().includes(symbolFilter.toLowerCase())
    );
  }, [data, symbolFilter]);

  const getRSIColor = (rsi: number): string => {
    if (rsi >= 80) return "#dc2626"; // Very overbought - dark red
    if (rsi >= 70) return "#ef4444"; // Overbought - red
    if (rsi >= 60) return "#f97316"; // Approaching overbought - orange
    if (rsi >= 50) return "#eab308"; // Neutral high - yellow
    if (rsi >= 40) return "#84cc16"; // Neutral low - lime
    if (rsi >= 30) return "#22c55e"; // Approaching oversold - green
    if (rsi >= 20) return "#16a34a"; // Oversold - dark green
    return "#15803d"; // Very oversold - very dark green
  };

  const getRSIStatus = (rsi: number): { status: string; color: string } => {
    if (rsi >= 70) return { status: "Overbought", color: "text-red-600" };
    if (rsi <= 30) return { status: "Oversold", color: "text-green-600" };
    return { status: "Normal", color: "text-gray-600" };
  };

  const getChartPositions = (coins: RSIData[], timeframe: string): Array<{coin: RSIData, x: number, y: number, rsi: number}> => {
    const validCoins = coins.filter(coin => {
      const rsiKey = `rsi${timeframe}` as keyof RSIData;
      return coin[rsiKey] !== undefined;
    });

    return validCoins.map((coin, index) => {
      const rsiKey = `rsi${timeframe}` as keyof RSIData;
      const rsi = coin[rsiKey] as number;
      
      // Grid layout
      const itemsPerRow = Math.ceil(Math.sqrt(validCoins.length));
      const row = Math.floor(index / itemsPerRow);
      const col = index % itemsPerRow;
      
      const x = (col + 0.5) * (100 / itemsPerRow);
      const y = ((100 - rsi) / 100) * 90 + 5; // Invert Y axis so low RSI is at bottom
      
      return { coin, x, y, rsi };
    });
  };

  if (isLoading) return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      <span className="ml-2">Loading RSI data...</span>
    </div>
  );
  
  if (error) return <div className="text-red-500 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">Failed to load RSI data.</div>;

  const chartPositions = getChartPositions(rsiData, selectedTimeframe);

  return (
    <div className="space-y-6">
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">RSI Map</h2>
            <p className="text-gray-600 dark:text-gray-400">Visual analysis of RSI levels for all coins</p>
          </div>
          
          <div className="flex items-center gap-4 flex-wrap">
            <input
              type="text"
              placeholder="Search coin..."
              className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              value={symbolFilter}
              onChange={e => setSymbolFilter(e.target.value)}
            />
            
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
              {timeframes.map((tf) => (
                <button
                  key={tf}
                  onClick={() => setSelectedTimeframe(tf)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                    selectedTimeframe === tf 
                      ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm" 
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RSI Legend */}
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">RSI Color Scale</h3>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{backgroundColor: "#15803d"}}></div>
              <span className="text-green-700 dark:text-green-400">Oversold (&lt;20)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{backgroundColor: "#22c55e"}}></div>
              <span className="text-green-600 dark:text-green-400">Bearish (20-30)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{backgroundColor: "#eab308"}}></div>
              <span className="text-yellow-600 dark:text-yellow-400">Normal (30-70)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{backgroundColor: "#ef4444"}}></div>
              <span className="text-red-600 dark:text-red-400">Bullish (70-80)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{backgroundColor: "#dc2626"}}></div>
              <span className="text-red-700 dark:text-red-400">Overbought (&gt;80)</span>
            </div>
          </div>
        </div>

        {/* RSI Chart */}
        <div className="relative bg-white dark:bg-gray-800 rounded-xl p-6 h-96 border border-gray-200 dark:border-gray-700">
          {/* Y-axis labels */}
          <div className="absolute left-2 top-0 h-full flex flex-col justify-between text-xs text-gray-500 py-6">
            <span>100</span>
            <span>80</span>
            <span className="text-red-500 font-semibold">70</span>
            <span>60</span>
            <span>50</span>
            <span>40</span>
            <span className="text-green-500 font-semibold">30</span>
            <span>20</span>
            <span>0</span>
          </div>
          
          {/* Horizontal reference lines */}
          <div className="absolute left-12 right-4 top-0 h-full py-6">
            {/* Overbought line (70) */}
            <div className="absolute w-full border-t-2 border-red-400 dark:border-red-600" style={{top: '30%'}}>
            </div>
            
            {/* Middle line (50) */}
            <div className="absolute w-full border-t border-gray-300 dark:border-gray-600" style={{top: '50%'}}>
            </div>
            
            {/* Oversold line (30) */}
            <div className="absolute w-full border-t-2 border-green-400 dark:border-green-600" style={{top: '70%'}}>
            </div>
          </div>

          {/* Chart area */}
          <div className="ml-12 mr-4 h-full py-6 relative">
            <svg className="w-full h-full">
              {chartPositions.map((position, index) => (
                <g key={position.coin.symbol}>
                  <circle
                    cx={`${position.x}%`}
                    cy={`${position.y}%`}
                    r={hoveredCoin?.coin.symbol === position.coin.symbol ? "12" : "8"}
                    fill={getRSIColor(position.rsi)}
                    stroke={hoveredCoin?.coin.symbol === position.coin.symbol ? "#000" : "#fff"}
                    strokeWidth="2"
                    className="transition-all cursor-pointer hover:stroke-black dark:hover:stroke-white"
                    opacity={hoveredCoin?.coin.symbol === position.coin.symbol ? "1" : "0.8"}
                    onMouseEnter={() => setHoveredCoin(position)}
                    onMouseLeave={() => setHoveredCoin(null)}
                  />
                </g>
              ))}
            </svg>
            
            {/* Tooltip */}
            {hoveredCoin && (
              <div 
                className="absolute z-10 bg-black dark:bg-white text-white dark:text-black px-3 py-2 rounded-lg text-sm font-semibold pointer-events-none shadow-lg"
                style={{
                  left: `${hoveredCoin.x}%`,
                  top: `${hoveredCoin.y}%`,
                  transform: 'translate(-50%, -120%)'
                }}
              >
                <div className="text-center">
                  <div className="font-bold">{hoveredCoin.coin.symbol.replace('USDT', '')}</div>
                  <div className="text-xs">RSI: {hoveredCoin.rsi.toFixed(2)}</div>
                  <div className="text-xs">{getRSIStatus(hoveredCoin.rsi).status}</div>
                </div>
                {/* Tooltip arrow */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black dark:border-t-white"></div>
              </div>
            )}
          </div>
        </div>

        {/* RSI Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          {timeframes.map(tf => {
            const tfRSIData = rsiData.filter(coin => {
              const rsiKey = `rsi${tf}` as keyof RSIData;
              return coin[rsiKey] !== undefined;
            });
            
            const overbought = tfRSIData.filter(coin => {
              const rsiKey = `rsi${tf}` as keyof RSIData;
              return (coin[rsiKey] as number) > 70;
            }).length;
            
            const oversold = tfRSIData.filter(coin => {
              const rsiKey = `rsi${tf}` as keyof RSIData;
              return (coin[rsiKey] as number) < 30;
            }).length;
            
            return (
              <div key={tf} className={`p-4 rounded-xl ${selectedTimeframe === tf ? 'bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-200 dark:border-blue-700' : 'bg-gray-50 dark:bg-gray-700/50'}`}>
                <div className="text-lg font-bold text-gray-900 dark:text-white text-center mb-2">{tf}</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-red-600">Overbought:</span>
                    <span className="font-semibold">{overbought}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-600">Oversold:</span>
                    <span className="font-semibold">{oversold}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-semibold">{tfRSIData.length}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Last update: {data?.last_update && new Date(data.last_update).toLocaleString("en-US")}
          </div>
        </div>
      </div>
    </div>
  );
}