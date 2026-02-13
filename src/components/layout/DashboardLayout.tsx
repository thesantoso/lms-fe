import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';

const DashboardLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-neutral-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto mb-16 md:mb-0">
        <div className="container mx-auto px-4 py-6 md:px-6 md:py-8">
          <Outlet />
        </div>
      </main>
      <BottomNav />
    </div>
  );
};

export default DashboardLayout;
