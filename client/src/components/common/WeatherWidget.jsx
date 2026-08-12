import React from 'react';
import { Sun, CloudRain, Wind, Thermometer, Droplets, Eye } from 'lucide-react';

export const WeatherWidget = () => {
  return (
    <div
      className="rounded-2xl border border-cyan-500/20 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(6,182,212,0.10) 0%, rgba(99,102,241,0.08) 100%)',
        backdropFilter: 'blur(16px)'
      }}
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-3 flex items-start justify-between">
        <div>
          <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">Campus Microclimate</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black text-white">72°F</span>
            <span className="text-xs text-slate-300 font-medium">Partly Sunny</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">BIT Mesra Campus, Jharkhand</p>
        </div>
        <div className="p-3 bg-amber-500/15 rounded-2xl text-amber-400 border border-amber-500/25">
          <Sun className="w-8 h-8 animate-spin-slow" style={{ animationDuration: '8s' }} />
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-0 border-t border-slate-800/50">
        {[
          { icon: Wind, value: '6 mph W', label: 'Wind' },
          { icon: Droplets, value: '10%', label: 'Precip' },
          { icon: Eye, value: 'AQI 24', label: 'Air Quality' },
        ].map(({ icon: Icon, value, label }) => (
          <div key={label} className="flex flex-col items-center gap-1 py-2.5 border-r border-slate-800/50 last:border-r-0 text-center">
            <Icon className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px] font-bold text-white">{value}</span>
            <span className="text-[9px] text-slate-500 uppercase tracking-wider">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
