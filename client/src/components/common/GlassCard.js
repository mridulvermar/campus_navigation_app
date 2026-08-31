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
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 16,
    overflow: 'hidden',
    ...Platform.select({
      web: {
        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.35)'
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 4
      }
    })
  },
  cardGlow: {
    borderColor: colors.cardBorderGlow,
    ...Platform.select({
      web: {
        boxShadow: '0 0 16px rgba(6, 182, 212, 0.35)'
      },
      default: {
        shadowColor: colors.primary,
        shadowOpacity: 0.4,
        shadowRadius: 14,
        elevation: 6
      }
    })
  }
});
