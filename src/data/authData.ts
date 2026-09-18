import type { AuthGroup, AuthUser, PermissionNode } from '@/types';

// Dummy data untuk fitur Autentikasi & Otorisasi (RBAC admin)
// Data di-mutate in-memory, jadi Create/Edit/Delete bekerja selama sesi berjalan.

export const authzPermissions: PermissionNode[] = [
  {
    label: 'Dasbor',
    value: 'dashboard',
    children: [{ label: 'Lihat Dasbor', value: 'dashboard.view' }],
  },
  {
    label: 'Master Data',
    value: 'master',
    children: [
      {
        label: 'Kelas',
        value: 'master.classes',
        children: [
          { label: 'Lihat', value: 'master.classes.view' },
          { label: 'Tambah', value: 'master.classes.create' },
          { label: 'Ubah', value: 'master.classes.edit' },
          { label: 'Hapus', value: 'master.classes.delete' },
        ],
      },
      {
        label: 'Mata Pelajaran',
        value: 'master.subjects',
        children: [
          { label: 'Lihat', value: 'master.subjects.view' },
          { label: 'Tambah', value: 'master.subjects.create' },
          { label: 'Ubah', value: 'master.subjects.edit' },
          { label: 'Hapus', value: 'master.subjects.delete' },
        ],
      },
      {
        label: 'Jadwal',
        value: 'master.schedules',
        children: [
          { label: 'Lihat', value: 'master.schedules.view' },
          { label: 'Tambah', value: 'master.schedules.create' },
          { label: 'Ubah', value: 'master.schedules.edit' },
          { label: 'Hapus', value: 'master.schedules.delete' },
        ],
      },
    ],
  },
  {
    label: 'Autentikasi & Otorisasi',
    value: 'auth',
    children: [
      {
        label: 'User',
        value: 'auth.users',
        children: [
          { label: 'Lihat', value: 'auth.users.view' },
          { label: 'Tambah', value: 'auth.users.create' },
          { label: 'Ubah', value: 'auth.users.edit' },
          { label: 'Hapus', value: 'auth.users.delete' },
        ],
      },
      {
        label: 'Group',
        value: 'auth.groups',
        children: [
          { label: 'Lihat', value: 'auth.groups.view' },
          { label: 'Tambah', value: 'auth.groups.create' },
          { label: 'Ubah', value: 'auth.groups.edit' },
          { label: 'Hapus', value: 'auth.groups.delete' },
        ],
      },
    ],
  },
  {
    label: 'Laporan',
    value: 'reports',
    children: [
      { label: 'Lihat', value: 'reports.view' },
      { label: 'Export', value: 'reports.export' },
    ],
  },
];

// helper: kumpulkan semua nilai permission (leaf) dari pohon
const collectLeafValues = (nodes: PermissionNode[]): string[] =>
  nodes.flatMap((n) =>
    n.children && n.children.length > 0
      ? collectLeafValues(n.children)
      : [n.value],
  );

const allPermissions = collectLeafValues(authzPermissions);

export const authzGroups: AuthGroup[] = [
  {
    id: 'g-1',
    key: 'super_admin',
    name: 'Super Admin',
    permissions: allPermissions,
  },
  {
    id: 'g-2',
    key: 'guru',
    name: 'Guru',
    permissions: [
      'dashboard.view',
      'master.classes.view',
      'master.subjects.view',
      'master.schedules.view',
    ],
  },
  {
    id: 'g-3',
    key: 'siswa',
    name: 'Siswa',
    permissions: ['dashboard.view'],
  },
];

// user.auth email mengikuti akun demo di mock.ts agar tetap sinkron dengan login
export const authzUsers: AuthUser[] = [
  {
    id: 'u-1',
    username: 'admin',
    first_name: 'Admin',
    last_name: 'Sekolah',
    email: 'admin@demo.com',
    roles: ['g-1'],
    default_password: false,
    last_login: '2026-09-16 08:12',
    date_join: '2026-01-01',
  },
  {
    id: 'u-2',
    username: 'johnteacher',
    first_name: 'John',
    last_name: 'Teacher',
    email: 'teacher@demo.com',
    roles: ['g-2'],
    default_password: false,
    last_login: '2026-09-15 13:40',
    date_join: '2026-02-10',
  },
  {
    id: 'u-3',
    username: 'jane',
    first_name: 'Jane',
    last_name: 'Student',
    email: 'student@demo.com',
    roles: ['g-3'],
    default_password: true,
    last_login: '2026-09-14 07:55',
    date_join: '2026-07-20',
  },
];

let nextId = 100;
const genId = (prefix: string) => `${prefix}-${nextId++}`;

export const authzStore = {
  getPermissionTree: () => authzPermissions,
  getGroups: () => [...authzGroups],
  getUsers: () => [...authzUsers],

  createGroup: (data: Omit<AuthGroup, 'id'>) => {
    const created: AuthGroup = { id: genId('g'), ...data };
    authzGroups.push(created);
    return created;
  },
  updateGroup: (id: string, data: Partial<AuthGroup>) => {
    const idx = authzGroups.findIndex((g) => g.id === id);
    if (idx === -1) throw new Error('Group tidak ditemukan');
    authzGroups[idx] = { ...authzGroups[idx], ...data, id };
    return authzGroups[idx];
  },
  deleteGroup: (id: string) => {
    const idx = authzGroups.findIndex((g) => g.id === id);
    if (idx === -1) throw new Error('Group tidak ditemukan');
    authzGroups.splice(idx, 1);
    // hapus relasi dari user
    authzUsers.forEach((u) => {
      u.roles = u.roles.filter((r) => r !== id);
    });
  },

  createUser: (data: Omit<AuthUser, 'id'>) => {
    const created: AuthUser = { id: genId('u'), ...data };
    authzUsers.push(created);
    return created;
  },
  updateUser: (id: string, data: Partial<AuthUser>) => {
    const idx = authzUsers.findIndex((u) => u.id === id);
    if (idx === -1) throw new Error('User tidak ditemukan');
    authzUsers[idx] = { ...authzUsers[idx], ...data, id };
    return authzUsers[idx];
  },
  deleteUser: (id: string) => {
    const idx = authzUsers.findIndex((u) => u.id === id);
    if (idx === -1) throw new Error('User tidak ditemukan');
    authzUsers.splice(idx, 1);
  },
};