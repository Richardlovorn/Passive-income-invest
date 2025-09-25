// Square Payment Integration Service
// Handles payment processing and profit distribution

interface SquareConfig {
  accessToken: string;
  locationId: string;
  accountId?: string;
  merchantId?: string;
  bankAccountId?: string;
  environment: 'sandbox' | 'production';
}

class SquareService {
  private config: SquareConfig | null = null;

  constructor() {
    this.loadConfig();
  }

  private loadConfig() {
    // First check for new API configuration format
    const apiCredentials = localStorage.getItem('api_credentials');
    const productionMode = localStorage.getItem('production_mode') === 'true';
    
    if (apiCredentials) {
      const creds = JSON.parse(apiCredentials);
      if (creds.square) {
        this.config = {
          accessToken: productionMode ? creds.square.accessToken : creds.square.sandboxAccessToken,
          locationId: creds.square.locationId,
          environment: productionMode ? 'production' : 'sandbox'
        };
        return;
      }
    }
    
    // Fall back to old config format
    const savedConfig = localStorage.getItem('squareConfig');
    if (savedConfig) {
      this.config = JSON.parse(savedConfig);
    }
  }

  private getHeaders() {
    this.loadConfig(); // Reload config each time to get latest values
    
    if (!this.config?.accessToken) {
      throw new Error('Square API not configured. Please configure your Square API keys in the API Configuration tab.');
    }

    return {
      'Square-Version': '2024-01-18',
      'Authorization': `Bearer ${this.config.accessToken}`,
      'Content-Type': 'application/json'
    };
  }

  private getBaseUrl(): string {
    this.loadConfig();
    return this.config?.environment === 'production' 
      ? 'https://connect.squareup.com'
      : 'https://connect.squareupsandbox.com';
  }

  async createPayment(amount: number, sourceId: string, note?: string) {
    if (!this.config?.locationId) {
      throw new Error('Square Location ID not configured');
    }

    const response = await fetch(`${this.getBaseUrl()}/v2/payments`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        source_id: sourceId,
        idempotency_key: crypto.randomUUID(),
        amount_money: {
          amount: Math.round(amount * 100), // Convert to cents
          currency: 'USD'
        },
        location_id: this.config.locationId,
        note: note || 'Trading profit distribution'
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.errors?.[0]?.detail || 'Payment failed');
    }

    return response.json();
  }

  async createPayout(amount: number, destination: string) {
    if (!this.config?.locationId) {
      throw new Error('Square Location ID not configured');
    }

    const response = await fetch(`${this.getBaseUrl()}/v2/payouts`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        idempotency_key: crypto.randomUUID(),
        location_id: this.config.locationId,
        payout: {
          amount_money: {
            amount: Math.round(amount * 100),
            currency: 'USD'
          },
          destination: {
            type: 'BANK_ACCOUNT',
            id: destination
          }
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.errors?.[0]?.detail || 'Payout failed');
    }

    return response.json();
  }

  async processTradingProfit(amount: number, description: string) {
    // In a real implementation, this would process the profit through Square
    console.log(`Processing $${amount} via Square: ${description}`);
    
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: crypto.randomUUID(),
          amount: amount,
          status: 'completed',
          description: description,
          timestamp: new Date().toISOString()
        });
      }, 1000);
    });
  }

  async transferToCashApp(amount: number, cashTag: string) {
    // In a real implementation, this would transfer to Cash App
    console.log(`Transferring $${amount} to ${cashTag}`);
    
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: crypto.randomUUID(),
          amount: amount,
          recipient: cashTag,
          status: 'completed',
          timestamp: new Date().toISOString()
        });
      }, 1000);
    });
  }

  async getBalance() {
    const response = await fetch(`${this.getBaseUrl()}/v2/cash-drawers/shifts`, {
      headers: this.getHeaders()
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.errors?.[0]?.detail || 'Failed to get balance');
    }

    return response.json();
  }

  isConfigured(): boolean {
    this.loadConfig();
    return !!(this.config?.accessToken && this.config?.locationId);
  }
}

export const squareService = new SquareService();