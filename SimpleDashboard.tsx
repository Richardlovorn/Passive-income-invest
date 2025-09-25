import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, DollarSign, Activity, CreditCard } from 'lucide-react';

export function SimpleDashboard({ user }: { user: any }) {
  const [balance, setBalance] = useState(1000);
  const [earnings, setEarnings] = useState(0);
  const [isTrading, setIsTrading] = useState(false);

  useEffect(() => {
    if (isTrading) {
      const interval = setInterval(() => {
        const profit = Math.random() * 100 - 30;
        setEarnings(prev => prev + profit);
        setBalance(prev => prev + profit);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isTrading]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-blue-600 to-blue-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Balance</p>
              <p className="text-3xl font-bold text-white">
                ${balance.toFixed(2)}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-200" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-600 to-green-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Today's Earnings</p>
              <p className="text-3xl font-bold text-white">
                ${earnings.toFixed(2)}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-200" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-600 to-purple-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Win Rate</p>
              <p className="text-3xl font-bold text-white">68%</p>
            </div>
            <Activity className="w-8 h-8 text-purple-200" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-600 to-orange-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Active Trades</p>
              <p className="text-3xl font-bold text-white">
                {isTrading ? '3' : '0'}
              </p>
            </div>
            <CreditCard className="w-8 h-8 text-orange-200" />
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            onClick={() => setIsTrading(!isTrading)}
            className={isTrading ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
            size="lg"
          >
            {isTrading ? 'Stop Trading' : 'Start Auto-Trading'}
          </Button>
          <Button
            onClick={() => {
              setBalance(prev => prev + 500);
              alert('$500 deposited successfully!');
            }}
            variant="outline"
            size="lg"
          >
            Deposit Funds
          </Button>
          <Button
            onClick={() => {
              if (balance > 100) {
                setBalance(prev => prev - 100);
                alert('$100 withdrawn successfully!');
              } else {
                alert('Insufficient balance');
              }
            }}
            variant="outline"
            size="lg"
          >
            Withdraw
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Trading Status</h2>
        {isTrading ? (
          <div className="space-y-2">
            <p className="text-green-600 font-semibold">✓ Auto-trading is active</p>
            <p className="text-gray-600">AI is analyzing markets and executing trades...</p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Recent trades:</p>
              <div className="mt-2 space-y-1">
                <p className="text-sm">• BTC/USD - Buy @ $42,350 ✓</p>
                <p className="text-sm">• ETH/USD - Sell @ $2,240 ✓</p>
                <p className="text-sm">• AAPL - Buy @ $178.50 ⏳</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">Auto-trading is currently inactive</p>
            <Button onClick={() => setIsTrading(true)} className="bg-blue-600 hover:bg-blue-700">
              Activate AI Trading
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}