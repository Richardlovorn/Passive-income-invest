import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, DollarSign, Activity, CreditCard, 
  Zap, Brain, Shield, BarChart3, Wallet, 
  ArrowUpRight, ArrowDownRight, Clock, Layers
} from 'lucide-react';
import { TradingChart } from './TradingChart';
import { PortfolioManager } from './PortfolioManager';
import { IncomeStreams } from './IncomeStreams';
import { PaymentIntegrations } from './PaymentIntegrations';
interface DashboardProps {
  user: any;
}

export function AdvancedDashboard({ user }: DashboardProps) {
  const [balance, setBalance] = useState(10000);
  const [earnings, setEarnings] = useState(0);
  const [isAutoTrading, setIsAutoTrading] = useState(false);
  const [aiStrength, setAiStrength] = useState(75);
  const [activeStrategies, setActiveStrategies] = useState({
    scalping: false,
    swing: false,
    arbitrage: false,
    options: false
  });

  useEffect(() => {
    if (isAutoTrading) {
      const interval = setInterval(() => {
        const profit = (Math.random() - 0.3) * 500 * (aiStrength / 100);
        setEarnings(prev => prev + profit);
        setBalance(prev => prev + profit);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isAutoTrading, aiStrength]);

  const stats = [
    { label: 'Total Balance', value: `$${balance.toFixed(2)}`, icon: DollarSign, color: 'from-blue-600 to-blue-700', change: earnings > 0 ? '+12.5%' : '-2.3%' },
    { label: "Today's Profit", value: `$${earnings.toFixed(2)}`, icon: TrendingUp, color: 'from-green-600 to-green-700', change: earnings > 0 ? '+' + (earnings/100).toFixed(1) + '%' : '0%' },
    { label: 'Win Rate', value: '68.4%', icon: Activity, color: 'from-purple-600 to-purple-700', change: '+5.2%' },
    { label: 'Active Trades', value: isAutoTrading ? '7' : '0', icon: CreditCard, color: 'from-orange-600 to-orange-700', change: isAutoTrading ? 'Live' : 'Idle' }
  ];

  const strategies = [
    { name: 'Scalping', key: 'scalping', profit: '+$234', risk: 'Low', winRate: '72%' },
    { name: 'Swing Trading', key: 'swing', profit: '+$892', risk: 'Medium', winRate: '65%' },
    { name: 'Arbitrage', key: 'arbitrage', profit: '+$445', risk: 'Very Low', winRate: '89%' },
    { name: 'Options', key: 'options', profit: '+$1,203', risk: 'High', winRate: '58%' }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className={`p-6 bg-gradient-to-br ${stat.color} border-0`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">{stat.label}</p>
                <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                <p className="text-xs text-white/60 mt-2 flex items-center gap-1">
                  {stat.change.includes('+') ? 
                    <ArrowUpRight className="w-3 h-3" /> : 
                    stat.change.includes('-') ? 
                    <ArrowDownRight className="w-3 h-3" /> : 
                    <Clock className="w-3 h-3" />
                  }
                  {stat.change}
                </p>
              </div>
              <stat.icon className="w-8 h-8 text-white/40" />
            </div>
          </Card>
        ))}
      </div>

      {/* Main Control Panel */}
      <Card className="p-6 bg-gray-900 border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-400" />
            AI Trading Control Center
          </h2>
          <Badge variant={isAutoTrading ? "default" : "secondary"} className="px-3 py-1">
            {isAutoTrading ? '● LIVE' : '○ OFFLINE'}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm text-gray-400">AI Power Level</label>
                <span className="text-sm text-white">{aiStrength}%</span>
              </div>
              <Progress value={aiStrength} className="h-2" />
              <div className="flex gap-2 mt-2">
                <Button size="sm" variant="outline" onClick={() => setAiStrength(25)}>Conservative</Button>
                <Button size="sm" variant="outline" onClick={() => setAiStrength(50)}>Balanced</Button>
                <Button size="sm" variant="outline" onClick={() => setAiStrength(75)}>Aggressive</Button>
                <Button size="sm" variant="outline" onClick={() => setAiStrength(100)}>Max Power</Button>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setIsAutoTrading(!isAutoTrading)}
                className={`flex-1 ${isAutoTrading ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                size="lg"
              >
                <Zap className="w-4 h-4 mr-2" />
                {isAutoTrading ? 'Stop Auto-Trading' : 'Start Auto-Trading'}
              </Button>
              <Button
                onClick={() => {
                  setBalance(prev => prev + 1000);
                  alert('$1,000 deposited successfully!');
                }}
                variant="outline"
                size="lg"
                className="border-gray-700"
              >
                <Wallet className="w-4 h-4 mr-2" />
                Deposit
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-gray-400 mb-2">Trading Strategies</p>
            {strategies.map(strategy => (
              <div key={strategy.key} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={activeStrategies[strategy.key as keyof typeof activeStrategies]}
                    onChange={(e) => setActiveStrategies({
                      ...activeStrategies,
                      [strategy.key]: e.target.checked
                    })}
                    className="w-4 h-4"
                    disabled={!isAutoTrading}
                  />
                  <div>
                    <p className="text-white font-medium">{strategy.name}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">{strategy.risk}</Badge>
                      <span className="text-xs text-green-400">{strategy.profit}</span>
                    </div>
                  </div>
                </div>
                <span className="text-sm text-gray-400">{strategy.winRate}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Tabs Section */}
      <Tabs defaultValue="trading" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5 bg-gray-800">
          <TabsTrigger value="trading">Live Trading</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="income">Income</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="trading">
          <TradingChart />
        </TabsContent>

        <TabsContent value="portfolio">
          <PortfolioManager />
        </TabsContent>

        <TabsContent value="income">
          <IncomeStreams />
        </TabsContent>

        <TabsContent value="payments">
          <PaymentIntegrations />
        </TabsContent>

        <TabsContent value="analytics">
          <Card className="p-6 bg-gray-900 border-gray-800">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Performance Analytics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-400">Monthly ROI</p>
                <p className="text-2xl font-bold text-green-400">+24.8%</p>
              </div>
              <div className="p-4 bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-400">Total Trades</p>
                <p className="text-2xl font-bold text-blue-400">1,247</p>
              </div>
              <div className="p-4 bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-400">Success Rate</p>
                <p className="text-2xl font-bold text-purple-400">68.4%</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-400 mb-3">Top Performing Assets</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white">BTC/USD</span>
                    <span className="text-green-400">+34.2%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white">ETH/USD</span>
                    <span className="text-green-400">+28.7%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white">AAPL</span>
                    <span className="text-green-400">+15.3%</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-400 mb-3">Risk Metrics</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white">Sharpe Ratio</span>
                    <span className="text-blue-400">2.34</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white">Max Drawdown</span>
                    <span className="text-yellow-400">-8.2%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white">Risk Score</span>
                    <Badge variant="outline" className="text-xs">Medium</Badge>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}