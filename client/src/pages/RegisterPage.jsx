import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { GlassCard } from '../components/common/GlassCard';
import { Compass, Mail, Lock, User, Shield, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const RegisterPage = () => {
  const { register, loading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Student');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const res = await register({ name, email, password, role, department });
    if (res.success) {
      navigate('/dashboard');
    }
  };

  return (
    <GlassCard className="p-8 border-indigo-500/30 shadow-2xl bg-slate-900/80 backdrop-blur-2xl">
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white mx-auto mb-3 shadow-lg shadow-indigo-500/30">
          <Compass className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-black text-white tracking-tight">Create Campus Account</h2>
        <p className="text-xs text-slate-400 mt-1">Join the Campus Spatial Navigation Network</p>
      </div>

      <form onSubmit={handleRegister} className="space-y-4 text-xs">
        <div>
          <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full glass-input pl-10"
              placeholder="Alex Johnson"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">Campus Email</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full glass-input pl-10"
              placeholder="alex@campus.edu"
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

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full glass-input bg-slate-900"
            >
              <option value="Student">Student</option>
              <option value="Faculty">Faculty</option>
              <option value="Administrator">Administrator</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Department</label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full glass-input"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-gradient py-3 rounded-xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 mt-2"
        >
          <span>Create Account</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="mt-6 text-center text-xs text-slate-400">
        <span>Already registered? </span>
        <Link to="/login" className="text-cyan-400 font-bold hover:underline">
          Sign In
        </Link>
      </div>
    </GlassCard>
  );
};
