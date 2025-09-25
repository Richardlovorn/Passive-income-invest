import React, { useState } from 'react';
import { TrendingUp, AlertCircle, Target, Activity, DollarSign, Shield } from 'lucide-react';

interface TradingModuleProps {
  accountData: {
    accountId: string;
    cash: number;
    equity: number;
    buyingPower: number;
    portfolioValue: number;
    dayTradeCount: number;
  };
}

const TradingModule: React.FC<TradingModuleProps> = ({ accountData }) => {
  const [selectedStrategy, setSelectedStrategy] = useState('momentum');

  const strategies = [
    { id: 'momentum', name: 'Momentum Trading', risk: 'Medium', return: '15-25%' },
    { id: 'dividend', name: 'Dividend Growth', risk: 'Low', return: '8-12%' },
    { id: 'options', name: 'Options Wheel', risk: 'Medium', return: '20-30%' },
    { id: 'scalping', name: 'AI Scalping', risk: 'High', return: '25-40%' }
  ];

  const positions = [
    { symbol: 'AAPL', shares: 100, value: 18500, pnl: 1250, pnlPercent: 7.2 },
    { symbol: 'NVDA', shares: 50, value: 22000, pnl: 3400, pnlPercent: 18.3 },
    { symbol: 'SPY', shares: 25, value: 11250, pnl: -320, pnlPercent: -2.8 },
    { symbol: 'TSLA', shares: 30, value: 7500, pnl: 890, pnlPercent: 13.5 }
  ];

  return (
    <div className="space-y-6">
      {/* Account Overview */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 border border-blue-500/30">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Live Trading Dashboard</h2>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-400">Market Open</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
            <div className="text-sm text-gray-400 mb-1">Total Value</div>
            <div className="text-2xl font-bold text-white">${accountData.portfolioValue.toLocaleString()}</div>
            <div className="text-xs text-green-400 mt-1">+$5,220 (11.6%)</div>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
            <div className="text-sm text-gray-400 mb-1">Available Cash</div>
            <div className="text-2xl font-bold text-white">${accountData.cash.toLocaleString()}</div>
            <div className="text-xs text-blue-400 mt-1">Ready to deploy</div>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
            <div className="text-sm text-gray-400 mb-1">Today's P&L</div>
            <div className="text-2xl font-bold text-green-400">+$1,842</div>
            <div className="text-xs text-green-400 mt-1">+3.68%</div>
          </div>
        </div>

        {/* Trading Strategies */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-3">Active Strategies</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {strategies.map((strategy) => (
              <button
                key={strategy.id}
                onClick={() => setSelectedStrategy(strategy.id)}
                className={`p-3 rounded-lg border transition-all ${
                  selectedStrategy === strategy.id
                    ? 'bg-blue-600/20 border-blue-500 shadow-lg'
                    : 'bg-gray-900/50 border-gray-700 hover:border-gray-600'
                }`}
              >
                <div className="text-sm font-semibold text-white">{strategy.name}</div>
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-gray-400">Risk: {strategy.risk}</span>
                  <span className="text-xs text-green-400">{strategy.return}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Current Positions */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Current Positions</h3>
          <div className="bg-gray-900/50 rounded-lg border border-gray-700 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">Symbol</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">Shares</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">Value</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">P&L</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">%</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {positions.map((position) => (
                  <tr key={position.symbol} className="hover:bg-gray-800/30">
                    <td className="px-4 py-3 text-sm font-semibold text-white">{position.symbol}</td>
                    <td className="px-4 py-3 text-sm text-gray-300">{position.shares}</td>
                    <td className="px-4 py-3 text-sm text-gray-300">${position.value.toLocaleString()}</td>
                    <td className={`px-4 py-3 text-sm font-semibold ${
                      position.pnl >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {position.pnl >= 0 ? '+' : ''}${position.pnl.toLocaleString()}
                    </td>
                    <td className={`px-4 py-3 text-sm ${
                      position.pnlPercent >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {position.pnlPercent >= 0 ? '+' : ''}{position.pnlPercent}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* AI Trading Insights */}
      <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 rounded-xl p-6 border border-purple-500/30">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2 text-purple-400" />
          AI Trading Insights
        </h3>
        <div className="space-y-3">
          <div className="p-3 bg-gray-900/50 rounded-lg border border-gray-700">
            <div className="text-sm text-purple-400 font-semibold">Opportunity Detected</div>
            <div className="text-xs text-gray-300 mt-1">NVDA showing strong momentum pattern. Consider adding to position.</div>
          </div>
          <div className="p-3 bg-gray-900/50 rounded-lg border border-gray-700">
            <div className="text-sm text-yellow-400 font-semibold">Risk Alert</div>
            <div className="text-xs text-gray-300 mt-1">SPY approaching resistance. Consider taking partial profits.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingModule;