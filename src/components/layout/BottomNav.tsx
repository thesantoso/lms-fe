import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  House, 
  GraduationCap, 
  Users,
  BookOpen,
  Gear,
  ChalkboardTeacher,
  BookBookmark,
} from '@phosphor-icons/react';
import { useAuth } from '@/contexts/AuthContext';

const BottomNav: React.FC = () => {
  const { user } = useAuth();

  const getNavItems = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { to: '/admin', icon: House, label: 'Dasbor' },
          { to: '/admin/students', icon: Users, label: 'Siswa' },
          { to: '/admin/teachers', icon: ChalkboardTeacher, label: 'Guru' },
          { to: '/admin/master/classes', icon: BookBookmark, label: 'Master' },
          { to: '/admin/settings', icon: Gear, label: 'Pengaturan' },
        ];
      case 'teacher':
        return [
          { to: '/teacher', icon: House, label: 'Home' },
          { to: '/teacher/courses', icon: BookOpen, label: 'Courses' },
          { to: '/teacher/students', icon: GraduationCap, label: 'Students' },
          { to: '/teacher/settings', icon: Gear, label: 'Settings' },
        ];
      case 'student':
        return [
          { to: '/student', icon: House, label: 'Home' },
          { to: '/student/courses', icon: BookOpen, label: 'Courses' },
          { to: '/student/grades', icon: GraduationCap, label: 'Grades' },
          { to: '/student/settings', icon: Gear, label: 'Settings' },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();
  
  // Limit items to 4-5 for bottom nav to avoid clutter (Hick's Law / Clean UI)
  const displayItems = navItems.slice(0, 5);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-neutral-200 bg-white md:hidden pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex w-full max-w-md items-center px-2 py-1 sm:px-4">
        {displayItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/admin' || item.to === '/teacher' || item.to === '/student'}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center justify-center gap-1 rounded-lg px-1 py-2 transition-colors ${
                isActive
                  ? 'text-primary-600'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={22} weight={isActive ? 'fill' : 'regular'} />
                <span className="hidden text-[10px] font-medium leading-none sm:block">
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
