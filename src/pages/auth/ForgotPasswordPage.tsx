import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card, { CardBody } from '@/components/ui/Card';
import loginBg from '@/assets/login-bg.svg';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigate('/verify-otp', { state: { email } });
    }, 1500);
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
              <h2 className="text-xl font-semibold text-neutral-900 mb-2">Lupa Password</h2>
              <p className="text-neutral-500 text-sm">Silakan masukkan alamat email Anda untuk mereset kata sandi.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                type="email"
                label="Email"
                placeholder="Masukan email anda"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11"
                required
              />

              <div className="space-y-3">
                <Button
                  type="submit"
                  className="w-full h-11 text-base font-semibold bg-[#1d4ed8] hover:bg-[#1e40af]"
                  isLoading={isLoading}
                  disabled={!email}
                >
                  Kirim Link Reset
                </Button>
                
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full h-11 text-base font-medium bg-neutral-500 hover:bg-neutral-600 text-white border-none focus:ring-neutral-500"
                  onClick={() => navigate('/login')}
                >
                  Kembali ke Login
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
