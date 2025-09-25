import React, { useState, useEffect } from 'react';
import { authService } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogOut, User, DollarSign, TrendingUp } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface SimpleAuthProps {
  onAuthStateChange: (user: any) => void;
}

const SimpleAuth: React.FC<SimpleAuthProps> = ({ onAuthStateChange }) => {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('demo123');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const session = authService.getSession();
    if (session) {
      setUser(session.user);
      onAuthStateChange(session.user);
    }
  }, [onAuthStateChange]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const result = await authService.signUp(email, password);
        setUser(result.user);
        onAuthStateChange(result.user);
        toast({
          title: "Account Created!",
          description: "Welcome! You've received $100 bonus to start trading!",
        });
      } else {
        const result = await authService.signIn(email, password);
        setUser(result.user);
        onAuthStateChange(result.user);
        toast({
          title: "Welcome Back!",
          description: `Current balance: $${result.user.balance.toFixed(2)}`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
    
    setLoading(false);
  };

  const handleSignOut = async () => {
    await authService.signOut();
    setUser(null);
    onAuthStateChange(null);
    toast({
      title: "Signed Out",
      description: "Come back soon to check your earnings!",
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gray-800/90 border-gray-700">
          <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center justify-center text-2xl">
              <DollarSign className="mr-2" />
              AI Wealth Generator
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="mb-6 text-center">
              <p className="text-green-400 font-bold text-lg mb-2">
                Start Making Money NOW! 💰
              </p>
              <p className="text-gray-300 text-sm">
                {isSignUp ? 'Get $100 bonus on signup!' : 'Use demo@example.com / demo123'}
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              
              <div>
                <Label htmlFor="password" className="text-gray-300">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              >
                {loading ? 'Processing...' : (isSignUp ? 'Create Account & Get $100' : 'Sign In & Start Earning')}
              </Button>
            </form>
            
            <div className="mt-4 text-center">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                {isSignUp ? 'Already have an account? Sign in' : "New? Sign up for $100 bonus!"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-gradient-to-r from-green-500 to-blue-600 p-2 rounded-full">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Logged in as</p>
            <p className="font-semibold text-white">{user.email}</p>
          </div>
          <div className="border-l border-gray-600 pl-4">
            <p className="text-sm text-gray-400">Balance</p>
            <p className="font-bold text-green-400 text-xl">${user.balance.toFixed(2)}</p>
          </div>
          <div className="border-l border-gray-600 pl-4">
            <p className="text-sm text-gray-400">Total Earned</p>
            <p className="font-bold text-blue-400 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              ${user.totalEarnings.toFixed(2)}
            </p>
          </div>
        </div>
        <Button
          onClick={handleSignOut}
          variant="outline"
          className="border-gray-600 hover:bg-gray-700"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default SimpleAuth;