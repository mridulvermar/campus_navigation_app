import React, { useState } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { MOCK_NOTIFICATIONS } from '../data/mockData';
import { Bell, CheckCheck, Info, ShieldAlert, Sparkles } from 'lucide-react';
import { formatDate } from '../utils/formatters';

export const NotificationsPage = () => {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-cyan-400" /> Notifications & Alert Feed
          </h1>
          <p className="text-xs text-slate-400">Real-time system updates, booking statuses, and emergency broadcasts</p>
        </div>

        <button
          onClick={markAllRead}
          className="btn-gradient px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
        >
          <CheckCheck className="w-4 h-4" /> Mark All as Read
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <GlassCard
            key={n._id}
            className={`p-4 border-l-4 transition-all ${
              n.type === 'booking'
                ? 'border-l-cyan-500'
                : n.type === 'system'
                ? 'border-l-indigo-500'
                : 'border-l-rose-500'
            } ${!n.read ? 'bg-cyan-950/20' : ''}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-bold text-white">{n.title}</h4>
                  {!n.read && (
                    <span className="px-2 py-0.5 rounded-full bg-cyan-500 text-white font-extrabold text-[9px] uppercase tracking-wider">
                      New
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{n.message}</p>
                <span className="text-[10px] text-slate-500 mt-2 block font-mono">
                  {formatDate(n.createdAt)}
                </span>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
