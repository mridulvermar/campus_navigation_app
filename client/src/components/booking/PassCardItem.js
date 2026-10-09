import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Clock, QrCode, MapPin } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { GlassCard } from '../common/GlassCard';
import { Badge } from '../common/Badge';

export const PassCardItem = React.memo(({ booking, onShowQR, onNavigate }) => {
  const roomName = booking.room?.name || booking.room?.roomNumber || 'Classroom / Hall';
  const statusVariant = booking.status === 'Approved' ? 'success' : 'warning';

  return (
    <GlassCard style={styles.passCard} glow>
      <View style={styles.passHeader}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Text style={styles.passRoom} numberOfLines={1}>{roomName}</Text>
          <Text style={styles.passPurpose} numberOfLines={2}>{booking.purpose}</Text>
        </View>
        <Badge variant={statusVariant} size="sm">
          {booking.status || 'Active'}
        </Badge>
      </View>

      <View style={styles.passMetaRow}>
        <View style={styles.passMetaItem}>
          <Clock size={12} color={colors.primary} />
          <Text style={styles.passMetaText}>
            {booking.date || 'Today'} • {booking.startTime} - {booking.endTime}
          </Text>
        </View>
      </View>

      <View style={styles.passFooter}>
        <TouchableOpacity
          style={styles.qrBtn}
          onPress={() => onShowQR(booking)}
          activeOpacity={0.8}
        >
          <QrCode size={14} color="#070B14" />
          <Text style={styles.qrBtnText}>Show Digital Pass</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navPassBtn}
          onPress={() => onNavigate(booking.room?.roomNumber || booking.room?.name)}
          activeOpacity={0.8}
        >
          <MapPin size={14} color={colors.primary} />
          <Text style={styles.navPassText}>Directions</Text>
        </TouchableOpacity>
      </View>
    </GlassCard>
  );
});

const styles = StyleSheet.create({
  passCard: {
    padding: 16,
    marginBottom: 10,
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder
  },
  passHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6
  },
  passRoom: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    fontFamily: 'Sora'
  },
  passPurpose: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2
  },
  passMetaRow: {
    marginVertical: 10
  },
  passMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  passMetaText: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600'
  },
  passFooter: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4
  },
  qrBtn: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6
  },
  qrBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#28231D',
    fontFamily: 'Sora'
  },
  navPassBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: colors.cardBgLight,
    borderWidth: 1,
    borderColor: colors.cardBorder
  },
  navPassText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.text
  }
});
