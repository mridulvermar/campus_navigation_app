import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, Modal, Alert } from 'react-native';
import { 
  CalendarCheck, 
  Clock, 
  Users, 
  MapPin, 
  Search, 
  Plus, 
  CheckCircle, 
  QrCode, 
  X, 
  Sparkles,
  Layers,
  ChevronRight
} from 'lucide-react-native';
import { colors } from '../theme/colors';
import { HeaderBar } from '../components/common/HeaderBar';
import { GlassCard } from '../components/common/GlassCard';
import { Badge } from '../components/common/Badge';
import { QRModal } from '../components/common/QRModal';
import { apiService } from '../services/api';
import { MOCK_ROOMS } from '../data/mockData';

const BUILDING_FILTERS = ['All Blocks', 'IB Block', 'AS Block', 'ME Block', 'CS Block', 'SF Block'];

export const BookingsScreen = ({ route, navigation }) => {
  const [rooms, setRooms] = useState(MOCK_ROOMS);
  const [myBookings, setMyBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('browse'); // 'browse' or 'my_passes'
  const [selectedBuildingFilter, setSelectedBuildingFilter] = useState('All Blocks');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Booking Modal State
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [purpose, setPurpose] = useState('');
  const [startTime, setStartTime] = useState('09:00 AM');
  const [endTime, setEndTime] = useState('11:00 AM');
  const [date, setDate] = useState('2026-08-30');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // QR Modal State
  const [viewingQRBooking, setViewingQRBooking] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const roomsRes = await apiService.getRooms();
        if (roomsRes?.data) setRooms(roomsRes.data);

        const bookingsRes = await apiService.getMyBookings();
        if (bookingsRes?.data) setMyBookings(bookingsRes.data);
      } catch (e) {}
    };
    loadData();

    if (route?.params?.building) {
      setSelectedBuildingFilter(route.params.building);
    }
  }, [route?.params]);

  const filteredRooms = rooms.filter((r) => {
    const matchesFilter = selectedBuildingFilter === 'All Blocks' || 
      (r.building && r.building.name && r.building.name.includes(selectedBuildingFilter)) ||
      (r.building && r.building.code && r.building.code.includes(selectedBuildingFilter));
    const matchesSearch = !searchQuery || 
      (r.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
      (r.roomNumber || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleOpenBookingModal = (room) => {
    setSelectedRoom(room);
    setPurpose('Classroom Session / Team Hackathon');
    setIsModalOpen(true);
  };

  const handleConfirmBooking = async () => {
    if (!purpose) {
      Alert.alert('Required', 'Please enter booking purpose');
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
      const created = res.data || { ...newBookingData, _id: 'bk_' + Date.now(), status: 'Pending' };
      setMyBookings((prev) => [created, ...prev]);
      setActiveTab('my_passes');
      Alert.alert('Booking Confirmed', 'Your digital pass has been generated!');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderBar
        title="Facility Reservation Hub"
        subtitle="428 Classrooms, Lecture Halls & Computer Labs"
        navigation={navigation}
      />

      <View style={styles.container}>
        {/* Navigation Tabs: Browse Facilities vs My Digital Passes */}
        <View style={styles.tabSwitcher}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'browse' && styles.tabBtnActive]}
            onPress={() => setActiveTab('browse')}
          >
            <Layers size={14} color={activeTab === 'browse' ? '#070B14' : colors.textSecondary} />
            <Text style={[styles.tabText, activeTab === 'browse' && styles.tabTextActive]}>
              Available Facilities ({filteredRooms.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'my_passes' && styles.tabBtnActive]}
            onPress={() => setActiveTab('my_passes')}
          >
            <CalendarCheck size={14} color={activeTab === 'my_passes' ? '#070B14' : colors.textSecondary} />
            <Text style={[styles.tabText, activeTab === 'my_passes' && styles.tabTextActive]}>
              My Passes ({myBookings.length})
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'browse' ? (
          <ScrollView style={styles.scrollArea} contentContainerStyle={{ paddingBottom: 40 }}>
            {/* Search Bar */}
            <View style={styles.searchBar}>
              <Search size={16} color={colors.primary} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by room name, lab code, capacity..."
                placeholderTextColor={colors.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery ? (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <X size={16} color={colors.textSecondary} />
                </TouchableOpacity>
              ) : null}
            </View>

            {/* Block Filter Pills */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterScroll}
            >
              {BUILDING_FILTERS.map((b) => (
                <TouchableOpacity
                  key={b}
                  style={[styles.filterPill, selectedBuildingFilter === b && styles.filterPillActive]}
                  onPress={() => setSelectedBuildingFilter(b)}
                >
                  <Text style={[styles.filterText, selectedBuildingFilter === b && styles.filterTextActive]}>
                    {b}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Facilities Cards Grid */}
            <View style={styles.roomsList}>
              {filteredRooms.map((room) => (
                <GlassCard key={room._id} style={styles.roomCard} glow>
                  <View style={styles.roomCardHeader}>
                    <View>
                      <View style={styles.blockRow}>
                        <Text style={styles.blockTag}>{room.building?.name || 'Academic Block'}</Text>
                        <Text style={styles.floorTag}>• Floor {room.floor || 2}</Text>
                      </View>
                      <Text style={styles.roomTitle}>{room.name || room.roomNumber}</Text>
                    </View>
                    <Badge variant={room.type === 'Lab' ? 'secondary' : 'primary'} size="sm">
                      {room.type || 'Lecture Hall'}
                    </Badge>
                  </View>

                  <View style={styles.featuresRow}>
                    <View style={styles.featItem}>
                      <Users size={12} color={colors.accent} />
                      <Text style={styles.featText}>Seats: {room.capacity || 60}</Text>
                    </View>
                    <View style={styles.featItem}>
                      <Sparkles size={12} color={colors.primary} />
                      <Text style={styles.featText}>Smart Projector & AC</Text>
                    </View>
                  </View>

                  <View style={styles.roomCardFooter}>
                    <TouchableOpacity
                      style={styles.reserveBtn}
                      onPress={() => handleOpenBookingModal(room)}
                    >
                      <CalendarCheck size={14} color="#070B14" />
                      <Text style={styles.reserveBtnText}>Reserve Classroom</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.routeBtn}
                      onPress={() => navigation.navigate('Navigation', { destCode: room.roomNumber || room.name })}
                    >
                      <MapPin size={14} color={colors.primary} />
                    </TouchableOpacity>
                  </View>
                </GlassCard>
              ))}
            </View>
          </ScrollView>
        ) : (
          <ScrollView style={styles.scrollArea} contentContainerStyle={{ paddingBottom: 40 }}>
            {myBookings.length > 0 ? (
              myBookings.map((b) => (
                <GlassCard key={b._id} style={styles.passCard} glow>
                  <View style={styles.passHeader}>
                    <View>
                      <Text style={styles.passRoom}>{b.room?.name || b.room?.roomNumber || 'Classroom / Hall'}</Text>
                      <Text style={styles.passPurpose}>{b.purpose}</Text>
                    </View>
                    <Badge variant={b.status === 'Approved' ? 'success' : 'warning'} size="sm">
                      {b.status || 'Active'}
                    </Badge>
                  </View>

                  <View style={styles.passMetaRow}>
                    <View style={styles.passMetaItem}>
                      <Clock size={12} color={colors.primary} />
                      <Text style={styles.passMetaText}>{b.date || 'Today'} • {b.startTime} - {b.endTime}</Text>
                    </View>
                  </View>

                  <View style={styles.passFooter}>
                    <TouchableOpacity
                      style={styles.qrBtn}
                      onPress={() => setViewingQRBooking(b)}
                    >
                      <QrCode size={14} color="#070B14" />
                      <Text style={styles.qrBtnText}>Show Digital Pass</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.navPassBtn}
                      onPress={() => navigation.navigate('Navigation', { destCode: b.room?.roomNumber || b.room?.name })}
                    >
                      <MapPin size={14} color={colors.primary} />
                      <Text style={styles.navPassText}>Directions</Text>
                    </TouchableOpacity>
                  </View>
                </GlassCard>
              ))
            ) : (
              <GlassCard style={styles.emptyPasses}>
                <Text style={styles.emptyTitle}>No Active Facility Reservations</Text>
                <Text style={styles.emptySubtitle}>You have not reserved any classrooms or laboratories yet.</Text>
                <TouchableOpacity
                  style={styles.browseNowBtn}
                  onPress={() => setActiveTab('browse')}
                >
                  <Text style={styles.browseNowText}>Browse Available Rooms</Text>
                </TouchableOpacity>
              </GlassCard>
            )}
          </ScrollView>
        )}

        {/* Booking Creation Modal */}
        <Modal
          visible={isModalOpen}
          transparent
          animationType="slide"
          onRequestClose={() => setIsModalOpen(false)}
        >
          <View style={styles.modalOverlay}>
            <GlassCard style={styles.modalContent} glow>
              <View style={styles.modalHeader}>
                <Text style={styles.modalHeading}>Reserve {selectedRoom?.name || 'Classroom'}</Text>
                <TouchableOpacity onPress={() => setIsModalOpen(false)}>
                  <X size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <View style={styles.modalBody}>
                <Text style={styles.fieldLabel}>Purpose / Event Title</Text>
                <TextInput
                  style={styles.modalInput}
                  value={purpose}
                  onChangeText={setPurpose}
                  placeholder="e.g. AI Hackathon Mentorship"
                  placeholderTextColor={colors.textMuted}
                />

                <View style={styles.timeRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.fieldLabel}>Start Time</Text>
                    <TextInput
                      style={styles.modalInput}
                      value={startTime}
                      onChangeText={setStartTime}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.fieldLabel}>End Time</Text>
                    <TextInput
                      style={styles.modalInput}
                      value={endTime}
                      onChangeText={setEndTime}
                    />
                  </View>
                </View>

                <Text style={styles.fieldLabel}>Reservation Date</Text>
                <TextInput
                  style={styles.modalInput}
                  value={date}
                  onChangeText={setDate}
                />

                <TouchableOpacity
                  style={styles.confirmSubmitBtn}
                  onPress={handleConfirmBooking}
                  disabled={isSubmitting}
                >
                  <CheckCircle size={16} color="#070B14" />
                  <Text style={styles.confirmSubmitText}>
                    {isSubmitting ? 'Confirming...' : 'Generate Instant Pass'}
                  </Text>
                </TouchableOpacity>
              </View>
            </GlassCard>
          </View>
        </Modal>

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
    padding: 16
  },
  tabSwitcher: {
    flexDirection: 'row',
    backgroundColor: colors.cardBgLight,
    borderRadius: 14,
    padding: 4,
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
    borderRadius: 10
  },
  tabBtnActive: {
    backgroundColor: colors.primary
  },
  tabText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary
  },
  tabTextActive: {
    color: '#070B14',
    fontWeight: '800'
  },
  scrollArea: {
    flex: 1
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    marginBottom: 10
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: 12,
    padding: 0
  },
  filterScroll: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 10
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.cardBgLight,
    borderWidth: 1,
    borderColor: colors.cardBorder
  },
  filterPillActive: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary
  },
  filterText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary
  },
  filterTextActive: {
    color: colors.white,
    fontWeight: '800'
  },
  roomsList: {
    gap: 10
  },
  roomCard: {
    padding: 14
  },
  roomCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  blockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  blockTag: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.8
  },
  floorTag: {
    fontSize: 10,
    color: colors.textMuted
  },
  roomTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
    marginTop: 2
  },
  featuresRow: {
    flexDirection: 'row',
    gap: 14,
    marginVertical: 10
  },
  featItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  featText: {
    fontSize: 11,
    color: colors.textSecondary
  },
  roomCardFooter: {
    flexDirection: 'row',
    gap: 8
  },
  reserveBtn: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6
  },
  reserveBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#070B14'
  },
  routeBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: colors.cardBgLight,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center'
  },
  passCard: {
    padding: 14,
    marginBottom: 10
  },
  passHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6
  },
  passRoom: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text
  },
  passPurpose: {
    fontSize: 12,
    color: colors.textSecondary
  },
  passMetaRow: {
    marginVertical: 8
  },
  passMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  passMetaText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '600'
  },
  passFooter: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4
  },
  qrBtn: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6
  },
  qrBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#070B14'
  },
  navPassBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: colors.cardBgLight,
    borderWidth: 1,
    borderColor: colors.cardBorder
  },
  navPassText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary
  },
  emptyPasses: {
    alignItems: 'center',
    padding: 24,
    marginTop: 20
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4
  },
  emptySubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 14
  },
  browseNowBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10
  },
  browseNowText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#070B14'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    padding: 16
  },
  modalContent: {
    backgroundColor: '#0F172A',
    padding: 18
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  modalHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text
  },
  modalBody: {
    gap: 10
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary
  },
  modalInput: {
    backgroundColor: colors.inputBg,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    color: colors.text,
    fontSize: 12,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  timeRow: {
    flexDirection: 'row',
    gap: 10
  },
  confirmSubmitBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 10
  },
  confirmSubmitText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#070B14'
  }
});
