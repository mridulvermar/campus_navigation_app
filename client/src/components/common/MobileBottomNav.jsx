import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Map, Navigation, CalendarCheck, Menu } from 'lucide-react';
import { motion } from 'framer-motion';

export const MobileBottomNav = ({ onOpenDrawer }) => {
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Map', path: '/map', icon: Map },
    { label: 'Navigate', path: '/navigation', icon: Navigation },
    { label: 'Bookings', path: '/bookings', icon: CalendarCheck },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden px-4 pb-4 pt-1 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent pointer-events-none">
      <nav className="pointer-events-auto max-w-md mx-auto glass-panel dark:bg-slate-900/90 rounded-2xl p-2 border border-slate-200/50 dark:border-slate-800/80 shadow-2xl backdrop-blur-xl flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className="relative flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all"
            >
              {isActive && (
                <motion.div
                  layoutId="mobileNavPill"
                  className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 rounded-xl"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'text-cyan-400 scale-110' : 'text-slate-400'}`} />
              <span className={`text-[10px] font-semibold mt-1 transition-colors ${isActive ? 'text-cyan-400' : 'text-slate-400'}`}>
                {item.label}
              </span>
            </NavLink>
          );
        })}

        {/* Hamburger Menu Toggle Button */}
        <button
          onClick={onOpenDrawer}
          className="flex flex-col items-center justify-center py-1.5 px-3 rounded-xl text-slate-400 hover:text-cyan-400 transition-colors"
          aria-label="Open Mobile Menu"
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-1">Menu</span>
        </button>
      </nav>
    </div>
  );
};
