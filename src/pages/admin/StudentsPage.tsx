import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  MagnifyingGlass, 
  Funnel, 
  CaretUp, 
  CaretDown, 
  CaretLeft,
  CaretRight,
  List,
  ShieldCheck,
  Question
} from '@phosphor-icons/react';
import Card, { CardBody } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Switch from '@/components/ui/Switch';
import Checkbox from '@/components/ui/Checkbox';
import Modal from '@/components/ui/Modal';
import { useTenant } from '@/contexts/TenantContext';
import { studentApi } from '@/lib/api/services';
import type { Student } from '@/types';
import AddStudentModal from './students/components/AddStudentModal';

// Extended type for UI demo
interface StudentWithDetails extends Student {
  nisn: string;
  batch: string; // Angkatan
  className: string; // Kelas
}

const StudentsPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentSchool } = useTenant();
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState('10');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [localStatusUpdates, setLocalStatusUpdates] = useState<Record<string, string>>({});
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; studentId: string | null; currentStatus: string }>({
    isOpen: false,
    studentId: null,
    currentStatus: ''
  });
  
  // Filter states
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    batch: '',
    className: ''
  });

  const { data: studentsData, isLoading } = useQuery({
    queryKey: ['students', currentSchool?.id],
    queryFn: () => studentApi.getAll({ schoolId: currentSchool?.id, perPage: 100 }),
    enabled: !!currentSchool,
  });

  // Mock data enhancement
  const students: StudentWithDetails[] = (studentsData?.data || []).map((s, index) => {
    // Apply local status override if exists
    const currentStatus = localStatusUpdates[s.id] || s.status;
    
    return {
      ...s,
      status: currentStatus as 'active' | 'inactive' | 'graduated',
      nisn: `004738${2916 + index}`,
      batch: index % 2 === 0 ? '2024' : '2023',
      className: index % 3 === 0 ? '10 MIPA 1' : (index % 3 === 1 ? '11 IPS 2' : '12 MIPA 3'),
    };
  });

  // Derived filter options
  const uniqueBatches = Array.from(new Set(students.map(s => s.batch))).sort();
  const uniqueClasses = Array.from(new Set(students.map(s => s.className))).sort();

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.nisn.includes(searchTerm);
    
    const matchesStatus = filters.status ? student.status === filters.status : true;
    const matchesBatch = filters.batch ? student.batch === filters.batch : true;
    const matchesClass = filters.className ? student.className === filters.className : true;

    return matchesSearch && matchesStatus && matchesBatch && matchesClass;
  });

  const totalPages = Math.ceil(filteredStudents.length / parseInt(entriesPerPage));
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * parseInt(entriesPerPage),
    currentPage * parseInt(entriesPerPage)
  );

  const isAllSelected = paginatedStudents.length > 0 && paginatedStudents.every(s => selectedIds.has(s.id));

  const handleSelectAll = (checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) {
      paginatedStudents.forEach(s => newSelected.add(s.id));
    } else {
      paginatedStudents.forEach(s => newSelected.delete(s.id));
    }
    setSelectedIds(newSelected);
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedIds(newSelected);
  };

  const handleStatusToggle = (id: string, currentStatus: string) => {
    // Jika status saat ini aktif (mau dinonaktifkan), tampilkan konfirmasi
    if (currentStatus === 'active') {
      setConfirmDialog({
        isOpen: true,
        studentId: id,
        currentStatus: currentStatus
      });
    } else {
      // Jika mengaktifkan kembali, langsung eksekusi
      executeStatusChange(id, currentStatus);
    }
  };

  const executeStatusChange = (id: string, currentStatus: string) => {
    // Optimistic update
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    setLocalStatusUpdates(prev => ({
      ...prev,
      [id]: newStatus
    }));
    
    // Close dialog if open
    setConfirmDialog(prev => ({ ...prev, isOpen: false }));
  };

  const SortIcon = () => (
    <div className="flex flex-col ml-1 text-neutral-400">
      <CaretUp size={10} className="-mb-1" />
      <CaretDown size={10} />
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
            <ShieldCheck size={28} className="text-neutral-500" />
            <h1 className="text-2xl font-bold text-neutral-600">Autentikasi</h1>
        </div>
        <div className="flex items-center text-sm text-neutral-500">
            <span className="hover:text-blue-600 cursor-pointer">Dasbor</span>
            <CaretRight size={12} className="mx-2" />
            <span className="text-blue-600 font-medium">Siswa</span>
        </div>
      </div>

      <Card variant="elevated" className="border-none shadow-sm bg-white rounded-xl overflow-hidden">
        <CardBody className="p-6">
            {/* Card Header & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <h2 className="text-xl font-bold text-neutral-900">Siswa</h2>
                <div className="flex items-center gap-3 relative">
                  <div className="relative">
                    <Button 
                      variant="outline" 
                      className={`text-white bg-[#2563EB] hover:bg-blue-700 border-none px-4 font-medium h-10 ${isFilterOpen ? 'ring-2 ring-blue-300' : ''}`}
                      onClick={() => setIsFilterOpen(!isFilterOpen)}
                    >
                      <Funnel size={20} className="mr-2" />
                      Filter
                    </Button>

                    {isFilterOpen && (
                      <div className="absolute top-12 right-0 z-20 w-72 bg-white rounded-xl shadow-xl border border-neutral-200 p-4 animate-in fade-in slide-in-from-top-2">
                        <div className="space-y-4">
                          <div>
                            <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5 block">Status</label>
                            <Select
                              value={filters.status}
                              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                              options={[
                                { value: '', label: 'Semua Status' },
                                { value: 'active', label: 'Aktif' },
                                { value: 'inactive', label: 'Tidak Aktif' },
                                { value: 'graduated', label: 'Lulus' },
                              ]}
                              className="w-full"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5 block">Angkatan</label>
                            <Select
                              value={filters.batch}
                              onChange={(e) => setFilters(prev => ({ ...prev, batch: e.target.value }))}
                              options={[
                                { value: '', label: 'Semua Angkatan' },
                                ...uniqueBatches.map(b => ({ value: b, label: b }))
                              ]}
                              className="w-full"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5 block">Kelas</label>
                            <Select
                              value={filters.className}
                              onChange={(e) => setFilters(prev => ({ ...prev, className: e.target.value }))}
                              options={[
                                { value: '', label: 'Semua Kelas' },
                                ...uniqueClasses.map(c => ({ value: c, label: c }))
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
                                setFilters({ status: '', batch: '', className: '' });
                                setIsFilterOpen(false);
                              }}
                            >
                              Reset
                            </Button>
                            <Button 
                              size="sm"
                              className="bg-[#2563EB] text-white hover:bg-blue-700 h-8 px-4"
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
                    leftIcon={<Plus size={20} weight="bold" />} 
                    onClick={() => setIsAddModalOpen(true)} 
                    className="bg-[#2563EB] hover:bg-blue-700 text-white px-4 font-medium h-10 border-none"
                  >
                    Tambah Siswa
                  </Button>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <Select 
                        options={[
                            { value: '10', label: '10' },
                            { value: '25', label: '25' },
                            { value: '50', label: '50' },
                        ]}
                        value={entriesPerPage}
                        onChange={(e) => setEntriesPerPage(e.target.value)}
                        className="w-[70px] h-10 rounded-lg border-neutral-300"
                    />
                    <span className="text-sm text-neutral-500">jumlah entri per halaman</span>
                </div>
                <div className="w-full sm:w-72">
                    <Input
                        placeholder="Cari Siswa..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        leftIcon={<MagnifyingGlass size={20} className="text-neutral-400" />}
                        className="h-10 border-neutral-300"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-lg border border-neutral-200 mb-6">
              <table className="w-full min-w-[900px]">
                <thead className="bg-neutral-100">
                  <tr className="border-b border-neutral-200 text-left">
                    <th className="px-4 py-4 w-12 text-center">
                        <Checkbox 
                            checked={isAllSelected}
                            onChange={(e) => handleSelectAll(e.target.checked)}
                        />
                    </th>
                    <th className="px-4 py-3 text-sm font-bold text-neutral-800">
                        <div className="flex items-center gap-1 cursor-pointer hover:text-blue-600">
                            No <SortIcon />
                        </div>
                    </th>
                    <th className="px-4 py-3 text-sm font-bold text-neutral-800">
                        <div className="flex items-center gap-1 cursor-pointer hover:text-blue-600">
                            NISN <SortIcon />
                        </div>
                    </th>
                    <th className="px-4 py-3 text-sm font-bold text-neutral-800">
                        <div className="flex items-center gap-1 cursor-pointer hover:text-blue-600">
                            Nama <SortIcon />
                        </div>
                    </th>
                    <th className="px-4 py-3 text-sm font-bold text-neutral-800">
                        <div className="flex items-center gap-1 cursor-pointer hover:text-blue-600">
                            Angkatan <SortIcon />
                        </div>
                    </th>
                    <th className="px-4 py-3 text-sm font-bold text-neutral-800">
                        <div className="flex items-center gap-1 cursor-pointer hover:text-blue-600">
                            Kelas <SortIcon />
                        </div>
                    </th>
                    <th className="px-4 py-3 text-sm font-bold text-neutral-800">
                        <div className="flex items-center gap-1 cursor-pointer hover:text-blue-600">
                            Status <SortIcon />
                        </div>
                    </th>
                    <th className="px-4 py-3 text-sm font-bold text-neutral-800">
                        <div className="flex items-center gap-1 cursor-pointer hover:text-blue-600">
                            Aksi <SortIcon />
                        </div>
                    </th>
                    <th className="px-4 py-3 text-sm font-bold text-neutral-800">
                        <div className="flex items-center gap-1 cursor-pointer hover:text-blue-600">
                            Aktif <SortIcon />
                        </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {isLoading ? (
                     <tr>
                        <td colSpan={9} className="px-4 py-12 text-center">
                           <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                        </td>
                     </tr>
                  ) : paginatedStudents.map((student, index) => (
                    <tr key={student.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-4 py-4 text-center">
                        <Checkbox 
                            checked={selectedIds.has(student.id)}
                            onChange={(e) => handleSelectOne(student.id, e.target.checked)}
                        />
                      </td>
                      <td className="px-4 py-4 text-sm text-neutral-600 font-medium">
                        {(currentPage - 1) * parseInt(entriesPerPage) + index + 1}
                      </td>
                      <td className="px-4 py-4 text-sm text-neutral-600">{student.nisn}</td>
                      <td className="px-4 py-4 text-sm text-neutral-900 font-medium">{student.name}</td>
                      <td className="px-4 py-4 text-sm text-neutral-600">{student.batch}</td>
                      <td className="px-4 py-4 text-sm text-neutral-600">{student.className}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          student.status === 'active' 
                            ? 'bg-emerald-100 text-emerald-700'
                            : student.status === 'graduated'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-red-100 text-red-700'
                        }`}>
                          {student.status === 'active' ? 'Aktif' : (student.status === 'graduated' ? 'Lulus' : 'Tidak Aktif')}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <Button 
                            size="sm" 
                            className="h-8 px-4 text-xs bg-[#2563EB] hover:bg-blue-700 text-white font-medium rounded-md shadow-sm shadow-blue-200" 
                            onClick={() => navigate(`/admin/students/${student.id}`)}
                        >
                            <List size={16} weight="bold" className="mr-2" />
                            Detail
                        </Button>
                      </td>
                      <td className="px-4 py-4">
                        <Switch 
                            checked={student.status === 'active'}
                            onChange={() => handleStatusToggle(student.id, student.status)}
                            className="data-[state=checked]:bg-[#2563EB]"
                        />
                      </td>
                    </tr>
                  ))}
                  {!isLoading && filteredStudents.length === 0 && (
                     <tr>
                        <td colSpan={9} className="px-4 py-12 text-center text-neutral-500">
                           {searchTerm ? 'Tidak ada siswa yang cocok dengan pencarian' : 'Belum ada data siswa'}
                        </td>
                     </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <p className="text-sm text-neutral-500">
                    Showing <span className="font-medium text-neutral-900">{(currentPage - 1) * parseInt(entriesPerPage) + 1}</span> to <span className="font-medium text-neutral-900">{Math.min(currentPage * parseInt(entriesPerPage), filteredStudents.length)}</span> of <span className="font-medium text-neutral-900">{filteredStudents.length}</span> entries
                </p>
                
                <div className="flex items-center bg-white border border-neutral-200 rounded-lg overflow-hidden">
                    <button 
                        className="px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50 disabled:opacity-50 border-r border-neutral-200 flex items-center gap-2 transition-colors"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                    >
                        <CaretLeft size={16} />
                        Previous
                    </button>
                    <div className="flex items-center px-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-all mx-0.5 ${
                                    currentPage === page 
                                        ? 'bg-[#2563EB] text-white shadow-sm' 
                                        : 'text-neutral-600 hover:bg-neutral-100'
                                }`}
                                onClick={() => setCurrentPage(page)}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                    <button 
                        className="px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50 disabled:opacity-50 border-l border-neutral-200 flex items-center gap-2 transition-colors"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                        <CaretRight size={16} />
                    </button>
                </div>
            </div>
        </CardBody>
      </Card>

      <AddStudentModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />

      <Modal
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        size="sm"
        className="p-0 overflow-hidden"
      >
        <div className="flex flex-col items-center justify-center text-center pt-8 pb-6 px-6">
          <div className="w-20 h-20 bg-[#3B82F6] rounded-full flex items-center justify-center mb-6 shadow-lg shadow-blue-100">
             <div className="bg-white rounded-xl p-2 shadow-sm">
                <Question size={32} weight="bold" className="text-[#3B82F6]" />
             </div>
          </div>

          <h3 className="text-xl font-bold text-neutral-900 mb-2">Apakah Anda Yakin?</h3>
          <p className="text-neutral-500 text-center mb-8 text-sm leading-relaxed max-w-[280px]">
            Siswa akan dinonaktifkan dan tidak dapat mengakses sistem sampai status diubah kembali.
          </p>

          <div className="flex items-center gap-3 w-full">
            <Button
              variant="ghost"
              className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 h-11 font-semibold rounded-lg"
              onClick={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
            >
              Batal
            </Button>
            <Button
              className="flex-1 bg-[#2563EB] hover:bg-blue-700 text-white h-11 font-semibold rounded-lg shadow-md shadow-blue-200"
              onClick={() => {
                if (confirmDialog.studentId) {
                  executeStatusChange(confirmDialog.studentId, confirmDialog.currentStatus);
                }
              }}
            >
              Iya
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StudentsPage;
