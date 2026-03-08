import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, Settings } from 'lucide-react';

export default function Sidebar() {
  const links = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Inventory', path: '/inventory', icon: <Package size={20} /> },
    { name: 'Sales', path: '/sales', icon: <ShoppingCart size={20} /> },
    { name: 'Customers', path: '/customers', icon: <Users size={20} /> },
    { name: 'System', path: '/system', icon: <Settings size={20} /> },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          SwasthiQ
        </h1>
        <p className="text-xs text-gray-500 mt-1">Pharmacy CRM</p>
      </div>
      
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) => 
              `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            {link.icon}
            <span>{link.name}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-600">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
            A
          </div>
          <div>
            <p className="font-medium text-gray-900">Admin User</p>
            <p className="text-xs">admin@swasthiq.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
