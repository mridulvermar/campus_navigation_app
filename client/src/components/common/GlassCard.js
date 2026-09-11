import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { colors } from '../../theme/colors';

export const GlassCard = ({ children, style, glow = false, borderColor }) => {
  return (
    <View
      style={[
        styles.card,
        glow && styles.cardGlow,
        borderColor && { borderColor },
        style
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 16,
    overflow: 'hidden',
    ...Platform.select({
      web: {
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03)'
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2
      }
    })
  },
  cardGlow: {
    borderColor: colors.primary,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 18px rgba(234, 162, 40, 0.18)'
      },
      default: {
        shadowColor: colors.primary,
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 3
      }
    })
  }
});
