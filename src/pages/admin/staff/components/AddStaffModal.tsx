import React, { useState, useRef } from 'react';
import { 
  User, 
  ArrowRight, 
  ArrowLeft, 
  Image as ImageIcon, 
  Calendar, 
  FloppyDisk,
} from '@phosphor-icons/react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import { cn } from '@/lib/utils';
import Swal from 'sweetalert2';

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STEPS = [
  { id: 'identity', label: 'Identitas Staff' },
  { id: 'personal', label: 'Data Pribadi' },
  { id: 'address', label: 'Alamat & Kontak' },
  { id: 'employment', label: 'Kepegawaian' },
];

const AddStaffModal: React.FC<AddStaffModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    // Identity
    photo: null as File | null,
    employeeId: '', // Nomor Induk Pegawai
    nik: '',

    // Personal
    firstName: '',
    lastName: '',
    birthPlace: '',
    birthDate: '',
    gender: 'Laki - laki',
    religion: '',
    lastEducation: '',
    
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

    // Employment
    division: '',
    position: '',
    employmentStatus: '',
    joinDate: '',
    role: '',
    modules: [] as string[],
  });

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

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

  const handleSubmit = async () => {
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      await Swal.fire({
        title: 'Sukses!',
        text: 'Data staff berhasil disimpan.',
        icon: 'success',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors'
        }
      });
      
      onClose();
      setCurrentStep(0);
      setPhotoPreview(null);
      // Reset form...
      
    } catch (error) {
      console.error('Error creating staff:', error);
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
      case 0: // Identitas Staff
        return (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left: Photo Upload */}
            <div className="md:col-span-4">
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden" 
                accept="image/png, image/jpeg, image/jpg"
              />
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
                {photoPreview && (
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                    <ImageIcon size={32} weight="light" className="mb-2" />
                    <span className="text-sm">Ganti Foto</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Form Fields */}
            <div className="md:col-span-8 space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <Input 
                  label="Nomor Induk Pegawai *"
                  placeholder="Nomor induk pegawai" 
                  value={formData.employeeId}
                  onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
                />
                <Input 
                  label="Nomor Induk Kependudukan *"
                  placeholder="Nomor induk kependudukan" 
                  value={formData.nik}
                  onChange={(e) => setFormData({...formData, nik: e.target.value})}
                />
              </div>
            </div>
          </div>
        );
      case 1: // Data Pribadi
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label="Nama Depan *"
                placeholder="Nama depan staff" 
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              />
              <Input 
                label="Nama Belakang *"
                placeholder="Nama belakang staff" 
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label="Tempat Lahir *"
                placeholder="Kota tempat lahir" 
                value={formData.birthPlace}
                onChange={(e) => setFormData({...formData, birthPlace: e.target.value})}
              />
              <Input 
                label="Tanggal Lahir *"
                placeholder="dd/mm/yy" 
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                rightIcon={<Calendar size={20} className="text-neutral-400" />}
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
              <Select
                label="Agama *"
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

            <div>
              <Select
                label="Pendidikan Terakhir *"
                placeholder="Pilih pendidikan..."
                options={[
                  { value: 'S1', label: 'S1' },
                  { value: 'S2', label: 'S2' },
                  { value: 'S3', label: 'S3' },
                  { value: 'D4', label: 'D4' },
                  { value: 'D3', label: 'D3' },
                  { value: 'SMA/SMK', label: 'SMA/SMK' },
                ]}
                value={formData.lastEducation}
                onChange={(e) => setFormData({...formData, lastEducation: e.target.value})}
              />
            </div>
          </div>
        );
      case 2: // Alamat & Kontak
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label="Alamat *"
                placeholder="Nama jalan, nomor rumah, blok, detail tambahan" 
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
              <Input 
                label="RT/RW *"
                placeholder="Contoh: RT 001 / RW 001" 
                value={formData.rt} 
                onChange={(e) => setFormData({...formData, rt: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Provinsi *"
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
              <div className="w-full">
                <Select
                  label="Kabupaten *"
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
              <div className="w-full">
                <Select
                  label="Kecamatan *"
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
              <div className="w-full">
                <Select
                  label="Kelurahan *"
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
              <Input 
                label="Kode Pos"
                placeholder="contoh: 12345" 
                value={formData.postalCode}
                onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
              />
              <Input 
                label="Email *"
                placeholder="email@gmail.com" 
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div>
              <Input 
                label="Nomor Telepon *"
                placeholder="Contoh: 0821xxxxxxx" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
          </div>
        );
      case 3: // Kepegawaian
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Divisi *"
                placeholder="Pilih divisi..."
                options={[
                  { value: 'Kesiswaan', label: 'Kesiswaan' },
                  { value: 'Keuangan', label: 'Keuangan' },
                  { value: 'Tata Usaha', label: 'Tata Usaha' },
                  { value: 'Kurikulum', label: 'Kurikulum' },
                  { value: 'Sarpras', label: 'Sarpras' },
                ]}
                value={formData.division}
                onChange={(e) => setFormData({...formData, division: e.target.value})}
              />
              <Select
                label="Status Pegawai *"
                placeholder="Pilih status kepegawaian..."
                options={[
                  { value: 'PNS', label: 'PNS' },
                  { value: 'Honorer', label: 'Honorer' },
                  { value: 'Tetap Yayasan', label: 'Tetap Yayasan' },
                  { value: 'Kontrak', label: 'Kontrak' },
                ]}
                value={formData.employmentStatus}
                onChange={(e) => setFormData({...formData, employmentStatus: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Jabatan *"
                placeholder="Pilih jabatan..."
                options={[
                  { value: 'Staff', label: 'Staff' },
                  { value: 'Kepala Divisi', label: 'Kepala Divisi' },
                  { value: 'Koordinator', label: 'Koordinator' },
                ]}
                value={formData.position}
                onChange={(e) => setFormData({...formData, position: e.target.value})}
              />
              <Input 
                label="Tanggal Bergabung *"
                placeholder="dd/mm/yy" 
                type="date"
                value={formData.joinDate}
                onChange={(e) => setFormData({...formData, joinDate: e.target.value})}
                rightIcon={<Calendar size={20} className="text-neutral-400" />}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <Select
                label="Role Akses *"
                placeholder="Pilih role..."
                options={[
                  { value: 'Admin', label: 'Admin' },
                  { value: 'Editor', label: 'Editor' },
                  { value: 'Viewer', label: 'Viewer' },
                ]}
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              />
              {/* Modules selection could be a multi-select or checkbox group, keeping it simple for now */}
            </div>
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
      title="Tambah Staff"
      subtitle="Lengkapi data staff secara bertahap"
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

export default AddStaffModal;
