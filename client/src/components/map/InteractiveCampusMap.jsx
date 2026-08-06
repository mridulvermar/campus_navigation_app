import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, ImageOverlay, Polygon, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import campusGraphData from '../../data/campus_graph.json';
import { categoryIconMap } from './BuildingDetailDrawer';
import { 
  Building2, 
  BookOpen, 
  Utensils, 
  Trophy, 
  Car, 
  Cross, 
  Bus, 
  ShieldAlert, 
  Sparkles 
} from 'lucide-react';

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

  const svgHtml = `
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
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
        <path d="M9 22v-4h6v4"></path>
        <path d="M8 6h.01"></path>
        <path d="M16 6h.01"></path>
        <path d="M12 6h.01"></path>
        <path d="M12 10h.01"></path>
        <path d="M12 14h.01"></path>
      </svg>
    </div>
  `;

  return L.divIcon({
    html: svgHtml,
    className: 'custom-category-icon',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2]
  });
};

// Map Controller for imperative Zoom / FlyTo controls
const MapController = ({ targetCoords, zoomAction, onZoomHandled }) => {
  const map = useMap();

  useEffect(() => {
    if (targetCoords) {
      map.flyTo(targetCoords, map.getZoom(), { duration: 1.2 });
    }
  }, [targetCoords, map]);

  useEffect(() => {
    if (zoomAction) {
      if (zoomAction === 'in') map.zoomIn();
      if (zoomAction === 'out') map.zoomOut();
      if (zoomAction === 'fit') map.fitBounds(campusGraphData.campusInfo.bounds);
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
  const bounds = campusGraphData.campusInfo.bounds; // [[0, 0], [1000, 1000]]
  const satelliteImagePath = '/assets/campus_satellite.jpg';

  const buildings = campusGraphData.nodes.filter((n) => n.category !== 'Intersection');

  return (
    <div className="relative w-full h-[82vh] rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
      <MapContainer
        crs={L.CRS.Simple}
        bounds={bounds}
        maxBounds={bounds}
        maxBoundsViscosity={0.9}
        minZoom={-1}
        maxZoom={3}
        zoom={0}
        center={[500, 500]}
        scrollWheelZoom={true}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        {/* Map Controller for programmatic flyTo & zoom controls */}
        <MapController
          targetCoords={selectedBuilding ? selectedBuilding.coords : null}
          zoomAction={zoomAction}
          onZoomHandled={onZoomHandled}
        />

        {/* 1. Satellite Map Background Image Overlay */}
        <ImageOverlay
          url={satelliteImagePath}
          bounds={bounds}
          opacity={0.95}
        />

        {/* 2. Interactive SVG Polygon Building Overlays */}
        {buildings.map((b) => {
          if (!b.polygon || b.polygon.length < 3) return null;
          const isSelected = selectedBuilding?.id === b.id;

          return (
            <Polygon
              key={`poly_${b.id}`}
              positions={b.polygon}
              pathOptions={{
                color: isSelected ? '#22D3EE' : '#6366F1',
                weight: isSelected ? 3 : 1.5,
                fillColor: isSelected ? '#06B6D4' : '#312E81',
                fillOpacity: isSelected ? 0.45 : 0.2,
                className: isSelected ? 'animate-pulse' : 'transition-all duration-300 hover:fill-opacity-40'
              }}
              eventHandlers={{
                click: () => onSelectBuilding(b)
              }}
            />
          );
        })}

        {/* 3. Category Location Markers */}
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
                <div className="p-3 font-sans max-w-xs">
                  <span className="text-[10px] font-extrabold text-cyan-400 uppercase tracking-widest block font-display">
                    {b.code} • {b.category}
                  </span>
                  <h4 className="text-sm font-bold font-display text-white mt-0.5">{b.name}</h4>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-2">{b.description}</p>
                  <button
                    onClick={() => onSelectBuilding(b)}
                    className="mt-2.5 w-full btn-gradient py-1.5 rounded-lg text-xs font-bold font-display"
                  >
                    View Details & Route
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* 4. Dijkstra Shortest Walking Route SVG Path Overlay */}
        {routeData && routeData.coordinates && routeData.coordinates.length > 1 && (
          <Polyline
            positions={routeData.coordinates}
            pathOptions={{
              color: '#06B6D4',
              weight: 6,
              opacity: 0.9,
              dashArray: '8, 12',
              lineCap: 'round',
              className: 'animate-dash-route'
            }}
          />
        )}
      </MapContainer>
    </div>
  );
};
