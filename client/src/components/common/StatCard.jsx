import React from 'react';
import { GlassCard } from './GlassCard';

export const StatCard = ({ title, value, subtitle, icon: Icon, trend, color = 'cyan' }) => {
  const colorMap = {
    cyan: 'from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30 shadow-glow-cyan',
    emerald: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30 shadow-glow-emerald',
    indigo: 'from-indigo-500/20 to-purple-500/20 text-indigo-400 border-indigo-500/30 shadow-glow-indigo',
    amber: 'from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30',
    rose: 'from-rose-500/20 to-pink-500/20 text-rose-400 border-rose-500/30'
  };

  return (
    <GlassCard className="relative overflow-hidden group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-display mb-1">{title}</p>
          <h3 className="text-xl md:text-2xl font-black font-display text-slate-900 dark:text-white tracking-tight">{value}</h3>
          {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-2xl bg-gradient-to-br ${colorMap[color]} border shadow-inner transition-transform duration-300 group-hover:scale-110`}>
          <Icon className="w-5 h-5 md:w-6 md:h-6" />
        </div>
      </div>
      {trend && (
        <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center text-xs text-cyan-400 font-semibold">
          <span>{trend}</span>
        </div>
      )}
    </GlassCard>
  );
};

