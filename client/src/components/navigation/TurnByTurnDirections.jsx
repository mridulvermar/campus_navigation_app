import React from 'react';
import { Footprints, Clock, ShieldAlert, ArrowUpRight, CheckCircle2, CornerDownRight } from 'lucide-react';
import { useNavigation } from '../../context/NavigationContext';
import { GlassCard } from '../common/GlassCard';

export const TurnByTurnDirections = () => {
  const { activeRoute } = useNavigation();

  if (!activeRoute) {
    return (
      <GlassCard className="text-center py-10 text-slate-400">
        <Footprints className="w-10 h-10 mx-auto text-slate-600 mb-2" />
        <p className="text-sm font-semibold">No Navigation Route Active</p>
        <p className="text-xs">Select origin and destination above to compute shortest path.</p>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-4">
      {/* Route Summary Overview Card */}
      <GlassCard className="bg-gradient-to-r from-cyan-950/40 via-indigo-950/40 to-slate-900 border-cyan-500/30">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Active Route Calculated</span>
            <h4 className="text-lg font-extrabold text-white">
              {activeRoute.source.code} → {activeRoute.destination.code}
            </h4>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black text-cyan-400">{activeRoute.distanceMeters} m</div>
            <div className="text-xs text-slate-400 flex items-center gap-1 justify-end">
              <Clock className="w-3.5 h-3.5" />
              <span>ETA ~{activeRoute.timeTakenMinutes} mins</span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Turn by Turn Step List */}
      <div className="glass-panel p-4 rounded-2xl space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Step-By-Step Guidance</h4>
        {activeRoute.steps.map((step) => (
          <div
            key={step.step}
            className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 transition-colors"
          >
            <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-bold text-xs">
              {step.step}
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-slate-100">{step.instruction}</p>
              <span className="text-[10px] font-mono text-cyan-400 mt-1 inline-block">{step.distance} segment</span>
            </div>
            {step.type === 'destination' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <CornerDownRight className="w-4 h-4 text-cyan-400" />
            )}
          </div>
        ))}
      </div>

      {/* Emergency Exits Callout */}
      {activeRoute.destination.emergencyExits && (
        <GlassCard className="p-4 bg-rose-950/20 border-rose-500/30">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-xs mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>Nearest Emergency Exits at Destination</span>
          </div>
          <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
            {activeRoute.destination.emergencyExits.map((ex, idx) => (
              <li key={idx}>
                Floor {ex.floor}: <span className="font-semibold">{ex.locationName}</span>
              </li>
            ))}
          </ul>
        </GlassCard>
      )}
    </div>
  );
};
