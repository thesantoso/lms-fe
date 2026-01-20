import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  SignOut, 
  House, 
  GraduationCap, 
  Users, 
  BookOpen,
  Gear,
  CaretDown,
  Buildings,
} from '@phosphor-icons/react';
import { useAuth } from '@/contexts/AuthContext';
import { useTenant } from '@/contexts/TenantContext';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const { currentSchool, schools, switchSchool } = useTenant();
  const navigate = useNavigate();
  const [showSchoolMenu, setShowSchoolMenu] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavItems = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { to: '/admin', icon: House, label: 'Dashboard' },
          { to: '/admin/schools', icon: Buildings, label: 'Schools' },
          { to: '/admin/courses', icon: BookOpen, label: 'Courses' },
          { to: '/admin/teachers', icon: Users, label: 'Teachers' },
          { to: '/admin/students', icon: GraduationCap, label: 'Students' },
          { to: '/admin/settings', icon: Gear, label: 'Settings' },
        ];
      case 'teacher':
        return [
          { to: '/teacher', icon: House, label: 'Dashboard' },
          { to: '/teacher/courses', icon: BookOpen, label: 'My Courses' },
          { to: '/teacher/students', icon: GraduationCap, label: 'Students' },
          { to: '/teacher/settings', icon: Gear, label: 'Settings' },
        ];
      case 'student':
        return [
          { to: '/student', icon: House, label: 'Dashboard' },
          { to: '/student/courses', icon: BookOpen, label: 'My Courses' },
          { to: '/student/grades', icon: GraduationCap, label: 'Grades' },
          { to: '/student/settings', icon: Gear, label: 'Settings' },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 bg-white border-r border-neutral-200 flex flex-col h-screen">
      {/* Logo */}
      <div className="px-6 py-4 border-b border-neutral-200">
        <h1 className="text-2xl font-bold text-primary-600">LMS Dashboard</h1>
      </div>

      {/* School Switcher */}
      {schools.length > 1 && (
        <div className="px-4 py-3 border-b border-neutral-200">
          <div className="relative">
            <button
              onClick={() => setShowSchoolMenu(!showSchoolMenu)}
              className="w-full flex items-center justify-between px-3 py-2 text-sm bg-neutral-50 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-2">
                <Buildings size={20} className="text-neutral-600" />
                <span className="font-medium text-neutral-700 truncate">
                  {currentSchool?.name || 'Select School'}
                </span>
              </div>
              <CaretDown size={16} className="text-neutral-500" />
            </button>
            
            {showSchoolMenu && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                {schools.map((school) => (
                  <button
                    key={school.id}
                    onClick={() => {
                      switchSchool(school.id);
                      setShowSchoolMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-neutral-50 transition-colors ${
                      currentSchool?.id === school.id ? 'bg-primary-50 text-primary-700 font-medium' : 'text-neutral-700'
                    }`}
                  >
                    {school.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/admin' || item.to === '/teacher' || item.to === '/student'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
              }`
            }
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Menu */}
      <div className="px-4 py-4 border-t border-neutral-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
            <span className="text-primary-700 font-semibold text-sm">
              {user?.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-neutral-900 truncate">{user?.name}</p>
            <p className="text-xs text-neutral-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors"
        >
          <SignOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
