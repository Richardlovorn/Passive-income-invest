import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, TrendingUp, BarChart3, Sparkles, Cpu, Target } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function MLPredictionEngine() {
  const [model, setModel] = useState('lstm');
  const [training, setTraining] = useState(false);
  
  const predictionData = [
    { time: '09:00', actual: 100, predicted: 102 },
    { time: '10:00', actual: 105, predicted: 104 },
    { time: '11:00', actual: 103, predicted: 106 },
    { time: '12:00', actual: 108, predicted: 107 },
    { time: '13:00', actual: 112, predicted: 111 },
    { time: '14:00', actual: 110, predicted: 113 },
    { time: '15:00', actual: 115, predicted: 114 }
  ];

  const models = [
    { name: 'LSTM Neural Network', accuracy: 94.2, status: 'active' },
    { name: 'Random Forest', accuracy: 91.8, status: 'active' },
    { name: 'XGBoost Ensemble', accuracy: 93.5, status: 'training' },
    { name: 'Transformer Model', accuracy: 95.1, status: 'active' },
    { name: 'GAN Predictor', accuracy: 92.7, status: 'idle' }
  ];

  const handleTrain = () => {
    setTraining(true);
    setTimeout(() => setTraining(false), 3000);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Brain className="h-4 w-4 text-purple-500" />
              <Badge>Active</Badge>
            </div>
            <p className="text-2xl font-bold">5</p>
            <p className="text-xs text-muted-foreground">ML Models</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Target className="h-4 w-4 text-green-500" />
              <span className="text-sm font-bold">94.2%</span>
            </div>
            <Progress value={94.2} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">Avg Accuracy</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Cpu className="h-4 w-4 text-blue-500" />
              <Badge variant="outline">2.3ms</Badge>
            </div>
            <p className="text-sm font-medium">Inference Time</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Prediction Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={predictionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="actual" stroke="#8884d8" name="Actual" />
              <Line type="monotone" dataKey="predicted" stroke="#82ca9d" name="Predicted" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Model Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Primary Model</label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lstm">LSTM Neural Network</SelectItem>
                <SelectItem value="transformer">Transformer Model</SelectItem>
                <SelectItem value="xgboost">XGBoost Ensemble</SelectItem>
                <SelectItem value="gan">GAN Predictor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            {models.map((m, i) => (
              <div key={i} className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium">{m.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={m.status === 'active' ? 'default' : 'secondary'}>
                    {m.status}
                  </Badge>
                  <span className="text-xs">{m.accuracy}%</span>
                </div>
              </div>
            ))}
          </div>

          <Button onClick={handleTrain} disabled={training} className="w-full">
            {training ? 'Training Models...' : 'Retrain All Models'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}