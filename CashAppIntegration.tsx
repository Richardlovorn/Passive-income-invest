import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, Send, Download, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

const CashAppIntegration = () => {
  const [cashAppHandle, setCashAppHandle] = useState('');
  const [amount, setAmount] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [balance, setBalance] = useState(25000);

  useEffect(() => {
    fetchTransactionHistory();
  }, []);

  const fetchTransactionHistory = async () => {
    try {
      const { data } = await supabase.functions.invoke('payment-processor', {
        body: { action: 'history' }
      });
      if (data?.success) {
        setTransactions(data.data);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const verifyCashApp = async () => {
    if (!cashAppHandle) {
      toast({
        title: "Error",
        description: "Please enter your Cash App handle",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data } = await supabase.functions.invoke('payment-processor', {
        body: { action: 'verify', cashAppHandle }
      });
      
      if (data?.success) {
        setIsVerified(true);
        toast({
          title: "Verified!",
          description: data.message,
        });
      }
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Unable to verify Cash App handle",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data } = await supabase.functions.invoke('payment-processor', {
        body: {
          action: 'deposit',
          amount: parseFloat(amount),
          cashAppHandle,
          userId: (await supabase.auth.getUser()).data.user?.id
        }
      });
      
      if (data?.success) {
        setBalance(prev => prev + parseFloat(amount));
        toast({
          title: "Deposit Initiated",
          description: data.message,
        });
        setAmount('');
        fetchTransactionHistory();
      }
    } catch (error) {
      toast({
        title: "Deposit Failed",
        description: "Unable to process deposit",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!amount || parseFloat(amount) <= 0 || parseFloat(amount) > balance) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid withdrawal amount",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data } = await supabase.functions.invoke('payment-processor', {
        body: {
          action: 'withdraw',
          amount: parseFloat(amount),
          cashAppHandle,
          userId: (await supabase.auth.getUser()).data.user?.id
        }
      });
      
      if (data?.success) {
        setBalance(prev => prev - parseFloat(amount));
        toast({
          title: "Withdrawal Processing",
          description: data.message,
        });
        setAmount('');
        fetchTransactionHistory();
      }
    } catch (error) {
      toast({
        title: "Withdrawal Failed",
        description: "Unable to process withdrawal",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-400" />
            Cash App Integration
          </span>
          <Badge variant={isVerified ? "default" : "secondary"}>
            {isVerified ? 'VERIFIED' : 'NOT VERIFIED'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Balance Display */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 rounded-lg">
          <p className="text-sm text-white/80">Available Balance</p>
          <p className="text-3xl font-bold text-white">
            ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>

        {/* Verification Section */}
        {!isVerified && (
          <div className="bg-gray-900/50 p-4 rounded-lg space-y-3">
            <p className="text-sm text-gray-400">Link your Cash App to enable instant transfers</p>
            <div className="flex gap-2">
              <Input
                placeholder="$YourCashAppHandle"
                value={cashAppHandle}
                onChange={(e) => setCashAppHandle(e.target.value)}
                className="bg-gray-800 border-gray-600"
              />
              <Button onClick={verifyCashApp} disabled={loading}>
                Verify
              </Button>
            </div>
          </div>
        )}

        {/* Transaction Tabs */}
        <Tabs defaultValue="deposit" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800">
            <TabsTrigger value="deposit">Deposit</TabsTrigger>
            <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
          </TabsList>
          
          <TabsContent value="deposit" className="space-y-3">
            <Input
              type="number"
              placeholder="Amount to deposit"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-gray-900/50 border-gray-600"
            />
            <Button 
              onClick={handleDeposit} 
              disabled={loading || !isVerified}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Deposit Funds
            </Button>
          </TabsContent>
          
          <TabsContent value="withdraw" className="space-y-3">
            <Input
              type="number"
              placeholder="Amount to withdraw"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-gray-900/50 border-gray-600"
            />
            <Button 
              onClick={handleWithdraw} 
              disabled={loading || !isVerified}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <Send className="w-4 h-4 mr-2" />
              Withdraw Funds
            </Button>
          </TabsContent>
        </Tabs>

        {/* Recent Transactions */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-400">Recent Transactions</h3>
          {transactions.length === 0 ? (
            <p className="text-xs text-gray-500">No transactions yet</p>
          ) : (
            transactions.slice(0, 5).map((tx) => (
              <div key={tx.id} className="bg-gray-900/50 p-3 rounded-lg flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {tx.status === 'completed' ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <Clock className="w-4 h-4 text-yellow-400" />
                  )}
                  <div>
                    <p className="text-sm font-medium capitalize">{tx.type}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(tx.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">
                    {tx.type === 'withdrawal' ? '-' : '+'}${tx.amount}
                  </p>
                  <Badge variant={tx.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                    {tx.status}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CashAppIntegration;