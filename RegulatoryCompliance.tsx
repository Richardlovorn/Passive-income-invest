import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, CheckCircle, AlertTriangle, FileText, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function RegulatoryCompliance() {
  const complianceItems = [
    { name: 'SEC Registration', status: 'compliant', icon: CheckCircle },
    { name: 'FINRA Compliance', status: 'compliant', icon: CheckCircle },
    { name: 'KYC/AML Verification', status: 'compliant', icon: CheckCircle },
    { name: 'Data Protection (GDPR)', status: 'compliant', icon: CheckCircle },
    { name: 'Risk Disclosure', status: 'compliant', icon: CheckCircle },
    { name: 'Audit Trail', status: 'active', icon: Shield }
  ];

  const regulations = [
    { region: 'United States', status: 'Compliant', lastAudit: '2025-09-01' },
    { region: 'European Union', status: 'Compliant', lastAudit: '2025-08-15' },
    { region: 'United Kingdom', status: 'Pending', lastAudit: '2025-07-30' }
  ];

  return (
    <div className="space-y-4">
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Compliance Status:</strong> All systems operating within regulatory requirements. 
          Last audit completed on September 1, 2025.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Regulatory Requirements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {complianceItems.map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <item.icon className="h-5 w-5 text-green-500" />
                <span className="font-medium">{item.name}</span>
              </div>
              <Badge variant={item.status === 'compliant' ? 'default' : 'secondary'}>
                {item.status}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Regional Compliance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {regulations.map((reg, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">{reg.region}</p>
                  <p className="text-xs text-muted-foreground">Last Audit: {reg.lastAudit}</p>
                </div>
                <Badge variant={reg.status === 'Compliant' ? 'default' : 'outline'}>
                  {reg.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Legal Documentation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>10% Profit Sharing Agreement:</strong> All users must accept the profit-sharing 
              terms before accessing live trading. Platform automatically deducts 10% from profitable trades.
            </AlertDescription>
          </Alert>
          
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start">
              <FileText className="mr-2 h-4 w-4" />
              Terms of Service
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <FileText className="mr-2 h-4 w-4" />
              Privacy Policy
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <FileText className="mr-2 h-4 w-4" />
              Risk Disclosure Statement
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}