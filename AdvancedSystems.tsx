import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QuantumAICore } from './QuantumAICore';
import { DatabaseManager } from './DatabaseManager';
import { MLPredictionEngine } from './MLPredictionEngine';
import { RegulatoryCompliance } from './RegulatoryCompliance';
import { Brain, Database, Shield, TrendingUp } from 'lucide-react';

export function AdvancedSystems() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced Trading Systems</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="quantum">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="quantum" className="flex items-center gap-1">
              <Brain className="h-3 w-3" />
              <span className="hidden sm:inline">Quantum AI</span>
            </TabsTrigger>
            <TabsTrigger value="database" className="flex items-center gap-1">
              <Database className="h-3 w-3" />
              <span className="hidden sm:inline">Database</span>
            </TabsTrigger>
            <TabsTrigger value="ml" className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              <span className="hidden sm:inline">ML Engine</span>
            </TabsTrigger>
            <TabsTrigger value="compliance" className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              <span className="hidden sm:inline">Compliance</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="quantum">
            <QuantumAICore />
          </TabsContent>

          <TabsContent value="database">
            <DatabaseManager />
          </TabsContent>

          <TabsContent value="ml">
            <MLPredictionEngine />
          </TabsContent>

          <TabsContent value="compliance">
            <RegulatoryCompliance />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}