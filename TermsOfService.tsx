import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertTriangle, FileText, Shield } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface TermsOfServiceProps {
  onAccept: () => void;
}

export function TermsOfService({ onAccept }: TermsOfServiceProps) {
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleAccept = async () => {
    if (!agreed) {
      toast({
        title: "Agreement Required",
        description: "You must agree to the terms to continue",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('user_agreements').insert({
          user_id: user.id,
          agreement_type: 'terms_and_profit_sharing',
          version: '1.0'
        });
      }
      onAccept();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to record agreement",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-6 w-6" />
          Terms of Service & Profit Sharing Agreement
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>IMPORTANT:</strong> By using this live trading platform, you agree to a 10% profit-sharing arrangement on all profitable trades.
          </AlertDescription>
        </Alert>

        <ScrollArea className="h-96 border rounded-lg p-4">
          <div className="space-y-4 text-sm">
            <section>
              <h3 className="font-bold text-lg mb-2">1. PROFIT SHARING AGREEMENT</h3>
              <p>By activating live trading, you grant permission for automatic deduction of 10% from all profitable funds generated through this platform. This fee will be automatically transferred to the platform owner's designated account.</p>
            </section>

            <section>
              <h3 className="font-bold text-lg mb-2">2. RISK DISCLOSURE</h3>
              <p className="font-semibold text-red-600">TRADING INVOLVES SUBSTANTIAL RISK OF LOSS</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Past performance does not guarantee future results</li>
                <li>No trading system can guarantee profits</li>
                <li>You may lose all or more than your initial investment</li>
                <li>Only trade with funds you can afford to lose</li>
              </ul>
            </section>

            <section>
              <h3 className="font-bold text-lg mb-2">3. NO LIABILITY DISCLAIMER</h3>
              <p>The platform and its owners are NOT LIABLE for:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Any loss of funds or capital</li>
                <li>Failure to achieve anticipated performance</li>
                <li>Results that differ from marketing materials</li>
                <li>Technical failures or system errors</li>
                <li>Market conditions or volatility</li>
                <li>Any direct, indirect, or consequential losses</li>
              </ul>
            </section>

            <section>
              <h3 className="font-bold text-lg mb-2">4. PERFORMANCE DISCLAIMER</h3>
              <p>While our algorithmic trading system has shown positive results in testing:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Individual results will vary</li>
                <li>Nothing is guaranteed</li>
                <li>Past success does not ensure future profits</li>
                <li>Market conditions constantly change</li>
              </ul>
            </section>

            <section>
              <h3 className="font-bold text-lg mb-2">5. ACCEPTANCE OF TERMS</h3>
              <p>By checking the box below and proceeding, you acknowledge that:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>You have read and understood all terms</li>
                <li>You accept the 10% profit-sharing arrangement</li>
                <li>You understand the risks involved</li>
                <li>You will not hold the platform liable for losses</li>
                <li>You are using this platform at your own risk</li>
              </ul>
            </section>
          </div>
        </ScrollArea>

        <div className="flex items-center space-x-2">
          <Checkbox 
            id="terms" 
            checked={agreed}
            onCheckedChange={(checked) => setAgreed(checked as boolean)}
          />
          <label htmlFor="terms" className="text-sm font-medium">
            I have read, understood, and agree to all terms including the 10% profit-sharing arrangement
          </label>
        </div>

        <Button 
          onClick={handleAccept} 
          disabled={!agreed || loading}
          className="w-full"
        >
          {loading ? 'Processing...' : 'Accept Terms & Activate Live Trading'}
        </Button>
      </CardContent>
    </Card>
  );
}