import React from 'react';
import { useAuth } from '../context/AuthContext';
import { StatCard } from '../components/common/StatCard';
import { GlassCard } from '../components/common/GlassCard';
import { WeatherWidget } from '../components/common/WeatherWidget';
import { EmergencyWidget } from '../components/common/EmergencyWidget';
import { OccupancyChart } from '../components/analytics/OccupancyChart';
import { MOCK_BOOKINGS } from '../data/mockData';
import { 
  Users, 
  CalendarCheck, 
  Package, 
  Building2, 
  Navigation, 
  ArrowUpRight, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome Hero Banner */}
      <GlassCard className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950/80 to-cyan-950/70 border-cyan-500/30 p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-bold uppercase tracking-wider font-display">
                {user?.role || 'Student'} Workspace
              </span>
              <span className="text-slate-400 text-xs font-semibold">• {user?.department || 'Computer Science'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display text-white tracking-tight">
              Welcome back, <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-300 bg-clip-text text-transparent">{user?.name || 'Researcher'}</span>!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-xl leading-relaxed">
              Real-time GIS spatial localization active. 5 facility rooms and 8 high-value equipment assets available for reservation today.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Link to="/map" className="btn-gradient px-5 py-3 rounded-xl text-xs font-bold font-display flex items-center justify-center gap-2 flex-1 md:flex-none shadow-glow-cyan">
              <Navigation className="w-4 h-4" /> Live GIS Map
            </Link>
            <Link to="/bookings" className="btn-secondary px-5 py-3 rounded-xl text-xs font-bold font-display flex items-center justify-center gap-2 flex-1 md:flex-none">
              <CalendarCheck className="w-4 h-4 text-cyan-400" /> Book Facility
            </Link>
          </div>
        </div>
      </GlassCard>

      {/* Quick Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Today's Active Bookings"
          value="3 Reservations"
          subtitle="2 Approved • 1 Pending"
          icon={CalendarCheck}
          trend="↑ 12% vs last week"
          color="cyan"
        />
        <StatCard
          title="Live Campus Density"
          value="78% Occupancy"
          subtitle="Peak at Science Block"
          icon={Users}
          trend="Sensor pulse active"
          color="emerald"
        />
        <StatCard
          title="Available Rooms"
          value="18 Classrooms/Labs"
          subtitle="Ready for check-in"
          icon={Building2}
          color="indigo"
        />
        <StatCard
          title="Available Assets"
          value="35 Equipment Kits"
          subtitle="VR, Drones, MacBooks"
          icon={Package}
          color="amber"
        />
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Real-time Occupancy Telemetry Chart */}
          <OccupancyChart />

          {/* Today's Schedule & Bookings Table */}
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm md:text-base font-bold font-display text-white">Your Reserved Facilities & Assets</h3>
                <p className="text-xs text-slate-400">Scheduled for today</p>
              </div>
              <Link to="/bookings" className="text-xs font-bold font-display text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                View All <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {MOCK_BOOKINGS.map((bk) => (
                <div
                  key={bk._id}
                  className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800/80 hover:border-cyan-500/30 flex items-center justify-between gap-4 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      {bk.bookingType === 'Asset' ? <Package className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="text-xs md:text-sm font-bold font-display text-white">
                        {bk.asset?.assetName || bk.room?.roomNumber}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {bk.date} • {bk.startTime} - {bk.endTime}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <span
                      className={`px-3 py-1 rounded-full font-bold font-display text-[10px] ${
                        bk.status === 'Approved'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {bk.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Right Column Side Widgets */}
        <div className="space-y-6">
          <WeatherWidget />
          <EmergencyWidget />

          {/* Quick Actions Card */}
          <GlassCard>
            <h3 className="text-sm font-bold font-display text-white mb-3">Quick Shortcut Actions</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Link
                to="/navigation"
                className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-slate-200 font-semibold flex flex-col items-center justify-center gap-2 transition-all text-center group"
              >
                <Navigation className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span className="font-display">Calculate Route</span>
              </Link>
              <Link
                to="/assets"
                className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/40 text-slate-200 font-semibold flex flex-col items-center justify-center gap-2 transition-all text-center group"
              >
                <Package className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
                <span className="font-display">Reserve Equipment</span>
              </Link>
              <Link
                to="/lost-found"
                className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 text-slate-200 font-semibold flex flex-col items-center justify-center gap-2 transition-all text-center group"
              >
                <Sparkles className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span className="font-display">Lost & Found</span>
              </Link>
              <Link
                to="/help"
                className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/40 text-slate-200 font-semibold flex flex-col items-center justify-center gap-2 transition-all text-center group"
              >
                <ShieldCheck className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
                <span className="font-display">Campus Hotline</span>
              </Link>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

