import React from 'react';
import { ShieldAlert, PhoneCall, HeartPulse, Siren } from 'lucide-react';
import { GlassCard } from './GlassCard';

export const EmergencyWidget = () => {
  return (
    <GlassCard className="p-4 bg-rose-950/30 border-rose-500/30">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-rose-500/20 text-rose-400 rounded-xl border border-rose-500/30">
          <Siren className="w-6 h-6 animate-bounce" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-rose-300">Campus Emergency Hotline</h4>
          <p className="text-xs text-slate-300">24/7 Security Dispatch & First Responders</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
        <a
          href="tel:911"
          className="flex items-center justify-center gap-1.5 py-2 px-3 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-lg transition-colors"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Call Dispatch (911)</span>
        </a>
        <button
          onClick={() => alert('Broadcasting silent emergency beacon to campus security...')}
          className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-rose-400 font-semibold rounded-lg border border-rose-500/30 transition-colors"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>SOS Silent Alert</span>
        </button>
      </div>
    </GlassCard>
  );
};
