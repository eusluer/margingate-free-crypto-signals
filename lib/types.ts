// Coin tipi
export interface Coin {
  symbol: string;
  priceChangePercent: number;
  lastPrice: number;
  volume: number;
}

export interface CoinsJson {
  last_update: string;
  coins: Coin[];
}

// Signal tipi
export type SignalType = 'FVG' | 'BOS' | 'CHoCH' | 'RSI';
export type Interval = '1m' | '5m' | '15m' | '30m' | '1h' | '2h' | '4h' | '1d';

export interface FVGSignal {
  index: number;
  type: 'bullish' | 'bearish';
  gap: [number, number];
}
export interface BOSSignal {
  index: number;
  type: 'BOS_up' | 'BOS_down';
  level: number;
}
export interface CHoCHSignal {
  index: number;
  type: 'CHoCH';
  from: string;
  to: string;
  level: number;
}

export interface SignalIntervalData {
  FVG: FVGSignal[];
  BOS: BOSSignal[];
  CHoCH: CHoCHSignal[];
  RSI: number;
}

export interface SignalsJson {
  last_update: string;
  signals: {
    [symbol: string]: {
      [interval: string]: SignalIntervalData;
    };
  };
}

// Alarm tipi
export interface Alarm {
  type: 'LONG' | 'SHORT';
  symbol: string;
  interval?: string;
  bos_idx?: number;
  bos_level?: number;
  dip_idx?: number;
  dip_price?: number;
  alarm_level?: number;
  current_price?: number;
  bos_4h?: BOSSignal;
  choc_30m?: CHoCHSignal[];
  rule: string;
}

export interface AlarmsJson {
  last_update: string;
  alarms: Alarm[];
}

// OHLCV tipi
export interface OHLCVCandle {
  open_time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  close_time: number;
}

export interface OHLCVDataJson {
  last_update: string;
  data: {
    [symbol: string]: {
      [interval: string]: OHLCVCandle[];
    };
  };
} 