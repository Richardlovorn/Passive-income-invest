import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react';

interface Asset {
  id: string;
  symbol: string;
  name: string;
  amount: number;
  value: number;
  change: number;
}

export function PortfolioManager() {
  const [assets, setAssets] = useState<Asset[]>([
    { id: '1', symbol: 'BTC', name: 'Bitcoin', amount: 0.5, value: 21175, change: 5.2 },
    { id: '2', symbol: 'ETH', name: 'Ethereum', amount: 5, value: 11200, change: -2.1 },
    { id: '3', symbol: 'AAPL', name: 'Apple Inc.', amount: 50, value: 8925, change: 1.8 },
    { id: '4', symbol: 'GOOGL', name: 'Google', amount: 10, value: 1420, change: 3.2 },
  ]);

  const [newSymbol, setNewSymbol] = useState('');
  const [newAmount, setNewAmount] = useState('');

  const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);

  const addAsset = () => {
    if (newSymbol && newAmount) {
      const value = parseFloat(newAmount) * (100 + Math.random() * 900);
      setAssets([...assets, {
        id: Date.now().toString(),
        symbol: newSymbol.toUpperCase(),
        name: newSymbol,
        amount: parseFloat(newAmount),
        value: value,
        change: (Math.random() - 0.5) * 10
      }]);
      setNewSymbol('');
      setNewAmount('');
    }
  };

  const removeAsset = (id: string) => {
    setAssets(assets.filter(a => a.id !== id));
  };

  return (
    <Card className="p-6 bg-gray-900 border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <PieChart className="w-5 h-5" />
          Portfolio Manager
        </h3>
        <div className="text-right">
          <p className="text-sm text-gray-400">Total Value</p>
          <p className="text-2xl font-bold text-green-400">${totalValue.toFixed(2)}</p>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {assets.map(asset => (
          <div key={asset.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
            <div className="flex items-center gap-4">
              <div>
                <p className="font-semibold text-white">{asset.symbol}</p>
                <p className="text-sm text-gray-400">{asset.amount} units</p>
              </div>
              <Badge variant={asset.change > 0 ? 'default' : 'destructive'}>
                {asset.change > 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                {Math.abs(asset.change).toFixed(1)}%
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <p className="font-semibold text-white">${asset.value.toFixed(2)}</p>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => removeAsset(asset.id)}
                className="text-red-400 hover:text-red-300"
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Symbol (BTC, ETH, etc.)"
          value={newSymbol}
          onChange={(e) => setNewSymbol(e.target.value)}
          className="bg-gray-800 border-gray-700 text-white"
        />
        <Input
          type="number"
          placeholder="Amount"
          value={newAmount}
          onChange={(e) => setNewAmount(e.target.value)}
          className="bg-gray-800 border-gray-700 text-white"
        />
        <Button onClick={addAsset} className="bg-blue-600 hover:bg-blue-700">
          Add Asset
        </Button>
      </div>
    </Card>
  );
}