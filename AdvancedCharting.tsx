import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, CandlestickChart } from 'recharts';
import { TrendingUp, TrendingDown, Activity, BarChart3, CandlestickChart as CandleIcon, LineChart as LineIcon } from 'lucide-react';

const generateMockData = (points: number) => {
  const data = [];
  let basePrice = 100;
  for (let i = 0; i < points; i++) {
    const change = (Math.random() - 0.5) * 10;
    basePrice += change;
    const high = basePrice + Math.random() * 5;
    const low = basePrice - Math.random() * 5;
    const open = basePrice + (Math.random() - 0.5) * 3;
    const close = basePrice + (Math.random() - 0.5) * 3;
    
    data.push({
      time: `${i}:00`,
      price: basePrice,
      volume: Math.floor(Math.random() * 1000000),
      high,
      low,
      open,
      close,
      sma20: basePrice + (Math.random() - 0.5) * 2,
      sma50: basePrice + (Math.random() - 0.5) * 1,
      rsi: 30 + Math.random() * 40,
      macd: (Math.random() - 0.5) * 5,
      signal: (Math.random() - 0.5) * 3,
    });
  }
  return data;
};

export function AdvancedCharting() {
  const [data, setData] = useState(generateMockData(24));
  const [selectedChart, setSelectedChart] = useState('candlestick');
  const [timeframe, setTimeframe] = useState('1D');
  const [selectedIndicators, setSelectedIndicators] = useState(['sma20', 'volume']);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(generateMockData(24));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const indicators = [
    { id: 'sma20', name: 'SMA 20', color: '#fbbf24' },
    { id: 'sma50', name: 'SMA 50', color: '#f97316' },
    { id: 'volume', name: 'Volume', color: '#10b981' },
    { id: 'rsi', name: 'RSI', color: '#8b5cf6' },
    { id: 'macd', name: 'MACD', color: '#ef4444' },
  ];

  const toggleIndicator = (id: string) => {
    setSelectedIndicators(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <Card className="bg-black/90 border-orange-500/30">
      <CardHeader className="border-b border-orange-500/20">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
            Advanced Trading Analytics
          </CardTitle>
          <div className="flex gap-2">
            {['1H', '4H', '1D', '1W', '1M'].map(tf => (
              <Button
                key={tf}
                variant={timeframe === tf ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeframe(tf)}
                className={timeframe === tf ? 'bg-orange-500 hover:bg-orange-600' : 'border-orange-500/30 text-orange-400'}
              >
                {tf}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-4 flex gap-2 flex-wrap">
          {indicators.map(indicator => (
            <Badge
              key={indicator.id}
              className={`cursor-pointer transition-all ${
                selectedIndicators.includes(indicator.id)
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
              onClick={() => toggleIndicator(indicator.id)}
            >
              {indicator.name}
            </Badge>
          ))}
        </div>

        <Tabs value={selectedChart} onValueChange={setSelectedChart} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-black/50 border border-orange-500/30 mb-4">
            <TabsTrigger value="candlestick" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500/20 data-[state=active]:to-red-500/20">
              <CandleIcon className="w-4 h-4 mr-1" /> Candlestick
            </TabsTrigger>
            <TabsTrigger value="line" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500/20 data-[state=active]:to-orange-500/20">
              <LineIcon className="w-4 h-4 mr-1" /> Line
            </TabsTrigger>
            <TabsTrigger value="area" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500/20 data-[state=active]:to-yellow-500/20">
              <Activity className="w-4 h-4 mr-1" /> Area
            </TabsTrigger>
            <TabsTrigger value="volume" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/20 data-[state=active]:to-green-500/20">
              <BarChart3 className="w-4 h-4 mr-1" /> Volume
            </TabsTrigger>
          </TabsList>

          <div className="bg-gradient-to-br from-black via-gray-900 to-black rounded-lg p-4 border border-orange-500/20">
            <ResponsiveContainer width="100%" height={400}>
              {selectedChart === 'line' && (
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #f97316' }} />
                  <Legend />
                  <Line type="monotone" dataKey="price" stroke="#f97316" strokeWidth={3} dot={false} />
                  {selectedIndicators.includes('sma20') && (
                    <Line type="monotone" dataKey="sma20" stroke="#fbbf24" strokeWidth={2} dot={false} />
                  )}
                  {selectedIndicators.includes('sma50') && (
                    <Line type="monotone" dataKey="sma50" stroke="#ef4444" strokeWidth={2} dot={false} />
                  )}
                </LineChart>
              )}
              
              {selectedChart === 'area' && (
                <AreaChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #f97316' }} />
                  <Legend />
                  <Area type="monotone" dataKey="price" stroke="#f97316" fill="url(#colorGradient)" strokeWidth={2} />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              )}

              {selectedChart === 'volume' && (
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #10b981' }} />
                  <Legend />
                  <Bar dataKey="volume" fill="#10b981" />
                </BarChart>
              )}

              {selectedChart === 'candlestick' && (
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #f97316' }} />
                  <Legend />
                  <Line type="monotone" dataKey="high" stroke="#10b981" strokeWidth={1} dot={false} />
                  <Line type="monotone" dataKey="low" stroke="#ef4444" strokeWidth={1} dot={false} />
                  <Line type="monotone" dataKey="close" stroke="#f97316" strokeWidth={2} dot={false} />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>

          {selectedIndicators.includes('rsi') && (
            <div className="mt-4 bg-gradient-to-br from-black via-gray-900 to-black rounded-lg p-4 border border-purple-500/20">
              <h4 className="text-purple-400 font-semibold mb-2">RSI Indicator</h4>
              <ResponsiveContainer width="100%" height={100}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#9ca3af" />
                  <YAxis domain={[0, 100]} stroke="#9ca3af" />
                  <Line type="monotone" dataKey="rsi" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {selectedIndicators.includes('macd') && (
            <div className="mt-4 bg-gradient-to-br from-black via-gray-900 to-black rounded-lg p-4 border border-red-500/20">
              <h4 className="text-red-400 font-semibold mb-2">MACD</h4>
              <ResponsiveContainer width="100%" height={100}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Line type="monotone" dataKey="macd" stroke="#ef4444" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="signal" stroke="#fbbf24" strokeWidth={1} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
}