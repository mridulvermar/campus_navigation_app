import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { Settings as SettingsIcon, Bell, Moon, MapPin, Shield, Zap, RefreshCw } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { HeaderBar } from '../components/common/HeaderBar';
import { GlassCard } from '../components/common/GlassCard';

export const SettingsScreen = ({ navigation }) => {
  const [pushNotifs, setPushNotifs] = useState(true);
  const [highPrecisionGps, setHighPrecisionGps] = useState(true);
  const [avoidCrowds, setAvoidCrowds] = useState(false);
  const [satelliteTiles, setSatelliteTiles] = useState(true);

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderBar
        title="Settings & System Preferences"
        subtitle="GIS Calibrations, Alerts & Display Engine"
        navigation={navigation}
      />

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Navigation & GIS Preferences */}
        <GlassCard style={styles.sectionCard} glow>
          <Text style={styles.sectionTitle}>GIS & Routing Engine</Text>

          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingLabel}>High-Precision Spatial GPS</Text>
              <Text style={styles.settingDesc}>Use sub-meter triangulation on campus pathways</Text>
            </View>
            <Switch
              value={highPrecisionGps}
              onValueChange={setHighPrecisionGps}
              trackColor={{ false: colors.cardBorder, true: colors.primary }}
              thumbColor={highPrecisionGps ? '#070B14' : colors.textSecondary}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingLabel}>Default Google Hybrid Satellite</Text>
              <Text style={styles.settingDesc}>Load satellite tile layers as primary view mode</Text>
            </View>
            <Switch
              value={satelliteTiles}
              onValueChange={setSatelliteTiles}
              trackColor={{ false: colors.cardBorder, true: colors.primary }}
              thumbColor={satelliteTiles ? '#070B14' : colors.textSecondary}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingLabel}>Dynamic Crowd-Aware Routing</Text>
              <Text style={styles.settingDesc}>Automatically re-route around congested zones</Text>
            </View>
            <Switch
              value={avoidCrowds}
              onValueChange={setAvoidCrowds}
              trackColor={{ false: colors.cardBorder, true: colors.primary }}
              thumbColor={avoidCrowds ? '#070B14' : colors.textSecondary}
            />
          </View>
        </GlassCard>

        {/* Notifications & System */}
        <GlassCard style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Alerts & Notifications</Text>

          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingLabel}>Facility & Booking Alerts</Text>
              <Text style={styles.settingDesc}>Get reminders 15 mins before reservation slot</Text>
            </View>
            <Switch
              value={pushNotifs}
              onValueChange={setPushNotifs}
              trackColor={{ false: colors.cardBorder, true: colors.primary }}
              thumbColor={pushNotifs ? '#070B14' : colors.textSecondary}
            />
          </View>
        </GlassCard>

        {/* Cache Flush */}
        <TouchableOpacity
          style={styles.flushBtn}
          onPress={() => Alert.alert('Cache Cleared', 'Offline map tile cache and local graph indexes reloaded.')}
        >
          <RefreshCw size={16} color={colors.primary} />
          <Text style={styles.flushBtnText}>Reload Offline Graph Cache</Text>
        </TouchableOpacity>
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
  sectionCard: {
    padding: 18,
    marginBottom: 14,
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 12,
    fontFamily: 'Sora'
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder
  },
  settingLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text
  },
  settingDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2
  },
  flushBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 14,
    padding: 14,
    marginTop: 8
  },
  flushBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.text
  }
});
