import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GlassCard } from './GlassCard';
import { colors } from '../../theme/colors';

export const StatCard = ({ title, value, subtitle, icon: Icon, trend, color = colors.primary }) => {
  return (
    <GlassCard style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.title}>{title}</Text>
        {Icon && (
          <View style={[styles.iconBox, { backgroundColor: `${color}20`, borderColor: `${color}40` }]}>
            <Icon size={18} color={color} />
          </View>
        )}
      </View>
      <Text style={styles.value}>{value}</Text>
      <View style={styles.bottomRow}>
        {trend && (
          <Text style={[styles.trend, { color: trend.startsWith('+') ? colors.accent : colors.warning }]}>
            {trend}
          </Text>
        )}
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 140,
    marginVertical: 4
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  value: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: -0.5,
    marginBottom: 4
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  trend: {
    fontSize: 11,
    fontWeight: '700'
  },
  subtitle: {
    fontSize: 11,
    color: colors.textMuted
  }
});
