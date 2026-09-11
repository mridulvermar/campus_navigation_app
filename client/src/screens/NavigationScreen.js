import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  Modal, 
  Platform 
} from 'react-native';
import { 
  Navigation, 
  Search, 
  Info, 
  Sun, 
  Compass, 
  Layers, 
  Crosshair, 
  Plus, 
  Minus, 
  X, 
  Home, 
  Map as MapIcon,
  ArrowLeft 
} from 'lucide-react-native';
import { colors } from '../theme/colors';
import { InteractiveCampusMap } from '../components/map/InteractiveCampusMap';
import { FloatingNavPanel } from '../components/map/FloatingNavPanel';
import { useNavigation } from '../context/NavigationContext';
import { getAllSelectableLocations } from '../services/mapEngine/locationService';
import geolocationsData from '../data/geolocations_graph.json';

export const NavigationScreen = ({ route, navigation }) => {
  const { 
    sourceBuilding, 
    setSourceBuilding, 
    destBuilding, 
    setDestBuilding, 
    activeRoute, 
    calculateRoute, 
    clearRoute,
    navMode,
    setNavMode
  } = useNavigation();

  const [mapLayer, setMapLayer] = useState('satellite'); // 'satellite' (WebP) | 'streets' (SVG)
  const [zoomAction, setZoomAction] = useState(null);
  const [showInfoModal, setShowInfoModal] = useState(false);

  // Initial load route calculation (Main Gate -> SF Block Labs)
  useEffect(() => {
    const allLocs = getAllSelectableLocations();
    const defaultStart = allLocs.find(l => l.id === 'main-gate') || allLocs[0];
    const defaultDest = allLocs.find(l => l.id === 'sf-block-labs') || allLocs[1];

    if (!sourceBuilding) setSourceBuilding(defaultStart);
    if (!destBuilding) setDestBuilding(defaultDest);

    calculateRoute(defaultStart, defaultDest, navMode);
  }, []);

  // Auto calculate on route parameter
  useEffect(() => {
    const destCode = route?.params?.destCode || 
                     route?.params?.destination || 
                     route?.params?.targetLocation || 
                     route?.params?.venueName;
    if (destCode) {
      const allLocs = getAllSelectableLocations();
      const codeStr = String(destCode).toLowerCase().replace(/[-_]/g, ' ');
      const matched = allLocs.find(
        (l) => (l.id && String(l.id).toLowerCase() === String(destCode).toLowerCase()) ||
               (l.roomId && String(l.roomId).toLowerCase() === String(destCode).toLowerCase()) ||
               (l.code && String(l.code).toLowerCase() === String(destCode).toLowerCase()) ||
               (l.name && l.name.toLowerCase().includes(String(destCode).toLowerCase())) ||
               (l.name && l.name.toLowerCase().replace(/[-_]/g, ' ').includes(codeStr)) ||
               (l.roomOnlyName && l.roomOnlyName.toLowerCase().includes(String(destCode).toLowerCase())) ||
               (codeStr.includes('audi') && (l.id === 'auditorium' || l.name?.toLowerCase().includes('auditorium') || l.id === 'vedhanayagam-auditorium')) ||
               (codeStr.includes('sport') && (l.id === 'sports-ground' || l.name?.toLowerCase().includes('sports') || l.id?.includes('ground'))) ||
               (codeStr.includes('as') && (l.id === 'as-block' || l.name?.toLowerCase().includes('as block') || l.id?.includes('academic'))) ||
               (codeStr.includes('gate') && (l.id === 'main-gate' || l.name?.toLowerCase().includes('gate'))) ||
               (codeStr.includes('sf') && l.id === 'sf-block-labs') ||
               (codeStr.includes('ib') && l.id === 'ib-block') ||
               (codeStr.includes('mech') && l.id === 'mechanical-block') ||
               (codeStr.includes('aero') && l.id === 'aero-block') ||
               (codeStr.includes('lib') && (l.id === 'library' || l.name?.toLowerCase().includes('learning'))) ||
               (codeStr.includes('medic') && (l.id === 'medical-centre' || l.name?.toLowerCase().includes('medical'))) ||
               (codeStr.includes('caf') && (l.id === 'canteen' || l.name?.toLowerCase().includes('cafeteria'))) ||
               (codeStr.includes('hostel') && (l.id?.includes('hostel') || l.name?.toLowerCase().includes('hostel')))
      );
      if (matched) {
        setDestBuilding(matched);
        const start = sourceBuilding || allLocs.find(l => l.id === 'main-gate') || allLocs[0];
        calculateRoute(start, matched, navMode);
      }
    }
  }, [route?.params]);

  const handleSelectStart = (node) => {
    const allLocs = getAllSelectableLocations();
    let resolved = node;
    if (typeof node === 'string' || (node && typeof node === 'object' && !node.category)) {
      const targetId = typeof node === 'string' ? node : (node.id || node.code);
      const targetStr = String(targetId || '').toLowerCase();
      resolved = allLocs.find(
        (l) => (l.id && String(l.id).toLowerCase() === targetStr) ||
               (l.code && String(l.code).toLowerCase() === targetStr) ||
               (l.name && l.name.toLowerCase().includes(targetStr))
      ) || node;
    }
    setSourceBuilding(resolved);
    if (destBuilding) {
      calculateRoute(resolved, destBuilding, navMode);
    }
  };

  const handleSelectDest = (node) => {
    const allLocs = getAllSelectableLocations();
    let resolved = node;
    if (typeof node === 'string' || (node && typeof node === 'object' && !node.category)) {
      const targetId = typeof node === 'string' ? node : (node.id || node.code);
      const targetStr = String(targetId || '').toLowerCase();
      resolved = allLocs.find(
        (l) => (l.id && String(l.id).toLowerCase() === targetStr) ||
               (l.code && String(l.code).toLowerCase() === targetStr) ||
               (l.name && l.name.toLowerCase().includes(targetStr))
      ) || node;
    }
    setDestBuilding(resolved);
    const start = sourceBuilding || allLocs.find(l => l.id === 'main-gate') || allLocs[0];
    calculateRoute(start, resolved, navMode);
  };

  const handleCalculateRoute = () => {
    const allLocs = getAllSelectableLocations();
    const start = sourceBuilding || allLocs[0];
    const dest = destBuilding || allLocs[1];
    calculateRoute(start, dest, navMode);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 1. TOP CAMPUS NAV HEADER */}
      <View style={styles.topNavBar}>
        {/* Far-Left: Back Button + Brand Logo */}
        <View style={styles.topLeftNav}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => {
              if (navigation?.canGoBack && navigation.canGoBack()) {
                navigation.goBack();
              } else {
                navigation?.navigate('MainTabs', { screen: 'Dashboard' });
              }
            }}
            activeOpacity={0.8}
            title="Back"
          >
            <ArrowLeft size={16} color={colors.text} strokeWidth={2.4} />
            <Text style={styles.backBtnText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.brandContainer}
            onPress={() => navigation?.navigate('MainTabs', { screen: 'Dashboard' })}
            activeOpacity={0.8}
          >
            <View style={styles.logoRow}>
              <View style={styles.brandBadge}>
                <Navigation size={14} color="#24201D" />
              </View>
              <View>
                <Text style={styles.brandTitle}>CampusNav</Text>
                <Text style={styles.brandSubtitle}>BIT Wayfinding</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Far-Right: Layer Switcher Segment + Home */}
        <View style={styles.topRightActions}>
          <View style={styles.layerSwitchContainer}>
            <TouchableOpacity
              style={[styles.layerOptionBtn, mapLayer === 'satellite' && styles.layerOptionBtnActive]}
              onPress={() => setMapLayer('satellite')}
              activeOpacity={0.8}
            >
              <Sun size={12} color={mapLayer === 'satellite' ? '#24201D' : colors.textMuted} />
              <Text style={[styles.layerOptionText, mapLayer === 'satellite' && styles.layerOptionTextActive]}>
                Satellite
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.layerOptionBtn, (mapLayer === 'streets' || mapLayer === 'svg') && styles.layerOptionBtnActive]}
              onPress={() => setMapLayer('streets')}
              activeOpacity={0.8}
            >
              <MapIcon size={12} color={(mapLayer === 'streets' || mapLayer === 'svg') ? '#24201D' : colors.textMuted} />
              <Text style={[styles.layerOptionText, (mapLayer === 'streets' || mapLayer === 'svg') && styles.layerOptionTextActive]}>
                Streets
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.homeLinkBtn}
            onPress={() => navigation?.navigate('MainTabs', { screen: 'Dashboard' })}
            activeOpacity={0.8}
            title="Back to Dashboard"
          >
            <Home size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. MAP AREA WITH FLOATING NAV PANEL */}
      <View style={styles.mapCanvasWrapper}>
        {/* Floating Navigation Search & Route Panel */}
        <FloatingNavPanel
          startNode={sourceBuilding}
          destNode={destBuilding}
          onSelectStart={handleSelectStart}
          onSelectDest={handleSelectDest}
          routeData={activeRoute}
          onCalculateRoute={handleCalculateRoute}
          onResetRoute={clearRoute}
          navMode={navMode}
          onToggleNavMode={(mode) => {
            setNavMode(mode);
            if (sourceBuilding && destBuilding) {
              calculateRoute(sourceBuilding, destBuilding, mode);
            }
          }}
        />

        {/* High-Contrast Interactive SVG & Satellite Map */}
        <InteractiveCampusMap
          selectedBuilding={destBuilding}
          onSelectBuilding={(b) => setDestBuilding(b)}
          onSelectStart={handleSelectStart}
          onSelectDest={handleSelectDest}
          routeData={activeRoute}
          mapLayer={mapLayer}
          onToggleLayer={() => setMapLayer(mapLayer === 'streets' ? 'satellite' : 'streets')}
          zoomAction={zoomAction}
          onZoomHandled={() => setZoomAction(null)}
        />

        {/* Bottom-Left Floating Toolbar */}
        <View style={styles.bottomLeftToolbar}>
          <TouchableOpacity 
            style={styles.dockIconBtn}
            onPress={() => setShowInfoModal(true)}
            activeOpacity={0.8}
            title="Campus Map Info"
          >
            <Info size={16} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.dockIconBtn}
            onPress={() => setZoomAction('center')}
            activeOpacity={0.8}
            title="Reset Orientation"
          >
            <Compass size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Bottom-Right Floating Toolbar */}
        <View style={styles.bottomRightToolbar}>
          <TouchableOpacity 
            style={styles.dockIconBtn}
            onPress={() => setZoomAction('center')}
            activeOpacity={0.8}
            title="Center Location"
          >
            <Crosshair size={16} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.dockIconBtn}
            onPress={() => setZoomAction('in')}
            activeOpacity={0.8}
            title="Zoom In"
          >
            <Plus size={16} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.dockIconBtn}
            onPress={() => setZoomAction('out')}
            activeOpacity={0.8}
            title="Zoom Out"
          >
            <Minus size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Campus Info Modal */}
      <Modal visible={showInfoModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.infoModalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Campus Nav Instructions</Text>
              <TouchableOpacity onPress={() => setShowInfoModal(false)}>
                <X size={18} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <Text style={styles.infoText}>• Use the floating search panel to search classrooms, labs, and buildings.</Text>
              <Text style={styles.infoText}>• Pick your starting point and destination with 1-tap swap.</Text>
              <Text style={styles.infoText}>• Click minimize icon on the search panel to view the full campus map.</Text>
              <Text style={styles.infoText}>• Switch between SVG Vector Streets and Satellite imagery using the top switch button.</Text>
            </View>
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setShowInfoModal(false)}>
              <Text style={styles.modalCloseBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background
  },
  
  /* Top Header */
  topNavBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.cardBg,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
    zIndex: 1000
  },
  topLeftNav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        boxShadow: '0 2px 6px -1px rgba(36, 32, 29, 0.06)'
      }
    })
  },
  backBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.text,
    fontFamily: 'Outfit'
  },
  brandContainer: {
    paddingRight: 10
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  brandBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.3,
    fontFamily: 'Sora'
  },
  brandSubtitle: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.2
  },
  topRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  layerSwitchContainer: {
    flexDirection: 'row',
    backgroundColor: colors.cardBgLight,
    borderRadius: 8,
    padding: 2,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    gap: 2
  },
  layerOptionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },
  layerOptionBtnActive: {
    backgroundColor: colors.cardBg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  layerOptionText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary
  },
  layerOptionTextActive: {
    color: colors.text,
    fontWeight: '800'
  },
  homeLinkBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.cardBgLight,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center'
  },

  /* Map Canvas Area */
  mapCanvasWrapper: {
    flex: 1,
    position: 'relative'
  },

  /* Bottom-Left Floating Toolbar */
  bottomLeftToolbar: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 4,
    gap: 6,
    zIndex: 900,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  bottomRightToolbar: {
    position: 'absolute',
    bottom: 24,
    right: 16,
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 4,
    gap: 6,
    zIndex: 900,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  dockIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: colors.cardBgLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.cardBorder
  },

  /* Modals */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(36, 32, 29, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  infoModalCard: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    fontFamily: 'Sora'
  },
  modalBody: {
    gap: 8,
    marginBottom: 16
  },
  infoText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18
  },
  modalCloseBtn: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center'
  },
  modalCloseBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#24201D'
  }
});
