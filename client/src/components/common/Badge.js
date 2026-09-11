import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const Badge = ({ children, variant = 'secondary', size = 'md' }) => {
  const getBadgeColors = () => {
    switch (variant) {
      case 'success':
      case 'emerald':
        return { bg: 'rgba(16, 185, 129, 0.12)', text: '#059669', border: 'rgba(16, 185, 129, 0.25)' };
      case 'warning':
      case 'primary':
      case 'amber':
        return { bg: 'rgba(234, 162, 40, 0.15)', text: colors.primaryDark, border: 'rgba(234, 162, 40, 0.3)' };
      case 'danger':
      case 'red':
        return { bg: 'rgba(239, 68, 68, 0.12)', text: colors.danger, border: 'rgba(239, 68, 68, 0.25)' };
      case 'secondary':
      default:
        return { bg: colors.secondary, text: colors.textSecondary, border: colors.cardBorder };
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
    paddingHorizontal: 8,
    paddingVertical: 2
  },
  text: {
    fontSize: 12,
    fontWeight: '700'
  },
  textSm: {
    fontSize: 10
  }
});
