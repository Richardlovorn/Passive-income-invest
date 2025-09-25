import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Bot, 
  Activity, 
  TrendingUp, 
  TrendingDown,
  Pause,
  Play,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { alpacaAPI } from '@/lib/alpaca';
import { combineStrategies } from '@/lib/trading-strategies';

interface Props {
  enabled: boolean;
  account: any;
  onToggle: (enabled: boolean) => void;
}

interface TradeLog {
  timestamp: Date;
  action: string;
  symbol: string;
  qty: number;
  price?: number;
  reason: string;
  status: 'success' | 'failed';
}

export default function AutoTradingControl({ enabled, account, onToggle }: Props) {
  const [isRunning, setIsRunning] = useState(false);
  const [tradeLogs, setTradeLogs] = useState<TradeLog[]>([]);
  const [currentSignal, setCurrentSignal] = useState<any>(null);
  const [watchlist] = useState(['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA']);
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (enabled && !isRunning) {
      startAutoTrading();
    } else if (!enabled && isRunning) {
      stopAutoTrading();
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enabled]);

  const startAutoTrading = () => {
    setIsRunning(true);
    addLog('Auto-trading started', '', 0, 'System initialized', 'success');
    
    // Run analysis every 60 seconds
    intervalRef.current = setInterval(analyzeAndTrade, 60000);
    
    // Run immediately
    analyzeAndTrade();
  };

  const stopAutoTrading = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    addLog('Auto-trading stopped', '', 0, 'System paused by user', 'success');
  };

  const analyzeAndTrade = async () => {
    const config = JSON.parse(localStorage.getItem('tradingConfig') || '{}');
    
    for (const symbol of watchlist) {
      try {
        // Get historical data for analysis
        const endDate = new Date().toISOString();
        const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
        
        const historicalData = await alpacaAPI.getHistoricalBars(
          symbol,
          '1Day',
          startDate,
          endDate
        );
        
        if (!historicalData.bars || !historicalData.bars[symbol]) {
          continue;
        }
        
        const prices = historicalData.bars[symbol].map((bar: any) => bar.c);
        
        // Run strategy analysis
        const signal = combineStrategies(prices);
        setCurrentSignal({ symbol, ...signal });
        
        // Check if we should execute trade
        if (signal.confidence > 0.6 && signal.strength > 60) {
          await executeTrade(symbol, signal, config);
        }
        
      } catch (err: any) {
        addLog('Analysis failed', symbol, 0, err.message, 'failed');
      }
    }
  };

  const executeTrade = async (symbol: string, signal: any, config: any) => {
    try {
      // Check risk limits
      const positions = await alpacaAPI.getPositions();
      if (positions.length >= (config.maxOpenPositions || 5)) {
        addLog('Trade skipped', symbol, 0, 'Max positions reached', 'failed');
        return;
      }
      
      // Calculate position size
      const buyingPower = parseFloat(account?.buying_power || '0');
      const maxPosition = config.maxPositionSize || 1000;
      const positionSize = Math.min(maxPosition, buyingPower * 0.1);
      
      if (positionSize < 100) {
        addLog('Trade skipped', symbol, 0, 'Insufficient buying power', 'failed');
        return;
      }
      
      // Get current price
      const marketData = await alpacaAPI.getMarketData(symbol);
      const currentPrice = marketData.bar?.c || 0;
      
      if (!currentPrice) return;
      
      const qty = Math.floor(positionSize / currentPrice);
      
      if (qty < 1) {
        addLog('Trade skipped', symbol, 0, 'Position too small', 'failed');
        return;
      }
      
      // Execute trade based on signal
      if (signal.action === 'buy') {
        const order = await alpacaAPI.createOrder({
          symbol,
          qty,
          side: 'buy',
          type: 'market',
          time_in_force: config.defaultTimeInForce || 'day'
        });
        
        addLog('Buy order placed', symbol, qty, signal.reason, 'success');
        
        // Set stop loss and take profit
        if (config.stopLossPercent) {
          const stopPrice = currentPrice * (1 - config.stopLossPercent / 100);
          await alpacaAPI.createOrder({
            symbol,
            qty,
            side: 'sell',
            type: 'stop',
            stop_price: stopPrice,
            time_in_force: 'gtc'
          });
        }
        
      } else if (signal.action === 'sell') {
        // Check if we have position to sell
        const position = positions.find((p: any) => p.symbol === symbol);
        if (position) {
          await alpacaAPI.createOrder({
            symbol,
            qty: Math.abs(Number(position.qty)),
            side: 'sell',
            type: 'market',
            time_in_force: 'day'
          });
          
          addLog('Sell order placed', symbol, Math.abs(Number(position.qty)), signal.reason, 'success');
        }
      }
      
    } catch (err: any) {
      addLog('Trade failed', symbol, 0, err.message, 'failed');
    }
  };

  const addLog = (action: string, symbol: string, qty: number, reason: string, status: 'success' | 'failed') => {
    setTradeLogs(prev => [{
      timestamp: new Date(),
      action,
      symbol,
      qty,
      reason,
      status
    }, ...prev.slice(0, 19)]);
  };

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              Auto-Trading Bot
            </div>
            <Badge variant={isRunning ? 'default' : 'secondary'}>
              {isRunning ? 'Active' : 'Inactive'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => onToggle(!enabled)}
              variant={enabled ? 'destructive' : 'default'}
              className="flex items-center gap-2"
            >
              {enabled ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {enabled ? 'Stop Bot' : 'Start Bot'}
            </Button>
            
            {isRunning && (
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-green-400 animate-pulse" />
                <span className="text-sm text-gray-400">Analyzing markets...</span>
              </div>
            )}
          </div>

          {/* Current Signal */}
          {currentSignal && (
            <div className="p-4 bg-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{currentSignal.symbol}</span>
                <Badge variant={
                  currentSignal.action === 'buy' ? 'default' : 
                  currentSignal.action === 'sell' ? 'destructive' : 'secondary'
                }>
                  {currentSignal.action.toUpperCase()}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Signal Strength</span>
                  <span>{currentSignal.strength.toFixed(0)}%</span>
                </div>
                <Progress value={currentSignal.strength} className="h-2" />
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Confidence</span>
                  <span>{(currentSignal.confidence * 100).toFixed(0)}%</span>
                </div>
                <Progress value={currentSignal.confidence * 100} className="h-2" />
                <p className="text-xs text-gray-400 mt-2">{currentSignal.reason}</p>
              </div>
            </div>
          )}

          {/* Watchlist */}
          <div>
            <h4 className="text-sm font-medium mb-2">Monitoring</h4>
            <div className="flex flex-wrap gap-2">
              {watchlist.map(symbol => (
                <Badge key={symbol} variant="outline">{symbol}</Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trade Logs */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {tradeLogs.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No trading activity yet</p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {tradeLogs.map((log, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-800 rounded-lg">
                  {log.status === 'success' ? (
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{log.action}</span>
                      {log.symbol && <Badge variant="outline" className="text-xs">{log.symbol}</Badge>}
                      {log.qty > 0 && <span className="text-xs text-gray-400">Qty: {log.qty}</span>}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{log.reason}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {log.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Warning */}
      <Alert className="border-yellow-600 bg-yellow-950/50">
        <AlertTriangle className="h-4 w-4 text-yellow-500" />
        <AlertDescription>
          Auto-trading involves significant risk. The bot will execute real trades based on algorithmic signals. 
          Monitor performance closely and use stop losses.
        </AlertDescription>
      </Alert>
    </div>
  );
}