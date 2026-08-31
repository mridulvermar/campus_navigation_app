import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CloudSun, Wind, Droplets } from 'lucide-react-native';
import { GlassCard } from './GlassCard';
import { colors } from '../../theme/colors';

export const WeatherWidget = () => {
  return (
    <GlassCard style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.left}>
          <Text style={styles.campusLoc}>BIT SATHYAMANGALAM</Text>
          <Text style={styles.temp}>29°C</Text>
          <Text style={styles.condition}>Partly Sunny • Good Visibility</Text>
        </View>
        <View style={styles.iconContainer}>
          <CloudSun size={36} color={colors.warning} />
        </View>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.metricsRow}>
        <View style={styles.metric}>
          <Wind size={14} color={colors.primary} />
          <Text style={styles.metricVal}>12 km/h WNW</Text>
        </View>
        <View style={styles.metric}>
          <Droplets size={14} color={colors.accent} />
          <Text style={styles.metricVal}>64% Humidity</Text>
        </View>
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 6
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  left: {
    flex: 1
  },
  campusLoc: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 1.2
  },
  temp: {
    fontSize: 26,
    fontWeight: '900',
    color: colors.text,
    marginVertical: 2
  },
  condition: {
    fontSize: 12,
    color: colors.textSecondary
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)'
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(51, 65, 85, 0.5)',
    marginVertical: 10
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  metric: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  metricVal: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600'
  }
});
