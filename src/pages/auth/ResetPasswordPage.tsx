import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeSlash } from '@phosphor-icons/react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card, { CardBody } from '@/components/ui/Card';
import loginBg from '@/assets/login-bg.svg';

const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) return;
    
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigate('/login');
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
              <h2 className="text-xl font-semibold text-neutral-900 mb-2">Buat Kata Sandi Baru</h2>
              <p className="text-neutral-500 text-sm">Kata sandi baru Anda harus berbeda dari kata sandi lama Anda.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
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

                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  label="Konfirmasi Password"
                  placeholder="Masukan konfirmasi password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-11"
                  error={confirmPassword && password !== confirmPassword ? "Password tidak cocok" : undefined}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-neutral-400 hover:text-neutral-600 focus:outline-none"
                    >
                      {showConfirmPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                    </button>
                  }
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full h-11 text-base font-semibold bg-[#1d4ed8] hover:bg-[#1e40af]"
                isLoading={isLoading}
                disabled={!password || !confirmPassword || password !== confirmPassword}
              >
                Perbarui Password
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
