import React, { useState, useRef } from 'react';
import { User, ArrowRight, ArrowLeft, Image, Calendar, CaretDown, CaretUp, FloppyDisk } from '@phosphor-icons/react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import { cn } from '@/lib/utils';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STEPS = [
  { id: 'identity', label: 'Identitas Siswa' },
  { id: 'personal', label: 'Data Pribadi' },
  { id: 'address', label: 'Alamat & Kontak' },
  { id: 'academic', label: 'Data Akademik' },
  { id: 'parents', label: 'Data Orang Tua' },
];

const AddStudentModal: React.FC<AddStudentModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPreviousSchoolOpen, setIsPreviousSchoolOpen] = useState(false);
  const [isDiplomaOpen, setIsDiplomaOpen] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    // Identity
    photo: null as File | null,
    nisn: '',
    nis: '',
    kk: '',
    
    // Personal
    firstName: '',
    lastName: '',
    birthPlace: '',
    birthDate: '',
    gender: 'Laki - laki',
    religion: '',
    
    // Address & Contact
    address: '',
    rt: '',
    rw: '',
    province: '',
    regency: '',
    district: '',
    village: '',
    postalCode: '',
    email: '',
    phone: '',

    // Academic
    class: '',
    major: '',
    dateAccepted: '',
    semester: '',
    admissionPath: '',
    cohortYear: '',
    
    // Previous School (Optional)
    previousSchoolName: '',
    previousSchoolAddress: '',
    
    // Diploma (Optional)
    diplomaYear: '',
    diplomaNumber: '',

    // Parent / Guardian
    parentType: 'orang_tua',
    parentNik: '',
    parentName: '',
    parentPhone: '',
    parentJob: '',
    parentEmail: '',
    parentAddress: '',
    parentRtRw: '',
    parentProvince: '',
    parentRegency: '',
    parentDistrict: '',
    parentVillage: '',
    parentPostalCode: '',
    guardianRelationship: '',
  });

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
      // Submit logic
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Identitas Siswa
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
                      <User size={32} />
                    </div>
                    <p className="font-medium text-neutral-900 mb-1">Unggah Foto</p>
                    <p className="text-xs text-neutral-500">JPG/PNG • Maks 2MB</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Form Fields */}
            <div className="md:col-span-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    NISN <span className="text-red-500">*</span>
                  </label>
                  <Input 
                    placeholder="10 digit NISN (DAPODIK)" 
                    value={formData.nisn}
                    onChange={(e) => setFormData({...formData, nisn: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    NIS / NIM <span className="text-red-500">*</span>
                  </label>
                  <Input 
                    placeholder="Nomor Induk Siswa" 
                    value={formData.nis}
                    onChange={(e) => setFormData({...formData, nis: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Nomor Kartu Keluarga <span className="text-red-500">*</span>
                </label>
                <Input 
                  placeholder="16 digit nomor KK" 
                  value={formData.kk}
                  onChange={(e) => setFormData({...formData, kk: e.target.value})}
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
                      <Image size={32} />
                    </div>
                    <p className="font-medium text-neutral-900 mb-1">Upload foto siswa</p>
                    <p className="text-xs text-neutral-500">Drag and drop atau klik untuk memilih file</p>
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
                    value={formData.birthPlace}
                    onChange={(e) => setFormData({...formData, birthPlace: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                    Tanggal Lahir <span className="text-red-500">*</span>
                  </label>
                  <Input 
                    placeholder="dd/mm/yy" 
                    value={formData.birthDate}
                    onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
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
                        formData.gender === 'Laki - laki' ? "border-[#2563EB]" : "border-neutral-300"
                      )}>
                        {formData.gender === 'Laki - laki' && (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
                        )}
                      </div>
                      <input 
                        type="radio" 
                        name="gender" 
                        className="hidden" 
                        checked={formData.gender === 'Laki - laki'}
                        onChange={() => setFormData({...formData, gender: 'Laki - laki'})}
                      />
                      <span className="text-sm text-neutral-700">Laki - laki</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                       <div className={cn(
                        "w-5 h-5 rounded-full border flex items-center justify-center",
                        formData.gender === 'Perempuan' ? "border-[#2563EB]" : "border-neutral-300"
                      )}>
                        {formData.gender === 'Perempuan' && (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
                        )}
                      </div>
                      <input 
                        type="radio" 
                        name="gender" 
                        className="hidden" 
                        checked={formData.gender === 'Perempuan'}
                        onChange={() => setFormData({...formData, gender: 'Perempuan'})}
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
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Alamat <span className="text-red-500">*</span>
                </label>
                <Input 
                  placeholder="Nama jalan, nomor rumah, blok, detail tambahan" 
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  RT/RW <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <Input 
                    placeholder="RT" 
                    value={formData.rt}
                    onChange={(e) => setFormData({...formData, rt: e.target.value})}
                  />
                  <Input 
                    placeholder="RW" 
                    value={formData.rw}
                    onChange={(e) => setFormData({...formData, rw: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Provinsi <span className="text-red-500">*</span>
                </label>
                <Select
                  placeholder="Pilih Provinsi..."
                  options={[
                    { value: 'dki_jakarta', label: 'DKI Jakarta' },
                    { value: 'jawa_barat', label: 'Jawa Barat' },
                    { value: 'jawa_tengah', label: 'Jawa Tengah' },
                    { value: 'jawa_timur', label: 'Jawa Timur' },
                  ]}
                  value={formData.province}
                  onChange={(e) => setFormData({...formData, province: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Kabupaten <span className="text-red-500">*</span>
                </label>
                <Select
                  placeholder="Pilih kabupaten..."
                  options={[
                    { value: 'jakarta_selatan', label: 'Jakarta Selatan' },
                    { value: 'jakarta_pusat', label: 'Jakarta Pusat' },
                  ]}
                  value={formData.regency}
                  onChange={(e) => setFormData({...formData, regency: e.target.value})}
                  disabled={!formData.province}
                />
                {!formData.province && (
                  <p className="text-xs text-neutral-500 mt-1">Pilih provinsi terlebih dahulu</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Kecamatan <span className="text-red-500">*</span>
                </label>
                <Select
                  placeholder="Pilih kecamatan..."
                  options={[
                    { value: 'tebet', label: 'Tebet' },
                    { value: 'setiabudi', label: 'Setiabudi' },
                  ]}
                  value={formData.district}
                  onChange={(e) => setFormData({...formData, district: e.target.value})}
                  disabled={!formData.regency}
                />
                {!formData.regency && (
                  <p className="text-xs text-neutral-500 mt-1">Pilih kabupaten terlebih dahulu</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Kelurahan <span className="text-red-500">*</span>
                </label>
                <Select
                  placeholder="Pilih kelurahan..."
                  options={[
                    { value: 'tebet_barat', label: 'Tebet Barat' },
                    { value: 'tebet_timur', label: 'Tebet Timur' },
                  ]}
                  value={formData.village}
                  onChange={(e) => setFormData({...formData, village: e.target.value})}
                  disabled={!formData.district}
                />
                {!formData.district && (
                  <p className="text-xs text-neutral-500 mt-1">Pilih kecamatan terlebih dahulu</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Kode Pos
                </label>
                <Input 
                  placeholder="contoh: 12345" 
                  value={formData.postalCode}
                  onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Email <span className="text-red-500">*</span>
                </label>
                <Input 
                  placeholder="email@gmail.com" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Nomor Telepon <span className="text-red-500">*</span>
              </label>
              <Input 
                placeholder="Contoh: 0821xxxxxxx" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
          </div>
        );
      case 3: // Data Akademik
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Kelas <span className="text-red-500">*</span>
                </label>
                <Select
                  placeholder="Pilih kelas siswa..."
                  options={[
                    { value: '10', label: '10' },
                    { value: '11', label: '11' },
                    { value: '12', label: '12' },
                  ]}
                  value={formData.class}
                  onChange={(e) => setFormData({...formData, class: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Jurusan <span className="text-red-500">*</span>
                </label>
                <Select
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Tanggal Diterima <span className="text-red-500">*</span>
                </label>
                <Input 
                  placeholder="dd/mm/yy" 
                  value={formData.dateAccepted}
                  onChange={(e) => setFormData({...formData, dateAccepted: e.target.value})}
                  rightIcon={<Calendar size={20} className="text-neutral-400" />}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Semester Masuk <span className="text-red-500">*</span>
                </label>
                <Select
                  placeholder="Pilih semester..."
                  options={[
                    { value: 'ganjil', label: 'Ganjil' },
                    { value: 'genap', label: 'Genap' },
                  ]}
                  value={formData.semester}
                  onChange={(e) => setFormData({...formData, semester: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Jalur Masuk <span className="text-red-500">*</span>
                </label>
                <Select
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
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Tahun Angkatan <span className="text-red-500">*</span>
                </label>
                <Select
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
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                      Nama Sekolah
                    </label>
                    <Input 
                      placeholder="Nama sekolah asal" 
                      value={formData.previousSchoolName}
                      onChange={(e) => setFormData({...formData, previousSchoolName: e.target.value})}
                    />
                  </div>
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
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                        Tahun Ijazah
                      </label>
                      <Input 
                        placeholder="Contoh: 1 Januari 2025" 
                        value={formData.diplomaYear}
                        onChange={(e) => setFormData({...formData, diplomaYear: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                        Nomor Ijazah
                      </label>
                      <Input 
                        placeholder="Contoh: NO-123456" 
                        value={formData.diplomaNumber}
                        onChange={(e) => setFormData({...formData, diplomaNumber: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      case 4: // Data Orang Tua
        const isWali = formData.parentType === 'wali';
        const labelSuffix = isWali ? 'Wali' : 'Orang Tua';

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
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  NIK {labelSuffix} <span className="text-red-500">*</span>
                </label>
                <Input 
                  placeholder="16 digit NIK" 
                  value={formData.parentNik}
                  onChange={(e) => setFormData({...formData, parentNik: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Nama Lengkap {labelSuffix} <span className="text-red-500">*</span>
                </label>
                <Input 
                  placeholder={`Nama lengkap ${labelSuffix.toLowerCase()}`}
                  value={formData.parentName}
                  onChange={(e) => setFormData({...formData, parentName: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Nomor Telepon {labelSuffix} <span className="text-red-500">*</span>
                </label>
                <Input 
                  placeholder="Contoh: 0821xxxxxxx" 
                  value={formData.parentPhone}
                  onChange={(e) => setFormData({...formData, parentPhone: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Pekerjaan {labelSuffix}
                </label>
                <Select
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Email <span className="text-red-500">*</span>
                </label>
                <Input 
                  placeholder="email@gmail.com" 
                  value={formData.parentEmail}
                  onChange={(e) => setFormData({...formData, parentEmail: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Alamat <span className="text-red-500">*</span>
                </label>
                <Input 
                  placeholder="Nama jalan, nomor rumah, blok, detail tambahan" 
                  value={formData.parentAddress}
                  onChange={(e) => setFormData({...formData, parentAddress: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  RT/RW <span className="text-red-500">*</span>
                </label>
                <Input 
                  placeholder="Contoh: RT 001 / RW 001" 
                  value={formData.parentRtRw}
                  onChange={(e) => setFormData({...formData, parentRtRw: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Provinsi <span className="text-red-500">*</span>
                </label>
                <Select
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Kabupaten <span className="text-red-500">*</span>
                </label>
                <Select
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
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Kecamatan <span className="text-red-500">*</span>
                </label>
                <Select
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
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Kelurahan <span className="text-red-500">*</span>
                </label>
                <Select
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
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Kode Pos
                </label>
                <Input 
                  placeholder="contoh: 12345" 
                  value={formData.parentPostalCode}
                  onChange={(e) => setFormData({...formData, parentPostalCode: e.target.value})}
                />
              </div>
            </div>

            {isWali && (
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                  Hubungan Wali dengan Siswa <span className="text-red-500">*</span>
                </label>
                <Select
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
              </div>
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
      title="Tambah Siswa"
      subtitle="Lengkapi data siswa secara bertahap"
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
                  ? "border-primary-600 text-primary-600"
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
            "border-neutral-200 text-neutral-600",
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

export default AddStudentModal;
