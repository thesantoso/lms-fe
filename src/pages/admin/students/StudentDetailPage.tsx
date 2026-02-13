import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  PencilSimple, 
  ShieldCheck,
  CaretRight
} from '@phosphor-icons/react';
import Card, { CardBody } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const StudentDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data matching the design
  const student = {
    id: '1',
    // Identity
    nisn: '0012345678',
    nis: 'SMA001234',
    kk: '1234567890123456',
    name: 'Ahmad Rizki Pratama',
    birthPlace: 'Jakarta',
    birthDate: '15 Maret 2005',
    gender: 'Laki-laki',
    religion: 'Islam',
    photoUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=300&auto=format&fit=crop', // Placeholder image

    // Address & Contact
    address: 'Perumahan Resident, Jl. Merdeka No. 123',
    rt_rw: '05/02',
    province: 'DKI Jakarta',
    district: 'Menteng', // Kecamatan
    subdistrict: 'Gondangdia', // Kelurahan
    postalCode: '10350',
    email: 'ahmad.rizki@email.com',
    phone: '081234567890',

    // Academic
    major: 'IPA',
    class: 'XII IPA 1',
    admissionDate: '15 Juli 2022',
    semester: 'Ganjil',
    admissionType: 'Zonasi',
    batch: '2022',

    // Parent/Guardian
    parentRole: 'Orang Tua',
    parentNik: '3171234567890123',
    parentName: 'Budi Pratama',
    parentJob: 'Bandar Ayam',
    parentEmail: 'budi.pratama@email.com',
    parentPhone: '0811xxxxxxxxxxxx',
    parentAddress: 'Perumahan Resident, Jl. Merdeka No. 123',
    parentRtRw: '05/02',
    parentProvince: 'DKI Jakarta',
    parentDistrict: 'Menteng',
    parentSubdistrict: 'Gondangdia',
    parentPostalCode: '10350',

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
            <span className="hover:text-blue-600 cursor-pointer" onClick={() => navigate('/admin/students')}>Siswa</span>
            <CaretRight size={12} className="mx-2" />
            <span className="text-blue-600 font-medium">Detail Siswa</span>
        </div>
      </div>

      {/* Main Content Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">Detail Siswa</h2>
          <p className="text-sm text-neutral-500">Informasi lengkap data siswa</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
            {student.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
          </span>
          <Button 
            variant="outline" 
            className="border-neutral-200 text-neutral-600 hover:bg-neutral-50"
            onClick={() => navigate('/admin/students')}
          >
            <ArrowLeft size={18} className="mr-2" />
            Kembali
          </Button>
          <Button 
            className="bg-[#2563EB] hover:bg-blue-700 text-white border-none"
            onClick={() => navigate(`/admin/students/edit/${id}`)}
          >
            <PencilSimple size={18} className="mr-2" />
            Edit
          </Button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Row 1: Foto & Identitas */}
        {/* Foto Siswa */}
        <div className="lg:col-span-4">
          <Card className="h-full border-none shadow-sm rounded-xl overflow-hidden bg-white">
            <CardBody className="p-6">
              <h3 className="font-bold text-neutral-900 mb-4">Foto Siswa</h3>
              <div className="aspect-[3/4] w-full bg-neutral-100 rounded-lg overflow-hidden border border-neutral-200">
                 <img 
                   src={student.photoUrl} 
                   alt={student.name} 
                   className="w-full h-full object-cover"
                 />
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Identitas Siswa */}
        <div className="lg:col-span-8">
          <Card className="h-full border-none shadow-sm rounded-xl bg-white">
            <CardBody className="p-6">
              <h3 className="font-bold text-neutral-900 mb-2">Identitas Siswa</h3>
              <div className="mt-2">
                <InfoRow label="NISN" value={student.nisn} />
                <InfoRow label="NIS / NIM" value={student.nis} />
                <InfoRow label="No KK" value={student.kk} />
                <InfoRow label="Nama Lengkap" value={student.name} />
                <InfoRow label="Tempat Lahir" value={student.birthPlace} />
                <InfoRow label="Tanggal Lahir" value={student.birthDate} />
                <InfoRow label="Jenis Kelamin" value={student.gender} />
                <InfoRow label="Agama" value={student.religion} />
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Row 2: Alamat & Kontak & Data Akademik */}
        {/* Alamat & Kontak */}
        <div className="lg:col-span-6">
          <Card className="h-full border-none shadow-sm rounded-xl bg-white">
            <CardBody className="p-6">
              <h3 className="font-bold text-neutral-900 mb-2">Alamat & Kontak</h3>
              <div className="mt-2">
                <InfoRow label="Alamat" value={student.address} />
                <InfoRow label="RT / RW" value={student.rt_rw} />
                <InfoRow label="Provinsi" value={student.province} />
                <InfoRow label="Kecamatan" value={student.district} />
                <InfoRow label="Kelurahan" value={student.subdistrict} />
                <InfoRow label="Kode Pos" value={student.postalCode} />
                <InfoRow label="Email Siswa" value={student.email} />
                <InfoRow label="Nomor Telepon" value={student.phone} />
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Data Akademik */}
        <div className="lg:col-span-6">
          <Card className="h-full border-none shadow-sm rounded-xl bg-white">
            <CardBody className="p-6">
              <h3 className="font-bold text-neutral-900 mb-2">Data Akademik</h3>
              <div className="mt-2">
                <InfoRow label="Jurusan" value={student.major} />
                <InfoRow label="Kelas" value={student.class} />
                <InfoRow label="Tanggal Diterima" value={student.admissionDate} />
                <InfoRow label="Semester Masuk" value={student.semester} />
                <InfoRow label="Jalur Masuk" value={student.admissionType} />
                <InfoRow label="Tahun Angkatan" value={student.batch} />
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Row 3: Data Orang Tua / Wali */}
        <div className="lg:col-span-12">
          <Card className="h-full border-none shadow-sm rounded-xl bg-white">
            <CardBody className="p-6">
              <h3 className="font-bold text-neutral-900 mb-2">Data Orang Tua / Wali</h3>
              <div className="mt-2">
                <InfoRow label="Sebagai" value={student.parentRole} />
                <InfoRow label="NIK Orang Tua" value={student.parentNik} />
                <InfoRow label="Nama Lengkap Orang Tua" value={student.parentName} />
                <InfoRow label="Pekerjaan Orang Tua" value={student.parentJob} />
                <InfoRow label="Email" value={student.parentEmail} />
                <InfoRow label="No Telepon Orang Tua" value={student.parentPhone} />
                <div className="h-px bg-neutral-100 my-2"></div>
                <InfoRow label="Alamat" value={student.parentAddress} />
                <InfoRow label="RT / RW" value={student.parentRtRw} />
                <InfoRow label="Provinsi" value={student.parentProvince} />
                <InfoRow label="Kecamatan" value={student.parentDistrict} />
                <InfoRow label="Kelurahan" value={student.parentSubdistrict} />
                <InfoRow label="Kode Pos" value={student.parentPostalCode} />
              </div>
            </CardBody>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default StudentDetailPage;
