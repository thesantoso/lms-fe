import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Switch from '@/components/ui/Switch';
import { ArrowLeft, FloppyDisk } from '@phosphor-icons/react';
import { mockTeachers } from '@/lib/api/mock';

export const SCHEDULE_SUBJECTS = [
  'Matematika',
  'Bahasa Indonesia',
  'Bahasa Inggris',
  'Fisika',
  'Kimia',
  'Biologi',
  'Sejarah',
  'Geografi',
  'Pendidikan Agama',
];

export const SCHEDULE_LOCATIONS = [
  'XI-A',
  'XI-B',
  'Lab Fisika',
  'Lab Komputer',
  'Perpustakaan',
  'Lapangan',
];

export const ACADEMIC_YEARS = [
  '2024/2025',
  '2025/2026',
  '2026/2027',
];

interface AddScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: any) => void;
}

const emptyForm = {
  teacherId: '',
  location: '',
  subject: '',
  academicYear: '',
  date: '',
  startTime: '',
  endTime: '',
  isActive: true,
};

const AddScheduleModal: React.FC<AddScheduleModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState(emptyForm);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.teacherId || !formData.location || !formData.subject || !formData.academicYear) {
      alert('Mohon lengkapi semua data wajib');
      return;
    }
    if (onSave) onSave(formData);
    setFormData(emptyForm);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tambah Jadwal" size="lg">
      <div className="max-h-[80vh] overflow-y-auto pr-2">
        <p className="text-sm text-neutral-500 mb-6">Lengkapi data jadwal secara bertahap</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Guru Mapel <span className="text-red-500">*</span>
              </label>
              <Select
                options={[{ value: '', label: 'Pilih guru...' }, ...mockTeachers.map(t => ({ value: t.id, label: t.name }))]}
                value={formData.teacherId}
                onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Lokasi Pembelajaran <span className="text-red-500">*</span>
              </label>
              <Select
                options={[{ value: '', label: 'Pilih lokasi pembelajaran...' }, ...SCHEDULE_LOCATIONS.map(l => ({ value: l, label: l }))]}
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Mata Pelajaran <span className="text-red-500">*</span>
              </label>
              <Select
                options={[{ value: '', label: 'Pilih mata pelajaran...' }, ...SCHEDULE_SUBJECTS.map(s => ({ value: s, label: s }))]}
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Tahun Ajaran <span className="text-red-500">*</span>
              </label>
              <Select
                options={[{ value: '', label: 'Pilih tahun ajaran...' }, ...ACADEMIC_YEARS.map(y => ({ value: y, label: y }))]}
                value={formData.academicYear}
                onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                className="w-full"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Tanggal Pembelajaran <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Jam Mulai <span className="text-red-500">*</span>
              </label>
              <Input
                type="time"
                min="06:00"
                max="18:00"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Jam Selesai <span className="text-red-500">*</span>
              </label>
              <Input
                type="time"
                min="06:00"
                max="18:00"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Switch
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            />
            <span className="text-sm font-medium text-neutral-700">Status Aktif <span className="text-red-500">*</span></span>
          </div>

          <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row justify-between gap-3">
            <Button
              type="button"
              variant="ghost"
              className="bg-[#E1E1E1] hover:bg-[#D5D5D5] text-[#8E8E8E] font-medium px-6 w-full sm:w-auto"
              onClick={onClose}
            >
              <ArrowLeft size={16} className="mr-2" />
              Kembali
            </Button>
            <Button
              type="submit"
              className="bg-[#1854F6] hover:bg-[#0C3FD6] text-white font-medium px-6 w-full sm:w-auto"
            >
              <FloppyDisk size={16} className="mr-2" />
              Simpan
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddScheduleModal;
