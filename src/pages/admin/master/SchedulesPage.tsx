import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Funnel,
  CaretRight,
  ArrowRight,
  CalendarCheck
} from '@phosphor-icons/react';
import Card, { CardBody } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import AddScheduleModal from './components/AddScheduleModal';

// Mock data per design Figma (Auth Jadwal):
// Kelas X (115), XI (113), XII (117) — masing-masing rombel dengan wali kelas & jumlah siswa
export const MOCK_SCHEDULE_GROUPS = [
  {
    id: 'kelas-x',
    grade: 'X',
    total: 115,
    classes: [
      { id: 'x-ipa-1', name: 'X IPA 1', homeroomTeacher: 'Dra. Siti Nurhaliza', studentCount: 32 },
      { id: 'x-ipa-2', name: 'X IPA 2', homeroomTeacher: 'Dr. Ahmad Fauzi', studentCount: 30 },
      { id: 'x-ips-1', name: 'X IPS 1', homeroomTeacher: 'S.Pd. Maria Dewi', studentCount: 28 },
      { id: 'x-bahasa', name: 'X Bahasa', homeroomTeacher: 'M.Pd. Rina Sari', studentCount: 25 },
    ],
  },
  {
    id: 'kelas-xi',
    grade: 'XI',
    total: 113,
    classes: [
      { id: 'xi-ipa-1', name: 'XI IPA 1', homeroomTeacher: 'Dr. Budi Santoso', studentCount: 29 },
      { id: 'xi-ipa-2', name: 'XI IPA 2', homeroomTeacher: 'S.Si. Lisa Permata', studentCount: 31 },
      { id: 'xi-ips-1', name: 'XI IPS 1', homeroomTeacher: 'M.A. Hendra Wijaya', studentCount: 27 },
      { id: 'xi-ips-2', name: 'XI IPS 2', homeroomTeacher: 'S.Sos. Nina Kartika', studentCount: 26 },
    ],
  },
  {
    id: 'kelas-xii',
    grade: 'XII',
    total: 117,
    classes: [
      { id: 'xii-ipa-1', name: 'XII IPA 1', homeroomTeacher: 'Prof. Dr. Agus Setiawan', studentCount: 33 },
      { id: 'xii-ipa-2', name: 'XII IPA 2', homeroomTeacher: 'M.Sc. Dewi Lestari', studentCount: 28 },
      { id: 'xii-ips-1', name: 'XII IPS 1', homeroomTeacher: 'S.E. Rudi Hartono', studentCount: 32 },
      { id: 'xii-bahasa', name: 'XII Bahasa', homeroomTeacher: 'M.Hum. Sari Indah', studentCount: 24 },
    ],
  },
];

const SchedulesPage: React.FC = () => {
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterGrade, setFilterGrade] = useState('');

  const groups = filterGrade
    ? MOCK_SCHEDULE_GROUPS.filter((g) => g.grade === filterGrade)
    : MOCK_SCHEDULE_GROUPS;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <CalendarCheck size={28} className="text-neutral-500" />
          <h1 className="text-2xl font-bold text-neutral-600">Master Data</h1>
        </div>
        <div className="flex items-center text-sm text-neutral-500">
          <span className="hover:text-[#3E80F9] cursor-pointer">Dasbor</span>
          <CaretRight size={12} className="mx-2" />
          <span className="hover:text-[#3E80F9] cursor-pointer">Master Data</span>
          <CaretRight size={12} className="mx-2" />
          <span className="text-[#3E80F9] font-medium">Jadwal</span>
        </div>
      </div>

      <Card variant="elevated" className="border-none shadow-sm bg-white rounded-xl overflow-hidden">
        <CardBody className="p-6">
          {/* Card Header & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold text-neutral-900">Jadwal</h2>
            <div className="flex items-center gap-3 relative">
              <div className="relative">
                <Button
                  variant="primary"
                  className={`h-10 bg-[#3E80F9] hover:bg-[#2E6EF7] ${isFilterOpen ? 'ring-2 ring-[#9DB8F9]' : ''}`}
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                  <Funnel size={20} weight="bold" className="mr-2" />
                  Filter
                </Button>

                {isFilterOpen && (
                  <div className="absolute top-12 right-0 z-20 w-72 bg-white rounded-xl shadow-xl border border-neutral-200 p-4 animate-in fade-in slide-in-from-top-2">
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5 block">Angkatan</label>
                        <Select
                          value={filterGrade}
                          onChange={(e) => setFilterGrade(e.target.value)}
                          options={[
                            { value: '', label: 'Semua Angkatan' },
                            { value: 'X', label: 'Kelas X' },
                            { value: 'XI', label: 'Kelas XI' },
                            { value: 'XII', label: 'Kelas XII' },
                          ]}
                          className="w-full"
                        />
                      </div>
                      <div className="pt-3 border-t border-neutral-100 flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-neutral-500 hover:text-neutral-700 h-8"
                          onClick={() => {
                            setFilterGrade('');
                            setIsFilterOpen(false);
                          }}
                        >
                          Reset
                        </Button>
                        <Button
                          size="sm"
                          className="bg-[#3E80F9] hover:bg-[#2E6EF7] text-white h-8 px-4"
                          onClick={() => setIsFilterOpen(false)}
                        >
                          Terapkan
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Button
                variant="primary"
                className="h-10 bg-[#3E80F9] hover:bg-[#2E6EF7]"
                onClick={() => setIsAddModalOpen(true)}
              >
                <Plus size={20} weight="bold" className="mr-2" />
                Tambah Jadwal
              </Button>
            </div>
          </div>

          {/* Class Groups Grid */}
          {groups.length === 0 ? (
            <div className="text-center py-16 text-neutral-500">
              Tidak ada jadwal untuk angkatan yang dipilih
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {groups.map((group) => (
                <div
                  key={group.id}
                  className="border border-[#E5E7EB] rounded-xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden"
                >
                  {/* Group header */}
                  <div className="flex items-center justify-between px-6 pt-5 pb-4">
                    <h3 className="text-xl font-bold text-neutral-800">Kelas {group.grade}</h3>
                    <span className="px-2.5 py-1 rounded-full bg-[#ECF2FE] text-[#1854F6] text-xs font-semibold">
                      {group.classes.length} Rombel
                    </span>
                  </div>

                  {/* Classes list */}
                  <div className="px-5 space-y-3">
                    {group.classes.map((rombel) => (
                      <button
                        key={rombel.id}
                        onClick={() => navigate(`/admin/master/schedules/${rombel.id}`)}
                        className="w-full text-left border border-[#E5E7EB] rounded-xl p-4 transition-colors hover:border-[#BBD0FF] hover:bg-[#F2F9FF] group"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-base font-bold text-neutral-900">{rombel.name}</span>
                          <ArrowRight size={16} className="text-neutral-300 group-hover:text-[#3E80F9] transition-colors" />
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-neutral-600">
                          <span className="text-neutral-400">Wali Kelas:</span>
                          <span className="font-medium text-neutral-800">{rombel.homeroomTeacher}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-neutral-600">
                          <span className="text-neutral-400">Jumlah:</span>
                          <span className="font-medium text-neutral-800">{rombel.studentCount} Siswa</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Group footer */}
                  <div className="mt-4 px-5 py-3 border-t border-neutral-200 flex items-center justify-between">
                    <span className="text-sm text-neutral-500">Total Siswa</span>
                    <span className="text-lg font-bold text-[#222222]">{group.total} Siswa</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      <AddScheduleModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};

export default SchedulesPage;