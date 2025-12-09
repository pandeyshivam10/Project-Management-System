import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Activity, Layers, ListTodo, History, Power } from 'lucide-react';
import axios from '../api';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('/logout');
    } catch (e) {
      console.error(e);
    }
    localStorage.clear();
    navigate('/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Homescreen', path: '/dashboard' }, // Using dashboard as home
    { icon: Activity, label: 'Usage', path: '/usage' },
    { icon: Layers, label: 'Projects', path: '/projects' },
    { icon: ListTodo, label: 'Taskboard', path: '/taskboard' },
    { icon: History, label: 'History', path: '/history' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={onClose}
        ></div>
      )}
      
      <div className={`w-64 bg-[#232323] h-screen flex flex-col border-r border-[#333] fixed left-0 top-0 z-30 transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
      <div className="p-6 flex items-center gap-2">
        <img src="/logo-project.png" alt="Logo" className="w-8 h-8 object-contain" />
        <span className="text-xl font-bold tracking-tight">ubiquitous.co</span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20' 
                  : 'text-gray-400 hover:text-white hover:bg-[#333]'
              }`
            }
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
            {item.label === 'Projects' && (
              <div className="ml-auto w-1 h-8 bg-purple-500 rounded-full hidden"></div> // indicator
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full text-gray-400 hover:text-red-400 hover:bg-[#333] rounded-lg transition-colors"
        >
          <Power size={20} />
          <span className="font-medium">Log out</span>
        </button>
      </div>
      </div>
    </>
  );
};

export default Sidebar;
