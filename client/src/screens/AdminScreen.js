import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, Alert, Platform } from 'react-native';
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
  AlertCircle
} from 'lucide-react-native';
import { colors } from '../theme/colors';
import { HeaderBar } from '../components/common/HeaderBar';
import { GlassCard } from '../components/common/GlassCard';
import { Badge } from '../components/common/Badge';
import { apiService } from '../services/api';
import { MOCK_BOOKINGS } from '../data/mockData';

export const AdminScreen = ({ navigation }) => {
  const [bookings, setBookings] = useState(MOCK_BOOKINGS);
  const [filterScope, setFilterScope] = useState('today'); // 'today' (1-day active window), 'pending', 'approved', 'in_session'
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await apiService.getBookings();
      if (res?.data) {
        setBookings(res.data);
      }
    } catch (e) {
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Today's date string in YYYY-MM-DD
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Filter out older past-day history (Keep 1-Day active window / today's active schedule)
  const todayBookings = useMemo(() => {
    return bookings.filter((b) => {
      // 1-day active scope: booking date is today, or marked 'Today', or created within the past 24 hours
      if (!b.date || b.date === todayStr || b.date === 'Today') return true;
      if (b.date >= todayStr) return true; // upcoming future
      // If created recently (within 24h)
      if (b.createdAt) {
        const diff = Date.now() - new Date(b.createdAt).getTime();
        return diff <= 24 * 60 * 60 * 1000;
      }
      return false;
    });
  }, [bookings, todayStr]);

  // Determine current active metrics
  const { inSessionCount, pendingCount, approvedCount, totalTodayCount } = useMemo(() => {
    let inSession = 0;
    let pending = 0;
    let approved = 0;

    todayBookings.forEach((b) => {
      if (b.status === 'Pending') pending++;
      if (b.status === 'Approved') approved++;
      if (b.status === 'Approved' && (!b.date || b.date === todayStr || b.date === 'Today')) {
        inSession++;
      }
    });

    return {
      inSessionCount: inSession,
      pendingCount: pending,
      approvedCount: approved,
      totalTodayCount: todayBookings.length
    };
  }, [todayBookings, todayStr]);

  // Filtered list based on active tab
  const displayedBookings = useMemo(() => {
    switch (filterScope) {
      case 'pending':
        return todayBookings.filter((b) => b.status === 'Pending');
      case 'approved':
        return todayBookings.filter((b) => b.status === 'Approved');
      case 'in_session':
        return todayBookings.filter((b) => b.status === 'Approved');
      case 'today':
      default:
        return todayBookings;
    }
  }, [todayBookings, filterScope]);

  const handleApprove = async (id) => {
    await apiService.updateBookingStatus(id, 'Approved', 'Approved by Campus Administrator');
    setBookings((prev) =>
      prev.map((b) => (b._id === id ? { ...b, status: 'Approved' } : b))
    );
    Alert.alert('Booking Approved', 'The student/faculty digital pass is now active for room check-in.');
  };

  const handleReject = async (id) => {
    await apiService.updateBookingStatus(id, 'Rejected', 'Rejected by Campus Administrator');
    setBookings((prev) =>
      prev.map((b) => (b._id === id ? { ...b, status: 'Rejected' } : b))
    );
    Alert.alert('Booking Rejected', 'Reservation cancelled.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderBar
        title="Admin Control Center"
        subtitle="Live Facility Tracking & 1-Day Active Schedule"
        navigation={navigation}
      />

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Administrator Status Header */}
        <GlassCard style={styles.banner} glow>
          <View style={styles.bannerIconBox}>
            <ShieldCheck size={22} color="#070B14" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>Active Administrator Tracking</Text>
            <Text style={styles.bannerDesc}>
              Real-time monitoring of classroom & event reservations. 1-day active window prevents clutter.
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.refreshBtn} 
            onPress={loadData}
            activeOpacity={0.8}
            title="Refresh Live Data"
          >
            <RefreshCw size={16} color={colors.primary} />
          </TouchableOpacity>
        </GlassCard>

        {/* 4 Real-time Summary Metric Cards */}
        <View style={styles.metricsGrid}>
          <GlassCard style={styles.metricCard}>
            <Text style={[styles.metricNumber, { color: colors.primary }]}>{totalTodayCount}</Text>
            <Text style={styles.metricLabel}>Today's Bookings</Text>
          </GlassCard>

          <GlassCard style={styles.metricCard}>
            <Text style={[styles.metricNumber, { color: '#F59E0B' }]}>{pendingCount}</Text>
            <Text style={styles.metricLabel}>Pending Approval</Text>
          </GlassCard>

          <GlassCard style={styles.metricCard}>
            <Text style={[styles.metricNumber, { color: '#10B981' }]}>{approvedCount}</Text>
            <Text style={styles.metricLabel}>Approved Today</Text>
          </GlassCard>

          <GlassCard style={styles.metricCard}>
            <Text style={[styles.metricNumber, { color: '#EF4444' }]}>{inSessionCount}</Text>
            <Text style={styles.metricLabel}>In-Use / Occupied</Text>
          </GlassCard>
        </View>

        {/* Filter Tabs: 1-Day Active Window vs Specific Statuses */}
        <View style={styles.filterTabs}>
          <TouchableOpacity
            style={[styles.filterTabBtn, filterScope === 'today' && styles.filterTabBtnActive]}
            onPress={() => setFilterScope('today')}
            activeOpacity={0.8}
          >
            <Text style={[styles.filterTabText, filterScope === 'today' && styles.filterTabTextActive]}>
              Today's Schedule ({totalTodayCount})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterTabBtn, filterScope === 'pending' && styles.filterTabBtnActive]}
            onPress={() => setFilterScope('pending')}
            activeOpacity={0.8}
          >
            <Text style={[styles.filterTabText, filterScope === 'pending' && styles.filterTabTextActive]}>
              Pending ({pendingCount})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterTabBtn, filterScope === 'approved' && styles.filterTabBtnActive]}
            onPress={() => setFilterScope('approved')}
            activeOpacity={0.8}
          >
            <Text style={[styles.filterTabText, filterScope === 'approved' && styles.filterTabTextActive]}>
              Approved ({approvedCount})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Heading & Live Status Notice */}
        <View style={styles.listHeaderRow}>
          <Text style={styles.heading}>
            {filterScope === 'pending' ? 'Pending Reservations' : "Live Present Bookings (Today's Window)"}
          </Text>
          <Text style={styles.autoCleanBadge}>⚡ 1-Day History Clean</Text>
        </View>

        {/* Bookings List */}
        <View style={styles.list}>
          {displayedBookings.length > 0 ? (
            displayedBookings.map((b) => {
              const roomName = b.room?.name || b.room?.roomNumber || b.asset?.assetName || 'Classroom / Hall';
              const userName = b.user?.name || 'Student / Faculty';
              const userEmail = b.user?.email || 'user@campus.edu';
              const userDept = b.user?.department || 'Academic Department';
              const isApproved = b.status === 'Approved';
              const isPending = b.status === 'Pending';
              const isRejected = b.status === 'Rejected';

              return (
                <GlassCard key={b._id} style={styles.bookingCard} glow={isPending}>
                  {/* Card Top: Room & Live Badge */}
                  <View style={styles.cardHeader}>
                    <View style={{ flex: 1, marginRight: 8 }}>
                      <Text style={styles.roomName} numberOfLines={1}>{roomName}</Text>
                      <Text style={styles.purposeText} numberOfLines={2}>{b.purpose || 'Academic Session'}</Text>
                    </View>
                    <Badge 
                      variant={isApproved ? 'success' : isRejected ? 'danger' : 'warning'} 
                      size="sm"
                    >
                      {isApproved ? 'Active Today' : isPending ? 'Needs Review' : (b.status || 'Active')}
                    </Badge>
                  </View>

                  {/* Booking Time & Schedule Metadata */}
                  <View style={styles.metaBox}>
                    <View style={styles.metaItem}>
                      <Clock size={13} color={colors.primary} />
                      <Text style={styles.metaText}>
                        {b.date || 'Today'} • {b.startTime} - {b.endTime} ({b.durationHours || 2} hrs)
                      </Text>
                    </View>

                    <View style={styles.metaItem}>
                      <User size={13} color={colors.textSecondary} />
                      <Text style={styles.metaText} numberOfLines={1}>
                        {userName} ({userEmail}) • {userDept}
                      </Text>
                    </View>
                  </View>

                  {/* Actions Row */}
                  <View style={styles.actionsRow}>
                    {isPending ? (
                      <>
                        <TouchableOpacity
                          style={styles.approveBtn}
                          onPress={() => handleApprove(b._id)}
                          activeOpacity={0.8}
                        >
                          <CheckCircle size={14} color="#070B14" />
                          <Text style={styles.approveText}>Approve Pass</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.rejectBtn}
                          onPress={() => handleReject(b._id)}
                          activeOpacity={0.8}
                        >
                          <XCircle size={14} color={colors.danger} />
                          <Text style={styles.rejectText}>Reject</Text>
                        </TouchableOpacity>
                      </>
                    ) : (
                      <View style={styles.approvedStatusRow}>
                        <View style={styles.approvedPill}>
                          <CheckCircle size={12} color="#10B981" />
                          <Text style={styles.approvedPillText}>
                            {b.checkedIn ? 'Checked In via QR Pass' : 'Digital QR Pass Active'}
                          </Text>
                        </View>

                        <TouchableOpacity
                          style={styles.navRoomBtn}
                          onPress={() => navigation.navigate('Navigation', { destCode: b.room?.roomNumber || b.room?.name })}
                          activeOpacity={0.8}
                        >
                          <MapPin size={13} color={colors.primary} />
                          <Text style={styles.navRoomText}>Locate</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </GlassCard>
              );
            })
          ) : (
            <GlassCard style={styles.emptyState}>
              <CalendarCheck size={32} color={colors.textMuted} style={{ marginBottom: 8 }} />
              <Text style={styles.emptyTitle}>No Bookings Found in Today's Window</Text>
              <Text style={styles.emptySubtitle}>
                No classroom or event reservations match the selected filter.
              </Text>
            </GlassCard>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background
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
    marginBottom: 14,
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
    marginBottom: 14
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
  filterTabs: {
    flexDirection: 'row',
    backgroundColor: colors.cardBgLight,
    borderRadius: 10,
    padding: 3,
    gap: 4,
    marginBottom: 14
  },
  filterTabBtn: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8
  },
  filterTabBtnActive: {
    backgroundColor: colors.cardBg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2
  },
  filterTabText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary
  },
  filterTabTextActive: {
    color: colors.text,
    fontWeight: '800'
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
  list: {
    gap: 10
  },
  bookingCard: {
    padding: 14,
    backgroundColor: colors.cardBg,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6
  },
  roomName: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
    fontFamily: 'Sora'
  },
  purposeText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2
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
    paddingVertical: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6
  },
  approveText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#24201D'
  },
  rejectBtn: {
    flex: 1,
    backgroundColor: colors.cardBgLight,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 8,
    paddingVertical: 9,
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
