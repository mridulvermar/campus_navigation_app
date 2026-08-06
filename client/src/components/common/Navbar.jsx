import React, { useState } from 'react';
import { Search, Bell, Sun, Moon, User as UserIcon, Shield, Compass, LogOut, Sparkles, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Link, useNavigate } from 'react-router-dom';

export const Navbar = ({ onSearch, onOpenMobileDrawer }) => {
  const { user, logout, switchRole } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchQuery);
    navigate(`/map?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/50 dark:border-slate-800/80 px-3 md:px-8 py-2.5 transition-all duration-300">
      <div className="flex items-center justify-between gap-3">
        {/* Left Section: Brand Logo & Mobile Drawer Trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileDrawer}
            className="p-2 rounded-xl bg-slate-200/70 dark:bg-slate-800/70 text-slate-700 dark:text-slate-200 hover:text-cyan-400 lg:hidden transition-colors"
            aria-label="Open Drawer"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-cyan-400">
                <Compass className="w-5 h-5 md:w-6 md:h-6 animate-spin-slow" />
              </div>
            </div>
            <div className="hidden sm:block">
              <span className="text-base md:text-lg font-extrabold font-display bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent tracking-tight">
                CampusNav
              </span>
              <span className="block text-[9px] md:text-[10px] font-semibold text-slate-400 uppercase tracking-widest -mt-1">
                GIS Spatial Ecosystem
              </span>
            </div>
          </Link>
        </div>

        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md mx-1 md:mx-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search buildings, rooms, assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full glass-input pl-9 text-xs md:text-sm py-2 rounded-xl focus:border-cyan-500"
            />
          </div>
        </form>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 md:gap-3">
          {/* Quick Demo Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold hover:bg-cyan-500/20 transition-all cursor-pointer"
              title="Click to quickly switch demo user role"
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{user?.role || 'Student'} Mode</span>
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-2 z-50 text-xs">
                <div className="px-3 py-1 text-slate-500 font-medium">Switch Role Demo</div>
                {['Student', 'Faculty', 'Administrator'].map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      switchRole(r);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-slate-800 transition-colors flex items-center justify-between cursor-pointer ${user?.role === r ? 'text-cyan-400 font-bold' : 'text-slate-300'}`}
                  >
                    <span>{r}</span>
                    {user?.role === r && <Sparkles className="w-3.5 h-3.5 text-cyan-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 md:p-2.5 rounded-xl bg-slate-200/60 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:text-cyan-400 transition-colors cursor-pointer"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

          {/* Notifications Link */}
          <Link
            to="/notifications"
            className="relative p-2 md:p-2.5 rounded-xl bg-slate-200/60 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:text-cyan-400 transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-500" />
          </Link>

          {/* User Profile Avatar */}
          <Link to="/profile" className="flex items-center pl-1 md:pl-2 border-l border-slate-300/40 dark:border-slate-800">
            <img
              src={user?.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'}
              alt="Avatar"
              className="w-8 h-8 rounded-xl object-cover border border-cyan-500/40 shadow-sm"
            />
          </Link>
        </div>
      </div>
    </header>
  );
};

