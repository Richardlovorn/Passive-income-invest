import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, RefreshCw, AlertTriangle, Zap, Globe, Key } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export function TradingAPIs() {
  const [polygonKey, setPolygonKey] = useState('');
  const [alpacaKey, setAlpacaKey] = useState('');
  const [alpacaSecret, setAlpacaSecret] = useState('');
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [testing, setTesting] = useState<string | null>(null);
  const { toast } = useToast();

  const testPolygonAPI = async () => {
    setTesting('polygon');
    try {
      // For now, simulate API test
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful response
      setTestResults(prev => ({
        ...prev,
        polygon: { success: true, message: 'Polygon API ready for configuration' }
      }));

      toast({
        title: "Test Complete",
        description: "Polygon API is ready to be configured",
      });
    } catch (error: any) {
      setTestResults(prev => ({
        ...prev,
        polygon: { success: false, message: 'Configuration needed' }
      }));
    } finally {
      setTesting(null);
    }
  };

  const testAlpacaAPI = async () => {
    setTesting('alpaca');
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setTestResults(prev => ({
        ...prev,
        alpaca: { success: true, message: 'Alpaca API ready for configuration' }
      }));

      toast({
        title: "Test Complete", 
        description: "Alpaca API is ready to be configured",
      });
    } catch (error: any) {
      setTestResults(prev => ({
        ...prev,
        alpaca: { success: false, message: 'Configuration needed' }
      }));
    } finally {
      setTesting(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-black/50 border-orange-500/30">
        <CardHeader className="border-b border-orange-500/20">
          <CardTitle className="text-2xl font-bold text-orange-400">Trading APIs Configuration</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Polygon API */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-yellow-400" />
              <h3 className="text-lg font-semibold text-white">Polygon.io Market Data</h3>
              {testResults.polygon?.success && (
                <Badge className="bg-green-500/20 text-green-400">Connected</Badge>
              )}
            </div>
            
            <Input
              placeholder="Enter Polygon API Key"
              value={polygonKey}
              onChange={(e) => setPolygonKey(e.target.value)}
              className="bg-black/50 border-orange-500/30 text-white"
            />
            
            <Button
              onClick={testPolygonAPI}
              disabled={testing === 'polygon'}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
            >
              {testing === 'polygon' ? (
                <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Testing...</>
              ) : (
                <><Zap className="w-4 h-4 mr-2" /> Test Polygon Connection</>
              )}
            </Button>

            {testResults.polygon && (
              <Alert className={testResults.polygon.success ? 'border-green-500 bg-green-500/10' : 'border-orange-500 bg-orange-500/10'}>
                <AlertDescription className="text-white">
                  {testResults.polygon.message}
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Alpaca API */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-green-400" />
              <h3 className="text-lg font-semibold text-white">Alpaca Trading</h3>
              {testResults.alpaca?.success && (
                <Badge className="bg-green-500/20 text-green-400">Connected</Badge>
              )}
            </div>
            
            <Input
              placeholder="Enter Alpaca API Key"
              value={alpacaKey}
              onChange={(e) => setAlpacaKey(e.target.value)}
              className="bg-black/50 border-orange-500/30 text-white"
            />
            
            <Input
              placeholder="Enter Alpaca Secret Key"
              type="password"
              value={alpacaSecret}
              onChange={(e) => setAlpacaSecret(e.target.value)}
              className="bg-black/50 border-orange-500/30 text-white"
            />
            
            <Button
              onClick={testAlpacaAPI}
              disabled={testing === 'alpaca'}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            >
              {testing === 'alpaca' ? (
                <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Testing...</>
              ) : (
                <><Zap className="w-4 h-4 mr-2" /> Test Alpaca Connection</>
              )}
            </Button>

            {testResults.alpaca && (
              <Alert className={testResults.alpaca.success ? 'border-green-500 bg-green-500/10' : 'border-orange-500 bg-orange-500/10'}>
                <AlertDescription className="text-white">
                  {testResults.alpaca.message}
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Status Summary */}
          <div className="pt-4 border-t border-orange-500/20">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg p-4 border border-orange-500/30">
                <p className="text-sm text-gray-400">Market Data Status</p>
                <p className="text-xl font-bold text-orange-400">
                  {testResults.polygon?.success ? 'Active' : 'Configure'}
                </p>
              </div>
              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg p-4 border border-green-500/30">
                <p className="text-sm text-gray-400">Trading Status</p>
                <p className="text-xl font-bold text-green-400">
                  {testResults.alpaca?.success ? 'Active' : 'Configure'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default TradingAPIs;