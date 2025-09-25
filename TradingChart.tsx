import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export function TradingChart() {
  const [data, setData] = useState<any[]>([]);
  
  useEffect(() => {
    // Generate initial data
    const initialData = [];
    let baseValue = 50000;
    for (let i = 0; i < 24; i++) {
      baseValue += (Math.random() - 0.3) * 2000;
      initialData.push({
        time: `${i}:00`,
        value: Math.max(baseValue, 45000),
        volume: Math.random() * 1000000
      });
    }
    setData(initialData);

    // Update data every 2 seconds
    const interval = setInterval(() => {
      setData(prev => {
        const newData = [...prev.slice(1)];
        const lastValue = newData[newData.length - 1]?.value || 50000;
        const newValue = lastValue + (Math.random() - 0.3) * 2000;
        newData.push({
          time: new Date().toLocaleTimeString(),
          value: Math.max(newValue, 45000),
          volume: Math.random() * 1000000
        });
        return newData;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="p-6 bg-gray-900 border-gray-800">
      <h3 className="text-xl font-bold text-white mb-4">Live Market Data</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="time" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
              labelStyle={{ color: '#9ca3af' }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#10b981" 
              fillOpacity={1} 
              fill="url(#colorValue)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}