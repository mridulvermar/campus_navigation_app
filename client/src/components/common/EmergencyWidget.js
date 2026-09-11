import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Linking, Platform } from 'react-native';
import { ShieldAlert, PhoneCall, AlertTriangle } from 'lucide-react-native';
import { GlassCard } from './GlassCard';
import { colors } from '../../theme/colors';

export const EmergencyWidget = () => {
  const handleCall = (num, name) => {
    if (Platform.OS === 'web') {
      window.alert(`Initiating emergency speed-dial to ${name}: ${num}`);
    } else {
      Linking.openURL(`tel:${num}`).catch(() => {
        Alert.alert('Calling Failed', `Please dial ${num} manually`);
      });
    }
  };

  const handleSOS = () => {
    if (Platform.OS === 'web') {
      window.alert('🚨 EMERGENCY SOS BROADCAST: Campus Security & First Responders have been notified of your current spatial GPS coordinates!');
    } else {
      Alert.alert(
        '🚨 Emergency SOS Dispatched',
        'Campus Security Control Room & Medical Center have received your live location distress ping.'
      );
    }
  };

  return (
    <GlassCard style={styles.card} borderColor="rgba(239, 68, 68, 0.4)">
      <View style={styles.headerRow}>
        <View style={styles.iconCircle}>
          <ShieldAlert size={20} color={colors.danger} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.title}>Campus Safety & SOS</Text>
          <Text style={styles.subtitle}>Instant 24/7 Rapid Response</Text>
        </View>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={styles.sosButton}
          onPress={handleSOS}
          activeOpacity={0.8}
        >
          <AlertTriangle size={16} color={colors.white} />
          <Text style={styles.sosText}>TRIGGER SOS</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.callButton}
          onPress={() => handleCall('+914295226000', 'Security Desk')}
          activeOpacity={0.8}
        >
          <PhoneCall size={14} color={colors.primary} />
          <Text style={styles.callText}>Security Control</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.callButton}
          onPress={() => handleCall('+914295226111', 'Campus Medical Centre')}
          activeOpacity={0.8}
        >
          <PhoneCall size={14} color={colors.accent} />
          <Text style={[styles.callText, { color: colors.accent }]}>Medical Desk</Text>
        </TouchableOpacity>
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 6,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5'
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FCA5A5'
  },
  headerText: {
    flex: 1
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
    fontFamily: 'Sora'
  },
  subtitle: {
    fontSize: 11,
    color: colors.textSecondary,
    fontFamily: 'Manrope'
  },
  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  sosButton: {
    flex: 1,
    minWidth: 130,
    backgroundColor: colors.danger,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    shadowColor: colors.danger,
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3
  },
  sosText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 0.5
  },
  callButton: {
    flex: 1,
    minWidth: 120,
    backgroundColor: colors.cardBg,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingVertical: 10,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4
  },
  callText: {
    color: colors.text,
    fontSize: 11,
    fontWeight: '700'
  }
});
