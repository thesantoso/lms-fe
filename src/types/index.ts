export type UserRole = 'admin' | 'teacher' | 'student';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  schoolIds: string[];
}

export interface School {
  id: string;
  name: string;
  logo?: string;
  address: string;
  contactEmail: string;
  contactPhone: string;
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: string;
  schoolId: string;
  name: string;
  description: string;
  teacherId: string;
  teacherName: string;
  studentCount: number;
  startDate: string;
  endDate: string;
  status: 'draft' | 'active' | 'completed' | 'archived';
}

export interface Student {
  id: string;
  schoolId: string;
  name: string;
  firstName?: string;
  lastName?: string;
  placeOfBirth?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female';
  religion?: string;
  photo?: string;
  email: string;
  enrollmentDate: string;
  status: 'active' | 'inactive' | 'graduated';
  courses: string[];
}

export interface Teacher {
  id: string;
  schoolId: string;
  nip: string;
  nuptk?: string;
  teacherId?: string; // Nomor Induk Guru
  nik?: string;
  name: string;
  firstName?: string;
  lastName?: string;
  placeOfBirth?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female';
  religion?: string;
  lastEducation?: string;
  photo?: string;
  email: string;
  phone?: string;
  address?: string;
  rt?: string;
  rw?: string;
  province?: string;
  regency?: string;
  district?: string;
  village?: string;
  postalCode?: string;
  subject: string;
  employmentStatus: 'PNS' | 'Honorer' | 'Tetap Yayasan';
  position?: string; // Jabatan
  classAssigned?: string; // Kelas
  courses: string[];
  status: 'active' | 'inactive';
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface TenantContextType {
  currentSchool: School | null;
  schools: School[];
  switchSchool: (schoolId: string) => void;
  loading: boolean;
}

export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}
