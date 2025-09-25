import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, X, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Ticker {
  symbol: string;
  type: 'stock' | 'crypto' | 'forex';
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  high: number;
  low: number;
}

export function TickerManager() {
  const [tickers, setTickers] = useState<Ticker[]>([
    { symbol: 'AAPL', type: 'stock', price: 178.45, change: 2.34, changePercent: 1.33, volume: '52.3M', high: 179.80, low: 176.20 },
    { symbol: 'BTC/USD', type: 'crypto', price: 67234.50, change: 1245.30, changePercent: 1.89, volume: '24.5B', high: 68500, low: 65800 },
    { symbol: 'EUR/USD', type: 'forex', price: 1.0856, change: 0.0023, changePercent: 0.21, volume: '1.2T', high: 1.0890, low: 1.0820 },
  ]);
  const [newTicker, setNewTicker] = useState('');
  const [selectedType, setSelectedType] = useState<'stock' | 'crypto' | 'forex'>('stock');

  const addTicker = () => {
    if (newTicker) {
      const mockPrice = Math.random() * 1000;
      const mockChange = (Math.random() - 0.5) * 20;
      setTickers([...tickers, {
        symbol: newTicker.toUpperCase(),
        type: selectedType,
        price: mockPrice,
        change: mockChange,
        changePercent: (mockChange / mockPrice) * 100,
        volume: Math.floor(Math.random() * 100) + 'M',
        high: mockPrice * 1.05,
        low: mockPrice * 0.95
      }]);
      setNewTicker('');
    }
  };

  const removeTicker = (symbol: string) => {
    setTickers(tickers.filter(t => t.symbol !== symbol));
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'stock': return 'bg-blue-600';
      case 'crypto': return 'bg-orange-600';
      case 'forex': return 'bg-purple-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <Card className="bg-black/90 border-orange-500/30">
      <CardHeader className="border-b border-orange-500/20">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
          Multi-Asset Ticker Manager
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex gap-2 mb-6">
          <Input
            placeholder="Enter ticker symbol..."
            value={newTicker}
            onChange={(e) => setNewTicker(e.target.value)}
            className="bg-black/50 border-orange-500/30 text-white placeholder:text-gray-500"
            onKeyPress={(e) => e.key === 'Enter' && addTicker()}
          />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as any)}
            className="px-4 py-2 bg-black/50 border border-orange-500/30 text-white rounded-md"
          >
            <option value="stock">Stock</option>
            <option value="crypto">Crypto</option>
            <option value="forex">Forex</option>
          </select>
          <Button onClick={addTicker} className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
            <Plus className="w-4 h-4 mr-1" /> Add
          </Button>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-black/50 border border-orange-500/30">
            <TabsTrigger value="all" className="data-[state=active]:bg-orange-500/20">All</TabsTrigger>
            <TabsTrigger value="stock" className="data-[state=active]:bg-blue-500/20">Stocks</TabsTrigger>
            <TabsTrigger value="crypto" className="data-[state=active]:bg-orange-500/20">Crypto</TabsTrigger>
            <TabsTrigger value="forex" className="data-[state=active]:bg-purple-500/20">Forex</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <TickerGrid tickers={tickers} onRemove={removeTicker} getTypeColor={getTypeColor} />
          </TabsContent>
          <TabsContent value="stock" className="mt-4">
            <TickerGrid tickers={tickers.filter(t => t.type === 'stock')} onRemove={removeTicker} getTypeColor={getTypeColor} />
          </TabsContent>
          <TabsContent value="crypto" className="mt-4">
            <TickerGrid tickers={tickers.filter(t => t.type === 'crypto')} onRemove={removeTicker} getTypeColor={getTypeColor} />
          </TabsContent>
          <TabsContent value="forex" className="mt-4">
            <TickerGrid tickers={tickers.filter(t => t.type === 'forex')} onRemove={removeTicker} getTypeColor={getTypeColor} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function TickerGrid({ tickers, onRemove, getTypeColor }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tickers.map((ticker: Ticker) => (
        <div key={ticker.symbol} className="relative bg-gradient-to-br from-black/80 to-gray-900/80 border border-orange-500/30 rounded-lg p-4 hover:border-orange-400/50 transition-all">
          <Button
            onClick={() => onRemove(ticker.symbol)}
            className="absolute top-2 right-2 p-1 h-6 w-6 bg-red-500/20 hover:bg-red-500/40"
          >
            <X className="w-3 h-3" />
          </Button>
          
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-bold text-white">{ticker.symbol}</h3>
            <Badge className={`${getTypeColor(ticker.type)} text-white`}>
              {ticker.type.toUpperCase()}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-3xl font-bold text-white">
                ${ticker.price.toFixed(ticker.type === 'forex' ? 4 : 2)}
              </span>
              {ticker.change >= 0 ? (
                <TrendingUp className="w-6 h-6 text-green-400" />
              ) : (
                <TrendingDown className="w-6 h-6 text-red-400" />
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-lg font-semibold ${ticker.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {ticker.change >= 0 ? '+' : ''}{ticker.change.toFixed(2)}
              </span>
              <span className={`text-sm px-2 py-1 rounded ${ticker.change >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {ticker.changePercent >= 0 ? '+' : ''}{ticker.changePercent.toFixed(2)}%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-400">High:</span>
                <span className="text-yellow-400 ml-1 font-semibold">${ticker.high.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-gray-400">Low:</span>
                <span className="text-orange-400 ml-1 font-semibold">${ticker.low.toFixed(2)}</span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-400">Volume:</span>
                <span className="text-white ml-1 font-semibold">{ticker.volume}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}