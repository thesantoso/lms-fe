import type { User, School, Course, Student, Teacher, PaginatedResponse } from '@/types';

// Mock data for development and testing
export const mockUsers: Record<string, { user: User; password: string }> = {
  'admin@demo.com': {
    password: 'admin123',
    user: {
      id: '1',
      email: 'admin@demo.com',
      name: 'Admin User',
      role: 'admin',
      avatar: undefined,
      schoolIds: ['school-1', 'school-2'],
    },
  },
  'teacher@demo.com': {
    password: 'teacher123',
    user: {
      id: '2',
      email: 'teacher@demo.com',
      name: 'John Teacher',
      role: 'teacher',
      avatar: undefined,
      schoolIds: ['school-1'],
    },
  },
  'student@demo.com': {
    password: 'student123',
    user: {
      id: '3',
      email: 'student@demo.com',
      name: 'Jane Student',
      role: 'student',
      avatar: undefined,
      schoolIds: ['school-1'],
    },
  },
};

export const mockSchools: School[] = [
  {
    id: 'school-1',
    name: 'Springfield High School',
    logo: undefined,
    address: '742 Evergreen Terrace, Springfield, USA',
    contactEmail: 'contact@springfield.edu',
    contactPhone: '+1 (555) 123-4567',
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2024-01-10T15:30:00Z',
  },
  {
    id: 'school-2',
    name: 'Riverdale Community College',
    logo: undefined,
    address: '123 Main Street, Riverdale, USA',
    contactEmail: 'info@riverdale.edu',
    contactPhone: '+1 (555) 987-6543',
    createdAt: '2023-03-20T08:00:00Z',
    updatedAt: '2024-02-05T12:00:00Z',
  },
];

export const mockCourses: Course[] = [
  {
    id: 'course-1',
    schoolId: 'school-1',
    name: 'Introduction to Computer Science',
    description: 'Learn the fundamentals of programming and computer science concepts',
    teacherId: '2',
    teacherName: 'John Teacher',
    studentCount: 32,
    startDate: '2024-01-15T00:00:00Z',
    endDate: '2024-06-15T00:00:00Z',
    status: 'active',
  },
  {
    id: 'course-2',
    schoolId: 'school-1',
    name: 'Advanced Mathematics',
    description: 'Dive deep into calculus and advanced mathematical concepts',
    teacherId: '2',
    teacherName: 'John Teacher',
    studentCount: 28,
    startDate: '2024-01-20T00:00:00Z',
    endDate: '2024-06-20T00:00:00Z',
    status: 'active',
  },
  {
    id: 'course-3',
    schoolId: 'school-1',
    name: 'English Literature',
    description: 'Explore classic and modern literature',
    teacherId: '4',
    teacherName: 'Sarah Williams',
    studentCount: 25,
    startDate: '2024-01-10T00:00:00Z',
    endDate: '2024-06-10T00:00:00Z',
    status: 'active',
  },
  {
    id: 'course-4',
    schoolId: 'school-2',
    name: 'Web Development Bootcamp',
    description: 'Full-stack web development with React and Node.js',
    teacherId: '5',
    teacherName: 'Mike Johnson',
    studentCount: 40,
    startDate: '2024-02-01T00:00:00Z',
    endDate: '2024-07-01T00:00:00Z',
    status: 'active',
  },
];

export const mockStudents: Student[] = [
  {
    id: '3',
    schoolId: 'school-1',
    name: 'Jane Student',
    email: 'student@demo.com',
    enrollmentDate: '2023-09-01T00:00:00Z',
    status: 'active',
    courses: ['course-1', 'course-2'],
  },
  {
    id: 'student-2',
    schoolId: 'school-1',
    name: 'Bob Smith',
    email: 'bob.smith@example.com',
    enrollmentDate: '2023-09-01T00:00:00Z',
    status: 'active',
    courses: ['course-1', 'course-3'],
  },
  {
    id: 'student-3',
    schoolId: 'school-1',
    name: 'Alice Johnson',
    email: 'alice.j@example.com',
    enrollmentDate: '2023-09-01T00:00:00Z',
    status: 'active',
    courses: ['course-2', 'course-3'],
  },
];

export const mockTeachers: Teacher[] = [
  {
    id: '2',
    schoolId: 'school-1',
    name: 'John Teacher',
    email: 'teacher@demo.com',
    subject: 'Computer Science & Mathematics',
    courses: ['course-1', 'course-2'],
    status: 'active',
  },
  {
    id: '4',
    schoolId: 'school-1',
    name: 'Sarah Williams',
    email: 'sarah.w@example.com',
    subject: 'English Literature',
    courses: ['course-3'],
    status: 'active',
  },
];

// Mock API implementation
export const mockApi = {
  login: (email: string, password: string): Promise<{ user: User; token: string }> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const userRecord = mockUsers[email];
        if (userRecord && userRecord.password === password) {
          resolve({
            user: userRecord.user,
            token: `mock-token-${Date.now()}`,
          });
        } else {
          reject(new Error('Invalid email or password'));
        }
      }, 500);
    });
  },

  getSchools: (): Promise<School[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockSchools), 300);
    });
  },

  getCourses: (schoolId?: string): Promise<PaginatedResponse<Course>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = schoolId
          ? mockCourses.filter((c) => c.schoolId === schoolId)
          : mockCourses;
        
        resolve({
          data: filtered,
          total: filtered.length,
          page: 1,
          perPage: 100,
          totalPages: 1,
        });
      }, 300);
    });
  },

  getStudents: (schoolId?: string): Promise<PaginatedResponse<Student>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = schoolId
          ? mockStudents.filter((s) => s.schoolId === schoolId)
          : mockStudents;
        
        resolve({
          data: filtered,
          total: filtered.length,
          page: 1,
          perPage: 100,
          totalPages: 1,
        });
      }, 300);
    });
  },

  getTeachers: (schoolId?: string): Promise<PaginatedResponse<Teacher>> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = schoolId
          ? mockTeachers.filter((t) => t.schoolId === schoolId)
          : mockTeachers;
        
        resolve({
          data: filtered,
          total: filtered.length,
          page: 1,
          perPage: 100,
          totalPages: 1,
        });
      }, 300);
    });
  },
};
