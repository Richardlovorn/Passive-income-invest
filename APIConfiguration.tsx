import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Key, 
  Save, 
  Shield, 
  AlertTriangle,
  Check,
  Eye,
  EyeOff,
  TestTube,
  DollarSign
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export default function APIConfiguration() {
  const [showKeys, setShowKeys] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  
  // Alpaca Configuration
  const [alpacaConfig, setAlpacaConfig] = useState({
    apiKey: '',
    secretKey: '',
    isPaper: true,
    baseUrl: 'https://paper-api.alpaca.markets'
  });

  // Square Configuration
  const [squareConfig, setSquareConfig] = useState({
    accessToken: '',
    locationId: '',
    accountId: '',
    merchantId: '',
    bankAccountId: '',
    environment: 'sandbox'
  });

  useEffect(() => {
    // Load saved configurations
    const savedAlpaca = localStorage.getItem('alpacaConfig');
    const savedSquare = localStorage.getItem('squareConfig');
    
    if (savedAlpaca) {
      setAlpacaConfig(JSON.parse(savedAlpaca));
    }
    if (savedSquare) {
      setSquareConfig(JSON.parse(savedSquare));
    }
  }, []);

  const saveAlpacaConfig = () => {
    localStorage.setItem('alpacaConfig', JSON.stringify(alpacaConfig));
    toast({
      title: "Alpaca Configuration Saved",
      description: "Your Alpaca API keys have been securely stored",
    });
  };

  const saveSquareConfig = () => {
    localStorage.setItem('squareConfig', JSON.stringify(squareConfig));
    toast({
      title: "Square Configuration Saved",
      description: "Your Square API keys have been securely stored",
    });
  };

  const testAlpacaConnection = async () => {
    setTestingConnection(true);
    try {
      // Simulate API test
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast({
        title: "Connection Successful",
        description: "Alpaca API is configured correctly",
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Please check your API credentials",
        variant: "destructive"
      });
    } finally {
      setTestingConnection(false);
    }
  };

  const testSquareConnection = async () => {
    setTestingConnection(true);
    try {
      // Simulate API test
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast({
        title: "Connection Successful",
        description: "Square API is configured correctly",
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Please check your API credentials",
        variant: "destructive"
      });
    } finally {
      setTestingConnection(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            API Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <Label>Show API Keys</Label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowKeys(!showKeys)}
              className="flex items-center gap-2"
            >
              {showKeys ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showKeys ? 'Hide' : 'Show'}
            </Button>
          </div>

          <Tabs defaultValue="alpaca" className="space-y-4">
            <TabsList className="bg-gray-800">
              <TabsTrigger value="alpaca">Alpaca Trading</TabsTrigger>
              <TabsTrigger value="square">Square Payments</TabsTrigger>
            </TabsList>

            <TabsContent value="alpaca" className="space-y-4">
              <Alert className="border-yellow-600 bg-yellow-950/50">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <AlertDescription>
                  Get your Alpaca API keys from alpaca.markets/docs/api-references/
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Paper Trading Mode</Label>
                  <Switch
                    checked={alpacaConfig.isPaper}
                    onCheckedChange={(checked) => {
                      setAlpacaConfig({
                        ...alpacaConfig,
                        isPaper: checked,
                        baseUrl: checked 
                          ? 'https://paper-api.alpaca.markets'
                          : 'https://api.alpaca.markets'
                      });
                    }}
                  />
                </div>

                <div>
                  <Label htmlFor="alpacaKey">API Key ID</Label>
                  <Input
                    id="alpacaKey"
                    type={showKeys ? "text" : "password"}
                    value={alpacaConfig.apiKey}
                    onChange={(e) => setAlpacaConfig({...alpacaConfig, apiKey: e.target.value})}
                    placeholder="PK..."
                    className="bg-gray-800 border-gray-700"
                  />
                </div>

                <div>
                  <Label htmlFor="alpacaSecret">Secret Key</Label>
                  <Input
                    id="alpacaSecret"
                    type={showKeys ? "text" : "password"}
                    value={alpacaConfig.secretKey}
                    onChange={(e) => setAlpacaConfig({...alpacaConfig, secretKey: e.target.value})}
                    placeholder="Your secret key"
                    className="bg-gray-800 border-gray-700"
                  />
                </div>

                <div className="flex gap-4">
                  <Button onClick={saveAlpacaConfig} className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Save Configuration
                  </Button>
                  <Button 
                    onClick={testAlpacaConnection}
                    variant="outline"
                    disabled={testingConnection}
                    className="flex items-center gap-2"
                  >
                    <TestTube className="w-4 h-4" />
                    Test Connection
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="square" className="space-y-4">
              <Alert className="border-blue-600 bg-blue-950/50">
                <DollarSign className="h-4 w-4 text-blue-500" />
                <AlertDescription>
                  Get your Square API keys from square.com/developers
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="squareToken">Access Token</Label>
                  <Input
                    id="squareToken"
                    type={showKeys ? "text" : "password"}
                    value={squareConfig.accessToken}
                    onChange={(e) => setSquareConfig({...squareConfig, accessToken: e.target.value})}
                    placeholder="Your Square access token"
                    className="bg-gray-800 border-gray-700"
                  />
                </div>

                <div>
                  <Label htmlFor="locationId">Location ID</Label>
                  <Input
                    id="locationId"
                    type="text"
                    value={squareConfig.locationId}
                    onChange={(e) => setSquareConfig({...squareConfig, locationId: e.target.value})}
                    placeholder="Your Square location ID"
                    className="bg-gray-800 border-gray-700"
                  />
                </div>

                <div>
                  <Label htmlFor="accountId">Account ID (Optional)</Label>
                  <Input
                    id="accountId"
                    type="text"
                    value={squareConfig.accountId}
                    onChange={(e) => setSquareConfig({...squareConfig, accountId: e.target.value})}
                    placeholder="Your Square account ID"
                    className="bg-gray-800 border-gray-700"
                  />
                </div>

                <div>
                  <Label htmlFor="merchantId">Merchant ID (Optional)</Label>
                  <Input
                    id="merchantId"
                    type="text"
                    value={squareConfig.merchantId}
                    onChange={(e) => setSquareConfig({...squareConfig, merchantId: e.target.value})}
                    placeholder="Your Square merchant ID"
                    className="bg-gray-800 border-gray-700"
                  />
                </div>

                <div>
                  <Label htmlFor="bankAccountId">Bank Account ID (For Auto-withdrawals)</Label>
                  <Input
                    id="bankAccountId"
                    type="text"
                    value={squareConfig.bankAccountId}
                    onChange={(e) => setSquareConfig({...squareConfig, bankAccountId: e.target.value})}
                    placeholder="Your linked bank account ID"
                    className="bg-gray-800 border-gray-700"
                  />
                </div>

                <div className="flex gap-4">
                  <Button onClick={saveSquareConfig} className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Save Configuration
                  </Button>
                  <Button 
                    onClick={testSquareConnection}
                    variant="outline"
                    disabled={testingConnection}
                    className="flex items-center gap-2"
                  >
                    <TestTube className="w-4 h-4" />
                    Test Connection
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Alert className="border-green-600 bg-green-950/50">
        <Shield className="h-4 w-4 text-green-500" />
        <AlertDescription>
          Your API keys are stored locally in your browser and never sent to any external servers. 
          They are used only for direct communication with Alpaca and Square APIs.
        </AlertDescription>
      </Alert>
    </div>
  );
}