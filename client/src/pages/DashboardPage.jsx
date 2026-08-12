import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { StatCard } from '../components/common/StatCard';
import { GlassCard } from '../components/common/GlassCard';
import { WeatherWidget } from '../components/common/WeatherWidget';
import { EmergencyWidget } from '../components/common/EmergencyWidget';
import { OccupancyChart } from '../components/analytics/OccupancyChart';
import { MOCK_BOOKINGS } from '../data/mockData';
import { apiService } from '../services/api';
import {
  Users,
  CalendarCheck,
  Package,
  Building2,
  Navigation,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  Loader2,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } }
};

const STATUS_CONFIG = {
  Approved: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/25', icon: CheckCircle2 },
  Rejected: { bg: 'bg-rose-500/15', text: 'text-rose-400', border: 'border-rose-500/25', icon: AlertCircle },
  Pending: { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/25', icon: Clock },
};

export const DashboardPage = () => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await apiService.getMyBookings();
      if (res && res.data && Array.isArray(res.data)) {
        setBookings(res.data);
      } else {
        setBookings(MOCK_BOOKINGS);
      }
    } catch (err) {
      console.error('[DashboardPage fetch error]', err);
      setBookings(MOCK_BOOKINGS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    if (!socket) return;
    const handleNewBooking = (newBooking) => {
      setBookings((prev) => [newBooking, ...prev]);
    };
    const handleStatusChange = (updatedBooking) => {
      setBookings((prev) =>
        prev.map((b) => (b._id === updatedBooking._id ? { ...b, ...updatedBooking } : b))
      );
    };
    socket.on('new_booking_request', handleNewBooking);
    socket.on('booking_status_change', handleStatusChange);
    return () => {
      socket.off('new_booking_request', handleNewBooking);
      socket.off('booking_status_change', handleStatusChange);
    };
  }, [socket]);

  const approvedCount = bookings.filter(b => b.status === 'Approved').length;
  const pendingCount = bookings.filter(b => b.status === 'Pending').length;
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-6">

      {/* ── Hero Welcome Banner ────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-700/40"
        style={{
          background: 'linear-gradient(135deg, rgba(6,182,212,0.08) 0%, rgba(15,23,42,0.95) 40%, rgba(99,102,241,0.10) 100%)',
          backdropFilter: 'blur(20px)'
        }}
      >
        {/* Decorative ambient orbs */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #06b6d4, transparent)', filter: 'blur(50px)', transform: 'translate(30%, -30%)' }} />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent)', filter: 'blur(40px)', transform: 'translate(-30%, 30%)' }} />

        <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/25 text-[10px] font-bold uppercase tracking-wider font-display">
                {user?.role || 'Student'} Workspace
              </span>
              <span className="text-slate-500 text-xs font-semibold">• {user?.department || 'Computer Science'}</span>
              <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display text-white tracking-tight">
              {greeting},{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-300 bg-clip-text text-transparent">
                {user?.name?.split(' ')[0] || 'Researcher'}
              </span>!
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl leading-relaxed">
              Real-time GIS spatial localization active. Connected to MongoDB Atlas & Socket.IO real-time ecosystem.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Link to="/map"
              className="btn-gradient px-5 py-2.5 rounded-xl text-xs font-bold font-display flex items-center justify-center gap-2 flex-1 md:flex-none"
            >
              <Navigation className="w-4 h-4" /> Live GIS Map
            </Link>
            <Link to="/bookings"
              className="btn-secondary px-5 py-2.5 rounded-xl text-xs font-bold font-display flex items-center justify-center gap-2 flex-1 md:flex-none"
            >
              <CalendarCheck className="w-4 h-4 text-cyan-400" /> Book Facility
            </Link>
          </div>
        </div>
      </div>

      {/* ── Quick Stat Cards ────────────────────────────────── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <motion.div variants={itemVariants}>
          <StatCard
            title="Today's Active Bookings"
            value={`${bookings.length}`}
            subtitle={`${approvedCount} Approved • ${pendingCount} Pending`}
            icon={CalendarCheck}
            trend="Real-time sync"
            color="cyan"
            progress={bookings.length > 0 ? (approvedCount / Math.max(bookings.length, 1)) * 100 : 0}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            title="Live Campus Density"
            value="78%"
            subtitle="Peak at Science Block"
            icon={Users}
            trend="Sensor pulse active"
            color="emerald"
            progress={78}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            title="Available Rooms"
            value="18"
            subtitle="Classrooms & Labs ready"
            icon={Building2}
            color="indigo"
            progress={42}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            title="Available Assets"
            value="35"
            subtitle="VR, Drones, MacBooks"
            icon={Package}
            color="amber"
            progress={58}
          />
        </motion.div>
      </motion.div>

      {/* ── Main Grid ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left 2 Columns */}
        <div className="lg:col-span-2 space-y-6">
          <OccupancyChart />

          {/* Bookings Table */}
          <GlassCard hover={false}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-sm md:text-base font-bold font-display text-white">Your Reserved Facilities & Assets</h3>
                <p className="text-xs text-slate-500 mt-0.5">Scheduled in database</p>
              </div>
              <Link to="/bookings" className="text-xs font-bold font-display text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors">
                View All <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="p-8 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
                <span className="text-xs">Loading your reservations...</span>
              </div>
            ) : bookings.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-12 h-12 rounded-2xl bg-slate-800/60 flex items-center justify-center mx-auto mb-3">
                  <CalendarCheck className="w-6 h-6 text-slate-600" />
                </div>
                <p className="text-xs text-slate-400">No reservations found.</p>
                <Link to="/bookings" className="text-xs text-cyan-400 hover:underline mt-1 inline-block">Create your first booking →</Link>
              </div>
            ) : (
              <div className="space-y-2.5">
                {bookings.map((bk) => {
                  const statusCfg = STATUS_CONFIG[bk.status] || STATUS_CONFIG.Pending;
                  const StatusIcon = statusCfg.icon;
                  return (
                    <motion.div
                      key={bk._id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/70 hover:border-slate-700/70 flex items-center justify-between gap-4 transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex-shrink-0">
                          {bk.bookingType === 'Asset' ? <Package className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs md:text-sm font-bold font-display text-white truncate">
                            {bk.asset?.assetName || bk.room?.roomNumber || bk.purpose || 'Campus Reservation'}
                          </h4>
                          <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                            <span>{bk.date || 'Today'}</span>
                            <span className="text-slate-700">•</span>
                            <span>{bk.startTime || '--'} – {bk.endTime || '--'}</span>
                          </p>
                        </div>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] flex items-center gap-1 flex-shrink-0 ${statusCfg.bg} ${statusCfg.text} border ${statusCfg.border}`}>
                        <StatusIcon className="w-3 h-3" />
                        {bk.status}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </GlassCard>
        </div>

        {/* Right Column Widgets */}
        <div className="space-y-5">
          <WeatherWidget />
          <EmergencyWidget />

          {/* Quick Actions */}
          <GlassCard hover={false}>
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold font-display text-white">Quick Actions</h3>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { to: '/navigation', icon: Navigation, label: 'Calculate Route', color: 'cyan' },
                { to: '/assets', icon: Package, label: 'Reserve Equipment', color: 'indigo' },
                { to: '/lost-found', icon: Sparkles, label: 'Lost & Found', color: 'emerald' },
                { to: '/help', icon: ShieldCheck, label: 'Campus Hotline', color: 'amber' },
              ].map(({ to, icon: Icon, label, color }) => (
                <Link
                  key={to}
                  to={to}
                  className={`p-3 rounded-xl bg-slate-900/70 hover:bg-slate-800/80 border border-slate-800/60 hover:border-${color}-500/30 text-slate-300 hover:text-white font-semibold flex flex-col items-center justify-center gap-2 transition-all text-center group`}
                >
                  <Icon className={`w-5 h-5 text-${color}-400 group-hover:scale-110 transition-transform duration-200`} />
                  <span className="font-display text-[11px]">{label}</span>
                </Link>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
