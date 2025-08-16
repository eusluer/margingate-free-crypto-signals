"use client";
import React, { useState, useMemo } from "react";
import useSWR from "swr";
import { fetchJson } from "../../lib/fetchJson";
import { getSignalsUrl, getOHLCVUrl } from "../../lib/constants";
import { SignalsJson, SignalIntervalData, OHLCVDataJson } from "../../lib/types";
import MiniChart from "../../components/MiniChart";

const intervals = ["4h", "2h", "1h", "30m", "15m", "5m"];

interface SignalCardData {
  symbol: string;
  intervals: { [key: string]: SignalIntervalData };
}

export default function SignalList() {
  const { data, error, isLoading } = useSWR<SignalsJson>(getSignalsUrl('en'), fetchJson, { 
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
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const signalCards = useMemo(() => {
    if (!data) return [];
    const cards: SignalCardData[] = [];
    Object.entries(data.signals).forEach(([symbol, intervalsObj]) => {
      cards.push({ symbol, intervals: intervalsObj });
    });
    return cards.filter(card => 
      !symbolFilter || card.symbol.toLowerCase().includes(symbolFilter.toLowerCase())
    );
  }, [data, symbolFilter]);

  const getChartData = (symbol: string, interval: string) => {
    if (!ohlcvData?.data?.[symbol]?.[interval]) return [];
    return ohlcvData.data[symbol][interval].slice(-15).map((candle: any) => ({
      close: candle.close,
      time: candle.open_time
    }));
  };

  const getSignalSummary = (intervals: { [key: string]: SignalIntervalData }) => {
    let totalFVG = 0, totalBOS = 0, totalCHoCH = 0;
    Object.values(intervals).forEach(data => {
      totalFVG += data.FVG.length;
      totalBOS += data.BOS.length;
      totalCHoCH += data.CHoCH.length;
    });
    return { totalFVG, totalBOS, totalCHoCH };
  };

  const getRSIStatus = (rsi: number) => {
    if (rsi > 70) return { status: "Overbought", color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/30" };
    if (rsi < 30) return { status: "Oversold", color: "text-green-600 dark:text-green-400", bg: "bg-green-100 dark:bg-green-900/30" };
    return { status: "Normal", color: "text-gray-600 dark:text-gray-400", bg: "bg-gray-100 dark:bg-gray-700/30" };
  };

  if (isLoading) return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      <span className="ml-2">Loading signals...</span>
    </div>
  );
  
  if (error) return <div className="text-red-500 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">Failed to load signal data.</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Signal List</h2>
            <p className="text-gray-600 dark:text-gray-400">Technical analysis signals and RSI data</p>
          </div>
          
          <input
            type="text"
            placeholder="Search coin..."
            className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            value={symbolFilter}
            onChange={e => setSymbolFilter(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {signalCards.map((card, i) => {
            const { totalFVG, totalBOS, totalCHoCH } = getSignalSummary(card.intervals);
            const is30mAvailable = !!card.intervals["30m"];
            const is4hAvailable = !!card.intervals["4h"];
            const isExpanded = expandedCard === card.symbol;
            
            return (
              <div
                key={i}
                className={`group relative bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-gray-200/50 dark:border-gray-700/50 ${
                  isExpanded ? 'col-span-full' : ''
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative z-10 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {card.symbol.replace("USDT", "")}
                      </h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {Object.keys(card.intervals).length} interval
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {is30mAvailable && (
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
                          30m
                        </span>
                      )}
                      {is4hAvailable && (
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium rounded-full">
                          4h
                        </span>
                      )}
                    </div>
                  </div>

                  {!isExpanded ? (
                    <>
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{totalFVG}</div>
                          <div className="text-xs text-gray-500">FVG</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{totalBOS}</div>
                          <div className="text-xs text-gray-500">BOS</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{totalCHoCH}</div>
                          <div className="text-xs text-gray-500">CHoCH</div>
                        </div>
                      </div>

                      {(is30mAvailable || is4hAvailable) && (
                        <div className="mb-4">
                          <div className="h-20 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-2 flex items-center justify-center">
                            {is4hAvailable && getChartData(card.symbol, "4h").length > 0 ? (
                              <MiniChart 
                                data={getChartData(card.symbol, "4h")} 
                                color="#3b82f6"
                                positive={true}
                              />
                            ) : (
                              <div className="text-xs text-gray-400">No 4h chart data</div>
                            )}
                          </div>
                        </div>
                      )}

                      {is4hAvailable && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">RSI (4h)</span>
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${getRSIStatus(card.intervals["4h"].RSI).bg} ${getRSIStatus(card.intervals["4h"].RSI).color}`}>
                              {card.intervals["4h"].RSI.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      )}

                      <button
                        onClick={() => setExpandedCard(card.symbol)}
                        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors text-sm"
                      >
                        Show Details
                      </button>
                    </>
                  ) : (
                    <SignalCardExpanded 
                      card={card} 
                      ohlcvData={ohlcvData}
                      onClose={() => setExpandedCard(null)}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {signalCards.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">No signals found matching criteria</div>
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

interface SignalCardExpandedProps {
  card: SignalCardData;
  ohlcvData?: OHLCVDataJson;
  onClose: () => void;
}

function SignalCardExpanded({ card, ohlcvData, onClose }: SignalCardExpandedProps) {
  const [selectedInterval, setSelectedInterval] = useState<string>("4h");

  const getChartData = (interval: string) => {
    if (!ohlcvData?.data?.[card.symbol]?.[interval]) return [];
    return ohlcvData.data[card.symbol][interval].slice(-20).map((candle: any) => ({
      close: candle.close,
      time: candle.open_time
    }));
  };

  const getRSIStatus = (rsi: number) => {
    if (rsi > 70) return { status: "Overbought", color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/30" };
    if (rsi < 30) return { status: "Oversold", color: "text-green-600 dark:text-green-400", bg: "bg-green-100 dark:bg-green-900/30" };
    return { status: "Normal", color: "text-gray-600 dark:text-gray-400", bg: "bg-gray-100 dark:bg-gray-700/30" };
  };

  const availableIntervals = Object.keys(card.intervals).filter(interval => ["30m", "4h"].includes(interval));
  const currentData = card.intervals[selectedInterval];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-bold text-gray-900 dark:text-white">
          {card.symbol.replace("USDT", "")} Detayları
        </h4>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <span className="text-gray-500">✕</span>
        </button>
      </div>

      {availableIntervals.length > 0 && (
        <div className="flex gap-2">
          {availableIntervals.map(interval => (
            <button
              key={interval}
              onClick={() => setSelectedInterval(interval)}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                selectedInterval === interval
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {interval}
            </button>
          ))}
        </div>
      )}

      {currentData && (
        <>
          <div className="h-32 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 flex items-center justify-center">
            {getChartData(selectedInterval).length > 0 ? (
              <MiniChart 
                data={getChartData(selectedInterval)} 
                color="#3b82f6"
                positive={true}
              />
            ) : (
              <div className="text-gray-400">No chart data</div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h5 className="font-semibold text-gray-900 dark:text-white mb-2">RSI Status</h5>
                <div className={`p-3 rounded-xl ${getRSIStatus(currentData.RSI).bg}`}>
                  <div className="flex items-center justify-between">
                    <span className={`font-medium ${getRSIStatus(currentData.RSI).color}`}>
                      {getRSIStatus(currentData.RSI).status}
                    </span>
                    <span className="font-bold text-lg">{currentData.RSI.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="font-semibold text-gray-900 dark:text-white mb-2">FVG Signals ({currentData.FVG.length})</h5>
                <div className="space-y-2">
                  {currentData.FVG.length > 0 ? currentData.FVG.map((fvg, idx) => (
                    <div key={idx} className={`p-3 rounded-xl ${fvg.type === "bullish" ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"}`}>
                      <div className="flex items-center justify-between">
                        <span className={`font-medium capitalize ${fvg.type === "bullish" ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}>
                          {fvg.type}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {fvg.gap[0]} - {fvg.gap[1]}
                        </span>
                      </div>
                    </div>
                  )) : (
                    <div className="text-gray-400 text-center py-4">No FVG signals</div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h5 className="font-semibold text-gray-900 dark:text-white mb-2">BOS Signals ({currentData.BOS.length})</h5>
                <div className="space-y-2">
                  {currentData.BOS.length > 0 ? currentData.BOS.map((bos, idx) => (
                    <div key={idx} className={`p-3 rounded-xl ${bos.type === "BOS_up" ? "bg-blue-100 dark:bg-blue-900/30" : "bg-orange-100 dark:bg-orange-900/30"}`}>
                      <div className="flex items-center justify-between">
                        <span className={`font-medium ${bos.type === "BOS_up" ? "text-blue-700 dark:text-blue-400" : "text-orange-700 dark:text-orange-400"}`}>
                          {bos.type === "BOS_up" ? "Break Up" : "Break Down"}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {bos.level}
                        </span>
                      </div>
                    </div>
                  )) : (
                    <div className="text-gray-400 text-center py-4">No BOS signals</div>
                  )}
                </div>
              </div>

              <div>
                <h5 className="font-semibold text-gray-900 dark:text-white mb-2">CHoCH Signals ({currentData.CHoCH.length})</h5>
                <div className="space-y-2">
                  {currentData.CHoCH.length > 0 ? currentData.CHoCH.map((ch, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/30">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-purple-700 dark:text-purple-400">
                            Change of Character
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {ch.level}
                          </span>
                        </div>
                        <div className="text-xs text-purple-600 dark:text-purple-400">
                          {ch.from} → {ch.to}
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="text-gray-400 text-center py-4">No CHoCH signals</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 