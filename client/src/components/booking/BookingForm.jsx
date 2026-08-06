import React, { useState } from 'react';
import { GlassCard } from '../common/GlassCard';
import { Calendar, Clock, FileText, CheckCircle2, ShieldCheck, X } from 'lucide-react';
import { apiService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const BookingForm = ({ targetItem, bookingType = 'Facility', onClose, onSuccess }) => {
  const { user } = useAuth();
  const [date, setDate] = useState('2026-08-06');
  const [startTime, setStartTime] = useState('10:00 AM');
  const [endTime, setEndTime] = useState('12:00 PM');
  const [durationHours, setDurationHours] = useState(2);
  const [purpose, setPurpose] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successBooking, setSuccessBooking] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      asset: bookingType === 'Asset' ? targetItem?._id : null,
      room: bookingType === 'Facility' ? targetItem?._id : null,
      bookingType,
      date,
      startTime,
      endTime,
      durationHours,
      purpose: purpose || 'Academic Research & Collaboration'
    };

    const res = await apiService.createBooking(payload);
    setIsSubmitting(false);

    if (res.success) {
      setSuccessBooking(res.data);
      if (onSuccess) onSuccess(res.data);
    }
  };

  if (successBooking) {
    return (
      <GlassCard className="max-w-md mx-auto text-center py-8">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Reservation Request Logged!</h3>
        <p className="text-xs text-slate-300 mb-4">
          Your request for <span className="text-cyan-400 font-bold">{targetItem?.assetName || targetItem?.roomNumber || 'Item'}</span> on {date} has been submitted for admin approval.
        </p>
        <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs font-mono text-cyan-400 mb-6">
          QR Verification Code: {successBooking.qrCodeData}
        </div>
        <button onClick={onClose} className="w-full btn-gradient py-2.5 rounded-xl font-medium text-xs">
          Return to Hub
        </button>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="max-w-lg mx-auto relative">
      {onClose && (
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      )}

      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
          <Calendar className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">
            Reserve {bookingType === 'Asset' ? 'Equipment Asset' : 'Campus Facility'}
          </h3>
          <p className="text-xs text-slate-400">
            Target: <span className="text-cyan-400 font-semibold">{targetItem?.assetName || targetItem?.roomNumber || 'General Reservation'}</span>
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block text-slate-300 font-semibold mb-1">Reservation Date</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full glass-input pl-10"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Start Time</label>
            <input
              type="text"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full glass-input"
              placeholder="10:00 AM"
              required
            />
          </div>
          <div>
            <label className="block text-slate-300 font-semibold mb-1">End Time</label>
            <input
              type="text"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full glass-input"
              placeholder="12:00 PM"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">Duration (Hours)</label>
          <input
            type="number"
            min="1"
            max="8"
            value={durationHours}
            onChange={(e) => setDurationHours(e.target.value)}
            className="w-full glass-input"
            required
          />
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">Purpose of Booking</label>
          <textarea
            rows="3"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="Specify research details, capstone project, or seminar topic..."
            className="w-full glass-input resize-none"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full btn-gradient py-3 rounded-xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>{isSubmitting ? 'Processing Request...' : 'Confirm & Request Approval'}</span>
        </button>
      </form>
    </GlassCard>
  );
};
