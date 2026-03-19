import React, { useState, useMemo } from 'react';
import { X, MagnifyingGlass, Check } from '@phosphor-icons/react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { mockTeachers, mockStudents } from '@/lib/api/mock';

interface AddClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: any) => void;
}

const AddClassModal: React.FC<AddClassModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    homeroomTeacherId: '',
    gradeLevel: '',
    academicYear: '',
    quota: '',
  });
  
  const [selectedStudentIds, setSelectedStudentIds] = useState<Set<string>>(new Set());
  const [studentSearch, setStudentSearch] = useState('');

  // Derived data
  const teachers = mockTeachers.map(t => ({ value: t.id, label: t.name }));
  const students = mockStudents; // In real app, might need to filter available students

  const filteredStudents = useMemo(() => {
    return students.filter(s => 
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.id.includes(studentSearch)
    );
  }, [students, studentSearch]);

  const selectedStudents = useMemo(() => {
    return students.filter(s => selectedStudentIds.has(s.id));
  }, [students, selectedStudentIds]);

  const handleStudentToggle = (id: string) => {
    const newSelected = new Set(selectedStudentIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedStudentIds(newSelected);
  };

  const removeSelectedStudent = (id: string) => {
    const newSelected = new Set(selectedStudentIds);
    newSelected.delete(id);
    setSelectedStudentIds(newSelected);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate
    if (!formData.name || !formData.homeroomTeacherId || !formData.gradeLevel || !formData.academicYear || !formData.quota) {
      alert('Mohon lengkapi semua data wajib');
      return;
    }

    const data = {
      ...formData,
      students: Array.from(selectedStudentIds)
    };
    
    console.log('Saving class:', data);
    if (onSave) onSave(data);
    onClose();
    
    // Reset form
    setFormData({
      name: '',
      homeroomTeacherId: '',
      gradeLevel: '',
      academicYear: '',
      quota: '',
    });
    setSelectedStudentIds(new Set());
    setStudentSearch('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tambah Kelas"
      size="lg"
    >
      <div className="max-h-[80vh] overflow-y-auto pr-2">
        <p className="text-sm text-neutral-500 mb-6">Lengkapi data kelas secara bertahap</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nama Kelas"
              required
              placeholder="Contoh: 10-IPA-1"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Wali Kelas <span className="text-red-500">*</span>
              </label>
              <Select
                options={[{ value: '', label: 'Pilih wali kelas...' }, ...teachers]}
                value={formData.homeroomTeacherId}
                onChange={(e) => setFormData({...formData, homeroomTeacherId: e.target.value})}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Tingkat Kelas <span className="text-red-500">*</span>
              </label>
              <Select
                options={[
                  { value: '', label: 'Pilih tingkatan kelas...' },
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
                Tahun Ajaran <span className="text-red-500">*</span>
              </label>
              <Select
                options={[
                  { value: '', label: 'Pilih tahun ajaran...' },
                  { value: '2023/2024', label: '2023 / 2024' },
                  { value: '2024/2025', label: '2024 / 2025' },
                  { value: '2025/2026', label: '2025 / 2026' },
                ]}
                value={formData.academicYear}
                onChange={(e) => setFormData({...formData, academicYear: e.target.value})}
                className="w-full"
              />
            </div>
          </div>
          
          <Input
            label="Kuota Siswa"
            required
            type="number"
            placeholder="Contoh: 36"
            value={formData.quota}
            onChange={(e) => setFormData({...formData, quota: e.target.value})}
          />

          {/* Selected Students Chips */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Siswa Terpilih
            </label>
            <div className="bg-neutral-50 rounded-lg p-4 min-h-[60px] flex flex-wrap gap-2">
              {selectedStudents.length === 0 ? (
                <span className="text-sm text-neutral-400">Siswa belum dipilih</span>
              ) : (
                selectedStudents.map(student => (
                  <div key={student.id} className="flex items-center gap-1 bg-white border border-neutral-200 rounded-full pl-3 pr-1 py-1 shadow-sm">
                    <span className="text-xs font-medium text-neutral-700">{student.name}</span>
                    <button 
                      type="button"
                      onClick={() => removeSelectedStudent(student.id)}
                      className="p-0.5 hover:bg-neutral-100 rounded-full text-neutral-400 hover:text-red-500 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Student Selection List */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Siswa <span className="text-red-500">*</span>
            </label>
            <div className="border border-neutral-200 rounded-lg overflow-hidden">
              <div className="p-3 border-b border-neutral-200 bg-neutral-50">
                <Input
                  placeholder="Cari siswa..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  leftIcon={<MagnifyingGlass size={18} className="text-neutral-400" />}
                  className="bg-white h-9 text-sm"
                />
              </div>
              <div className="max-h-[240px] overflow-y-auto p-2 space-y-1">
                {filteredStudents.length === 0 ? (
                  <div className="py-8 text-center text-neutral-400 text-sm">Tidak ada siswa ditemukan</div>
                ) : (
                  filteredStudents.map(student => (
                    <div 
                      key={student.id}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedStudentIds.has(student.id) 
                          ? 'bg-primary-50 border border-primary-100' 
                          : 'hover:bg-neutral-50 border border-transparent'
                      }`}
                      onClick={() => handleStudentToggle(student.id)}
                    >
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                        selectedStudentIds.has(student.id)
                          ? 'bg-primary-600 border-primary-600 text-white'
                          : 'border-neutral-300 bg-white'
                      }`}>
                        {selectedStudentIds.has(student.id) && <Check size={12} weight="bold" />}
                      </div>
                      <div className="flex flex-col">
                        <span className={`text-sm font-medium ${selectedStudentIds.has(student.id) ? 'text-primary-900' : 'text-neutral-900'}`}>
                          {student.id} - {student.name}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row sm:justify-between gap-3">
             <Button
               type="button"
               variant="ghost"
               className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium px-6 w-full sm:w-auto"
               onClick={onClose}
             >
               Sebelumnya
             </Button>
             <Button
               type="submit"
               className="bg-primary-600 hover:bg-primary-700 text-white font-medium px-6 shadow-md shadow-primary-200 w-full sm:w-auto"
             >
               Simpan
             </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddClassModal;
