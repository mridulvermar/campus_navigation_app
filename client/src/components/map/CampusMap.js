import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { Navigation, CalendarCheck, Layers, Sun, Map as MapIcon, Crosshair } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { MOCK_BUILDINGS } from '../../data/mockData';
import { useNavigation } from '../../context/NavigationContext';
import { useSocket } from '../../context/SocketContext';
import { GlassCard } from '../common/GlassCard';
import { Badge } from '../common/Badge';
import { MAP_SVG_DATA_URI } from '../../data/mapSvgData';
import { MAP_WEBP_DATA_URI } from '../../data/mapWebpData';
import geolocationsData from '../../data/geolocations_graph.json';
import { getAllSelectableLocations } from '../../services/mapEngine/locationService';

export const CampusMap = ({ selectedCategory, searchQuery, onSelectBuilding, navigation }) => {
  const { spatialLocation } = useSocket();
  const { activeRoute, calculateRoute, sourceBuilding, destBuilding, setSourceBuilding, setDestBuilding, navMode } = useNavigation();
  const [buildings, setBuildings] = useState(MOCK_BUILDINGS);
  const [selectedBuilding, setSelectedBuilding] = useState(MOCK_BUILDINGS[0]);
  const [mapMode, setMapMode] = useState('satellite'); // 'satellite' (WebP) or 'streets' (SVG blueprint)
  const webViewRef = useRef(null);

  const filteredBuildings = buildings.filter((b) => {
    const matchesCat = !selectedCategory || selectedCategory === 'All' || b.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      (b.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
      (b.code || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleStartNavigation = (dest) => {
    const allLocs = getAllSelectableLocations();
    const destCode = dest.code || dest.id || dest._id;
    const matched = allLocs.find(
      (l) => (l.id && String(l.id).toLowerCase() === String(destCode).toLowerCase()) ||
             (l.code && String(l.code).toLowerCase() === String(destCode).toLowerCase()) ||
             (l.name && l.name.toLowerCase().includes(String(dest.name || destCode).toLowerCase()))
    ) || dest;

    const start = allLocs.find(l => l.id === 'main-gate') || allLocs[0];
    setSourceBuilding(start);
    setDestBuilding(matched);
    calculateRoute(start, matched, navMode);

    if (navigation) {
      navigation.navigate('Navigation', { 
        destCode: matched.id || destCode,
        destination: matched.name || dest.name
      });
    }
  };

  const handleGoToBookings = (buildingCode) => {
    if (navigation) {
      navigation.navigate('MainTabs', { screen: 'Bookings', params: { building: buildingCode } });
    }
  };

  // Generate HTML for Leaflet Map Engine with Calibrated SVG Blueprint
  const generateMapHTML = () => {
    const isSatellite = mapMode === 'satellite';
    const tagsJson = JSON.stringify(geolocationsData.tags || []);
    const legendsJson = JSON.stringify(geolocationsData.legends || []);
    const geoBuildingsJson = JSON.stringify(geolocationsData.buildings || []);
    const crsRouteJson = JSON.stringify(activeRoute?.crsSimpleCoordinates || []);
    const mapSvgUriJson = JSON.stringify(MAP_SVG_DATA_URI);
    const mapWebpUriJson = JSON.stringify(MAP_WEBP_DATA_URI);
    const selectedId = selectedBuilding?.code || selectedBuilding?.id || selectedBuilding?._id || '';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          * { box-sizing: border-box; }
          body, html, #map {
            margin: 0; padding: 0; width: 100%; height: 100%;
            background: ${isSatellite ? '#0B111E' : '#070B14'};
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            overflow: hidden;
          }
          
          .leaflet-container {
            background-color: ${isSatellite ? '#0B111E' : '#070B14'} !important;
          }

          /* Optimized High-Clarity SVG Vector & Satellite Overlays */
          .campus-svg-overlay {
            border-radius: 4px;
            image-rendering: -webkit-optimize-contrast;
            image-rendering: crisp-edges;
            shape-rendering: geometricPrecision;
            box-shadow: 0 0 50px rgba(0, 0, 0, 0.7);
          }
          /* High-Clarity SVG Vector & Satellite Overlays */
          .campus-svg-overlay {
            border-radius: 4px;
            image-rendering: -webkit-optimize-contrast;
            image-rendering: crisp-edges;
            shape-rendering: geometricPrecision;
            box-shadow: 0 0 50px rgba(0, 0, 0, 0.7);
          }
          .campus-satellite-overlay {
            border-radius: 4px;
            filter: brightness(1.08) contrast(1.15) saturate(1.1);
            box-shadow: 0 0 50px rgba(0, 0, 0, 0.85);
          }

          /* Modern Unified Glassmorphic POI Pins */
          .campus-smart-pin {
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: pointer;
            transition: transform 0.18s cubic-bezier(0.34, 1.56, 0.64, 1);
            user-select: none;
          }
          .campus-smart-pin:hover {
            transform: scale(1.18) translateY(-4px);
            z-index: 9999 !important;
          }
          .campus-pin-bubble {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: rgba(15, 23, 42, 0.92);
            border: 2px solid #00a8ff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 15px;
            box-shadow: 0 4px 14px rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(8px);
          }
          .campus-pin-text {
            margin-top: 3px;
            font-size: 10px;
            font-weight: 700;
            color: #F8FAFC;
            background: rgba(11, 17, 30, 0.88);
            padding: 2px 6px;
            border-radius: 4px;
            border: 1px solid rgba(255, 255, 255, 0.15);
            white-space: nowrap;
            letter-spacing: 0.2px;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.6);
            pointer-events: none;
          }

          /* Interactive Leaflet Popup */
          .custom-campus-popup .leaflet-popup-content-wrapper {
            background: rgba(15, 23, 42, 0.98);
            color: #fff;
            border-radius: 14px;
            border: 1.5px solid #00a8ff;
            backdrop-filter: blur(14px);
            box-shadow: 0 14px 35px rgba(0, 0, 0, 0.85);
            padding: 4px;
          }
          .custom-campus-popup .leaflet-popup-tip {
            background: rgba(15, 23, 42, 0.98);
          }
          .popup-dest-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 6px;
          }
          .popup-badge {
            display: inline-block;
            font-size: 10px;
            font-weight: 800;
            padding: 2px 7px;
            border-radius: 5px;
            background: rgba(0, 168, 255, 0.15);
            color: #00a8ff;
            border: 1px solid rgba(0, 168, 255, 0.35);
            text-transform: uppercase;
          }
          .popup-status-pill {
            font-size: 9px;
            font-weight: 700;
            color: #10B981;
            background: rgba(16, 185, 129, 0.15);
            padding: 2px 6px;
            border-radius: 4px;
          }
          .popup-title {
            font-size: 14px;
            font-weight: 800;
            margin: 0 0 4px;
            color: #F8FAFC;
          }
          .popup-desc {
            font-size: 11px;
            color: #94A3B8;
            margin: 0 0 8px;
            line-height: 1.4;
          }
          .popup-actions {
            display: flex;
            gap: 6px;
          }
          .popup-btn {
            flex: 1;
            padding: 7px 10px;
            border-radius: 8px;
            border: none;
            cursor: pointer;
            font-size: 11px;
            font-weight: 800;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
          }
          .popup-btn-dest {
            background: #00a8ff;
            color: #070B14;
          }
          .popup-btn-start {
            background: rgba(16, 185, 129, 0.2);
            color: #10B981;
            border: 1px solid rgba(16, 185, 129, 0.4);
          }

          /* Path Animation */
          @keyframes dash {
            to { stroke-dashoffset: -40; }
          }
          .animated-dijkstra-path {
            animation: dash 1.4s linear infinite;
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          const MAP_WIDTH = 3420;
          const MAP_HEIGHT = 3876;
          const bounds = [[0, 0], [MAP_HEIGHT, MAP_WIDTH]];

          const map = L.map('map', {
            crs: L.CRS.Simple,
            minZoom: -2,
            maxZoom: 2,
            zoomSnap: 0.25,
            zoomDelta: 0.5,
            zoomControl: false,
            attributionControl: false,
            maxBounds: [[ -500, -500 ], [ MAP_HEIGHT + 500, MAP_WIDTH + 500 ]],
            maxBoundsViscosity: 0.8
          });

          const isSatellite = ${isSatellite};
          const embeddedSvgUri = ${mapSvgUriJson};
          const embeddedWebpUri = ${mapWebpUriJson};

          const mapImageURL = isSatellite ? embeddedWebpUri : embeddedSvgUri;
          const overlayClass = isSatellite ? 'campus-satellite-overlay' : 'campus-svg-overlay';

          L.imageOverlay(mapImageURL, bounds, {
            opacity: 1.0,
            interactive: true,
            className: overlayClass
          }).addTo(map);

          // Center on Campus Central Quadrangle
          map.setView([ MAP_HEIGHT - 1950, 1800 ], -0.6);

          const tags = ${tagsJson};
          const legends = ${legendsJson};
          const geoBuildings = ${geoBuildingsJson};

          // 1. Curate Clean POIs (Filter out repetitive architectural ribs like "IB rib 1-12", "AS rib 1-12")
          const cleanTags = tags.filter(t => {
            if (!t || !t.id || !t.name) return false;
            const s = (t.id + ' ' + t.name).toLowerCase();
            if (s.includes('rib')) return false; // Remove 24 internal ribs
            if (s.includes('empty playg')) return false;
            return true;
          });

          // Category icon and color mapping
          function getPoiInfo(id, name) {
            const s = (id + ' ' + name).toLowerCase();
            if (s.includes('lib') || s.includes('learning')) return { emoji: '📚', color: '#00a8ff', cat: 'Library' };
            if (s.includes('ai') || s.includes('sf-block') || s.includes('computer')) return { emoji: '💻', color: '#06b6d4', cat: 'Computing & AI' };
            if (s.includes('medic') || s.includes('hospital') || s.includes('clinic')) return { emoji: '🏥', color: '#ef4444', cat: 'Health Centre' };
            if (s.includes('canteen') || s.includes('cafeteria') || s.includes('mess') || s.includes('food')) return { emoji: '🍽️', color: '#f59e0b', cat: 'Dining' };
            if (s.includes('hostel')) return { emoji: s.includes('girl') ? '🏡' : '🏠', color: '#8b5cf6', cat: 'Hostel' };
            if (s.includes('sports') || s.includes('gym') || s.includes('court') || s.includes('cricket') || s.includes('football')) return { emoji: '⚽', color: '#10b981', cat: 'Sports' };
            if (s.includes('audi') || s.includes('vedha')) return { emoji: '🎭', color: '#ec4899', cat: 'Auditorium' };
            if (s.includes('park')) return { emoji: '🅿️', color: '#6366f1', cat: 'Parking' };
            if (s.includes('gate')) return { emoji: '🚪', color: '#14b8a6', cat: 'Campus Gate' };
            if (s.includes('mech')) return { emoji: '⚙️', color: '#f97316', cat: 'Mechanical' };
            if (s.includes('aero')) return { emoji: '✈️', color: '#0ea5e9', cat: 'Aeronautical' };
            if (s.includes('ib-block') || s.includes('institution')) return { emoji: '🏢', color: '#3b82f6', cat: 'Academic Block' };
            if (s.includes('as-') || s.includes('special labs')) return { emoji: '🔬', color: '#a855f7', cat: 'Science & Labs' };
            if (s.includes('placement') || s.includes('training')) return { emoji: '💼', color: '#10b981', cat: 'Placement' };
            if (s.includes('atm')) return { emoji: '🏧', color: '#eab308', cat: 'ATM' };
            if (s.includes('guest')) return { emoji: '🏨', color: '#06b6d4', cat: 'Guest House' };
            return { emoji: '📍', color: '#00a8ff', cat: 'Campus Landmark' };
          }

          // Proximity deduplication so icons close to each other don't stack up
          const displayedPois = [];
          cleanTags.forEach(t => {
            const topPx = parseFloat(t.top);
            const leftPx = parseFloat(t.left);
            const y = MAP_HEIGHT - topPx;
            const x = leftPx;

            const tooClose = displayedPois.some(p => {
              const dx = p.x - x;
              const dy = p.y - y;
              return Math.sqrt(dx*dx + dy*dy) < 42;
            });

            if (!tooClose) {
              displayedPois.push({ ...t, x, y });
            }
          });

          // Render Clean Unified Campus POI Pins
          const poisLayerGroup = L.layerGroup().addTo(map);

          displayedPois.forEach(poi => {
            const info = getPoiInfo(poi.id, poi.name);
            const b = geoBuildings.find(item => item.id === poi.id);
            const safeName = (b?.name || poi.name).replace(/'/g, "\\'");

            const pinHtml = 
              '<div class="campus-smart-pin">' +
                '<div class="campus-pin-bubble" style="border-color:' + info.color + '; box-shadow:0 3px 12px ' + info.color + '66;">' +
                  '<span>' + info.emoji + '</span>' +
                '</div>' +
                '<span class="campus-pin-text">' + (poi.name.length > 20 ? poi.name.slice(0, 18) + '..' : poi.name) + '</span>' +
              '</div>';

            const pinIcon = L.divIcon({
              html: pinHtml,
              className: '',
              iconAnchor: [24, 38],
              popupAnchor: [0, -36]
            });

            const marker = L.marker([poi.y, poi.x], { icon: pinIcon }).addTo(poisLayerGroup);

            // Directly attach click handler to marker for 100% reliable destination setting without quote syntax issues
            marker.on('click', function() {
              handlePinClick(poi.id, safeName);
            });

            const popupContent = 
              '<div style="min-width: 220px; max-width: 260px;">' +
                '<div class="popup-dest-header">' +
                  '<span class="popup-badge" style="border-color:' + info.color + '; color:' + info.color + ';">' + info.cat + '</span>' +
                  '<span class="popup-status-pill">🎯 SET AS DESTINATION</span>' +
                '</div>' +
                '<h4 class="popup-title">' + (b ? b.name : poi.name) + '</h4>' +
                '<p class="popup-desc">' + (b && b.about ? b.about : 'Calibrated campus location on spatial navigation grid.') + '</p>' +
                '<div class="popup-actions">' +
                  '<button class="popup-btn popup-btn-dest" onclick="sendAction(&quot;SELECT_DEST&quot;, {id:&quot;' + poi.id + '&quot;, name:&quot;' + safeName + '&quot;})">🚀 Route Here</button>' +
                  '<button class="popup-btn popup-btn-start" onclick="sendAction(&quot;SELECT_START&quot;, {id:&quot;' + poi.id + '&quot;, name:&quot;' + safeName + '&quot;})">🟢 Set Start</button>' +
                '</div>' +
              '</div>';

            marker.bindPopup(popupContent, { className: 'custom-campus-popup' });
          });

          // Render active Dijkstra route line if present
          const crsRoute = ${crsRouteJson};
          if (crsRoute && crsRoute.length > 1) {
            L.polyline(crsRoute, {
              color: 'rgba(0, 168, 255, 0.45)',
              weight: 14,
              lineCap: 'round',
              lineJoin: 'round'
            }).addTo(map);

            const polyline = L.polyline(crsRoute, {
              color: '#00a8ff',
              weight: 6,
              opacity: 1.0,
              lineCap: 'round',
              lineJoin: 'round',
              dashArray: '10, 8',
              className: 'animated-dijkstra-path'
            }).addTo(map);

            const startIcon = L.divIcon({
              html: '<div style="background:#10B981; color:#070B14; border-radius:50%; width:28px; height:28px; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:14px; border:2.5px solid #fff; box-shadow:0 0 16px #10B981;">🟢</div>',
              iconSize: [28, 28],
              iconAnchor: [14, 14]
            });

            const endIcon = L.divIcon({
              html: '<div style="background:#00a8ff; color:#fff; border-radius:50%; width:30px; height:30px; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:14px; border:2.5px solid #fff; box-shadow:0 0 18px #00a8ff;">📍</div>',
              iconSize: [30, 30],
              iconAnchor: [15, 15]
            });

            L.marker(crsRoute[0], { icon: startIcon }).addTo(map);
            L.marker(crsRoute[crsRoute.length - 1], { icon: endIcon }).addTo(map);

            map.fitBounds(polyline.getBounds(), { padding: [80, 80], maxZoom: 0.5 });
          }

          // Message Dispatcher to React Native & Web
          window.sendAction = function(type, payload) {
            const data = { type, id: payload?.id || payload, name: payload?.name };
            if (window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage(JSON.stringify(data));
            } else if (window.parent) {
              window.parent.postMessage(JSON.stringify(data), '*');
            }
          };

          // Tapping ANY pin on the map immediately sets it as destination!
          window.handlePinClick = function(id, name) {
            sendAction('SELECT_DEST', { id: id, name: name });
          };

          window.selectPlace = function(id) {
            sendAction('SELECT_DEST', id);
          };

          window.navigateToPlace = function(id, name) {
            sendAction('START_NAV', { id: id, name: name });
          };
        </script>
      </body>
      </html>
    `;
  };

  const handleSelectDestPin = (destNode) => {
    const allLocs = getAllSelectableLocations();
    const destId = typeof destNode === 'string' ? destNode : (destNode?.id || destNode?.code);
    const targetStr = String(destId || '').toLowerCase();
    const matched = allLocs.find(
      (l) => (l.id && String(l.id).toLowerCase() === targetStr) ||
             (l.code && String(l.code).toLowerCase() === targetStr) ||
             (l.name && l.name.toLowerCase().includes(targetStr))
    ) || destNode;

    const start = sourceBuilding || allLocs.find(l => l.id === 'main-gate') || allLocs[0];
    setSourceBuilding(start);
    setDestBuilding(matched);
    setSelectedBuilding(matched);
    calculateRoute(start, matched, navMode);
    if (onSelectBuilding) onSelectBuilding(matched);
  };

  const handleMessage = (event) => {
    try {
      const data = typeof event.nativeEvent?.data === 'string' 
        ? JSON.parse(event.nativeEvent.data) 
        : event.nativeEvent?.data;
      if (data.type === 'SELECT_DEST' || data.type === 'SELECT_PLACE') {
        handleSelectDestPin(data);
      } else if (data.type === 'START_NAV') {
        handleStartNavigation({ id: data.id, code: data.id, name: data.name });
      } else if (data.type === 'SELECT_START') {
        const allLocs = getAllSelectableLocations();
        const startMatched = allLocs.find(l => l.id === data.id || l.code === data.id) || data;
        setSourceBuilding(startMatched);
        if (destBuilding) {
          calculateRoute(startMatched, destBuilding, navMode);
        }
      }
    } catch (e) {}
  };

  // Web iframe message listener so pin click sets destination immediately on Web
  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const handleWebMsg = (event) => {
        try {
          const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
          if (data && (data.type === 'SELECT_DEST' || data.type === 'SELECT_PLACE')) {
            handleSelectDestPin(data);
          } else if (data && data.type === 'START_NAV') {
            handleStartNavigation({ id: data.id, code: data.id, name: data.name });
          } else if (data && data.type === 'SELECT_START') {
            const allLocs = getAllSelectableLocations();
            const startMatched = allLocs.find(l => l.id === data.id || l.code === data.id) || data;
            setSourceBuilding(startMatched);
            if (destBuilding) {
              calculateRoute(startMatched, destBuilding, navMode);
            }
          }
        } catch (e) {}
      };
      window.addEventListener('message', handleWebMsg);
      return () => window.removeEventListener('message', handleWebMsg);
    }
  }, [sourceBuilding, destBuilding, navMode]);

  return (
    <View style={styles.container}>
      {/* Map Mode Switcher (Satellite vs SVG Vector) */}
      <View style={styles.modeToggleContainer}>
        <TouchableOpacity
          style={[styles.modeBtn, mapMode === 'satellite' && styles.modeBtnActive]}
          onPress={() => setMapMode('satellite')}
        >
          <Text style={[styles.modeBtnText, mapMode === 'satellite' && styles.modeBtnTextActive]}>
            🛰️ Satellite
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.modeBtn, mapMode === 'streets' && styles.modeBtnActive]}
          onPress={() => setMapMode('streets')}
        >
          <Text style={[styles.modeBtnText, mapMode === 'streets' && styles.modeBtnTextActive]}>
            🗺️ SVG Vector
          </Text>
        </TouchableOpacity>
      </View>

      {/* Crosshair shortcut to Navigation Screen */}
      <TouchableOpacity
        style={styles.fullNavFab}
        onPress={() => navigation?.navigate('Navigation')}
        title="Open Full Navigation"
      >
        <Navigation size={16} color="#070B14" />
        <Text style={styles.fullNavFabText}>Route Engine</Text>
      </TouchableOpacity>

      {/* Render Leaflet Container */}
      {Platform.OS === 'web' ? (
        <iframe
          ref={webViewRef}
          srcDoc={generateMapHTML()}
          style={{ width: '100%', height: '100%', border: 'none', borderRadius: 24 }}
          title="Campus SVG Map"
        />
      ) : (
        <WebView
          ref={webViewRef}
          originWhitelist={['*']}
          source={{ html: generateMapHTML() }}
          style={styles.mapView}
          onMessage={handleMessage}
          javaScriptEnabled={true}
          domStorageEnabled={true}
        />
      )}

      {/* Selected Building Detail Floating Card */}
      {selectedBuilding && (
        <View style={styles.overlayCardWrapper}>
          <GlassCard style={styles.overlayCard} glow>
            <View style={styles.cardHeader}>
              <View style={styles.titleArea}>
                <Text style={styles.categoryTag}>{selectedBuilding.category || 'Campus'} Facility</Text>
                <Text style={styles.buildingName} numberOfLines={1}>{selectedBuilding.name}</Text>
              </View>
              {selectedBuilding.code && <Badge variant="success" size="sm">{selectedBuilding.code}</Badge>}
            </View>

            <View style={styles.actionButtonsRow}>
              <TouchableOpacity
                style={styles.navBtn}
                onPress={() => handleStartNavigation(selectedBuilding)}
              >
                <Navigation size={14} color="#070B14" />
                <Text style={styles.navBtnText}>Launch Navigation ↗</Text>
              </TouchableOpacity>

              {selectedBuilding.code && (
                <TouchableOpacity
                  style={styles.bookBtn}
                  onPress={() => handleGoToBookings(selectedBuilding.code)}
                >
                  <CalendarCheck size={14} color={colors.white} />
                  <Text style={styles.bookBtnText}>Book Rooms</Text>
                </TouchableOpacity>
              )}
            </View>
          </GlassCard>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    minHeight: 480,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.6)',
    position: 'relative',
    backgroundColor: '#070B14'
  },
  mapView: {
    flex: 1,
    backgroundColor: '#070B14'
  },
  modeToggleContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 999,
    flexDirection: 'row',
    backgroundColor: 'rgba(15, 23, 42, 0.94)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.4)',
    padding: 4,
    gap: 4
  },
  modeBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8
  },
  modeBtnActive: {
    backgroundColor: colors.primary
  },
  modeBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary
  },
  modeBtnTextActive: {
    color: '#070B14',
    fontWeight: '800'
  },
  fullNavFab: {
    position: 'absolute',
    top: 12,
    left: 12,
    zIndex: 999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#22d3ee'
  },
  fullNavFabText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#070B14'
  },
  overlayCardWrapper: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    zIndex: 999
  },
  overlayCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    padding: 14
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8
  },
  titleArea: {
    flex: 1,
    marginRight: 8
  },
  categoryTag: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.8,
    textTransform: 'uppercase'
  },
  buildingName: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
    marginTop: 2
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4
  },
  navBtn: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6
  },
  navBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#070B14'
  },
  bookBtn: {
    flex: 1,
    backgroundColor: colors.secondary,
    borderRadius: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6
  },
  bookBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.white
  }
});
