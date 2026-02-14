import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  ArrowLeft, 
  PencilSimple, 
  ShieldCheck,
  CaretRight
} from '@phosphor-icons/react';
import Card, { CardBody } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { teacherApi } from '@/lib/api/services';
import EditTeacherModal from './components/EditTeacherModal';
import { useTenant } from '@/contexts/TenantContext';

const TeacherDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { currentSchool } = useTenant();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data: teacherData, isLoading } = useQuery({
    queryKey: ['teacher', id],
    queryFn: () => teacherApi.getById(id!),
    enabled: !!id,
  });

  const teacher = teacherData?.data;

  // Mock data fallback if API fails or for demo
  const displayTeacher = teacher || {
    id: id || '1',
    // Identity
    buptk: '0012345678',
    nig: 'SMA001234',
    nip: '1234567890123456',
    nik: '1234567890123456',
    name: 'Ahmad Rizki Pratama',
    birthPlace: 'Jakarta',
    birthDate: '15 Maret 2005',
    gender: 'Laki-laki',
    religion: 'Islam',
    education: 'S2',
    photoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=300&auto=format&fit=crop', // Placeholder image

    // Address & Contact
    address: 'Perumahan Resident, Jl. Merdeka No. 123',
    rt_rw: '05/02',
    province: 'DKI Jakarta',
    district: 'Menteng', // Kecamatan
    subdistrict: 'Gondangdia', // Kelurahan
    postalCode: '10350',
    email: 'ahmad.rizki@email.com',
    phone: '081234567890',

    // Professional
    subject: 'IPA',
    employmentStatus: 'PNS',
    position: '-',

    status: 'active',
  };

  const InfoRow = ({ label, value, className = "" }: { label: string, value: string | undefined, className?: string }) => (
    <div className={`flex justify-between items-center py-4 border-b border-neutral-100 last:border-0 ${className}`}>
      <span className="text-sm text-neutral-500">{label}</span>
      <span className="text-sm font-semibold text-neutral-900 text-right">{value || '-'}</span>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

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
            <span className="hover:text-blue-600 cursor-pointer" onClick={() => navigate('/admin/teachers')}>Guru</span>
            <CaretRight size={12} className="mx-2" />
            <span className="text-blue-600 font-medium">Detail Guru</span>
        </div>
      </div>

      {/* Main Content Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">Detail Guru</h2>
          <p className="text-sm text-neutral-500">Informasi lengkap data guru</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
            {displayTeacher.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
          </span>
          <Button 
            variant="outline" 
            className="border-neutral-200 text-neutral-600 hover:bg-neutral-50"
            onClick={() => navigate('/admin/teachers')}
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
        {/* Foto Guru */}
        <div className="lg:col-span-4">
          <Card className="h-full border-none shadow-sm rounded-xl overflow-hidden bg-white">
            <CardBody className="p-6">
              <h3 className="font-bold text-neutral-900 mb-4">Foto Guru</h3>
              <div className="aspect-[3/4] w-full bg-neutral-100 rounded-lg overflow-hidden border border-neutral-200">
                 <img 
                   src={displayTeacher.photoUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=300&auto=format&fit=crop'} 
                   alt={displayTeacher.name} 
                   className="w-full h-full object-cover"
                 />
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Identitas Guru */}
        <div className="lg:col-span-8">
          <Card className="h-full border-none shadow-sm rounded-xl bg-white">
            <CardBody className="p-6">
              <h3 className="font-bold text-neutral-900 mb-2">Identitas Guru</h3>
              <div className="mt-2">
                <InfoRow label="BUPTK" value={displayTeacher.buptk} />
                <InfoRow label="Nomor Induk Guru" value={displayTeacher.nig} />
                <InfoRow label="NIP" value={displayTeacher.nip} />
                <InfoRow label="Nomor Induk Kependudukan" value={displayTeacher.nik} />
                <InfoRow label="Nama Lengkap" value={displayTeacher.name} />
                <InfoRow label="Tempat Lahir" value={displayTeacher.birthPlace} />
                <InfoRow label="Tanggal Lahir" value={displayTeacher.birthDate} />
                <InfoRow label="Jenis Kelamin" value={displayTeacher.gender} />
                <InfoRow label="Agama" value={displayTeacher.religion} />
                <InfoRow label="Pendidikan Terakhir" value={displayTeacher.education} />
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Row 2: Alamat & Kontak & Profesional */}
        {/* Alamat & Kontak */}
        <div className="lg:col-span-6">
          <Card className="h-full border-none shadow-sm rounded-xl bg-white">
            <CardBody className="p-6">
              <h3 className="font-bold text-neutral-900 mb-2">Alamat & Kontak</h3>
              <div className="mt-2">
                <InfoRow label="Alamat" value={displayTeacher.address} />
                <InfoRow label="RT / RW" value={displayTeacher.rt_rw} />
                <InfoRow label="Provinsi" value={displayTeacher.province} />
                <InfoRow label="Kecamatan" value={displayTeacher.district} />
                <InfoRow label="Kelurahan" value={displayTeacher.subdistrict} />
                <InfoRow label="Kode Pos" value={displayTeacher.postalCode} />
                <InfoRow label="Email Siswa" value={displayTeacher.email} /> 
                <InfoRow label="Nomor Telepon" value={displayTeacher.phone} />
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Profesional */}
        <div className="lg:col-span-6">
          <Card className="h-full border-none shadow-sm rounded-xl bg-white">
            <CardBody className="p-6">
              <h3 className="font-bold text-neutral-900 mb-2">Profesional</h3>
              <div className="mt-2">
                <InfoRow label="Mata Pelajaran" value={displayTeacher.subject} />
                <InfoRow label="Status Pegawai" value={displayTeacher.employmentStatus} />
                <InfoRow label="Jabatan" value={displayTeacher.position} />
                {/* Empty rows to match height if needed, or just let it be auto */}
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

      <EditTeacherModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        teacher={teacher}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['teacher', id] });
        }}
      />
    </div>
  );
};

export default TeacherDetailPage;