const BASE_URL = 'https://muwqydzmponlsoagasnw.supabase.co/storage/v1/object/public/signals';

export const getCoinsUrl = (language: string = 'tr') => 
  `${BASE_URL}/coins.json`;

export const getSignalsUrl = (language: string = 'tr') => 
  `${BASE_URL}/signals_${language}.json`;

export const getAlarmsUrl = (language: string = 'tr') => 
  `${BASE_URL}/alarm_${language}.json`;

export const getOHLCVUrl = (language: string = 'tr') => 
  `${BASE_URL}/ohlcv_data_${language}.json`;

export const COINS_URL = getCoinsUrl();
export const SIGNALS_URL = getSignalsUrl();
export const ALARMS_URL = getAlarmsUrl();
export const OHLCV_URL = getOHLCVUrl(); 