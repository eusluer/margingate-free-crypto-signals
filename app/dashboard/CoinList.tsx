"use client";
import React, { useState, useMemo, useEffect, useRef } from "react";
import useSWR from "swr";
import { fetchJson } from "../../lib/fetchJson";
import { getCoinsUrl, getOHLCVUrl } from "../../lib/constants";
import { CoinsJson, OHLCVDataJson } from "../../lib/types";
import MiniChart from "../../components/MiniChart";

interface CoinMovement {
  symbol: string;
  previousRank?: number;
  currentRank: number;
  movement: 'up' | 'down' | 'new' | 'same';
}

export default function CoinList() {
  const { data, error, isLoading } = useSWR<CoinsJson>(getCoinsUrl('en'), fetchJson, { 
    refreshInterval: 300_000,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    dedupingInterval: 60_000
  });
  const { data: ohlcvData } = useSWR<OHLCVDataJson>(getOHLCVUrl('en'), fetchJson, { 
    refreshInterval: 300_000,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    dedupingInterval: 60_000
  });
  const [symbolFilter, setSymbolFilter] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"rank" | "volume" | "change">("rank");
  const previousCoinsRef = useRef<CoinMovement[]>([]);

  const coinsWithMovement = useMemo(() => {
    if (!data) return [];
    
    let filtered = data.coins;
    if (symbolFilter) filtered = filtered.filter(c => c.symbol.toLowerCase().includes(symbolFilter.toLowerCase()));
    
    // Sırala
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "volume":
          return (b.volume || 0) - (a.volume || 0);
        case "change":
          return Math.abs(b.change_24h || 0) - Math.abs(a.change_24h || 0);
        default:
          return (a.rank || 999) - (b.rank || 999);
      }
    });
    
    // Hareket hesapla
    const currentCoins = sorted.map((coin, index) => ({
      ...coin,
      currentRank: index + 1,
      movement: 'same' as const
    }));
    
    // Önceki durumla karşılaştır
    const coinsWithMovement = currentCoins.map(coin => {
      const previousCoin = previousCoinsRef.current.find(p => p.symbol === coin.symbol);
      
      let movement: 'up' | 'down' | 'new' | 'same' = 'same';
      
      if (!previousCoin) {
        movement = 'new';
      } else if (previousCoin.currentRank > coin.currentRank) {
        movement = 'up';
      } else if (previousCoin.currentRank < coin.currentRank) {
        movement = 'down';
      }
      
      return {
        ...coin,
        previousRank: previousCoin?.currentRank,
        movement
      };
    });
    
    return coinsWithMovement;
  }, [data, symbolFilter, sortBy]);
  
  // Önceki durumu güncelle
  useEffect(() => {
    if (coinsWithMovement.length > 0) {
      previousCoinsRef.current = coinsWithMovement.map(coin => ({
        symbol: coin.symbol,
        currentRank: coin.currentRank,
        movement: coin.movement
      }));
    }
  }, [coinsWithMovement]);

  const getChartData = (symbol: string) => {
    if (!ohlcvData?.data?.[symbol]?.["4h"]) return [];
    return ohlcvData.data[symbol]["4h"].slice(-10).map((candle: any) => ({
      close: candle.close,
      time: candle.open_time
    }));
  };

  const getMovementIndicator = (movement: 'up' | 'down' | 'new' | 'same', previousRank?: number, currentRank?: number) => {
    switch (movement) {
      case 'up':
        return (
          <div className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-medium">
            <span className="text-green-500">↗️</span>
            <span>↑{previousRank && currentRank ? (previousRank - currentRank) : ''}</span>
          </div>
        );
      case 'down':
        return (
          <div className="flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-xs font-medium">
            <span className="text-red-500">↘️</span>
            <span>↓{previousRank && currentRank ? (currentRank - previousRank) : ''}</span>
          </div>
        );
      case 'new':
        return (
          <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-medium">
            <span className="text-blue-500">✨</span>
            <span>NEW</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700/30 text-gray-600 dark:text-gray-400 rounded-full text-xs font-medium">
            <span>—</span>
          </div>
        );
    }
  };

  if (isLoading) return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      <span className="ml-2">Loading coins...</span>
    </div>
  );
  
  if (error) return <div className="text-red-500 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">Failed to load coin data.</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Coin List</h2>
            <p className="text-gray-600 dark:text-gray-400">Real-time price and trend data</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <input
              type="text"
              placeholder="Search coin..."
              className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              value={symbolFilter}
              onChange={e => setSymbolFilter(e.target.value)}
            />
            
            {/* Sort Options */}
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
              <button
                onClick={() => setSortBy("rank")}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                  sortBy === "rank" 
                    ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm" 
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                📊 Rank
              </button>
              <button
                onClick={() => setSortBy("volume")}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                  sortBy === "volume" 
                    ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm" 
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                💹 Volume
              </button>
              <button
                onClick={() => setSortBy("change")}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                  sortBy === "change" 
                    ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm" 
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                📈 Change
              </button>
            </div>
            
            {/* View Mode */}
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                  viewMode === "grid" 
                    ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm" 
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                Cards
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                  viewMode === "list" 
                    ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm" 
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                List
              </button>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">{coinsWithMovement.length}</div>
            <div className="text-sm text-blue-600 dark:text-blue-500">Total Coins</div>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-700 dark:text-green-400">{coinsWithMovement.filter(c => c.movement === 'up').length}</div>
            <div className="text-sm text-green-600 dark:text-green-500">Moving Up</div>
          </div>
          <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-red-700 dark:text-red-400">{coinsWithMovement.filter(c => c.movement === 'down').length}</div>
            <div className="text-sm text-red-600 dark:text-red-500">Moving Down</div>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">{coinsWithMovement.filter(c => c.movement === 'new').length}</div>
            <div className="text-sm text-purple-600 dark:text-purple-500">New Entries</div>
          </div>
        </div>

        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {coinsWithMovement.map((coin, i) => {
              const isPositive = coin.priceChangePercent > 0;
              const chartData = getChartData(coin.symbol);
              const chartColor = isPositive ? "#10b981" : "#ef4444";
              
              return (
                <div
                  key={i}
                  className="group relative bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-200/50 dark:border-gray-700/50"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            {coin.symbol.replace("USDT", "")}
                          </h3>
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                            #{coin.currentRank}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">USDT</span>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          isPositive 
                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" 
                            : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                        }`}>
                          {isPositive ? "+" : ""}{coin.priceChangePercent.toFixed(2)}%
                        </div>
                        {getMovementIndicator(coin.movement, coin.previousRank, coin.currentRank)}
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        ${typeof coin.lastPrice === 'number' ? coin.lastPrice.toFixed(coin.lastPrice < 1 ? 6 : 2) : coin.lastPrice}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Volume: {coin.volume.toLocaleString("en-US", { 
                          notation: "compact",
                          maximumFractionDigits: 1
                        })}
                      </div>
                    </div>

                    <div className="h-15 mb-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-2 flex items-center justify-center">
                      {chartData.length > 0 ? (
                        <MiniChart 
                          data={chartData} 
                          color={chartColor}
                          positive={isPositive}
                        />
                      ) : (
                        <div className="text-xs text-gray-400">No chart data</div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${isPositive ? "bg-green-500" : "bg-red-500"}`} />
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {isPositive ? "Uptrend" : "Downtrend"}
                        </span>
                      </div>
                      
                      <button className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                        Detail →
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Coin</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-white">Rank</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-white">Movement</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">Price</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">Change</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">Volume</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-white">Trend</th>
                </tr>
              </thead>
              <tbody>
                {coinsWithMovement.map((coin, i) => {
                  const isPositive = coin.priceChangePercent > 0;
                  const chartData = getChartData(coin.symbol);
                  const chartColor = isPositive ? "#10b981" : "#ef4444";
                  
                  return (
                    <tr key={i} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-all">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${isPositive ? "bg-green-500" : "bg-red-500"}`} />
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white">
                              {coin.symbol.replace("USDT", "")}
                            </div>
                            <div className="text-xs text-gray-500">USDT</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                          #{coin.currentRank}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        {getMovementIndicator(coin.movement, coin.previousRank, coin.currentRank)}
                      </td>
                      <td className="py-4 px-4 text-right font-mono text-gray-900 dark:text-white">
                        ${typeof coin.lastPrice === 'number' ? coin.lastPrice.toFixed(coin.lastPrice < 1 ? 6 : 2) : coin.lastPrice}
                      </td>
                      <td className={`py-4 px-4 text-right font-semibold ${isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                        {isPositive ? "+" : ""}{coin.priceChangePercent.toFixed(2)}%
                      </td>
                      <td className="py-4 px-4 text-right text-gray-600 dark:text-gray-400">
                        {coin.volume.toLocaleString("en-US", { 
                          notation: "compact",
                          maximumFractionDigits: 1
                        })}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex justify-center">
                          <div className="w-20 h-10">
                            {chartData.length > 0 ? (
                              <MiniChart 
                                data={chartData} 
                                color={chartColor}
                                positive={isPositive}
                              />
                            ) : (
                              <div className="text-xs text-gray-400 text-center">-</div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {coinsWithMovement.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">No coins found matching criteria</div>
            <div className="text-gray-500 text-sm">Try different search terms</div>
          </div>
        )}
        
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Last update: {data?.last_update && new Date(data.last_update).toLocaleString("en-US")}
          </div>
        </div>
      </div>
    </div>
  );
} 