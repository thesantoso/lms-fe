import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '@/components/ui/Button';
import Card, { CardBody } from '@/components/ui/Card';
import loginBg from '@/assets/login-bg.svg';
import { cn } from '@/lib/utils';

const OTPVerificationPage: React.FC = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || 'email Anda';

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6).split('');
    if (pastedData.every(char => /^\d$/.test(char))) {
      const newOtp = [...otp];
      pastedData.forEach((char, index) => {
        if (index < 6) newOtp[index] = char;
      });
      setOtp(newOtp);
      // Focus last filled input or last input
      const focusIndex = Math.min(pastedData.length, 5);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.some(digit => digit === '')) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigate('/reset-password');
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
              <h2 className="text-xl font-semibold text-neutral-900 mb-2">Masukkan Kode Verifikasi</h2>
              <p className="text-neutral-500 text-sm">
                Kami telah mengirimkan kode 6 digit ke {email}. Kode yang diberikan akan kadaluwarsa dalam 3 jam.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="flex justify-center gap-2 sm:gap-4">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className={cn(
                      "w-10 h-10 sm:w-12 sm:h-12 text-center text-lg font-semibold border rounded-lg focus:outline-none transition-all",
                      digit 
                        ? "border-primary-600 text-primary-600 bg-primary-50" 
                        : "border-neutral-300 text-neutral-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                    )}
                  />
                ))}
              </div>

              <div className="space-y-3">
                <Button
                  type="submit"
                  className="w-full h-11 text-base font-semibold bg-[#1d4ed8] hover:bg-[#1e40af]"
                  isLoading={isLoading}
                  disabled={otp.some(digit => digit === '')}
                >
                  Verifikasi Code
                </Button>
                
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full h-11 text-base font-medium bg-neutral-500 hover:bg-neutral-600 text-white border-none focus:ring-neutral-500"
                  onClick={() => navigate('/forgot-password')}
                >
                  Kembali
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default OTPVerificationPage;
