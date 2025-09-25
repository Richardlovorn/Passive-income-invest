import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Banknote, TrendingUp, Users, ShoppingCart, 
  Youtube, Instagram, DollarSign, Zap 
} from 'lucide-react';

interface IncomeStream {
  id: string;
  name: string;
  icon: any;
  earnings: number;
  status: 'active' | 'paused' | 'pending';
  progress: number;
  description: string;
}

export function IncomeStreams() {
  const [streams, setStreams] = useState<IncomeStream[]>([
    {
      id: '1',
      name: 'Crypto Trading Bot',
      icon: TrendingUp,
      earnings: 2847.50,
      status: 'active',
      progress: 78,
      description: 'Automated trading on 5 exchanges'
    },
    {
      id: '2',
      name: 'Affiliate Marketing',
      icon: Users,
      earnings: 1234.00,
      status: 'active',
      progress: 65,
      description: 'Amazon, ClickBank partnerships'
    },
    {
      id: '3',
      name: 'E-commerce Store',
      icon: ShoppingCart,
      earnings: 892.75,
      status: 'paused',
      progress: 45,
      description: 'Dropshipping automation'
    },
    {
      id: '4',
      name: 'YouTube Monetization',
      icon: Youtube,
      earnings: 567.25,
      status: 'active',
      progress: 89,
      description: 'Ad revenue + sponsorships'
    },
    {
      id: '5',
      name: 'Instagram Influencer',
      icon: Instagram,
      earnings: 445.00,
      status: 'pending',
      progress: 23,
      description: 'Brand collaborations'
    },
    {
      id: '6',
      name: 'Stock Dividends',
      icon: Banknote,
      earnings: 1789.50,
      status: 'active',
      progress: 92,
      description: 'Passive dividend income'
    }
  ]);

  const totalEarnings = streams.reduce((sum, stream) => 
    stream.status === 'active' ? sum + stream.earnings : sum, 0
  );

  const toggleStream = (id: string) => {
    setStreams(streams.map(stream => {
      if (stream.id === id) {
        return {
          ...stream,
          status: stream.status === 'active' ? 'paused' : 'active'
        };
      }
      return stream;
    }));
  };

  return (
    <Card className="p-6 bg-gray-900 border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-green-400" />
          Income Streams
        </h3>
        <div className="text-right">
          <p className="text-sm text-gray-400">Total Monthly</p>
          <p className="text-2xl font-bold text-green-400">${totalEarnings.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {streams.map(stream => (
          <div key={stream.id} className="p-4 bg-gray-800 rounded-lg">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-700 rounded-lg">
                  <stream.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white">{stream.name}</p>
                  <p className="text-xs text-gray-400">{stream.description}</p>
                </div>
              </div>
              <Badge 
                variant={stream.status === 'active' ? 'default' : stream.status === 'paused' ? 'secondary' : 'outline'}
                className="text-xs"
              >
                {stream.status}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Earnings</span>
                <span className="font-semibold text-white">${stream.earnings.toFixed(2)}</span>
              </div>
              <Progress value={stream.progress} className="h-1.5" />
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Performance: {stream.progress}%</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => toggleStream(stream.id)}
                  className="h-6 text-xs"
                >
                  <Zap className="w-3 h-3 mr-1" />
                  {stream.status === 'active' ? 'Pause' : 'Activate'}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-4 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-lg border border-purple-800/30">
        <p className="text-sm text-gray-300 mb-2">💡 Pro Tip</p>
        <p className="text-xs text-gray-400">
          Diversifying income streams reduces risk. Our AI recommends maintaining 4-6 active streams for optimal results.
        </p>
      </div>
    </Card>
  );
}