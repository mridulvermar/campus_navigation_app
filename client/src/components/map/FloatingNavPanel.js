import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Platform } from 'react-native';
import { 
  Search, 
  MapPin, 
  Navigation, 
  RotateCcw, 
  Footprints, 
  Car, 
  Clock, 
  CheckCircle, 
  X,
  Building2,
  ListFilter,
  ArrowUpDown,
  Compass,
  ChevronUp,
  ChevronDown,
  Minimize2,
  Maximize2
} from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { GlassCard } from '../common/GlassCard';
import { Badge } from '../common/Badge';
import { getAllSelectableLocations, searchLocations } from '../../services/mapEngine/locationService';

export const FloatingNavPanel = ({
  startNode,
  destNode,
  onSelectStart,
  onSelectDest,
  routeData,
  onCalculateRoute,
  onResetRoute,
  navMode = 'pedestrian',
  onToggleNavMode
}) => {
  // 'start' | 'dest' | null
  const [activePicker, setActivePicker] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [showSteps, setShowSteps] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  const allLocations = useMemo(() => getAllSelectableLocations(), []);

  const classrooms = useMemo(() => allLocations.filter((l) => l.type === 'room'), [allLocations]);
  const buildings = useMemo(() => allLocations.filter((l) => l.type === 'building' || l.type === 'campus_node'), [allLocations]);
  const landmarks = useMemo(() => allLocations.filter((l) => l.type === 'tag'), [allLocations]);

  const filteredLocations = useMemo(() => {
    let list = allLocations;
    if (filterCategory === 'Classrooms') list = classrooms;
    if (filterCategory === 'Buildings') list = buildings;
    if (filterCategory === 'Landmarks') list = landmarks;

    if (!searchQuery || !searchQuery.trim()) {
      return list.slice(0, 15);
    }
    const q = searchQuery.toLowerCase().replace(/\s+/g, '');
    return list.filter((item) => {
      const nameMatch = (item.name || '').toLowerCase().replace(/\s+/g, '').includes(q);
      const roomMatch = (item.roomOnlyName || '').toLowerCase().replace(/\s+/g, '').includes(q);
      const buildingMatch = (item.buildingName || '').toLowerCase().replace(/\s+/g, '').includes(q);
      const floorMatch = (item.floorName || '').toLowerCase().replace(/\s+/g, '').includes(q);
      return nameMatch || roomMatch || buildingMatch || floorMatch;
    }).slice(0, 20);
  }, [allLocations, classrooms, buildings, landmarks, filterCategory, searchQuery]);

  const handleSelectLocation = (loc) => {
    if (activePicker === 'start') {
      onSelectStart(loc);
    } else if (activePicker === 'dest') {
      onSelectDest(loc);
    }
    setActivePicker(null);
    setSearchQuery('');
  };

  const handleSwap = () => {
    if (startNode && destNode) {
      const temp = startNode;
      onSelectStart(destNode);
      onSelectDest(temp);
    }
  };

  // If Minimized: Show sleek floating pill uncovering 100% of the map
  if (isMinimized) {
    return (
      <View style={styles.minimizedContainer}>
        <View style={styles.minimizedCard}>
          <View style={styles.minimizedContent}>
            <View style={styles.minimizedRoute}>
              <View style={[styles.dotSmall, { backgroundColor: colors.accent }]} />
              <Text style={styles.minimizedText} numberOfLines={1}>
                {startNode?.name?.split('(')[0] || 'Start'}
              </Text>
              <Text style={styles.minimizedArrow}>→</Text>
              <View style={[styles.dotSmall, { backgroundColor: colors.primary }]} />
              <Text style={styles.minimizedText} numberOfLines={1}>
                {destNode?.name?.split('(')[0] || 'Destination'}
              </Text>
            </View>

            {routeData && (
              <View style={styles.miniBadge}>
                <Text style={styles.miniBadgeText}>
                  {routeData.formattedWalkingTime || 'Active'} • {routeData.formattedDistance}
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.expandBtn}
              onPress={() => setIsMinimized(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.expandBtnText}>Route</Text>
              <ChevronDown size={14} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.floatingContainer}>
      <View style={styles.panelCard}>
        {/* Header with Title & Mode Switcher */}
        <View style={styles.header}>
          <View style={styles.titleColumn}>
            <Text style={styles.supertag}>ROUTE PLANNER</Text>
            <Text style={styles.heading}>Where are you going?</Text>
          </View>
          
          <TouchableOpacity
            style={styles.minimizeHeaderBtn}
            onPress={() => setIsMinimized(true)}
            activeOpacity={0.8}
            title="Minimize to see full map"
          >
            <ChevronUp size={16} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Dual Origin and Destination Pickers */}
        <View style={styles.pickerBox}>
          {/* START LOCATION ROW */}
          <TouchableOpacity
            style={[styles.pickerRow, activePicker === 'start' && styles.pickerRowActive]}
            onPress={() => {
              setActivePicker(activePicker === 'start' ? null : 'start');
              setSearchQuery('');
            }}
            activeOpacity={0.8}
          >
            <MapPin size={16} color={colors.primary} />
            <View style={{ flex: 1, marginLeft: 6 }}>
              <Text style={styles.pickerLabel}>START</Text>
              <Text style={styles.pickerValue} numberOfLines={1}>
                {startNode?.name || 'Choose start location…'}
              </Text>
            </View>
            <View style={styles.changePill}>
              <Text style={styles.changePillText}>{activePicker === 'start' ? 'Done' : 'Change'}</Text>
            </View>
          </TouchableOpacity>

          {/* SWAP BUTTON & DIVIDER */}
          <View style={styles.swapDividerRow}>
            <View style={styles.dividerLine} />
            <TouchableOpacity
              style={styles.swapButton}
              onPress={handleSwap}
              activeOpacity={0.8}
            >
              <ArrowUpDown size={13} color={colors.textSecondary} />
            </TouchableOpacity>
            <View style={styles.dividerLine} />
          </View>

          {/* DESTINATION LOCATION ROW */}
          <TouchableOpacity
            style={[styles.pickerRow, activePicker === 'dest' && styles.pickerRowActive]}
            onPress={() => {
              setActivePicker(activePicker === 'dest' ? null : 'dest');
              setSearchQuery('');
            }}
            activeOpacity={0.8}
          >
            <MapPin size={16} color={colors.accent} />
            <View style={{ flex: 1, marginLeft: 6 }}>
              <Text style={styles.pickerLabel}>DESTINATION</Text>
              <Text style={styles.pickerValue} numberOfLines={1}>
                {destNode?.name || 'Choose destination…'}
              </Text>
            </View>
            <View style={styles.changePill}>
              <Text style={styles.changePillText}>{activePicker === 'dest' ? 'Done' : 'Change'}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* ACTIVE SELECTION MODAL / DROPDOWN */}
        {activePicker && (
          <View style={styles.selectionDropdown}>
            <View style={styles.dropdownHeader}>
              <Text style={styles.dropdownTitle}>
                {activePicker === 'start' ? 'Select Start Location' : 'Select Destination'}
              </Text>
              <TouchableOpacity onPress={() => setActivePicker(null)}>
                <X size={16} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            {/* Live Search Input */}
            <View style={styles.searchBar}>
              <Search size={15} color={colors.textMuted} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search buildings, rooms, labs…"
                placeholderTextColor={colors.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
              />
              {searchQuery ? (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <X size={14} color={colors.textMuted} />
                </TouchableOpacity>
              ) : null}
            </View>

            {/* Filter Category Pills */}
            <View style={styles.pillsRow}>
              {['All', 'Classrooms', 'Buildings', 'Landmarks'].map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.categoryPill, filterCategory === cat && styles.categoryPillActive]}
                  onPress={() => setFilterCategory(cat)}
                >
                  <Text style={[styles.categoryPillText, filterCategory === cat && styles.categoryPillTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* List of Search Results */}
            <ScrollView style={styles.resultsList} nestedScrollEnabled>
              {filteredLocations.map((loc, idx) => (
                <TouchableOpacity
                  key={`loc_${loc.id}_${idx}`}
                  style={styles.locationItem}
                  onPress={() => handleSelectLocation(loc)}
                >
                  <MapPin size={15} color={colors.primary} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.locationName} numberOfLines={1}>{loc.name}</Text>
                    <Text style={styles.locationSub}>{loc.category} {loc.floorName ? `• ${loc.floorName}` : ''}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Mode switcher: Walk / Drive */}
        <View style={styles.modeToggle}>
          <TouchableOpacity
            style={[styles.modeBtn, navMode === 'pedestrian' && styles.modeBtnActive]}
            onPress={() => onToggleNavMode('pedestrian')}
          >
            <Footprints size={14} color={navMode === 'pedestrian' ? '#24201D' : colors.textMuted} />
            <Text style={[styles.modeText, navMode === 'pedestrian' && styles.modeTextActive]}>Walk</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeBtn, navMode === 'vehicle' && styles.modeBtnActive]}
            onPress={() => onToggleNavMode('vehicle')}
          >
            <Car size={14} color={navMode === 'vehicle' ? '#24201D' : colors.textMuted} />
            <Text style={[styles.modeText, navMode === 'vehicle' && styles.modeTextActive]}>Drive</Text>
          </TouchableOpacity>
        </View>

        {/* Action Controls */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.calculateBtn}
            onPress={onCalculateRoute}
            activeOpacity={0.8}
          >
            <Navigation size={16} color="#24201D" />
            <Text style={styles.calculateBtnText}>Find fastest route</Text>
          </TouchableOpacity>

          {routeData && (
            <TouchableOpacity
              style={styles.resetBtn}
              onPress={onResetRoute}
              title="Reset Route"
            >
              <RotateCcw size={15} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Route Metrics and Turn-by-Turn Guidance */}
        {routeData && (
          <View style={styles.metricsBox}>
            <View style={styles.metricsRow}>
              <View>
                <Text style={styles.timeMetric}>
                  {routeData.formattedWalkingTime ? routeData.formattedWalkingTime.split(' ').slice(0, 2).join(' ') : '7 min'}
                </Text>
                <Text style={styles.metricLabel}>Estimated time</Text>
              </View>
              <View>
                <Text style={styles.distanceMetric}>{routeData.formattedDistance || '511 m'}</Text>
                <Text style={styles.metricLabel}>Distance</Text>
              </View>
              <TouchableOpacity onPress={() => setShowSteps(!showSteps)} style={styles.stepsToggleBtn}>
                <Text style={styles.stepsToggleText}>
                  {showSteps ? 'Hide steps' : 'View steps'}
                </Text>
              </TouchableOpacity>
            </View>

            {showSteps && routeData.stepInstructions && (
              <ScrollView style={styles.stepsList} nestedScrollEnabled>
                {routeData.stepInstructions.map((step, idx) => (
                  <View key={`step_${idx}`} style={styles.stepItem}>
                    <View style={styles.stepNumBadge}>
                      <Text style={styles.stepNum}>{idx + 1}</Text>
                    </View>
                    <Text style={styles.stepText}>{step}</Text>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  floatingContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    maxWidth: 440,
    zIndex: 900,
    alignSelf: 'flex-start'
  },
  minimizedContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    maxWidth: 440,
    zIndex: 900,
    alignSelf: 'flex-start'
  },
  minimizedCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4
  },
  minimizedContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  minimizedRoute: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  dotSmall: {
    width: 7,
    height: 7,
    borderRadius: 4
  },
  minimizedText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
    maxWidth: 90
  },
  minimizedArrow: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '700'
  },
  miniBadge: {
    backgroundColor: colors.cardBgLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  miniBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary
  },
  expandBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.cardBgLight,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8
  },
  expandBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.text
  },
  panelCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14
  },
  titleColumn: {
    flex: 1
  },
  supertag: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.8,
    fontFamily: 'Manrope'
  },
  heading: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginTop: 2,
    fontFamily: 'Sora'
  },
  minimizeHeaderBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: colors.cardBgLight,
  },
  pickerBox: {
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    overflow: 'hidden',
    marginBottom: 12
  },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  pickerRowActive: {
    backgroundColor: colors.cardBgLight,
  },
  pickerLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.6,
  },
  pickerValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginTop: 1
  },
  changePill: {
    backgroundColor: colors.cardBgLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.cardBorder
  },
  changePillText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary
  },
  swapDividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 0
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.cardBorder
  },
  swapButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8
  },
  selectionDropdown: {
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  dropdownTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.text
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBgLight,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingHorizontal: 10,
    paddingVertical: 7,
    gap: 8,
    marginBottom: 8
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: 12,
    padding: 0,
    outlineWidth: 0
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 8
  },
  categoryPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: colors.cardBgLight,
    borderWidth: 1,
    borderColor: colors.cardBorder
  },
  categoryPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  categoryPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary
  },
  categoryPillTextActive: {
    color: '#24201D',
    fontWeight: '800'
  },
  resultsList: {
    maxHeight: 160
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder
  },
  locationName: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text
  },
  locationSub: {
    fontSize: 10,
    color: colors.textMuted
  },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: colors.cardBgLight,
    borderRadius: 12,
    padding: 3,
    gap: 4,
    marginBottom: 12
  },
  modeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 9,
  },
  modeBtnActive: {
    backgroundColor: colors.cardBg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2
  },
  modeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary
  },
  modeTextActive: {
    color: '#24201D',
    fontWeight: '800'
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center'
  },
  calculateBtn: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  calculateBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#28231D',
    fontFamily: 'Sora'
  },
  resetBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.cardBgLight,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center'
  },
  metricsBox: {
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
    paddingTop: 12
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 8
  },
  timeMetric: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    fontFamily: 'Sora'
  },
  distanceMetric: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    fontFamily: 'Sora'
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
    marginTop: 1
  },
  stepsToggleBtn: {
    paddingVertical: 4
  },
  stepsToggleText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary
  },
  stepsList: {
    marginTop: 8,
    maxHeight: 140,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8
  },
  stepNumBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.cardBgLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1
  },
  stepNum: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.textSecondary
  },
  stepText: {
    flex: 1,
    fontSize: 12,
    color: colors.text,
    lineHeight: 18
  }
});
