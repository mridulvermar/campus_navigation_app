import React from 'react';
import { Sun, CloudRain, Wind, Thermometer } from 'lucide-react';
import { GlassCard } from './GlassCard';

export const WeatherWidget = () => {
  return (
    <GlassCard className="p-4 bg-gradient-to-br from-cyan-900/30 to-indigo-900/30 border-cyan-500/20">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs text-cyan-400 font-semibold uppercase tracking-wider">Campus Live Microclimate</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-extrabold text-white">72°F</span>
            <span className="text-sm text-slate-300 font-medium">Partly Sunny</span>
          </div>
        </div>
        <div className="p-3 bg-cyan-500/20 rounded-xl text-cyan-400 border border-cyan-500/30">
          <Sun className="w-8 h-8 animate-pulse" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-700/50 text-xs text-slate-300">
        <div className="flex items-center gap-1.5">
          <Wind className="w-3.5 h-3.5 text-cyan-400" />
          <span>6 mph W</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CloudRain className="w-3.5 h-3.5 text-cyan-400" />
          <span>10% Precip</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Thermometer className="w-3.5 h-3.5 text-cyan-400" />
          <span>AQI 24 (Good)</span>
        </div>
      </div>
    </GlassCard>
  );
};
