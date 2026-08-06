import React from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { Compass, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-950">
      <GlassCard className="max-w-md w-full text-center p-8 border-cyan-500/30">
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mx-auto mb-4">
          <Compass className="w-8 h-8 animate-spin-slow" />
        </div>
        <h1 className="text-4xl font-black text-white mb-2">404</h1>
        <h3 className="text-lg font-bold text-slate-200 mb-2">Spatial Coordinate Off-Grid</h3>
        <p className="text-xs text-slate-400 mb-6">
          The requested campus navigation route or resource URL does not exist.
        </p>
        <Link to="/dashboard" className="btn-gradient px-6 py-3 rounded-xl font-bold text-xs inline-flex items-center gap-2">
          <Home className="w-4 h-4" /> Return to Main Dashboard
        </Link>
      </GlassCard>
    </div>
  );
};
