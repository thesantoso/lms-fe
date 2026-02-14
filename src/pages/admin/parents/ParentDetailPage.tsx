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

const ParentDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data for Parent Detail
  const parent = {
    id: id || '1',
    nik: '1234567890123456',
    kk: '1234567890123456',
    name: 'Ahmad Rizki Pratama',
    birthPlace: 'Jakarta',
    birthDate: '15 Maret 2005',
    gender: 'Laki-laki',
    religion: 'Islam',
    photoUrl: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?q=80&w=300&auto=format&fit=crop',

    // Family Info
    relation: 'Ayah',
    children: 'Ahmad Fauzan',
    occupation: 'Wiraswasta',

    // Address & Contact
    address: 'Perumahan Resident, Jl. Merdeka No. 123',
    rt_rw: '05/02',
    province: 'DKI Jakarta',
    district: 'Menteng',
    subdistrict: 'Gondangdia',
    postalCode: '10350',
    email: 'ahmad.rizki@email.com',
    phone: '081234567890',

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
            <span className="hover:text-blue-600 cursor-pointer" onClick={() => navigate('/admin/parents')}>Orang tua</span>
            <CaretRight size={12} className="mx-2" />
            <span className="text-blue-600 font-medium">Detail Orang Tua</span>
        </div>
      </div>

      {/* Main Content Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">Detail Orang Tua</h2>
          <p className="text-sm text-neutral-500">Informasi lengkap data orang tua</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
            {parent.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
          </span>
          <Button 
            variant="outline" 
            className="border-neutral-200 text-neutral-600 hover:bg-neutral-50"
            onClick={() => navigate('/admin/parents')}
          >
            <ArrowLeft size={18} className="mr-2" />
            Kembali
          </Button>
          <Button 
            className="bg-[#2563EB] hover:bg-blue-700 text-white border-none"
            onClick={() => alert('Fitur edit orang tua akan segera hadir')}
          >
            <PencilSimple size={18} className="mr-2" />
            Edit
          </Button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Row 1: Foto & Identitas */}
        {/* Foto Orang Tua */}
        <div className="lg:col-span-4">
          <Card className="h-full border-none shadow-sm rounded-xl overflow-hidden bg-white">
            <CardBody className="p-6">
              <h3 className="font-bold text-neutral-900 mb-4">Foto Orang Tua</h3>
              <div className="aspect-[3/4] w-full bg-neutral-100 rounded-lg overflow-hidden border border-neutral-200">
                 <img 
                   src={parent.photoUrl} 
                   alt={parent.name} 
                   className="w-full h-full object-cover"
                 />
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Identitas Orang Tua */}
        <div className="lg:col-span-8">
          <Card className="h-full border-none shadow-sm rounded-xl bg-white">
            <CardBody className="p-6">
              <h3 className="font-bold text-neutral-900 mb-2">Identitas Orang tua</h3>
              <div className="mt-2">
                <InfoRow label="NIK Orang Tua" value={parent.nik} />
                <InfoRow label="No KK Orang tua" value={parent.kk} />
                <InfoRow label="Nama Lengkap" value={parent.name} />
                <InfoRow label="Tempat Lahir" value={parent.birthPlace} />
                <InfoRow label="Tanggal Lahir" value={parent.birthDate} />
                <InfoRow label="Jenis Kelamin" value={parent.gender} />
                <InfoRow label="Agama" value={parent.religion} />
                <InfoRow label="Hubungan Keluarga" value={parent.relation} />
                <InfoRow label="Daftar Anak" value={parent.children} />
                <InfoRow label="Pekerjaan" value={parent.occupation} />
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Row 2: Alamat & Kontak */}
        <div className="lg:col-span-12">
          <Card className="h-full border-none shadow-sm rounded-xl bg-white">
            <CardBody className="p-6">
              <h3 className="font-bold text-neutral-900 mb-2">Alamat & Kontak</h3>
              <div className="mt-2">
                <InfoRow label="Alamat" value={parent.address} />
                <InfoRow label="RT / RW" value={parent.rt_rw} />
                <InfoRow label="Provinsi" value={parent.province} />
                <InfoRow label="Kecamatan" value={parent.district} />
                <InfoRow label="Kelurahan" value={parent.subdistrict} />
                <InfoRow label="Kode Pos" value={parent.postalCode} />
                <InfoRow label="Email Siswa" value={parent.email} /> 
                <InfoRow label="Nomor Telepon" value={parent.phone} />
              </div>
            </CardBody>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default ParentDetailPage;
