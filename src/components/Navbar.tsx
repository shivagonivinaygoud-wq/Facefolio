
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Upload, FolderOpen, Search } from 'lucide-react';

const Navbar = () => {
  const navItems = [
    { to: '/', icon: Home, label: 'Albums' },
    { to: '/upload', icon: Upload, label: 'Upload' },
    { to: '/gallery', icon: FolderOpen, label: 'Gallery' },
    { to: '/search', icon: Search, label: 'Search' },
  ];

  return (
    <nav className="bg-white/90 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <FolderOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              KwicPic
            </span>
          </div>
          
          <div className="hidden md:flex space-x-1">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-purple-50 hover:text-purple-600'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{label}</span>
              </NavLink>
            ))}
          </div>

          {/* Mobile menu */}
          <div className="md:hidden flex space-x-1">
            {navItems.map(({ to, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `p-2 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'text-gray-600 hover:bg-purple-50'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
