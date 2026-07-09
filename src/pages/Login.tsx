import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock authentication
    setTimeout(() => {
      if (username === 'admin' && password === 'admin') {
        localStorage.setItem('isLoggedIn', 'true');
        toast.success('Login successful');
        navigate('/');
      } else {
        toast.error('Invalid username or password');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-muted/40 flex items-center justify-center p-4 lg:p-0">
      <div className="max-w-5xl w-full grid lg:grid-cols-2 bg-card rounded-2xl shadow-xl overflow-hidden border border-primary/10">
        {/* Left Side - Image/Branding */}
        <div className="hidden lg:block relative">
          <img 
            src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/eb9d149d-7e1e-4bee-8553-f19a20c6e1f1/joh-microcredit-dashboard-overview-78351ddf-1783604292581.webp" 
            alt="Microcredit Dashboard" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/20 backdrop-blur-[1px] flex flex-col justify-end p-12 text-white">
            <h2 className="text-4xl font-bold mb-4">Empowering Growth</h2>
            <p className="text-lg opacity-90">Advanced financial tracking for Tanzanian micro-businesses.</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex items-center justify-center p-8 lg:p-12">
          <div className="w-full max-w-sm space-y-8">
            <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="bg-primary text-primary-foreground p-3 rounded-2xl shadow-inner">
              <Wallet size={32} />
            </div>
          </div>
              <h1 className="text-3xl font-bold tracking-tight">Joh Microcredit Ltd</h1>
              <p className="text-muted-foreground text-sm">Enter your credentials to access the system</p>
            </div>

        <form onSubmit={handleLogin}>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-muted-foreground" size={18} />
                <Input
                  id="username"
                  type="text"
                  placeholder="Username"
                  className="pl-10"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-muted-foreground" size={18} />
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="text-xs text-muted-foreground text-center">
              Hint: Use <span className="font-semibold">admin/admin</span> to login
            </div>
            <Button className="w-full font-semibold h-11" type="submit" disabled={isLoading}>
              {isLoading ? 'Authenticating...' : 'Sign In'}
            </Button>
          </div>
        </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
