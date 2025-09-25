import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Activity,
  Shield,
  Power,
  RefreshCw,
  Settings
} from 'lucide-react';
import { alpacaAPI } from '@/lib/alpaca';
import TradingSettings from './TradingSettings';
import PositionsManager from './PositionsManager';
import AutoTradingControl from './AutoTradingControl';
import { ProfitDistribution } from './ProfitDistribution';
import { APIConfigurationHub } from './APIConfigurationHub';
import { AdvancedSystems } from './AdvancedSystems';
export function RealTradingDashboard() {
  const [account, setAccount] = useState<any>(null);
  const [positions, setPositions] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [isPaperMode, setIsPaperMode] = useState(true);
  const [autoTradingEnabled, setAutoTradingEnabled] = useState(false);

  useEffect(() => {
    loadAccountData();
    const interval = setInterval(loadAccountData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const loadAccountData = async () => {
    try {
      if (!alpacaAPI.isConfigured()) {
        setError('Alpaca API keys not configured. Please add your API keys to continue.');
        setLoading(false);
        return;
      }

      setIsPaperMode(alpacaAPI.isPaperTrading());
      
      const [accountData, positionsData, ordersData] = await Promise.all([
        alpacaAPI.getAccount(),
        alpacaAPI.getPositions(),
        alpacaAPI.getOrders('open')
      ]);

      setAccount(accountData);
      setPositions(positionsData);
      setOrders(ordersData);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load account data');
    } finally {
      setLoading(false);
    }
  };

  const emergencyStop = async () => {
    if (!confirm('Are you sure? This will cancel all open orders and disable auto-trading.')) {
      return;
    }

    setAutoTradingEnabled(false);
    
    try {
      for (const order of orders) {
        await alpacaAPI.cancelOrder(order.id);
      }
      await loadAccountData();
    } catch (err: any) {
      setError('Failed to execute emergency stop: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Warning Banner */}
      {!isPaperMode && (
        <Alert className="border-red-600 bg-red-950/50">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-300">
            <strong>LIVE TRADING MODE</strong> - Real money is at risk. Trade responsibly.
          </AlertDescription>
        </Alert>
      )}

      {isPaperMode && (
        <Alert className="border-yellow-600 bg-yellow-950/50">
          <Shield className="h-4 w-4 text-yellow-500" />
          <AlertDescription className="text-yellow-300">
            Paper Trading Mode - No real money involved. Safe for testing.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="border-red-600 bg-red-950/50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Account Overview */}
      {account && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-400">Portfolio Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">
                ${parseFloat(account.portfolio_value).toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-400">Buying Power</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">
                ${parseFloat(account.buying_power).toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-400">Cash</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-400">
                ${parseFloat(account.cash).toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-gray-400">Day Trades</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-400">
                {account.daytrade_count}/3
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Emergency Controls */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Trading Controls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 sm:gap-4">
            <Button
              onClick={() => setAutoTradingEnabled(!autoTradingEnabled)}
              variant={autoTradingEnabled ? "destructive" : "default"}
              className="flex items-center gap-2"
              size="sm"
            >
              <Power className="w-4 h-4" />
              <span className="hidden sm:inline">
                {autoTradingEnabled ? 'Disable' : 'Enable'}
              </span>
              <span className="sm:hidden">
                {autoTradingEnabled ? 'Off' : 'On'}
              </span>
              <span className="hidden sm:inline">Auto-Trading</span>
            </Button>
            
            <Button
              onClick={emergencyStop}
              variant="destructive"
              className="flex items-center gap-2"
              size="sm"
            >
              <AlertTriangle className="w-4 h-4" />
              <span className="hidden sm:inline">Emergency</span> Stop
            </Button>

            <Button
              onClick={loadAccountData}
              variant="outline"
              className="flex items-center gap-2"
              size="sm"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Trading Interface */}
      <Tabs defaultValue="api-config" className="space-y-4">
        <TabsList className="bg-gray-900/50 w-full overflow-x-auto flex justify-start">
          <TabsTrigger value="api-config" className="min-w-fit">API Config</TabsTrigger>
          <TabsTrigger value="positions" className="min-w-fit">Positions</TabsTrigger>
          <TabsTrigger value="autotrading" className="min-w-fit">Auto-Trade</TabsTrigger>
          <TabsTrigger value="profit" className="min-w-fit">Profit Share</TabsTrigger>
          <TabsTrigger value="advanced" className="min-w-fit">Advanced</TabsTrigger>
          <TabsTrigger value="settings" className="min-w-fit">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="api-config">
          <APIConfigurationHub />
        </TabsContent>

        <TabsContent value="positions">
          <PositionsManager 
            positions={positions} 
            orders={orders}
            onRefresh={loadAccountData}
          />
        </TabsContent>

        <TabsContent value="autotrading">
          <AutoTradingControl 
            enabled={autoTradingEnabled}
            account={account}
            onToggle={setAutoTradingEnabled}
          />
        </TabsContent>

        <TabsContent value="profit">
          <ProfitDistribution />
        </TabsContent>

        <TabsContent value="advanced">
          <AdvancedSystems />
        </TabsContent>

        <TabsContent value="settings">
          <TradingSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}