import React, { useState, useEffect } from 'react';
import { squareService } from '@/lib/square';
import { alpacaService } from '@/lib/alpaca';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, DollarSign, TrendingUp, Zap, CheckCircle2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface PaymentFlowStep {
  id: number;
  title: string;
  description: string;
  amount?: number;
  status: 'pending' | 'processing' | 'completed';
}

const SquarePaymentFlow: React.FC = () => {
  const [flowSteps, setFlowSteps] = useState<PaymentFlowStep[]>([
    { id: 1, title: 'Trading Profit Generated', description: 'Alpaca trading bot closes profitable position', status: 'pending' },
    { id: 2, title: 'Profit Calculated', description: 'System calculates net profit after fees', status: 'pending' },
    { id: 3, title: 'Square Processing', description: 'Profit transferred to Square account', status: 'pending' },
    { id: 4, title: 'Auto-Withdrawal', description: 'Funds sent to your bank account', status: 'pending' }
  ]);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastProfit, setLastProfit] = useState(0);
  const [totalProcessed, setTotalProcessed] = useState(0);

  useEffect(() => {
    // Listen for trading profits
    const interval = setInterval(checkForProfits, 5000);
    return () => clearInterval(interval);
  }, []);

  const checkForProfits = async () => {
    try {
      const positions = await alpacaService.getPositions();
      const closedPositions = positions.filter((p: any) => p.unrealized_pl > 0);
      
      if (closedPositions.length > 0 && !isProcessing) {
        const totalProfit = closedPositions.reduce((sum: number, p: any) => sum + p.unrealized_pl, 0);
        await processProfit(totalProfit);
      }
    } catch (error) {
      console.error('Error checking profits:', error);
    }
  };

  const processProfit = async (amount: number) => {
    setIsProcessing(true);
    setLastProfit(amount);
    
    // Step 1: Trading profit generated
    updateStep(1, 'processing');
    await delay(1000);
    updateStep(1, 'completed');
    
    // Step 2: Calculate profit
    updateStep(2, 'processing');
    const netProfit = amount * 0.98; // 2% fee
    await delay(1000);
    updateStep(2, 'completed');
    
    // Step 3: Process through Square
    updateStep(3, 'processing');
    try {
      await squareService.processTradingProfit(netProfit, 'Alpaca Trading Bot');
      updateStep(3, 'completed');
      
      // Step 4: Auto-withdrawal if enabled
      const config = squareService.getConfig();
      if (config?.autoWithdrawal && netProfit >= config.withdrawalThreshold) {
        updateStep(4, 'processing');
        await squareService.initiateAutoPayout(netProfit);
        await delay(2000);
        updateStep(4, 'completed');
        
        toast({
          title: "Profit Processed & Withdrawn!",
          description: `$${netProfit.toFixed(2)} sent to your bank account`,
        });
      } else {
        toast({
          title: "Profit Processed!",
          description: `$${netProfit.toFixed(2)} added to Square balance`,
        });
      }
      
      setTotalProcessed(prev => prev + netProfit);
    } catch (error) {
      console.error('Square processing error:', error);
      toast({
        title: "Processing Error",
        description: "Failed to process profit through Square",
        variant: "destructive"
      });
    }
    
    // Reset after delay
    setTimeout(() => {
      setFlowSteps(steps => steps.map(s => ({ ...s, status: 'pending' })));
      setIsProcessing(false);
    }, 5000);
  };

  const updateStep = (stepId: number, status: 'pending' | 'processing' | 'completed') => {
    setFlowSteps(steps => steps.map(step => 
      step.id === stepId ? { ...step, status } : step
    ));
  };

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const simulateProfit = () => {
    const randomProfit = Math.random() * 500 + 50;
    processProfit(randomProfit);
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <CardTitle className="flex items-center">
          <Zap className="mr-2" />
          Automated Payment Flow
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-700/50 rounded p-4">
              <p className="text-gray-400 text-sm">Last Profit</p>
              <p className="text-xl font-bold text-green-400">
                ${lastProfit.toFixed(2)}
              </p>
            </div>
            <div className="bg-gray-700/50 rounded p-4">
              <p className="text-gray-400 text-sm">Total Processed</p>
              <p className="text-xl font-bold text-blue-400">
                ${totalProcessed.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Flow Steps */}
          <div className="space-y-3">
            {flowSteps.map((step, index) => (
              <div key={step.id} className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step.status === 'completed' ? 'bg-green-500' :
                  step.status === 'processing' ? 'bg-blue-500 animate-pulse' :
                  'bg-gray-600'
                }`}>
                  {step.status === 'completed' ? (
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  ) : step.status === 'processing' ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span className="text-white text-sm">{step.id}</span>
                  )}
                </div>
                
                <div className="flex-1">
                  <p className={`font-medium ${
                    step.status === 'completed' ? 'text-green-400' :
                    step.status === 'processing' ? 'text-blue-400' :
                    'text-gray-400'
                  }`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
                
                {index < flowSteps.length - 1 && (
                  <ArrowRight className={`w-4 h-4 ${
                    step.status === 'completed' ? 'text-green-400' : 'text-gray-600'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          {isProcessing && (
            <div className="space-y-2">
              <p className="text-sm text-gray-400">Processing payment...</p>
              <Progress value={flowSteps.filter(s => s.status === 'completed').length * 25} className="h-2" />
            </div>
          )}

          {/* Test Button */}
          <div className="pt-4 border-t border-gray-700">
            <Button
              onClick={simulateProfit}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Simulate Trading Profit
            </Button>
            <p className="text-xs text-gray-400 text-center mt-2">
              In production, this happens automatically when trades close profitably
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SquarePaymentFlow;