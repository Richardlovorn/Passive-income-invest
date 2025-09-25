import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface RevenueChartProps {
  incomeStreams: Array<{
    source: string;
    monthly: number;
    automation: number;
  }>;
}

const RevenueChart: React.FC<RevenueChartProps> = ({ incomeStreams }) => {
  const chartData = incomeStreams.map(stream => ({
    name: stream.source,
    income: stream.monthly,
    automation: stream.automation * 100
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
          <p className="text-white font-semibold">{payload[0].payload.name}</p>
          <p className="text-green-400 text-sm">
            Income: ${payload[0].value.toLocaleString()}
          </p>
          <p className="text-blue-400 text-sm">
            Automation: {payload[0].payload.automation / 100}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-purple-600/20 rounded-lg">
            <TrendingUp className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Revenue Analytics</h3>
            <p className="text-sm text-gray-400">Monthly Income Distribution</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">
            ${incomeStreams.reduce((sum, s) => sum + s.monthly, 0).toLocaleString()}
          </div>
          <div className="text-xs text-green-400">Total Monthly Revenue</div>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              height={80}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
            />
            <YAxis 
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="income" 
              fill="url(#colorGradient)"
              radius={[8, 8, 0, 0]}
            />
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity={1} />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity={1} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-700">
          <div className="text-xs text-gray-400">Highest Earner</div>
          <div className="text-lg font-bold text-white">Real Estate</div>
          <div className="text-sm text-green-400">$35,000/mo</div>
        </div>
        <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-700">
          <div className="text-xs text-gray-400">Most Automated</div>
          <div className="text-lg font-bold text-white">Real Estate</div>
          <div className="text-sm text-blue-400">98% Automated</div>
        </div>
        <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-700">
          <div className="text-xs text-gray-400">Growth Rate</div>
          <div className="text-lg font-bold text-white">+41.2%</div>
          <div className="text-sm text-purple-400">This Month</div>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;