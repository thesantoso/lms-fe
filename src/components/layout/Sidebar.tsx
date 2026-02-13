import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  SignOut, 
  House, 
  GraduationCap, 
  Users, 
  BookOpen,
  Gear,
  CaretDown,
  Buildings,
  ChartBar,
  CalendarCheck,
  ShieldCheck,
  ChalkboardTeacher,
  UserGear,
  UsersThree,
  CaretRight,
  BookBookmark
} from '@phosphor-icons/react';
import { useAuth } from '@/contexts/AuthContext';
import { useTenant } from '@/contexts/TenantContext';
import { cn } from '@/lib/utils';

type NavItemType = {
  type?: 'link' | 'section' | 'menu';
  to?: string;
  icon?: React.ElementType;
  label: string;
  children?: NavItemType[];
};

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const { currentSchool, schools, switchSchool } = useTenant();
  const navigate = useNavigate();
  const location = useLocation();
  const [showSchoolMenu, setShowSchoolMenu] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    'Autentikasi': true // Default expanded
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = (label: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  const getNavItems = (): NavItemType[] => {
    switch (user?.role) {
      case 'admin':
        return [
          { type: 'link', to: '/admin', icon: House, label: 'Dasbor' },
          { type: 'link', to: '/admin/courses', icon: BookOpen, label: 'Pembelajaran & Penilaian' },
          { type: 'link', to: '/admin/attendance', icon: CalendarCheck, label: 'Absensi' },
          { type: 'link', to: '/admin/academic', icon: GraduationCap, label: 'Akademik' },
          { type: 'link', to: '/admin/reports', icon: ChartBar, label: 'Laporan' },
          { 
            type: 'section', 
            label: 'MASTER DATA', 
            children: [
              {
                type: 'menu',
                label: 'Autentikasi',
                icon: ShieldCheck,
                children: [
                  { type: 'link', to: '/admin/students', icon: Users, label: 'Siswa' },
                  { type: 'link', to: '/admin/teachers', icon: ChalkboardTeacher, label: 'Guru' },
                  { type: 'link', to: '/admin/parents', icon: UsersThree, label: 'Orang Tua' },
                  { type: 'link', to: '/admin/staff', icon: UserGear, label: 'Staff' },
                ]
              },
              {
                type: 'menu',
                label: 'Akademik',
                icon: BookBookmark,
                children: [
                  { type: 'link', to: '/admin/master/classes', label: 'Kelas' },
                  { type: 'link', to: '/admin/master/subjects', label: 'Mata Pelajaran' },
                ]
              }
            ]
          },
          { type: 'link', to: '/admin/settings', icon: Gear, label: 'Pengaturan' },
        ];
      case 'teacher':
        return [
          { type: 'link', to: '/teacher', icon: House, label: 'Dashboard' },
          { type: 'link', to: '/teacher/courses', icon: BookOpen, label: 'My Courses' },
          { type: 'link', to: '/teacher/students', icon: GraduationCap, label: 'Students' },
          { type: 'link', to: '/teacher/settings', icon: Gear, label: 'Settings' },
        ];
      case 'student':
        return [
          { type: 'link', to: '/student', icon: House, label: 'Dashboard' },
          { type: 'link', to: '/student/courses', icon: BookOpen, label: 'My Courses' },
          { type: 'link', to: '/student/grades', icon: GraduationCap, label: 'Grades' },
          { type: 'link', to: '/student/settings', icon: Gear, label: 'Settings' },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  const renderNavItem = (item: NavItemType, index: number, depth = 0) => {
    if (item.type === 'section') {
      return (
        <div key={`section-${index}`} className="mb-2 mt-4 first:mt-0">
          <div className="px-6 py-2 text-[11px] font-bold text-blue-500 uppercase tracking-wider">
            {item.label}
          </div>
          <div className="space-y-1">
            {item.children?.map((child, idx) => renderNavItem(child, idx, depth))}
          </div>
        </div>
      );
    }

    if (item.type === 'menu') {
      const hasActiveChild = item.children?.some(child => child.to && location.pathname.startsWith(child.to));
      // Expand if manually expanded OR has active child
      const isExpanded = expandedMenus[item.label] || hasActiveChild;
      
      return (
        <div key={`menu-${item.label}-${index}`} className="px-3 mb-1">
          <button
            onClick={() => toggleMenu(item.label)}
            className={cn(
              "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
              hasActiveChild 
                ? "bg-[#2563EB] text-white shadow-md shadow-blue-200" 
                : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
            )}
          >
            <div className="flex items-center gap-3">
              {item.icon && <item.icon size={20} weight={hasActiveChild ? "fill" : "regular"} />}
              <span>{item.label}</span>
            </div>
            <CaretDown 
              size={16} 
              className={cn("transition-transform duration-200", isExpanded ? "rotate-180" : "")} 
            />
          </button>
          <div className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out",
            isExpanded ? "max-h-[500px] opacity-100 mt-1" : "max-h-0 opacity-0"
          )}>
            <div className="space-y-1">
              {item.children?.map((child, idx) => renderNavItem(child, idx, depth + 1))}
            </div>
          </div>
        </div>
      );
    }

    // Link type
    const isChild = depth > 0;
    
    // Check if parent is active to style child accordingly
    // We don't have direct access to parent state here, but we can infer from 'isChild' and 'isActive'
    // If it's a child, we want specific styling.

    return (
      <div key={item.to} className="px-3 mb-1">
        <NavLink
          to={item.to!}
          end={item.to === '/admin' || item.to === '/teacher' || item.to === '/student'}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
              isActive
                ? isChild
                  ? "bg-blue-600 text-white" // Active Child
                  : "bg-[#2563EB] text-white shadow-md shadow-blue-200" // Active Top Level
                : isChild
                  ? "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 ml-2" // Inactive Child
                  : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900" // Inactive Top Level
            )
          }
        >
          {({ isActive }) => (
            <>
              {item.icon && <item.icon size={20} weight={isActive ? "fill" : "regular"} />}
              <span>{item.label}</span>
              {isActive && isChild && (
                  <CaretRight size={16} weight="bold" className="ml-auto" />
              )}
            </>
          )}
        </NavLink>
      </div>
    );
  };

  return (
    <aside className="hidden md:flex w-64 bg-white border-r border-neutral-200 flex-col h-screen sticky top-0 z-50">
      {/* Logo */}
      <div className="px-6 h-16 border-b border-neutral-200 flex items-center gap-3">
         <div className="w-8 h-8 bg-[#2563EB] rounded-full flex items-center justify-center text-white font-bold shadow-sm">
           <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
             <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
             <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
             <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
           </svg>
         </div>
        <h1 className="text-xl font-bold text-neutral-900 tracking-tight">Your Logo</h1>
      </div>

      {/* School Switcher */}
      {schools.length > 1 && (
        <div className="px-4 py-3 border-b border-neutral-200">
          <div className="relative">
            <button
              onClick={() => setShowSchoolMenu(!showSchoolMenu)}
              className="w-full flex items-center justify-between px-3 py-2 text-sm bg-neutral-50 hover:bg-neutral-100 rounded-lg transition-colors border border-neutral-200"
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
                    className={cn(
                      "w-full text-left px-3 py-2 text-sm hover:bg-neutral-50 transition-colors",
                      currentSchool?.id === school.id ? "bg-primary-50 text-primary-700 font-medium" : "text-neutral-700"
                    )}
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
      <nav className="flex-1 py-4 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-200">
        {navItems.map((item, index) => renderNavItem(item, index))}
      </nav>
      
      {/* User menu removed from bottom as it is now in Header */}
    </aside>
  );
};

export default Sidebar;
