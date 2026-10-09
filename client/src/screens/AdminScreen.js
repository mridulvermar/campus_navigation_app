import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList,
  StyleSheet, 
  SafeAreaView, 
  Alert, 
  TextInput,
  Platform 
} from 'react-native';
import { 
  ShieldCheck, 
  CheckCircle, 
  XCircle, 
  Clock, 
  CalendarCheck, 
  Building2, 
  MapPin, 
  User, 
  RefreshCw,
  QrCode,
  Search,
  BookOpen,
  Tv,
  X,
  Armchair,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { HeaderBar } from '../components/common/HeaderBar';
import { GlassCard } from '../components/common/GlassCard';
import { Badge } from '../components/common/Badge';
import { apiService } from '../services/api';

export const AdminScreen = ({ navigation }) => {
  const [bookings, setBookings] = useState([]);
  const [adminTab, setAdminTab] = useState('pending'); // 'pending' | 'live' | 'class_details'
  const [classFilterCategory, setClassFilterCategory] = useState('all'); // 'all' | 'class' | 'lab' | 'event'
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await apiService.getBookings();
      if (res?.data && Array.isArray(res.data)) {
        setBookings(res.data);
      }
    } catch (e) {
    } finally {
      setRefreshing(false);
    }
  }, []);

  // Reload data automatically whenever the Admin screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  // All Pending Bookings needing approval (Always 100% visible regardless of date string)
  const pendingBookings = useMemo(() => {
    return bookings.filter((b) => b && (b.status === 'Pending' || b.status === 'pending_approval'));
  }, [bookings]);

  // Approved active bookings
  const liveApprovedBookings = useMemo(() => {
    return bookings.filter((b) => b && (b.status === 'Approved' || b.status === 'Completed'));
  }, [bookings]);

  // Filtered list for "Booked Class Details" tab
  const displayedClassDetails = useMemo(() => {
    return bookings.filter((b) => {
      const roomName = (b.room?.name || b.room?.roomNumber || b.asset?.assetName || '').toLowerCase();
      const buildingName = (b.room?.building?.name || b.asset?.location || '').toLowerCase();
      const userName = (b.user?.name || '').toLowerCase();
      const userDept = (b.user?.department || '').toLowerCase();
      const purpose = (b.purpose || '').toLowerCase();
      const q = searchQuery.trim().toLowerCase();

      const matchesSearch = !q || 
        roomName.includes(q) || 
        buildingName.includes(q) || 
        userName.includes(q) || 
        userDept.includes(q) || 
        purpose.includes(q);

      if (!matchesSearch) return false;

      if (classFilterCategory === 'all') return true;
      if (classFilterCategory === 'lab') {
        return roomName.includes('lab') || purpose.includes('lab') || purpose.includes('practical');
      }
      if (classFilterCategory === 'class') {
        return roomName.includes('class') || roomName.includes('hall') || purpose.includes('lecture') || purpose.includes('class');
      }
      if (classFilterCategory === 'event') {
        return purpose.includes('event') || purpose.includes('seminar') || purpose.includes('workshop') || purpose.includes('hackathon');
      }

      return true;
    });
  }, [bookings, searchQuery, classFilterCategory]);

  const handleApprove = useCallback(async (id, label) => {
    try {
      await apiService.updateBookingStatus(id, 'Approved', 'Approved by Campus Administrator');
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: 'Approved' } : b))
      );
      Alert.alert('✅ Reservation Approved', `${label || 'Booking'} is now approved and the student QR pass is active.`);
    } catch (e) {
      Alert.alert('Error', 'Could not approve booking.');
    }
  }, []);

  const handleReject = useCallback(async (id, label) => {
    try {
      await apiService.updateBookingStatus(id, 'Rejected', 'Declined by Campus Administrator');
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: 'Rejected' } : b))
      );
      Alert.alert('🚫 Reservation Rejected', `${label || 'Booking'} has been rejected.`);
    } catch (e) {
      Alert.alert('Error', 'Could not reject booking.');
    }
  }, []);

  // Fast Memoized Renderers for FlatLists
  const renderPendingItem = useCallback(({ item }) => {
    const roomName = item.room?.name || item.room?.roomNumber || item.asset?.assetName || 'Classroom / Facility';
    const buildingName = item.room?.building?.name || item.asset?.location || 'Academic Complex';
    const userName = item.user?.name || 'Student';
    const userEmail = item.user?.email || 'student@campus.edu';
    const userDept = item.user?.department || 'Student';
    const isSeatBooking = item.bookingType === 'Seat' || !item.bookingType;

    return (
      <GlassCard style={styles.pendingCard} glow>
        {/* Prominent Action Header */}
        <View style={styles.cardHeader}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <View style={styles.badgeRow}>
              <View style={styles.seatPillBadge}>
                <Armchair size={12} color={colors.primary} />
                <Text style={styles.seatPillText}>
                  {isSeatBooking ? '1-Seat Student Pass' : 'Whole Facility'}
                </Text>
              </View>
              <Text style={styles.pendingRoomName} numberOfLines={1}>{roomName}</Text>
            </View>
            <Text style={styles.purposeText} numberOfLines={2}>
              📌 {item.purpose || 'Classroom Lecture / Study Session'}
            </Text>
          </View>
          <View style={styles.needsApprovalTag}>
            <AlertTriangle size={11} color="#F59E0B" />
            <Text style={styles.needsApprovalText}>Needs Approval</Text>
          </View>
        </View>

        {/* Details Box */}
        <View style={styles.metaBox}>
          <View style={styles.metaItem}>
            <Clock size={13} color={colors.primary} />
            <Text style={styles.metaText}>
              {item.date || 'Today'} • {item.startTime} - {item.endTime} ({item.durationHours || 2} hrs)
            </Text>
          </View>

          <View style={styles.metaItem}>
            <Building2 size={13} color={colors.textMuted} />
            <Text style={styles.metaText} numberOfLines={1}>
              {buildingName}
            </Text>
          </View>

          <View style={styles.metaItem}>
            <User size={13} color={colors.textSecondary} />
            <Text style={styles.metaText} numberOfLines={1}>
              {userName} ({userEmail}) • {userDept}
            </Text>
          </View>
        </View>

        {/* 1-Tap Action Buttons */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.approveBtn}
            onPress={() => handleApprove(item._id, `1-Seat in ${roomName}`)}
            activeOpacity={0.8}
          >
            <CheckCircle size={16} color="#070B14" />
            <Text style={styles.approveText}>Approve Pass</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.rejectBtn}
            onPress={() => handleReject(item._id, `1-Seat in ${roomName}`)}
            activeOpacity={0.8}
          >
            <XCircle size={16} color={colors.danger} />
            <Text style={styles.rejectText}>Reject</Text>
          </TouchableOpacity>
        </View>
      </GlassCard>
    );
  }, [handleApprove, handleReject]);

  const renderLiveItem = useCallback(({ item }) => {
    const roomName = item.room?.name || item.room?.roomNumber || item.asset?.assetName || 'Classroom / Facility';
    const buildingName = item.room?.building?.name || item.asset?.location || 'Academic Complex';
    const userName = item.user?.name || 'Student / Faculty';
    const userEmail = item.user?.email || 'user@campus.edu';

    return (
      <GlassCard style={styles.bookingCard}>
        <View style={styles.cardHeader}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <View style={styles.badgeRow}>
              <View style={styles.seatPillBadgeGreen}>
                <Armchair size={12} color="#10B981" />
                <Text style={styles.seatPillTextGreen}>1-Seat Pass</Text>
              </View>
              <Text style={styles.roomName} numberOfLines={1}>{roomName}</Text>
            </View>
            <Text style={styles.purposeText} numberOfLines={2}>
              📌 {item.purpose || 'Academic Session'}
            </Text>
          </View>
          <Badge variant="success" size="sm">Active Pass</Badge>
        </View>

        <View style={styles.metaBox}>
          <View style={styles.metaItem}>
            <Clock size={13} color={colors.primary} />
            <Text style={styles.metaText}>
              {item.date || 'Today'} • {item.startTime} - {item.endTime}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <User size={13} color={colors.textSecondary} />
            <Text style={styles.metaText} numberOfLines={1}>
              {userName} ({userEmail})
            </Text>
          </View>
        </View>

        <View style={styles.approvedStatusRow}>
          <View style={styles.approvedPill}>
            <CheckCircle size={13} color="#10B981" />
            <Text style={styles.approvedPillText}>
              {item.checkedIn ? 'Student Checked In' : 'Entry QR Pass Active'}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.navRoomBtn}
            onPress={() => navigation.navigate('Navigation', { destCode: item.room?.roomNumber || item.room?.name })}
            activeOpacity={0.8}
          >
            <MapPin size={13} color={colors.primary} />
            <Text style={styles.navRoomText}>Locate</Text>
          </TouchableOpacity>
        </View>
      </GlassCard>
    );
  }, [navigation]);

  const renderClassDetailItem = useCallback(({ item }) => {
    const roomName = item.room?.name || item.room?.roomNumber || item.asset?.assetName || 'Classroom Room 101';
    const roomNumber = item.room?.roomNumber || item.room?.code || 'RM-101';
    const buildingName = item.room?.building?.name || item.asset?.location || 'Main Academic Block';
    const floorNum = item.room?.floor || 1;
    const capacity = item.room?.capacity || 60;
    const userName = item.user?.name || 'Faculty / Student';
    const userEmail = item.user?.email || 'user@campus.edu';
    const userDept = item.user?.department || 'Computer Science';
    const userRole = item.user?.role || 'Student';
    const isApproved = item.status === 'Approved';
    const isPending = item.status === 'Pending' || item.status === 'pending_approval';

    return (
      <GlassCard style={styles.classDetailCard} glow={isApproved}>
        <View style={styles.classCardHeader}>
          <View style={{ flex: 1 }}>
            <View style={styles.classTitleRow}>
              <Text style={styles.classRoomName}>{roomName}</Text>
              <View style={styles.roomCodeBadge}>
                <Text style={styles.roomCodeText}>{roomNumber}</Text>
              </View>
            </View>
            <Text style={styles.classTopicText}>
              📌 {item.purpose || 'General Course Lecture / Academic Session'}
            </Text>
          </View>
          <Badge 
            variant={isApproved ? 'success' : isPending ? 'warning' : 'danger'}
            size="sm"
          >
            {isApproved ? 'Approved' : isPending ? 'Pending' : 'Rejected'}
          </Badge>
        </View>

        <View style={styles.classDetailGrid}>
          <View style={styles.classDetailCol}>
            <Text style={styles.detailLabel}>VENUE & LOCATION</Text>
            <View style={styles.detailValueRow}>
              <Building2 size={13} color={colors.primary} />
              <Text style={styles.detailValueText} numberOfLines={1}>
                {buildingName} (Floor {floorNum})
              </Text>
            </View>
          </View>

          <View style={styles.classDetailCol}>
            <Text style={styles.detailLabel}>SCHEDULED TIME</Text>
            <View style={styles.detailValueRow}>
              <Clock size={13} color={colors.primary} />
              <Text style={styles.detailValueText}>
                {item.date || 'Today'} • {item.startTime} - {item.endTime}
              </Text>
            </View>
          </View>

          <View style={styles.classDetailCol}>
            <Text style={styles.detailLabel}>RESERVED BY</Text>
            <View style={styles.detailValueRow}>
              <User size={13} color={colors.primary} />
              <Text style={styles.detailValueText} numberOfLines={1}>
                {userName} ({userRole})
              </Text>
            </View>
            <Text style={styles.subDetailText}>{userDept} • {userEmail}</Text>
          </View>
        </View>

        <View style={styles.classCardFooter}>
          {isPending ? (
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={styles.approveBtn}
                onPress={() => handleApprove(item._id, `1-Seat in ${roomName}`)}
                activeOpacity={0.8}
              >
                <CheckCircle size={14} color="#070B14" />
                <Text style={styles.approveText}>Approve Pass</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.rejectBtn}
                onPress={() => handleReject(item._id, `1-Seat in ${roomName}`)}
                activeOpacity={0.8}
              >
                <XCircle size={14} color={colors.danger} />
                <Text style={styles.rejectText}>Reject</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.approvedClassStrip}>
              <View style={styles.qrPassIndicator}>
                <QrCode size={13} color="#10B981" />
                <Text style={styles.qrPassText}>Entry QR Pass Active</Text>
              </View>
              <TouchableOpacity
                style={styles.navRoomBtn}
                onPress={() => navigation.navigate('Navigation', { destCode: item.room?.roomNumber || item.room?.name })}
                activeOpacity={0.8}
              >
                <MapPin size={13} color={colors.primary} />
                <Text style={styles.navRoomText}>Locate Class</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </GlassCard>
    );
  }, [navigation, handleApprove, handleReject]);

  // Headers for virtualized lists
  const renderListHeader = useMemo(() => (
    <View>
      {/* Administrator Status Header */}
      <GlassCard style={styles.banner} glow>
        <View style={styles.bannerIconBox}>
          <ShieldCheck size={20} color="#070B14" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.bannerTitle}>
            {adminTab === 'pending' 
              ? 'Pending Student Approvals' 
              : adminTab === 'live' 
              ? 'Live Active Campus Schedule' 
              : 'Booked Classrooms Registry'}
          </Text>
          <Text style={styles.bannerDesc}>
            {adminTab === 'pending'
              ? 'Review and approve 1-seat student passes with instant 1-tap verification.'
              : adminTab === 'live'
              ? 'Real-time monitoring of all active confirmed passes.'
              : 'Complete registry of occupied classrooms, assigned students & venues.'}
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.refreshBtn} 
          onPress={loadData}
          activeOpacity={0.8}
          title="Refresh Live Data"
        >
          <RefreshCw size={15} color={colors.primary} />
        </TouchableOpacity>
      </GlassCard>

      {/* 3 Summary Metric Cards */}
      <View style={styles.metricsGrid}>
        <GlassCard style={[styles.metricCard, { borderColor: 'rgba(245, 158, 11, 0.4)' }]}>
          <Text style={[styles.metricNumber, { color: '#F59E0B' }]}>{pendingBookings.length}</Text>
          <Text style={styles.metricLabel}>Pending Approval</Text>
        </GlassCard>

        <GlassCard style={styles.metricCard}>
          <Text style={[styles.metricNumber, { color: '#10B981' }]}>{liveApprovedBookings.length}</Text>
          <Text style={styles.metricLabel}>Approved Active</Text>
        </GlassCard>

        <GlassCard style={styles.metricCard}>
          <Text style={[styles.metricNumber, { color: colors.primary }]}>{bookings.length}</Text>
          <Text style={styles.metricLabel}>Total Bookings</Text>
        </GlassCard>
      </View>

      {/* Search Bar only in Booked Classes tab */}
      {adminTab === 'class_details' && (
        <View style={styles.searchBar}>
          <Search size={16} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search class, room, building, or student..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={16} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Section Title */}
      <View style={styles.listHeaderRow}>
        <Text style={styles.heading}>
          {adminTab === 'pending' 
            ? `Awaiting Your Approval (${pendingBookings.length})` 
            : adminTab === 'live' 
            ? `Approved Active Passes (${liveApprovedBookings.length})` 
            : `Classroom Bookings (${displayedClassDetails.length})`}
        </Text>
        <Text style={styles.autoCleanBadge}>⚡ Live Real-Time</Text>
      </View>
    </View>
  ), [adminTab, pendingBookings.length, liveApprovedBookings.length, bookings.length, searchQuery, displayedClassDetails.length, loadData]);

  const renderEmptyState = useMemo(() => {
    if (adminTab === 'pending') {
      return (
        <GlassCard style={styles.emptyState}>
          <CheckCircle2 size={36} color="#10B981" style={{ marginBottom: 8 }} />
          <Text style={styles.emptyTitle}>All Caught Up!</Text>
          <Text style={styles.emptySubtitle}>
            No reservations are awaiting approval right now. New requests will appear here instantly.
          </Text>
        </GlassCard>
      );
    }
    return (
      <GlassCard style={styles.emptyState}>
        <CalendarCheck size={32} color={colors.textMuted} style={{ marginBottom: 8 }} />
        <Text style={styles.emptyTitle}>No Bookings Found</Text>
        <Text style={styles.emptySubtitle}>
          No records match the current view.
        </Text>
      </GlassCard>
    );
  }, [adminTab]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderBar
        title="Admin Control Center"
        subtitle="1-Tap Student Approvals & Facility Registry"
        navigation={navigation}
      />

      {/* Top Navigation Tab Selector */}
      <View style={styles.topTabBar}>
        <TouchableOpacity
          style={[styles.topTabBtn, adminTab === 'pending' && styles.topTabBtnActive]}
          onPress={() => setAdminTab('pending')}
          activeOpacity={0.8}
        >
          <Clock size={15} color={adminTab === 'pending' ? colors.primary : colors.textSecondary} />
          <Text style={[styles.topTabText, adminTab === 'pending' && styles.topTabTextActive]}>
            Pending Approvals {pendingBookings.length > 0 && `(${pendingBookings.length})`}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.topTabBtn, adminTab === 'live' && styles.topTabBtnActive]}
          onPress={() => setAdminTab('live')}
          activeOpacity={0.8}
        >
          <ShieldCheck size={15} color={adminTab === 'live' ? colors.primary : colors.textSecondary} />
          <Text style={[styles.topTabText, adminTab === 'live' && styles.topTabTextActive]}>
            Live Active ({liveApprovedBookings.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.topTabBtn, adminTab === 'class_details' && styles.topTabBtnActive]}
          onPress={() => setAdminTab('class_details')}
          activeOpacity={0.8}
        >
          <BookOpen size={15} color={adminTab === 'class_details' ? colors.primary : colors.textSecondary} />
          <Text style={[styles.topTabText, adminTab === 'class_details' && styles.topTabTextActive]}>
            Booked Classes ({bookings.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Virtualized Fast FlatList */}
      <FlatList
        data={adminTab === 'pending' ? pendingBookings : adminTab === 'live' ? liveApprovedBookings : displayedClassDetails}
        renderItem={adminTab === 'pending' ? renderPendingItem : adminTab === 'live' ? renderLiveItem : renderClassDetailItem}
        keyExtractor={(item) => String(item._id || item.id || Math.random())}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={renderEmptyState}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={Platform.OS !== 'web'}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        style={styles.container}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background
  },
  topTabBar: {
    flexDirection: 'row',
    backgroundColor: colors.cardBg,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
    gap: 6
  },
  topTabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 10,
    gap: 6,
    backgroundColor: colors.cardBgLight,
    borderWidth: 1,
    borderColor: 'transparent'
  },
  topTabBtnActive: {
    backgroundColor: colors.cardBg,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3
  },
  topTabText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary
  },
  topTabTextActive: {
    color: colors.primary,
    fontWeight: '800'
  },
  container: {
    flex: 1
  },
  content: {
    padding: 16,
    paddingBottom: 40
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    marginBottom: 12,
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder
  },
  bannerIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
    fontFamily: 'Sora'
  },
  bannerDesc: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2
  },
  refreshBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.cardBgLight,
    borderWidth: 1,
    borderColor: colors.cardBorder
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12
  },
  metricCard: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12
  },
  metricNumber: {
    fontSize: 18,
    fontWeight: '900',
    fontFamily: 'Sora'
  },
  metricLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 2
  },
  listHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  heading: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
    fontFamily: 'Sora'
  },
  autoCleanBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted
  },
  pendingCard: {
    padding: 14,
    backgroundColor: colors.cardBg,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(245, 158, 11, 0.45)',
    marginBottom: 10
  },
  bookingCard: {
    padding: 14,
    backgroundColor: colors.cardBg,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 10
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2
  },
  seatPillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(234, 162, 40, 0.15)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(234, 162, 40, 0.3)'
  },
  seatPillText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: colors.primary
  },
  seatPillBadgeGreen: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)'
  },
  seatPillTextGreen: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#10B981'
  },
  pendingRoomName: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
    fontFamily: 'Sora'
  },
  roomName: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
    fontFamily: 'Sora'
  },
  purposeText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2
  },
  needsApprovalTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)'
  },
  needsApprovalText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#F59E0B'
  },
  metaBox: {
    backgroundColor: colors.cardBgLight,
    borderRadius: 8,
    padding: 8,
    gap: 4,
    marginVertical: 8
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  metaText: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600'
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4
  },
  approveBtn: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6
  },
  approveText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#070B14'
  },
  rejectBtn: {
    flex: 1,
    backgroundColor: colors.cardBgLight,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 8,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6
  },
  rejectText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.danger
  },
  approvedStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%'
  },
  approvedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.12)'
  },
  approvedPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#10B981'
  },
  navRoomBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.cardBgLight,
    borderWidth: 1,
    borderColor: colors.cardBorder
  },
  navRoomText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary
  },

  // Class Details Styles
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
    gap: 8
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: colors.text,
    padding: 0
  },
  classDetailCard: {
    padding: 14,
    backgroundColor: colors.cardBg,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 10
  },
  classCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10
  },
  classTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2
  },
  classRoomName: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
    fontFamily: 'Sora'
  },
  roomCodeBadge: {
    backgroundColor: colors.cardBgLight,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4
  },
  roomCodeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary
  },
  classTopicText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600'
  },
  classDetailGrid: {
    backgroundColor: colors.cardBgLight,
    borderRadius: 10,
    padding: 10,
    gap: 8,
    marginBottom: 10
  },
  classDetailCol: {
    gap: 2
  },
  detailLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.5
  },
  detailValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  detailValueText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text
  },
  subDetailText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginLeft: 19
  },
  classCardFooter: {
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
    paddingTop: 8
  },
  approvedClassStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  qrPassIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },
  qrPassText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#10B981'
  },
  emptyState: {
    alignItems: 'center',
    padding: 24,
    marginTop: 10
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
    fontFamily: 'Sora',
    marginBottom: 4
  },
  emptySubtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center'
  }
});
