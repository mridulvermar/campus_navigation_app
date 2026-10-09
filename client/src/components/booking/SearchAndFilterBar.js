import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Search, X, CheckCircle2, Clock } from 'lucide-react-native';
import { colors } from '../../theme/colors';

export const SearchAndFilterBar = React.memo(({
  searchQuery,
  onSearchChange,
  buildingFilters,
  selectedFilter,
  onSelectFilter,
  availabilityFilter,
  onSelectAvailabilityFilter,
  availableCount,
  bookedCount
}) => {
  return (
    <View style={styles.container}>
      {/* Search Input */}
      <View style={styles.searchBar}>
        <Search size={16} color={colors.primary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search room name, lab code, capacity..."
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={onSearchChange}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => onSearchChange('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <X size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Live Availability Quick Toggle Pills */}
      <View style={styles.availPillRow}>
        <TouchableOpacity
          style={[styles.availPill, availabilityFilter === 'all' && styles.availPillActive]}
          onPress={() => onSelectAvailabilityFilter('all')}
          activeOpacity={0.7}
        >
          <Text style={[styles.availPillText, availabilityFilter === 'all' && styles.availPillTextActive]}>
            All Statuses
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.availPill, styles.availGreenPill, availabilityFilter === 'available' && styles.availGreenPillActive]}
          onPress={() => onSelectAvailabilityFilter('available')}
          activeOpacity={0.7}
        >
          <CheckCircle2 size={12} color={availabilityFilter === 'available' ? '#070B14' : '#10B981'} />
          <Text style={[styles.availPillText, { color: availabilityFilter === 'available' ? '#070B14' : '#10B981' }]}>
            Available Now ({availableCount !== undefined ? availableCount : 'Live'})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.availPill, styles.availAmberPill, availabilityFilter === 'booked' && styles.availAmberPillActive]}
          onPress={() => onSelectAvailabilityFilter('booked')}
          activeOpacity={0.7}
        >
          <Clock size={12} color={availabilityFilter === 'booked' ? '#070B14' : '#F59E0B'} />
          <Text style={[styles.availPillText, { color: availabilityFilter === 'booked' ? '#070B14' : '#F59E0B' }]}>
            Booked Today ({bookedCount !== undefined ? bookedCount : 'Live'})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Block Filter Horizontal Scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScroll}
      >
        {buildingFilters.map((b) => {
          const isActive = selectedFilter === b;
          return (
            <TouchableOpacity
              key={b}
              style={[styles.filterPill, isActive && styles.filterPillActive]}
              onPress={() => onSelectFilter(b)}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                {b}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingBottom: 8
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingHorizontal: 12,
    paddingVertical: 9,
    gap: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: 12,
    padding: 0,
    outlineWidth: 0
  },
  availPillRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 8,
    flexWrap: 'wrap'
  },
  availPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.cardBorder
  },
  availPillActive: {
    backgroundColor: colors.text,
    borderColor: colors.text
  },
  availGreenPill: {
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderColor: 'rgba(16, 185, 129, 0.3)'
  },
  availGreenPillActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981'
  },
  availAmberPill: {
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
    borderColor: 'rgba(245, 158, 11, 0.3)'
  },
  availAmberPillActive: {
    backgroundColor: '#F59E0B',
    borderColor: '#F59E0B'
  },
  availPillText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: colors.textSecondary
  },
  availPillTextActive: {
    color: '#070B14',
    fontWeight: '800'
  },
  filterScroll: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 4
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.cardBorder
  },
  filterPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  filterText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary
  },
  filterTextActive: {
    color: '#24201D',
    fontWeight: '800'
  }
});
