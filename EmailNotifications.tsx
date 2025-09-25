import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Mail, Bell, Send, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface NotificationSettings {
  dailyReports: boolean;
  weeklyReports: boolean;
  monthlyReports: boolean;
  tradeAlerts: boolean;
  incomeAlerts: boolean;
  lowBalanceAlerts: boolean;
  emailAddress: string;
  phoneNumber: string;
}

const EmailNotifications: React.FC = () => {
  const [settings, setSettings] = useState<NotificationSettings>({
    dailyReports: true,
    weeklyReports: true,
    monthlyReports: true,
    tradeAlerts: true,
    incomeAlerts: true,
    lowBalanceAlerts: true,
    emailAddress: '',
    phoneNumber: ''
  });

  const [testEmail, setTestEmail] = useState('');
  const [sending, setSending] = useState(false);

  // Simulated notification queue
  const [notificationQueue, setNotificationQueue] = useState([
    { id: 1, type: 'income', message: 'Real Estate payment received: $35,000', time: '2 hours ago', status: 'sent' },
    { id: 2, type: 'trade', message: 'AAPL position opened at $175.50', time: '4 hours ago', status: 'sent' },
    { id: 3, type: 'alert', message: 'Monthly report ready for review', time: '1 day ago', status: 'sent' },
    { id: 4, type: 'income', message: 'Crypto staking rewards: $2,150', time: '2 days ago', status: 'sent' }
  ]);

  const handleSettingChange = (key: keyof NotificationSettings, value: boolean | string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    toast.success('Settings updated');
  };

  const sendTestNotification = async () => {
    if (!testEmail) {
      toast.error('Please enter an email address');
      return;
    }

    setSending(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success(`Test notification sent to ${testEmail}`);
    setNotificationQueue(prev => [{
      id: Date.now(),
      type: 'test',
      message: `Test notification sent to ${testEmail}`,
      time: 'Just now',
      status: 'sent'
    }, ...prev]);
    
    setSending(false);
    setTestEmail('');
  };

  const getNotificationIcon = (type: string) => {
    switch(type) {
      case 'income': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'trade': return <AlertCircle className="w-4 h-4 text-blue-600" />;
      case 'alert': return <Bell className="w-4 h-4 text-orange-600" />;
      default: return <Mail className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="mr-2" />
            Email & SMS Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={settings.emailAddress}
                  onChange={(e) => handleSettingChange('emailAddress', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number (SMS)</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={settings.phoneNumber}
                  onChange={(e) => handleSettingChange('phoneNumber', e.target.value)}
                />
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Report Preferences</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <Label htmlFor="daily" className="cursor-pointer">Daily Reports</Label>
                  <Switch
                    id="daily"
                    checked={settings.dailyReports}
                    onCheckedChange={(checked) => handleSettingChange('dailyReports', checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <Label htmlFor="weekly" className="cursor-pointer">Weekly Reports</Label>
                  <Switch
                    id="weekly"
                    checked={settings.weeklyReports}
                    onCheckedChange={(checked) => handleSettingChange('weeklyReports', checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <Label htmlFor="monthly" className="cursor-pointer">Monthly Reports</Label>
                  <Switch
                    id="monthly"
                    checked={settings.monthlyReports}
                    onCheckedChange={(checked) => handleSettingChange('monthlyReports', checked)}
                  />
                </div>
              </div>

              <h3 className="font-semibold text-lg mt-6">Alert Preferences</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <Label htmlFor="trade" className="cursor-pointer">Trade Alerts</Label>
                  <Switch
                    id="trade"
                    checked={settings.tradeAlerts}
                    onCheckedChange={(checked) => handleSettingChange('tradeAlerts', checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <Label htmlFor="income" className="cursor-pointer">Income Alerts</Label>
                  <Switch
                    id="income"
                    checked={settings.incomeAlerts}
                    onCheckedChange={(checked) => handleSettingChange('incomeAlerts', checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <Label htmlFor="balance" className="cursor-pointer">Low Balance Alerts</Label>
                  <Switch
                    id="balance"
                    checked={settings.lowBalanceAlerts}
                    onCheckedChange={(checked) => handleSettingChange('lowBalanceAlerts', checked)}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Notification */}
      <Card>
        <CardHeader>
          <CardTitle>Send Test Notification</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-3">
            <Input
              placeholder="Enter email for test notification"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={sendTestNotification} 
              disabled={sending}
              className="min-w-[120px]"
            >
              {sending ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Test
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications Sent</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {notificationQueue.map((notification) => (
              <div key={notification.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-3">
                  {getNotificationIcon(notification.type)}
                  <div>
                    <p className="font-medium">{notification.message}</p>
                    <p className="text-sm text-gray-500">{notification.time}</p>
                  </div>
                </div>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  {notification.status}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailNotifications;