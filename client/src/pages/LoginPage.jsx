import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { GlassCard } from '../components/common/GlassCard';
import { Compass, Mail, Lock, Shield, ArrowRight, UserCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const LoginPage = () => {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('student@campus.edu');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
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

  const handleQuickDemo = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <GlassCard className="p-8 border-cyan-500/30 shadow-2xl bg-slate-900/80 backdrop-blur-2xl">
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white mx-auto mb-3 shadow-lg shadow-cyan-500/30">
          <Compass className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight">University Portal Sign In</h2>
        <p className="text-xs text-slate-400 mt-1">Multi-Modal Campus Navigation & Asset Reservation</p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-rose-500/20 text-rose-300 text-xs border border-rose-500/30 text-center font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4 text-xs">
        <div>
          <label className="block text-slate-300 font-semibold mb-1">Campus Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full glass-input pl-10"
              placeholder="user@campus.edu"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full glass-input pl-10"
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-cyan-500/40"
            />
            <span>Remember me</span>
          </label>
          <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Password reset link dispatched to campus email.'); }} className="text-cyan-400 hover:underline">
            Forgot Password?
          </a>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-gradient py-3 rounded-xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2"
        >
          <span>{loading ? 'Authenticating...' : 'Sign In to Platform'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Quick Demo Selector Buttons */}
      <div className="mt-6 pt-6 border-t border-slate-800 text-center">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Quick Demo Logins</p>
        <div className="grid grid-cols-3 gap-2 text-[11px]">
          <button
            onClick={() => handleQuickDemo('student@campus.edu')}
            className="py-1.5 px-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-cyan-400 border border-slate-700 font-semibold"
          >
            Student
          </button>
          <button
            onClick={() => handleQuickDemo('faculty@campus.edu')}
            className="py-1.5 px-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-indigo-400 border border-slate-700 font-semibold"
          >
            Faculty
          </button>
          <button
            onClick={() => handleQuickDemo('admin@campus.edu')}
            className="py-1.5 px-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-emerald-400 border border-slate-700 font-semibold"
          >
            Admin
          </button>
        </div>
      </div>
    </GlassCard>
  );
};
