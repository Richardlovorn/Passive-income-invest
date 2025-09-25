// Trading Strategy Algorithms
// These implement various algorithmic trading strategies

export interface TradingSignal {
  action: 'buy' | 'sell' | 'hold';
  strength: number; // 0-100
  reason: string;
  confidence: number; // 0-1
}

export interface MarketData {
  symbol: string;
  price: number;
  volume: number;
  high: number;
  low: number;
  open: number;
  close: number;
  timestamp: Date;
}

// Calculate Simple Moving Average
export function calculateSMA(prices: number[], period: number): number {
  if (prices.length < period) return 0;
  const slice = prices.slice(-period);
  return slice.reduce((a, b) => a + b, 0) / period;
}

// Calculate Exponential Moving Average
export function calculateEMA(prices: number[], period: number): number {
  if (prices.length < period) return 0;
  const k = 2 / (period + 1);
  let ema = prices[0];
  for (let i = 1; i < prices.length; i++) {
    ema = prices[i] * k + ema * (1 - k);
  }
  return ema;
}

// Calculate RSI (Relative Strength Index)
export function calculateRSI(prices: number[], period: number = 14): number {
  if (prices.length < period + 1) return 50;
  
  let gains = 0;
  let losses = 0;
  
  for (let i = 1; i <= period; i++) {
    const diff = prices[i] - prices[i - 1];
    if (diff > 0) gains += diff;
    else losses -= diff;
  }
  
  const avgGain = gains / period;
  const avgLoss = losses / period;
  
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
}

// Moving Average Crossover Strategy
export function movingAverageCrossover(
  prices: number[],
  shortPeriod: number = 10,
  longPeriod: number = 20
): TradingSignal {
  const shortMA = calculateSMA(prices, shortPeriod);
  const longMA = calculateSMA(prices, longPeriod);
  const currentPrice = prices[prices.length - 1];
  
  if (shortMA > longMA * 1.01) {
    return {
      action: 'buy',
      strength: Math.min(((shortMA / longMA - 1) * 100), 100),
      reason: `Short MA (${shortMA.toFixed(2)}) crossed above Long MA (${longMA.toFixed(2)})`,
      confidence: 0.7
    };
  } else if (shortMA < longMA * 0.99) {
    return {
      action: 'sell',
      strength: Math.min(((longMA / shortMA - 1) * 100), 100),
      reason: `Short MA (${shortMA.toFixed(2)}) crossed below Long MA (${longMA.toFixed(2)})`,
      confidence: 0.7
    };
  }
  
  return {
    action: 'hold',
    strength: 0,
    reason: 'No clear MA crossover signal',
    confidence: 0.3
  };
}

// RSI Strategy
export function rsiStrategy(prices: number[]): TradingSignal {
  const rsi = calculateRSI(prices);
  
  if (rsi < 30) {
    return {
      action: 'buy',
      strength: (30 - rsi) * 3,
      reason: `RSI (${rsi.toFixed(1)}) indicates oversold condition`,
      confidence: 0.75
    };
  } else if (rsi > 70) {
    return {
      action: 'sell',
      strength: (rsi - 70) * 3,
      reason: `RSI (${rsi.toFixed(1)}) indicates overbought condition`,
      confidence: 0.75
    };
  }
  
  return {
    action: 'hold',
    strength: 0,
    reason: `RSI (${rsi.toFixed(1)}) in neutral zone`,
    confidence: 0.4
  };
}

// Mean Reversion Strategy
export function meanReversionStrategy(prices: number[], period: number = 20): TradingSignal {
  const mean = calculateSMA(prices, period);
  const currentPrice = prices[prices.length - 1];
  const deviation = ((currentPrice - mean) / mean) * 100;
  
  if (deviation < -5) {
    return {
      action: 'buy',
      strength: Math.min(Math.abs(deviation) * 10, 100),
      reason: `Price ${Math.abs(deviation).toFixed(1)}% below ${period}-period mean`,
      confidence: 0.65
    };
  } else if (deviation > 5) {
    return {
      action: 'sell',
      strength: Math.min(deviation * 10, 100),
      reason: `Price ${deviation.toFixed(1)}% above ${period}-period mean`,
      confidence: 0.65
    };
  }
  
  return {
    action: 'hold',
    strength: 0,
    reason: 'Price near mean value',
    confidence: 0.3
  };
}

// Momentum Strategy
export function momentumStrategy(prices: number[], period: number = 10): TradingSignal {
  if (prices.length < period) {
    return { action: 'hold', strength: 0, reason: 'Insufficient data', confidence: 0 };
  }
  
  const momentum = ((prices[prices.length - 1] - prices[prices.length - period]) / 
                    prices[prices.length - period]) * 100;
  
  if (momentum > 5) {
    return {
      action: 'buy',
      strength: Math.min(momentum * 5, 100),
      reason: `Strong upward momentum: ${momentum.toFixed(1)}%`,
      confidence: 0.7
    };
  } else if (momentum < -5) {
    return {
      action: 'sell',
      strength: Math.min(Math.abs(momentum) * 5, 100),
      reason: `Strong downward momentum: ${momentum.toFixed(1)}%`,
      confidence: 0.7
    };
  }
  
  return {
    action: 'hold',
    strength: 0,
    reason: 'Weak momentum',
    confidence: 0.3
  };
}

// Combine multiple strategies
export function combineStrategies(prices: number[]): TradingSignal {
  const strategies = [
    movingAverageCrossover(prices),
    rsiStrategy(prices),
    meanReversionStrategy(prices),
    momentumStrategy(prices)
  ];
  
  const buySignals = strategies.filter(s => s.action === 'buy');
  const sellSignals = strategies.filter(s => s.action === 'sell');
  
  const buyScore = buySignals.reduce((acc, s) => acc + s.strength * s.confidence, 0);
  const sellScore = sellSignals.reduce((acc, s) => acc + s.strength * s.confidence, 0);
  
  if (buyScore > sellScore && buyScore > 50) {
    return {
      action: 'buy',
      strength: Math.min(buyScore / strategies.length, 100),
      reason: `${buySignals.length}/${strategies.length} strategies signal BUY`,
      confidence: buyScore / (buyScore + sellScore + 1)
    };
  } else if (sellScore > buyScore && sellScore > 50) {
    return {
      action: 'sell',
      strength: Math.min(sellScore / strategies.length, 100),
      reason: `${sellSignals.length}/${strategies.length} strategies signal SELL`,
      confidence: sellScore / (buyScore + sellScore + 1)
    };
  }
  
  return {
    action: 'hold',
    strength: 0,
    reason: 'Mixed or weak signals from strategies',
    confidence: 0.2
  };
}