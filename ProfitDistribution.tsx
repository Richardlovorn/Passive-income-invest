import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, Calculator, Send, History } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export function ProfitDistribution() {
  const [profits, setProfits] = useState({
    totalProfit: 0,
    platformFee: 0,
    netProfit: 0,
    pendingDistribution: 0
  });
  const [distributions, setDistributions] = useState<any[]>([]);
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadProfitData();
    loadDistributions();
  }, []);

  const loadProfitData = async () => {
    // Calculate profits from trading history
    const { data: trades } = await supabase
      .from('trading_history')
      .select('profit_loss')
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    if (trades) {
      const total = trades.reduce((sum, t) => sum + (t.profit_loss || 0), 0);
      if (total > 0) {
        setProfits({
          totalProfit: total,
          platformFee: total * 0.1,
          netProfit: total * 0.9,
          pendingDistribution: total * 0.1
        });
      }
    }
  };

  const loadDistributions = async () => {
    const { data } = await supabase
      .from('profit_distributions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (data) setDistributions(data);
  };

  const processDistribution = async () => {
    setProcessing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase.functions.invoke('profit-distribution', {
        body: {
          userId: user.id,
          profit: profits.totalProfit,
          period: {
            start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            end: new Date().toISOString()
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Distribution Processed",
        description: `Platform fee of $${profits.platformFee.toFixed(2)} has been calculated`,
      });

      loadDistributions();
      setProfits(prev => ({ ...prev, pendingDistribution: 0 }));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process distribution",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Profit Distribution System
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Profit</p>
                    <p className="text-2xl font-bold">${profits.totalProfit.toFixed(2)}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Platform Fee (10%)</p>
                    <p className="text-2xl font-bold text-orange-500">${profits.platformFee.toFixed(2)}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Your Net Profit</p>
                    <p className="text-2xl font-bold text-green-500">${profits.netProfit.toFixed(2)}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {profits.pendingDistribution > 0 && (
            <div className="p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Pending Distribution</span>
                <span className="text-lg font-bold">${profits.pendingDistribution.toFixed(2)}</span>
              </div>
              <Progress value={10} className="mb-3" />
              <Button 
                onClick={processDistribution}
                disabled={processing}
                className="w-full"
              >
                <Send className="mr-2 h-4 w-4" />
                {processing ? 'Processing...' : 'Process Distribution'}
              </Button>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <History className="h-4 w-4" />
              <span className="font-medium">Recent Distributions</span>
            </div>
            {distributions.map((dist) => (
              <div key={dist.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="text-sm font-medium">
                    {new Date(dist.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Total: ${dist.total_profit} | Fee: ${dist.platform_fee}
                  </p>
                </div>
                <Badge variant={dist.status === 'processed' ? 'default' : 'secondary'}>
                  {dist.status}
                </Badge>
              </div>
            ))}
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <p className="text-sm">
              <strong>Automated Distribution:</strong> Platform fees are automatically calculated at 10% of all profitable trades. 
              Distributions are processed monthly and transferred to the platform's designated account.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}