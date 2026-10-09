import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, SafeAreaView, Alert, Platform } from 'react-native';
import { Layers, CalendarCheck, Search, ShieldCheck } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { useAuth } from '../context/AuthContext';
import { HeaderBar } from '../components/common/HeaderBar';
import { GlassCard } from '../components/common/GlassCard';
import { QRModal } from '../components/common/QRModal';
import { apiService } from '../services/api';
import { MOCK_ROOMS, MOCK_BOOKINGS } from '../data/mockData';
import { RoomCardItem } from '../components/booking/RoomCardItem';
import { PassCardItem } from '../components/booking/PassCardItem';
import { BookingCreationModal } from '../components/booking/BookingCreationModal';
import { SearchAndFilterBar } from '../components/booking/SearchAndFilterBar';

const BUILDING_FILTERS = ['All Blocks', 'IB Block', 'AS Block', 'ME Block', 'CS Block', 'SF Block'];

export const BookingsScreen = ({ route, navigation }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'Administrator' || user?.role === 'admin' || (typeof user?.email === 'string' && user.email.includes('admin'));

  const [rooms, setRooms] = useState(MOCK_ROOMS);
  const [allBookings, setAllBookings] = useState(MOCK_BOOKINGS);
  const [myBookings, setMyBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('browse'); // 'browse' or 'my_passes'
  const [selectedBuildingFilter, setSelectedBuildingFilter] = useState('All Blocks');
  const [availabilityFilter, setAvailabilityFilter] = useState('all'); // 'all', 'available', 'booked'
  const [searchQuery, setSearchQuery] = useState('');
  
  // Booking Modal State
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [purpose, setPurpose] = useState('');
  const [startTime, setStartTime] = useState('09:00 AM');
  const [endTime, setEndTime] = useState('11:00 AM');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // QR Modal State
  const [viewingQRBooking, setViewingQRBooking] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const roomsRes = await apiService.getRooms();
        if (isMounted && roomsRes?.data) setRooms(roomsRes.data);

        // Fetch active bookings to calculate live room availability
        const allBookingsRes = await apiService.getBookings();
        if (isMounted && allBookingsRes?.data) setAllBookings(allBookingsRes.data);

        const myBookingsRes = await apiService.getMyBookings();
        if (isMounted && myBookingsRes?.data) setMyBookings(myBookingsRes.data);
      } catch (e) {}
    };
    loadData();

    if (route?.params?.building) {
      setSelectedBuildingFilter(route.params.building);
    }
    return () => {
      isMounted = false;
    };
  }, [route?.params]);

  // Lookup map of active present/today bookings keyed by room identifier
  const activeBookingsMap = useMemo(() => {
    const map = {};
    const todayStr = new Date().toISOString().split('T')[0];

    allBookings.forEach((b) => {
      // Check if booking is active (Pending or Approved) and for today / recent
      if (b.status !== 'Rejected' && b.status !== 'Cancelled') {
        const isTodayOrRecent = !b.date || b.date === todayStr || b.date === 'Today' || b.date >= todayStr;
        if (isTodayOrRecent) {
          if (b.room) {
            if (b.room._id) map[String(b.room._id)] = b;
            if (b.room.roomNumber) map[String(b.room.roomNumber).toLowerCase()] = b;
            if (b.room.name) map[String(b.room.name).toLowerCase()] = b;
          }
          if (b.roomId) map[String(b.roomId)] = b;
        }
      }
    });
    return map;
  }, [allBookings]);

  // Counts of available vs booked rooms
  const { availableCount, bookedCount } = useMemo(() => {
    let booked = 0;
    rooms.forEach((r) => {
      const isBooked = !!(
        activeBookingsMap[String(r._id)] ||
        activeBookingsMap[String(r.roomNumber || '').toLowerCase()] ||
        activeBookingsMap[String(r.name || '').toLowerCase()]
      );
      if (isBooked) booked++;
    });
    return {
      availableCount: Math.max(0, rooms.length - booked),
      bookedCount: booked
    };
  }, [rooms, activeBookingsMap]);

  // Memoize filtered rooms for fast search & live status filtering
  const filteredRooms = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return rooms.filter((r) => {
      const matchesFilter = selectedBuildingFilter === 'All Blocks' || 
        (r.building?.name && r.building.name.includes(selectedBuildingFilter)) ||
        (r.building?.code && r.building.code.includes(selectedBuildingFilter));
      if (!matchesFilter) return false;

      const activeBooking = (
        activeBookingsMap[String(r._id)] ||
        activeBookingsMap[String(r.roomNumber || '').toLowerCase()] ||
        activeBookingsMap[String(r.name || '').toLowerCase()]
      );

      if (availabilityFilter === 'available' && activeBooking) return false;
      if (availabilityFilter === 'booked' && !activeBooking) return false;

      if (!q) return true;
      return (
        (r.name && r.name.toLowerCase().includes(q)) || 
        (r.roomNumber && r.roomNumber.toLowerCase().includes(q)) ||
        (r.type && r.type.toLowerCase().includes(q)) ||
        (r.building?.name && r.building.name.toLowerCase().includes(q))
      );
    });
  }, [rooms, selectedBuildingFilter, availabilityFilter, searchQuery, activeBookingsMap]);

  // Callbacks
  const handleOpenBookingModal = useCallback((room) => {
    if (user?.role === 'Guest') {
      Alert.alert(
        'Student / Faculty Account Required',
        'Guest Explorer Mode allows viewing live facility availability, interactive maps, and events. To reserve a room or generate a digital pass, please sign in with your institutional credentials.',
        [
          { text: 'Keep Exploring', style: 'cancel' },
          { text: 'Sign In', onPress: () => navigation.navigate('Login') }
        ]
      );
      return;
    }
    setSelectedRoom(room);
    setPurpose('Classroom Session / Event Reservation');
    setIsModalOpen(true);
  }, [user, navigation]);

  const handleNavigateToRoom = useCallback((destCode) => {
    navigation.navigate('Navigation', { destCode });
  }, [navigation]);

  const handleShowQR = useCallback((booking) => {
    setViewingQRBooking(booking);
  }, []);

  const handleConfirmBooking = async () => {
    if (!purpose.trim()) {
      Alert.alert('Required', 'Please enter booking purpose or event title');
      return;
    }
    setIsSubmitting(true);
    const newBookingData = {
      room: selectedRoom,
      purpose,
      date,
      startTime,
      endTime,
      durationHours: 2
    };

    const res = await apiService.createBooking(newBookingData);
    setIsSubmitting(false);
    setIsModalOpen(false);

    if (res?.success) {
      const created = res.data || { 
        ...newBookingData, 
        _id: 'bk_' + Date.now(), 
        status: 'Pending',
        user: { name: user?.name || 'Current User', email: user?.email || 'student@campus.edu' }
      };
      setMyBookings((prev) => [created, ...prev]);
      setAllBookings((prev) => [created, ...prev]);
      setActiveTab('my_passes');
      Alert.alert('Booking Confirmed', 'Your digital pass has been generated and logged for administrator tracking!');
    }
  };

  // Render items for FlatList
  const renderRoomItem = useCallback(({ item }) => {
    const activeBooking = (
      activeBookingsMap[String(item._id)] ||
      activeBookingsMap[String(item.roomNumber || '').toLowerCase()] ||
      activeBookingsMap[String(item.name || '').toLowerCase()]
    );

    return (
      <RoomCardItem
        room={item}
        activeBooking={activeBooking}
        onReserve={handleOpenBookingModal}
        onNavigate={handleNavigateToRoom}
      />
    );
  }, [activeBookingsMap, handleOpenBookingModal, handleNavigateToRoom]);

  const renderPassItem = useCallback(({ item }) => (
    <PassCardItem
      booking={item}
      onShowQR={handleShowQR}
      onNavigate={handleNavigateToRoom}
    />
  ), [handleShowQR, handleNavigateToRoom]);

  const roomKeyExtractor = useCallback((item) => (
    String(item._id || item.id || item.roomNumber || item.name)
  ), []);

  const passKeyExtractor = useCallback((item) => (
    String(item._id || item.id || item.qrCodeData || item.date)
  ), []);

  // List Header Component for Browse Rooms
  const renderBrowseHeader = useMemo(() => (
    <View>
      {/* Admin Fast-Switch Banner if Admin */}
      {isAdmin && (
        <TouchableOpacity
          style={styles.adminBanner}
          onPress={() => navigation.navigate('Admin')}
          activeOpacity={0.85}
        >
          <ShieldCheck size={18} color="#070B14" />
          <View style={{ flex: 1 }}>
            <Text style={styles.adminBannerTitle}>Admin Control Center Active</Text>
            <Text style={styles.adminBannerSub}>
              Track live present bookings & moderate facility requests ↗
            </Text>
          </View>
        </TouchableOpacity>
      )}

      <SearchAndFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        buildingFilters={BUILDING_FILTERS}
        selectedFilter={selectedBuildingFilter}
        onSelectFilter={setSelectedBuildingFilter}
        availabilityFilter={availabilityFilter}
        onSelectAvailabilityFilter={setAvailabilityFilter}
        availableCount={availableCount}
        bookedCount={bookedCount}
      />
    </View>
  ), [isAdmin, navigation, searchQuery, selectedBuildingFilter, availabilityFilter, availableCount, bookedCount]);

  // Empty List Component for Rooms
  const renderEmptyRooms = useCallback(() => (
    <GlassCard style={styles.emptyState}>
      <Search size={32} color={colors.textMuted} style={{ marginBottom: 10 }} />
      <Text style={styles.emptyTitle}>No Classrooms Found</Text>
      <Text style={styles.emptySubtitle}>
        No facilities match your search query or selected availability filter.
      </Text>
    </GlassCard>
  ), []);

  // Empty List Component for Passes
  const renderEmptyPasses = useCallback(() => (
    <GlassCard style={styles.emptyState}>
      <Text style={styles.emptyTitle}>No Active Facility Reservations</Text>
      <Text style={styles.emptySubtitle}>
        You have not reserved any classrooms or laboratories yet.
      </Text>
      <TouchableOpacity
        style={styles.browseNowBtn}
        onPress={() => setActiveTab('browse')}
        activeOpacity={0.8}
      >
        <Text style={styles.browseNowText}>Browse Available Rooms</Text>
      </TouchableOpacity>
    </GlassCard>
  ), []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderBar
        title="Facility Reservation Hub"
        subtitle="Live Classroom Availability & Event Bookings"
        navigation={navigation}
      />

      <View style={styles.container}>
        {/* Navigation Tabs: Browse Facilities vs My Digital Passes */}
        <View style={styles.tabSwitcher}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'browse' && styles.tabBtnActive]}
            onPress={() => setActiveTab('browse')}
            activeOpacity={0.8}
          >
            <Layers size={14} color={activeTab === 'browse' ? '#070B14' : colors.textSecondary} />
            <Text style={[styles.tabText, activeTab === 'browse' && styles.tabTextActive]}>
              Available Facilities ({filteredRooms.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'my_passes' && styles.tabBtnActive]}
            onPress={() => setActiveTab('my_passes')}
            activeOpacity={0.8}
          >
            <CalendarCheck size={14} color={activeTab === 'my_passes' ? '#070B14' : colors.textSecondary} />
            <Text style={[styles.tabText, activeTab === 'my_passes' && styles.tabTextActive]}>
              My Passes ({myBookings.length})
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'browse' ? (
          <FlatList
            data={filteredRooms}
            renderItem={renderRoomItem}
            keyExtractor={roomKeyExtractor}
            ListHeaderComponent={renderBrowseHeader}
            ListEmptyComponent={renderEmptyRooms}
            initialNumToRender={8}
            maxToRenderPerBatch={8}
            windowSize={5}
            removeClippedSubviews={Platform.OS !== 'web'}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            style={styles.flatList}
          />
        ) : (
          <FlatList
            data={myBookings}
            renderItem={renderPassItem}
            keyExtractor={passKeyExtractor}
            ListEmptyComponent={renderEmptyPasses}
            initialNumToRender={8}
            maxToRenderPerBatch={8}
            windowSize={5}
            removeClippedSubviews={Platform.OS !== 'web'}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            style={styles.flatList}
          />
        )}

        {/* Booking Creation Modal with BlurView */}
        <BookingCreationModal
          visible={isModalOpen}
          room={selectedRoom}
          purpose={purpose}
          setPurpose={setPurpose}
          startTime={startTime}
          setStartTime={setStartTime}
          endTime={endTime}
          setEndTime={setEndTime}
          date={date}
          setDate={setDate}
          isSubmitting={isSubmitting}
          onConfirm={handleConfirmBooking}
          onClose={() => setIsModalOpen(false)}
        />

        {/* QR Pass Modal */}
        <QRModal
          visible={!!viewingQRBooking}
          booking={viewingQRBooking}
          onClose={() => setViewingQRBooking(null)}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16
  },
  adminBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12
  },
  adminBannerTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#070B14',
    fontFamily: 'Sora'
  },
  adminBannerSub: {
    fontSize: 11,
    color: 'rgba(7, 11, 20, 0.75)',
    marginTop: 1
  },
  tabSwitcher: {
    flexDirection: 'row',
    backgroundColor: colors.cardBgLight,
    borderRadius: 12,
    padding: 3,
    gap: 4,
    marginBottom: 12
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: 9
  },
  tabBtnActive: {
    backgroundColor: colors.cardBg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2
  },
  tabText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary
  },
  tabTextActive: {
    color: colors.text,
    fontWeight: '800'
  },
  flatList: {
    flex: 1
  },
  listContent: {
    paddingBottom: 40
  },
  emptyState: {
    alignItems: 'center',
    padding: 24,
    marginTop: 20
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
    fontFamily: 'Sora'
  },
  emptySubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 14
  },
  browseNowBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10
  },
  browseNowText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#28231D',
    fontFamily: 'Sora'
  }
});
