import React from 'react';
import { OccupancyChart } from '../components/analytics/OccupancyChart';
import { PeakHoursChart } from '../components/analytics/PeakHoursChart';
import { SpatialHeatmap } from '../components/analytics/SpatialHeatmap';
import { GlassCard } from '../components/common/GlassCard';
import { StatCard } from '../components/common/StatCard';
import { BarChart3, Users, Clock, Flame, PieChart, Activity } from 'lucide-react';
import { ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Tooltip } from 'recharts';
import { MOCK_ANALYTICS } from '../data/mockData';

export const AnalyticsPage = () => {
  const popularData = MOCK_ANALYTICS.popularBuildings;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-cyan-400" /> Real-Time Spatial Localization & Telemetry Analytics
        </h1>
        <p className="text-xs text-slate-400">
          Campus IoT sensors, pedestrian density metrics, peak usage patterns, and facility reservation analytics
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Daily Visitors" value="2,450 Check-ins" subtitle="Peak on Friday" icon={Users} color="cyan" />
        <StatCard title="Peak Density Hour" value="12:00 PM - 02:00 PM" subtitle="92% Occupancy" icon={Clock} color="rose" />
        <StatCard title="Most Popular Building" value="Main Central Library" subtitle="94% Capacity Used" icon={Flame} color="emerald" />
        <StatCard title="Active Sensors" value="128 Access Points" subtitle="100% Operational" icon={Activity} color="indigo" />
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OccupancyChart />
        <PeakHoursChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpatialHeatmap />

        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Popular Building Usage Breakdown</h3>
              <p className="text-xs text-slate-400">Percentage distribution across campus sectors</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={popularData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="usage"
                >
                  {popularData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', color: '#fff' }} />
              </RePieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800">
            {popularData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-300 font-semibold truncate">{item.name}</span>
                <span className="text-slate-500 font-mono">({item.usage}%)</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
