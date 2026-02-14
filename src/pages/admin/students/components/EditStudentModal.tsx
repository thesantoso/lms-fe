import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Image as ImageIcon,
  Calendar,
  CaretDown,
  CaretUp,
  FloppyDisk
} from '@phosphor-icons/react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { cn } from '@/lib/utils';
import Swal from 'sweetalert2';
import { studentApi } from '@/lib/api/services';

interface EditStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
}

const STEPS = [
  { id: 'identitas', label: 'Identitas Siswa' },
  { id: 'pribadi', label: 'Data Pribadi' },
  { id: 'alamat', label: 'Alamat & Kontak' },
  { id: 'akademik', label: 'Data Akademik' },
  { id: 'orangtua', label: 'Data Orang Tua' },
];

const EditStudentModal: React.FC<EditStudentModalProps> = ({ isOpen, onClose, studentId }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPreviousSchoolOpen, setIsPreviousSchoolOpen] = useState(false);
  const [isDiplomaOpen, setIsDiplomaOpen] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Mock initial data
  const [formData, setFormData] = useState({
    // Identity & Personal
    firstName: 'Gregorius',
    lastName: 'Aldi Bagaskoro',
    placeOfBirth: 'Jakarta',
    dateOfBirth: '2008-05-15',
    gender: 'male',
    religion: 'katolik',
    photo: null as File | null,
    
    // Address
    address: 'Perumahan Griya Sejahtera Blok C-12, Jl. Anggrek Raya, Kel. Harapan Jaya, Kec. Mekar Sari, Kota Mandiri, Provinsi DKI Jakarta',
    postalCode: '12999',
    email: 'ahmad.fauzan@studentmail.com',
    phone: '08123456789012',
    rt: '05',
    rw: '02',
    province: 'dki_jakarta',
    regency: 'jakarta_selatan',
    district: 'tebet',
    village: 'tebet_barat',

    // Academic
    class: '10',
    major: 'ipa',
    dateAccepted: '2023-07-15',
    semester: 'ganjil',
    admissionPath: 'zonasi',
    cohortYear: '2023',
    
    // Previous School (Optional)
    previousSchoolName: 'SMP Negeri 1 Jakarta',
    previousSchoolAddress: 'Jl. Cikini Raya No. 87',
    
    // Diploma (Optional)
    diplomaYear: '2023',
    diplomaNumber: 'DN-01/D-0001234',

    // Parent / Guardian
    parentType: 'orang_tua',
    parentNik: '3171234567890001',
    parentName: 'Budi Santoso',
    parentPhone: '081234567890',
    parentJob: 'wiraswasta',
    parentEmail: 'budi.santoso@email.com',
    parentAddress: 'Perumahan Griya Sejahtera Blok C-12',
    parentRtRw: '05/02',
    parentProvince: 'dki_jakarta',
    parentRegency: 'jakarta_selatan',
    parentDistrict: 'tebet',
    parentVillage: 'tebet_barat',
    parentPostalCode: '12999',
    guardianRelationship: '',
  });

  // Reset step when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, photo: file });
      const objectUrl = URL.createObjectURL(file);
      setPhotoPreview(objectUrl);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSave();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSave = async () => {
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

      await studentApi.update(studentId, payload);

      await Swal.fire({
        title: 'Sukses!',
        text: 'Data siswa berhasil diperbarui.',
        icon: 'success',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors'
        }
      });
      
      onClose();
      
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Identitas Siswa
        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Photo Upload */}
            <div className="lg:col-span-4">
              <div 
                onClick={handleUploadClick}
                className="border-2 border-dashed border-neutral-300 rounded-xl flex flex-col items-center justify-center text-center h-[300px] bg-neutral-50 cursor-pointer hover:bg-neutral-100 transition-colors group relative overflow-hidden"
              >
                {/* Mock existing photo */}
                {photoPreview ? (
                  <img 
                    src={photoPreview} 
                    alt="Preview" 
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="absolute inset-0 bg-neutral-200 flex items-center justify-center">
                    <span className="text-neutral-400">Foto Siswa</span>
                  </div>
                )}
                
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
        );
      case 1: // Data Pribadi
        return (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left: Photo Upload */}
            <div className="md:col-span-4">
              <div 
                onClick={handleUploadClick}
                className="border-2 border-dashed border-neutral-300 rounded-xl flex flex-col items-center justify-center text-center h-64 hover:bg-neutral-50 transition-colors cursor-pointer group relative overflow-hidden"
              >
                {photoPreview ? (
                  <img 
                    src={photoPreview} 
                    alt="Preview" 
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="p-8 flex flex-col items-center justify-center w-full h-full">
                    <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mb-4 group-hover:bg-white group-hover:shadow-sm transition-all">
                      <ImageIcon size={32} />
                    </div>
                    <p className="font-medium text-neutral-900 mb-1">Upload foto siswa</p>
                    <p className="text-xs text-neutral-500">Drag and drop atau klik untuk memilih file</p>
                  </div>
                )}
                
                {photoPreview && (
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                    <ImageIcon size={48} weight="light" className="mb-2" />
                    <span className="text-sm">Ganti Foto</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Form Fields */}
            <div className="md:col-span-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    Nama Depan <span className="text-red-500">*</span>
                  </label>
                  <Input 
                    placeholder="Nama depan siswa" 
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    Nama Belakang <span className="text-red-500">*</span>
                  </label>
                  <Input 
                    placeholder="Nama belakang siswa" 
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    Tempat Lahir <span className="text-red-500">*</span>
                  </label>
                  <Input 
                    placeholder="Kota tempat lahir" 
                    value={formData.placeOfBirth}
                    onChange={(e) => setFormData({...formData, placeOfBirth: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    Tanggal Lahir <span className="text-red-500">*</span>
                  </label>
                  <Input 
                    placeholder="dd/mm/yy" 
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                    rightIcon={<Calendar size={20} className="text-neutral-400" />}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    Jenis Kelamin <span className="text-red-500">*</span>
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
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    Agama <span className="text-red-500">*</span>
                  </label>
                  <Select
                    placeholder="Pilih agama..."
                    options={[
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
          </div>
        );
      case 2: // Alamat & Kontak
        return (
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
        );
      case 3: // Data Akademik
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Kelas *"
                placeholder="Pilih kelas siswa..."
                options={[
                  { value: '10', label: '10' },
                  { value: '11', label: '11' },
                  { value: '12', label: '12' },
                ]}
                value={formData.class}
                onChange={(e) => setFormData({...formData, class: e.target.value})}
              />
              <Select
                label="Jurusan *"
                placeholder="Pilih jurusan siswa..."
                options={[
                  { value: 'ipa', label: 'IPA' },
                  { value: 'ips', label: 'IPS' },
                  { value: 'bahasa', label: 'Bahasa' },
                ]}
                value={formData.major}
                onChange={(e) => setFormData({...formData, major: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label="Tanggal Diterima *"
                placeholder="dd/mm/yy" 
                value={formData.dateAccepted}
                onChange={(e) => setFormData({...formData, dateAccepted: e.target.value})}
                rightIcon={<Calendar size={20} className="text-neutral-400" />}
              />
              <Select
                label="Semester Masuk *"
                placeholder="Pilih semester..."
                options={[
                  { value: 'ganjil', label: 'Ganjil' },
                  { value: 'genap', label: 'Genap' },
                ]}
                value={formData.semester}
                onChange={(e) => setFormData({...formData, semester: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Jalur Masuk *"
                placeholder="Pilih jalur masuk siswa..."
                options={[
                  { value: 'zonasi', label: 'Zonasi' },
                  { value: 'prestasi', label: 'Prestasi' },
                  { value: 'afirmasi', label: 'Afirmasi' },
                  { value: 'pindahan', label: 'Pindahan' },
                ]}
                value={formData.admissionPath}
                onChange={(e) => setFormData({...formData, admissionPath: e.target.value})}
              />
              <Select
                label="Tahun Angkatan *"
                placeholder="Pilih Tahun Angkatan..."
                options={[
                  { value: '2023', label: '2023' },
                  { value: '2024', label: '2024' },
                  { value: '2025', label: '2025' },
                ]}
                value={formData.cohortYear}
                onChange={(e) => setFormData({...formData, cohortYear: e.target.value})}
              />
            </div>

            {/* Previous School Accordion */}
            <div className="border border-neutral-200 rounded-xl overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-4 bg-white hover:bg-neutral-50 transition-colors"
                onClick={() => setIsPreviousSchoolOpen(!isPreviousSchoolOpen)}
              >
                <span className="font-medium text-neutral-900">Sekolah Asal (Opsional)</span>
                {isPreviousSchoolOpen ? <CaretUp size={20} /> : <CaretDown size={20} />}
              </button>
              {isPreviousSchoolOpen && (
                <div className="p-4 border-t border-neutral-200 bg-white space-y-4">
                  <Input 
                    label="Nama Sekolah"
                    placeholder="Nama sekolah asal" 
                    value={formData.previousSchoolName}
                    onChange={(e) => setFormData({...formData, previousSchoolName: e.target.value})}
                  />
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                      Alamat Sekolah Asal
                    </label>
                    <textarea 
                      className="w-full rounded-lg border border-neutral-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent min-h-[100px]"
                      value={formData.previousSchoolAddress}
                      onChange={(e) => setFormData({...formData, previousSchoolAddress: e.target.value})}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Diploma Accordion */}
            <div className="border border-neutral-200 rounded-xl overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-4 bg-white hover:bg-neutral-50 transition-colors"
                onClick={() => setIsDiplomaOpen(!isDiplomaOpen)}
              >
                <span className="font-medium text-neutral-900">Data Ijazah (Opsional)</span>
                {isDiplomaOpen ? <CaretUp size={20} /> : <CaretDown size={20} />}
              </button>
              {isDiplomaOpen && (
                <div className="p-4 border-t border-neutral-200 bg-white">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input 
                      label="Tahun Ijazah"
                      placeholder="Contoh: 1 Januari 2025" 
                      value={formData.diplomaYear}
                      onChange={(e) => setFormData({...formData, diplomaYear: e.target.value})}
                    />
                    <Input 
                      label="Nomor Ijazah"
                      placeholder="Contoh: NO-123456" 
                      value={formData.diplomaNumber}
                      onChange={(e) => setFormData({...formData, diplomaNumber: e.target.value})}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      case 4: // Data Orang Tua
        return (
          <div className="space-y-6">
            {/* Parent Type Selection */}
            <div>
              <label className="block text-sm font-medium text-neutral-900 mb-3">
                Sebagai:
              </label>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <div className={cn(
                    "w-5 h-5 rounded-full border flex items-center justify-center",
                    formData.parentType === 'orang_tua' ? "border-[#2563EB]" : "border-neutral-300"
                  )}>
                    {formData.parentType === 'orang_tua' && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
                    )}
                  </div>
                  <input 
                    type="radio" 
                    name="parentType" 
                    className="hidden" 
                    checked={formData.parentType === 'orang_tua'}
                    onChange={() => setFormData({...formData, parentType: 'orang_tua'})}
                  />
                  <span className="text-sm text-neutral-700">Orang Tua</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                   <div className={cn(
                    "w-5 h-5 rounded-full border flex items-center justify-center",
                    formData.parentType === 'wali' ? "border-[#2563EB]" : "border-neutral-300"
                  )}>
                    {formData.parentType === 'wali' && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
                    )}
                  </div>
                  <input 
                    type="radio" 
                    name="parentType" 
                    className="hidden" 
                    checked={formData.parentType === 'wali'}
                    onChange={() => setFormData({...formData, parentType: 'wali'})}
                  />
                  <span className="text-sm text-neutral-700">Wali</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label={`NIK ${formData.parentType === 'wali' ? 'Wali' : 'Orang Tua'} *`}
                placeholder="16 digit NIK" 
                value={formData.parentNik}
                onChange={(e) => setFormData({...formData, parentNik: e.target.value})}
              />
              <Input 
                label={`Nama Lengkap ${formData.parentType === 'wali' ? 'Wali' : 'Orang Tua'} *`}
                placeholder={`Nama lengkap ${formData.parentType === 'wali' ? 'Wali' : 'Orang Tua'}`}
                value={formData.parentName}
                onChange={(e) => setFormData({...formData, parentName: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label={`Nomor Telepon ${formData.parentType === 'wali' ? 'Wali' : 'Orang Tua'} *`}
                placeholder="Contoh: 0821xxxxxxx" 
                value={formData.parentPhone}
                onChange={(e) => setFormData({...formData, parentPhone: e.target.value})}
              />
              <Select
                label={`Pekerjaan ${formData.parentType === 'wali' ? 'Wali' : 'Orang Tua'}`}
                placeholder="Pilih pekerjaan..."
                options={[
                  { value: 'pns', label: 'PNS' },
                  { value: 'swasta', label: 'Karyawan Swasta' },
                  { value: 'wiraswasta', label: 'Wiraswasta' },
                  { value: 'tni_polri', label: 'TNI / Polri' },
                  { value: 'petani', label: 'Petani' },
                  { value: 'nelayan', label: 'Nelayan' },
                  { value: 'lainnya', label: 'Lainnya' },
                ]}
                value={formData.parentJob}
                onChange={(e) => setFormData({...formData, parentJob: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label="Email *"
                placeholder="email@gmail.com" 
                value={formData.parentEmail}
                onChange={(e) => setFormData({...formData, parentEmail: e.target.value})}
              />
              <Input 
                label="Alamat *"
                placeholder="Nama jalan, nomor rumah, blok, detail tambahan" 
                value={formData.parentAddress}
                onChange={(e) => setFormData({...formData, parentAddress: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label="RT/RW *"
                placeholder="Contoh: RT 001 / RW 001" 
                value={formData.parentRtRw}
                onChange={(e) => setFormData({...formData, parentRtRw: e.target.value})}
              />
              <Select
                label="Provinsi *"
                placeholder="Pilih Provinsi"
                options={[
                  { value: 'dki_jakarta', label: 'DKI Jakarta' },
                  { value: 'jawa_barat', label: 'Jawa Barat' },
                  { value: 'jawa_tengah', label: 'Jawa Tengah' },
                  { value: 'jawa_timur', label: 'Jawa Timur' },
                ]}
                value={formData.parentProvince}
                onChange={(e) => setFormData({...formData, parentProvince: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="w-full">
                <Select
                  label="Kabupaten *"
                  placeholder="Pilih kabupaten..."
                  options={[
                    { value: 'jakarta_selatan', label: 'Jakarta Selatan' },
                    { value: 'jakarta_pusat', label: 'Jakarta Pusat' },
                  ]}
                  value={formData.parentRegency}
                  onChange={(e) => setFormData({...formData, parentRegency: e.target.value})}
                  disabled={!formData.parentProvince}
                />
                {!formData.parentProvince && (
                  <p className="text-xs text-neutral-500 mt-1">Pilih provinsi terlebih dahulu</p>
                )}
              </div>
              <div className="w-full">
                <Select
                  label="Kecamatan *"
                  placeholder="Pilih kecamatan..."
                  options={[
                    { value: 'tebet', label: 'Tebet' },
                    { value: 'setiabudi', label: 'Setiabudi' },
                  ]}
                  value={formData.parentDistrict}
                  onChange={(e) => setFormData({...formData, parentDistrict: e.target.value})}
                  disabled={!formData.parentRegency}
                />
                {!formData.parentRegency && (
                  <p className="text-xs text-neutral-500 mt-1">Pilih kabupaten terlebih dahulu</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="w-full">
                <Select
                  label="Kelurahan *"
                  placeholder="Pilih kelurahan..."
                  options={[
                    { value: 'tebet_barat', label: 'Tebet Barat' },
                    { value: 'tebet_timur', label: 'Tebet Timur' },
                  ]}
                  value={formData.parentVillage}
                  onChange={(e) => setFormData({...formData, parentVillage: e.target.value})}
                  disabled={!formData.parentDistrict}
                />
                {!formData.parentDistrict && (
                  <p className="text-xs text-neutral-500 mt-1">Pilih kecamatan terlebih dahulu</p>
                )}
              </div>
              <Input 
                label="Kode Pos"
                placeholder="contoh: 12345" 
                value={formData.parentPostalCode}
                onChange={(e) => setFormData({...formData, parentPostalCode: e.target.value})}
              />
            </div>

            {formData.parentType === 'wali' && (
              <Select
                label="Hubungan Wali dengan Siswa *"
                placeholder="Pilih hubungan wali..."
                options={[
                  { value: 'kakek', label: 'Kakek' },
                  { value: 'nenek', label: 'Nenek' },
                  { value: 'paman', label: 'Paman' },
                  { value: 'bibi', label: 'Bibi' },
                  { value: 'kakak', label: 'Kakak' },
                  { value: 'lainnya', label: 'Lainnya' },
                ]}
                value={formData.guardianRelationship}
                onChange={(e) => setFormData({...formData, guardianRelationship: e.target.value})}
              />
            )}
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center h-64 text-neutral-500">
            <p>Form untuk langkah {STEPS[currentStep].label} belum tersedia.</p>
          </div>
        );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Siswa"
      subtitle="Perbarui data siswa"
      size="xl"
    >
      {/* Steps Tabs */}
      <div className="border-b border-neutral-200 mb-8 overflow-x-auto hide-scrollbar">
        <div className="flex space-x-8 min-w-max">
          {STEPS.map((step, index) => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(index)}
              className={cn(
                "pb-3 text-sm font-medium border-b-2 transition-colors",
                index === currentStep
                  ? "border-[#2563EB] text-[#2563EB]"
                  : "border-transparent text-neutral-500 hover:text-neutral-700"
              )}
            >
              {step.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="min-h-[300px]">
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden" 
          accept="image/png, image/jpeg, image/jpg"
        />
        {renderStepContent()}
      </div>

      {/* Footer / Actions */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-neutral-200">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={currentStep === 0}
          className={cn(
            "border-neutral-200 text-neutral-600 hover:bg-neutral-50",
            currentStep === 0 && "opacity-50 cursor-not-allowed bg-neutral-100"
          )}
        >
          <ArrowLeft size={18} className="mr-2" />
          Sebelumnya
        </Button>
        <Button
          onClick={handleNext}
          className="bg-[#2563EB] hover:bg-blue-700 text-white"
        >
          {currentStep === STEPS.length - 1 ? 'Simpan' : 'Berikutnya'}
          {currentStep === STEPS.length - 1 ? (
            <FloppyDisk size={18} className="ml-2" />
          ) : (
            <ArrowRight size={18} className="ml-2" />
          )}
        </Button>
      </div>
    </Modal>
  );
};

export default EditStudentModal;