import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Platform, ScrollView, TextInput } from 'react-native';
import { BlurView } from 'expo-blur';
import { X, CheckCircle, Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, Check } from 'lucide-react-native';
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

  const totalSeats = room?.capacity || 60;

  // Monthly Calendar Navigation State
  const [currentMonthDate, setCurrentMonthDate] = useState(() => new Date());

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayHeaders = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const currentYear = currentMonthDate.getFullYear();
  const currentMonth = currentMonthDate.getMonth();

  // Generate matrix for current month calendar view
  const calendarGrid = useMemo(() => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const cells = [];
    // Blank padding cells for days before the 1st
    for (let i = 0; i < firstDayIndex; i++) {
      cells.push({ dayNum: null, key: `empty-${i}` });
    }

    // Days of current month
    for (let day = 1; day <= daysInMonth; day++) {
      const cellDate = new Date(currentYear, currentMonth, day);
      cellDate.setHours(0, 0, 0, 0);
      const isPast = cellDate < today;
      const isToday = cellDate.getTime() === today.getTime();
      const isoStr = cellDate.toISOString().split('T')[0];
      const monthShort = monthNames[currentMonth].substring(0, 3);
      const formattedDate = isToday ? 'Today' : `${monthShort} ${String(day).padStart(2, '0')}, ${currentYear}`;

      cells.push({
        dayNum: day,
        dateObj: cellDate,
        iso: isoStr,
        formattedDate,
        isPast,
        isToday,
        key: `day-${day}`
      });
    }

    return cells;
  }, [currentYear, currentMonth]);

  const handlePrevMonth = () => {
    setCurrentMonthDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(new Date(currentYear, currentMonth + 1, 1));
  };

  // Preset academic time slots
  const standardTimeSlots = [
    { label: '09:00 AM - 11:00 AM', start: '09:00 AM', end: '11:00 AM', tag: 'Morning 1' },
    { label: '11:15 AM - 01:15 PM', start: '11:15 AM', end: '01:15 PM', tag: 'Morning 2' },
    { label: '01:45 PM - 03:45 PM', start: '01:45 PM', end: '03:45 PM', tag: 'Afternoon 1' },
    { label: '04:00 PM - 06:00 PM', start: '04:00 PM', end: '06:00 PM', tag: 'Evening' },
    { label: '06:00 PM - 08:00 PM', start: '06:00 PM', end: '08:00 PM', tag: 'Late Study' }
  ];

  // Quick purpose tags
  const samplePurposes = [
    'Attending Lecture',
    'Lab Practicals & Code',
    'Quiet Self Study',
    'Seminar & Workshop'
  ];

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
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={styles.modalHeading} numberOfLines={1}>
                Book 1 Seat in {room?.name || 'Classroom'}
              </Text>
              <Text style={styles.modalSubheading}>
                Individual Student Pass • Room Capacity: {totalSeats} Seats
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <X size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
            {/* ======================================================== */}
            {/* 1. INTERACTIVE FULL CALENDAR VIEW */}
            {/* ======================================================== */}
            <View style={styles.calendarContainer}>
              <View style={styles.calendarHeaderRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <CalendarIcon size={15} color={colors.primary} />
                  <Text style={styles.calendarMonthTitle}>
                    {monthNames[currentMonth]} {currentYear}
                  </Text>
                </View>

                {/* Month navigation arrows */}
                <View style={styles.monthNavRow}>
                  <TouchableOpacity 
                    style={styles.monthNavBtn} 
                    onPress={handlePrevMonth}
                    activeOpacity={0.7}
                  >
                    <ChevronLeft size={16} color={colors.text} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.monthNavBtn} 
                    onPress={handleNextMonth}
                    activeOpacity={0.7}
                  >
                    <ChevronRight size={16} color={colors.text} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Day Headers (Su, Mo, Tu, We, Th, Fr, Sa) */}
              <View style={styles.dayHeaderGrid}>
                {dayHeaders.map((dh) => (
                  <Text key={dh} style={styles.dayHeaderText}>{dh}</Text>
                ))}
              </View>

              {/* Monthly Date Grid */}
              <View style={styles.daysGrid}>
                {calendarGrid.map((cell) => {
                  if (!cell.dayNum) {
                    return <View key={cell.key} style={styles.emptyDayCell} />;
                  }

                  const isSelected = 
                    date === cell.formattedDate || 
                    date === cell.iso || 
                    (date === 'Today' && cell.isToday);

                  return (
                    <TouchableOpacity
                      key={cell.key}
                      style={[
                        styles.dayCell,
                        cell.isToday && styles.dayCellToday,
                        isSelected && styles.dayCellSelected,
                        cell.isPast && styles.dayCellPast
                      ]}
                      onPress={() => !cell.isPast && setDate(cell.formattedDate)}
                      disabled={cell.isPast}
                      activeOpacity={0.75}
                    >
                      <Text style={[
                        styles.dayCellText,
                        cell.isToday && styles.dayCellTextToday,
                        isSelected && styles.dayCellTextSelected,
                        cell.isPast && styles.dayCellTextPast
                      ]}>
                        {cell.dayNum}
                      </Text>
                      {cell.isToday && !isSelected && (
                        <View style={styles.todayDot} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.selectedDateSummary}>
                <Text style={styles.selectedDateLabel}>Selected Date:</Text>
                <Text style={styles.selectedDateValue}>{date || 'Today'}</Text>
              </View>
            </View>

            {/* ======================================================== */}
            {/* 2. INTERACTIVE TIME SLOT SELECTOR */}
            {/* ======================================================== */}
            <View style={styles.sectionHeaderRow}>
              <Clock size={14} color={colors.primary} />
              <Text style={styles.sectionHeading}>SELECT TIME SLOT</Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timeSlotsScroll}>
              <View style={styles.timeSlotRow}>
                {standardTimeSlots.map((slot) => {
                  const isSelected = startTime === slot.start && endTime === slot.end;
                  return (
                    <TouchableOpacity
                      key={slot.label}
                      style={[styles.timeSlotPill, isSelected && styles.timeSlotPillActive]}
                      onPress={() => {
                        setStartTime(slot.start);
                        setEndTime(slot.end);
                      }}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.timeSlotLabel, isSelected && styles.timeSlotLabelActive]}>
                        {slot.label}
                      </Text>
                      <Text style={[styles.timeSlotTag, isSelected && styles.timeSlotTagActive]}>
                        {slot.tag}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>

            {/* ======================================================== */}
            {/* 3. PURPOSE & TOPIC SELECTION */}
            {/* ======================================================== */}
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeading}>PURPOSE / COURSE</Text>
            </View>

            <TextInput
              style={styles.modalInput}
              value={purpose}
              onChangeText={setPurpose}
              placeholder="e.g. Attending CS-101 Lecture / Self Study"
              placeholderTextColor={colors.textMuted}
            />

            {/* Purpose Chips */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.purposeChipsScroll}>
              <View style={{ flexDirection: 'row', gap: 6 }}>
                {samplePurposes.map((p) => {
                  const isSelected = purpose === p;
                  return (
                    <TouchableOpacity
                      key={p}
                      style={[styles.purposeChip, isSelected && styles.purposeChipActive]}
                      onPress={() => setPurpose(p)}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.purposeChipText, isSelected && styles.purposeChipTextActive]}>
                        {p}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>

            {/* Confirmation Banner */}
            <View style={styles.approvalNote}>
              <Text style={styles.approvalNoteText}>
                🛡️ 1-Seat reservation will be sent to the administrator for instant approval.
              </Text>
            </View>

            {/* Confirm Submit Button */}
            <TouchableOpacity
              style={[styles.confirmSubmitBtn, isSubmitting && { opacity: 0.7 }]}
              onPress={onConfirm}
              disabled={isSubmitting}
              activeOpacity={0.8}
            >
              <CheckCircle size={16} color="#070B14" />
              <Text style={styles.confirmSubmitText}>
                {isSubmitting ? 'Submitting Reservation...' : 'Confirm 1-Seat Booking'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </GlassCard>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(7, 11, 20, 0.75)',
    justifyContent: 'center',
    padding: 16
  },
  modalContent: {
    backgroundColor: colors.cardBg,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 18,
    maxHeight: '92%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10
  },
  modalHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
    fontFamily: 'Sora'
  },
  modalSubheading: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2
  },
  modalScroll: {
    flexGrow: 0
  },

  // Calendar Container
  calendarContainer: {
    backgroundColor: colors.cardBgLight,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 12,
    marginBottom: 12
  },
  calendarHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  calendarMonthTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.text,
    fontFamily: 'Sora'
  },
  monthNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  monthNavBtn: {
    width: 28,
    height: 28,
    borderRadius: 7,
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center'
  },
  dayHeaderGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
    paddingBottom: 4
  },
  dayHeaderText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: colors.textMuted,
    width: '14.28%',
    textAlign: 'center'
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start'
  },
  emptyDayCell: {
    width: '14.28%',
    height: 32
  },
  dayCell: {
    width: '14.28%',
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginVertical: 1
  },
  dayCellToday: {
    borderWidth: 1,
    borderColor: 'rgba(234, 162, 40, 0.4)'
  },
  dayCellSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  dayCellPast: {
    opacity: 0.25
  },
  dayCellText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text
  },
  dayCellTextToday: {
    color: colors.primary,
    fontWeight: '800'
  },
  dayCellTextSelected: {
    color: '#070B14',
    fontWeight: '900'
  },
  dayCellTextPast: {
    color: colors.textMuted
  },
  todayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
    position: 'absolute',
    bottom: 2
  },
  selectedDateSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder
  },
  selectedDateLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted
  },
  selectedDateValue: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primary
  },

  // Section Headers
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6
  },
  sectionHeading: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textSecondary,
    letterSpacing: 0.8
  },

  // Time Slots
  timeSlotsScroll: {
    marginBottom: 10
  },
  timeSlotRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 2
  },
  timeSlotPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: colors.cardBgLight,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center'
  },
  timeSlotPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  timeSlotLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.text
  },
  timeSlotLabelActive: {
    color: '#070B14'
  },
  timeSlotTag: {
    fontSize: 9.5,
    color: colors.textMuted,
    marginTop: 1
  },
  timeSlotTagActive: {
    color: '#070B14',
    fontWeight: '700'
  },

  // Inputs & Chips
  modalInput: {
    backgroundColor: colors.cardBgLight,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    color: colors.text,
    fontSize: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    outlineWidth: 0,
    marginBottom: 6
  },
  purposeChipsScroll: {
    marginBottom: 8
  },
  purposeChip: {
    backgroundColor: colors.cardBgLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.cardBorder
  },
  purposeChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  purposeChipText: {
    fontSize: 10.5,
    color: colors.textSecondary,
    fontWeight: '600'
  },
  purposeChipTextActive: {
    color: '#070B14',
    fontWeight: '800'
  },

  // Note & Confirm
  approvalNote: {
    backgroundColor: 'rgba(234, 162, 40, 0.1)',
    borderRadius: 8,
    padding: 8,
    marginBottom: 10
  },
  approvalNoteText: {
    fontSize: 10.5,
    color: colors.primary,
    fontWeight: '600'
  },
  confirmSubmitBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6
  },
  confirmSubmitText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#24201D'
  }
});
