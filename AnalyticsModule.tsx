import React from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Calendar, Target, Award } from 'lucide-react';

const AnalyticsModule: React.FC = () => {
  const monthlyData = [
    { month: 'Jan', income: 120000, trading: 8500, expenses: 15000 },
    { month: 'Feb', income: 128000, trading: 12000, expenses: 14500 },
    { month: 'Mar', income: 135000, trading: 15500, expenses: 16000 },
    { month: 'Apr', income: 142000, trading: 11000, expenses: 15500 },
    { month: 'May', income: 155000, trading: 18500, expenses: 17000 },
    { month: 'Jun', income: 166800, trading: 22000, expenses: 18000 }
  ];

  const portfolioAllocation = [
    { name: 'Real Estate', value: 35000, color: '#3B82F6' },
    { name: 'Stocks', value: 22000, color: '#8B5CF6' },
    { name: 'Business', value: 25000, color: '#10B981' },
    { name: 'Digital', value: 26200, color: '#F59E0B' },
    { name: 'Other', value: 58600, color: '#EC4899' }
  ];

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-6">Performance Analytics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
            <TrendingUp className="w-5 h-5 text-green-400 mb-2" />
            <div className="text-2xl font-bold text-white">+41.2%</div>
            <div className="text-xs text-gray-400">Monthly Growth</div>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
            <Calendar className="w-5 h-5 text-blue-400 mb-2" />
            <div className="text-2xl font-bold text-white">$2.0M</div>
            <div className="text-xs text-gray-400">Annual Projection</div>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
            <Target className="w-5 h-5 text-purple-400 mb-2" />
            <div className="text-2xl font-bold text-white">91%</div>
            <div className="text-xs text-gray-400">Goal Achievement</div>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
            <Award className="w-5 h-5 text-yellow-400 mb-2" />
            <div className="text-2xl font-bold text-white">A+</div>
            <div className="text-xs text-gray-400">Performance Score</div>
          </div>
        </div>

        {/* Income Trend Chart */}
        <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Income Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" tick={{ fill: '#9CA3AF' }} />
                <YAxis tick={{ fill: '#9CA3AF' }} tickFormatter={(value) => `$${value/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                  labelStyle={{ color: '#F3F4F6' }}
                />
                <Area type="monotone" dataKey="income" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                <Area type="monotone" dataKey="trading" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Portfolio Allocation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Income Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={portfolioAllocation}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {portfolioAllocation.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                    formatter={(value: any) => `$${value.toLocaleString()}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {portfolioAllocation.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                    <span className="text-gray-400">{item.name}</span>
                  </div>
                  <span className="text-white font-semibold">${item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Metrics */}
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Key Metrics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Automation Rate</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-700 rounded-full h-2 mr-3">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '91%' }}></div>
                  </div>
                  <span className="text-white font-semibold">91%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Profit Margin</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-700 rounded-full h-2 mr-3">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                  <span className="text-white font-semibold">78%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">ROI</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-700 rounded-full h-2 mr-3">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '156%' }}></div>
                  </div>
                  <span className="text-white font-semibold">156%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Efficiency Score</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-700 rounded-full h-2 mr-3">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                  </div>
                  <span className="text-white font-semibold">94%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsModule;