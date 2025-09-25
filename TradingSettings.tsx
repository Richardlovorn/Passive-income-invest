import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Save, AlertTriangle, Shield } from 'lucide-react';

interface TradingConfig {
  maxPositionSize: number;
  maxDailyLoss: number;
  maxOpenPositions: number;
  defaultTimeInForce: string;
  extendedHours: boolean;
  strategies: {
    movingAverage: boolean;
    rsi: boolean;
    meanReversion: boolean;
    momentum: boolean;
  };
  riskLevel: 'conservative' | 'moderate' | 'aggressive';
  stopLossPercent: number;
  takeProfitPercent: number;
}

export default function TradingSettings() {
  const [config, setConfig] = useState<TradingConfig>({
    maxPositionSize: 1000,
    maxDailyLoss: 500,
    maxOpenPositions: 5,
    defaultTimeInForce: 'day',
    extendedHours: false,
    strategies: {
      movingAverage: true,
      rsi: true,
      meanReversion: false,
      momentum: false
    },
    riskLevel: 'moderate',
    stopLossPercent: 5,
    takeProfitPercent: 10
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedConfig = localStorage.getItem('tradingConfig');
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }
  }, []);

  const saveSettings = () => {
    localStorage.setItem('tradingConfig', JSON.stringify(config));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Trading Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Risk Management */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-blue-400">Risk Management</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="maxPosition">Max Position Size ($)</Label>
                <Input
                  id="maxPosition"
                  type="number"
                  value={config.maxPositionSize}
                  onChange={(e) => setConfig({...config, maxPositionSize: Number(e.target.value)})}
                  className="bg-gray-800 border-gray-700"
                />
              </div>
              
              <div>
                <Label htmlFor="maxLoss">Max Daily Loss ($)</Label>
                <Input
                  id="maxLoss"
                  type="number"
                  value={config.maxDailyLoss}
                  onChange={(e) => setConfig({...config, maxDailyLoss: Number(e.target.value)})}
                  className="bg-gray-800 border-gray-700"
                />
              </div>
              
              <div>
                <Label htmlFor="maxPositions">Max Open Positions</Label>
                <Input
                  id="maxPositions"
                  type="number"
                  value={config.maxOpenPositions}
                  onChange={(e) => setConfig({...config, maxOpenPositions: Number(e.target.value)})}
                  className="bg-gray-800 border-gray-700"
                />
              </div>
              
              <div>
                <Label htmlFor="riskLevel">Risk Level</Label>
                <Select
                  value={config.riskLevel}
                  onValueChange={(value: any) => setConfig({...config, riskLevel: value})}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conservative">Conservative</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="aggressive">Aggressive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Stop Loss / Take Profit */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-400">Exit Strategy</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="stopLoss">Stop Loss (%)</Label>
                <Input
                  id="stopLoss"
                  type="number"
                  value={config.stopLossPercent}
                  onChange={(e) => setConfig({...config, stopLossPercent: Number(e.target.value)})}
                  className="bg-gray-800 border-gray-700"
                />
              </div>
              
              <div>
                <Label htmlFor="takeProfit">Take Profit (%)</Label>
                <Input
                  id="takeProfit"
                  type="number"
                  value={config.takeProfitPercent}
                  onChange={(e) => setConfig({...config, takeProfitPercent: Number(e.target.value)})}
                  className="bg-gray-800 border-gray-700"
                />
              </div>
            </div>
          </div>

          {/* Trading Strategies */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-purple-400">Trading Strategies</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="ma">Moving Average Crossover</Label>
                <Switch
                  id="ma"
                  checked={config.strategies.movingAverage}
                  onCheckedChange={(checked) => 
                    setConfig({...config, strategies: {...config.strategies, movingAverage: checked}})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="rsi">RSI (Relative Strength Index)</Label>
                <Switch
                  id="rsi"
                  checked={config.strategies.rsi}
                  onCheckedChange={(checked) => 
                    setConfig({...config, strategies: {...config.strategies, rsi: checked}})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="mean">Mean Reversion</Label>
                <Switch
                  id="mean"
                  checked={config.strategies.meanReversion}
                  onCheckedChange={(checked) => 
                    setConfig({...config, strategies: {...config.strategies, meanReversion: checked}})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="momentum">Momentum Trading</Label>
                <Switch
                  id="momentum"
                  checked={config.strategies.momentum}
                  onCheckedChange={(checked) => 
                    setConfig({...config, strategies: {...config.strategies, momentum: checked}})}
                />
              </div>
            </div>
          </div>

          {/* Order Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-yellow-400">Order Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tif">Default Time in Force</Label>
                <Select
                  value={config.defaultTimeInForce}
                  onValueChange={(value) => setConfig({...config, defaultTimeInForce: value})}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Day</SelectItem>
                    <SelectItem value="gtc">Good Till Canceled</SelectItem>
                    <SelectItem value="opg">At Open</SelectItem>
                    <SelectItem value="cls">At Close</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="extended">Extended Hours Trading</Label>
                <Switch
                  id="extended"
                  checked={config.extendedHours}
                  onCheckedChange={(checked) => setConfig({...config, extendedHours: checked})}
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center gap-4">
            <Button onClick={saveSettings} className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save Settings
            </Button>
            
            {saved && (
              <span className="text-green-400 text-sm">Settings saved successfully!</span>
            )}
          </div>

          {/* Warning */}
          <Alert className="border-yellow-600 bg-yellow-950/50">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <AlertDescription>
              These settings control real trading behavior. Adjust carefully and test in paper mode first.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}