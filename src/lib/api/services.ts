import { apiClient } from './client';
import { mockApi } from './mock';
import type { User, School, Course, Student, Teacher, PaginatedResponse } from '@/types';

// Flag to use mock API when backend is not available
const USE_MOCK_API = true;

// Auth API
export const authApi = {
  login: (email: string, password: string) => {
    if (USE_MOCK_API) {
      return mockApi.login(email, password);
    }
    return apiClient.post<{ user: User; token: string }>('/auth/login', { email, password });
  },
  
  logout: () =>
    apiClient.post('/auth/logout'),
  
  getCurrentUser: () =>
    apiClient.get<User>('/auth/me'),
  
  refreshToken: () =>
    apiClient.post<{ token: string }>('/auth/refresh'),
};

// School API
export const schoolApi = {
  getAll: () => {
    if (USE_MOCK_API) {
      return mockApi.getSchools();
    }
    return apiClient.get<School[]>('/schools');
  },
  
  getById: (id: string) =>
    apiClient.get<School>(`/schools/${id}`),
  
  create: (data: Omit<School, 'id' | 'createdAt' | 'updatedAt'>) =>
    apiClient.post<School>('/schools', data),
  
  update: (id: string, data: Partial<School>) =>
    apiClient.put<School>(`/schools/${id}`, data),
  
  delete: (id: string) =>
    apiClient.delete(`/schools/${id}`),
};

// Course API
export const courseApi = {
  getAll: (params?: { schoolId?: string; page?: number; perPage?: number }) => {
    if (USE_MOCK_API) {
      return mockApi.getCourses(params?.schoolId);
    }
    return apiClient.get<PaginatedResponse<Course>>('/courses', { params });
  },
  
  getById: (id: string) =>
    apiClient.get<Course>(`/courses/${id}`),
  
  create: (data: Omit<Course, 'id' | 'studentCount'>) =>
    apiClient.post<Course>('/courses', data),
  
  update: (id: string, data: Partial<Course>) =>
    apiClient.put<Course>(`/courses/${id}`, data),
  
  delete: (id: string) =>
    apiClient.delete(`/courses/${id}`),
};

// Student API
export const studentApi = {
  getAll: (params?: { schoolId?: string; page?: number; perPage?: number }) => {
    if (USE_MOCK_API) {
      return mockApi.getStudents(params?.schoolId);
    }
    return apiClient.get<PaginatedResponse<Student>>('/students', { params });
  },
  
  getById: (id: string) =>
    apiClient.get<Student>(`/students/${id}`),
  
  create: (data: Omit<Student, 'id'>) =>
    apiClient.post<Student>('/students', data),
  
  update: (id: string, data: Partial<Student>) => {
    if (USE_MOCK_API) {
      return mockApi.updateStudent(id, data);
    }
    return apiClient.put<Student>(`/students/${id}`, data);
  },
  
  delete: (id: string) =>
    apiClient.delete(`/students/${id}`),
};

// Teacher API
export const teacherApi = {
  getAll: (params?: { schoolId?: string; page?: number; perPage?: number }) => {
    if (USE_MOCK_API) {
      return mockApi.getTeachers(params?.schoolId);
    }
    return apiClient.get<PaginatedResponse<Teacher>>('/teachers', { params });
  },
  
  getById: (id: string) =>
    apiClient.get<Teacher>(`/teachers/${id}`),
  
  create: (data: Omit<Teacher, 'id'>) =>
    apiClient.post<Teacher>('/teachers', data),
  
  update: (id: string, data: Partial<Teacher>) =>
    apiClient.put<Teacher>(`/teachers/${id}`, data),
  
  delete: (id: string) =>
    apiClient.delete(`/teachers/${id}`),
};
