import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MOCK_ANALYTICS } from '../../data/mockData';
import { GlassCard } from '../common/GlassCard';

export const OccupancyChart = () => {
  const data = MOCK_ANALYTICS.dailyVisitors;

  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-white">Daily Campus Pedestrian Traffic</h3>
          <p className="text-xs text-slate-400">Total campus visitor check-ins per day</p>
        </div>
        <span className="text-xs font-semibold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
          Weekly Telemetry
        </span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="visitorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
            <XAxis dataKey="day" stroke="#94A3B8" fontSize={12} />
            <YAxis stroke="#94A3B8" fontSize={12} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
            />
            <Area type="monotone" dataKey="count" stroke="#06B6D4" strokeWidth={3} fillOpacity={1} fill="url(#visitorGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
};
