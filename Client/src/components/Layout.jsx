import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Search, Bell, ChevronDown, Menu } from 'lucide-react';
import { getUserRole, getUsername } from '../utils/auth';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const user = {
    username: getUsername() || 'User',
    role: getUserRole() || 'Client',
  };

  return (
    <div className="flex bg-[#1e1e1e] min-h-screen text-white font-sans">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <div className="flex-1 ml-0 md:ml-64 flex flex-col transition-all duration-300">
        {/* Header */}
        <header className="h-20 border-b border-[#333] flex items-center justify-between px-4 md:px-8 sticky top-0 bg-[#1e1e1e] z-10">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden text-gray-400 hover:text-white"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu size={24} />
            </button>
            <div className="relative w-full max-w-xs md:w-96 hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search quantity control, regulators..." 
                className="w-full bg-[#2d2d2d] border-none rounded-full py-2.5 pl-10 pr-4 text-sm text-gray-300 focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative text-gray-400 hover:text-white">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            <div className="flex items-center gap-3 pl-6 border-l border-[#333]">
              <div className="text-right">
                <div className="text-xs text-gray-400 font-medium px-2 py-0.5 bg-[#333] rounded-full inline-block mb-1">
                  {user.role}
                </div>
              </div>
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
                alt="Avatar" 
                className="w-10 h-10 rounded-full border-2 border-[#333]"
              />
              <ChevronDown size={16} className="text-gray-400" />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
