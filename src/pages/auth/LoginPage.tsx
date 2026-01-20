import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Envelope, Lock } from '@phosphor-icons/react';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card, { CardBody, CardHeader } from '@/components/ui/Card';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      const from = (location.state as any)?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 px-4">
      <div className="w-full max-w-md">
        <Card variant="elevated">
          <CardHeader>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-primary-600 mb-2">LMS Dashboard</h1>
              <p className="text-neutral-600">Sign in to your account</p>
            </div>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-danger-50 border border-danger-200 rounded-lg text-danger-700 text-sm">
                  {error}
                </div>
              )}

              <Input
                type="email"
                label="Email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Envelope size={20} />}
                required
                autoComplete="email"
              />

              <Input
                type="password"
                label="Password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock size={20} />}
                required
                autoComplete="current-password"
              />

              <Button
                type="submit"
                className="w-full"
                isLoading={isLoading}
                disabled={!email || !password}
              >
                Sign In
              </Button>
            </form>

            <div className="mt-6 p-4 bg-neutral-50 rounded-lg">
              <p className="text-xs text-neutral-600 font-medium mb-2">Demo Credentials:</p>
              <div className="space-y-1 text-xs text-neutral-500">
                <p><strong>Admin:</strong> admin@demo.com / admin123</p>
                <p><strong>Teacher:</strong> teacher@demo.com / teacher123</p>
                <p><strong>Student:</strong> student@demo.com / student123</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
