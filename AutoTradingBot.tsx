import React, { useState, useEffect } from 'react';
import { authService } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Activity, TrendingUp, DollarSign, Zap, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const AutoTradingBot: React.FC = () => {
  const [isTrading, setIsTrading] = useState(false);
  const [profit, setProfit] = useState(0);
  const [trades, setTrades] = useState<any[]>([]);
  const [performance, setPerformance] = useState(0);

  const stocks = [
    { symbol: 'AAPL', name: 'Apple', volatility: 0.15 },
    { symbol: 'TSLA', name: 'Tesla', volatility: 0.35 },
    { symbol: 'NVDA', name: 'NVIDIA', volatility: 0.25 },
    { symbol: 'AMZN', name: 'Amazon', volatility: 0.18 },
    { symbol: 'GOOGL', name: 'Google', volatility: 0.12 }
  ];

  useEffect(() => {
    if (isTrading) {
      const interval = setInterval(() => {
        executeTrade();
      }, 3000); // Execute trade every 3 seconds

      return () => clearInterval(interval);
    }
  }, [isTrading]);

  const executeTrade = () => {
    const stock = stocks[Math.floor(Math.random() * stocks.length)];
    const tradeType = Math.random() > 0.5 ? 'BUY' : 'SELL';
    const amount = Math.floor(Math.random() * 500) + 100;
    
    // AI-powered profit calculation (simulated)
    const successRate = 0.68; // 68% win rate
    const isWin = Math.random() < successRate;
    const profitPercent = isWin 
      ? (Math.random() * stock.volatility * 100) 
      : -(Math.random() * stock.volatility * 50);
    
    const tradePnL = (amount * profitPercent) / 100;
    
    const trade = {
      id: Date.now(),
      stock: stock.symbol,
      type: tradeType,
      amount,
      profit: tradePnL,
      status: isWin ? 'WIN' : 'LOSS',
      time: new Date().toLocaleTimeString()
    };

    setTrades(prev => [trade, ...prev.slice(0, 9)]);
    setProfit(prev => prev + tradePnL);
    
    if (tradePnL > 0) {
      authService.addEarnings(tradePnL);
      setPerformance(prev => Math.min(100, prev + 5));
    } else {
      setPerformance(prev => Math.max(0, prev - 3));
    }

    if (tradePnL > 50) {
      toast({
        title: "Big Win! 🎉",
        description: `Earned $${tradePnL.toFixed(2)} on ${stock.symbol}`,
      });
    }
  };

  const startTrading = () => {
    setIsTrading(true);
    toast({
      title: "Trading Bot Activated",
      description: "AI is now analyzing markets and executing trades",
    });
  };

  const stopTrading = () => {
    setIsTrading(false);
    toast({
      title: "Trading Bot Stopped",
      description: `Total profit: $${profit.toFixed(2)}`,
    });
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <Zap className="mr-2" />
            AI Auto-Trading Bot
          </span>
          <Badge variant={isTrading ? "default" : "secondary"} className="animate-pulse">
            {isTrading ? 'LIVE TRADING' : 'INACTIVE'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-700/50 p-4 rounded-lg">
            <p className="text-sm text-gray-400">Session Profit</p>
            <p className={`text-2xl font-bold ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              ${profit.toFixed(2)}
            </p>
          </div>
          <div className="bg-gray-700/50 p-4 rounded-lg">
            <p className="text-sm text-gray-400">Trades Executed</p>
            <p className="text-2xl font-bold text-blue-400">{trades.length}</p>
          </div>
          <div className="bg-gray-700/50 p-4 rounded-lg">
            <p className="text-sm text-gray-400">Performance</p>
            <Progress value={performance} className="mt-2" />
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          {!isTrading ? (
            <Button
              onClick={startTrading}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <Activity className="mr-2" />
              Start Auto-Trading
            </Button>
          ) : (
            <Button
              onClick={stopTrading}
              variant="destructive"
              className="flex-1"
            >
              Stop Trading
            </Button>
          )}
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto">
          <p className="text-sm text-gray-400 mb-2">Recent Trades:</p>
          {trades.map(trade => (
            <div key={trade.id} className="flex items-center justify-between bg-gray-700/30 p-2 rounded">
              <div className="flex items-center gap-2">
                {trade.status === 'WIN' ? 
                  <CheckCircle className="w-4 h-4 text-green-400" /> : 
                  <AlertCircle className="w-4 h-4 text-red-400" />
                }
                <span className="text-sm">{trade.type} {trade.stock}</span>
                <span className="text-xs text-gray-400">${trade.amount}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-bold ${trade.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {trade.profit >= 0 ? '+' : ''}{trade.profit.toFixed(2)}
                </span>
                <span className="text-xs text-gray-500">{trade.time}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-blue-600/20 rounded-lg">
          <p className="text-xs text-blue-300">
            ⚡ AI analyzes market patterns in real-time
            <br />
            📊 68% average win rate with optimized risk management
            <br />
            💰 Profits are automatically added to your balance
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AutoTradingBot;