import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from './contexts/AuthContext';
import { TenantProvider } from './contexts/TenantContext';
import ProtectedRoute from './routes/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import OTPVerificationPage from './pages/auth/OTPVerificationPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import CoursesPage from './pages/admin/CoursesPage';
import StudentsPage from './pages/admin/StudentsPage';
import AddStudentPage from './pages/admin/students/AddStudentPage';
import StudentDetailPage from './pages/admin/students/StudentDetailPage';
import EditStudentPage from './pages/admin/students/EditStudentPage';

// Teacher Pages
import TeacherDashboard from './pages/teacher/TeacherDashboard';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TenantProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/verify-otp" element={<OTPVerificationPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />

              {/* Protected Routes - Admin */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="courses" element={<CoursesPage />} />
                <Route path="students" element={<StudentsPage />} />
                <Route path="students/add" element={<AddStudentPage />} />
                <Route path="students/:id" element={<StudentDetailPage />} />
                <Route path="students/edit/:id" element={<EditStudentPage />} />
                <Route path="teachers" element={<div className="text-center py-8">Teachers page coming soon</div>} />
                <Route path="schools" element={<div className="text-center py-8">Schools page coming soon</div>} />
                <Route path="settings" element={<div className="text-center py-8">Settings page coming soon</div>} />
              </Route>

              {/* Protected Routes - Teacher */}
              <Route
                path="/teacher"
                element={
                  <ProtectedRoute allowedRoles={['teacher']}>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<TeacherDashboard />} />
                <Route path="courses" element={<div className="text-center py-8">My Courses page coming soon</div>} />
                <Route path="students" element={<div className="text-center py-8">Students page coming soon</div>} />
                <Route path="settings" element={<div className="text-center py-8">Settings page coming soon</div>} />
              </Route>

              {/* Protected Routes - Student */}
              <Route
                path="/student"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<StudentDashboard />} />
                <Route path="courses" element={<div className="text-center py-8">My Courses page coming soon</div>} />
                <Route path="grades" element={<div className="text-center py-8">Grades page coming soon</div>} />
                <Route path="settings" element={<div className="text-center py-8">Settings page coming soon</div>} />
              </Route>

              {/* Default redirect */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </TenantProvider>
        </AuthProvider>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;
