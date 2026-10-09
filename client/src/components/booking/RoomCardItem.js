import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Users, Sparkles, CalendarCheck, MapPin, CheckCircle2, Clock, AlertCircle } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { GlassCard } from '../common/GlassCard';
import { Badge } from '../common/Badge';

export const RoomCardItem = React.memo(({ room, onReserve, onNavigate, activeBooking }) => {
  const buildingName = room.building?.name || 'Academic Block';
  const floorNumber = room.floor || 2;
  const roomTitle = room.name || room.roomNumber;
  const roomType = room.type || 'Lecture Hall';
  const capacity = room.capacity || 60;

  // Determine Live Availability Status
  const isBooked = !!activeBooking;
  const isApprovedBooking = activeBooking?.status === 'Approved';

  return (
    <GlassCard style={[styles.roomCard, isBooked && styles.roomCardBooked]} glow={!isBooked}>
      <View style={styles.roomCardHeader}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <View style={styles.blockRow}>
            <Text style={styles.blockTag} numberOfLines={1}>{buildingName}</Text>
            <Text style={styles.floorTag}>• Floor {floorNumber}</Text>
          </View>
          <Text style={styles.roomTitle} numberOfLines={1}>{roomTitle}</Text>
        </View>
        <Badge variant={roomType === 'Lab' ? 'secondary' : 'primary'} size="sm">
          {roomType}
        </Badge>
      </View>

      {/* Live Availability Status Indicator */}
      <View style={styles.availabilityRow}>
        {isBooked ? (
          <View style={[styles.statusTag, isApprovedBooking ? styles.statusTagOccupied : styles.statusTagReserved]}>
            <Clock size={12} color={isApprovedBooking ? '#EF4444' : '#F59E0B'} />
            <Text style={[styles.statusTagText, { color: isApprovedBooking ? '#EF4444' : '#F59E0B' }]} numberOfLines={1}>
              {isApprovedBooking ? 'In Use Today' : 'Reserved Today'}: {activeBooking.startTime} - {activeBooking.endTime}
            </Text>
          </View>
        ) : (
          <View style={[styles.statusTag, styles.statusTagAvailable]}>
            <CheckCircle2 size={12} color="#10B981" />
            <Text style={[styles.statusTagText, { color: '#10B981' }]}>
              Available Now • Free for Reservation
            </Text>
          </View>
        )}
      </View>

      {isBooked && activeBooking.purpose ? (
        <Text style={styles.bookedPurposeText} numberOfLines={1}>
          📌 {activeBooking.purpose}
        </Text>
      ) : null}

      <View style={styles.featuresRow}>
        <View style={styles.featItem}>
          <Users size={12} color={colors.accent} />
          <Text style={styles.featText}>Seats: {capacity}</Text>
        </View>
        <View style={styles.featItem}>
          <Sparkles size={12} color={colors.primary} />
          <Text style={styles.featText}>Smart Projector & AC</Text>
        </View>
      </View>

      <View style={styles.roomCardFooter}>
        <TouchableOpacity
          style={[styles.reserveBtn, isBooked && styles.reserveBtnBooked]}
          onPress={() => onReserve(room)}
          activeOpacity={0.8}
        >
          <CalendarCheck size={14} color="#070B14" />
          <Text style={styles.reserveBtnText}>
            {isBooked ? 'Reserve Another Slot' : 'Reserve Classroom'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.routeBtn}
          onPress={() => onNavigate(room.roomNumber || room.name)}
          activeOpacity={0.8}
        >
          <MapPin size={14} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </GlassCard>
  );
});

const styles = StyleSheet.create({
  roomCard: {
    padding: 16,
    marginBottom: 10,
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder
  },
  roomCardBooked: {
    borderColor: 'rgba(245, 158, 11, 0.3)'
  },
  roomCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  blockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  blockTag: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.8
  },
  floorTag: {
    fontSize: 10,
    color: colors.textMuted
  },
  roomTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginTop: 2,
    fontFamily: 'Sora'
  },
  availabilityRow: {
    marginTop: 8,
    marginBottom: 4
  },
  statusTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start'
  },
  statusTagAvailable: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)'
  },
  statusTagOccupied: {
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)'
  },
  statusTagReserved: {
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.25)'
  },
  statusTagText: {
    fontSize: 11,
    fontWeight: '700'
  },
  bookedPurposeText: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
    fontStyle: 'italic'
  },
  featuresRow: {
    flexDirection: 'row',
    gap: 14,
    marginVertical: 10
  },
  featItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  featText: {
    fontSize: 11,
    color: colors.textSecondary
  },
  roomCardFooter: {
    flexDirection: 'row',
    gap: 8
  },
  reserveBtn: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6
  },
  reserveBtnBooked: {
    backgroundColor: '#F59E0B'
  },
  reserveBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#24201D'
  },
  routeBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.cardBgLight,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
