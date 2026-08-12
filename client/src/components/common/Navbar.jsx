import React, { useState } from 'react';
import { Search, Bell, Sun, Moon, User as UserIcon, Shield, Compass, LogOut, Sparkles, Menu, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = ({ onSearch, onOpenMobileDrawer }) => {
  const { user, logout, switchRole } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchQuery);
    navigate(`/map?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/40 dark:border-slate-800/60 px-3 md:px-6 py-2 transition-all duration-300">
      <div className="flex items-center justify-between gap-3 max-w-full">
        {/* Left Section: Brand Logo & Mobile Drawer Trigger */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <button
            onClick={onOpenMobileDrawer}
            className="p-2 rounded-xl bg-slate-800/70 text-slate-400 hover:text-cyan-400 hover:bg-slate-700/80 lg:hidden transition-all duration-200"
            aria-label="Open Drawer"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9 md:w-10 md:h-10 flex-shrink-0">
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 opacity-70 blur-sm group-hover:opacity-100 transition-opacity animate-glow-pulse" />
              <div className="relative w-full h-full rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform duration-200">
                <Compass className="w-5 h-5 md:w-6 md:h-6 animate-spin-slow" />
              </div>
            </div>
            <div className="hidden sm:block">
              <span className="block text-base md:text-[17px] font-black font-display bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent tracking-tight leading-none">
                CampusNav
              </span>
              <span className="block text-[9px] font-semibold text-slate-500 uppercase tracking-[0.15em] mt-0.5">
                GIS Ecosystem
              </span>
            </div>
          </Link>
        </div>

        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-sm mx-1 md:mx-4">
          <div className={`relative transition-all duration-200 ${searchFocused ? 'scale-[1.02]' : ''}`}>
            <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200 ${searchFocused ? 'text-cyan-400' : 'text-slate-500'}`} />
            <input
              type="text"
              placeholder="Search buildings, rooms, assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="w-full glass-input pl-9 pr-4 text-xs md:text-sm py-2 rounded-xl"
            />
          </div>
        </form>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0">
          {/* Quick Demo Role Switcher */}
          <div className="relative">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-1.5 px-2 md:px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-[11px] font-bold hover:bg-cyan-500/20 transition-all cursor-pointer"
              title="Click to switch demo user role"
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{user?.role || 'Student'}</span>
            </motion.button>

            <AnimatePresence>
              {showRoleMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-48 bg-slate-900/95 border border-slate-700/60 rounded-2xl shadow-2xl py-2 z-50 text-xs backdrop-blur-xl"
                >
                  <div className="px-3 py-1.5 text-[10px] text-slate-500 font-bold uppercase tracking-widest">Switch Role Demo</div>
                  {['Student', 'Faculty', 'Administrator'].map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        switchRole(r);
                        setShowRoleMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 hover:bg-slate-800/80 transition-colors flex items-center justify-between cursor-pointer rounded-lg mx-1 ${user?.role === r ? 'text-cyan-400 font-bold' : 'text-slate-300'}`}
                      style={{ width: 'calc(100% - 8px)' }}
                    >
                      <span>{r}</span>
                      {user?.role === r && <Sparkles className="w-3.5 h-3.5 text-cyan-400" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Theme Toggle */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="p-2 md:p-2 rounded-xl bg-slate-800/70 text-slate-400 hover:text-amber-400 dark:hover:text-amber-400 transition-all duration-200 cursor-pointer"
            aria-label="Toggle Theme"
          >
            {isDarkMode
              ? <Sun className="w-4 h-4 text-amber-400" />
              : <Moon className="w-4 h-4 text-indigo-400" />
            }
          </motion.button>

          {/* Notifications */}
          <Link
            to="/notifications"
            className="relative p-2 rounded-xl bg-slate-800/70 text-slate-400 hover:text-cyan-400 transition-all duration-200"
          >
            <Bell className="w-4 h-4" />
            {/* Animated notification dot */}
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-500" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-500 animate-ping opacity-60" />
          </Link>

          {/* User Profile Avatar */}
          <Link
            to="/profile"
            className="flex items-center gap-2 pl-2 border-l border-slate-700/40 ml-0.5"
          >
            <div className="relative">
              <img
                src={user?.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'}
                alt="Avatar"
                className="w-8 h-8 rounded-xl object-cover border border-cyan-500/30 hover:border-cyan-400/60 transition-all duration-200 hover:scale-105"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-900" />
            </div>
            <div className="hidden md:block">
              <p className="text-[11px] font-bold text-white leading-none">{user?.name?.split(' ')[0] || 'User'}</p>
              <p className="text-[9px] text-slate-500 uppercase tracking-wider mt-0.5">{user?.role || 'Student'}</p>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};
