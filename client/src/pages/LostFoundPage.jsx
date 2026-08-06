import React, { useState } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { Search, Plus, MapPin, Phone, Mail, CheckCircle2 } from 'lucide-react';

export const LostFoundPage = () => {
  const [items, setItems] = useState([
    {
      id: 1,
      title: 'Sony Noise-Canceling Headphones WH-1000XM4',
      type: 'Found',
      category: 'Electronics',
      location: 'Main Central Library - 3rd Floor Quiet Zone',
      date: '2026-08-04',
      contact: 'library-security@campus.edu',
      status: 'Open',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 2,
      title: 'Hydro Flask Water Bottle (Navy Blue)',
      type: 'Lost',
      category: 'Personal Item',
      location: 'Science Block A - Lecture Hall 101',
      date: '2026-08-05',
      contact: '+1 (555) 392-8102',
      status: 'Open',
      image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=600'
    }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Search className="w-6 h-6 text-emerald-400" /> Campus Lost & Found Hub
          </h1>
          <p className="text-xs text-slate-400">Report missing belongings or browse found campus items</p>
        </div>

        <button
          onClick={() => alert('New Report modal triggered')}
          className="btn-gradient px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Report Lost/Found Item
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item) => (
          <GlassCard key={item.id} className="p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    item.type === 'Found' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {item.type} Item
                </span>
                <span className="text-xs text-slate-400">{item.date}</span>
              </div>
              <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
              <div className="flex items-center gap-1.5 text-xs text-slate-300 mb-3">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>{item.location}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono">Contact: {item.contact}</span>
              <button
                onClick={() => alert(`Contact request sent for ${item.title}`)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 font-semibold"
              >
                Claim Item
              </button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
