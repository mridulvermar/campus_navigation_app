import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { 
  Navigation, 
  CalendarCheck, 
  Package, 
  Users, 
  Sparkles, 
  MapPin, 
  ArrowRight, 
  Activity, 
  Radio, 
  Search, 
  HelpCircle,
  Award
} from 'lucide-react-native';
import { colors } from '../theme/colors';
import { HeaderBar } from '../components/common/HeaderBar';
import { GlassCard } from '../components/common/GlassCard';
import { StatCard } from '../components/common/StatCard';
import { WeatherWidget } from '../components/common/WeatherWidget';
import { EmergencyWidget } from '../components/common/EmergencyWidget';
import { Badge } from '../components/common/Badge';
import { CampusMap } from '../components/map/CampusMap';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';

export const DashboardScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    activeRoutesCount: 14,
    totalBookings: 8,
    connectedNodes: 320,
    campusOccupancy: '74%'
  });
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const bookingsRes = await apiService.getMyBookings();
        if (bookingsRes?.data) {
          setRecentBookings(bookingsRes.data.slice(0, 3));
        }
      } catch (e) {}
    };
    loadData();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderBar
        title={`Hello, ${user?.name?.split(' ')[0] || 'Campus User'} 👋`}
        subtitle="BIT Spatial Command & Navigation Hub"
        navigation={navigation}
      />

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Quick Action Shortcuts Banner */}
        <View style={styles.shortcutsRow}>
          <TouchableOpacity
            style={[styles.shortcutBtn, { backgroundColor: 'rgba(6, 182, 212, 0.15)', borderColor: 'rgba(6, 182, 212, 0.3)' }]}
            onPress={() => navigation.navigate('Map')}
          >
            <Navigation size={18} color={colors.primary} />
            <Text style={[styles.shortcutText, { color: colors.primary }]}>Campus Map</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.shortcutBtn, { backgroundColor: 'rgba(99, 102, 241, 0.15)', borderColor: 'rgba(99, 102, 241, 0.3)' }]}
            onPress={() => navigation.navigate('Bookings')}
          >
            <CalendarCheck size={18} color={colors.secondary} />
            <Text style={[styles.shortcutText, { color: colors.secondary }]}>Book Rooms</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.shortcutBtn, { backgroundColor: 'rgba(16, 185, 129, 0.15)', borderColor: 'rgba(16, 185, 129, 0.3)' }]}
            onPress={() => navigation.navigate('Assets')}
          >
            <Package size={18} color={colors.accent} />
            <Text style={[styles.shortcutText, { color: colors.accent }]}>Asset Hub</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.shortcutBtn, { backgroundColor: 'rgba(245, 158, 11, 0.15)', borderColor: 'rgba(245, 158, 11, 0.3)' }]}
            onPress={() => navigation.navigate('Analytics')}
          >
            <Activity size={18} color={colors.warning} />
            <Text style={[styles.shortcutText, { color: colors.warning }]}>Analytics</Text>
          </TouchableOpacity>
        </View>

        {/* Live Weather & Emergency SOS Section */}
        <WeatherWidget />
        <EmergencyWidget />

        {/* Real-time KPI Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statsRow}>
            <StatCard
              title="Active Walkers"
              value={stats.activeRoutesCount.toString()}
              icon={Navigation}
              trend="+12%"
              subtitle="Live on road graph"
              color={colors.primary}
            />
            <StatCard
              title="Campus Occupancy"
              value={stats.campusOccupancy}
              icon={Users}
              trend="Optimal"
              subtitle="740 / 1000 Capacity"
              color={colors.accent}
            />
          </View>

          <View style={styles.statsRow}>
            <StatCard
              title="GIS Road Nodes"
              value={stats.connectedNodes.toString()}
              icon={MapPin}
              trend="100% Synced"
              subtitle="320 Road Junctions"
              color={colors.secondary}
            />
            <StatCard
              title="Facility Passes"
              value={stats.totalBookings.toString()}
              icon={CalendarCheck}
              trend="4 Active"
              subtitle="Approved Bookings"
              color={colors.purple}
            />
          </View>
        </View>

        {/* Live Interactive Map Preview */}
        <View style={styles.mapSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Radio size={16} color={colors.primary} />
              <Text style={styles.sectionTitle}>Satellite Campus View</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Map')}>
              <Text style={styles.viewAllText}>Full Screen ↗</Text>
            </TouchableOpacity>
          </View>

          <CampusMap navigation={navigation} />
        </View>

        {/* Recent Passes / Bookings List */}
        <View style={styles.recentBookingsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Facility Passes</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Bookings')}>
              <Text style={styles.viewAllText}>View All ↗</Text>
            </TouchableOpacity>
          </View>

          {recentBookings.length > 0 ? (
            recentBookings.map((b) => (
              <GlassCard key={b._id} style={styles.bookingItem}>
                <View style={styles.bookingHeader}>
                  <Text style={styles.roomName}>{b.room?.name || 'Classroom / Lab'}</Text>
                  <Badge variant={b.status === 'Approved' ? 'success' : 'warning'} size="sm">
                    {b.status || 'Active'}
                  </Badge>
                </View>
                <Text style={styles.purposeText}>{b.purpose || 'Academic Lecture / Project Work'}</Text>
                <Text style={styles.timeText}>🕒 {b.startTime || '09:00 AM'} - {b.endTime || '11:00 AM'}</Text>
              </GlassCard>
            ))
          ) : (
            <GlassCard style={styles.emptyBookings}>
              <Text style={styles.emptyText}>No upcoming bookings scheduled for today.</Text>
              <TouchableOpacity
                style={styles.bookNowBtn}
                onPress={() => navigation.navigate('Bookings')}
              >
                <Text style={styles.bookNowText}>Reserve a Classroom Now</Text>
              </TouchableOpacity>
            </GlassCard>
          )}
        </View>

        {/* Additional Utility Features Grid */}
        <View style={styles.moreGrid}>
          <TouchableOpacity
            style={styles.moreCard}
            onPress={() => navigation.navigate('LostFound')}
          >
            <GlassCard style={styles.innerMoreCard}>
              <Search size={20} color={colors.primary} />
              <Text style={styles.moreTitle}>Lost & Found</Text>
              <Text style={styles.moreDesc}>Report or search lost campus items</Text>
            </GlassCard>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.moreCard}
            onPress={() => navigation.navigate('Events')}
          >
            <GlassCard style={styles.innerMoreCard}>
              <Award size={20} color={colors.secondary} />
              <Text style={styles.moreTitle}>Campus Events</Text>
              <Text style={styles.moreDesc}>Conferences, hackathons, sports</Text>
            </GlassCard>
          </TouchableOpacity>
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
  shortcutsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12
  },
  shortcutBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4
  },
  shortcutText: {
    fontSize: 10,
    fontWeight: '800'
  },
  statsGrid: {
    marginVertical: 10,
    gap: 8
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8
  },
  mapSection: {
    marginVertical: 12
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary
  },
  recentBookingsSection: {
    marginVertical: 12
  },
  bookingItem: {
    marginBottom: 8
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4
  },
  roomName: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text
  },
  purposeText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4
  },
  timeText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '600'
  },
  emptyBookings: {
    alignItems: 'center',
    padding: 20
  },
  emptyText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 10
  },
  bookNowBtn: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10
  },
  bookNowText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.white
  },
  moreGrid: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8
  },
  moreCard: {
    flex: 1
  },
  innerMoreCard: {
    alignItems: 'center',
    padding: 14,
    gap: 6
  },
  moreTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.text
  },
  moreDesc: {
    fontSize: 10,
    color: colors.textMuted,
    textAlign: 'center'
  }
});
