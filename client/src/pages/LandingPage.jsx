import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Navigation, ShieldCheck, MapPin, Cpu, Users, CalendarCheck, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { GlassCard } from '../components/common/GlassCard';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* Top Floating Glass Navigation Header */}
      <header className="fixed top-3 left-3 right-3 md:top-4 md:left-4 md:right-4 z-50 max-w-7xl mx-auto glass-panel rounded-2xl px-4 md:px-6 py-3 flex items-center justify-between border border-white/10 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30">
            <Compass className="w-5 h-5 md:w-6 md:h-6 animate-spin-slow" />
          </div>
          <span className="text-lg md:text-xl font-black font-display bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent tracking-tight">
            CampusNav GIS
          </span>
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          <Link to="/login" className="text-xs font-bold font-display text-slate-300 hover:text-white transition-colors">
            Sign In
          </Link>
          <Link to="/dashboard" className="btn-gradient px-4 md:px-5 py-2 rounded-xl text-xs font-bold font-display uppercase tracking-wider">
            Launch Portal
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 md:pt-36 pb-16 md:pb-20 px-4 md:px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10 md:gap-12">
        <div className="flex-1 space-y-5 md:space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold font-display">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span>Next-Gen Enterprise Spatial Localization Ecosystem</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black font-display tracking-tight leading-tight">
            Intelligent Multi-Modal <br />
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Campus Spatial Analytics
            </span>
          </h1>

          <p className="text-slate-400 text-xs sm:text-sm md:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Unifying smart indoor & outdoor Leaflet navigation, real-time spatial telemetry, automated facility reservations, and high-value asset tracking for modern universities.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
            <Link to="/map" className="w-full sm:w-auto btn-gradient px-8 py-3.5 rounded-2xl font-bold font-display text-sm flex items-center justify-center gap-2 shadow-glow-cyan">
              <Navigation className="w-4 h-4" /> Explore Interactive Map
            </Link>
            <Link to="/login" className="w-full sm:w-auto px-8 py-3.5 rounded-2xl btn-secondary font-bold font-display text-sm flex items-center justify-center gap-2">
              <span>Member Sign In</span> <ArrowRight className="w-4 h-4 text-cyan-400" />
            </Link>
          </div>
        </div>

        {/* Animated University Illustration / Live Telemetry Mock */}
        <div className="flex-1 w-full max-w-lg">
          <GlassCard className="relative p-6 border-cyan-500/30 shadow-2xl bg-gradient-to-br from-slate-900/90 to-slate-950">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Live Spatial Telemetry Feed</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                100% Online
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="text-slate-300 font-semibold">Science Block A Clean Lab</span>
                <span className="text-rose-400 font-bold font-mono">92% Occupancy</span>
              </div>
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="text-slate-300 font-semibold">MacBook Pro M3 Lab Kit #4</span>
                <span className="text-emerald-400 font-bold font-mono">Available</span>
              </div>
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="text-slate-300 font-semibold">Active Turn-by-Turn Routes</span>
                <span className="text-cyan-400 font-bold font-mono">312 Pedestrians</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-center">
              <img
                src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=800"
                alt="University Building"
                className="w-full h-48 object-cover rounded-xl border border-slate-700"
              />
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">Engineered for Academic Excellence</h2>
          <p className="text-xs md:text-sm text-slate-400 mt-2">Comprehensive suite of spatial, administrative, and reservation modules.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard>
            <div className="p-3 w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 mb-4 border border-cyan-500/30 flex items-center justify-center">
              <Navigation className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">GIS Turn-by-Turn Routing</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Haversine pathing with turn-by-turn indoor & outdoor spatial directions, emergency exit alerts, and live walking ETAs.
            </p>
          </GlassCard>

          <GlassCard>
            <div className="p-3 w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 mb-4 border border-indigo-500/30 flex items-center justify-center">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Facility & Room Reservation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Reserve classrooms, auditoriums, labs, and seminar halls with automated role-based approval workflows and QR check-ins.
            </p>
          </GlassCard>

          <GlassCard>
            <div className="p-3 w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 mb-4 border border-emerald-500/30 flex items-center justify-center">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">Asset Inventory & QR Codes</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Reserve high-value laptops, VR headsets, 3D printers, and survey drones with instant digital QR verification cards.
            </p>
          </GlassCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-800 text-center text-xs text-slate-500">
        <p>© 2026 Multi-Modal Campus Navigation Ecosystem. Built for University Excellence.</p>
      </footer>
    </div>
  );
};
