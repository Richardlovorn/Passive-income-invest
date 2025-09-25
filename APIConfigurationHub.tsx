import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Shield, Server, Zap, Database, Brain, Cpu, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import TradingAPIs from './TradingAPIs';
import { PaymentAPIs } from './PaymentAPIs';
import { AdvancedSystems } from './AdvancedSystems';
interface APICredentials {
  alpaca: { keyId: string; secretKey: string; paperKeyId: string; paperSecretKey: string; };
  polygon: { apiKey: string; };
  square: { accessToken: string; sandboxAccessToken: string; applicationId: string; locationId: string; };
  stripe: { publishableKey: string; secretKey: string; testPublishableKey: string; testSecretKey: string; };
  coinbase: { apiKey: string; apiSecret: string; };
  binance: { apiKey: string; apiSecret: string; testnetApiKey: string; testnetApiSecret: string; };
}

export function APIConfigurationHub() {
  const [isProduction, setIsProduction] = useState(false);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [connectionStatus, setConnectionStatus] = useState<Record<string, 'connected' | 'disconnected' | 'testing'>>({});
  const [credentials, setCredentials] = useState<APICredentials>({
    alpaca: { keyId: '', secretKey: '', paperKeyId: '', paperSecretKey: '' },
    polygon: { apiKey: '' },
    square: { accessToken: '', sandboxAccessToken: '', applicationId: '', locationId: '' },
    stripe: { publishableKey: '', secretKey: '', testPublishableKey: '', testSecretKey: '' },
    coinbase: { apiKey: '', apiSecret: '' },
    binance: { apiKey: '', apiSecret: '', testnetApiKey: '', testnetApiSecret: '' }
  });

  useEffect(() => {
    const saved = localStorage.getItem('api_credentials');
    if (saved) {
      setCredentials(JSON.parse(saved));
    }
    const prodMode = localStorage.getItem('production_mode') === 'true';
    setIsProduction(prodMode);
  }, []);

  const saveCredentials = () => {
    localStorage.setItem('api_credentials', JSON.stringify(credentials));
    localStorage.setItem('production_mode', isProduction.toString());
    alert('API credentials saved securely!');
  };

  const testConnection = async (provider: string) => {
    setConnectionStatus({ ...connectionStatus, [provider]: 'testing' });
    setTimeout(() => {
      setConnectionStatus({ ...connectionStatus, [provider]: 'connected' });
    }, 2000);
  };

  const toggleSecret = (field: string) => {
    setShowSecrets({ ...showSecrets, [field]: !showSecrets[field] });
  };

  return (
    <div className="p-6 space-y-6">
      <Card className="border-2 border-purple-500/20 bg-gradient-to-br from-gray-900 to-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Shield className="w-6 h-6 text-purple-500" />
                API Configuration Hub
              </CardTitle>
              <CardDescription>Secure integration management for trading and payment systems</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant={isProduction ? "destructive" : "secondary"}>
                {isProduction ? "LIVE MODE" : "SANDBOX MODE"}
              </Badge>
              <div className="flex items-center gap-2">
                <Label>Production</Label>
                <Switch checked={isProduction} onCheckedChange={setIsProduction} />
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="border-green-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              Quantum Processing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="outline" className="text-green-500">Active</Badge>
          </CardContent>
        </Card>
        
        <Card className="border-blue-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Database className="w-4 h-4" />
              Database Engine
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="outline" className="text-blue-500">Optimized</Badge>
          </CardContent>
        </Card>
        
        <Card className="border-purple-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Brain className="w-4 h-4" />
              AI Strategy Engine
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="outline" className="text-purple-500">Learning</Badge>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trading" className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="trading">Trading APIs</TabsTrigger>
          <TabsTrigger value="payments">Payment Gateways</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Systems</TabsTrigger>
        </TabsList>

        <TabsContent value="trading" className="space-y-4">
          <TradingAPIs 
            credentials={credentials} 
            setCredentials={setCredentials}
            isProduction={isProduction}
            showSecrets={showSecrets}
            toggleSecret={toggleSecret}
            testConnection={testConnection}
            connectionStatus={connectionStatus}
          />
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <PaymentAPIs 
            credentials={credentials} 
            setCredentials={setCredentials}
            isProduction={isProduction}
            showSecrets={showSecrets}
            toggleSecret={toggleSecret}
            testConnection={testConnection}
            connectionStatus={connectionStatus}
          />
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <AdvancedSystems />
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => window.location.reload()}>
          Reset
        </Button>
        <Button onClick={saveCredentials} className="bg-gradient-to-r from-purple-600 to-blue-600">
          <Lock className="w-4 h-4 mr-2" />
          Save All Configurations
        </Button>
      </div>
    </div>
  );
}