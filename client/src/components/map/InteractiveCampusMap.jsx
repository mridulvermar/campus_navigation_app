import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import campusGraphData from '../../data/campus_graph.json';

// Custom Leaflet Category Icon Generator
const createCategoryMarkerIcon = (category, isSelected) => {
  const colorMap = {
    'Academic Buildings': '#06B6D4',
    'Hostel': '#6366F1',
    'Sports Complex': '#10B981',
    'Library': '#3B82F6',
    'Cafeteria': '#F59E0B',
    'Parking': '#8B5CF6',
    'Medical Centre': '#EF4444',
    'Bus Stop': '#14B8A6',
    'Administration Block': '#EC4899',
    'Auditorium': '#A855F7'
  };

  const color = colorMap[category] || '#06B6D4';
  const size = isSelected ? 44 : 36;

  return L.divIcon({
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background: rgba(11, 15, 25, 0.85);
        border: 2px solid ${color};
        border-radius: 12px;
        box-shadow: 0 0 ${isSelected ? 20 : 10}px ${color};
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${color};
        transition: all 0.3s ease;
        cursor: pointer;
      ">
        <span style="font-weight: 800; font-size: 14px;">📍</span>
      </div>
    `,
    className: 'custom-category-icon',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2]
  });
};

// Map Controller for imperative Zoom / FlyTo controls
const MapController = ({ targetCoords, zoomAction, onZoomHandled }) => {
  const map = useMap();

  useMapEvents({
    click(e) {
      const lat = parseFloat(e.latlng.lat.toFixed(6));
      const lng = parseFloat(e.latlng.lng.toFixed(6));
      console.log(`📍 Map Clicked Coordinates: [${lat}, ${lng}]`);
    }
  });

  useEffect(() => {
    if (targetCoords) {
      map.flyTo(targetCoords, 17, { duration: 1.2 });
    }
  }, [targetCoords, map]);

  useEffect(() => {
    if (zoomAction) {
      if (zoomAction === 'in') map.zoomIn();
      if (zoomAction === 'out') map.zoomOut();
      if (zoomAction === 'fit') {
        map.setView([11.4960, 77.2765], 16.5);
      }
      onZoomHandled();
    }
  }, [zoomAction, map, onZoomHandled]);

  return null;
};

export const InteractiveCampusMap = ({
  selectedBuilding,
  onSelectBuilding,
  routeData,
  zoomAction,
  onZoomHandled
}) => {
  const [mapMode, setMapMode] = useState('satellite'); // Default: Satellite Map Mode
  const buildings = campusGraphData.nodes.filter((n) => n.category !== 'Intersection');

  return (
    <div className="relative w-full h-[82vh] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
      {/* Floating View Mode Toggle Control: Satellite vs Streets */}
      <div className="absolute top-4 right-4 z-[1000] flex bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-700/60 shadow-xl gap-1">
        <button
          onClick={() => setMapMode('satellite')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold font-display transition-all ${
            mapMode === 'satellite'
              ? 'bg-cyan-500 text-slate-950 shadow-md font-extrabold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          🛰️ Satellite
        </button>
        <button
          onClick={() => setMapMode('streets')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold font-display transition-all ${
            mapMode === 'streets'
              ? 'bg-cyan-500 text-slate-950 shadow-md font-extrabold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          🗺️ Streets
        </button>
      </div>

      <MapContainer
        key="crs_mercator"
        crs={L.CRS.EPSG3857}
        center={[11.4960, 77.2765]}
        zoom={16.5}
        minZoom={14}
        maxZoom={20}
        scrollWheelZoom={true}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        {/* Map Controller */}
        <MapController
          targetCoords={selectedBuilding?.coords || null}
          zoomAction={zoomAction}
          onZoomHandled={onZoomHandled}
        />

        {/* Map Tile Layer Rendering */}
        {mapMode === 'satellite' ? (
          <TileLayer
            attribution="&copy; Google Satellite Imagery"
            url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
            maxZoom={20}
          />
        ) : (
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            maxZoom={20}
          />
        )}

        {/* Campus Building Markers */}
        {buildings.map((b) => {
          const isSelected = selectedBuilding?.id === b.id;
          return (
            <Marker
              key={`marker_${b.id}`}
              position={b.coords}
              icon={createCategoryMarkerIcon(b.category, isSelected)}
              eventHandlers={{
                click: () => onSelectBuilding(b)
              }}
            >
              <Popup className="custom-campus-popup">
                <div className="p-2 font-sans">
                  <h4 className="text-xs font-bold text-white">{b.name}</h4>
                  <p className="text-[10px] text-cyan-400">{b.category}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Dijkstra Shortest Walking Route Polyline & Pins */}
        {routeData && routeData.coordinates && routeData.coordinates.length > 0 && (
          <>
            <Polyline
              positions={routeData.coordinates}
              pathOptions={{
                color: '#00F0FF',
                weight: 8,
                opacity: 1.0,
                dashArray: '12, 10'
              }}
            />

            {/* Start & Destination Pin Markers */}
            {(() => {
              const startPos = routeData.coordinates[0];
              const endPos = routeData.coordinates[routeData.coordinates.length - 1];

              const startIcon = L.divIcon({
                html: `<div style="background:#10B981; color:#0f172a; border-radius:50%; width:32px; height:32px; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:16px; border:2px solid #fff; box-shadow:0 0 16px #10B981;">📍</div>`,
                iconSize: [32, 32],
                iconAnchor: [16, 16]
              });

              const endIcon = L.divIcon({
                html: `<div style="background:#EF4444; color:#fff; border-radius:50%; width:32px; height:32px; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:16px; border:2px solid #fff; box-shadow:0 0 16px #EF4444;">🏁</div>`,
                iconSize: [32, 32],
                iconAnchor: [16, 16]
              });

              return (
                <>
                  <Marker position={startPos} icon={startIcon}>
                    <Popup><span style={{fontWeight: 'bold', color: '#10B981'}}>Start Point</span></Popup>
                  </Marker>
                  <Marker position={endPos} icon={endIcon}>
                    <Popup><span style={{fontWeight: 'bold', color: '#EF4444'}}>Destination</span></Popup>
                  </Marker>
                </>
              );
            })()}
          </>
        )}
      </MapContainer>
    </div>
  );
};
