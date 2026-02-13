import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  X, 
  Image as ImageIcon,
  Calendar
} from '@phosphor-icons/react';
import Card, { CardBody } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { cn } from '@/lib/utils';

const STEPS = [
  { id: 'identitas', label: 'Identitas Siswa' },
  { id: 'pribadi', label: 'Data Pribadi' },
  { id: 'alamat', label: 'Alamat & Kontak' },
  { id: 'akademik', label: 'Data Akademik' },
  { id: 'orangtua', label: 'Data Orang Tua' },
];

const AddStudentPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    placeOfBirth: '',
    dateOfBirth: '',
    gender: 'male',
    religion: '',
    photo: null as File | null
  });

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else {
      navigate('/admin/students');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Tambah Siswa</h1>
          <p className="text-neutral-500 mt-1">Lengkapi data siswa secara bertahap</p>
        </div>
        <button 
          onClick={() => navigate('/admin/students')}
          className="p-2 text-neutral-400 hover:text-neutral-600 rounded-full hover:bg-neutral-100 transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      <Card variant="elevated" className="border-none shadow-sm min-h-[600px] flex flex-col">
        {/* Stepper Tabs */}
        <div className="border-b border-neutral-200">
          <div className="flex overflow-x-auto hide-scrollbar">
            {STEPS.map((step, index) => {
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              
              return (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(index)}
                  className={cn(
                    "flex-1 min-w-[150px] px-6 py-4 text-sm font-medium text-center border-b-2 transition-colors focus:outline-none",
                    isActive 
                      ? "border-[#2563EB] text-[#2563EB]" 
                      : "border-transparent text-neutral-500 hover:text-neutral-700"
                  )}
                >
                  {step.label}
                </button>
              );
            })}
          </div>
        </div>

        <CardBody className="flex-1 p-8">
          {currentStep === 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Photo Upload */}
              <div className="lg:col-span-4">
                <div className="border-2 border-dashed border-neutral-300 rounded-xl p-8 flex flex-col items-center justify-center text-center h-[300px] bg-neutral-50 cursor-pointer hover:bg-neutral-100 transition-colors group">
                  <div className="w-16 h-16 mb-4 text-neutral-400 group-hover:text-neutral-500 transition-colors">
                    <ImageIcon size={64} weight="light" />
                  </div>
                  <h3 className="text-neutral-900 font-medium mb-1">Upload foto siswa</h3>
                  <p className="text-xs text-neutral-500">Drag and drop atau klik untuk memilih file</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="lg:col-span-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Nama Depan *"
                    placeholder="Nama depan siswa"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  />
                  <Input
                    label="Nama Belakang *"
                    placeholder="Nama belakang siswa"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Tempat Lahir *"
                    placeholder="Kota tempat lahir"
                    value={formData.placeOfBirth}
                    onChange={(e) => setFormData({...formData, placeOfBirth: e.target.value})}
                  />
                  <Input
                    label="Tanggal Lahir *"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                    rightIcon={<Calendar size={20} className="text-neutral-500" />}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Jenis Kelamin *
                    </label>
                    <div className="flex items-center gap-6 mt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <div className={cn(
                          "w-5 h-5 rounded-full border flex items-center justify-center",
                          formData.gender === 'male' ? "border-[#2563EB]" : "border-neutral-300"
                        )}>
                          {formData.gender === 'male' && (
                            <div className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
                          )}
                        </div>
                        <input 
                          type="radio" 
                          name="gender" 
                          className="hidden" 
                          checked={formData.gender === 'male'} 
                          onChange={() => setFormData({...formData, gender: 'male'})} 
                        />
                        <span className="text-sm text-neutral-700">Laki - laki</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <div className={cn(
                          "w-5 h-5 rounded-full border flex items-center justify-center",
                          formData.gender === 'female' ? "border-[#2563EB]" : "border-neutral-300"
                        )}>
                          {formData.gender === 'female' && (
                            <div className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
                          )}
                        </div>
                        <input 
                          type="radio" 
                          name="gender" 
                          className="hidden" 
                          checked={formData.gender === 'female'} 
                          onChange={() => setFormData({...formData, gender: 'female'})} 
                        />
                        <span className="text-sm text-neutral-700">Perempuan</span>
                      </label>
                    </div>
                  </div>

                  <Select
                    label="Agama *"
                    options={[
                      { value: '', label: 'Pilih agama...' },
                      { value: 'islam', label: 'Islam' },
                      { value: 'kristen', label: 'Kristen' },
                      { value: 'katolik', label: 'Katolik' },
                      { value: 'hindu', label: 'Hindu' },
                      { value: 'buddha', label: 'Buddha' },
                      { value: 'konghucu', label: 'Konghucu' },
                    ]}
                    value={formData.religion}
                    onChange={(e) => setFormData({...formData, religion: e.target.value})}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Placeholders for other steps */}
          {currentStep > 0 && (
            <div className="flex items-center justify-center h-64 text-neutral-500">
              Form untuk {STEPS[currentStep].label} akan ditampilkan di sini
            </div>
          )}
        </CardBody>

        {/* Footer Actions */}
        <div className="p-6 border-t border-neutral-200 flex justify-between">
          <Button 
            variant="outline" 
            onClick={handlePrev}
            className="w-32 border-[#2563EB] text-[#2563EB] hover:bg-blue-50"
          >
            <ArrowLeft size={18} className="mr-2" />
            Sebelumnya
          </Button>
          <Button 
            onClick={handleNext}
            className="w-32 bg-[#2563EB] hover:bg-blue-700"
          >
            Berikutnya
            <ArrowRight size={18} className="ml-2" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AddStudentPage;
