import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, Smartphone, Building, Wallet,
  Check, X, AlertCircle, ExternalLink
} from 'lucide-react';

interface PaymentMethod {
  id: string;
  name: string;
  icon: any;
  connected: boolean;
  balance?: number;
  lastSync?: string;
}

export function PaymentIntegrations() {
  const [methods, setMethods] = useState<PaymentMethod[]>([
    {
      id: 'square',
      name: 'Square',
      icon: CreditCard,
      connected: false,
      balance: 0,
      lastSync: 'Never'
    },
    {
      id: 'cashapp',
      name: 'Cash App',
      icon: Smartphone,
      connected: false,
      balance: 0,
      lastSync: 'Never'
    },
    {
      id: 'stripe',
      name: 'Stripe',
      icon: Building,
      connected: true,
      balance: 4567.89,
      lastSync: '2 hours ago'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      icon: Wallet,
      connected: true,
      balance: 2345.67,
      lastSync: '5 mins ago'
    }
  ]);

  const [apiKey, setApiKey] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const connectMethod = (id: string) => {
    if (!apiKey) {
      alert('Please enter an API key');
      return;
    }
    
    setMethods(methods.map(method => {
      if (method.id === id) {
        return {
          ...method,
          connected: true,
          balance: Math.random() * 5000,
          lastSync: 'Just now'
        };
      }
      return method;
    }));
    setApiKey('');
    setSelectedMethod(null);
    alert(`${id} connected successfully!`);
  };

  const disconnectMethod = (id: string) => {
    setMethods(methods.map(method => {
      if (method.id === id) {
        return {
          ...method,
          connected: false,
          balance: 0,
          lastSync: 'Never'
        };
      }
      return method;
    }));
  };

  const totalBalance = methods.reduce((sum, method) => 
    method.connected && method.balance ? sum + method.balance : sum, 0
  );

  return (
    <Card className="p-6 bg-gray-900 border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Payment Integrations</h3>
        <div className="text-right">
          <p className="text-sm text-gray-400">Total Balance</p>
          <p className="text-2xl font-bold text-green-400">${totalBalance.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {methods.map(method => (
          <div key={method.id} className="p-4 bg-gray-800 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-700 rounded-lg">
                  <method.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white">{method.name}</p>
                  <p className="text-xs text-gray-400">
                    {method.connected ? `Balance: $${method.balance?.toFixed(2)}` : 'Not connected'}
                  </p>
                </div>
              </div>
              <Badge variant={method.connected ? 'default' : 'secondary'}>
                {method.connected ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
              </Badge>
            </div>

            {method.connected ? (
              <div className="space-y-2">
                <p className="text-xs text-gray-500">Last sync: {method.lastSync}</p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => disconnectMethod(method.id)}
                  className="w-full text-xs border-gray-700"
                >
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                onClick={() => setSelectedMethod(method.id)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-xs"
              >
                Connect {method.name}
              </Button>
            )}
          </div>
        ))}
      </div>

      {selectedMethod && (
        <div className="p-4 bg-gray-800 rounded-lg space-y-3">
          <div className="flex items-center gap-2 text-yellow-400">
            <AlertCircle className="w-4 h-4" />
            <p className="text-sm">Enter API credentials for {selectedMethod}</p>
          </div>
          <div className="flex gap-2">
            <Input
              type="password"
              placeholder="API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
            />
            <Button
              onClick={() => connectMethod(selectedMethod)}
              className="bg-green-600 hover:bg-green-700"
            >
              Connect
            </Button>
            <Button
              variant="outline"
              onClick={() => setSelectedMethod(null)}
              className="border-gray-600"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between p-3 bg-blue-900/20 rounded-lg border border-blue-800/30">
        <p className="text-sm text-blue-300">
          Need help setting up payments?
        </p>
        <Button size="sm" variant="ghost" className="text-blue-400 hover:text-blue-300">
          <ExternalLink className="w-3 h-3 mr-1" />
          View Guide
        </Button>
      </div>
    </Card>
  );
}