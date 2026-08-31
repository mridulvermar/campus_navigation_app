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
  const [showSteps, setShowSteps] = useState(false);
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
        <GlassCard style={styles.minimizedCard} glow>
          <View style={styles.minimizedContent}>
            <View style={styles.minimizedRoute}>
              <View style={[styles.dotSmall, { backgroundColor: colors.accent }]} />
              <Text style={styles.minimizedText} numberOfLines={1}>
                {startNode?.name?.split('(')[0] || 'Start'}
              </Text>
              <Text style={styles.minimizedArrow}>→</Text>
              <View style={[styles.dotSmall, { backgroundColor: colors.danger }]} />
              <Text style={styles.minimizedText} numberOfLines={1}>
                {destNode?.name?.split('(')[0] || 'Destination'}
              </Text>
            </View>

            {routeData && (
              <Badge variant="primary" size="sm">
                {routeData.formattedWalkingTime || 'Active'} • {routeData.formattedDistance}
              </Badge>
            )}

            <TouchableOpacity
              style={styles.expandBtn}
              onPress={() => setIsMinimized(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.expandBtnText}>Expand Search</Text>
              <ChevronDown size={14} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </GlassCard>
      </View>
    );
  }

  return (
    <View style={styles.floatingContainer}>
      <GlassCard style={styles.panelCard} glow>
        {/* Header with Minimize Toggle */}
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <View style={styles.iconBox}>
              <Navigation size={16} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.heading}>Campus GIS Navigator</Text>
              <Text style={styles.subheading}>Manual Point Selection & Dual-Mode Routing</Text>
            </View>
          </View>
          
          {/* Controls: Mode Switcher & Minimize Button */}
          <View style={styles.headerRightControls}>
            <View style={styles.modeToggle}>
              <TouchableOpacity
                style={[styles.modeBtn, navMode === 'pedestrian' && styles.modeBtnActive]}
                onPress={() => onToggleNavMode('pedestrian')}
              >
                <Footprints size={12} color={navMode === 'pedestrian' ? '#070B14' : colors.textSecondary} />
                <Text style={[styles.modeText, navMode === 'pedestrian' && styles.modeTextActive]}>Walk</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modeBtn, navMode === 'vehicle' && styles.modeBtnActive]}
                onPress={() => onToggleNavMode('vehicle')}
              >
                <Car size={12} color={navMode === 'vehicle' ? '#070B14' : colors.textSecondary} />
                <Text style={[styles.modeText, navMode === 'vehicle' && styles.modeTextActive]}>Drive</Text>
              </TouchableOpacity>
            </View>

            {/* Minimize Button */}
            <TouchableOpacity
              style={styles.minimizeHeaderBtn}
              onPress={() => setIsMinimized(true)}
              activeOpacity={0.8}
              title="Minimize to see full map"
            >
              <ChevronUp size={16} color={colors.primary} />
              <Text style={styles.minimizeBtnText}>Hide</Text>
            </TouchableOpacity>
          </View>
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
            <View style={[styles.pinDot, { backgroundColor: colors.accent }]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.pickerLabel}>STARTING POINT (FROM)</Text>
              <Text style={styles.pickerValue} numberOfLines={1}>
                {startNode?.name || 'Tap to choose start location...'}
              </Text>
            </View>
            <Badge variant="emerald" size="sm">
              {activePicker === 'start' ? 'Selecting...' : 'Change'}
            </Badge>
          </TouchableOpacity>

          {/* SWAP BUTTON & DIVIDER */}
          <View style={styles.swapDividerRow}>
            <View style={styles.dividerLine} />
            <TouchableOpacity
              style={styles.swapButton}
              onPress={handleSwap}
              activeOpacity={0.8}
            >
              <ArrowUpDown size={14} color={colors.primary} />
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
            <View style={[styles.pinDot, { backgroundColor: colors.danger }]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.pickerLabel}>DESTINATION (TO)</Text>
              <Text style={styles.pickerValue} numberOfLines={1}>
                {destNode?.name || 'Tap to choose destination...'}
              </Text>
            </View>
            <Badge variant="danger" size="sm">
              {activePicker === 'dest' ? 'Selecting...' : 'Change'}
            </Badge>
          </TouchableOpacity>
        </View>

        {/* ACTIVE SELECTION MODAL / DROPDOWN */}
        {activePicker && (
          <View style={styles.selectionDropdown}>
            <View style={styles.dropdownHeader}>
              <Text style={styles.dropdownTitle}>
                {activePicker === 'start' ? '🟢 Choose Start Location' : '🔴 Choose Destination'}
              </Text>
              <TouchableOpacity onPress={() => setActivePicker(null)}>
                <X size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Live Search Input */}
            <View style={styles.searchBar}>
              <Search size={14} color={colors.primary} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search 428 classrooms, labs, buildings..."
                placeholderTextColor={colors.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
              />
              {searchQuery ? (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <X size={14} color={colors.textSecondary} />
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
                  <MapPin size={14} color={activePicker === 'start' ? colors.accent : colors.danger} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.locationName} numberOfLines={1}>{loc.name}</Text>
                    <Text style={styles.locationSub}>{loc.category} {loc.floorName ? `• ${loc.floorName}` : ''}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Action Controls */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.calculateBtn}
            onPress={onCalculateRoute}
            activeOpacity={0.8}
          >
            <Navigation size={14} color="#070B14" />
            <Text style={styles.calculateBtnText}>Calculate Shortest Road Route</Text>
          </TouchableOpacity>

          {routeData && (
            <TouchableOpacity
              style={styles.resetBtn}
              onPress={onResetRoute}
            >
              <RotateCcw size={14} color={colors.danger} />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.minimizeBtn}
            onPress={() => setIsMinimized(true)}
            activeOpacity={0.8}
          >
            <Minimize2 size={14} color={colors.primary} />
            <Text style={styles.minimizeText}>See Full Map</Text>
          </TouchableOpacity>
        </View>

        {/* Route Metrics and Turn-by-Turn Guidance */}
        {routeData && (
          <View style={styles.metricsBox}>
            <View style={styles.metricsRow}>
              <View style={styles.metricItem}>
                <Clock size={12} color={colors.primary} />
                <Text style={styles.metricText}>{routeData.formattedWalkingTime || '3 min'}</Text>
              </View>
              <View style={styles.metricItem}>
                <Footprints size={12} color={colors.accent} />
                <Text style={styles.metricText}>{routeData.formattedDistance || '240 m'}</Text>
              </View>
              <TouchableOpacity onPress={() => setShowSteps(!showSteps)}>
                <Text style={styles.stepsToggleText}>
                  {showSteps ? 'Hide Turn-by-Turn Steps ▲' : 'View Turn-by-Turn Steps ▼'}
                </Text>
              </TouchableOpacity>
            </View>

            {showSteps && routeData.stepInstructions && (
              <ScrollView style={styles.stepsList} nestedScrollEnabled>
                {routeData.stepInstructions.map((step, idx) => (
                  <View key={`step_${idx}`} style={styles.stepItem}>
                    <Text style={styles.stepNum}>{idx + 1}.</Text>
                    <Text style={styles.stepText}>{step}</Text>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        )}
      </GlassCard>
    </View>
  );
};

const styles = StyleSheet.create({
  floatingContainer: {
    position: 'absolute',
    top: 14,
    left: 14,
    right: 14,
    maxWidth: 580,
    zIndex: 900,
    alignSelf: 'center'
  },
  minimizedContainer: {
    position: 'absolute',
    top: 14,
    left: 14,
    right: 14,
    maxWidth: 580,
    zIndex: 900,
    alignSelf: 'center'
  },
  minimizedCard: {
    backgroundColor: 'rgba(11, 15, 25, 0.95)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderColor: colors.cardBorderGlow
  },
  minimizedContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    flexWrap: 'wrap'
  },
  minimizedRoute: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    minWidth: 160
  },
  dotSmall: {
    width: 8,
    height: 8,
    borderRadius: 4
  },
  minimizedText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.text,
    maxWidth: 120
  },
  minimizedArrow: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '900'
  },
  expandBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.35)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8
  },
  expandBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary
  },
  panelCard: {
    backgroundColor: 'rgba(11, 15, 25, 0.95)',
    padding: 14,
    borderColor: colors.cardBorderGlow
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1
  },
  iconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(6, 182, 212, 0.2)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  heading: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.text
  },
  subheading: {
    fontSize: 9,
    color: colors.textSecondary
  },
  headerRightControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: colors.cardBgLight,
    borderRadius: 8,
    padding: 2,
    gap: 2
  },
  modeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6
  },
  modeBtnActive: {
    backgroundColor: colors.primary
  },
  modeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary
  },
  modeTextActive: {
    color: '#070B14'
  },
  minimizeHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: 'rgba(6, 182, 212, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.3)',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6
  },
  minimizeBtnText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primary
  },
  pickerBox: {
    backgroundColor: colors.cardBgLight,
    borderRadius: 12,
    padding: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder
  },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 8
  },
  pickerRowActive: {
    backgroundColor: 'rgba(6, 182, 212, 0.12)',
    borderWidth: 1,
    borderColor: colors.primary
  },
  pinDot: {
    width: 10,
    height: 10,
    borderRadius: 5
  },
  pickerLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.6
  },
  pickerValue: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
    marginTop: 1
  },
  swapDividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(51, 65, 85, 0.4)'
  },
  swapButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.cardBg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8
  },
  selectionDropdown: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    padding: 10,
    marginBottom: 8
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
    backgroundColor: colors.inputBg,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 8,
    marginBottom: 8
  },
  searchInput: {
    flex: 1,
    color: colors.text,
    fontSize: 12,
    padding: 0
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
    color: '#070B14',
    fontWeight: '800'
  },
  resultsList: {
    maxHeight: 160
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(51, 65, 85, 0.4)'
  },
  locationName: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text
  },
  locationSub: {
    fontSize: 10,
    color: colors.textSecondary
  },
  actionRow: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center'
  },
  calculateBtn: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6
  },
  calculateBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#070B14'
  },
  resetBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  minimizeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.35)',
    paddingHorizontal: 10,
    height: 36,
    borderRadius: 10
  },
  minimizeText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primary
  },
  metricsBox: {
    marginTop: 8,
    backgroundColor: 'rgba(6, 182, 212, 0.08)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.3)',
    padding: 8
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  metricText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.text
  },
  stepsToggleText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary
  },
  stepsList: {
    marginTop: 8,
    maxHeight: 120,
    borderTopWidth: 1,
    borderTopColor: 'rgba(6, 182, 212, 0.2)',
    paddingTop: 6
  },
  stepItem: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 4
  },
  stepNum: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary
  },
  stepText: {
    flex: 1,
    fontSize: 10,
    color: colors.textSecondary
  }
});
