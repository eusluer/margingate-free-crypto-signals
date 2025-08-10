import { supabase } from './supabaseClient';

export interface SmcPaData {
  alarms: any[];
  signals: any;
  coins: any[];
  last_update: string;
}

export async function fetchSmcPaData(): Promise<SmcPaData> {
  try {
    // Fetch alarm data
    const { data: alarmData } = await supabase.storage
      .from('margingate')
      .download('alarm.json');
    
    // Fetch signals data
    const { data: signalsData } = await supabase.storage
      .from('margingate')
      .download('signals.json');
    
    // Fetch coins data
    const { data: coinsData } = await supabase.storage
      .from('margingate')
      .download('coins.json');

    // Parse the JSON data
    const alarmJson = alarmData ? JSON.parse(await alarmData.text()) : { alarms: [], last_update: '' };
    const signalsJson = signalsData ? JSON.parse(await signalsData.text()) : { signals: {}, last_update: '' };
    const coinsJson = coinsData ? JSON.parse(await coinsData.text()) : { coins: [], last_update: '' };

    return {
      alarms: alarmJson.alarms || [],
      signals: signalsJson.signals || {},
      coins: coinsJson.coins || [],
      last_update: alarmJson.last_update || signalsJson.last_update || coinsJson.last_update || ''
    };
  } catch (error) {
    console.error('Error fetching SMC-PA data:', error);
    return {
      alarms: [],
      signals: {},
      coins: [],
      last_update: ''
    };
  }
}

export interface AlarmData {
  type: 'LONG' | 'SHORT';
  symbol: string;
  interval?: string;
  bos_4h?: {
    index: number;
    type: string;
    level: number;
  };
  choc_30m?: Array<{
    index: number;
    type: string;
    from: string;
    to: string;
    level: number;
  }>;
  bos_idx?: number;
  bos_level?: number;
  dip_idx?: number;
  dip_price?: number;
  alarm_level?: number;
  current_price?: number;
  rule: string;
}

export interface SignalData {
  FVG: Array<{
    index: number;
    type: 'bullish' | 'bearish';
    gap: [number, number];
  }>;
  BOS: Array<{
    index: number;
    type: string;
    level: number;
  }>;
  CHoCH: Array<{
    index: number;
    type: string;
    from?: string;
    to?: string;
    level: number;
  }>;
  RSI: number;
}

export interface CoinData {
  symbol: string;
  priceChangePercent: number;
  lastPrice: number;
  volume: number;
}