"use client";
import React, { useState, useMemo } from "react";
import useSWR from "swr";
import { fetchSmcPaData } from "../../lib/supabaseStorage";
import type { AlarmScanJson, SummaryJson } from "../../lib/supabaseStorage";

type ProcessedData = {
  totalAlarms: number;
  longEntryCount: number;
  shortComboCount: number;
  recentAlarms: Array<AlarmScanJson["alarms"][number] & { interval: string }>;
  shortSignalsByTf: Record<string, Array<SummaryJson["short_signals"]["coins"][number]>>;
  lastUpdate: string | null;
};

export default function SmcPaAnalysis() {
  const { data, error, isLoading } = useSWR("smc-pa-data", fetchSmcPaData, {
    refreshInterval: 300_000, // 5 minutes = 300,000 milliseconds
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  });

  const [activeView, setActiveView] = useState<
    "overview" | "alarms" | "signals" | "volatility"
  >("overview");
  const [selectedTimeframe, setSelectedTimeframe] = useState<
    "4h" | "2h" | "30m" | "15m"
  >("4h");

  const processedData: ProcessedData | null = useMemo(() => {
    if (!data) return null;

    const alarm2h = data.alarm_2h?.alarms ?? [];
    const alarm4h = data.alarm_4h?.alarms ?? [];
    const totalAlarms = (data.alarm_2h?.total_alarms ?? 0) + (data.alarm_4h?.total_alarms ?? 0);

    const recentAlarms = [
      ...alarm4h.map((a) => ({ ...a, interval: "4h" })),
      ...alarm2h.map((a) => ({ ...a, interval: "2h" })),
    ].slice(0, 8);

    const longEntryCount = data.entry_long?.active_signals?.length ?? 0;
    const shortComboCount = data.entry_short?.active_signals?.length ?? 0;

    // Short signals coin listesini zaman dilimine göre gruplama (sonuc.json)
    const shortCoins = data.summary?.short_signals?.coins ?? [];
    const shortSignalsByTf: ProcessedData["shortSignalsByTf"] = shortCoins.reduce(
      (acc, c) => {
        // 4h ve 2h için doğrudan timeframes listesi var
        ["4h", "2h"].forEach((tf) => {
          if (c.timeframes?.includes(tf)) {
            if (!acc[tf]) acc[tf] = [];
            acc[tf].push(c);
          }
        });
        // 30m/15m için choch değerleri mevcutsa ekle
        if (c.choch_30m !== null && c.choch_30m !== undefined) {
          if (!acc["30m"]) acc["30m"] = [];
          acc["30m"].push(c);
        }
        if (c.choch_15m !== null && c.choch_15m !== undefined) {
          if (!acc["15m"]) acc["15m"] = [];
          acc["15m"].push(c);
        }
        return acc;
      },
      {} as Record<string, Array<SummaryJson["short_signals"]["coins"][number]>>
    );

    return {
      totalAlarms,
      longEntryCount,
      shortComboCount,
      recentAlarms,
      shortSignalsByTf,
      lastUpdate: data.last_update ?? null,
    };
  }, [data]);

  if (isLoading)
    return (
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

  if (!processedData)
    return (
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
              {processedData.lastUpdate
                ? new Date(processedData.lastUpdate).toLocaleString()
                : 'N/A'}
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
              { id: 'volatility', label: 'Short Signals Map', icon: '⚡' },
            ].map((tab) => (
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
            <div className="text-3xl mb-2">🚨</div>
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">{processedData.totalAlarms}</div>
            <div className="text-sm text-blue-600 dark:text-blue-300">Aktif Alarm (4h + 2h)</div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6">
            <div className="text-3xl mb-2">🟢</div>
            <div className="text-2xl font-bold text-green-700 dark:text-green-400">{processedData.longEntryCount}</div>
            <div className="text-sm text-green-600 dark:text-green-300">Long Entry Sinyalleri</div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-xl p-6">
            <div className="text-3xl mb-2">🔴</div>
            <div className="text-2xl font-bold text-red-700 dark:text-red-400">{processedData.shortComboCount}</div>
            <div className="text-sm text-red-600 dark:text-red-300">Short CHOCH Kombinasyonları</div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6">
            <div className="text-3xl mb-2">⚡</div>
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-400">{Object.values(processedData.shortSignalsByTf).reduce((a, b) => a + b.length, 0)}</div>
            <div className="text-sm text-purple-600 dark:text-purple-300">Short Sinyal Adayları (toplam)</div>
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
            {processedData.recentAlarms.map((alarm, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-l-4 border-blue-500">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{alarm.symbol}</h3>
                    <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                      {alarm.timestamp} · {alarm.range_position_pct?.toFixed(2)}%
                    </span>
                  </div>
                  <span className="bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 px-2 py-1 rounded text-sm">{alarm.interval}</span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Current Price</span>
                    <span className="font-mono">${alarm.current_price?.toFixed(6)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Range Low / Mid / High</span>
                    <span className="font-mono">${alarm.range_low?.toFixed(6)} / ${alarm.range_mid?.toFixed(6)} / ${alarm.range_high?.toFixed(6)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Signals Tab */}
      {activeView === 'signals' && (
        <div className="space-y-6">
          {/* Long & Short Signals */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Long Entry */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-xl">
              <h3 className="text-lg font-bold mb-4">Long Entry Sinyalleri</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data?.entry_long?.active_signals?.map((s, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-green-800 dark:text-green-300">{s.symbol}</div>
                      <span className="text-xs px-2 py-0.5 rounded bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200">
                        {s.signal_type}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-gray-700 dark:text-gray-300 flex justify-between">
                      <span>Price</span>
                      <span className="font-mono">${s.current_price.toFixed(6)}</span>
                    </div>
                    <div className="text-sm text-gray-700 dark:text-gray-300 flex justify-between">
                      <span>CHOCH</span>
                      <span className="font-mono">${s.choch_level.toFixed(6)}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Dist: {s.distance_pct.toFixed(2)}% · Max: {s.max_distance_pct}%</div>
                  </div>
                ))}
                {(!data?.entry_long?.active_signals || data.entry_long.active_signals.length === 0) && (
                  <div className="text-sm text-gray-500">Aktif long sinyali yok.</div>
                )}
              </div>
            </div>

            {/* Short Combo */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Short CHOCH Kombinasyonları</h3>
                <div className="flex gap-2">
                  {(["4h", "2h", "30m", "15m"] as const).map((tf) => (
                    <button
                      key={tf}
                      onClick={() => setSelectedTimeframe(tf)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium ${
                        selectedTimeframe === tf
                          ? "bg-purple-600 text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data?.entry_short?.active_signals
                  ?.filter((s) => {
                    if (selectedTimeframe === "4h" || selectedTimeframe === "2h") {
                      return s.above_range_timeframes?.includes(selectedTimeframe);
                    }
                    if (selectedTimeframe === "30m") return Boolean(s.signal_30m);
                    if (selectedTimeframe === "15m") return Boolean(s.signal_15m);
                    return true;
                  })
                  .map((s, idx) => (
                    <div key={idx} className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20">
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-red-800 dark:text-red-300">{s.symbol}</div>
                        <span className="text-xs px-2 py-0.5 rounded bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200">
                          {s.signal_type}
                        </span>
                      </div>
                      {s.signal_30m && (
                        <div className="mt-2 text-xs text-gray-700 dark:text-gray-300 flex justify-between">
                          <span>30m</span>
                          <span className="font-mono">${s.signal_30m.choch_level.toFixed(6)} · {s.signal_30m.distance_pct.toFixed(2)}%</span>
                        </div>
                      )}
                      {s.signal_15m && (
                        <div className="text-xs text-gray-700 dark:text-gray-300 flex justify-between">
                          <span>15m</span>
                          <span className="font-mono">${s.signal_15m.choch_level.toFixed(6)} · {s.signal_15m.distance_pct.toFixed(2)}%</span>
                        </div>
                      )}
                      {(!s.signal_30m && !s.signal_15m) && (
                        <div className="text-xs text-gray-500 mt-2">Sadece 4h/2h üstü durum.</div>
                      )}
                      <div className="text-xs text-gray-500 mt-1">{s.reason}</div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Volatility Tab */}
      {activeView === 'volatility' && (
        <div className="space-y-6">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">Short Sinyal Adayları</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {["4h", "2h", "30m", "15m"].map((tf) => (
                <button
                  key={tf}
                  onClick={() => setSelectedTimeframe(tf as any)}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    selectedTimeframe === tf
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(processedData.shortSignalsByTf[selectedTimeframe] || []).map((c) => (
                <div key={`${c.symbol}-${selectedTimeframe}`} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">{c.symbol}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">{c.timeframes?.join(', ')}</div>
                  </div>
                  <div className="text-right text-sm text-gray-700 dark:text-gray-300">
                    {selectedTimeframe === '30m' && c.choch_30m !== null && <span>CHOCH: ${c.choch_30m?.toString()}</span>}
                    {selectedTimeframe === '15m' && c.choch_15m !== null && <span>CHOCH: ${c.choch_15m?.toString()}</span>}
                    {(selectedTimeframe === '4h' || selectedTimeframe === '2h') && <span>Higher TF</span>}
                  </div>
                </div>
              ))}
              {!(processedData.shortSignalsByTf[selectedTimeframe]?.length) && (
                <div className="text-sm text-gray-500">Seçilen zaman diliminde aday bulunamadı.</div>
              )}
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