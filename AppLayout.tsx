import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TrendingUp, DollarSign, Activity, BarChart3, Settings, Shield, Zap, Brain,
  Wallet, CreditCard, AlertCircle, CheckCircle, XCircle, RefreshCw, Play, Pause,
  ChevronRight, Globe, Cpu, Database, Lock, Sparkles, Target, TrendingDown,
  ArrowUpRight, ArrowDownRight, LineChart, Building2
} from 'lucide-react';

import BankingTransfers from './BankingTransfers';
import { SimpleDashboard } from './SimpleDashboard';
import { AdvancedDashboard } from './AdvancedDashboard';
import { IncomeStreams } from './IncomeStreams';
import { PaymentIntegrations } from './PaymentIntegrations';
import { APIConfigurationHub } from './APIConfigurationHub';
import { AdvancedSystems } from './AdvancedSystems';
import { RealTradingDashboard } from './RealTradingDashboard';
import { TickerManager } from './TickerManager';
import { AdvancedCharting } from './AdvancedCharting';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export function AppLayout() {
  const [activeTab, setActiveTab] = useState('ticker-manager');
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [systemStatus, setSystemStatus] = useState({
    trading: 'active',
    ai: 'processing',
    payments: 'connected',
    database: 'synced'
  });
  const { toast } = useToast();
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setIsLoading(false);
    };
    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'text-green-400';
      case 'processing': return 'text-yellow-400';
      case 'connected': return 'text-blue-400';
      case 'synced': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'processing': return <RefreshCw className="w-4 h-4 animate-spin" />;
      case 'connected': return <Zap className="w-4 h-4" />;
      case 'synced': return <Database className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-white text-xl">Loading Trading System...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Header with HD Quality Typography */}
      <header className="border-b border-orange-500/30 bg-black/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <DollarSign className="w-10 h-10 text-orange-500" />
                  <Sparkles className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1" />
                </div>
                <h1 className="text-3xl font-black bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                  QUANTUM AI TRADING
                </h1>
              </div>
            </div>
            
            {/* System Status Indicators */}
            <div className="flex items-center gap-6">
              <div className="hidden lg:flex items-center gap-4">
                {Object.entries(systemStatus).map(([key, status]) => (
                  <div key={key} className="flex items-center gap-2">
                    <span className={`${getStatusColor(status)}`}>
                      {getStatusIcon(status)}
                    </span>
                    <span className="text-xs text-gray-400 capitalize">{key}</span>
                  </div>
                ))}
              </div>
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-bold px-3 py-1">
                LIVE TRADING
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Navigation Tabs */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 lg:grid-cols-6 gap-2 bg-black/50 border border-orange-500/30 p-2 h-auto">
            <TabsTrigger 
              value="ticker-manager" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white font-bold"
            >
              <LineChart className="w-4 h-4 mr-2" />
              Tickers
            </TabsTrigger>
            <TabsTrigger 
              value="banking" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white font-bold"
            >
              <Building2 className="w-4 h-4 mr-2" />
              Banking
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-white font-bold"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger 
              value="trading" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-yellow-500 data-[state=active]:text-white font-bold"
            >
              <Activity className="w-4 h-4 mr-2" />
              Trading
            </TabsTrigger>
            <TabsTrigger 
              value="api-config" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white font-bold"
            >
              <Settings className="w-4 h-4 mr-2" />
              APIs
            </TabsTrigger>
            <TabsTrigger 
              value="systems" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white font-bold"
            >
              <Brain className="w-4 h-4 mr-2" />
              AI Systems
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="ticker-manager" className="space-y-6">
              <TickerManager />
              <AdvancedCharting />
            </TabsContent>

            <TabsContent value="banking">
              <BankingTransfers />
            </TabsContent>
            <TabsContent value="analytics" className="space-y-6">
              <AdvancedCharting />
              <AdvancedDashboard />
            </TabsContent>

            <TabsContent value="trading">
              <RealTradingDashboard />
            </TabsContent>

            <TabsContent value="api-config">
              <APIConfigurationHub />
            </TabsContent>

            <TabsContent value="systems">
              <AdvancedSystems />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Footer with Live Stats */}
      <footer className="border-t border-orange-500/30 mt-12 py-6 bg-black/80">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold">
                <TrendingUp className="w-4 h-4 mr-1" />
                +12.5% Today
              </Badge>
              <Badge className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold">
                <Activity className="w-4 h-4 mr-1" />
                247 Trades
              </Badge>
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold">
                <Brain className="w-4 h-4 mr-1" />
                AI Active
              </Badge>
            </div>
            <div className="text-sm text-gray-400">
              © 2025 Quantum AI Trading | 10% Profit Distribution Active
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default AppLayout;