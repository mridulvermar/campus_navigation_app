import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { ShieldCheck, CheckCircle, XCircle, Users, Layers, Activity } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { HeaderBar } from '../components/common/HeaderBar';
import { GlassCard } from '../components/common/GlassCard';
import { Badge } from '../components/common/Badge';
import { apiService } from '../services/api';

export const AdminScreen = ({ navigation }) => {
  const [pendingBookings, setPendingBookings] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiService.getBookings();
        if (res?.data) {
          setPendingBookings(res.data);
        }
      } catch (e) {}
    };
    load();
  }, []);

  const handleApprove = async (id) => {
    await apiService.updateBookingStatus(id, 'Approved');
    setPendingBookings((prev) =>
      prev.map((b) => (b._id === id ? { ...b, status: 'Approved' } : b))
    );
    Alert.alert('Success', 'Booking approved and digital pass activated.');
  };

  const handleReject = async (id) => {
    await apiService.updateBookingStatus(id, 'Rejected');
    setPendingBookings((prev) =>
      prev.map((b) => (b._id === id ? { ...b, status: 'Rejected' } : b))
    );
    Alert.alert('Notice', 'Booking rejected.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderBar
        title="Admin Control Center"
        subtitle="Facility Approval Desk & Campus Operations"
        navigation={navigation}
      />

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <GlassCard style={styles.banner} glow>
          <ShieldCheck size={24} color={colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>Administrator Privileges Active</Text>
            <Text style={styles.bannerDesc}>Review and moderate real-time classroom reservations.</Text>
          </View>
        </GlassCard>

        <Text style={styles.heading}>Pending Facility Reservations</Text>

        <View style={styles.list}>
          {pendingBookings.map((b) => (
            <GlassCard key={b._id} style={styles.bookingCard}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.roomName}>{b.room?.name || 'Classroom / Lab'}</Text>
                  <Text style={styles.userEmail}>{b.user?.email || 'student@campus.edu'}</Text>
                </View>
                <Badge variant={b.status === 'Approved' ? 'success' : b.status === 'Rejected' ? 'danger' : 'warning'} size="sm">
                  {b.status || 'Pending'}
                </Badge>
              </View>

              <Text style={styles.purpose}>{b.purpose}</Text>
              <Text style={styles.timeText}>🕒 {b.startTime} - {b.endTime} ({b.date || 'Today'})</Text>

              {b.status !== 'Approved' && b.status !== 'Rejected' && (
                <View style={styles.actionsRow}>
                  <TouchableOpacity
                    style={styles.approveBtn}
                    onPress={() => handleApprove(b._id)}
                  >
                    <CheckCircle size={14} color="#070B14" />
                    <Text style={styles.approveText}>Approve</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.rejectBtn}
                    onPress={() => handleReject(b._id)}
                  >
                    <XCircle size={14} color={colors.danger} />
                    <Text style={styles.rejectText}>Reject</Text>
                  </TouchableOpacity>
                </View>
              )}
            </GlassCard>
          ))}
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
    padding: 16,
    marginBottom: 16
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text
  },
  bannerDesc: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2
  },
  heading: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 12
  },
  list: {
    gap: 10
  },
  bookingCard: {
    padding: 14
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6
  },
  roomName: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text
  },
  userEmail: {
    fontSize: 11,
    color: colors.primary,
    marginTop: 1
  },
  purpose: {
    fontSize: 12,
    color: colors.textSecondary,
    marginVertical: 4
  },
  timeText: {
    fontSize: 11,
    color: colors.textMuted
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(51, 65, 85, 0.4)',
    paddingTop: 10
  },
  approveBtn: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 8,
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
    borderColor: 'rgba(239, 68, 68, 0.4)',
    borderRadius: 8,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6
  },
  rejectText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.danger
  }
});
