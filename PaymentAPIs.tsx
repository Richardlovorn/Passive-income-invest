import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Server, CheckCircle, AlertCircle, CreditCard, DollarSign } from 'lucide-react';

interface PaymentAPIsProps {
  credentials: any;
  setCredentials: any;
  isProduction: boolean;
  showSecrets: Record<string, boolean>;
  toggleSecret: (field: string) => void;
  testConnection: (provider: string) => void;
  connectionStatus: Record<string, string>;
}

export function PaymentAPIs({ 
  credentials, 
  setCredentials, 
  isProduction, 
  showSecrets, 
  toggleSecret, 
  testConnection,
  connectionStatus 
}: PaymentAPIsProps) {
  const updateCredential = (provider: string, field: string, value: string) => {
    setCredentials({
      ...credentials,
      [provider]: { ...credentials[provider], [field]: value }
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Square
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Get your API credentials at <a href="https://developer.squareup.com" target="_blank" className="underline">developer.squareup.com</a>
            </AlertDescription>
          </Alert>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{isProduction ? "Production" : "Sandbox"} Access Token</Label>
              <div className="relative">
                <Input
                  type={showSecrets['square-token'] ? 'text' : 'password'}
                  value={isProduction ? credentials.square.accessToken : credentials.square.sandboxAccessToken}
                  onChange={(e) => updateCredential('square', isProduction ? 'accessToken' : 'sandboxAccessToken', e.target.value)}
                  placeholder="Enter Access Token"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute right-2 top-0 h-full"
                  onClick={() => toggleSecret('square-token')}
                >
                  {showSecrets['square-token'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Application ID</Label>
              <Input
                value={credentials.square.applicationId}
                onChange={(e) => updateCredential('square', 'applicationId', e.target.value)}
                placeholder="Enter Application ID"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Location ID</Label>
              <Input
                value={credentials.square.locationId}
                onChange={(e) => updateCredential('square', 'locationId', e.target.value)}
                placeholder="Enter Location ID"
              />
            </div>
          </div>
          
          <Button onClick={() => testConnection('square')} variant="outline" className="w-full">
            <Server className="w-4 h-4 mr-2" />
            Test Connection
            {connectionStatus.square === 'connected' && <CheckCircle className="w-4 h-4 ml-2 text-green-500" />}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Stripe
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Get your API keys at <a href="https://dashboard.stripe.com" target="_blank" className="underline">dashboard.stripe.com</a>
            </AlertDescription>
          </Alert>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{isProduction ? "Live" : "Test"} Publishable Key</Label>
              <Input
                value={isProduction ? credentials.stripe.publishableKey : credentials.stripe.testPublishableKey}
                onChange={(e) => updateCredential('stripe', isProduction ? 'publishableKey' : 'testPublishableKey', e.target.value)}
                placeholder="pk_live_... or pk_test_..."
              />
            </div>
            
            <div className="space-y-2">
              <Label>{isProduction ? "Live" : "Test"} Secret Key</Label>
              <div className="relative">
                <Input
                  type={showSecrets['stripe-secret'] ? 'text' : 'password'}
                  value={isProduction ? credentials.stripe.secretKey : credentials.stripe.testSecretKey}
                  onChange={(e) => updateCredential('stripe', isProduction ? 'secretKey' : 'testSecretKey', e.target.value)}
                  placeholder="sk_live_... or sk_test_..."
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute right-2 top-0 h-full"
                  onClick={() => toggleSecret('stripe-secret')}
                >
                  {showSecrets['stripe-secret'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </div>
          
          <Button onClick={() => testConnection('stripe')} variant="outline" className="w-full">
            <Server className="w-4 h-4 mr-2" />
            Test Connection
            {connectionStatus.stripe === 'connected' && <CheckCircle className="w-4 h-4 ml-2 text-green-500" />}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Coinbase Commerce</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>API Key</Label>
              <Input
                value={credentials.coinbase.apiKey}
                onChange={(e) => updateCredential('coinbase', 'apiKey', e.target.value)}
                placeholder="Enter API Key"
              />
            </div>
            
            <div className="space-y-2">
              <Label>API Secret</Label>
              <div className="relative">
                <Input
                  type={showSecrets['coinbase'] ? 'text' : 'password'}
                  value={credentials.coinbase.apiSecret}
                  onChange={(e) => updateCredential('coinbase', 'apiSecret', e.target.value)}
                  placeholder="Enter API Secret"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute right-2 top-0 h-full"
                  onClick={() => toggleSecret('coinbase')}
                >
                  {showSecrets['coinbase'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </div>
          
          <Button onClick={() => testConnection('coinbase')} variant="outline" className="w-full">
            <Server className="w-4 h-4 mr-2" />
            Test Connection
            {connectionStatus.coinbase === 'connected' && <CheckCircle className="w-4 h-4 ml-2 text-green-500" />}
          </Button>
        </CardContent>
      </Card>
    </>
  );
}