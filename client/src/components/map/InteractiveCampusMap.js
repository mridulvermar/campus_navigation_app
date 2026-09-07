import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import geolocationsData from '../../data/geolocations_graph.json';
import campusGraphData from '../../data/campus_graph.json';
import { MAP_SVG_DATA_URI } from '../../data/mapSvgData';
import { MAP_WEBP_DATA_URI } from '../../data/mapWebpData';
import { colors } from '../../theme/colors';

export const InteractiveCampusMap = ({
  selectedBuilding,
  onSelectBuilding,
  routeData,
  mapLayer = 'satellite', // 'satellite' | 'streets'
  onToggleLayer,
  onSelectStart,
  onSelectDest,
  zoomAction,
  onZoomHandled
}) => {
  const webViewRef = useRef(null);

  const generateMapHTML = () => {
    const junctionsJson = JSON.stringify(geolocationsData.pedestrianJunctions || []);
    const tagsJson = JSON.stringify(geolocationsData.tags || []);
    const legendsJson = JSON.stringify(geolocationsData.legends || []);
    const buildingsJson = JSON.stringify(geolocationsData.buildings || []);
    const crsRouteJson = JSON.stringify(routeData?.crsSimpleCoordinates || []);
    const mapSvgUriJson = JSON.stringify(MAP_SVG_DATA_URI);
    const mapWebpUriJson = JSON.stringify(MAP_WEBP_DATA_URI);
    const isSatellite = mapLayer === 'satellite';

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
            background: ${isSatellite ? '#0B111E' : '#1A2333'};
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            overflow: hidden;
          }
          
          /* Custom High-Contrast Map Canvas */
          .leaflet-container {
            background-color: ${isSatellite ? '#0B111E' : '#1A2333'} !important;
          }

          /* Map Overlays */
          .campus-svg-overlay {
            border-radius: 4px;
            box-shadow: 0 0 40px rgba(0, 0, 0, 0.6);
          }
          .campus-satellite-overlay {
            border-radius: 4px;
            filter: brightness(1.06) contrast(1.1) saturate(1.05);
            box-shadow: 0 0 40px rgba(0, 0, 0, 0.8);
          }

          /* Modern Sleek Campus Pin Styling */
          .campus-smart-pin {
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: pointer;
            transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
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
            background: rgba(11, 17, 30, 0.94);
            border: 2px solid #00a8ff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 15px;
            box-shadow: 0 4px 14px rgba(0, 0, 0, 0.8);
            transition: all 0.2s ease;
          }
          .campus-pin-text {
            margin-top: 3px;
            background: rgba(7, 11, 20, 0.92);
            backdrop-filter: blur(6px);
            color: #F8FAFC;
            font-size: 10px;
            font-weight: 700;
            padding: 2px 7px;
            border-radius: 6px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            white-space: nowrap;
            text-align: center;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.7);
            letter-spacing: 0.2px;
            pointer-events: none;
          }

          /* Interactive Popup Styling */
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
            font-size: 9px;
            font-weight: 800;
            padding: 2px 6px;
            border-radius: 5px;
            background: rgba(0, 168, 255, 0.18);
            color: #00a8ff;
            border: 1px solid rgba(0, 168, 255, 0.4);
            text-transform: uppercase;
          }
          .popup-status-pill {
            font-size: 8.5px;
            font-weight: 800;
            color: #10B981;
            background: rgba(16, 185, 129, 0.15);
            padding: 2px 6px;
            border-radius: 4px;
            border: 1px solid rgba(16, 185, 129, 0.4);
            letter-spacing: 0.4px;
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
          }
          .popup-floors {
            max-height: 110px;
            overflow-y: auto;
            margin-bottom: 10px;
            padding: 0;
            list-style: none;
          }
          .popup-floor-item {
            font-size: 11px;
            padding: 4px 6px;
            border-radius: 6px;
            background: rgba(30, 41, 59, 0.8);
            margin-bottom: 4px;
            border-left: 2px solid #00a8ff;
            color: #E2E8F0;
          }
          .popup-rooms-sub {
            font-size: 10px;
            color: #94A3B8;
            margin-top: 2px;
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
            to {
              stroke-dashoffset: -40;
            }
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

          // Initial Center View (Central Quad / Campus Center)
          map.setView([ MAP_HEIGHT - 1950, 1800 ], -0.5);

          const tags = ${tagsJson};
          const legends = ${legendsJson};
          const buildings = ${buildingsJson};

          // 1. Curate Clean POIs (Filter out all repetitive micro-ribs like "IB rib 1-12", "AS rib 1-12")
          const cleanTags = tags.filter(t => {
            if (!t || !t.id || !t.name) return false;
            const s = (t.id + ' ' + t.name).toLowerCase();
            if (s.includes('rib')) return false; // Filter out 24 internal architectural ribs!
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
            const b = buildings.find(item => item.id === poi.id);
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

            let floorsHtml = '';
            if (b && b.floors) {
              floorsHtml = '<ul class="popup-floors">' + b.floors.map(f => 
                '<li class="popup-floor-item"><strong>' + f.name + '</strong>' + 
                (f.rooms ? '<div class="popup-rooms-sub">' + f.rooms.slice(0, 3).join(', ') + (f.rooms.length > 3 ? ' +' + (f.rooms.length - 3) + ' more' : '') + '</div>' : '') + 
                '</li>'
              ).join('') + '</ul>';
            }

            const popupContent = 
              '<div style="min-width: 220px; max-width: 260px;">' +
                '<div class="popup-dest-header">' +
                  '<span class="popup-badge" style="border-color:' + info.color + '; color:' + info.color + ';">' + info.cat + '</span>' +
                  '<span class="popup-status-pill">🎯 SET AS DESTINATION</span>' +
                '</div>' +
                '<h4 class="popup-title">' + (b ? b.name : poi.name) + '</h4>' +
                '<p class="popup-desc">' + (b && b.about ? b.about : 'Campus location on spatial navigation grid.') + '</p>' +
                floorsHtml +
                '<div class="popup-actions">' +
                  '<button class="popup-btn popup-btn-dest" onclick="sendAction(&quot;SELECT_DEST&quot;, {id:&quot;' + poi.id + '&quot;, name:&quot;' + safeName + '&quot;})">🚀 Route Here</button>' +
                  '<button class="popup-btn popup-btn-start" onclick="sendAction(&quot;SELECT_START&quot;, {id:&quot;' + poi.id + '&quot;, name:&quot;' + safeName + '&quot;})">🟢 Set Start</button>' +
                '</div>' +
              '</div>';

            marker.bindPopup(popupContent, { className: 'custom-campus-popup' });
          });

          // Route Polyline Rendering (L.CRS.Simple Space: [3876 - top, left])
          const crsRouteCoords = ${crsRouteJson};
          if (crsRouteCoords && crsRouteCoords.length > 0) {
            // Glowing cyan shadow polyline
            L.polyline(crsRouteCoords, {
              color: 'rgba(0, 168, 255, 0.45)',
              weight: 14,
              lineCap: 'round',
              lineJoin: 'round'
            }).addTo(map);

            // Active bright electric cyan polyline with dashed animation
            const polyline = L.polyline(crsRouteCoords, {
              color: '#00a8ff',
              weight: 6,
              opacity: 1.0,
              lineCap: 'round',
              lineJoin: 'round',
              dashArray: '10, 8',
              className: 'animated-dijkstra-path'
            }).addTo(map);

            const startPos = crsRouteCoords[0];
            const endPos = crsRouteCoords[crsRouteCoords.length - 1];

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

            L.marker(startPos, { icon: startIcon }).addTo(map);
            L.marker(endPos, { icon: endIcon }).addTo(map);

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

          // External Map Controller Functions
          window.zoomInMap = () => map.zoomIn();
          window.zoomOutMap = () => map.zoomOut();
          window.centerMap = () => map.setView([ MAP_HEIGHT - 1950, 1800 ], -0.5);
          window.focusOnLocation = (topPx, leftPx) => {
            map.setView([ MAP_HEIGHT - topPx, leftPx ], 0.5, { animate: true });
          };
        </script>
      </body>
      </html>
    `;
  };

  // Zoom action effects
  useEffect(() => {
    if (zoomAction === 'in' && webViewRef.current) {
      webViewRef.current.injectJavaScript('window.zoomInMap && window.zoomInMap(); true;');
      onZoomHandled && onZoomHandled();
    } else if (zoomAction === 'out' && webViewRef.current) {
      webViewRef.current.injectJavaScript('window.zoomOutMap && window.zoomOutMap(); true;');
      onZoomHandled && onZoomHandled();
    } else if (zoomAction === 'center' && webViewRef.current) {
      webViewRef.current.injectJavaScript('window.centerMap && window.centerMap(); true;');
      onZoomHandled && onZoomHandled();
    }
  }, [zoomAction]);

  // Listen to messages from Leaflet iframe on Web
  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const handleWebMessage = (event) => {
        try {
          const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
          if (data && data.type === 'SELECT_DEST' && onSelectDest) {
            onSelectDest(data.id);
          } else if (data && data.type === 'SELECT_START' && onSelectStart) {
            onSelectStart(data.id);
          } else if (data && data.type === 'SELECT_BUILDING' && onSelectBuilding) {
            onSelectBuilding(data.id);
          }
        } catch (e) {
          // ignore non-JSON or other window messages
        }
      };
      window.addEventListener('message', handleWebMessage);
      return () => window.removeEventListener('message', handleWebMessage);
    }
  }, [onSelectDest, onSelectStart, onSelectBuilding]);

  return (
    <View style={[styles.container, { backgroundColor: mapLayer === 'satellite' ? '#0B111E' : '#1A2333' }]}>
      {Platform.OS === 'web' ? (
        <iframe
          srcDoc={generateMapHTML()}
          style={{ width: '100%', height: '100%', border: 'none' }}
          title="Campus Nav Map"
        />
      ) : (
        <WebView
          ref={webViewRef}
          originWhitelist={['*']}
          source={{ html: generateMapHTML() }}
          style={[styles.mapView, { backgroundColor: mapLayer === 'satellite' ? '#0B111E' : '#1A2333' }]}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          onMessage={(event) => {
            try {
              const data = JSON.parse(event.nativeEvent.data);
              if (data.type === 'SELECT_BUILDING' && onSelectBuilding) {
                onSelectBuilding(data.id);
              } else if (data.type === 'SELECT_DEST' && onSelectDest) {
                onSelectDest(data.id);
              } else if (data.type === 'SELECT_START' && onSelectStart) {
                onSelectStart(data.id);
              }
            } catch (e) {}
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative'
  },
  mapView: {
    flex: 1
  }
});
