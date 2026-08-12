import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MOCK_ROOMS, MOCK_BOOKINGS } from '../data/mockData';
import { GlassCard } from '../components/common/GlassCard';
import { BookingForm, calculateDurationHours } from '../components/booking/BookingForm';
import { QRModal } from '../components/common/QRModal';
import {
  CalendarCheck, Building2, Users, Clock, QrCode, Plus,
  CheckCircle2, Shield, Loader2, Filter, Search, AlertCircle, XCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { apiService } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = ['All', 'Classroom', 'Labs', 'Seminar Hall', 'Library Rooms', 'Meeting Rooms'];

const CAT_COLORS = {
  'Classroom':      { bg: 'bg-cyan-500/15',    text: 'text-cyan-400',    border: 'border-cyan-500/25' },
  'Labs':           { bg: 'bg-indigo-500/15',  text: 'text-indigo-400',  border: 'border-indigo-500/25' },
  'Seminar Hall':   { bg: 'bg-purple-500/15',  text: 'text-purple-400',  border: 'border-purple-500/25' },
  'Library Rooms':  { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/25' },
  'Meeting Rooms':  { bg: 'bg-amber-500/15',   text: 'text-amber-400',   border: 'border-amber-500/25' },
};

const STATUS_CFG = {
  Approved: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/25', icon: CheckCircle2 },
  Rejected: { bg: 'bg-rose-500/15',    text: 'text-rose-400',    border: 'border-rose-500/25',    icon: XCircle },
  Pending:  { bg: 'bg-amber-500/15',   text: 'text-amber-400',   border: 'border-amber-500/25',   icon: Clock },
};

export const BookingsPage = () => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [searchParams] = useSearchParams();
  const buildingQuery = searchParams.get('building');

  const [activeTab, setActiveTab] = useState(buildingQuery ? 'bookFacility' : 'myBookings');
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState(null);
  const [activeQR, setActiveQR] = useState(null);

  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [selectedBuildingFilter, setSelectedBuildingFilter] = useState(buildingQuery || 'All');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [roomSearchQuery, setRoomSearchQuery] = useState('');

  const fetchBookingsAndRooms = async () => {
    setLoading(true);
    try {
      const [resBookings, resRooms, resBuildings] = await Promise.all([
        apiService.getMyBookings(),
        apiService.getRooms(),
        apiService.getBuildings()
      ]);
      const loadedBookings = (resBookings && resBookings.data && Array.isArray(resBookings.data))
        ? resBookings.data : MOCK_BOOKINGS;
      const loadedRooms = (resRooms && resRooms.data && Array.isArray(resRooms.data))
        ? resRooms.data : MOCK_ROOMS;
      if (resBuildings && resBuildings.data && Array.isArray(resBuildings.data)) {
        setBuildings(resBuildings.data);
      }
      setBookings(loadedBookings);
      setRooms(loadedRooms);
    } catch (err) {
      console.error('[BookingsPage Error]', err);
      setBookings(MOCK_BOOKINGS);
      setRooms(MOCK_ROOMS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookingsAndRooms(); }, []);

  useEffect(() => {
    if (buildingQuery) {
      setSelectedBuildingFilter(buildingQuery);
      setActiveTab('bookFacility');
    }
  }, [buildingQuery]);

  useEffect(() => {
    if (!socket) return;
    const handleNewBooking = (newBooking) => {
      setBookings((prev) => {
        const exists = prev.some((b) => b._id === newBooking._id);
        if (exists) return prev;
        return [newBooking, ...prev];
      });
    };
    const handleStatusChange = (updatedBooking) => {
      setBookings((prev) => prev.map((b) => (b._id === updatedBooking._id ? { ...b, ...updatedBooking } : b)));
    };
    socket.on('new_booking_request', handleNewBooking);
    socket.on('booking_status_change', handleStatusChange);
    return () => {
      socket.off('new_booking_request', handleNewBooking);
      socket.off('booking_status_change', handleStatusChange);
    };
  }, [socket]);

  const handleBookingCreated = (newBookingData) => {
    setBookings((prev) => {
      const exists = prev.some((b) => b._id === newBookingData._id);
      if (exists) return prev;
      return [newBookingData, ...prev];
    });
    setActiveTab('myBookings');
  };

  const getBookingTitle = (bk) => {
    if (bk.asset?.assetName) return bk.asset.assetName;
    if (bk.room?.roomNumber) return bk.room.roomNumber;
    if (bk.room && typeof bk.room === 'string') {
      const found = rooms.find((r) => r._id === bk.room || r.roomId === bk.room);
      if (found) return found.roomNumber || found.name;
    }
    return 'Classroom / Facility Reservation';
  };

  const getBookingBuilding = (bk) => {
    if (bk.room?.building?.name) return bk.room.building.name;
    if (bk.asset?.location) return bk.asset.location;
    if (bk.room && typeof bk.room === 'string') {
      const found = rooms.find((r) => r._id === bk.room || r.roomId === bk.room);
      if (found?.building?.name) return found.building.name;
    }
    return 'Campus Academic Block';
  };

  const filteredRooms = rooms.filter((r) => {
    const roomName = (r.roomNumber || '').toLowerCase();
    const buildingCodeOrId = r.building?.code || r.building?._id || '';
    const buildingName = (r.building?.name || '').toLowerCase();
    const matchesSearch = !roomSearchQuery ||
      roomName.replace(/\s+/g, '').includes(roomSearchQuery.toLowerCase().replace(/\s+/g, '')) ||
      buildingName.replace(/\s+/g, '').includes(roomSearchQuery.toLowerCase().replace(/\s+/g, ''));
    const matchesBuilding = selectedBuildingFilter === 'All' ||
      buildingCodeOrId.toLowerCase() === selectedBuildingFilter.toLowerCase() ||
      buildingName.includes(selectedBuildingFilter.toLowerCase());
    const matchesCategory = selectedCategoryFilter === 'All' || r.category === selectedCategoryFilter;
    return matchesSearch && matchesBuilding && matchesCategory;
  });

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
              <CalendarCheck className="w-5 h-5" />
            </div>
            Facility & Classroom Reservation
          </h1>
          <p className="text-xs text-slate-400 mt-1 ml-12">
            Search and reserve from all {rooms.length || 428} campus classrooms, labs, and seminar halls
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl border border-slate-800/60 bg-slate-900/60 backdrop-blur-sm flex-shrink-0">
          {[
            { key: 'myBookings', label: `My Reservations`, count: bookings.length },
            { key: 'bookFacility', label: `Reserve Room`, count: rooms.length },
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`relative px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === key ? 'text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {activeTab === key && (
                <motion.div
                  layoutId="bookingTabPill"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500"
                  style={{ boxShadow: '0 4px 16px -4px rgba(6,182,212,0.4)' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                />
              )}
              <span className="relative z-10">{label} ({count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filters Bar (only for book facility) */}
      <AnimatePresence>
        {activeTab === 'bookFacility' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <GlassCard hover={false} className="p-4">
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                {/* Search */}
                <div className="relative w-full lg:w-72 flex-shrink-0">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search classrooms (e.g. CS 201, AI Lab)..."
                    value={roomSearchQuery}
                    onChange={(e) => setRoomSearchQuery(e.target.value)}
                    className="w-full glass-input pl-10 text-xs"
                  />
                </div>

                {/* Building filter */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Filter className="w-4 h-4 text-cyan-400" />
                  <select
                    value={selectedBuildingFilter}
                    onChange={(e) => setSelectedBuildingFilter(e.target.value)}
                    className="glass-input text-xs py-2 px-3 text-cyan-300 font-bold rounded-xl"
                  >
                    <option value="All">All Buildings ({rooms.length})</option>
                    {buildings.map((b) => (
                      <option key={b._id} value={b.code}>{b.name} ({b.code})</option>
                    ))}
                  </select>
                </div>

                {/* Category pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-0.5 text-xs flex-1">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategoryFilter(cat)}
                      className={`px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap flex-shrink-0 ${
                        selectedCategoryFilter === cat
                          ? 'bg-cyan-500 text-white shadow-glow-cyan'
                          : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800/70'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      {loading ? (
        <GlassCard hover={false} className="p-12 text-center flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
          <p className="text-xs text-slate-400">Loading reservations & facilities...</p>
        </GlassCard>
      ) : activeTab === 'myBookings' ? (
        <div className="space-y-4">
          {bookings.length === 0 ? (
            <GlassCard hover={false} className="p-12 text-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-800/60 flex items-center justify-center mx-auto mb-4">
                <CalendarCheck className="w-7 h-7 text-slate-600" />
              </div>
              <p className="text-sm font-bold text-slate-300">No reservations yet</p>
              <p className="text-xs text-slate-500 mt-1">Click "Reserve Room" to place a request</p>
            </GlassCard>
          ) : (
            bookings.map((bk) => {
              const sCfg = STATUS_CFG[bk.status] || STATUS_CFG.Pending;
              const StatusIcon = sCfg.icon;
              return (
                <motion.div
                  key={bk._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-5 hover:border-cyan-500/25"
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex-shrink-0">
                        <Building2 className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-400">
                            {bk.bookingType || 'Facility'}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${sCfg.bg} ${sCfg.text} border ${sCfg.border}`}>
                            <StatusIcon className="w-3 h-3" />
                            {bk.status || 'Pending'}
                          </span>
                        </div>
                        <h3 className="text-sm md:text-base font-bold text-white">{getBookingTitle(bk)}</h3>
                        <p className="text-xs text-cyan-300/80 font-semibold">{getBookingBuilding(bk)}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{bk.purpose || 'Academic Session'}</p>

                        <div className="flex flex-wrap items-center gap-4 text-xs mt-2">
                          <span className="flex items-center gap-1.5 text-slate-300">
                            <CalendarCheck className="w-3.5 h-3.5 text-emerald-400" />
                            <strong className="text-white">Date:</strong> {bk.date || 'Today'}
                          </span>
                          <span className="flex items-center gap-1.5 text-slate-300">
                            <Clock className="w-3.5 h-3.5 text-cyan-400" />
                            <strong className="text-white">Time:</strong> {bk.startTime || '10:00 AM'} – {bk.endTime || '12:00 PM'}
                          </span>
                          <span className="text-slate-500 font-mono text-[11px]">
                            ({(bk.durationHours && Number(bk.durationHours) > 0) ? bk.durationHours : calculateDurationHours(bk.startTime || '10:00 AM', bk.endTime || '12:00 PM')} hrs slot)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0">
                      <button
                        onClick={() => setActiveQR(bk.qrCodeData || `CAMPUS-BOOKING-${bk._id}`)}
                        className="flex-1 md:flex-none btn-gradient px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                      >
                        <QrCode className="w-4 h-4" /> Show QR
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      ) : (
        // Room Cards Grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRooms.length === 0 ? (
            <GlassCard hover={false} className="col-span-full p-12 text-center">
              <p className="text-slate-400 text-sm">No classrooms found. Try selecting "All Buildings".</p>
            </GlassCard>
          ) : (
            filteredRooms.map((room) => {
              const catCfg = CAT_COLORS[room.category] || CAT_COLORS['Classroom'];
              const occupancyPct = room.capacity > 0 ? Math.round(((room.currentOccupancy || 0) / room.capacity) * 100) : 0;
              return (
                <motion.div
                  key={room._id}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass-card flex flex-col justify-between p-5 hover:border-cyan-500/30"
                >
                  <div>
                    {/* Category + availability */}
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold uppercase tracking-wider ${catCfg.bg} ${catCfg.text} border ${catCfg.border}`}>
                        {room.category}
                      </span>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${room.availability ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25' : 'bg-rose-500/15 text-rose-400 border border-rose-500/25'}`}>
                        {room.availability ? '● Available' : '✕ Occupied'}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white mb-0.5">{room.roomNumber}</h4>
                    <p className="text-xs text-slate-400 mb-3">{room.building?.name || 'Main Campus Building'}</p>

                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                      {[
                        { label: 'Floor', value: `F${room.floor || 1}` },
                        { label: 'Capacity', value: `${room.capacity}` },
                        { label: 'Occupancy', value: `${room.currentOccupancy || 0}` },
                      ].map(({ label, value }) => (
                        <div key={label} className="bg-slate-900/60 rounded-xl p-2 border border-slate-800/60">
                          <p className="text-sm font-bold text-white">{value}</p>
                          <p className="text-[9px] text-slate-500 uppercase tracking-wider mt-0.5">{label}</p>
                        </div>
                      ))}
                    </div>

                    {/* Occupancy bar */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                        <span>Occupancy</span>
                        <span className="font-bold text-slate-400">{occupancyPct}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            occupancyPct > 80 ? 'bg-rose-500' : occupancyPct > 50 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${occupancyPct}%` }}
                        />
                      </div>
                    </div>

                    {/* Facilities tags */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {room.facilities?.slice(0, 4).map((fac, idx) => (
                        <span key={idx} className="text-[10px] bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded-lg border border-slate-700/60">
                          {fac}
                        </span>
                      ))}
                      {room.facilities?.length > 4 && (
                        <span className="text-[10px] text-slate-500 px-2 py-0.5">+{room.facilities.length - 4} more</span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedRoomForBooking(room)}
                    className="w-full btn-gradient py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Book Room Slot
                  </button>
                </motion.div>
              );
            })
          )}
        </div>
      )}

      {/* Booking Modal */}
      {selectedRoomForBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <BookingForm
            targetItem={selectedRoomForBooking}
            bookingType="Facility"
            onClose={() => setSelectedRoomForBooking(null)}
            onSuccess={handleBookingCreated}
          />
        </div>
      )}

      {/* QR Modal */}
      <QRModal
        isOpen={Boolean(activeQR)}
        onClose={() => setActiveQR(null)}
        title="Campus Facility Verification Ticket"
        qrData={activeQR}
      />
    </div>
  );
};
