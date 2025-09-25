import React from 'react';
import { DollarSign, TrendingUp, Clock, Percent } from 'lucide-react';
import IncomeStreamCard from './IncomeStreamCard';

interface IncomeModuleProps {
  incomeStreams: Array<{
    source: string;
    monthly: number;
    automation: number;
    icon?: string;
  }>;
}

const IncomeModule: React.FC<IncomeModuleProps> = ({ incomeStreams }) => {
  const additionalStreams = [
    { source: 'App Revenue', monthly: 9600, automation: 93 },
    { source: 'YouTube Revenue', monthly: 8500, automation: 94 },
    { source: 'Dropshipping', monthly: 11000, automation: 89 },
    { source: 'Affiliate Marketing', monthly: 15000, automation: 85 },
    { source: 'P2P Lending', monthly: 12800, automation: 88 },
    { source: 'Solar Panels', monthly: 6700, automation: 99 },
    { source: 'Rental Cars', monthly: 8900, automation: 85 },
    { source: 'Print on Demand', monthly: 6800, automation: 91 },
    { source: 'Vending Machines', monthly: 4200, automation: 96 },
    { source: 'Music Royalties', monthly: 5600, automation: 92 }
  ];

  const allStreams = [...incomeStreams, ...additionalStreams];
  const totalIncome = allStreams.reduce((sum, stream) => sum + stream.monthly, 0);
  const avgAutomation = Math.round(allStreams.reduce((sum, stream) => sum + stream.automation, 0) / allStreams.length);

  return (
    <div className="space-y-6">
      {/* Income Overview */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 border border-green-500/30">
        <h2 className="text-2xl font-bold text-white mb-6">Passive Income Streams</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
            <DollarSign className="w-5 h-5 text-green-400 mb-2" />
            <div className="text-2xl font-bold text-white">${totalIncome.toLocaleString()}</div>
            <div className="text-xs text-gray-400">Total Monthly Income</div>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
            <TrendingUp className="w-5 h-5 text-blue-400 mb-2" />
            <div className="text-2xl font-bold text-white">{allStreams.length}</div>
            <div className="text-xs text-gray-400">Active Streams</div>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
            <Percent className="w-5 h-5 text-purple-400 mb-2" />
            <div className="text-2xl font-bold text-white">{avgAutomation}%</div>
            <div className="text-xs text-gray-400">Avg Automation</div>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
            <Clock className="w-5 h-5 text-yellow-400 mb-2" />
            <div className="text-2xl font-bold text-white">24/7</div>
            <div className="text-xs text-gray-400">Always Earning</div>
          </div>
        </div>

        {/* All Income Streams */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {allStreams.map((stream, index) => (
            <IncomeStreamCard 
              key={stream.source} 
              {...stream}
              trend={5 + Math.random() * 15}
            />
          ))}
        </div>
      </div>

      {/* Income Distribution */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Income Distribution Strategy</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-900/20 rounded-lg p-4 border border-green-700/30">
            <div className="text-sm text-green-400 font-semibold mb-2">50% to CashApp</div>
            <div className="text-2xl font-bold text-white">${(totalIncome * 0.5).toLocaleString()}</div>
            <div className="text-xs text-gray-400 mt-1">Personal Wealth Building</div>
          </div>
          <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-700/30">
            <div className="text-sm text-blue-400 font-semibold mb-2">30% Reinvestment</div>
            <div className="text-2xl font-bold text-white">${(totalIncome * 0.3).toLocaleString()}</div>
            <div className="text-xs text-gray-400 mt-1">New Income Streams</div>
          </div>
          <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-700/30">
            <div className="text-sm text-purple-400 font-semibold mb-2">20% Trading Capital</div>
            <div className="text-2xl font-bold text-white">${(totalIncome * 0.2).toLocaleString()}</div>
            <div className="text-xs text-gray-400 mt-1">Alpaca Account Growth</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomeModule;