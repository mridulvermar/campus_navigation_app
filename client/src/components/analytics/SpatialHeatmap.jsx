import React from 'react';
import { GlassCard } from '../common/GlassCard';
import { Flame, RefreshCw, Layers } from 'lucide-react';
import { MOCK_BUILDINGS } from '../../data/mockData';

export const SpatialHeatmap = () => {
  const heatZones = [
    { name: 'Science Block A - Clean Lab Floor 1', density: 92, status: 'Critical Density' },
    { name: 'Main Central Library - 2nd Floor Study', density: 88, status: 'High Density' },
    { name: 'Engineering Quad - VR Studio', density: 74, status: 'Moderate' },
    { name: 'Student Union Cafeteria', density: 65, status: 'Moderate' },
    { name: 'Grand Auditorium Foyer', density: 30, status: 'Low Density' }
  ];

  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <Flame className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Spatial Telemetry Heat Density</h3>
            <p className="text-xs text-slate-400">Real-time Bluetooth / WiFi AP occupancy clusters</p>
          </div>
        </div>
        <button
          onClick={() => alert('Refreshing spatial telemetry sensor feed...')}
          className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-cyan-400 border border-slate-700 transition-colors"
          title="Refresh Feed"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        {heatZones.map((zone, idx) => (
          <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200">{zone.name}</span>
              <span
                className={`font-mono font-bold ${
                  zone.density >= 85 ? 'text-rose-400' : zone.density >= 60 ? 'text-amber-400' : 'text-emerald-400'
                }`}
              >
                {zone.density}% Density
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  zone.density >= 85
                    ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                    : zone.density >= 60
                    ? 'bg-gradient-to-r from-cyan-500 to-amber-500'
                    : 'bg-gradient-to-r from-teal-500 to-emerald-500'
                }`}
                style={{ width: `${zone.density}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};
