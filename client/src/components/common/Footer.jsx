import React from 'react';
import { Compass, ShieldCheck, Heart, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="glass-panel border-t border-slate-200/50 dark:border-slate-800/50 mt-16 px-6 md:px-12 py-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 border border-cyan-500/30">
              <Compass className="w-5 h-5" />
            </div>
            <span className="text-base font-extrabold text-white">CampusNav GIS</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Multi-Modal Campus Navigation and Facility Asset Booking Ecosystem Utilizing Real-Time Spatial Localization Analytics.
          </p>
        </div>

        <div>
          <h5 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-3">Core Modules</h5>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><Link to="/map" className="hover:text-white transition-colors">Spatial GIS Map</Link></li>
            <li><Link to="/navigation" className="hover:text-white transition-colors">Turn-by-Turn Routing</Link></li>
            <li><Link to="/assets" className="hover:text-white transition-colors">Asset Inventory</Link></li>
            <li><Link to="/bookings" className="hover:text-white transition-colors">Facility Reservations</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-3">Admin & Analytics</h5>
          <ul className="space-y-2 text-xs text-slate-400">
            <li><Link to="/analytics" className="hover:text-white transition-colors">Live Occupancy Telemetry</Link></li>
            <li><Link to="/admin" className="hover:text-white transition-colors">Admin Request Approvals</Link></li>
            <li><Link to="/lost-found" className="hover:text-white transition-colors">Lost & Found Board</Link></li>
            <li><Link to="/help" className="hover:text-white transition-colors">Security & Hotline</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-3">System Compliance</h5>
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Production Ready v1.0.0</span>
            </div>
            <p className="text-[11px]">OAuth 2.0 / JWT Auth / Leaflet 1.9 / Socket.IO Enabled</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>© 2026 Campus Spatial Analytics Platform. All rights reserved.</p>
        <p className="flex items-center gap-1">
          Designed with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> for University Enterprise
        </p>
      </div>
    </footer>
  );
};
