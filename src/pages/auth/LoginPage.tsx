import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeSlash } from '@phosphor-icons/react';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Checkbox from '@/components/ui/Checkbox';
import Card, { CardBody } from '@/components/ui/Card';
import loginBg from '@/assets/login-bg.svg';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
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
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 px-4 py-8 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0" 
        style={{
          backgroundImage: `url(${loginBg})`,
          backgroundRepeat: 'repeat',
          backgroundSize: '400px',
          opacity: 0.8
        }}
      />

      <div className="w-full max-w-[500px] z-10">
        <Card className="shadow-xl border-none">
          <CardBody className="p-8 md:p-10">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-neutral-900 mb-6">Your Logo</h1>
              <h2 className="text-xl font-semibold text-neutral-900 mb-2">Selamat Datang Kembali</h2>
              <p className="text-neutral-500 text-sm">Masuk menggunakan ID yang terdaftar pada sistem.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 bg-danger-50 border border-danger-200 rounded-lg text-danger-700 text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <Input
                  type="text"
                  label="ID Pengguna"
                  placeholder="Contoh: NIP / Nomor Induk Guru / NISN"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11"
                  required
                />

                <Input
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  placeholder="Masukan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11"
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-neutral-400 hover:text-neutral-600 focus:outline-none"
                    >
                      {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                    </button>
                  }
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <Checkbox 
                  label="Remember me" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <button 
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline"
                >
                  Lupa kata sandi?
                </button>
              </div>

              <Button
                type="submit"
                className="w-full h-11 text-base font-semibold bg-[#1d4ed8] hover:bg-[#1e40af]"
                isLoading={isLoading}
                disabled={!email || !password}
              >
                Masuk
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-neutral-100">
              <p className="text-xs text-neutral-500 font-medium mb-3 text-center uppercase tracking-wider">Demo Accounts</p>
              <div className="grid grid-cols-1 gap-2 text-xs text-neutral-500 bg-neutral-50 p-4 rounded-lg">
                <div className="flex justify-between">
                  <span className="font-medium">Admin:</span>
                  <span className="font-mono">admin@demo.com / admin123</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Teacher:</span>
                  <span className="font-mono">teacher@demo.com / teacher123</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Student:</span>
                  <span className="font-mono">student@demo.com / student123</span>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
