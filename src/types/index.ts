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
  email: string;
  enrollmentDate: string;
  status: 'active' | 'inactive' | 'graduated';
  courses: string[];
}

export interface Teacher {
  id: string;
  schoolId: string;
  name: string;
  email: string;
  subject: string;
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
