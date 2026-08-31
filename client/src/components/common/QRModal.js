import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { X, CheckCircle, QrCode } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { GlassCard } from './GlassCard';
import { Badge } from './Badge';

export const QRModal = ({ visible, onClose, booking }) => {
  if (!booking) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <GlassCard style={styles.modalCard} glow>
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <QrCode size={20} color={colors.primary} />
              <Text style={styles.modalTitle}>Digital Access Pass</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.qrContainer}>
            {/* Visual QR Code Display Container */}
            <View style={styles.qrBox}>
              <View style={styles.qrSimulated}>
                <QrCode size={140} color="#0B0F19" />
              </View>
            </View>
            <Text style={styles.qrCodeText}>{booking.qrCodeData || `PASS-${booking._id || Date.now()}`}</Text>
          </View>

          <View style={styles.details}>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Room / Facility:</Text>
              <Text style={styles.value}>{booking.room?.roomNumber || booking.room?.name || 'Classroom / Lab'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Time Slot:</Text>
              <Text style={styles.value}>{booking.startTime || '09:00 AM'} - {booking.endTime || '11:00 AM'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Status:</Text>
              <Badge variant="success" size="sm">Verified Pass</Badge>
            </View>
          </View>

          <TouchableOpacity style={styles.doneBtn} onPress={onClose}>
            <CheckCircle size={16} color={colors.black} />
            <Text style={styles.doneText}>Done</Text>
          </TouchableOpacity>
        </GlassCard>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#0F172A',
    borderColor: colors.cardBorderGlow
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text
  },
  closeBtn: {
    padding: 4
  },
  qrContainer: {
    alignItems: 'center',
    marginVertical: 12
  },
  qrBox: {
    padding: 16,
    backgroundColor: colors.white,
    borderRadius: 16,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 14px rgba(6, 182, 212, 0.35)'
      },
      default: {
        shadowColor: colors.primary,
        shadowOpacity: 0.3,
        shadowRadius: 10
      }
    })
  },
  qrSimulated: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  qrCodeText: {
    marginTop: 10,
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 1
  },
  details: {
    backgroundColor: colors.cardBgLight,
    borderRadius: 12,
    padding: 12,
    gap: 8,
    marginVertical: 12
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  label: {
    fontSize: 12,
    color: colors.textSecondary
  },
  value: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text
  },
  doneBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6
  },
  doneText: {
    color: '#070B14',
    fontWeight: '800',
    fontSize: 14
  }
});
