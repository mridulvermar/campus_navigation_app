import React, { useState } from 'react';
import { GlassCard } from '../common/GlassCard';
import { Calendar, Clock, FileText, CheckCircle2, ShieldCheck, X } from 'lucide-react';
import { apiService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export function calculateDurationHours(startStr, endStr) {
  if (!startStr || !endStr) return 1;

  const parseTime = (tStr) => {
    const match = String(tStr).trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
    if (!match) return null;
    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const ampm = match[3] ? match[3].toUpperCase() : null;

    if (ampm === 'PM' && hours < 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;
    return hours + minutes / 60;
  };

  const startVal = parseTime(startStr);
  const endVal = parseTime(endStr);

  if (startVal === null || endVal === null) return 1;
  const diff = endVal - startVal;
  return diff > 0 ? Math.round(diff * 10) / 10 : 1;
}

export const BookingForm = ({ targetItem, bookingType = 'Facility', onClose, onSuccess }) => {
  const { user } = useAuth();
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [startTime, setStartTime] = useState('10:00 AM');
  const [endTime, setEndTime] = useState('12:00 PM');
  const [durationHours, setDurationHours] = useState(2);
  const [purpose, setPurpose] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successBooking, setSuccessBooking] = useState(null);

  const timeOptions = [
    '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM',
    '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
    '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM', '06:00 PM'
  ];

  const handleStartTimeChange = (newStart) => {
    setStartTime(newStart);
    const calculated = calculateDurationHours(newStart, endTime);
    setDurationHours(calculated);
  };

  const handleEndTimeChange = (newEnd) => {
    setEndTime(newEnd);
    const calculated = calculateDurationHours(startTime, newEnd);
    setDurationHours(calculated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const calculatedDuration = calculateDurationHours(startTime, endTime);

    const payload = {
      asset: bookingType === 'Asset' ? targetItem?._id : null,
      room: bookingType === 'Facility' ? targetItem?._id : null,
      bookingType,
      date,
      startTime,
      endTime,
      durationHours: calculatedDuration,
      purpose: purpose || 'Academic Class & Research Session'
    };

    const res = await apiService.createBooking(payload);
    setIsSubmitting(false);

    if (res.success && res.data) {
      const createdObj = {
        ...res.data,
        durationHours: calculatedDuration,
        room: res.data.room || targetItem,
        asset: res.data.asset || (bookingType === 'Asset' ? targetItem : null)
      };
      setSuccessBooking(createdObj);
      if (onSuccess) onSuccess(createdObj);
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
          Your request for <span className="text-cyan-400 font-bold">{targetItem?.assetName || targetItem?.roomNumber || 'Item'}</span> on {date} ({startTime} - {endTime}) has been submitted for admin approval.
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
            <select
              value={startTime}
              onChange={(e) => handleStartTimeChange(e.target.value)}
              className="w-full glass-input bg-slate-900 text-white cursor-pointer"
              required
            >
              {timeOptions.map((t) => (
                <option key={`start_${t}`} value={t} className="bg-slate-900 text-white">
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-slate-300 font-semibold mb-1">End Time</label>
            <select
              value={endTime}
              onChange={(e) => handleEndTimeChange(e.target.value)}
              className="w-full glass-input bg-slate-900 text-white cursor-pointer"
              required
            >
              {timeOptions.map((t) => (
                <option key={`end_${t}`} value={t} className="bg-slate-900 text-white">
                  {t}
                </option>
              ))}
            </select>
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
