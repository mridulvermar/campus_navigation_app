import React, { useState } from 'react';
import { MOCK_ROOMS, MOCK_BOOKINGS } from '../data/mockData';
import { GlassCard } from '../components/common/GlassCard';
import { BookingForm } from '../components/booking/BookingForm';
import { QRModal } from '../components/common/QRModal';
import { CalendarCheck, Building2, Users, Clock, QrCode, Plus, CheckCircle2, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const BookingsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('myBookings'); // 'myBookings' | 'bookFacility'
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState(null);
  const [activeQR, setActiveQR] = useState(null);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <CalendarCheck className="w-6 h-6 text-emerald-400" /> Facility & Room Reservation Hub
          </h1>
          <p className="text-xs text-slate-400">
            Book classrooms, seminar pods, auditoriums, sports fields, and research labs
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('myBookings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'myBookings' ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:text-white'
            }`}
          >
            My Reservations
          </button>
          <button
            onClick={() => setActiveTab('bookFacility')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'bookFacility' ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' : 'text-slate-400 hover:text-white'
            }`}
          >
            Reserve Campus Room
          </button>
        </div>
      </div>

      {activeTab === 'myBookings' ? (
        <div className="space-y-4">
          {MOCK_BOOKINGS.map((bk) => (
            <GlassCard key={bk._id} className="p-5">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-400">{bk.bookingType}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        bk.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        {bk.status}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white mt-1">
                      {bk.asset?.assetName || bk.room?.roomNumber}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1">{bk.purpose}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-400 mt-2">
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-cyan-400" /> {bk.date} • {bk.startTime} - {bk.endTime}</span>
                      <span>Duration: {bk.durationHours} hrs</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0">
                  <button
                    onClick={() => setActiveQR(bk.qrCodeData)}
                    className="flex-1 md:flex-none btn-gradient px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <QrCode className="w-4 h-4" /> Show Access QR Code
                  </button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_ROOMS.map((room) => (
            <GlassCard key={room._id} className="flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-400">{room.category}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${room.availability ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
                    {room.availability ? 'Available' : 'Occupied'}
                  </span>
                </div>
                <h4 className="text-base font-bold text-white mb-1">{room.roomNumber}</h4>
                <p className="text-xs text-slate-400 mb-3">{room.building?.name}</p>

                <div className="space-y-1.5 text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800 mb-4">
                  <div className="flex items-center justify-between">
                    <span>Seating Capacity:</span>
                    <span className="font-bold text-white">{room.capacity} seats</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Current Occupancy:</span>
                    <span className="font-bold text-cyan-400">{room.currentOccupancy} inside</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {room.facilities.map((fac, idx) => (
                    <span key={idx} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                      {fac}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setSelectedRoomForBooking(room)}
                className="w-full btn-gradient py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Book Room Slot
              </button>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      {selectedRoomForBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <BookingForm
            targetItem={selectedRoomForBooking}
            bookingType="Facility"
            onClose={() => setSelectedRoomForBooking(null)}
          />
        </div>
      )}

      {/* QR Access Ticket Modal */}
      <QRModal
        isOpen={Boolean(activeQR)}
        onClose={() => setActiveQR(null)}
        title="Campus Facility Verification Ticket"
        qrData={activeQR}
      />
    </div>
  );
};
