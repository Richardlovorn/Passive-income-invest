import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Database, Server, HardDrive, Activity, RefreshCw, Shield } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function DatabaseManager() {
  const [dbStats, setDbStats] = useState({
    connections: 42,
    queries: 1284,
    storage: 67,
    uptime: 99.9,
    cacheHit: 94
  });

  const [optimizing, setOptimizing] = useState(false);

  const handleOptimize = () => {
    setOptimizing(true);
    setTimeout(() => {
      setDbStats(prev => ({
        ...prev,
        cacheHit: Math.min(99, prev.cacheHit + 3),
        queries: prev.queries + 100
      }));
      setOptimizing(false);
    }, 2000);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Server className="h-4 w-4 text-blue-500" />
              <Badge variant="outline">{dbStats.connections}</Badge>
            </div>
            <p className="text-sm font-medium">Active Connections</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Activity className="h-4 w-4 text-green-500" />
              <span className="text-sm font-bold">{dbStats.queries}/s</span>
            </div>
            <p className="text-sm font-medium">Query Rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <HardDrive className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-bold">{dbStats.storage}%</span>
            </div>
            <Progress value={dbStats.storage} className="h-1 mt-2" />
            <p className="text-sm font-medium mt-1">Storage Used</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <Shield className="h-4 w-4 text-green-500" />
              <Badge className="bg-green-100 text-green-800">{dbStats.uptime}%</Badge>
            </div>
            <p className="text-sm font-medium">Uptime</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Cache Hit Rate</span>
              <div className="flex items-center gap-2">
                <Progress value={dbStats.cacheHit} className="w-32" />
                <span className="text-sm font-medium">{dbStats.cacheHit}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Index Efficiency</span>
              <div className="flex items-center gap-2">
                <Progress value={89} className="w-32" />
                <span className="text-sm font-medium">89%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Replication Lag</span>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-green-50">12ms</Badge>
              </div>
            </div>
          </div>

          <Alert>
            <AlertDescription>
              Database is performing optimally. All indices are up to date and replication is in sync.
            </AlertDescription>
          </Alert>

          <Button 
            onClick={handleOptimize}
            disabled={optimizing}
            className="w-full"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${optimizing ? 'animate-spin' : ''}`} />
            {optimizing ? 'Optimizing...' : 'Optimize Database'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}