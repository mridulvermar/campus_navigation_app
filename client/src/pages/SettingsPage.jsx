import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { GlassCard } from '../components/common/GlassCard';
import { Settings, Moon, Sun, Bell, Globe, Shield } from 'lucide-react';

export const SettingsPage = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-cyan-400" /> Platform Preferences & Settings
        </h1>
        <p className="text-xs text-slate-400">Configure theme, notifications, spatial refresh interval, and security</p>
      </div>

      <div className="space-y-4">
        {/* Appearance */}
        <GlassCard className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Visual Interface Theme</h4>
                <p className="text-xs text-slate-400">Toggle between Dark Mode glassmorphism and Light mode</p>
              </div>
            </div>

            <button
              onClick={toggleTheme}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 font-bold text-xs transition-colors"
            >
              {isDarkMode ? 'Switch to Light' : 'Switch to Dark'}
            </button>
          </div>
        </GlassCard>

        {/* Notifications */}
        <GlassCard className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Socket.IO Push Notifications</h4>
                <p className="text-xs text-slate-400">Receive instant alerts on booking status updates</p>
              </div>
            </div>

            <input
              type="checkbox"
              defaultChecked
              className="w-5 h-5 rounded bg-slate-800 text-cyan-500 border-slate-700 focus:ring-cyan-500/40"
            />
          </div>
        </GlassCard>

        {/* Language */}
        <GlassCard className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">System Language</h4>
                <p className="text-xs text-slate-400">Select interface language for map annotations</p>
              </div>
            </div>

            <select className="glass-input text-xs bg-slate-900">
              <option value="en">English (US)</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
            </select>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
