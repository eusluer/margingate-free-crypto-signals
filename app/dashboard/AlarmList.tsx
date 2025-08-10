"use client";
import React, { useState, useMemo } from "react";
import useSWR from "swr";
import { fetchJson } from "../../lib/fetchJson";
import { getAlarmsUrl, getOHLCVUrl } from "../../lib/constants";
import { AlarmsJson, OHLCVDataJson, Alarm } from "../../lib/types";
import MiniChart from "../../components/MiniChart";

export default function AlarmList() {
  const { data, error, isLoading } = useSWR<AlarmsJson>(getAlarmsUrl('en'), fetchJson, { refreshInterval: 300_000 });
  const { data: ohlcvData } = useSWR<OHLCVDataJson>(getOHLCVUrl('en'), fetchJson, { refreshInterval: 300_000 });
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [symbolFilter, setSymbolFilter] = useState("");
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  const alarms = useMemo(() => {
    if (!data) return [];
    let filtered = data.alarms;
    if (typeFilter) filtered = filtered.filter(a => a.type === typeFilter);
    if (symbolFilter) filtered = filtered.filter(a => a.symbol.toLowerCase().includes(symbolFilter.toLowerCase()));
    return filtered;
  }, [data, typeFilter, symbolFilter]);

  const getChartData = (symbol: string, interval: string = "4h") => {
    if (!ohlcvData?.data?.[symbol]?.[interval]) return [];
    return ohlcvData.data[symbol][interval].slice(-15).map((candle: any) => ({
      close: candle.close,
      time: candle.open_time
    }));
  };

  const translateAlarmToPriceAction = (alarm: Alarm): {
    title: string;
    description: string;
    strategy: string;
    risk: string;
    target: string;
  } => {
    if (alarm.type === "LONG") {
      if (alarm.rule.includes("BOS_up equilibrium")) {
        return {
          title: "Uptrend Pullback",
          description: `Price broke an important resistance level (${alarm.bos_level}) in ${alarm.interval} timeframe and is currently retracing to this level. Support level formed around ${alarm.dip_price}.`,
          strategy: `LONG position can be opened when price breaks above ${alarm.alarm_level} level. This would be a strong signal for trend continuation.`,
          risk: `Stop loss should be placed below ${alarm.dip_price} level.`,
          target: `First target could be retesting the ${alarm.bos_level} level.`
        };
      }
    } else if (alarm.type === "SHORT") {
      if (alarm.rule.includes("4h BOS_up + 30m last 20 CHoCH")) {
        const chocDirection = alarm.choc_30m?.[0]?.from === "BOS_up" && alarm.choc_30m?.[0]?.to === "BOS_down";
        return {
          title: "Trend Weakness and Bearish Signal",
          description: `Price broke ${alarm.bos_4h?.level} level in 4h timeframe but trend character changed in 30m chart. ${chocDirection ? 'Transition from bullish to bearish' : 'Momentum change'} is observed.`,
          strategy: `Break below ${alarm.choc_30m?.[0]?.level} level in 30m chart gives strong signal for SHORT position.`,
          risk: `Stop loss should be above 4h BOS level ${alarm.bos_4h?.level}.`,
          target: `First target should be sought at 30m support levels.`
        };
      }
    }

    return {
      title: "Technical Analysis Signal",
      description: alarm.rule,
      strategy: `Opportunity can be evaluated for ${alarm.type} position.`,
      risk: "Proper risk management is required.",
      target: "Target levels should be determined according to technical analysis."
    };
  };

  const getAlarmStatusColor = (alarm: Alarm) => {
    if (alarm.type === "LONG") {
      if (alarm.current_price && alarm.alarm_level) {
        const distance = Math.abs(alarm.current_price - alarm.alarm_level) / alarm.alarm_level * 100;
        if (distance < 1) return "border-green-500 bg-green-50 dark:bg-green-900/20";
        if (distance < 3) return "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20";
      }
      return "border-green-200 dark:border-green-800";
    } else {
      return "border-red-200 dark:border-red-800";
    }
  };

  if (isLoading) return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      <span className="ml-2">Loading alarms...</span>
    </div>
  );
  
  if (error) return <div className="text-red-500 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">Failed to load alarm data.</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Trading Alarms</h2>
            <p className="text-gray-600 dark:text-gray-400">Price action based entry opportunities</p>
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
              <button
                onClick={() => setTypeFilter(null)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                  !typeFilter 
                    ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm" 
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setTypeFilter("LONG")}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                  typeFilter === "LONG" 
                    ? "bg-green-500 text-white shadow-sm" 
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                Long
              </button>
              <button
                onClick={() => setTypeFilter("SHORT")}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                  typeFilter === "SHORT" 
                    ? "bg-red-500 text-white shadow-sm" 
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                Short
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {alarms.map((alarm, i) => {
            const priceAction = translateAlarmToPriceAction(alarm);
            const isExpanded = expandedCard === i;
            const chartData = getChartData(alarm.symbol, alarm.interval || "4h");
            const chartColor = alarm.type === "LONG" ? "#10b981" : "#ef4444";
            
            return (
              <div
                key={i}
                className={`group relative bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-2 ${getAlarmStatusColor(alarm)} ${
                  isExpanded ? 'col-span-full' : ''
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative z-10 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {alarm.symbol.replace("USDT", "")}
                        </h3>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold text-white ${
                          alarm.type === "LONG" ? "bg-green-500" : "bg-red-500"
                        }`}>
                          {alarm.type}
                        </div>
                        <div className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full">
                          {alarm.interval || "4h"}
                        </div>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                        {priceAction.title}
                      </h4>
                    </div>
                  </div>

                  {!isExpanded ? (
                    <>
                      <div className="mb-4">
                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                          {priceAction.description}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        {alarm.current_price && (
                          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                            <div className="text-xs text-gray-500 mb-1">Current Price</div>
                            <div className="font-bold text-gray-900 dark:text-white">
                              ${alarm.current_price.toFixed(6)}
                            </div>
                          </div>
                        )}
                        {alarm.alarm_level && (
                          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
                            <div className="text-xs text-blue-600 dark:text-blue-400 mb-1">Trigger Level</div>
                            <div className="font-bold text-blue-700 dark:text-blue-300">
                              ${alarm.alarm_level.toFixed(6)}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="h-16 mb-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-2 flex items-center justify-center">
                        {chartData.length > 0 ? (
                          <MiniChart 
                            data={chartData} 
                            color={chartColor}
                            positive={alarm.type === "LONG"}
                          />
                        ) : (
                          <div className="text-xs text-gray-400">No chart data</div>
                        )}
                      </div>

                      <button
                        onClick={() => setExpandedCard(i)}
                        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors text-sm"
                      >
                        View Detailed Analysis
                      </button>
                    </>
                  ) : (
                    <AlarmCardExpanded 
                      alarm={alarm} 
                      priceAction={priceAction}
                      chartData={chartData}
                      chartColor={chartColor}
                      onClose={() => setExpandedCard(null)}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {alarms.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">No alarms found matching criteria</div>
            <div className="text-gray-500 text-sm">Try different filters</div>
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

interface AlarmCardExpandedProps {
  alarm: Alarm;
  priceAction: {
    title: string;
    description: string;
    strategy: string;
    risk: string;
    target: string;
  };
  chartData: Array<{ close: number; time: number }>;
  chartColor: string;
  onClose: () => void;
}

function AlarmCardExpanded({ alarm, priceAction, chartData, chartColor, onClose }: AlarmCardExpandedProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-bold text-gray-900 dark:text-white">
          Detailed Price Action Analysis
        </h4>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <span className="text-gray-500">✕</span>
        </button>
      </div>

      <div className="h-32 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 flex items-center justify-center">
        {chartData.length > 0 ? (
          <MiniChart 
            data={chartData} 
            color={chartColor}
            positive={alarm.type === "LONG"}
          />
        ) : (
          <div className="text-gray-400">No chart data</div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
            <h5 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">📊 Market Condition</h5>
            <p className="text-blue-800 dark:text-blue-300 text-sm leading-relaxed">
              {priceAction.description}
            </p>
          </div>

          <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-xl">
            <h5 className="font-semibold text-green-900 dark:text-green-200 mb-2">🎯 Strategy</h5>
            <p className="text-green-800 dark:text-green-300 text-sm leading-relaxed">
              {priceAction.strategy}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-red-50 dark:bg-red-900/30 rounded-xl">
            <h5 className="font-semibold text-red-900 dark:text-red-200 mb-2">⚠️ Risk Management</h5>
            <p className="text-red-800 dark:text-red-300 text-sm leading-relaxed">
              {priceAction.risk}
            </p>
          </div>

          <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-xl">
            <h5 className="font-semibold text-purple-900 dark:text-purple-200 mb-2">🏆 Target</h5>
            <p className="text-purple-800 dark:text-purple-300 text-sm leading-relaxed">
              {priceAction.target}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {alarm.current_price && (
          <div className="text-center p-3 bg-gray-100 dark:bg-gray-700 rounded-xl">
            <div className="text-xs text-gray-500 mb-1">Current Price</div>
            <div className="font-bold text-gray-900 dark:text-white text-sm">
              ${alarm.current_price.toFixed(6)}
            </div>
          </div>
        )}
        {alarm.alarm_level && (
          <div className="text-center p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
            <div className="text-xs text-blue-600 dark:text-blue-400 mb-1">Trigger</div>
            <div className="font-bold text-blue-700 dark:text-blue-300 text-sm">
              ${alarm.alarm_level.toFixed(6)}
            </div>
          </div>
        )}
        {alarm.bos_level && (
          <div className="text-center p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
            <div className="text-xs text-green-600 dark:text-green-400 mb-1">BOS Level</div>
            <div className="font-bold text-green-700 dark:text-green-300 text-sm">
              ${alarm.bos_level.toFixed(6)}
            </div>
          </div>
        )}
        {alarm.dip_price && (
          <div className="text-center p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
            <div className="text-xs text-red-600 dark:text-red-400 mb-1">Support/Low</div>
            <div className="font-bold text-red-700 dark:text-red-300 text-sm">
              ${alarm.dip_price.toFixed(6)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 