export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  settings: {
    theme?: 'light' | 'dark';
    notifications?: boolean;
    defaultTimeframe?: string;
    [key: string]: any;
  };
  trading_preferences: {
    defaultLeverage?: number;
    riskPerTrade?: number;
    [key: string]: any;
  };
}

export interface Watchlist {
  id: string;
  user_id: string;
  name: string;
  symbols: string[];
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  symbol: string;
  type: 'market' | 'limit' | 'stop' | 'stop_limit';
  side: 'buy' | 'sell';
  quantity: number;
  price?: number;
  stop_price?: number;
  status: 'pending' | 'filled' | 'cancelled' | 'rejected';
  created_at: string;
  updated_at: string;
  filled_at?: string;
  metadata: {
    exchange?: string;
    fees?: number;
    [key: string]: any;
  };
}

export interface Position {
  id: string;
  user_id: string;
  symbol: string;
  side: 'long' | 'short';
  entry_price: number;
  current_price: number;
  quantity: number;
  pnl: number;
  pnl_percent: number;
  created_at: string;
  updated_at: string;
  closed_at?: string;
  metadata: {
    leverage?: number;
    stop_loss?: number;
    take_profit?: number;
    [key: string]: any;
  };
}

export interface Screener {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  filters: {
    [key: string]: any;
  };
  created_at: string;
  updated_at: string;
}

export interface Backtest {
  id: string;
  user_id: string;
  name: string;
  strategy: {
    [key: string]: any;
  };
  results: {
    [key: string]: any;
  };
  symbol: string;
  timeframe: string;
  start_date: string;
  end_date: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  metadata: {
    [key: string]: any;
  };
} 