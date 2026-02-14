import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  PencilSimple, 
  ShieldCheck,
  CaretRight
} from '@phosphor-icons/react';
import Card, { CardBody } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import EditStaffModal from './components/EditStaffModal';

const StaffDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Mock data for Staff Detail
  const staff = {
    id: id || '1',
    nik: '1234567890123456',
    employeeId: '1234567890123456',
    name: 'Ahmad Rizki Pratama',
    birthPlace: 'Jakarta',
    birthDate: '15 Maret 2005',
    gender: 'Laki-laki',
    religion: 'Islam',
    photoUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=300&auto=format&fit=crop',

    // Employment
    division: 'Kesiswaan',
    position: '-',
    employmentStatus: 'Honorer',
    joinDate: '20/10/2025',

    // Access Control
    role: 'Editor',
    modules: 'E - Raport, Guru, Nilai',

    status: 'active',
  };

  const InfoRow = ({ label, value, className = "" }: { label: string, value: string, className?: string }) => (
    <div className={`flex justify-between items-center py-4 border-b border-neutral-100 last:border-0 ${className}`}>
      <span className="text-sm text-neutral-500">{label}</span>
      <span className="text-sm font-semibold text-neutral-900 text-right">{value}</span>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
            <ShieldCheck size={28} className="text-neutral-500" />
            <h1 className="text-2xl font-bold text-neutral-600">Autentikasi</h1>
        </div>
        <div className="flex items-center text-sm text-neutral-500">
            <span className="hover:text-blue-600 cursor-pointer" onClick={() => navigate('/admin')}>Dasbor</span>
            <CaretRight size={12} className="mx-2" />
            <span className="hover:text-blue-600 cursor-pointer" onClick={() => navigate('/admin/staff')}>Staff</span>
            <CaretRight size={12} className="mx-2" />
            <span className="text-blue-600 font-medium">Detail Staff</span>
        </div>
      </div>

      {/* Main Content Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">Detail Staff</h2>
          <p className="text-sm text-neutral-500">Informasi lengkap data staff</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
            {staff.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
          </span>
          <Button 
            variant="outline" 
            className="border-neutral-200 text-neutral-600 hover:bg-neutral-50"
            onClick={() => navigate('/admin/staff')}
          >
            <ArrowLeft size={18} className="mr-2" />
            Kembali
          </Button>
          <Button 
            className="bg-[#2563EB] hover:bg-blue-700 text-white border-none"
            onClick={() => setIsEditModalOpen(true)}
          >
            <PencilSimple size={18} className="mr-2" />
            Edit
          </Button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Row 1: Foto & Identitas */}
        {/* Foto Staff */}
        <div className="lg:col-span-4">
          <Card className="h-full border-none shadow-sm rounded-xl overflow-hidden bg-white">
            <CardBody className="p-6">
              <h3 className="font-bold text-neutral-900 mb-4">Foto Staff</h3>
              <div className="aspect-[3/4] w-full bg-neutral-100 rounded-lg overflow-hidden border border-neutral-200">
                 <img 
                   src={staff.photoUrl} 
                   alt={staff.name} 
                   className="w-full h-full object-cover"
                 />
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Identitas Staff */}
        <div className="lg:col-span-8">
          <Card className="h-full border-none shadow-sm rounded-xl bg-white">
            <CardBody className="p-6">
              <h3 className="font-bold text-neutral-900 mb-2">Identitas Staff</h3>
              <div className="mt-2">
                <InfoRow label="NIK" value={staff.nik} />
                <InfoRow label="Nomor Induk Pegawai" value={staff.employeeId} />
                <InfoRow label="Nama Lengkap" value={staff.name} />
                <InfoRow label="Tempat Lahir" value={staff.birthPlace} />
                <InfoRow label="Tanggal Lahir" value={staff.birthDate} />
                <InfoRow label="Jenis Kelamin" value={staff.gender} />
                <InfoRow label="Agama" value={staff.religion} />
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Row 2: Kepegawaian & Kontrol Akses */}
        {/* Kepegawaian */}
        <div className="lg:col-span-6">
          <Card className="h-full border-none shadow-sm rounded-xl bg-white">
            <CardBody className="p-6">
              <h3 className="font-bold text-neutral-900 mb-2">Kepegawaian</h3>
              <div className="mt-2">
                <InfoRow label="Divisi" value={staff.division} />
                <InfoRow label="Jabatan" value={staff.position} />
                <InfoRow label="Status Pegawai" value={staff.employmentStatus} />
                <InfoRow label="Tanggal Bergabung" value={staff.joinDate} />
                {/* Empty rows to match height if needed */}
                <div className="py-4 border-b border-transparent"></div>
                <div className="py-4 border-b border-transparent"></div>
                <div className="py-4 border-b border-transparent"></div>
                <div className="py-4 border-b border-transparent"></div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Kontrol Akses */}
        <div className="lg:col-span-6">
          <Card className="h-full border-none shadow-sm rounded-xl bg-white">
            <CardBody className="p-6">
              <h3 className="font-bold text-neutral-900 mb-2">Kontrol Akses</h3>
              <div className="mt-2">
                <InfoRow label="Role" value={staff.role} />
                <InfoRow label="Akses Modul" value={staff.modules} />
                {/* Empty rows to match height */}
                <div className="py-4 border-b border-transparent"></div>
                <div className="py-4 border-b border-transparent"></div>
                <div className="py-4 border-b border-transparent"></div>
                <div className="py-4 border-b border-transparent"></div>
                <div className="py-4 border-b border-transparent"></div>
                <div className="py-4 border-b border-transparent"></div>
              </div>
            </CardBody>
          </Card>
        </div>

      </div>

      <EditStaffModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        staff={staff}
      />
    </div>
  );
};

export default StaffDetailPage;
