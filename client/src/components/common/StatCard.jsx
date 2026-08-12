import React from 'react';
import { GlassCard } from './GlassCard';
import { TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const COLOR_CONFIG = {
  cyan: {
    gradient: 'from-cyan-500/20 via-cyan-500/10 to-transparent',
    icon: 'from-cyan-500/25 to-sky-500/15 text-cyan-400 border-cyan-500/30',
    glow: 'shadow-glow-cyan',
    bar: 'from-cyan-500 to-sky-400',
    text: 'text-cyan-400',
    ring: 'ring-cyan-500/20',
  },
  emerald: {
    gradient: 'from-emerald-500/20 via-emerald-500/10 to-transparent',
    icon: 'from-emerald-500/25 to-teal-500/15 text-emerald-400 border-emerald-500/30',
    glow: 'shadow-glow-emerald',
    bar: 'from-emerald-500 to-teal-400',
    text: 'text-emerald-400',
    ring: 'ring-emerald-500/20',
  },
  indigo: {
    gradient: 'from-indigo-500/20 via-indigo-500/10 to-transparent',
    icon: 'from-indigo-500/25 to-purple-500/15 text-indigo-400 border-indigo-500/30',
    glow: 'shadow-glow-indigo',
    bar: 'from-indigo-500 to-purple-400',
    text: 'text-indigo-400',
    ring: 'ring-indigo-500/20',
  },
  amber: {
    gradient: 'from-amber-500/20 via-amber-500/10 to-transparent',
    icon: 'from-amber-500/25 to-orange-500/15 text-amber-400 border-amber-500/30',
    glow: 'shadow-glow-amber',
    bar: 'from-amber-500 to-orange-400',
    text: 'text-amber-400',
    ring: 'ring-amber-500/20',
  },
  rose: {
    gradient: 'from-rose-500/20 via-rose-500/10 to-transparent',
    icon: 'from-rose-500/25 to-pink-500/15 text-rose-400 border-rose-500/30',
    glow: 'shadow-glow-purple',
    bar: 'from-rose-500 to-pink-400',
    text: 'text-rose-400',
    ring: 'ring-rose-500/20',
  },
};

export const StatCard = ({ title, value, subtitle, icon: Icon, trend, color = 'cyan', progress }) => {
  const cfg = COLOR_CONFIG[color] || COLOR_CONFIG.cyan;

  return (
    <GlassCard className={`relative overflow-hidden group shimmer`} hover>
      {/* Ambient background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${cfg.gradient} opacity-60 pointer-events-none transition-opacity duration-300 group-hover:opacity-100`} />

      <div className="relative z-10 flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 font-display mb-2">{title}</p>
          <h3 className="text-xl md:text-2xl font-black font-display text-slate-900 dark:text-white tracking-tight leading-none">{value}</h3>
          {subtitle && (
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 font-medium leading-snug">{subtitle}</p>
          )}
        </div>
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className={`p-3 rounded-2xl bg-gradient-to-br ${cfg.icon} border flex-shrink-0 ml-3`}
        >
          <Icon className="w-5 h-5 md:w-6 md:h-6" />
        </motion.div>
      </div>

      {/* Progress Bar */}
      {progress !== undefined && (
        <div className="relative z-10 mt-4">
          <div className="h-1 rounded-full bg-slate-800/60 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
              className={`h-full bg-gradient-to-r ${cfg.bar} rounded-full`}
            />
          </div>
        </div>
      )}

      {trend && (
        <div className={`relative z-10 mt-3 pt-3 border-t border-slate-200/40 dark:border-slate-800/60 flex items-center gap-1.5 text-[11px] ${cfg.text} font-semibold`}>
          <TrendingUp className="w-3.5 h-3.5" />
          <span>{trend}</span>
        </div>
      )}
    </GlassCard>
  );
};
