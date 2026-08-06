import React, { useState } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { MOCK_BOOKINGS, MOCK_BUILDINGS } from '../data/mockData';
import { ShieldAlert, CheckCircle, XCircle, Building2, Package, Users, FileText, Sparkles } from 'lucide-react';
import { apiService } from '../services/api';

export const AdminPage = () => {
  const [bookings, setBookings] = useState(MOCK_BOOKINGS);
  const [activeTab, setActiveTab] = useState('requests'); // 'requests' | 'buildings' | 'users'

  const handleStatusChange = async (id, status) => {
    await apiService.updateBookingStatus(id, status, `Processed by Admin`);
    setBookings((prev) =>
      prev.map((b) => (b._id === id ? { ...b, status } : b))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-rose-400" /> Administrator Management Panel
          </h1>
          <p className="text-xs text-slate-400">
            System-wide facility & asset request approvals, spatial sensor management, and user permissions
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 text-xs font-bold">
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'requests' ? 'bg-cyan-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            Pending Requests ({bookings.filter(b => b.status === 'Pending').length})
          </button>
          <button
            onClick={() => setActiveTab('buildings')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeTab === 'buildings' ? 'bg-cyan-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            Buildings Registry
          </button>
        </div>
      </div>

      {activeTab === 'requests' ? (
        <div className="space-y-4">
          {bookings.map((req) => (
            <GlassCard key={req._id} className="p-5">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-cyan-400">{req.user?.name}</span>
                    <span className="text-[10px] text-slate-400">({req.user?.department || 'Student'})</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      req.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-400' : req.status === 'Rejected' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {req.status}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white mt-1">
                    Requesting: {req.asset?.assetName || req.room?.roomNumber}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1">Purpose: {req.purpose}</p>
                  <p className="text-[11px] text-slate-400 font-mono mt-1">Timeslot: {req.date} • {req.startTime} - {req.endTime}</p>
                </div>

                {req.status === 'Pending' && (
                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <button
                      onClick={() => handleStatusChange(req._id, 'Approved')}
                      className="flex-1 md:flex-none px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" /> Approve Request
                    </button>
                    <button
                      onClick={() => handleStatusChange(req._id, 'Rejected')}
                      className="flex-1 md:flex-none px-4 py-2 bg-rose-600/80 hover:bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <XCircle className="w-4 h-4" /> Reject Request
                    </button>
                  </div>
                )}
              </div>
            </GlassCard>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MOCK_BUILDINGS.map((b) => (
            <GlassCard key={b._id} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-cyan-400">{b.code}</span>
                <span className="text-xs text-slate-400">{b.openingHours}</span>
              </div>
              <h4 className="text-base font-bold text-white mb-1">{b.name}</h4>
              <p className="text-xs text-slate-400 mb-3">{b.description}</p>
              <div className="text-xs text-emerald-400 font-semibold">
                Emergency Exits Registered: {b.emergencyExits?.length || 1} Exits
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};
