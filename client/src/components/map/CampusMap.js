import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { Navigation, CalendarCheck, Layers, Crosshair } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { MOCK_BUILDINGS } from '../../data/mockData';
import { useNavigation } from '../../context/NavigationContext';
import { useSocket } from '../../context/SocketContext';
import { GlassCard } from '../common/GlassCard';
import { Badge } from '../common/Badge';

export const CampusMap = ({ selectedCategory, searchQuery, onSelectBuilding, navigation }) => {
  const { spatialLocation } = useSocket();
  const { activeRoute, calculateRoute, setSourceBuilding, setDestBuilding } = useNavigation();
  const [buildings, setBuildings] = useState(MOCK_BUILDINGS);
  const [selectedBuilding, setSelectedBuilding] = useState(MOCK_BUILDINGS[0]);
  const [mapMode, setMapMode] = useState('satellite'); // 'satellite' or 'streets'
  const webViewRef = useRef(null);

  const filteredBuildings = buildings.filter((b) => {
    const matchesCat = !selectedCategory || selectedCategory === 'All' || b.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      (b.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
      (b.code || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleStartNavigation = (dest) => {
    setSourceBuilding(buildings[0]);
    setDestBuilding(dest);
    calculateRoute(buildings[0], dest);
    if (navigation) {
      navigation.navigate('Navigation', { destCode: dest.code || dest._id });
    }
  };

  const handleGoToBookings = (buildingCode) => {
    if (navigation) {
      navigation.navigate('Bookings', { building: buildingCode });
    }
  };

  // Generate HTML for Leaflet Map Engine
  const generateMapHTML = () => {
    const routeCoordsJson = JSON.stringify(activeRoute?.coordinates || []);
    const buildingsJson = JSON.stringify(filteredBuildings);
    const userGpsJson = JSON.stringify(spatialLocation || { latitude: 11.4960, longitude: 77.2765 });
    const selectedId = selectedBuilding?._id || '';

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          body, html, #map { margin: 0; padding: 0; width: 100%; height: 100%; background: #070B14; }
          .custom-leaflet-marker { display: flex; align-items: center; justify-content: center; }
          .user-pulse-marker {
            width: 18px;
            height: 18px;
            background: #06B6D4;
            border: 2px solid #FFFFFF;
            border-radius: 50%;
            box-shadow: 0 0 16px #06B6D4;
            animation: pulseGps 1.8s infinite;
          }
          @keyframes pulseGps {
            0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(6, 182, 212, 0.7); }
            70% { transform: scale(1.15); box-shadow: 0 0 0 12px rgba(6, 182, 212, 0); }
            100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(6, 182, 212, 0); }
          }
          .custom-popup .leaflet-popup-content-wrapper {
            background: rgba(15, 23, 42, 0.95);
            color: #fff;
            border-radius: 14px;
            border: 1px solid rgba(6, 182, 212, 0.4);
            backdrop-filter: blur(8px);
          }
          .custom-popup .leaflet-popup-tip { background: rgba(15, 23, 42, 0.95); }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          const map = L.map('map', {
            center: [11.4960, 77.2765],
            zoom: 16.5,
            zoomControl: false
          });

          const satelliteLayer = L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', { maxZoom: 20 });
          const streetsLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', { maxZoom: 20 });

          if ('${mapMode}' === 'satellite') {
            satelliteLayer.addTo(map);
          } else {
            streetsLayer.addTo(map);
          }

          // User Pulse GPS
          const userGps = ${userGpsJson};
          const userIcon = L.divIcon({
            html: '<div class="user-pulse-marker"></div>',
            className: '',
            iconSize: [20, 20],
            iconAnchor: [10, 10]
          });
          L.marker([userGps.latitude, userGps.longitude], { icon: userIcon }).addTo(map);

          // Buildings
          const buildings = ${buildingsJson};
          const categoryColors = {
            Research: '#06B6D4',
            Library: '#10B981',
            Academic: '#6366F1',
            Dining: '#F59E0B',
            Auditorium: '#EC4899',
            Sports: '#8B5CF6'
          };

          buildings.forEach(b => {
            const isSel = b._id === '${selectedId}';
            const color = categoryColors[b.category] || '#06B6D4';
            const size = isSel ? 40 : 32;
            const svg = \`
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="\${size}" height="\${size}">
                <circle cx="12" cy="12" r="10" fill="\${color}" stroke="#ffffff" stroke-width="2"/>
                <path d="M12 6L4 12v8h16v-8l-8-6z" fill="#ffffff" opacity="0.9"/>
              </svg>
            \`;
            const icon = L.divIcon({
              html: svg,
              className: 'custom-leaflet-marker',
              iconSize: [size, size],
              iconAnchor: [size/2, size/2]
            });
            const marker = L.marker([b.latitude, b.longitude], { icon }).addTo(map);
            marker.on('click', () => {
              window.ReactNativeWebView ? window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'SELECT_BUILDING', building: b })) : null;
            });
          });

          // Polyline
          const routeCoords = ${routeCoordsJson};
          if (routeCoords && routeCoords.length > 0) {
            L.polyline(routeCoords, {
              color: '#06B6D4',
              weight: 6,
              opacity: 0.9,
              dashArray: '10, 10'
            }).addTo(map);

            // Start & End markers
            L.circleMarker(routeCoords[0], { radius: 7, fillColor: '#10B981', color: '#fff', weight: 2, fillOpacity: 1 }).addTo(map);
            L.circleMarker(routeCoords[routeCoords.length - 1], { radius: 7, fillColor: '#EF4444', color: '#fff', weight: 2, fillOpacity: 1 }).addTo(map);
          }
        </script>
      </body>
      </html>
    `;
  };

  const handleMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'SELECT_BUILDING') {
        setSelectedBuilding(data.building);
        if (onSelectBuilding) onSelectBuilding(data.building);
      }
    } catch (e) {}
  };

  return (
    <View style={styles.container}>
      {/* Map Mode Switcher */}
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
            🗺️ Streets
          </Text>
        </TouchableOpacity>
      </View>

      {/* Cross-platform Leaflet Map Engine */}
      {Platform.OS === 'web' ? (
        <iframe
          srcDoc={generateMapHTML()}
          style={{ width: '100%', height: '100%', border: 'none', borderRadius: 24 }}
          title="Campus Map"
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
                <Text style={styles.categoryTag}>{selectedBuilding.category} Facility</Text>
                <Text style={styles.buildingName} numberOfLines={1}>{selectedBuilding.name}</Text>
              </View>
              <Badge variant="success" size="sm">{selectedBuilding.code}</Badge>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoText}>🕒 {selectedBuilding.openingHours}</Text>
              <Text style={styles.infoText}>👥 Occupancy: 78%</Text>
            </View>

            <View style={styles.actionButtonsRow}>
              <TouchableOpacity
                style={styles.navBtn}
                onPress={() => handleStartNavigation(selectedBuilding)}
              >
                <Navigation size={14} color="#070B14" />
                <Text style={styles.navBtnText}>Start Route</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.bookBtn}
                onPress={() => handleGoToBookings(selectedBuilding.code)}
              >
                <CalendarCheck size={14} color={colors.white} />
                <Text style={styles.bookBtnText}>Book Rooms</Text>
              </TouchableOpacity>
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
    height: 480,
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
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.6)',
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
    alignItems: 'flex-start'
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
  infoRow: {
    flexDirection: 'row',
    gap: 16,
    marginVertical: 8
  },
  infoText: {
    fontSize: 11,
    color: colors.textSecondary
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
