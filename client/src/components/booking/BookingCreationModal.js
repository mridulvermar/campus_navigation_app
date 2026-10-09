import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { X, CheckCircle } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { GlassCard } from '../common/GlassCard';

export const BookingCreationModal = ({
  visible,
  room,
  purpose,
  setPurpose,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  date,
  setDate,
  isSubmitting,
  onConfirm,
  onClose
}) => {
  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        {Platform.OS !== 'web' ? (
          <BlurView intensity={35} tint="dark" style={StyleSheet.absoluteFill} />
        ) : null}

        <GlassCard style={styles.modalContent} glow>
          <View style={styles.modalHeader}>
            <Text style={styles.modalHeading} numberOfLines={1}>
              Reserve {room?.name || 'Classroom'}
            </Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <X size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.modalBody}>
            <Text style={styles.fieldLabel}>Purpose / Event Title</Text>
            <TextInput
              style={styles.modalInput}
              value={purpose}
              onChangeText={setPurpose}
              placeholder="e.g. AI Hackathon Mentorship"
              placeholderTextColor={colors.textMuted}
            />

            <View style={styles.timeRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.fieldLabel}>Start Time</Text>
                <TextInput
                  style={styles.modalInput}
                  value={startTime}
                  onChangeText={setStartTime}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.fieldLabel}>End Time</Text>
                <TextInput
                  style={styles.modalInput}
                  value={endTime}
                  onChangeText={setEndTime}
                />
              </View>
            </View>

            <Text style={styles.fieldLabel}>Reservation Date</Text>
            <TextInput
              style={styles.modalInput}
              value={date}
              onChangeText={setDate}
            />

            <TouchableOpacity
              style={[styles.confirmSubmitBtn, isSubmitting && { opacity: 0.7 }]}
              onPress={onConfirm}
              disabled={isSubmitting}
              activeOpacity={0.8}
            >
              <CheckCircle size={16} color="#070B14" />
              <Text style={styles.confirmSubmitText}>
                {isSubmitting ? 'Confirming...' : 'Generate Instant Pass'}
              </Text>
            </TouchableOpacity>
          </View>
        </GlassCard>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(7, 11, 20, 0.65)',
    justifyContent: 'center',
    padding: 16
  },
  modalContent: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  modalHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    fontFamily: 'Sora',
    flex: 1,
    marginRight: 8
  },
  modalBody: {
    gap: 10
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary
  },
  modalInput: {
    backgroundColor: colors.cardBgLight,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    color: colors.text,
    fontSize: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    outlineWidth: 0
  },
  timeRow: {
    flexDirection: 'row',
    gap: 10
  },
  confirmSubmitBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 10
  },
  confirmSubmitText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#24201D'
  }
});
