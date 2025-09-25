// Alpaca Trading API Service
// This connects to Alpaca's brokerage API for real trading

interface AlpacaConfig {
  apiKey: string;
  secretKey: string;
  isPaper: boolean;
  baseUrl: string;
}

export interface AlpacaAccount {
  id: string;
  account_number: string;
  status: string;
  currency: string;
  buying_power: string;
  regt_buying_power: string;
  daytrading_buying_power: string;
  cash: string;
  portfolio_value: string;
  pattern_day_trader: boolean;
  trading_blocked: boolean;
  transfers_blocked: boolean;
  account_blocked: boolean;
  created_at: string;
  trade_suspended_by_user: boolean;
  multiplier: string;
  shorting_enabled: boolean;
  equity: string;
  last_equity: string;
  long_market_value: string;
  short_market_value: string;
  initial_margin: string;
  maintenance_margin: string;
  last_maintenance_margin: string;
  sma: string;
  daytrade_count: number;
}

export interface AlpacaPosition {
  asset_id: string;
  symbol: string;
  exchange: string;
  asset_class: string;
  avg_entry_price: string;
  qty: string;
  side: string;
  market_value: string;
  cost_basis: string;
  unrealized_pl: string;
  unrealized_plpc: string;
  unrealized_intraday_pl: string;
  unrealized_intraday_plpc: string;
  current_price: string;
  lastday_price: string;
  change_today: string;
}

export interface AlpacaOrder {
  id: string;
  client_order_id: string;
  created_at: string;
  updated_at: string;
  submitted_at: string;
  filled_at: string | null;
  expired_at: string | null;
  canceled_at: string | null;
  failed_at: string | null;
  replaced_at: string | null;
  replaced_by: string | null;
  replaces: string | null;
  asset_id: string;
  symbol: string;
  asset_class: string;
  notional: string | null;
  qty: string;
  filled_qty: string;
  filled_avg_price: string | null;
  order_class: string;
  order_type: string;
  type: string;
  side: string;
  time_in_force: string;
  limit_price: string | null;
  stop_price: string | null;
  status: string;
  extended_hours: boolean;
  legs: AlpacaOrder[] | null;
}

class AlpacaAPI {
  private config: AlpacaConfig | null = null;

  constructor() {
    this.loadConfig();
  }

  private loadConfig() {
    // First check for new API configuration format
    const apiCredentials = localStorage.getItem('api_credentials');
    const productionMode = localStorage.getItem('production_mode') === 'true';
    
    if (apiCredentials) {
      const creds = JSON.parse(apiCredentials);
      if (creds.alpaca) {
        this.config = {
          apiKey: productionMode ? creds.alpaca.keyId : creds.alpaca.paperKeyId,
          secretKey: productionMode ? creds.alpaca.secretKey : creds.alpaca.paperSecretKey,
          isPaper: !productionMode,
          baseUrl: productionMode ? 'https://api.alpaca.markets' : 'https://paper-api.alpaca.markets'
        };
        return;
      }
    }
    
    // Fall back to old config format
    const savedConfig = localStorage.getItem('alpacaConfig');
    if (savedConfig) {
      this.config = JSON.parse(savedConfig);
    }
  }

  private getHeaders() {
    this.loadConfig(); // Reload config each time to get latest values
    
    if (!this.config?.apiKey || !this.config?.secretKey) {
      throw new Error('Alpaca API keys not configured. Please configure your API keys in the API Configuration tab.');
    }

    return {
      'APCA-API-KEY-ID': this.config.apiKey,
      'APCA-API-SECRET-KEY': this.config.secretKey,
      'Content-Type': 'application/json'
    };
  }

  private getBaseUrl(): string {
    this.loadConfig();
    return this.config?.baseUrl || 'https://paper-api.alpaca.markets';
  }

  async getAccount(): Promise<AlpacaAccount> {
    const response = await fetch(`${this.getBaseUrl()}/v2/account`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch account');
    return response.json();
  }

  async getPositions(): Promise<AlpacaPosition[]> {
    const response = await fetch(`${this.getBaseUrl()}/v2/positions`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch positions');
    return response.json();
  }

  async getOrders(status?: string): Promise<AlpacaOrder[]> {
    const params = status ? `?status=${status}` : '';
    const response = await fetch(`${this.getBaseUrl()}/v2/orders${params}`, {
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch orders');
    return response.json();
  }

  async createOrder(params: {
    symbol: string;
    qty?: number;
    notional?: number;
    side: 'buy' | 'sell';
    type: 'market' | 'limit' | 'stop' | 'stop_limit';
    time_in_force: 'day' | 'gtc' | 'opg' | 'cls' | 'ioc' | 'fok';
    limit_price?: number;
    stop_price?: number;
    extended_hours?: boolean;
  }): Promise<AlpacaOrder> {
    const response = await fetch(`${this.getBaseUrl()}/v2/orders`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(params),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create order');
    }
    return response.json();
  }

  async cancelOrder(orderId: string): Promise<void> {
    const response = await fetch(`${this.getBaseUrl()}/v2/orders/${orderId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to cancel order');
  }

  async getMarketData(symbol: string): Promise<any> {
    const response = await fetch(
      `https://data.alpaca.markets/v2/stocks/${symbol}/bars/latest`,
      { headers: this.getHeaders() }
    );
    if (!response.ok) throw new Error('Failed to fetch market data');
    return response.json();
  }

  async getHistoricalBars(
    symbol: string,
    timeframe: string,
    start: string,
    end?: string
  ): Promise<any> {
    const params = new URLSearchParams({
      symbols: symbol,
      timeframe,
      start,
      ...(end && { end }),
    });
    const response = await fetch(
      `https://data.alpaca.markets/v2/stocks/bars?${params}`,
      { headers: this.getHeaders() }
    );
    if (!response.ok) throw new Error('Failed to fetch historical data');
    return response.json();
  }

  isConfigured(): boolean {
    this.loadConfig();
    return !!(this.config?.apiKey && this.config?.secretKey);
  }

  isPaperTrading(): boolean {
    this.loadConfig();
    return this.config?.isPaper !== false;
  }
}

export const alpacaAPI = new AlpacaAPI();