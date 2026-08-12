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
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

const navGroups = [
  {
    label: 'Core',
    items: [
      { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { label: 'Campus Map', path: '/map', icon: Map },
      { label: 'Smart Navigation', path: '/navigation', icon: Navigation },
    ]
  },
  {
    label: 'Facilities',
    items: [
      { label: 'Buildings & Rooms', path: '/buildings', icon: Building2 },
      { label: 'Asset Management', path: '/assets', icon: Package },
      { label: 'Facility Bookings', path: '/bookings', icon: CalendarCheck },
    ]
  },
  {
    label: 'Insights',
    items: [
      { label: 'Spatial Analytics', path: '/analytics', icon: BarChart3 },
      { label: 'Notifications', path: '/notifications', icon: Bell },
      { label: 'Campus Events', path: '/events', icon: Sparkles },
    ]
  },
  {
    label: 'More',
    items: [
      { label: 'Lost & Found', path: '/lost-found', icon: Search },
      { label: 'Help & Emergency', path: '/help', icon: HelpCircle },
      { label: 'Settings', path: '/settings', icon: Settings },
      { label: 'Profile', path: '/profile', icon: User },
    ]
  }
];

const ROLE_COLORS = {
  Administrator: { bg: 'bg-rose-500/15', text: 'text-rose-400', border: 'border-rose-500/25' },
  Faculty: { bg: 'bg-indigo-500/15', text: 'text-indigo-400', border: 'border-indigo-500/25' },
  Student: { bg: 'bg-cyan-500/15', text: 'text-cyan-400', border: 'border-cyan-500/25' },
};

export const Sidebar = ({ onItemClick, isMobile = false }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onItemClick) onItemClick();
    logout();
    navigate('/login');
  };

  const roleStyle = ROLE_COLORS[user?.role] || ROLE_COLORS.Student;

  const allNavGroups = [
    ...navGroups.slice(0, 2),
    ...(user?.role === 'Administrator'
      ? [{ label: 'Admin', items: [{ label: 'Admin Control Panel', path: '/admin', icon: ShieldAlert }] }]
      : []),
    ...navGroups.slice(2),
  ];

  const containerClasses = isMobile
    ? 'w-full h-full flex flex-col justify-between p-3'
    : 'w-64 glass-surface flex flex-col justify-between p-3 h-[calc(100vh-4rem)] sticky top-16 hidden lg:flex rounded-2xl';

  return (
    <aside className={containerClasses}>
      {/* User Profile Mini-Card */}
      <div>
        <div className="mb-4 p-3 rounded-xl bg-gradient-to-br from-slate-800/80 to-slate-900/60 border border-slate-700/40 flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <img
              src={user?.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'}
              alt="Avatar"
              className="w-9 h-9 rounded-xl object-cover border-2 border-cyan-500/30"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-bold text-white truncate">{user?.name || 'Campus User'}</p>
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${roleStyle.bg} ${roleStyle.text} ${roleStyle.border} border`}>
              {user?.role || 'Student'}
            </span>
          </div>
        </div>

        {/* Navigation Groups */}
        <nav className="space-y-4 overflow-y-auto pr-0.5" style={{ maxHeight: 'calc(100vh - 14rem)' }}>
          {allNavGroups.map((group) => (
            <div key={group.label}>
              <div className="px-2 pb-1 text-[9px] font-black uppercase tracking-[0.15em] text-slate-500 font-display">
                {group.label}
              </div>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={onItemClick}
                      className={({ isActive }) =>
                        `relative flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12px] font-semibold transition-all duration-200 group ${
                          isActive
                            ? 'bg-gradient-to-r from-cyan-500/20 via-indigo-500/15 to-purple-500/10 text-cyan-300 border border-cyan-500/25 shadow-glow-cyan'
                            : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 border border-transparent'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <motion.div
                              layoutId="sidebarActiveIndicator"
                              className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/10 to-transparent pointer-events-none"
                              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                            />
                          )}
                          <Icon className={`w-4 h-4 flex-shrink-0 transition-all duration-200 ${isActive ? 'text-cyan-400 scale-110' : 'text-slate-500 group-hover:text-slate-300 group-hover:scale-105'}`} />
                          <span className="flex-1 truncate">{item.label}</span>
                          {isActive && <ChevronRight className="w-3 h-3 text-cyan-500/60" />}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Logout Action */}
      <div className="pt-3 mt-3 border-t border-slate-800/60">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[12px] font-semibold text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer group"
        >
          <LogOut className="w-4 h-4 group-hover:scale-105 transition-transform" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
