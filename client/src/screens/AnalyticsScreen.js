import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { Activity, Users, TrendingUp, Clock, Zap, MapPin } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { HeaderBar } from '../components/common/HeaderBar';
import { GlassCard } from '../components/common/GlassCard';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';

const HOURLY_DATA = [
  { hour: '08:00', val: 30 },
  { hour: '10:00', val: 85 },
  { hour: '12:00', val: 95 },
  { hour: '14:00', val: 78 },
  { hour: '16:00', val: 60 },
  { hour: '18:00', val: 40 }
];

const ZONE_OCCUPANCY = [
  { zone: 'IB Block Classrooms', pct: 92, status: 'Peak' },
  { zone: 'Central Library', pct: 78, status: 'Moderate' },
  { zone: 'Tech Computing Labs', pct: 88, status: 'High' },
  { zone: 'Mechanical Workshops', pct: 45, status: 'Normal' },
  { zone: 'Student Dining Commons', pct: 65, status: 'Moderate' }
];

export const AnalyticsScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderBar
        title="Spatial Analytics & AI Telemetry"
        subtitle="Live Footfall, Heatmaps & Facility Utilization"
        navigation={navigation}
      />

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* KPI Metric Cards */}
        <View style={styles.kpiRow}>
          <StatCard
            title="Total Campus Footfall"
            value="3,420"
            icon={TrendingUp}
            trend="+18% vs Yesterday"
            color={colors.primary}
          />
          <StatCard
            title="Avg Dwell Time"
            value="48 min"
            icon={Clock}
            trend="Active Period"
            color={colors.secondary}
          />
        </View>

        {/* Peak Hours Occupancy Chart */}
        <GlassCard style={styles.chartCard} glow>
          <View style={styles.chartHeader}>
            <View>
              <Text style={styles.chartTitle}>Hourly Footfall Trajectory</Text>
              <Text style={styles.chartSubtitle}>Real-time IoT density across campus zones</Text>
            </View>
            <Badge variant="success" size="sm">Live Feed</Badge>
          </View>

          <View style={styles.barChartContainer}>
            {HOURLY_DATA.map((item) => (
              <View key={item.hour} style={styles.barCol}>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barFill,
                      { height: `${item.val}%`, backgroundColor: item.val > 80 ? colors.primary : colors.secondary }
                    ]}
                  />
                </View>
                <Text style={styles.hourLabel}>{item.hour}</Text>
                <Text style={styles.valLabel}>{item.val}%</Text>
              </View>
            ))}
          </View>
        </GlassCard>

        {/* Zone Utilization Density */}
        <GlassCard style={styles.zonesCard}>
          <Text style={styles.sectionHeading}>Campus Facility Congestion</Text>
          <View style={styles.zonesList}>
            {ZONE_OCCUPANCY.map((z) => (
              <View key={z.zone} style={styles.zoneItem}>
                <View style={styles.zoneTop}>
                  <Text style={styles.zoneName}>{z.zone}</Text>
                  <Text style={styles.zonePct}>{z.pct}%</Text>
                </View>
                <View style={styles.zoneProgressBar}>
                  <View
                    style={[
                      styles.zoneProgressFill,
                      {
                        width: `${z.pct}%`,
                        backgroundColor: z.pct > 85 ? colors.danger : z.pct > 70 ? colors.warning : colors.accent
                      }
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        </GlassCard>
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
  kpiRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12
  },
  chartCard: {
    padding: 16,
    marginBottom: 12
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16
  },
  chartTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text
  },
  chartSubtitle: {
    fontSize: 11,
    color: colors.textSecondary
  },
  barChartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140,
    paddingTop: 10
  },
  barCol: {
    alignItems: 'center',
    flex: 1
  },
  barTrack: {
    width: 18,
    height: 100,
    backgroundColor: 'rgba(51, 65, 85, 0.4)',
    borderRadius: 8,
    justifyContent: 'flex-end',
    overflow: 'hidden'
  },
  barFill: {
    width: '100%',
    borderRadius: 8
  },
  hourLabel: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 6
  },
  valLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 2
  },
  zonesCard: {
    padding: 16
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 12
  },
  zonesList: {
    gap: 12
  },
  zoneItem: {
    gap: 4
  },
  zoneTop: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  zoneName: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text
  },
  zonePct: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary
  },
  zoneProgressBar: {
    height: 6,
    backgroundColor: 'rgba(51, 65, 85, 0.4)',
    borderRadius: 3,
    overflow: 'hidden'
  },
  zoneProgressFill: {
    height: '100%',
    borderRadius: 3
  }
});
