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
  mapLayer = 'streets', // 'streets' | 'satellite'
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

          /* Place Tags */
          .campus-place-tag {
            background: rgba(15, 23, 42, 0.94);
            border: 1.5px solid #00a8ff;
            color: #F8FAFC;
            font-size: 11px;
            font-weight: 800;
            padding: 3px 8px;
            border-radius: 6px;
            white-space: nowrap;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.7);
            cursor: pointer;
            transition: all 0.2s ease;
            text-align: center;
            letter-spacing: 0.2px;
          }
          .campus-place-tag:hover {
            background: #00a8ff;
            color: #070B14;
            transform: scale(1.12);
            box-shadow: 0 0 16px #00a8ff;
          }

          /* Legend Icons */
          .legend-icon-wrapper {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            border-radius: 10px;
            background: rgba(15, 23, 42, 0.94);
            border: 1.5px solid #00a8ff;
            box-shadow: 0 0 14px rgba(0, 168, 255, 0.6);
            cursor: pointer;
            transition: transform 0.2s ease;
          }
          .legend-icon-wrapper:hover {
            transform: scale(1.25);
            box-shadow: 0 0 20px #00a8ff;
          }

          /* Interactive Popup Styling */
          .custom-campus-popup .leaflet-popup-content-wrapper {
            background: rgba(15, 23, 42, 0.98);
            color: #fff;
            border-radius: 14px;
            border: 1.5px solid #00a8ff;
            backdrop-filter: blur(14px);
            box-shadow: 0 14px 35px rgba(0, 0, 0, 0.85);
            padding: 2px;
          }
          .custom-campus-popup .leaflet-popup-tip {
            background: rgba(15, 23, 42, 0.98);
          }
          .popup-badge {
            display: inline-block;
            font-size: 10px;
            font-weight: 800;
            padding: 2px 7px;
            border-radius: 5px;
            background: rgba(0, 168, 255, 0.18);
            color: #00a8ff;
            border: 1px solid rgba(0, 168, 255, 0.4);
            margin-bottom: 4px;
            text-transform: uppercase;
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
            padding: 6px 10px;
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

          // Selected Overlay Image Layer (Streets Vector SVG or Satellite WebP)
          const mapImageURL = isSatellite ? embeddedWebpUri : embeddedSvgUri;
          const overlayClass = isSatellite ? 'campus-satellite-overlay' : 'campus-svg-overlay';

          const campusOverlay = L.imageOverlay(mapImageURL, bounds, {
            opacity: 1.0,
            interactive: true,
            className: overlayClass
          }).addTo(map);

          // Initial Center View (Central Quad / Campus Center)
          map.setView([ MAP_HEIGHT - 1950, 1800 ], -0.5);

          const tags = ${tagsJson};
          const legends = ${legendsJson};
          const buildings = ${buildingsJson};

          // Render Place Tags
          const tagsLayerGroup = L.layerGroup().addTo(map);
          tags.forEach(t => {
            const topPx = parseFloat(t.top);
            const leftPx = parseFloat(t.left);
            const y = MAP_HEIGHT - topPx;
            const x = leftPx;

            const tagIcon = L.divIcon({
              html: '<div class="campus-place-tag" onclick="selectPlace(\\'' + t.id + '\\')">' + t.name + '</div>',
              className: '',
              iconAnchor: [35, 12]
            });

            L.marker([y, x], { icon: tagIcon }).addTo(tagsLayerGroup);
          });

          // Render POI Legend Icons
          const legendsLayerGroup = L.layerGroup().addTo(map);
          const iconEmojiMap = {
            'library.svg': '📚',
            'football.svg': '⚽',
            'gym.svg': '🏋️',
            'atm.svg': '🏧',
            'office.svg': '🏢',
            'food.svg': '🍽️',
            'snacks.svg': '🥪',
            'juice.svg': '🧃',
            'medical.svg': '🏥',
            'parking.svg': '🅿️',
            'xerox.svg': '🖨️',
            'laundry.svg': '🧺',
            'cricket.svg': '🏏',
            'chess.svg': '♟️',
            'wifi.svg': '📶',
            'hostel.svg': '🏠',
            'parlour.svg': '✂️',
            'meat-and-eat.svg': '🍗'
          };

          legends.forEach(leg => {
            const topPx = parseFloat(leg.top);
            const leftPx = parseFloat(leg.left);
            const y = MAP_HEIGHT - topPx;
            const x = leftPx;

            const iconFile = leg.link || 'tag.svg';
            const emoji = iconEmojiMap[iconFile] || '📍';

            const legIcon = L.divIcon({
              html: '<div class="legend-icon-wrapper" onclick="selectPlace(\\'' + leg.id + '\\')">' +
                      '<span style="font-size:15px;">' + emoji + '</span>' +
                    '</div>',
              className: '',
              iconSize: [32, 32],
              iconAnchor: [16, 16]
            });

            const marker = L.marker([y, x], { icon: legIcon }).addTo(legendsLayerGroup);

            // Find matching building info
            const b = buildings.find(item => item.id === leg.id);
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
                '<span class="popup-badge">' + (b ? b.main || 'Campus Facility' : 'Landmark') + '</span>' +
                '<h4 class="popup-title">' + (b ? b.name : leg.id.replace(/-/g, ' ').toUpperCase()) + '</h4>' +
                '<p class="popup-desc">' + (b && b.about ? b.about : 'Campus location on the spatial blueprint.') + '</p>' +
                floorsHtml +
                '<div class="popup-actions">' +
                  '<button class="popup-btn popup-btn-dest" onclick="sendAction(\\'SELECT_DEST\\', \\'' + leg.id + '\\')">🚀 Go Here</button>' +
                  '<button class="popup-btn popup-btn-start" onclick="sendAction(\\'SELECT_START\\', \\'' + leg.id + '\\')">🟢 Set Start</button>' +
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

          // Message Dispatcher to React Native
          window.sendAction = function(type, id) {
            const payload = { type, id };
            if (window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage(JSON.stringify(payload));
            } else if (window.parent) {
              window.parent.postMessage(JSON.stringify(payload), '*');
            }
          };

          window.selectPlace = function(id) {
            sendAction('SELECT_BUILDING', id);
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
