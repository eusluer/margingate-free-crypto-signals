import { supabase } from './supabaseClient';

// Dosya tipleri (ornek_json klasörü baz alınarak)
export interface AlarmScanJson {
  scan_timestamp: string;
  interval: string; // '2h' | '4h'
  total_alarms: number;
  alarms: Array<{
    symbol: string;
    current_price: number;
    range_low: number;
    range_high: number;
    range_mid: number;
    range_position_pct: number;
    timestamp: string;
  }>;
}

export interface EntryLongSignalsJson {
  scan_timestamp: string;
  total_coins: number;
  analyzed_coins: number;
  active_signals: Array<{
    symbol: string;
    timestamp: string;
    signal_type: string; // e.g. BULLISH_CHOCH
    choch_level: number;
    current_price: number;
    distance_pct: number;
    max_distance_pct: number;
    signal_active: boolean;
    break_timestamp: string;
  }>;
  all_results: Array<any>;
}

export interface EntryShortSignalsJson {
  scan_timestamp: string;
  total_coins: number;
  analyzed_coins: number;
  above_range_coins?: number;
  active_signals: Array<{
    symbol: string;
    timestamp: string;
    signal_type: string; // e.g. BEARISH_CHOCH_COMBO
    signal_30m: null | {
      symbol: string;
      timestamp: string;
      signal_type: string;
      choch_level: number;
      current_price: number;
      distance_pct: number;
      max_distance_pct: number;
      signal_active: boolean;
      break_timestamp: string;
      interval: '30m';
    };
    signal_15m: null | {
      symbol: string;
      timestamp: string;
      signal_type: string;
      choch_level: number;
      current_price: number;
      distance_pct: number;
      max_distance_pct: number;
      signal_active: boolean;
      break_timestamp: string;
      interval: '15m';
    };
    signal_active: boolean;
    reason: string;
    price_above_range?: boolean;
    above_range_timeframes?: string[];
  }>;
  all_results: Array<any>;
}

export interface SummaryJson {
  timestamp: string;
  total_coins_scanned: number;
  short_signals: {
    count: number;
    coins: Array<{
      symbol: string;
      timeframes: string[];
      choch_30m: number | null;
      choch_15m: number | null;
    }>;
  };
  long_signals: {
    range_ici: {
      count: number;
      coins: Array<{ symbol: string; interval: string; current_price: number; range_position_pct: number }>;
    };
    entry_sinyali: {
      count: number;
      coins: Array<{ symbol: string; current_price: number; choch_level: number }>;
    };
  };
}

export interface SmcPaData {
  alarm_2h: AlarmScanJson | null;
  alarm_4h: AlarmScanJson | null;
  entry_long: EntryLongSignalsJson | null;
  entry_short: EntryShortSignalsJson | null;
  summary: SummaryJson | null;
  last_update: string | null;
}

export async function fetchSmcPaData(): Promise<SmcPaData> {
  try {
    async function downloadJson(path: string) {
      // Bazı projelerde klasör içinde tutulabiliyor: 'margingate/<file>'
      const rootTry = await supabase.storage.from('margingate').download(path);
      if (rootTry.data) return rootTry;
      const nestedTry = await supabase.storage
        .from('margingate')
        .download(`margingate/${path}`);
      return nestedTry;
    }

    const [alarm2hRes, alarm4hRes, entryLongRes, entryShortRes, summaryRes] = await Promise.all([
      downloadJson('alarm_2h.json'),
      downloadJson('alarm_4h.json'),
      downloadJson('entry_long_signals.json'),
      downloadJson('entry_short_signals.json'),
      downloadJson('sonuc.json'),
    ]);

    const alarm_2h: AlarmScanJson | null = alarm2hRes.data ? JSON.parse(await alarm2hRes.data.text()) : null;
    const alarm_4h: AlarmScanJson | null = alarm4hRes.data ? JSON.parse(await alarm4hRes.data.text()) : null;
    const entry_long: EntryLongSignalsJson | null = entryLongRes.data ? JSON.parse(await entryLongRes.data.text()) : null;
    const entry_short: EntryShortSignalsJson | null = entryShortRes.data ? JSON.parse(await entryShortRes.data.text()) : null;
    const summary: SummaryJson | null = summaryRes.data ? JSON.parse(await summaryRes.data.text()) : null;

    const timestamps: string[] = [];
    if (alarm_2h?.scan_timestamp) timestamps.push(alarm_2h.scan_timestamp);
    if (alarm_4h?.scan_timestamp) timestamps.push(alarm_4h.scan_timestamp);
    if (entry_long?.scan_timestamp) timestamps.push(entry_long.scan_timestamp);
    if (entry_short?.scan_timestamp) timestamps.push(entry_short.scan_timestamp);
    if (summary?.timestamp) timestamps.push(summary.timestamp);

    const last_update = timestamps.length > 0 ? timestamps.sort().slice(-1)[0] : null;

    return { alarm_2h, alarm_4h, entry_long, entry_short, summary, last_update };
  } catch (error) {
    console.error('Error fetching SMC-PA data:', error);
    return {
      alarm_2h: null,
      alarm_4h: null,
      entry_long: null,
      entry_short: null,
      summary: null,
      last_update: null
    };
  }
}

// Eski tipleri bu dosyayı kullanan diğer yerler için dışa aktarmıyoruz. Sadece SMC-PA ekranı bu tipleri kullanıyor.