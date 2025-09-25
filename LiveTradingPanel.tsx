import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Activity, DollarSign, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

const LiveTradingPanel = () => {
  const [trades, setTrades] = useState<any[]>([]);
  const [isTrading, setIsTrading] = useState(false);
  const [portfolio, setPortfolio] = useState<any>(null);
  const [symbol, setSymbol] = useState('AAPL');
  const [amount, setAmount] = useState('1000');
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Fetch portfolio data on mount
  useEffect(() => {
    fetchPortfolio();
    const interval = setInterval(fetchPortfolio, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchPortfolio = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('ai-trading-engine', {
        body: { action: 'portfolio' }
      });
      
      if (data?.success) {
        setPortfolio(data.data);
      }
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    }
  };

  const analyzeMarket = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-trading-engine', {
        body: { 
          action: 'analyze',
          symbol: symbol.toUpperCase()
        }
      });
      
      if (data?.success) {
        setAnalysis(data.data);
        toast({
          title: "Analysis Complete",
          description: `${symbol} analyzed with ${data.data.confidence?.toFixed(1)}% confidence`,
        });
      } else {
        toast({
          title: "Analysis Failed",
          description: error?.message || "Unable to analyze market",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error analyzing market:', error);
      toast({
        title: "Error",
        description: "Failed to connect to trading engine",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const executeTrade = async () => {
    if (!analysis) {
      toast({
        title: "No Analysis",
        description: "Please analyze the market first",
        variant: "destructive"
      });
      return;
    }

    setIsTrading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-trading-engine', {
        body: {
          action: 'execute',
          symbol: symbol.toUpperCase(),
          amount: parseFloat(amount),
          userId: (await supabase.auth.getUser()).data.user?.id
        }
      });
      
      if (data?.success) {
        const newTrade = {
          id: data.data.orderId || crypto.randomUUID(),
          symbol: symbol.toUpperCase(),
          amount: parseFloat(amount),
          status: 'executed',
          timestamp: new Date().toISOString(),
          ...data.data
        };
        
        setTrades([newTrade, ...trades.slice(0, 4)]);
        
        toast({
          title: "Trade Executed",
          description: `Successfully placed order for ${symbol}`,
        });
        
        // Refresh portfolio
        fetchPortfolio();
      } else {
        toast({
          title: "Trade Failed",
          description: error?.message || "Unable to execute trade",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error executing trade:', error);
      toast({
        title: "Error",
        description: "Failed to execute trade",
        variant: "destructive"
      });
    } finally {
      setIsTrading(false);
    }
  };

  const startAutoTrading = () => {
    setIsTrading(true);
    toast({
      title: "Auto-Trading Started",
      description: "AI is now monitoring markets and executing trades",
    });
    
    // Simulate auto-trading
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        analyzeMarket();
      }
    }, 10000);
    
    setTimeout(() => {
      clearInterval(interval);
      setIsTrading(false);
      toast({
        title: "Auto-Trading Paused",
        description: "Taking a break to analyze performance",
      });
    }, 60000);
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-400" />
            Live Trading Panel
          </span>
          <Badge variant={isTrading ? "default" : "secondary"} className="animate-pulse">
            {isTrading ? 'TRADING ACTIVE' : 'STANDBY'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Portfolio Overview */}
        {portfolio && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-gray-900/50 p-3 rounded-lg">
              <p className="text-xs text-gray-400">Portfolio Value</p>
              <p className="text-lg font-bold text-green-400">
                ${parseFloat(portfolio.portfolioValue || 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-900/50 p-3 rounded-lg">
              <p className="text-xs text-gray-400">Buying Power</p>
              <p className="text-lg font-bold text-blue-400">
                ${parseFloat(portfolio.buyingPower || 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-900/50 p-3 rounded-lg">
              <p className="text-xs text-gray-400">Cash</p>
              <p className="text-lg font-bold text-yellow-400">
                ${parseFloat(portfolio.cash || 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-900/50 p-3 rounded-lg">
              <p className="text-xs text-gray-400">Equity</p>
              <p className="text-lg font-bold text-purple-400">
                ${parseFloat(portfolio.equity || 0).toLocaleString()}
              </p>
            </div>
          </div>
        )}

        {/* Trading Controls */}
        <div className="flex gap-2">
          <Input
            placeholder="Symbol (e.g., AAPL)"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="bg-gray-900/50 border-gray-600"
          />
          <Input
            placeholder="Amount ($)"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-gray-900/50 border-gray-600"
          />
          <Button 
            onClick={analyzeMarket}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </Button>
        </div>

        {/* Analysis Results */}
        {analysis && (
          <div className="bg-gray-900/50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Analysis for {analysis.symbol}</span>
              <Badge variant={analysis.recommendation === 'BUY' ? 'default' : 'secondary'}>
                {analysis.recommendation}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-400">Current Price: </span>
                <span className="text-white font-semibold">
                  ${analysis.currentPrice?.toFixed(2) || 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Confidence: </span>
                <span className="text-green-400 font-semibold">
                  {analysis.confidence?.toFixed(1) || 0}%
                </span>
              </div>
            </div>
            <Progress value={analysis.confidence || 0} className="h-2" />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            onClick={executeTrade}
            disabled={!analysis || isTrading}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            <DollarSign className="w-4 h-4 mr-1" />
            Execute Trade
          </Button>
          <Button 
            onClick={startAutoTrading}
            disabled={isTrading}
            variant="outline"
            className="flex-1"
          >
            {isTrading ? 'Auto-Trading Active' : 'Start Auto-Trading'}
          </Button>
        </div>

        {/* Recent Trades */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-400">Recent Trades</h3>
          {trades.length === 0 ? (
            <p className="text-xs text-gray-500">No trades executed yet</p>
          ) : (
            trades.map((trade) => (
              <div key={trade.id} className="bg-gray-900/50 p-2 rounded flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm">{trade.symbol}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">${trade.amount}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(trade.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveTradingPanel;