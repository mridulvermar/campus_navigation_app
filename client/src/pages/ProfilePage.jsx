import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { GlassCard } from '../components/common/GlassCard';
import { User, Mail, Phone, Building, Star, Lock, Save, ShieldCheck } from 'lucide-react';

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

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <User className="w-6 h-6 text-cyan-400" /> Member Account & Profile
        </h1>
        <p className="text-xs text-slate-400">Manage user credentials, department details, and spatial preferences</p>
      </div>

      <GlassCard className="p-6">
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-800">
          <img
            src={user?.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'}
            alt="Profile"
            className="w-24 h-24 rounded-2xl object-cover border-2 border-cyan-500/40 shadow-xl"
          />
          <div className="text-center sm:text-left">
            <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-bold uppercase tracking-wider">
              {user?.role || 'Student'} Member
            </span>
            <h3 className="text-xl font-bold text-white mt-2">{name}</h3>
            <p className="text-xs text-slate-400">{user?.email}</p>
          </div>
        </div>

        {isSaved && (
          <div className="my-4 p-3 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30 text-center">
            Profile details saved successfully!
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4 text-xs mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full glass-input"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full glass-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full glass-input"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Campus Email (Primary Key)</label>
              <input
                type="email"
                value={user?.email || 'student@campus.edu'}
                disabled
                className="w-full glass-input opacity-60 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button type="submit" className="btn-gradient px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2">
              <Save className="w-4 h-4" /> Save Profile Details
            </button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
};
