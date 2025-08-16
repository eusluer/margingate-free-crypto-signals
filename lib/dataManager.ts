import { mutate } from 'swr';
import { getAlarmsUrl, getSignalsUrl, getCoinsUrl, getOHLCVUrl } from './constants';

export class DataManager {
  private static instance: DataManager;
  private refreshInterval: NodeJS.Timeout | null = null;
  
  static getInstance(): DataManager {
    if (!DataManager.instance) {
      DataManager.instance = new DataManager();
    }
    return DataManager.instance;
  }

  // Manuel olarak tüm verileri yenile
  async refreshAllData(): Promise<void> {
    console.log('🔄 Refreshing all data...');
    
    const urls = [
      getAlarmsUrl('en'),
      getSignalsUrl('en'), 
      getCoinsUrl('en'),
      getOHLCVUrl('en'),
      'smc-pa-data'
    ];

    // Tüm SWR cache'ini yenile
    await Promise.all(urls.map(url => mutate(url)));
    
    console.log('✅ All data refreshed');
  }

  // Otomatik yenileme başlat
  startAutoRefresh(intervalMs: number = 300_000): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
    
    console.log(`🔄 Auto-refresh started: every ${intervalMs / 1000} seconds`);
    
    this.refreshInterval = setInterval(() => {
      this.refreshAllData();
    }, intervalMs);
  }

  // Otomatik yenileme durdur
  stopAutoRefresh(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
      console.log('⏹️ Auto-refresh stopped');
    }
  }

  // Spesifik veri tipini yenile
  async refreshData(type: 'alarms' | 'signals' | 'coins' | 'ohlcv' | 'smc-pa'): Promise<void> {
    let url: string;
    
    switch (type) {
      case 'alarms':
        url = getAlarmsUrl('en');
        break;
      case 'signals':
        url = getSignalsUrl('en');
        break;
      case 'coins':
        url = getCoinsUrl('en');
        break;
      case 'ohlcv':
        url = getOHLCVUrl('en');
        break;
      case 'smc-pa':
        url = 'smc-pa-data';
        break;
      default:
        throw new Error(`Unknown data type: ${type}`);
    }
    
    console.log(`🔄 Refreshing ${type} data...`);
    await mutate(url);
    console.log(`✅ ${type} data refreshed`);
  }

  // Sayfa odaklandığında yenile
  setupFocusRefresh(): (() => void) | void {
    if (typeof window !== 'undefined') {
      const handleFocus = () => {
        console.log('👁️ Page focused, refreshing data...');
        this.refreshAllData();
      };

      window.addEventListener('focus', handleFocus);
      
      // Cleanup function
      return () => {
        window.removeEventListener('focus', handleFocus);
      };
    }
  }

  // Bağlantı geri geldiğinde yenile
  setupOnlineRefresh(): (() => void) | void {
    if (typeof window !== 'undefined') {
      const handleOnline = () => {
        console.log('🌐 Connection restored, refreshing data...');
        this.refreshAllData();
      };

      window.addEventListener('online', handleOnline);
      
      // Cleanup function
      return () => {
        window.removeEventListener('online', handleOnline);
      };
    }
  }
}

export const dataManager = DataManager.getInstance();