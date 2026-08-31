import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Bell, ShieldAlert, CheckCircle, Info, CalendarCheck } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { HeaderBar } from '../components/common/HeaderBar';
import { GlassCard } from '../components/common/GlassCard';
import { Badge } from '../components/common/Badge';
import { apiService } from '../services/api';
import { MOCK_NOTIFICATIONS } from '../data/mockData';

export const NotificationsScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  useEffect(() => {
    const loadNotifs = async () => {
      try {
        const res = await apiService.getNotifications();
        if (res?.data) setNotifications(res.data);
      } catch (e) {}
    };
    loadNotifs();
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'Emergency':
        return <ShieldAlert size={18} color={colors.danger} />;
      case 'Booking':
        return <CalendarCheck size={18} color={colors.accent} />;
      default:
        return <Info size={18} color={colors.primary} />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderBar
        title="Live Notifications & Alerts"
        subtitle="Real-time Broadcasts & Facility Updates"
        navigation={navigation}
      />

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.list}>
          {notifications.map((n) => (
            <GlassCard key={n._id} style={styles.notifCard} glow={n.type === 'Emergency'}>
              <View style={styles.topRow}>
                <View style={styles.iconAndTitle}>
                  <View style={styles.iconBox}>{getIcon(n.type)}</View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.title}>{n.title}</Text>
                    <Text style={styles.time}>{n.time || '10 minutes ago'}</Text>
                  </View>
                </View>
                <Badge variant={n.type === 'Emergency' ? 'danger' : 'primary'} size="sm">
                  {n.type || 'Notice'}
                </Badge>
              </View>
              <Text style={styles.message}>{n.message}</Text>
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
  list: {
    gap: 10
  },
  notifCard: {
    padding: 14
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8
  },
  iconAndTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    marginRight: 8
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.cardBgLight,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.text
  },
  time: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2
  },
  message: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18
  }
});
