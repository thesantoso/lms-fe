import React from 'react';
import { Bell, CaretDown, User as UserIcon } from '@phosphor-icons/react';
import { useAuth } from '@/contexts/AuthContext';

const Header: React.FC = () => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-neutral-200 px-6 flex items-center justify-between md:justify-end sticky top-0 z-40 w-full">
      <div className="flex items-center gap-4">
        {/* Notification */}
        <button className="p-2 text-neutral-500 hover:bg-neutral-50 rounded-full relative">
          <Bell size={24} />
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-2 cursor-pointer bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors border border-blue-100">
            <div className="w-9 h-9 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-600 overflow-hidden border-2 border-white shadow-sm">
                 <UserIcon size={20} weight="fill" />
            </div>
            <div className="hidden md:block text-left mr-2">
                <p className="text-sm font-bold text-neutral-900 leading-tight">{user?.name || 'User'}</p>
                <p className="text-[11px] text-neutral-500 font-medium">{user?.role === 'admin' ? 'Super Admin' : user?.role}</p>
            </div>
            <CaretDown size={16} className="text-neutral-600" />
        </div>
      </div>
    </header>
  );
};

export default Header;
