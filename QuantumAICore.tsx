import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Cpu, Activity, Zap, Database, TrendingUp, BarChart3, Sparkles } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

export function QuantumAICore() {
  const [quantumState, setQuantumState] = useState({
    processing: false,
    optimization: 87,
    accuracy: 92.5,
    speed: 1250,
    activeStrategies: 12
  });

  const [aiConfig, setAiConfig] = useState({
    mode: 'aggressive',
    riskTolerance: 75,
    learningRate: 0.001,
    quantumEnabled: true,
    neuralDepth: 8
  });

  const strategies = [
    { name: 'Momentum Quantum Analysis', status: 'active', performance: 94 },
    { name: 'Neural Pattern Recognition', status: 'active', performance: 89 },
    { name: 'Fractal Market Prediction', status: 'active', performance: 91 },
    { name: 'Quantum Entanglement Trading', status: 'processing', performance: 96 },
    { name: 'AI Sentiment Analysis', status: 'active', performance: 88 },
    { name: 'Mathematical Chaos Theory', status: 'active', performance: 93 }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setQuantumState(prev => ({
        ...prev,
        processing: !prev.processing,
        optimization: Math.min(100, prev.optimization + Math.random() * 2),
        speed: 1000 + Math.random() * 500
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            Quantum AI Processing Core
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="performance">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="strategies">Strategies</TabsTrigger>
              <TabsTrigger value="configuration">Configuration</TabsTrigger>
            </TabsList>

            <TabsContent value="performance" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <Cpu className="h-4 w-4 text-blue-500" />
                      <Badge variant={quantumState.processing ? "default" : "secondary"}>
                        {quantumState.processing ? "Processing" : "Idle"}
                      </Badge>
                    </div>
                    <p className="text-2xl font-bold">{quantumState.speed.toFixed(0)}</p>
                    <p className="text-xs text-muted-foreground">Operations/sec</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <Activity className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">{quantumState.accuracy}%</span>
                    </div>
                    <Progress value={quantumState.accuracy} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">Prediction Accuracy</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium">{quantumState.optimization}%</span>
                    </div>
                    <Progress value={quantumState.optimization} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">Optimization Level</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <Database className="h-4 w-4 text-purple-500" />
                      <Badge>{quantumState.activeStrategies}</Badge>
                    </div>
                    <p className="text-2xl font-bold">Active</p>
                    <p className="text-xs text-muted-foreground">AI Strategies</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Quantum Processing</span>
                      <Progress value={87} className="w-32 h-2" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Neural Network Depth</span>
                      <Progress value={75} className="w-32 h-2" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Pattern Recognition</span>
                      <Progress value={92} className="w-32 h-2" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Market Prediction</span>
                      <Progress value={89} className="w-32 h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="strategies" className="space-y-4">
              <div className="grid gap-3">
                {strategies.map((strategy, i) => (
                  <Card key={i}>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Sparkles className="h-4 w-4 text-purple-500" />
                          <div>
                            <p className="font-medium">{strategy.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant={strategy.status === 'active' ? 'default' : 'secondary'}>
                                {strategy.status}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                Performance: {strategy.performance}%
                              </span>
                            </div>
                          </div>
                        </div>
                        <Progress value={strategy.performance} className="w-24 h-2" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="configuration" className="space-y-4">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-2">
                    <Label>Trading Mode</Label>
                    <Select value={aiConfig.mode} onValueChange={(v) => setAiConfig({...aiConfig, mode: v})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="conservative">Conservative</SelectItem>
                        <SelectItem value="balanced">Balanced</SelectItem>
                        <SelectItem value="aggressive">Aggressive</SelectItem>
                        <SelectItem value="quantum">Quantum Enhanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Risk Tolerance: {aiConfig.riskTolerance}%</Label>
                    <Slider 
                      value={[aiConfig.riskTolerance]} 
                      onValueChange={(v) => setAiConfig({...aiConfig, riskTolerance: v[0]})}
                      max={100}
                      step={5}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Neural Network Depth: {aiConfig.neuralDepth} Layers</Label>
                    <Slider 
                      value={[aiConfig.neuralDepth]} 
                      onValueChange={(v) => setAiConfig({...aiConfig, neuralDepth: v[0]})}
                      min={4}
                      max={16}
                      step={1}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Quantum Processing</Label>
                    <Switch 
                      checked={aiConfig.quantumEnabled}
                      onCheckedChange={(v) => setAiConfig({...aiConfig, quantumEnabled: v})}
                    />
                  </div>

                  <Button className="w-full">
                    Apply Configuration
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}