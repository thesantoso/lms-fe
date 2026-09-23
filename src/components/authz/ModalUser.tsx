import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Checkbox from '@/components/ui/Checkbox';
import type { AuthGroup, AuthUser } from '@/types';

interface ModalUserProps {
  mode: 'create' | 'edit';
  user?: AuthUser | null;
  groups: AuthGroup[];
  loading?: boolean;
  onClose: () => void;
  onSave: (data: Omit<AuthUser, 'id'> & { id?: string }) => void;
}

const isEmpty = (v?: string) => !v || !v.trim();
const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const ModalUser: React.FC<ModalUserProps> = ({
  mode,
  user,
  groups,
  loading,
  onClose,
  onSave,
}) => {
  const [form, setForm] = useState({
    username: user?.username || '',
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    password: '',
    password_confirmation: '',
    default_password: user?.default_password || false,
  });
  const [selectedRoles, setSelectedRoles] = useState<string[]>(user?.roles || []);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (field: string, value: string | boolean) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => {
      const next = { ...e };
      delete next[field];
      return next;
    });
  };

  const toggleRole = (groupId: string) => {
    setSelectedRoles((prev) =>
      prev.includes(groupId) ? prev.filter((r) => r !== groupId) : [...prev, groupId],
    );
    setErrors((e) => {
      const next = { ...e };
      delete next.roles;
      return next;
    });
  };

  const handleSave = () => {
    const errs: Record<string, string> = {};
    if (isEmpty(form.first_name)) errs.first_name = 'Nama depan wajib diisi.';
    if (isEmpty(form.username)) errs.username = 'Username wajib diisi.';
    if (isEmpty(form.email)) errs.email = 'Email wajib diisi.';
    else if (!isValidEmail(form.email.trim())) errs.email = 'Format email tidak valid.';

    const passwordRequired = mode === 'create' && !form.default_password;
    if (passwordRequired && !form.password) errs.password = 'Password wajib diisi.';
    else if (form.password && form.password.length < 8) errs.password = 'Password minimal 8 karakter.';
    if (form.password !== form.password_confirmation) errs.password_confirmation = 'Konfirmasi password tidak cocok.';

    if (selectedRoles.length === 0) errs.roles = 'Pilih minimal satu grup.';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    onSave({
      id: user?.id,
      username: form.username.trim(),
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      email: form.email.trim(),
      roles: selectedRoles,
      default_password: form.default_password,
      ...(form.password ? { password: form.password } : {}),
    });
  };

  const title = mode === 'create' ? 'Tambah School Tenant' : 'Edit School Tenant';

  return (
    <Modal isOpen onClose={onClose} title={title} size="lg" subtitle="Kelola akun pengguna sistem">
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Nama Depan *"
            placeholder="Nama Depan"
            value={form.first_name}
            error={errors.first_name}
            onChange={(e) => set('first_name', e.target.value)}
          />
          <Input
            label="Nama Belakang"
            placeholder="Nama Belakang"
            value={form.last_name}
            onChange={(e) => set('last_name', e.target.value)}
          />
          <Input
            label="Username *"
            placeholder="Username"
            value={form.username}
            error={errors.username}
            onChange={(e) => set('username', e.target.value)}
          />
          <Input
            label="Email *"
            placeholder="email@sekolah.ac.id"
            type="email"
            value={form.email}
            error={errors.email}
            onChange={(e) => set('email', e.target.value)}
          />
        </div>

        {/* Default password */}
        <div>
          <Checkbox
            label="Gunakan username sebagai password"
            checked={form.default_password}
            onChange={(e) => set('default_password', e.target.checked)}
          />
        </div>

        {!form.default_password && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={mode === 'create' ? 'Password *' : 'Password (kosongkan jika tidak diubah)'}
              type="password"
              placeholder="Minimal 8 karakter"
              value={form.password}
              error={errors.password}
              onChange={(e) => set('password', e.target.value)}
            />
            <Input
              label="Konfirmasi Password"
              type="password"
              placeholder="Ulangi password"
              value={form.password_confirmation}
              error={errors.password_confirmation}
              onChange={(e) => set('password_confirmation', e.target.value)}
            />
          </div>
        )}

        {/* Group assignment */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Grup (Hak Akses) *
          </label>
          <div className="border border-neutral-200 rounded-lg p-4 space-y-3 max-h-52 overflow-y-auto">
            {groups.map((group) => (
              <Checkbox
                key={group.id}
                label={`${group.name} (${group.key})`}
                checked={selectedRoles.includes(group.id)}
                onChange={() => toggleRole(group.id)}
              />
            ))}
            {groups.length === 0 && (
              <p className="text-sm text-neutral-400 italic">Belum ada grup. Buat grup terlebih dahulu.</p>
            )}
          </div>
          {errors.roles && <p className="mt-1 text-sm text-danger-600">{errors.roles}</p>}
        </div>

        {mode === 'edit' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-neutral-500 font-medium mb-1">Terakhir Login</p>
              <p className="text-neutral-900">{user?.last_login || 'Belum pernah login.'}</p>
            </div>
            <div>
              <p className="text-neutral-500 font-medium mb-1">Tanggal Bergabung</p>
              <p className="text-neutral-900">{user?.date_join || '-'}</p>
            </div>
          </div>
        )}
      </div>

      <div className="pt-4 mt-6 border-t border-neutral-100 flex justify-end gap-3">
        <Button variant="ghost" className="text-neutral-600 px-6" onClick={onClose}>
          Batal
        </Button>
        <Button
          className="bg-[#1854F6] hover:bg-[#0C3FD6] text-white px-6"
          isLoading={loading}
          disabled={loading}
          onClick={handleSave}
        >
          Simpan
        </Button>
      </div>
    </Modal>
  );
};

export default ModalUser;