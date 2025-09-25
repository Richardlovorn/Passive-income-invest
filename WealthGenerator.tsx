import React, { useState, useEffect } from 'react';
import LiveTradingPanel from './LiveTradingPanel';
import IncomeStreamCard from './IncomeStreamCard';
import CashAppIntegration from './CashAppIntegration';
import RevenueChart from './RevenueChart';
import NavigationSidebar from './NavigationSidebar';
import TradingModule from './TradingModule';
import IncomeModule from './IncomeModule';
import AnalyticsModule from './AnalyticsModule';
import APIStatusPanel from './APIStatusPanel';

const WealthGenerator: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeModule, setActiveModule] = useState('dashboard');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const accountData = {
    accountId: '9066577SW',
    cash: 50000.00,
    equity: 50000.00,
    buyingPower: 100000.00,
    portfolioValue: 50000.00,
    dayTradeCount: 0
  };

  const incomeStreams = [
    { source: 'Real Estate', monthly: 35000, automation: 98, icon: 'https://d64gsuwffb70l.cloudfront.net/68d361d533fdccc643297042_1758683651785_2e4f0e6b.webp' },
    { source: 'Stock Dividends', monthly: 22000, automation: 95, icon: 'https://d64gsuwffb70l.cloudfront.net/68d361d533fdccc643297042_1758683653586_156e1797.webp' },
    { source: 'Crypto Staking', monthly: 18000, automation: 92, icon: 'https://d64gsuwffb70l.cloudfront.net/68d361d533fdccc643297042_1758683655325_613ed724.webp' },
    { source: 'Business Royalties', monthly: 25000, automation: 88, icon: 'https://d64gsuwffb70l.cloudfront.net/68d361d533fdccc643297042_1758683657044_2d74d951.webp' },
    { source: 'Amazon FBA', monthly: 18500, automation: 90, icon: 'https://d64gsuwffb70l.cloudfront.net/68d361d533fdccc643297042_1758683659084_df86eaee.webp' },
    { source: 'Patent Licensing', monthly: 22000, automation: 94, icon: 'https://d64gsuwffb70l.cloudfront.net/68d361d533fdccc643297042_1758683660858_c4175d76.webp' },
    { source: 'Digital Products', monthly: 12000, automation: 90, icon: 'https://d64gsuwffb70l.cloudfront.net/68d361d533fdccc643297042_1758683662629_5a0b442a.webp' },
    { source: 'Course Sales', monthly: 14200, automation: 87, icon: 'https://d64gsuwffb70l.cloudfront.net/68d361d533fdccc643297042_1758683664408_fd8b3da7.webp' }
  ];

  const totalMonthlyIncome = incomeStreams.reduce((sum, stream) => sum + stream.monthly, 0);

  const renderModule = () => {
    switch(activeModule) {
      case 'trading':
        return <TradingModule accountData={accountData} />;
      case 'income':
        return <IncomeModule incomeStreams={incomeStreams} />;
      case 'analytics':
        return <AnalyticsModule />;
      case 'dashboard':
      default:
        return (
          <div className="space-y-6">
            <LiveTradingPanel accountData={accountData} />
            <CashAppIntegration 
              totalMonthlyIncome={totalMonthlyIncome}
              cashAppUsername="$RichLovorn"
            />
            <APIStatusPanel />
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Top Income Streams
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {incomeStreams.slice(0, 8).map((stream) => (
                  <IncomeStreamCard key={stream.source} {...stream} />
                ))}
              </div>
            </div>
            <RevenueChart incomeStreams={incomeStreams} />
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900">
      <NavigationSidebar activeModule={activeModule} setActiveModule={setActiveModule} />
      
      <div className="flex-1 ml-64 p-6">
        {/* Hero Section */}
        <div 
          className="relative h-64 rounded-2xl overflow-hidden mb-8 bg-cover bg-center"
          style={{ backgroundImage: `url('https://d64gsuwffb70l.cloudfront.net/68d361d533fdccc643297042_1758683646067_0307d1ea.webp')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>
          <div className="relative h-full flex flex-col justify-center px-8">
            <h1 className="text-5xl font-bold text-white mb-2">
              Wealth Generator AI
            </h1>
            <p className="text-xl text-gray-200 mb-4">
              24/7/365 Automated Passive Income System
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-400">System Active</span>
              </div>
              <span className="text-sm text-gray-400">
                {currentTime.toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Module Content */}
        {renderModule()}
      </div>
    </div>
  );
};

export default WealthGenerator;
export { WealthGenerator };