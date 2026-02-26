import React, { useState } from 'react';
import { 
  Plus, 
  MagnifyingGlass, 
  Funnel, 
  CaretUp, 
  CaretDown, 
  CaretLeft,
  CaretRight,
  List,
  BookBookmark
} from '@phosphor-icons/react';
import Card, { CardBody } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Switch from '@/components/ui/Switch';
import Checkbox from '@/components/ui/Checkbox';
import Modal from '@/components/ui/Modal';

// Mock data for Subjects
const MOCK_SUBJECTS = Array.from({ length: 21 }).map((_, index) => ({
  id: `${index + 1}`,
  code: `MP${100 + index}`,
  name: index % 3 === 0 ? 'Matematika Wajib' : (index % 3 === 1 ? 'Bahasa Indonesia' : 'Fisika'),
  category: index % 3 === 0 ? 'Wajib' : (index % 3 === 1 ? 'Wajib' : 'Peminatan'),
  level: index % 2 === 0 ? '10' : '11',
  teachersCount: 2 + (index % 3),
  status: index % 10 === 0 ? 'inactive' : 'active',
}));

const SubjectsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState('10');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    level: ''
  });
  
  const [subjectsList, setSubjectsList] = useState(MOCK_SUBJECTS);
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; subjectId: string | null; currentStatus: string }>({
    isOpen: false,
    subjectId: null,
    currentStatus: ''
  });

  // Derived filter options
  const uniqueCategories = Array.from(new Set(MOCK_SUBJECTS.map(s => s.category))).sort();
  const uniqueLevels = Array.from(new Set(MOCK_SUBJECTS.map(s => s.level))).sort();

  const filteredSubjects = subjectsList.filter(subj => {
    const matchesSearch = subj.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subj.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filters.status ? subj.status === filters.status : true;
    const matchesCategory = filters.category ? subj.category === filters.category : true;
    const matchesLevel = filters.level ? subj.level === filters.level : true;

    return matchesSearch && matchesStatus && matchesCategory && matchesLevel;
  });

  const totalPages = Math.ceil(filteredSubjects.length / parseInt(entriesPerPage));
  const paginatedSubjects = filteredSubjects.slice(
    (currentPage - 1) * parseInt(entriesPerPage),
    currentPage * parseInt(entriesPerPage)
  );

  const isAllSelected = paginatedSubjects.length > 0 && paginatedSubjects.every(s => selectedIds.has(s.id));

  const handleSelectAll = (checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) {
      paginatedSubjects.forEach(s => newSelected.add(s.id));
    } else {
      paginatedSubjects.forEach(s => newSelected.delete(s.id));
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
    if (currentStatus === 'active') {
      setConfirmDialog({
        isOpen: true,
        subjectId: id,
        currentStatus: currentStatus
      });
    } else {
      executeStatusChange(id, currentStatus);
    }
  };

  const executeStatusChange = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    setSubjectsList(prev => prev.map(subj => 
      subj.id === id ? { ...subj, status: newStatus } : subj
    ));
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
            <BookBookmark size={28} className="text-neutral-500" />
            <h1 className="text-2xl font-bold text-neutral-600">Master Data</h1>
        </div>
        <div className="flex items-center text-sm text-neutral-500">
            <span className="hover:text-primary-600 cursor-pointer">Dasbor</span>
            <CaretRight size={12} className="mx-2" />
            <span className="hover:text-primary-600 cursor-pointer">Master Data</span>
            <CaretRight size={12} className="mx-2" />
            <span className="text-primary-600 font-medium">Mata Pelajaran</span>
        </div>
      </div>

      <Card variant="elevated" className="border-none shadow-sm bg-white rounded-xl overflow-hidden">
        <CardBody className="p-6">
            {/* Card Header & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <h2 className="text-xl font-bold text-neutral-900">Data Mata Pelajaran</h2>
                <div className="flex items-center gap-3 relative">
                  <div className="relative">
                    <Button 
                      variant="outline" 
                      className={`text-white bg-primary-600 hover:bg-primary-700 border-none px-4 font-medium h-10 bg-blue-600 hover:bg-blue-700 ${isFilterOpen ? 'ring-2 ring-primary-300' : ''}`}
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
                              ]}
                              className="w-full"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5 block">Kategori</label>
                            <Select
                              value={filters.category}
                              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                              options={[
                                { value: '', label: 'Semua Kategori' },
                                ...uniqueCategories.map(c => ({ value: c, label: c }))
                              ]}
                              className="w-full"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1.5 block">Tingkat</label>
                            <Select
                              value={filters.level}
                              onChange={(e) => setFilters(prev => ({ ...prev, level: e.target.value }))}
                              options={[
                                { value: '', label: 'Semua Tingkat' },
                                ...uniqueLevels.map(l => ({ value: l, label: l }))
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
                                setFilters({ status: '', category: '', level: '' });
                                setIsFilterOpen(false);
                              }}
                            >
                              Reset
                            </Button>
                            <Button 
                              size="sm"
                              className="bg-primary-600 bg-blue-600 hover:bg-blue-700  text-white hover:bg-primary-700 h-8 px-4"
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
                    className="bg-primary-600 bg-blue-600 hover:bg-blue-700  hover:bg-primary-700 text-white px-4 font-medium h-10 border-none"
                    onClick={() => alert('Fitur tambah mapel akan segera hadir')}
                  >
                    Tambah Mapel
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
                        placeholder="Cari Mata Pelajaran..."
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
                        <div className="flex items-center gap-1 cursor-pointer hover:text-primary-600">
                            No <SortIcon />
                        </div>
                    </th>
                    <th className="px-4 py-3 text-sm font-bold text-neutral-800">
                        <div className="flex items-center gap-1 cursor-pointer hover:text-primary-600">
                            Kode <SortIcon />
                        </div>
                    </th>
                    <th className="px-4 py-3 text-sm font-bold text-neutral-800">
                        <div className="flex items-center gap-1 cursor-pointer hover:text-primary-600">
                            Nama Mata Pelajaran <SortIcon />
                        </div>
                    </th>
                    <th className="px-4 py-3 text-sm font-bold text-neutral-800">
                        <div className="flex items-center gap-1 cursor-pointer hover:text-primary-600">
                            Kategori <SortIcon />
                        </div>
                    </th>
                    <th className="px-4 py-3 text-sm font-bold text-neutral-800">
                        <div className="flex items-center gap-1 cursor-pointer hover:text-primary-600">
                            Tingkat <SortIcon />
                        </div>
                    </th>
                    <th className="px-4 py-3 text-sm font-bold text-neutral-800">
                        <div className="flex items-center gap-1 cursor-pointer hover:text-primary-600">
                            Jumlah Guru <SortIcon />
                        </div>
                    </th>
                    <th className="px-4 py-3 text-sm font-bold text-neutral-800">
                        <div className="flex items-center gap-1 cursor-pointer hover:text-primary-600">
                            Status <SortIcon />
                        </div>
                    </th>
                    <th className="px-4 py-3 text-sm font-bold text-neutral-800">
                        <div className="flex items-center gap-1 cursor-pointer hover:text-primary-600">
                            Aksi <SortIcon />
                        </div>
                    </th>
                    <th className="px-4 py-3 text-sm font-bold text-neutral-800">
                        <div className="flex items-center gap-1 cursor-pointer hover:text-primary-600">
                            Aktif <SortIcon />
                        </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {paginatedSubjects.map((subj, index) => (
                    <tr key={subj.id} className="hover:bg-primary-50/30 transition-colors">
                      <td className="px-4 py-4 text-center">
                        <Checkbox 
                            checked={selectedIds.has(subj.id)}
                            onChange={(e) => handleSelectOne(subj.id, e.target.checked)}
                        />
                      </td>
                      <td className="px-4 py-4 text-sm text-neutral-600 font-medium">
                        {(currentPage - 1) * parseInt(entriesPerPage) + index + 1}
                      </td>
                      <td className="px-4 py-4 text-sm text-neutral-600">{subj.code}</td>
                      <td className="px-4 py-4 text-sm text-neutral-900 font-medium">{subj.name}</td>
                      <td className="px-4 py-4 text-sm text-neutral-600">{subj.category}</td>
                      <td className="px-4 py-4 text-sm text-neutral-600">Kelas {subj.level}</td>
                      <td className="px-4 py-4 text-sm text-neutral-600">{subj.teachersCount} Guru</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          subj.status === 'active' 
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {subj.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <Button 
                            size="sm" 
                            className="h-8 px-4 text-xs bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md shadow-sm shadow-primary-200 bg-blue-600 hover:bg-blue-700 " 
                            onClick={() => alert('Detail mapel akan segera hadir')}
                        >
                            <List size={16} weight="bold" className="mr-2" />
                            Detail
                        </Button>
                      </td>
                      <td className="px-4 py-4">
                        <Switch 
                            checked={subj.status === 'active'}
                            onChange={() => handleStatusToggle(subj.id, subj.status)}
                            className="data-[state=checked]:bg-primary-600"
                        />
                      </td>
                    </tr>
                  ))}
                  {filteredSubjects.length === 0 && (
                     <tr>
                        <td colSpan={10} className="px-4 py-12 text-center text-neutral-500">
                           {searchTerm ? 'Tidak ada mata pelajaran yang cocok dengan pencarian' : 'Belum ada data mata pelajaran'}
                        </td>
                     </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <p className="text-sm text-neutral-500">
                    Showing <span className="font-medium text-neutral-900">{(currentPage - 1) * parseInt(entriesPerPage) + 1}</span> to <span className="font-medium text-neutral-900">{Math.min(currentPage * parseInt(entriesPerPage), filteredSubjects.length)}</span> of <span className="font-medium text-neutral-900">{filteredSubjects.length}</span> entries
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

      <Modal
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        size="sm"
        className="p-0 overflow-hidden"
      >
        <div className="flex flex-col items-center justify-center text-center pt-8 pb-6 px-6">
          <div className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-primary-100">
             <div className="bg-white rounded-xl p-2 shadow-sm">
                <BookBookmark size={32} weight="bold" className="text-primary-500" />
             </div>
          </div>

          <h3 className="text-xl font-bold text-neutral-900 mb-2">Konfirmasi Status</h3>
          <p className="text-neutral-500 text-center mb-8 text-sm leading-relaxed max-w-[280px]">
            Apakah Anda yakin ingin mengubah status mata pelajaran ini?
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
              className="flex-1 bg-primary-600 hover:bg-primary-700 text-white h-11 font-semibold rounded-lg shadow-md shadow-primary-200 bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                if (confirmDialog.subjectId) {
                  executeStatusChange(confirmDialog.subjectId, confirmDialog.currentStatus);
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

export default SubjectsPage;
