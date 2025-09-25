import React from 'react';
import { Zap, Shield, Activity, Cloud, TrendingUp } from 'lucide-react';

interface APIConnection {
  name: string;
  status: string;
  details: string;
  lastSync: string;
  icon: React.ElementType;
  color: string;
}

const APIStatusPanel: React.FC = () => {
  const connections: APIConnection[] = [
    {
      name: 'Alpaca Trading',
      status: 'Connected',
      details: 'Live Trading Active',
      lastSync: '2 seconds ago',
      icon: TrendingUp,
      color: 'green'
    },
    {
      name: 'Polygon.io',
      status: 'Streaming',
      details: 'Real-time Market Data',
      lastSync: 'Live',
      icon: Activity,
      color: 'blue'
    },
    {
      name: 'Square Payments',
      status: 'Active',
      details: 'Processing Enabled',
      lastSync: '1 minute ago',
      icon: Shield,
      color: 'purple'
    },
    {
      name: 'Google Cloud',
      status: 'Running',
      details: 'wealth-generator-468719',
      lastSync: 'Online',
      icon: Cloud,
      color: 'yellow'
    }
  ];

  const getStatusColor = (color: string) => {
    const colors: { [key: string]: string } = {
      green: 'bg-green-500',
      blue: 'bg-blue-500',
      purple: 'bg-purple-500',
      yellow: 'bg-yellow-500'
    };
    return colors[color] || 'bg-gray-500';
  };

  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white flex items-center">
          <Zap className="w-5 h-5 mr-2 text-yellow-400" />
          API Connections
        </h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-green-400">All Systems Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {connections.map((api) => (
          <div key={api.name} className="bg-gray-900/50 rounded-lg p-3 border border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 ${getStatusColor(api.color)} rounded-full animate-pulse`}></div>
                <div>
                  <div className="text-sm font-semibold text-white">{api.name}</div>
                  <div className="text-xs text-gray-400">{api.details}</div>
                </div>
              </div>
              <div className="text-xs text-gray-500">{api.lastSync}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default APIStatusPanel;