import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Compass, Mail, Lock, ArrowRight, Zap, Shield, Navigation, Building2, Package } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const DEMO_ROLES = [
  { email: 'student@campus.edu', label: 'Student', color: 'cyan', desc: 'View & book rooms' },
  { email: 'faculty@campus.edu', label: 'Faculty', color: 'indigo', desc: 'Manage facilities' },
  { email: 'admin@campus.edu', label: 'Admin', color: 'rose', desc: 'Full control panel' },
];

const FEATURES = [
  { icon: Navigation, label: 'Live Routing', desc: 'Turn-by-turn GIS navigation' },
  { icon: Building2, label: 'Room Booking', desc: '428+ campus facilities' },
  { icon: Package, label: 'Asset Tracking', desc: 'Real-time inventory QR' },
];

export const LoginPage = () => {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('student@campus.edu');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [activeRole, setActiveRole] = useState('Student');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(email, password);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.message || 'Authentication failed');
    }
  };

  const handleQuickDemo = (demoEmail, label) => {
    setEmail(demoEmail);
    setPassword('password123');
    setActiveRole(label);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-6"
      >
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 opacity-60 blur-md animate-glow-pulse" />
            <div className="relative w-full h-full rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
              <Compass className="w-7 h-7 animate-spin-slow" />
            </div>
          </div>
          <div className="text-left">
            <h1 className="text-xl font-black font-display bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">CampusNav GIS</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Spatial Ecosystem</p>
          </div>
        </div>
        <h2 className="text-2xl font-black text-white">Welcome back</h2>
        <p className="text-xs text-slate-400 mt-1">Sign in to your campus portal</p>
      </motion.div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="rounded-2xl border border-slate-700/50 overflow-hidden"
        style={{
          background: 'rgba(10, 14, 28, 0.88)',
          backdropFilter: 'blur(24px)',
          boxShadow: '0 32px 80px -16px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.05)'
        }}
      >
        {/* Feature strip */}
        <div className="flex items-center divide-x divide-slate-800/80 border-b border-slate-800/60 bg-slate-900/40">
          {FEATURES.map(({ icon: FeatureIcon, label, desc }) => (
            <div key={label} className="flex-1 px-3 py-2.5 flex items-center gap-2">
              <FeatureIcon className="w-3.5 h-3.5 text-cyan-500 flex-shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-white">{label}</p>
                <p className="text-[9px] text-slate-500 hidden sm:block">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-4 p-3 rounded-xl bg-rose-500/15 text-rose-300 text-xs border border-rose-500/25 text-center font-medium"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            {/* Email */}
            <div>
              <label className="block text-slate-400 font-semibold mb-1.5 text-[11px] uppercase tracking-wider">Campus Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full glass-input pl-10 text-sm"
                  placeholder="user@campus.edu"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-slate-400 font-semibold mb-1.5 text-[11px] uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full glass-input pl-10 text-sm"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-600 text-cyan-500 focus:ring-cyan-500/30"
                />
                <span>Remember me</span>
              </label>
              <a
                href="#forgot"
                onClick={(e) => { e.preventDefault(); alert('Password reset link dispatched to campus email.'); }}
                className="text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Forgot password?
              </a>
            </div>

            {/* Sign In Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.98 }}
              className="w-full btn-gradient py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Platform</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Quick Demo Roles */}
          <div className="mt-5 pt-5 border-t border-slate-800/60">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Quick Demo Access</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {DEMO_ROLES.map(({ email: demoEmail, label, color, desc }) => (
                <motion.button
                  key={label}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleQuickDemo(demoEmail, label)}
                  className={`relative py-2.5 px-2 rounded-xl text-[11px] font-bold border transition-all cursor-pointer overflow-hidden ${
                    activeRole === label
                      ? `bg-${color}-500/20 text-${color}-300 border-${color}-500/40 shadow-glow-${color}`
                      : 'bg-slate-800/60 text-slate-400 border-slate-700/50 hover:border-slate-600/70 hover:text-slate-200'
                  }`}
                >
                  {activeRole === label && (
                    <motion.div
                      layoutId="activeRolePill"
                      className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"
                    />
                  )}
                  <span className="relative z-10 block">{label}</span>
                  <span className="relative z-10 block text-[9px] mt-0.5 opacity-60 font-medium">{desc}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Register Link */}
          <p className="text-center text-[11px] text-slate-500 mt-4">
            New to CampusNav?{' '}
            <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
              Create account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
