import React, { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';

interface EditSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  subjectData: any;
}

const EditSubjectModal: React.FC<EditSubjectModalProps> = ({ isOpen, onClose, onSave, subjectData }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    gradeLevel: '',
    curriculumType: '',
    kkm: '',
    material: '',
  });

  useEffect(() => {
    if (isOpen && subjectData) {
      setFormData({
        name: subjectData.name || '',
        category: subjectData.category || '',
        gradeLevel: subjectData.gradeLevel || '',
        curriculumType: subjectData.curriculumType || '',
        kkm: subjectData.kkm || '',
        material: subjectData.material || '',
      });
    }
  }, [isOpen, subjectData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Mata Pelajaran"
      size="lg"
    >
      <div className="max-h-[80vh] overflow-y-auto pr-0 sm:pr-2">
        <p className="text-sm text-neutral-500 mb-6">Perbarui data mata pelajaran</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nama Mapel"
              required
              placeholder="Nama mata pelajaran"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Kelompok Mapel <span className="text-red-500">*</span>
              </label>
              <Select
                options={[
                  { value: '', label: 'Pilih kelompok mapel...' },
                  { value: 'Wajib', label: 'Wajib' },
                  { value: 'Peminatan', label: 'Peminatan' },
                  { value: 'Muatan Lokal', label: 'Muatan Lokal' },
                ]}
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Kelas <span className="text-red-500">*</span>
              </label>
              <Select
                options={[
                  { value: '', label: 'Pilih kelas...' },
                  { value: '10', label: '10' },
                  { value: '11', label: '11' },
                  { value: '12', label: '12' },
                ]}
                value={formData.gradeLevel}
                onChange={(e) => setFormData({...formData, gradeLevel: e.target.value})}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Tipe Kurikulum <span className="text-red-500">*</span>
              </label>
              <Select
                options={[
                  { value: '', label: 'Pilih tipe pelajaran...' },
                  { value: 'Merdeka', label: 'Merdeka' },
                  { value: 'K13', label: 'K13' },
                  { value: 'Cambridge', label: 'Cambridge' },
                ]}
                value={formData.curriculumType}
                onChange={(e) => setFormData({...formData, curriculumType: e.target.value})}
                className="w-full"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="KKM Target"
              required
              type="number"
              placeholder="Contoh: 76"
              value={formData.kkm}
              onChange={(e) => setFormData({...formData, kkm: e.target.value})}
            />

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Materi <span className="text-red-500">*</span>
              </label>
              <Select
                options={[
                  { value: '', label: 'Pilih materi...' },
                  { value: 'Standard', label: 'Standard' },
                  { value: 'Advanced', label: 'Advanced' },
                ]}
                value={formData.material}
                onChange={(e) => setFormData({...formData, material: e.target.value})}
                className="w-full"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row sm:justify-end gap-3">
             <Button
               type="button"
               variant="ghost"
               className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium px-6 w-full sm:w-auto"
               onClick={onClose}
             >
               Batal
             </Button>
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 shadow-md shadow-blue-200 w-full sm:w-auto"
          >
            Simpan
          </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EditSubjectModal;
