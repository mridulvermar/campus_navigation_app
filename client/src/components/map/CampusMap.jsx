import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useSocket } from '../../context/SocketContext';
import { useNavigation } from '../../context/NavigationContext';
import { MOCK_BUILDINGS } from '../../data/mockData';
import { Badge } from '../common/Badge';
import { Navigation, Clock, Shield, Flame, Compass, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Custom SVG Building Icon Generator
const createBuildingIcon = (category, isSelected) => {
  const categoryColors = {
    Research: '#06B6D4',
    Library: '#10B981',
    Academic: '#6366F1',
    Dining: '#F59E0B',
    Auditorium: '#EC4899',
    Sports: '#8B5CF6'
  };
  const color = categoryColors[category] || '#06B6D4';

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${isSelected ? 42 : 34}" height="${isSelected ? 42 : 34}">
      <filter id="shadow">
        <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="${color}" flood-opacity="0.5"/>
      </filter>
      <circle cx="12" cy="12" r="10" fill="${color}" filter="url(#shadow)" stroke="#ffffff" stroke-width="2"/>
      <path d="M12 6L4 12v8h16v-8l-8-6z" fill="#ffffff" opacity="0.9"/>
    </svg>
  `;

  return L.divIcon({
    html: svg,
    className: 'custom-leaflet-marker',
    iconSize: [isSelected ? 42 : 34, isSelected ? 42 : 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -15]
  });
};

// User Location Pulsing Dot Icon
const userPulseIcon = L.divIcon({
  html: `<div class="user-pulse-marker"></div>`,
  className: '',
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});

// Component to dynamically re-center map view when route updates
const MapController = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 17, { duration: 1.5 });
    }
  }, [center, map]);
  return null;
};

export const CampusMap = ({ selectedCategory, searchQuery, onSelectBuilding }) => {
  const { spatialLocation } = useSocket();
  const { activeRoute, calculateRoute, setSourceBuilding, setDestBuilding } = useNavigation();
  const [selectedBuilding, setSelectedBuilding] = useState(MOCK_BUILDINGS[0]);
  const navigate = useNavigate();

  const filteredBuildings = MOCK_BUILDINGS.filter((b) => {
    const matchesCat = !selectedCategory || selectedCategory === 'All' || b.category === selectedCategory;
    const matchesSearch = !searchQuery || b.name.toLowerCase().includes(searchQuery.toLowerCase()) || b.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleBuildingClick = (b) => {
    setSelectedBuilding(b);
    if (onSelectBuilding) onSelectBuilding(b);
  };

  const handleStartNavigation = (dest) => {
    setSourceBuilding(MOCK_BUILDINGS[2]); // Eng quad
    setDestBuilding(dest);
    calculateRoute(MOCK_BUILDINGS[2], dest);
    navigate('/navigation');
  };

  return (
    <div className="relative w-full h-[480px] sm:h-[580px] md:h-[650px] rounded-3xl overflow-hidden border border-slate-700/60 shadow-2xl">
      <MapContainer
        center={[37.774929, -122.419416]}
        zoom={16}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        <MapController center={selectedBuilding ? [selectedBuilding.latitude, selectedBuilding.longitude] : null} />

        {/* Live Spatial User GPS Marker */}
        {spatialLocation && (
          <Marker position={[spatialLocation.latitude, spatialLocation.longitude]} icon={userPulseIcon}>
            <Popup>
              <div className="p-2 text-xs font-sans">
                <span className="font-bold text-cyan-600 block">Your Spatial GPS Position</span>
                <span className="text-slate-500">Live Accuracy: ±{spatialLocation.accuracyMeters}m</span>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Building Markers */}
        {filteredBuildings.map((b) => (
          <Marker
            key={b._id}
            position={[b.latitude, b.longitude]}
            icon={createBuildingIcon(b.category, selectedBuilding?._id === b._id)}
            eventHandlers={{
              click: () => handleBuildingClick(b)
            }}
          >
            <Popup className="custom-popup">
              <div className="p-3 max-w-xs font-sans">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-bold text-cyan-600 uppercase tracking-wider font-display">{b.code}</span>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-700 font-display">Open</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1 font-display">{b.name}</h4>
                <p className="text-xs text-slate-600 line-clamp-2 mb-3">{b.description}</p>
                <div className="flex items-center justify-between text-xs border-t pt-2 text-slate-600">
                  <span>Hours: {b.openingHours}</span>
                  <button
                    onClick={() => handleStartNavigation(b)}
                    className="flex items-center gap-1 text-xs font-bold text-cyan-600 hover:text-cyan-700 font-display cursor-pointer"
                  >
                    <Navigation className="w-3.5 h-3.5" /> Route Here
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Active Navigation Polyline Path */}
        {activeRoute && (
          <Polyline
            positions={activeRoute.coordinates}
            color="#06B6D4"
            weight={6}
            opacity={0.85}
            dashArray="10, 10"
          />
        )}
      </MapContainer>

      {/* Floating Spatial Overlay Panel */}
      {selectedBuilding && (
        <div className="absolute bottom-3 left-3 right-3 md:right-auto md:max-w-md z-[500] glass-panel p-4 rounded-2xl border border-cyan-500/40 shadow-2xl backdrop-blur-xl">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-400 font-display">{selectedBuilding.category} Facility</span>
              <h3 className="text-base md:text-lg font-extrabold font-display text-white leading-tight">{selectedBuilding.name}</h3>
            </div>
            <Badge variant="success" size="sm">{selectedBuilding.code}</Badge>
          </div>
          <div className="flex items-center gap-4 mt-2.5 text-xs text-slate-300">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>{selectedBuilding.openingHours}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span>Occupancy: 78%</span>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={() => handleStartNavigation(selectedBuilding)}
              className="flex-1 btn-gradient py-2 rounded-xl text-xs font-bold font-display flex items-center justify-center gap-1.5 shadow-glow-cyan"
            >
              <Navigation className="w-4 h-4" /> Start Turn-by-Turn Navigation
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
