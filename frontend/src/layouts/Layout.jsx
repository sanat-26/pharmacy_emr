import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout() {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-gray-800">
      <div className="hidden xl:block">
        <Sidebar />
      </div>
      
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto relative pb-10">
          <div className="p-6 md:p-8 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
