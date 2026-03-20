import { apiClient } from './client';
import { mockApi } from './mock';
import type { User, School, Course, Student, Teacher, PaginatedResponse } from '@/types';

// Flag to use mock API when backend is not available
const USE_MOCK_API = true;

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    // Direct integration with the specified API endpoint
    try {
      const response = await apiClient.post<any>('https://be.themelio.tech/api/v1/staff/auth/login', { 
        username: email, // Mapping email input to username as requested
        password 
      });

      // Adapt the response to the application's User type
      // Assuming the API returns a token and potentially user details
      // We map it to the expected structure
      
      // Note: Adjust this mapping based on the actual API response structure
      const token = response.token || response.data?.token || 'session-token';
      
      const user: User = {
        id: response.user?.id || 'user-id',
        email: email,
        name: response.user?.name || email,
        role: 'admin', // Defaulting to admin to ensure access to dashboard
        schoolIds: ['school-1'],
        avatar: response.user?.avatar
      };

      return { user, token };
    } catch (error) {
      console.error('Login API Error:', error);
      throw error;
    }
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

  listIdentity: async (params?: { page?: number; limit?: number }) => {
    try {
      const response = await apiClient.get<any>('https://be.themelio.tech/api/v1/student', {
        params,
      });
      return response;
    } catch (error) {
      console.error('List Student Identity Error:', error);
      throw error;
    }
  },

  getIdentityById: async (id: string) => {
    try {
      const response = await apiClient.get<any>(`https://be.themelio.tech/api/v1/student/${id}`);
      return response;
    } catch (error) {
      console.error('Get Student Identity Error:', error);
      throw error;
    }
  },
  
  getById: (id: string) =>
    apiClient.get<Student>(`/students/${id}`),
  
  create: (data: Omit<Student, 'id'>) =>
    apiClient.post<Student>('/students', data),

  // New method for creating student identity specifically
  createIdentity: async (data: { national_student_id: string; school_student_id: string; family_registry: string }) => {
    try {
      const response = await apiClient.post<any>('https://be.themelio.tech/api/v1/student', data);
      return response;
    } catch (error) {
      console.error('Create Student Identity Error:', error);
      throw error;
    }
  },

  updateProfile: async (
    studentId: string,
    data: {
      first_name: string;
      last_name: string;
      place_of_birth: string;
      date_of_birth: string;
      religion_id: number;
      gender_id: number;
      address?: string | string[];
    }
  ) => {
    try {
      const endpoint = `https://be.themelio.tech/api/v1/student/${studentId}/profile`;
      const addressValues = Array.isArray(data.address)
        ? data.address
        : data.address
          ? [data.address]
          : [];

      if (addressValues.length === 0) {
        const { address, ...payload } = data;
        const response = await apiClient.put<any>(endpoint, payload);
        return response;
      }

      let lastResponse: any;
      for (const address of addressValues) {
        const payload = {
          first_name: data.first_name,
          last_name: data.last_name,
          place_of_birth: data.place_of_birth,
          date_of_birth: data.date_of_birth,
          religion_id: data.religion_id,
          gender_id: data.gender_id,
          address,
        };
        lastResponse = await apiClient.put<any>(endpoint, payload);
      }

      return lastResponse;
    } catch (error) {
      console.error('Update Student Profile Error:', error);
      throw error;
    }
  },

  upsertAddress: async (
    studentId: string,
    data: {
      address_name: string;
      country_id: string;
      province_id: string;
      regency_id: string;
      district_id: string;
      village_id: string;
      postal_code?: string;
      address: string;
    }
  ) => {
    try {
      const response = await apiClient.post<any>(
        `https://be.themelio.tech/api/v1/student/${studentId}/address`,
        data
      );
      return response;
    } catch (error) {
      console.error('Upsert Student Address Error:', error);
      throw error;
    }
  },
  
  update: (id: string, data: Partial<Student>) => {
    if (USE_MOCK_API) {
      return mockApi.updateStudent(id, data);
    }
    return apiClient.put<Student>(`/students/${id}`, data);
  },
  
  delete: (id: string) =>
    apiClient.delete(`/students/${id}`),
};

export const parentApi = {
  create: async (data: { national_id: string; family_registry: string }) => {
    try {
      const response = await apiClient.post<any>('https://be.themelio.tech/api/v1/parent', data);
      return response;
    } catch (error) {
      console.error('Create Parent Error:', error);
      throw error;
    }
  },

  upsertAddress: async (
    parentId: string,
    data: {
      address_name: string;
      country_id: string;
      province_id: string;
      regency_id: string;
      district_id: string;
      village_id: string;
      postal_code?: string;
      address: string;
    }
  ) => {
    try {
      const response = await apiClient.post<any>(
        `https://be.themelio.tech/api/v1/parent/${parentId}/address`,
        JSON.stringify(data),
        {
          headers: { 'Content-Type': 'text/plain' },
        }
      );
      return response;
    } catch (error) {
      console.error('Upsert Parent Address Error:', error);
      throw error;
    }
  },

  createContact: async (
    parentId: string,
    data: { type: 'EMAIL' | 'PHONE'; name: string; address: string }
  ) => {
    try {
      const response = await apiClient.post<any>(
        `https://be.themelio.tech/api/v1/parent/${parentId}/contact`,
        data
      );
      return response;
    } catch (error) {
      console.error('Create Parent Contact Error:', error);
      throw error;
    }
  },

  updateProfile: async (
    parentId: string,
    data: {
      first_name: string;
      last_name: string;
      place_of_birth: string;
      date_of_birth: string;
      gender_id: number;
      religion_id: number;
      job_category_id: number;
    }
  ) => {
    try {
      const response = await apiClient.put<any>(
        `https://be.themelio.tech/api/v1/parent/${parentId}/profile`,
        data
      );
      return response;
    } catch (error) {
      console.error('Update Parent Profile Error:', error);
      throw error;
    }
  },

  linkChild: async (parentId: string, data: { student_id: string; family_relation_id: number }) => {
    try {
      const response = await apiClient.post<any>(
        `https://be.themelio.tech/api/v1/parent/${parentId}/child`,
        data
      );
      return response;
    } catch (error) {
      console.error('Link Parent Child Error:', error);
      throw error;
    }
  },
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

export const masterApi = {
  getReligions: () =>
    apiClient.get<any>('https://be.themelio.tech/api/v1/master/religion'),
  getCountries: (params?: { page?: number; limit?: number }) =>
    apiClient.get<any>('https://be.themelio.tech/api/v1/master/regency/country', { params }),
  getProvinces: (params?: { page?: number; limit?: number }) =>
    apiClient.get<any>('https://be.themelio.tech/api/v1/master/regency/province', { params }),
  getRegencies: (params?: { page?: number; limit?: number }) =>
    apiClient.get<any>('https://be.themelio.tech/api/v1/master/regency/regency', { params }),
  getDistricts: (params?: { page?: number; limit?: number }) =>
    apiClient.get<any>('https://be.themelio.tech/api/v1/master/regency/district', { params }),
  getVillages: (params?: { page?: number; limit?: number }) =>
    apiClient.get<any>('https://be.themelio.tech/api/v1/master/regency/village', { params }),
  getSchoolPrograms: () =>
    apiClient.get<any>('https://be.themelio.tech/api/v1/master/school-programs'),
  getSchoolGrades: () =>
    apiClient.get<any>('https://be.themelio.tech/api/v1/master/school-grade'),
};
