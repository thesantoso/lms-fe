import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Plus,
  MagnifyingGlass,
  Trash,
  CaretUp,
  CaretDown,
  CaretLeft,
  CaretRight,
  PencilSimple,
  LockKey,
} from '@phosphor-icons/react';
import Card, { CardBody } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Checkbox from '@/components/ui/Checkbox';
import Modal from '@/components/ui/Modal';
import ModalUser from '@/components/authz/ModalUser';
import { authzApi } from '@/lib/api/services';
import type { AuthGroup, AuthUser } from '@/types';

type ModalMode = 'create' | 'edit';

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [groups, setGroups] = useState<AuthGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState('10');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [modal, setModal] = useState<{ open: boolean; mode: ModalMode; user: AuthUser | null }>({
    open: false,
    mode: 'create',
    user: null,
  });
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; ids: string[] }>({
    open: false,
    ids: [],
  });
  const [notice, setNotice] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [u, g] = await Promise.all([authzApi.getUsers(), authzApi.getGroups()]);
      setUsers(u);
      setGroups(g);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(
    () =>
      users.filter(
        (u) =>
          u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          `${u.first_name} ${u.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [users, searchTerm],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / parseInt(entriesPerPage)));
  const paginated = filtered.slice(
    (currentPage - 1) * parseInt(entriesPerPage),
    currentPage * parseInt(entriesPerPage),
  );
  const isAllSelected = paginated.length > 0 && paginated.every((u) => selectedIds.has(u.id));

  const toggleSelectAll = (checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      paginated.forEach((u) => (checked ? next.add(u.id) : next.delete(u.id)));
      return next;
    });
  };
  const toggleSelectOne = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      checked ? next.add(id) : next.delete(id);
      return next;
    });
  };

  const groupNames = (ids: string[]) =>
    ids.map((id) => groups.find((g) => g.id === id)?.name).filter(Boolean).join(', ') || '-';

  const openCreate = () => {
    setModal({ open: true, mode: 'create', user: null });
  };
  const openEdit = (user: AuthUser) => {
    setModal({ open: true, mode: 'edit', user });
  };

  const handleSave = async (data: Omit<AuthUser, 'id'> & { id?: string }) => {
    setSaving(true);
    try {
      if (data.id) await authzApi.updateUser(data.id, data);
      else await authzApi.createUser(data);
      await load();
      setModal((m) => ({ ...m, open: false }));
      setNotice(data.id ? 'User berhasil diperbarui!' : 'User berhasil dibuat!');
    } finally {
      setSaving(false);
    }
  };

  const removeUsers = async (ids: string[]) => {
    setLoading(true);
    try {
      await Promise.all(ids.map((id) => authzApi.deleteUser(id)));
      await load();
      setSelectedIds(new Set());
      setConfirmDialog({ open: false, ids: [] });
      setNotice(`${ids.length} user berhasil dihapus!`);
    } finally {
      setLoading(false);
    }
  };

  const SortIcon = () => (
    <span className="flex flex-col ml-1 text-neutral-400">
      <CaretUp size={10} className="-mb-1" />
      <CaretDown size={10} />
    </span>
  );

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(''), 3000);
    return () => clearTimeout(t);
  }, [notice]);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <LockKey size={28} className="text-neutral-500" />
          <h1 className="text-2xl font-bold text-neutral-600">Autentikasi & Otorisasi</h1>
        </div>
        <div className="flex items-center text-sm text-neutral-500">
          <span className="hover:text-blue-600 cursor-pointer">Dasbor</span>
          <CaretRight size={12} className="mx-2" />
          <span className="hover:text-blue-600 cursor-pointer">Autentikasi & Otorisasi</span>
          <CaretRight size={12} className="mx-2" />
          <span className="text-blue-600 font-medium">User</span>
        </div>
      </div>

      {notice && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-lg px-4 py-3">
          {notice}
        </div>
      )}

      <Card variant="elevated" className="border-none shadow-sm bg-white rounded-xl overflow-hidden">
        <CardBody className="p-6">
          {/* Header & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold text-neutral-900">User</h2>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="text-red-600 bg-red-50 hover:bg-red-100 border-red-200 px-4 font-medium h-10"
                onClick={() => {
                  if (selectedIds.size === 0) return;
                  setConfirmDialog({ open: true, ids: Array.from(selectedIds) });
                }}
                disabled={selectedIds.size === 0 || loading}
              >
                <Trash size={20} className="mr-2" />
                Hapus
              </Button>
              <Button
                className="bg-[#2563EB] hover:bg-blue-700 text-white px-4 font-medium h-10 border-none"
                onClick={openCreate}
              >
                <Plus size={20} weight="bold" className="mr-2" />
                Tambah User
              </Button>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <Select
                options={[
                  { value: '5', label: '5' },
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
                placeholder="Cari user..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                leftIcon={<MagnifyingGlass size={20} className="text-neutral-400" />}
                className="h-10 border-neutral-300"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-lg border border-neutral-200 mb-6">
            <table className="w-full min-w-[860px]">
              <thead className="bg-neutral-100">
                <tr className="border-b border-neutral-200 text-left">
                  <th className="px-4 py-4 w-12 text-center">
                    <Checkbox checked={isAllSelected} onChange={(e) => toggleSelectAll(e.target.checked)} />
                  </th>
                  <th className="px-4 py-3 text-sm font-bold text-neutral-800">
                    <span className="flex items-center gap-1 cursor-pointer hover:text-blue-600">Username <SortIcon /></span>
                  </th>
                  <th className="px-4 py-3 text-sm font-bold text-neutral-800">
                    <span className="flex items-center gap-1 cursor-pointer hover:text-blue-600">Email <SortIcon /></span>
                  </th>
                  <th className="px-4 py-3 text-sm font-bold text-neutral-800">
                    <span className="flex items-center gap-1 cursor-pointer hover:text-blue-600">Nama User <SortIcon /></span>
                  </th>
                  <th className="px-4 py-3 text-sm font-bold text-neutral-800">
                    <span className="flex items-center gap-1 cursor-pointer hover:text-blue-600">Group <SortIcon /></span>
                  </th>
                  <th className="px-4 py-3 text-sm font-bold text-neutral-800">
                    <span className="flex items-center gap-1 cursor-pointer hover:text-blue-600">Aksi <SortIcon /></span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
                    </td>
                  </tr>
                ) : paginated.map((user) => (
                  <tr key={user.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-4 py-4 text-center">
                      <Checkbox
                        checked={selectedIds.has(user.id)}
                        onChange={(e) => toggleSelectOne(user.id, e.target.checked)}
                      />
                    </td>
                    <td className="px-4 py-4 text-sm text-neutral-600 font-medium">
                      <span className="flex items-center gap-2">
                        {user.username}
                        {user.roles.length === 0 && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-100 text-red-700 font-semibold">Tanpa group</span>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-neutral-600">{user.email}</td>
                    <td className="px-4 py-4 text-sm text-neutral-900 font-medium">
                      {user.first_name} {user.last_name}
                    </td>
                    <td className="px-4 py-4 text-sm text-neutral-600 max-w-[220px] truncate">{groupNames(user.roles)}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 px-3 text-xs text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-md"
                          onClick={() => openEdit(user)}
                        >
                          <PencilSimple size={14} weight="bold" className="mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          className="h-8 px-3 text-xs text-white bg-red-500 hover:bg-red-600 rounded-md"
                          onClick={() => setConfirmDialog({ open: true, ids: [user.id] })}
                        >
                          <Trash size={14} weight="bold" className="mr-1" />
                          Hapus
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-neutral-500">
                      {searchTerm ? 'Tidak ada user yang cocok dengan pencarian' : 'Belum ada data user'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <p className="text-sm text-neutral-500">
              Menampilkan{' '}
              <span className="font-medium text-neutral-900">
                {filtered.length === 0 ? 0 : (currentPage - 1) * parseInt(entriesPerPage) + 1}
              </span>{' '}
              hingga{' '}
              <span className="font-medium text-neutral-900">
                {Math.min(currentPage * parseInt(entriesPerPage), filtered.length)}
              </span>{' '}
              dari <span className="font-medium text-neutral-900">{filtered.length}</span> user
            </p>
            <div className="flex items-center bg-white border border-neutral-200 rounded-lg overflow-hidden">
              <button
                className="px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50 disabled:opacity-50 border-r border-neutral-200 flex items-center gap-2 transition-colors"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <CaretLeft size={16} />
                Previous
              </button>
              <div className="flex items-center px-1">
                {totalPages <= 5
                  ? Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-all mx-0.5 ${
                          currentPage === page ? 'bg-[#2563EB] text-white shadow-sm' : 'text-neutral-600 hover:bg-neutral-100'
                        }`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    ))
                  : currentPage}
              </div>
              <button
                className="px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50 disabled:opacity-50 border-l border-neutral-200 flex items-center gap-2 transition-colors"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
                <CaretRight size={16} />
              </button>
            </div>
          </div>
        </CardBody>
      </Card>

      {modal.open && (
        <ModalUser
          mode={modal.mode}
          user={modal.user}
          groups={groups}
          loading={saving}
          onClose={() => setModal((m) => ({ ...m, open: false }))}
          onSave={handleSave}
        />
      )}

      {/* Confirm delete */}
      <Modal
        isOpen={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, ids: [] })}
        size="sm"
      >
        <div className="flex flex-col items-center text-center py-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Trash size={32} weight="bold" className="text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-neutral-900 mb-2">Apakah Anda Yakin?</h3>
          <p className="text-neutral-500 text-sm mb-6">
            {confirmDialog.ids.length > 1
              ? `${confirmDialog.ids.length} user akan dihapus.`
              : 'User akan dihapus dan tidak dapat mengakses sistem.'}
          </p>
          <div className="flex items-center gap-3 w-full">
            <Button
              variant="ghost"
              className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 h-11 font-semibold rounded-lg"
              onClick={() => setConfirmDialog({ open: false, ids: [] })}
            >
              Batal
            </Button>
            <Button
              className="flex-1 bg-red-500 hover:bg-red-600 text-white h-11 font-semibold rounded-lg"
              onClick={() => removeUsers(confirmDialog.ids)}
            >
              Hapus
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UsersPage;