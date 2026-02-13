import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import Swal from 'sweetalert2';
import { studentApi } from '@/lib/api/services';

const STEPS = [
  { id: 'identitas', label: 'Identitas Siswa' },
  { id: 'pribadi', label: 'Data Pribadi' },
  { id: 'alamat', label: 'Alamat & Kontak' },
  { id: 'akademik', label: 'Data Akademik' },
  { id: 'orangtua', label: 'Data Orang Tua' },
];

const EditStudentPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  
  // Mock initial data
  const [formData, setFormData] = useState({
    firstName: 'Gregorius',
    lastName: 'Aldi Bagaskoro',
    placeOfBirth: 'Jakarta',
    dateOfBirth: '2008-05-15',
    gender: 'male',
    religion: 'katolik',
    photo: null as File | null,
    address: 'Perumahan Griya Sejahtera Blok C-12, Jl. Anggrek Raya, Kel. Harapan Jaya, Kec. Mekar Sari, Kota Mandiri, Provinsi DKI Jakarta',
    postalCode: '12999',
    email: 'ahmad.fauzan@studentmail.com',
    phone: '08123456789012'
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
      navigate(`/admin/students/${id}`);
    }
  };

  const handleSave = async () => {
    if (!id) return;
    
    try {
      const payload = {
        name: `${formData.firstName} ${formData.lastName}`,
        firstName: formData.firstName,
        lastName: formData.lastName,
        placeOfBirth: formData.placeOfBirth,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender as 'male' | 'female',
        religion: formData.religion,
      };

      await studentApi.update(id, payload);

      await Swal.fire({
        title: 'Sukses!',
        text: 'Data siswa berhasil diperbarui.',
        icon: 'success',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors'
        }
      });
      
      navigate(`/admin/students/${id}`);
      
    } catch (error) {
      console.error('Error updating student:', error);
      Swal.fire({
        title: 'Gagal!',
        text: 'Terjadi kesalahan saat menyimpan data.',
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors'
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Edit Siswa</h1>
          <p className="text-neutral-500 mt-1">Perbarui data siswa</p>
        </div>
        <button 
          onClick={() => navigate(`/admin/students/${id}`)}
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
                <div className="border-2 border-dashed border-neutral-300 rounded-xl p-8 flex flex-col items-center justify-center text-center h-[300px] bg-neutral-50 cursor-pointer hover:bg-neutral-100 transition-colors group relative overflow-hidden">
                  {/* Mock existing photo */}
                  <div className="absolute inset-0 bg-neutral-200 flex items-center justify-center">
                    <span className="text-neutral-400">Foto Siswa</span>
                  </div>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                    <ImageIcon size={48} weight="light" className="mb-2" />
                    <span className="text-sm">Ganti Foto</span>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="lg:col-span-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Nama Depan *"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  />
                  <Input
                    label="Nama Belakang *"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Tempat Lahir *"
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

          {currentStep === 2 && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-6">Alamat & Kontak</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Alamat Lengkap <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent min-h-[120px] resize-y text-sm transition-shadow"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Kode Pos *"
                      value={formData.postalCode}
                      onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                      placeholder="Contoh: 12345"
                    />
                    <Input
                      label="Email *"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="Contoh: siswa@sekolah.sch.id"
                    />
                  </div>

                  <Input
                    label="Nomor Telepon *"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="Contoh: 081234567890"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Placeholders for other steps */}
          {(currentStep === 1 || currentStep > 2) && (
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
            onClick={handleSave}
            className="w-32 bg-[#2563EB] hover:bg-blue-700"
          >
            Simpan
            <ArrowRight size={18} className="ml-2" />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default EditStudentPage;
