import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Map, 
  Navigation, 
  Building2, 
  Package, 
  CalendarCheck, 
  BarChart3, 
  ShieldAlert, 
  Bell, 
  Settings, 
  User, 
  LogOut,
  HelpCircle,
  Search,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

export const Sidebar = ({ onItemClick, isMobile = false }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onItemClick) onItemClick();
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Campus Map', path: '/map', icon: Map },
    { label: 'Smart Navigation', path: '/navigation', icon: Navigation },
    { label: 'Buildings & Rooms', path: '/buildings', icon: Building2 },
    { label: 'Asset Management', path: '/assets', icon: Package },
    { label: 'Facility Bookings', path: '/bookings', icon: CalendarCheck },
    { label: 'Spatial Analytics', path: '/analytics', icon: BarChart3 },
    ...(user?.role === 'Administrator' ? [{ label: 'Admin Control Panel', path: '/admin', icon: ShieldAlert }] : []),
    { label: 'Notifications', path: '/notifications', icon: Bell },
    { label: 'Lost & Found', path: '/lost-found', icon: Search },
    { label: 'Campus Events', path: '/events', icon: Sparkles },
    { label: 'Help & Emergency', path: '/help', icon: HelpCircle },
    { label: 'Settings', path: '/settings', icon: Settings },
    { label: 'Profile', path: '/profile', icon: User }
  ];

  const containerClasses = isMobile
    ? 'w-full h-full flex flex-col justify-between p-4'
    : 'w-64 glass-panel border-r border-slate-200/50 dark:border-slate-800/80 flex flex-col justify-between p-4 h-[calc(100vh-4.5rem)] sticky top-16 hidden lg:flex';

  return (
    <aside className={containerClasses}>
      <div className="space-y-1 overflow-y-auto pr-1">
        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-display">
          Navigation Directory
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onItemClick}
              className={({ isActive }) =>
                `relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-400 border border-cyan-500/30 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Logout Action */}
      <div className="pt-3 border-t border-slate-200/50 dark:border-slate-800/80">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

