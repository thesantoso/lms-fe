import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  PencilSimple, 
  BookBookmark,
  CaretRight
} from '@phosphor-icons/react';
import Card, { CardBody } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import EditSubjectModal from './components/EditSubjectModal';

// Mock data
const MOCK_SUBJECT_DETAIL = {
  id: '1',
  code: 'MP100',
  name: 'Bahasa Indonesia',
  category: 'Muatan Lokal',
  gradeLevel: '10', // Should be "-" based on screenshot if not applicable
  curriculumType: 'Merdeka',
  kkm: 77,
  material: '-',
  status: 'active',
};

const SubjectDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [subjectData, setSubjectData] = useState(MOCK_SUBJECT_DETAIL);

  const handleSave = (updatedData: any) => {
    setSubjectData({ ...subjectData, ...updatedData });
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
            <span className="hover:text-primary-600 cursor-pointer" onClick={() => navigate('/admin/master/subjects')}>Mata Pelajaran</span>
            <CaretRight size={12} className="mx-2" />
            <span className="text-primary-600 font-medium">Detail Mata Pelajaran</span>
        </div>
      </div>

      {/* Main Content Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">Detail Mata Pelajaran</h2>
          <p className="text-sm text-neutral-500">Informasi lengkap data mata pelajaran</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            subjectData.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
          }`}>
            {subjectData.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
          </span>
          <Button 
            variant="outline" 
            className="bg-neutral-100 hover:bg-neutral-200 border-none text-neutral-600"
            leftIcon={<ArrowLeft size={18} />}
            onClick={() => navigate('/admin/master/subjects')}
          >
            Kembali
          </Button>
          <Button 
            className="bg-primary-600 hover:bg-primary-700 text-white border-none shadow-md shadow-primary-200 bg-blue-600 text-white hover:bg-blue-700"
            leftIcon={<PencilSimple size={18} weight="bold" />}
            onClick={() => setIsEditModalOpen(true)}
          >
            Edit
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Subject Details */}
        <Card className="border-none shadow-sm bg-white rounded-xl">
          <CardBody className="p-6">
            <h3 className="text-lg font-bold text-neutral-900 mb-6 pb-4 border-b border-neutral-100">
              Kurikulum
            </h3>
            
            <div className="space-y-1">
              <InfoRow label="Nama Mapel" value={subjectData.name} />
              <InfoRow label="Kelompok Mapel" value={subjectData.category} />
              <InfoRow label="Kelas" value={subjectData.gradeLevel === '0' ? '-' : subjectData.gradeLevel} />
              <InfoRow label="Tipe Kurikulum" value={subjectData.curriculumType} />
              <InfoRow label="KKM Target" value={subjectData.kkm} />
              <InfoRow label="Materi" value={subjectData.material} />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Edit Modal */}
      <EditSubjectModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        subjectData={subjectData}
        onSave={handleSave}
      />
    </div>
  );
};

export default SubjectDetailPage;
