import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { GlassCard } from '../components/common/GlassCard';
import { User, Mail, Phone, Save, ShieldCheck, Camera, Sparkles, Building2, BadgeCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const ROLE_GRADIENT = {
  Administrator: 'from-rose-600 via-pink-500 to-red-500',
  Faculty:       'from-indigo-600 via-purple-500 to-indigo-400',
  Student:       'from-cyan-600 via-sky-500 to-cyan-400',
};

export const ProfilePage = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || 'Alex Johnson');
  const [department, setDepartment] = useState(user?.department || 'Computer Science & Engineering');
  const [phone, setPhone] = useState(user?.phone || '+1 (555) 019-2834');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const roleGrad = ROLE_GRADIENT[user?.role] || ROLE_GRADIENT.Student;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/25">
            <User className="w-5 h-5" />
          </div>
          Member Account & Profile
        </h1>
        <p className="text-xs text-slate-400 mt-1 ml-12">Manage credentials, department details, and spatial preferences</p>
      </div>

      {/* Profile Banner Card */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-700/40">
        {/* Gradient banner */}
        <div className={`h-28 w-full bg-gradient-to-r ${roleGrad} opacity-80`} />

        {/* Overlay pattern */}
        <div className="absolute inset-0 h-28"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.08) 1px, transparent 0)',
            backgroundSize: '24px 24px'
          }}
        />

        {/* Profile content */}
        <div
          className="relative px-6 pb-6 -mt-14"
          style={{ background: 'rgba(10, 14, 28, 0.88)', backdropFilter: 'blur(20px)' }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5 pt-0">
            {/* Avatar */}
            <div className="relative -mt-2 flex-shrink-0">
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-tr ${roleGrad} blur-md opacity-40`} />
              <img
                src={user?.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'}
                alt="Profile"
                className="relative w-20 h-20 rounded-2xl object-cover border-4 border-slate-900 shadow-2xl"
              />
              <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-cyan-400 transition-colors">
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Name + role */}
            <div className="flex-1 min-w-0 pt-2">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border bg-gradient-to-r ${roleGrad} bg-opacity-20 text-white border-white/20`}>
                  {user?.role || 'Student'}
                </span>
                <BadgeCheck className="w-4 h-4 text-cyan-400" />
              </div>
              <h2 className="text-xl font-black text-white">{name}</h2>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <Mail className="w-3.5 h-3.5" />
                {user?.email || 'user@campus.edu'}
              </p>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                <Building2 className="w-3.5 h-3.5" />
                {department}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form Card */}
      <GlassCard hover={false}>
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white">Edit Profile Details</h3>
        </div>

        {isSaved && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="mb-5 p-3.5 rounded-xl bg-emerald-500/15 text-emerald-300 text-xs border border-emerald-500/25 text-center font-semibold flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            Profile details saved successfully!
          </motion.div>
        )}

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full glass-input pl-10 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Department</label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full glass-input pl-10 text-sm"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full glass-input pl-10 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Campus Email <span className="text-slate-600 normal-case">(read-only)</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                <input
                  type="email"
                  value={user?.email || 'student@campus.edu'}
                  disabled
                  className="w-full glass-input pl-10 text-sm opacity-50 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="pt-5 border-t border-slate-800/60 flex items-center justify-between">
            <p className="text-[11px] text-slate-500">Last updated: today</p>
            <motion.button
              type="submit"
              whileTap={{ scale: 0.97 }}
              className="btn-gradient px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Save Changes
            </motion.button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
};
