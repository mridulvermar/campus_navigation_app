import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MOCK_ROOMS, MOCK_BOOKINGS } from '../data/mockData';
import { GlassCard } from '../components/common/GlassCard';
import { BookingForm } from '../components/booking/BookingForm';
import { QRModal } from '../components/common/QRModal';
import { CalendarCheck, Building2, Users, Clock, QrCode, Plus, CheckCircle2, Shield, Loader2, Filter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { apiService } from '../services/api';

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

  const fetchBookingsAndRooms = async () => {
    setLoading(true);
    try {
      const [resBookings, resRooms, resBuildings] = await Promise.all([
        apiService.getMyBookings(),
        apiService.getRooms(),
        apiService.getBuildings()
      ]);

      const loadedBookings = (resBookings && resBookings.data && Array.isArray(resBookings.data))
        ? resBookings.data
        : MOCK_BOOKINGS;

      const loadedRooms = (resRooms && resRooms.data && Array.isArray(resRooms.data))
        ? resRooms.data
        : MOCK_ROOMS;

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

  useEffect(() => {
    fetchBookingsAndRooms();
  }, []);

  // Sync building query param if set from map navigation
  useEffect(() => {
    if (buildingQuery) {
      setSelectedBuildingFilter(buildingQuery);
      setActiveTab('bookFacility');
    }
  }, [buildingQuery]);

  // Listen for Socket.IO real-time booking updates
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
      setBookings((prev) =>
        prev.map((b) => (b._id === updatedBooking._id ? { ...b, ...updatedBooking } : b))
      );
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

  // Filter classrooms by building and category
  const filteredRooms = rooms.filter((r) => {
    const buildingCodeOrId = r.building?.code || r.building?._id || '';
    const buildingName = r.building?.name || '';
    const matchesBuilding = selectedBuildingFilter === 'All' || 
      buildingCodeOrId.toLowerCase() === selectedBuildingFilter.toLowerCase() ||
      buildingName.toLowerCase().includes(selectedBuildingFilter.toLowerCase());

    const matchesCategory = selectedCategoryFilter === 'All' || r.category === selectedCategoryFilter;
    return matchesBuilding && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <CalendarCheck className="w-6 h-6 text-emerald-400" /> Facility & Classroom Reservation Hub
          </h1>
          <p className="text-xs text-slate-400">
            Select a campus building to view and reserve its available classrooms, labs, and seminar pods
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
            My Reservations ({bookings.length})
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

      {activeTab === 'bookFacility' && (
        <GlassCard className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-cyan-500/30">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-white">Select Building:</span>
            <select
              value={selectedBuildingFilter}
              onChange={(e) => setSelectedBuildingFilter(e.target.value)}
              className="glass-input text-xs py-1.5 px-3 bg-slate-900 border-slate-700 text-cyan-300 font-bold rounded-xl"
            >
              <option value="All">All Buildings ({rooms.length} Rooms)</option>
              {buildings.map((b) => (
                <option key={b._id} value={b.code}>
                  {b.name} ({b.code})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 text-xs">
            {['All', 'Classroom', 'Labs', 'Seminar Hall', 'Library Rooms', 'Meeting Rooms'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategoryFilter(cat)}
                className={`px-3 py-1 rounded-xl font-semibold transition-all ${
                  selectedCategoryFilter === cat
                    ? 'bg-cyan-500 text-white shadow-md'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </GlassCard>
      )}

      {loading ? (
        <GlassCard className="p-8 text-center text-slate-400 flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-cyan-400" /> Loading reservations & facilities...
        </GlassCard>
      ) : activeTab === 'myBookings' ? (
        <div className="space-y-4">
          {bookings.length === 0 ? (
            <GlassCard className="p-8 text-center text-slate-400">
              No reservations found. Click "Reserve Campus Room" to place a request.
            </GlassCard>
          ) : (
            bookings.map((bk) => (
              <GlassCard key={bk._id} className="p-5">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-400">{bk.bookingType || 'Facility'}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          bk.status === 'Approved' 
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                            : bk.status === 'Rejected'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}>
                          {bk.status}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white mt-1">
                        {bk.asset?.assetName || bk.room?.roomNumber || 'Room / Facility Reservation'}
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
                      onClick={() => setActiveQR(bk.qrCodeData || `CAMPUS-BOOKING-${bk._id}`)}
                      className="flex-1 md:flex-none btn-gradient px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                    >
                      <QrCode className="w-4 h-4" /> Show Access QR Code
                    </button>
                  </div>
                </div>
              </GlassCard>
            ))
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.length === 0 ? (
            <GlassCard className="col-span-full p-8 text-center text-slate-400">
              No classrooms found matching the selected building filter. Try selecting "All Buildings".
            </GlassCard>
          ) : (
            filteredRooms.map((room) => (
              <GlassCard key={room._id} className="flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-400">{room.category}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${room.availability ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
                      {room.availability ? 'Available' : 'Occupied'}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white mb-1">{room.roomNumber}</h4>
                  <p className="text-xs text-slate-400 mb-3">{room.building?.name || 'Main Campus Building'}</p>

                  <div className="space-y-1.5 text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800 mb-4">
                    <div className="flex items-center justify-between">
                      <span>Floor / Level:</span>
                      <span className="font-bold text-white">Floor {room.floor || 1}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Seating Capacity:</span>
                      <span className="font-bold text-white">{room.capacity} seats</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Current Occupancy:</span>
                      <span className="font-bold text-cyan-400">{room.currentOccupancy || 0} inside</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {room.facilities?.map((fac, idx) => (
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
            ))
          )}
        </div>
      )}

      {/* Booking Modal */}
      {selectedRoomForBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <BookingForm
            targetItem={selectedRoomForBooking}
            bookingType="Facility"
            onClose={() => setSelectedRoomForBooking(null)}
            onSuccess={handleBookingCreated}
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


