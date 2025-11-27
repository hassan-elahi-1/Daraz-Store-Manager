import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth, useTheme } from '../App';
import { Menu, X, Package, LayoutDashboard, Settings, LogOut, PlusCircle, Sun, Moon } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  const NavItem = ({ to, icon: Icon, label, mobile = false }: any) => {
    const active = isActive(to);
    const baseClass = "flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm font-medium";
    const activeClass = "bg-primary text-white";
    const inactiveClass = "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700";

    return (
      <Link 
        to={to} 
        className={`${baseClass} ${active ? activeClass : inactiveClass} ${mobile ? 'w-full' : ''}`}
        onClick={() => setIsOpen(false)}
      >
        <Icon size={18} />
        {label}
      </Link>
    );
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50 transition-colors duration-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/home" className="flex items-center gap-2 font-bold text-xl text-secondary dark:text-white">
            <span className="bg-primary text-white p-1 rounded">DM</span>
            <span className="hidden sm:block">Daraz Manager</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-2">
            <NavItem to="/home" icon={LayoutDashboard} label="Dashboard" />
            <NavItem to="/products" icon={Package} label="Products" />
            <NavItem to="/products/add" icon={PlusCircle} label="Add" />
            <NavItem to="/settings" icon={Settings} label="Settings" />
            
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2"></div>
            
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md text-sm font-medium transition-colors"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
             <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
              className="p-2 text-gray-600 dark:text-gray-300"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 transition-colors duration-200">
          <div className="px-4 pt-2 pb-4 space-y-1">
            <div className="px-3 py-2 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {user?.firstName}'s Store
            </div>
            <NavItem to="/home" icon={LayoutDashboard} label="Dashboard" mobile />
            <NavItem to="/products" icon={Package} label="Products" mobile />
            <NavItem to="/products/add" icon={PlusCircle} label="Add Product" mobile />
            <NavItem to="/settings" icon={Settings} label="Settings" mobile />
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md text-sm font-medium transition-colors mt-2"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}