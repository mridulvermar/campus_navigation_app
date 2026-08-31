import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const Badge = ({ children, variant = 'primary', size = 'md' }) => {
  const getBadgeColors = () => {
    switch (variant) {
      case 'success':
      case 'emerald':
        return { bg: 'rgba(16, 185, 129, 0.15)', text: colors.accent, border: 'rgba(16, 185, 129, 0.4)' };
      case 'warning':
      case 'amber':
        return { bg: 'rgba(245, 158, 11, 0.15)', text: colors.warning, border: 'rgba(245, 158, 11, 0.4)' };
      case 'danger':
      case 'red':
        return { bg: 'rgba(239, 68, 68, 0.15)', text: colors.danger, border: 'rgba(239, 68, 68, 0.4)' };
      case 'secondary':
      case 'indigo':
        return { bg: 'rgba(99, 102, 241, 0.15)', text: colors.secondary, border: 'rgba(99, 102, 241, 0.4)' };
      case 'purple':
        return { bg: 'rgba(168, 85, 247, 0.15)', text: colors.purple, border: 'rgba(168, 85, 247, 0.4)' };
      case 'primary':
      default:
        return { bg: 'rgba(6, 182, 212, 0.15)', text: colors.primary, border: 'rgba(6, 182, 212, 0.4)' };
    }
  };

  const c = getBadgeColors();
  const isSmall = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: c.bg, borderColor: c.border },
        isSmall && styles.badgeSm
      ]}
    >
      <Text style={[styles.text, { color: c.text }, isSmall && styles.textSm]}>
        {children}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    borderWidth: 1,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center'
  },
  badgeSm: {
    paddingHorizontal: 6,
    paddingVertical: 2
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3
  },
  textSm: {
    fontSize: 10
  }
});
