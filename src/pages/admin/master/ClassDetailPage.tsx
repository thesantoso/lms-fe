import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  PencilSimple, 
  BookBookmark,
  CaretRight
} from '@phosphor-icons/react';
import Card, { CardBody } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import EditClassModal from './components/EditClassModal';
// import EditClassModal from './components/EditClassModal';

// Mock data
const MOCK_CLASS_DETAIL = {
  id: '1',
  roomNumber: '59',
  name: '10-IPA-1',
  homeroomTeacher: 'Budi Santoso',
  academicYear: '2024 / 2025',
  gradeLevel: '10',
  quota: 40,
  status: 'active',
  students: [
    { id: '022222', name: 'Rian Suryana' },
    { id: '022223', name: 'Kuncensius Pradana' },
    { id: '022224', name: 'Boamnisme' },
    { id: '022225', name: 'Arkan Sight' },
    { id: '022226', name: 'Yugito Kurniawan' },
  ]
};

const ClassDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [classData, setClassData] = useState(MOCK_CLASS_DETAIL);

  const handleSave = (updatedData: any) => {
    setClassData({ ...classData, ...updatedData });
    setIsEditModalOpen(false);
  };

  const InfoRow = ({ label, value, className = "" }: { label: string, value: string | number, className?: string }) => (
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
            <BookBookmark size={28} className="text-neutral-500" />
            <h1 className="text-2xl font-bold text-neutral-600">Autentikasi</h1>
        </div>
        <div className="flex items-center text-sm text-neutral-500">
            <span className="hover:text-primary-600 cursor-pointer" onClick={() => navigate('/admin')}>Dasbor</span>
            <CaretRight size={12} className="mx-2" />
            <span className="hover:text-primary-600 cursor-pointer" onClick={() => navigate('/admin/master/classes')}>Master Data</span>
            <CaretRight size={12} className="mx-2" />
            <span className="hover:text-primary-600 cursor-pointer" onClick={() => navigate('/admin/master/classes')}>Kelas</span>
            <CaretRight size={12} className="mx-2" />
            <span className="text-primary-600 font-medium">Detail Kelas</span>
        </div>
      </div>

      {/* Main Content Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">Detail Kelas</h2>
          <p className="text-sm text-neutral-500">Informasi lengkap data kelas</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            classData.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
          }`}>
            {classData.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
          </span>
          <Button 
            variant="outline" 
            className="bg-neutral-100 hover:bg-neutral-200 border-none text-neutral-600"
            leftIcon={<ArrowLeft size={18} />}
            onClick={() => navigate('/admin/master/classes')}
          >
            Kembali
          </Button>
          <Button 
            className="bg-primary-600 bg-blue-600 hover:bg-blue-700  hover:bg-primary-700 text-white border-none shadow-md shadow-primary-200"
            leftIcon={<PencilSimple size={18} weight="bold" />}
            onClick={() => setIsEditModalOpen(true)}
          >
            Edit
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Class Identity */}
        <Card className="border-none shadow-sm bg-white rounded-xl">
          <CardBody className="p-6">
            <h3 className="text-lg font-bold text-neutral-900 mb-6 pb-4 border-b border-neutral-100">
              Identitas Kelas
            </h3>
            
            <div className="space-y-1">
              <InfoRow label="No Ruangan" value={classData.roomNumber} />
              <InfoRow label="Nama Kelas" value={classData.name} />
              <InfoRow label="Wali Kelas" value={classData.homeroomTeacher} />
              <InfoRow label="Tahun Ajaran" value={classData.academicYear} />
              <InfoRow label="Tingkat Kelas" value={classData.gradeLevel} />
              <InfoRow label="Kuota Siswa" value={classData.quota} />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Edit Modal */}
      <EditClassModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        classData={classData}
        onSave={handleSave}
      />
    </div>
  );
};

export default ClassDetailPage;
