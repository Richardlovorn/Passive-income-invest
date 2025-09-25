import React, { useState, useEffect } from 'react';
import { squareService } from '@/lib/square';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { CreditCard, Settings, DollarSign, CheckCircle, AlertCircle, Banknote } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const SquareIntegration: React.FC = () => {
  const [accessToken, setAccessToken] = useState('');
  const [locationId, setLocationId] = useState('');
  const [accountId, setAccountId] = useState('');
  const [merchantId, setMerchantId] = useState('');
  const [bankAccountId, setBankAccountId] = useState('');
  const [environment, setEnvironment] = useState<'sandbox' | 'production'>('production');
  const [autoWithdrawal, setAutoWithdrawal] = useState(true);
  const [withdrawalThreshold, setWithdrawalThreshold] = useState('100');
  const [cashTag, setCashTag] = useState('');
  const [isConfigured, setIsConfigured] = useState(!!squareService.getConfig());
  const [isConnected, setIsConnected] = useState(false);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const config = squareService.getConfig();
    if (config) {
      setIsConfigured(true);
      verifyConnection();
      fetchBalance();
    }
  }, []);

  const verifyConnection = async () => {
    const connected = await squareService.verifyConnection();
    setIsConnected(connected);
    if (connected) {
      toast({
        title: "Square Connected",
        description: "Your Square account is active and connected",
      });
    }
  };

  const fetchBalance = async () => {
    const bal = await squareService.getBalance();
    setBalance(bal / 100); // Convert from cents
  };

  const handleConfigure = async () => {
    if (!accessToken || !locationId) {
      toast({
        title: "Missing Configuration",
        description: "Please enter your Square API credentials",
        variant: "destructive"
      });
      return;
    }

    squareService.configure({
      accessToken,
      locationId,
      accountId,
      merchantId,
      bankAccountId,
      environment,
      autoWithdrawal,
      withdrawalThreshold: parseFloat(withdrawalThreshold)
    });

    setIsConfigured(true);
    
    // Verify connection
    const connected = await squareService.verifyConnection();
    setIsConnected(connected);
    
    if (connected) {
      toast({
        title: "Square Configured Successfully!",
        description: "Your Square account is connected and ready for real transactions",
      });
      fetchBalance();
    } else {
      toast({
        title: "Configuration Saved",
        description: "Please verify your credentials are correct",
        variant: "destructive"
      });
    }
  };

  const handleTransferToCashApp = async () => {
    if (!cashTag) {
      toast({
        title: "Missing Cash Tag",
        description: "Please enter your Cash App $cashtag",
        variant: "destructive"
      });
      return;
    }

    try {
      const transfer = await squareService.transferToCashApp(balance, cashTag);
      toast({
        title: "Transfer Initiated!",
        description: `Sending $${balance.toFixed(2)} to ${cashTag}`,
      });
      fetchBalance();
    } catch (error: any) {
      toast({
        title: "Transfer Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {!isConfigured ? (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardTitle className="flex items-center">
              <Settings className="mr-2" />
              Configure Square API (Production)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="bg-yellow-500/10 border border-yellow-500/50 rounded p-3">
              <p className="text-yellow-400 text-sm flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                Enter your real Square credentials for live trading profit processing
              </p>
            </div>

            <div>
              <Label className="text-gray-300">Access Token *</Label>
              <Input
                type="password"
                placeholder="Your Square Access Token"
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            
            <div>
              <Label className="text-gray-300">Location ID *</Label>
              <Input
                placeholder="Your Square Location ID"
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div>
              <Label className="text-gray-300">Account ID</Label>
              <Input
                placeholder="Your Square Account ID (optional)"
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div>
              <Label className="text-gray-300">Merchant ID</Label>
              <Input
                placeholder="Your Square Merchant ID (optional)"
                value={merchantId}
                onChange={(e) => setMerchantId(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div>
              <Label className="text-gray-300">Bank Account ID (for auto-withdrawals)</Label>
              <Input
                placeholder="Bank account ID for automatic payouts"
                value={bankAccountId}
                onChange={(e) => setBankAccountId(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            
            <div>
              <Label className="text-gray-300">Environment</Label>
              <select
                value={environment}
                onChange={(e) => setEnvironment(e.target.value as 'sandbox' | 'production')}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
              >
                <option value="production">Production (Live - Real Money)</option>
                <option value="sandbox">Sandbox (Testing Only)</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-gray-300">Enable Auto-Withdrawal</Label>
              <Switch
                checked={autoWithdrawal}
                onCheckedChange={setAutoWithdrawal}
              />
            </div>

            {autoWithdrawal && (
              <div>
                <Label className="text-gray-300">Auto-Withdrawal Threshold ($)</Label>
                <Input
                  type="number"
                  placeholder="Minimum amount to trigger withdrawal"
                  value={withdrawalThreshold}
                  onChange={(e) => setWithdrawalThreshold(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
            )}
            
            <Button
              onClick={handleConfigure}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
            >
              Connect Square Account
            </Button>
            
            <p className="text-xs text-gray-400 text-center">
              Get your API keys at square.com/developers
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <CreditCard className="mr-2" />
                  Square Payment Processing
                </span>
                {isConnected && (
                  <span className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Connected
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-700/50 rounded p-4">
                  <p className="text-gray-400 text-sm">Square Balance</p>
                  <p className="text-2xl font-bold text-green-400">
                    ${balance.toFixed(2)}
                  </p>
                </div>
                
                <div className="bg-gray-700/50 rounded p-4">
                  <p className="text-gray-400 text-sm">Auto-Withdrawal</p>
                  <p className="text-lg font-semibold text-white">
                    {squareService.getConfig()?.autoWithdrawal ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
                
                <div className="bg-gray-700/50 rounded p-4">
                  <p className="text-gray-400 text-sm">Environment</p>
                  <p className="text-lg font-semibold text-white">
                    {squareService.getConfig()?.environment === 'production' ? 'Live' : 'Sandbox'}
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded">
                <p className="text-blue-400 text-sm mb-2">
                  Trading profits are automatically processed through Square
                </p>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Profits from trades are instantly added to Square balance</li>
                  <li>• Auto-withdrawal sends funds to your bank when threshold is met</li>
                  <li>• All transactions are recorded and trackable</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              <CardTitle className="flex items-center">
                <Banknote className="mr-2" />
                Instant Cash App Transfer
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <Label className="text-gray-300">Cash App $cashtag</Label>
                <div className="flex space-x-2">
                  <Input
                    placeholder="$yourcashtag"
                    value={cashTag}
                    onChange={(e) => setCashTag(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                  <Button
                    onClick={handleTransferToCashApp}
                    className="bg-gradient-to-r from-purple-600 to-pink-600"
                    disabled={balance <= 0}
                  >
                    <DollarSign className="w-4 h-4 mr-1" />
                    Transfer ${balance.toFixed(2)}
                  </Button>
                </div>
              </div>
              
              <p className="text-xs text-gray-400">
                Transfer your Square balance instantly to Cash App
              </p>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={() => {
                localStorage.removeItem('square_config');
                setIsConfigured(false);
                setIsConnected(false);
              }}
              className="border-gray-600 hover:bg-gray-700"
            >
              Reconfigure Square
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SquareIntegration;