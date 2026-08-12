import React from 'react';
import { motion } from 'framer-motion';
import {
  Compass, Navigation, ShieldCheck, MapPin, Cpu, Users,
  CalendarCheck, ArrowRight, Sparkles, Building2, Wifi,
  Map, BarChart3, Package, Zap, ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const FEATURES = [
  {
    icon: Navigation,
    title: 'GIS Turn-by-Turn Routing',
    desc: 'Dijkstra-powered real-time pathfinding with walking ETAs, dual pedestrian & vehicle modes, and live turn directions across the entire campus graph.',
    color: 'cyan',
    gradient: 'from-cyan-500/20 to-sky-500/10',
    border: 'border-cyan-500/20',
    iconBg: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/25',
  },
  {
    icon: CalendarCheck,
    title: 'Facility & Room Reservation',
    desc: 'Reserve classrooms, auditoriums, labs, and seminar halls from 428+ venues with automated role-based approval workflows and QR check-ins.',
    color: 'indigo',
    gradient: 'from-indigo-500/20 to-purple-500/10',
    border: 'border-indigo-500/20',
    iconBg: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/25',
  },
  {
    icon: Cpu,
    title: 'Smart Asset Inventory',
    desc: 'Reserve high-value lab kits — VR headsets, 3D printers, survey drones — with instant QR digital verification cards and live tracking.',
    color: 'emerald',
    gradient: 'from-emerald-500/20 to-teal-500/10',
    border: 'border-emerald-500/20',
    iconBg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
  },
  {
    icon: BarChart3,
    title: 'Spatial Occupancy Analytics',
    desc: 'Real-time density telemetry for every block on campus — from lecture theatres to libraries — powered by Socket.IO live data streams.',
    color: 'amber',
    gradient: 'from-amber-500/20 to-orange-500/10',
    border: 'border-amber-500/20',
    iconBg: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
  },
  {
    icon: ShieldCheck,
    title: 'Role-Based Access Control',
    desc: 'Multi-tier access: Students, Faculty, and Administrators each receive scoped capabilities with JWT-authenticated sessions.',
    color: 'rose',
    gradient: 'from-rose-500/20 to-pink-500/10',
    border: 'border-rose-500/20',
    iconBg: 'bg-rose-500/15 text-rose-400 border-rose-500/25',
  },
  {
    icon: Wifi,
    title: 'Real-Time Socket.IO',
    desc: 'Live bidirectional data over Socket.IO — instant booking confirmations, status updates, and occupancy changes with zero page refresh.',
    color: 'purple',
    gradient: 'from-purple-500/20 to-indigo-500/10',
    border: 'border-purple-500/20',
    iconBg: 'bg-purple-500/15 text-purple-400 border-purple-500/25',
  },
];

const STATS = [
  { value: '428+', label: 'Campus Rooms', icon: Building2 },
  { value: '2,400+', label: 'Active Students', icon: Users },
  { value: '97', label: 'Map Waypoints', icon: MapPin },
  { value: '100%', label: 'Live Sync', icon: Wifi },
];

const LIVE_FEED = [
  { label: 'Science Block A — Clean Lab', status: '92% Occupancy', color: 'text-rose-400' },
  { label: 'MacBook Pro M3 Lab Kit #4', status: 'Available ✓', color: 'text-emerald-400' },
  { label: 'Active Routing Sessions', status: '312 Pedestrians', color: 'text-cyan-400' },
  { label: 'Pending Reservations', status: '14 Awaiting', color: 'text-amber-400' },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
};

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-hidden">

      {/* ── Ambient Background ─────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-15%] left-[-10%] w-[700px] h-[700px] rounded-full opacity-[0.08]"
          style={{ background: 'radial-gradient(circle, #06b6d4, transparent 60%)', filter: 'blur(80px)' }} />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full opacity-[0.08]"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent 60%)', filter: 'blur(80px)' }} />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'linear-gradient(rgba(6,182,212,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.5) 1px, transparent 1px)',
            backgroundSize: '80px 80px'
          }}
        />
      </div>

      {/* ── Top Navigation ─────────────────────────────────── */}
      <header className="fixed top-3 left-3 right-3 md:top-4 md:left-6 md:right-6 z-50 max-w-7xl mx-auto glass-panel rounded-2xl px-4 md:px-6 py-3 flex items-center justify-between border border-white/8 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 md:w-10 md:h-10">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 opacity-50 blur-sm animate-glow-pulse" />
            <div className="relative w-full h-full rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 flex items-center justify-center text-white">
              <Compass className="w-5 h-5 md:w-6 md:h-6 animate-spin-slow" />
            </div>
          </div>
          <span className="text-lg md:text-xl font-black font-display bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent tracking-tight">
            CampusNav GIS
          </span>
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          <Link to="/login" className="text-xs font-bold text-slate-400 hover:text-white transition-colors hidden sm:block">
            Sign In
          </Link>
          <Link to="/dashboard" className="btn-gradient px-4 md:px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider">
            Launch Portal
          </Link>
        </div>
      </header>

      {/* ── Hero Section ───────────────────────────────────── */}
      <section className="relative pt-28 md:pt-36 pb-16 px-4 md:px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10 md:gap-16">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex-1 space-y-5 text-center lg:text-left"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/15 to-indigo-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-bold font-display">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>Next-Gen Enterprise Spatial Localization Ecosystem</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-black font-display tracking-tighter leading-[1.05]">
            Intelligent
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent animate-gradient-x">
              Campus Spatial
            </span>
            <br />
            <span className="text-white">Analytics</span>
          </h1>

          <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Unifying smart indoor & outdoor Leaflet navigation, real-time spatial telemetry, automated facility reservations, and high-value asset tracking for modern universities.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
            <Link to="/map" className="w-full sm:w-auto btn-gradient px-8 py-3.5 rounded-2xl font-bold font-display text-sm flex items-center justify-center gap-2">
              <Navigation className="w-4 h-4" />
              <span>Explore Campus Map</span>
            </Link>
            <Link to="/login" className="w-full sm:w-auto px-8 py-3.5 rounded-2xl btn-secondary font-bold font-display text-sm flex items-center justify-center gap-2">
              <span>Member Sign In</span>
              <ArrowRight className="w-4 h-4 text-cyan-400" />
            </Link>
          </div>

          {/* Mini stat strip */}
          <div className="flex items-center justify-center lg:justify-start gap-6 pt-2">
            {[{ v: '428+', l: 'Rooms' }, { v: '2.4K', l: 'Users' }, { v: '97', l: 'Waypoints' }].map(({ v, l }) => (
              <div key={l} className="text-center">
                <div className="text-lg font-black text-white">{v}</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">{l}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right: Live Telemetry Mock Card */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
          className="flex-1 w-full max-w-md"
        >
          <div className="rounded-2xl border border-slate-700/50 overflow-hidden"
            style={{
              background: 'rgba(10, 14, 28, 0.90)',
              backdropFilter: 'blur(24px)',
              boxShadow: '0 32px 80px -16px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.05)'
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800/60 bg-slate-900/30">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest">Live Spatial Telemetry</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                100% Online
              </span>
            </div>

            {/* Feed */}
            <div className="p-4 space-y-2.5">
              {LIVE_FEED.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-center justify-between p-3 bg-slate-900/70 rounded-xl border border-slate-800/60 hover:border-slate-700/60 transition-all"
                >
                  <span className="text-xs text-slate-300 font-semibold">{item.label}</span>
                  <span className={`text-xs font-bold font-mono ${item.color}`}>{item.status}</span>
                </motion.div>
              ))}
            </div>

            {/* Map preview */}
            <div className="px-4 pb-4">
              <div className="relative rounded-xl overflow-hidden border border-slate-700/50">
                <img
                  src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800"
                  alt="University Building"
                  className="w-full h-40 object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span className="text-[11px] text-cyan-300 font-semibold">Campus Navigation Active</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Stats Bar ──────────────────────────────────────── */}
      <section className="py-10 px-4 md:px-6 border-y border-slate-800/50 bg-slate-900/20">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map(({ value, label, icon: Icon }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.08 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mb-3 mx-auto">
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-2xl md:text-3xl font-black text-white">{value}</div>
              <div className="text-[11px] text-slate-500 uppercase tracking-wider mt-1">{label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Features Grid ──────────────────────────────────── */}
      <section className="py-20 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-bold mb-4">
            <Zap className="w-3.5 h-3.5" />
            <span>Platform Capabilities</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">Engineered for Academic Excellence</h2>
          <p className="text-sm text-slate-400 mt-3 leading-relaxed">
            Comprehensive suite of spatial, administrative, and reservation modules — built for modern universities.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className={`relative p-6 rounded-2xl border ${feature.border} bg-gradient-to-br ${feature.gradient} hover:scale-[1.02] transition-all duration-300 cursor-default group overflow-hidden`}
                style={{ background: 'rgba(13, 19, 36, 0.7)', backdropFilter: 'blur(12px)' }}
              >
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <div className="relative z-10">
                  <div className={`inline-flex p-3 rounded-xl ${feature.iconBg} border mb-4`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{feature.desc}</p>
                </div>
                <div className="relative z-10 mt-4 flex items-center gap-1 text-[11px] text-slate-500 group-hover:text-slate-400 transition-colors">
                  <span>Learn more</span>
                  <ArrowUpRight className="w-3 h-3" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* ── CTA Banner ─────────────────────────────────────── */}
      <section className="py-16 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden border border-slate-700/40 p-10 md:p-16 text-center"
          style={{
            background: 'linear-gradient(135deg, rgba(6,182,212,0.08) 0%, rgba(99,102,241,0.10) 50%, rgba(168,85,247,0.08) 100%)',
            backdropFilter: 'blur(20px)'
          }}
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full opacity-10"
              style={{ background: 'radial-gradient(circle, #06b6d4, transparent)', filter: 'blur(40px)' }} />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full opacity-10"
              style={{ background: 'radial-gradient(circle, #a855f7, transparent)', filter: 'blur(40px)' }} />
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
              Ready to Navigate
              <br />
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Your Campus?
              </span>
            </h2>
            <p className="text-slate-400 text-sm mb-8 max-w-lg mx-auto">
              Join thousands of students and faculty using CampusNav GIS for smarter campus life.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/map" className="btn-gradient px-8 py-3.5 rounded-2xl font-bold text-sm flex items-center gap-2">
                <Map className="w-4 h-4" /> Open Live Map
              </Link>
              <Link to="/login" className="btn-secondary px-8 py-3.5 rounded-2xl font-bold text-sm flex items-center gap-2">
                <ArrowRight className="w-4 h-4" /> Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="py-8 border-t border-slate-800/50 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-cyan-500/60" />
            <span>© 2026 CampusNav GIS — Multi-Modal Campus Navigation Ecosystem</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="hover:text-slate-300 transition-colors">Sign In</Link>
            <Link to="/map" className="hover:text-slate-300 transition-colors">Map</Link>
            <Link to="/help" className="hover:text-slate-300 transition-colors">Help</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
