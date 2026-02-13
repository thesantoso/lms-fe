import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  House, 
  GraduationCap, 
  Users, 
  BookOpen,
  Gear,
  Buildings,
} from '@phosphor-icons/react';
import { useAuth } from '@/contexts/AuthContext';

const BottomNav: React.FC = () => {
  const { user } = useAuth();

  const getNavItems = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { to: '/admin', icon: House, label: 'Home' },
          { to: '/admin/schools', icon: Buildings, label: 'Schools' },
          { to: '/admin/courses', icon: BookOpen, label: 'Courses' },
          { to: '/admin/settings', icon: Gear, label: 'Settings' },
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
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 px-6 py-2 flex justify-between items-center z-50 md:hidden pb-[env(safe-area-inset-bottom)]">
      {displayItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/admin' || item.to === '/teacher' || item.to === '/student'}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
              isActive
                ? 'text-primary-600'
                : 'text-neutral-500 hover:text-neutral-900'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <item.icon size={24} weight={isActive ? 'fill' : 'regular'} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;
