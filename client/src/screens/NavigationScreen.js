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
  Map as MapIcon 
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

  const [mapLayer, setMapLayer] = useState('streets'); // 'streets' (SVG) | 'satellite'
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
    const destCode = route?.params?.destCode;
    if (destCode) {
      const allLocs = getAllSelectableLocations();
      const matched = allLocs.find(
        (l) => (l.id && String(l.id).toLowerCase() === String(destCode).toLowerCase()) ||
               (l.roomId && String(l.roomId).toLowerCase() === String(destCode).toLowerCase()) ||
               (l.code && String(l.code).toLowerCase() === String(destCode).toLowerCase())
      );
      if (matched) {
        setDestBuilding(matched);
        const start = sourceBuilding || allLocs[0];
        calculateRoute(start, matched, navMode);
      }
    }
  }, [route?.params]);

  const handleSelectStart = (node) => {
    setSourceBuilding(node);
    if (destBuilding) {
      calculateRoute(node, destBuilding, navMode);
    }
  };

  const handleSelectDest = (node) => {
    setDestBuilding(node);
    if (sourceBuilding) {
      calculateRoute(sourceBuilding, node, navMode);
    }
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
        {/* Far-Left: Brand Logo */}
        <TouchableOpacity 
          style={styles.brandContainer}
          onPress={() => navigation?.navigate('MainTabs', { screen: 'Dashboard' })}
          activeOpacity={0.8}
        >
          <View style={styles.logoRow}>
            <View style={styles.brandBadge}>
              <Navigation size={15} color="#00a8ff" />
            </View>
            <View>
              <Text style={styles.brandTitle}>CAMPUS <Text style={{ color: '#00a8ff' }}>NAV</Text></Text>
              <Text style={styles.brandSubtitle}>Spatial Map & Routing</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Far-Right: Layer Switcher Segment + Home */}
        <View style={styles.topRightActions}>
          <View style={styles.layerSwitchContainer}>
            <TouchableOpacity
              style={[styles.layerOptionBtn, (mapLayer === 'streets' || mapLayer === 'svg') && styles.layerOptionBtnActive]}
              onPress={() => setMapLayer('streets')}
              activeOpacity={0.8}
            >
              <MapIcon size={12} color={(mapLayer === 'streets' || mapLayer === 'svg') ? '#070B14' : '#00a8ff'} />
              <Text style={[styles.layerOptionText, (mapLayer === 'streets' || mapLayer === 'svg') && styles.layerOptionTextActive]}>
                🗺️ Streets
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.layerOptionBtn, mapLayer === 'satellite' && styles.layerOptionBtnActive]}
              onPress={() => setMapLayer('satellite')}
              activeOpacity={0.8}
            >
              <Sun size={12} color={mapLayer === 'satellite' ? '#070B14' : '#00a8ff'} />
              <Text style={[styles.layerOptionText, mapLayer === 'satellite' && styles.layerOptionTextActive]}>
                🛰️ Satellite
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.homeLinkBtn}
            onPress={() => navigation?.navigate('MainTabs', { screen: 'Dashboard' })}
            activeOpacity={0.8}
            title="Back to Dashboard"
          >
            <Home size={16} color="#94A3B8" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. MAP AREA WITH FLOATING NAV PANEL */}
      <View style={styles.mapCanvasWrapper}>
        {/* Floating Navigation Search & Route Panel (Original Version with Category Filters) */}
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
            <Info size={16} color="#00a8ff" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.dockIconBtn}
            onPress={() => setZoomAction('center')}
            activeOpacity={0.8}
            title="Reset Orientation"
          >
            <Compass size={16} color="#00a8ff" />
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
            <Crosshair size={16} color="#00a8ff" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.dockIconBtn}
            onPress={() => setZoomAction('in')}
            activeOpacity={0.8}
            title="Zoom In"
          >
            <Plus size={16} color="#00a8ff" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.dockIconBtn}
            onPress={() => setZoomAction('out')}
            activeOpacity={0.8}
            title="Zoom Out"
          >
            <Minus size={16} color="#00a8ff" />
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
                <X size={18} color="#94A3B8" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <Text style={styles.infoText}>• Use the floating search panel to search classrooms, labs, and buildings.</Text>
              <Text style={styles.infoText}>• Pick your starting point and destination with 1-tap swap (🔄).</Text>
              <Text style={styles.infoText}>• Click "Hide ⌃" on the search panel to view the full campus map.</Text>
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
    backgroundColor: '#070B14'
  },
  
  /* Top Header */
  topNavBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.96)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(51, 65, 85, 0.4)',
    zIndex: 1000
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
    backgroundColor: 'rgba(0, 168, 255, 0.15)',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 168, 255, 0.4)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#F8FAFC',
    letterSpacing: -0.3
  },
  brandSubtitle: {
    fontSize: 9,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.2
  },
  topRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  layerSwitchContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(2, 6, 23, 0.9)',
    borderRadius: 8,
    padding: 2,
    borderWidth: 1,
    borderColor: 'rgba(0, 168, 255, 0.35)',
    gap: 2
  },
  layerOptionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6
  },
  layerOptionBtnActive: {
    backgroundColor: '#00a8ff'
  },
  layerOptionText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#00a8ff'
  },
  layerOptionTextActive: {
    color: '#070B14',
    fontWeight: '800'
  },
  homeLinkBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
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
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.6)',
    padding: 4,
    gap: 6,
    zIndex: 900
  },
  bottomRightToolbar: {
    position: 'absolute',
    bottom: 24,
    right: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.6)',
    padding: 4,
    gap: 6,
    zIndex: 900
  },
  dockIconBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: 'rgba(2, 6, 23, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 168, 255, 0.2)'
  },

  /* Modals */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  infoModalCard: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: '#0F172A',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#00a8ff',
    padding: 16
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#F8FAFC'
  },
  modalBody: {
    gap: 8,
    marginBottom: 16
  },
  infoText: {
    fontSize: 12,
    color: '#CBD5E1',
    lineHeight: 18
  },
  modalCloseBtn: {
    backgroundColor: '#00a8ff',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center'
  },
  modalCloseBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#070B14'
  }
});
