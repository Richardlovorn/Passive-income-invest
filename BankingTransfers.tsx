import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { ArrowUpRight, ArrowDownLeft, Building2, CreditCard, DollarSign, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { squareService } from '@/lib/square';

const BankingTransfers: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [transferMethod, setTransferMethod] = useState('ach');
  const [accountDetails, setAccountDetails] = useState({
    routingNumber: '',
    accountNumber: '',
    accountName: '',
    bankName: ''
  });

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast({ title: "Error", description: "Enter valid amount", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: "Deposit Initiated",
        description: `$${depositAmount} ${transferMethod.toUpperCase()} deposit processing`
      });
      setDepositAmount('');
    } catch (error) {
      toast({ title: "Error", description: "Deposit failed", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast({ title: "Error", description: "Enter valid amount", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      if (squareService.isConfigured()) {
        await squareService.createPayout(parseFloat(withdrawAmount), accountDetails.accountNumber);
      }
      toast({
        title: "Withdrawal Initiated",
        description: `$${withdrawAmount} ${transferMethod.toUpperCase()} withdrawal processing`
      });
      setWithdrawAmount('');
    } catch (error) {
      toast({ title: "Error", description: "Withdrawal failed", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-orange-500">Banking & Transfers</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="deposit" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800">
            <TabsTrigger value="deposit">Deposit</TabsTrigger>
            <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
            <TabsTrigger value="accounts">Accounts</TabsTrigger>
          </TabsList>

          <TabsContent value="deposit" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label>Transfer Method</Label>
                <Select value={transferMethod} onValueChange={setTransferMethod}>
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ach">ACH Transfer</SelectItem>
                    <SelectItem value="wire">Wire Transfer</SelectItem>
                    <SelectItem value="direct">Direct Deposit</SelectItem>
                    <SelectItem value="square">Square</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Deposit Amount</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder="0.00"
                    className="pl-10 bg-gray-800 border-gray-700"
                  />
                </div>
              </div>

              <Alert className="border-green-600 bg-green-950/50">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertDescription>
                  {transferMethod === 'ach' && 'ACH: 2-3 business days, $0 fee'}
                  {transferMethod === 'wire' && 'Wire: Same day, $25 fee'}
                  {transferMethod === 'direct' && 'Direct: 1-2 business days, $0 fee'}
                  {transferMethod === 'square' && 'Square: Instant, 2.9% + $0.30 fee'}
                </AlertDescription>
              </Alert>

              <Button 
                onClick={handleDeposit} 
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowDownLeft className="mr-2 h-4 w-4" />}
                Deposit Funds
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="withdraw" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label>Transfer Method</Label>
                <Select value={transferMethod} onValueChange={setTransferMethod}>
                  <SelectTrigger className="bg-gray-800 border-gray-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ach">ACH Transfer</SelectItem>
                    <SelectItem value="wire">Wire Transfer</SelectItem>
                    <SelectItem value="square">Square Payout</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Withdrawal Amount</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="0.00"
                    className="pl-10 bg-gray-800 border-gray-700"
                  />
                </div>
              </div>

              <Button 
                onClick={handleWithdraw}
                disabled={loading}
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowUpRight className="mr-2 h-4 w-4" />}
                Withdraw Funds
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="accounts" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label>Bank Name</Label>
                <Input
                  value={accountDetails.bankName}
                  onChange={(e) => setAccountDetails({...accountDetails, bankName: e.target.value})}
                  placeholder="Chase, Bank of America, etc."
                  className="bg-gray-800 border-gray-700"
                />
              </div>

              <div>
                <Label>Account Name</Label>
                <Input
                  value={accountDetails.accountName}
                  onChange={(e) => setAccountDetails({...accountDetails, accountName: e.target.value})}
                  placeholder="John Doe"
                  className="bg-gray-800 border-gray-700"
                />
              </div>

              <div>
                <Label>Routing Number</Label>
                <Input
                  value={accountDetails.routingNumber}
                  onChange={(e) => setAccountDetails({...accountDetails, routingNumber: e.target.value})}
                  placeholder="9 digits"
                  maxLength={9}
                  className="bg-gray-800 border-gray-700"
                />
              </div>

              <div>
                <Label>Account Number</Label>
                <Input
                  type="password"
                  value={accountDetails.accountNumber}
                  onChange={(e) => setAccountDetails({...accountDetails, accountNumber: e.target.value})}
                  placeholder="Account number"
                  className="bg-gray-800 border-gray-700"
                />
              </div>

              <Button 
                onClick={() => {
                  localStorage.setItem('bankAccount', JSON.stringify(accountDetails));
                  toast({ title: "Success", description: "Bank account saved" });
                }}
                className="w-full"
              >
                <Building2 className="mr-2 h-4 w-4" />
                Save Bank Account
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default BankingTransfers;