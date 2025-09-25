import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { TrendingUp, DollarSign, Activity, PieChart as PieIcon } from 'lucide-react';

export function AdvancedAnalytics() {
  const performanceData = [
    { month: 'Jan', returns: 12.5, benchmark: 8.2 },
    { month: 'Feb', returns: 15.3, benchmark: 9.1 },
    { month: 'Mar', returns: 18.7, benchmark: 10.5 },
    { month: 'Apr', returns: 22.1, benchmark: 11.3 },
    { month: 'May', returns: 25.8, benchmark: 12.7 },
    { month: 'Jun', returns: 28.4, benchmark: 13.2 }
  ];

  const assetAllocation = [
    { name: 'Stocks', value: 35, color: '#8b5cf6' },
    { name: 'Crypto', value: 25, color: '#3b82f6' },
    { name: 'Real Estate', value: 20, color: '#10b981' },
    { name: 'Bonds', value: 10, color: '#f59e0b' },
    { name: 'Commodities', value: 10, color: '#ef4444' }
  ];

  const riskMetrics = [
    { metric: 'Sharpe Ratio', value: 85, fullMark: 100 },
    { metric: 'Sortino Ratio', value: 78, fullMark: 100 },
    { metric: 'Alpha', value: 92, fullMark: 100 },
    { metric: 'Beta', value: 45, fullMark: 100 },
    { metric: 'R-Squared', value: 88, fullMark: 100 },
    { metric: 'Treynor Ratio', value: 81, fullMark: 100 }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              Performance vs Benchmark
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="month" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
                <Line type="monotone" dataKey="returns" stroke="#8b5cf6" strokeWidth={2} name="Portfolio" />
                <Line type="monotone" dataKey="benchmark" stroke="#6b7280" strokeWidth={2} name="S&P 500" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-blue-400" />
              Asset Allocation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={assetAllocation}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {assetAllocation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-400" />
            Risk-Adjusted Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={riskMetrics}>
              <PolarGrid stroke="#333" />
              <PolarAngleAxis dataKey="metric" stroke="#666" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#666" />
              <Radar name="Current" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
              <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }} />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}