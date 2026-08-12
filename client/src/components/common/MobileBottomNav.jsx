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
    <div className="fixed bottom-4 left-4 right-4 z-40 lg:hidden pointer-events-none">
      <nav className="pointer-events-auto max-w-sm mx-auto rounded-2xl border border-slate-700/50 shadow-2xl flex items-center justify-around p-1.5 gap-1"
        style={{
          background: 'rgba(8, 12, 24, 0.92)',
          backdropFilter: 'blur(24px) saturate(180%)',
          boxShadow: '0 24px 60px -12px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.06)'
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className="relative flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all flex-1"
            >
              {isActive && (
                <motion.div
                  layoutId="mobileNavPill"
                  className="absolute inset-0 rounded-xl bg-gradient-to-b from-cyan-500/20 to-indigo-500/10 border border-cyan-500/30"
                  transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                  style={{ boxShadow: '0 0 12px rgba(6, 182, 212, 0.2)' }}
                />
              )}
              <motion.div
                animate={isActive ? { scale: 1.1, y: -1 } : { scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              >
                <Icon className={`w-5 h-5 transition-colors duration-200 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
              </motion.div>
              <span className={`text-[10px] font-bold mt-0.5 transition-colors duration-200 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`}>
                {item.label}
              </span>
            </NavLink>
          );
        })}

        {/* Hamburger Menu */}
        <button
          onClick={onOpenDrawer}
          className="flex flex-col items-center justify-center py-1.5 px-3 rounded-xl text-slate-500 hover:text-slate-300 hover:bg-slate-800/60 transition-all flex-1"
          aria-label="Open Mobile Menu"
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-0.5">More</span>
        </button>
      </nav>
    </div>
  );
};
