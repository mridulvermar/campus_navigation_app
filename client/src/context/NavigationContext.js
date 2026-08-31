import React, { createContext, useContext, useState } from 'react';
import { findGeolocationsRoute } from '../services/mapEngine/geolocationsDijkstra';
import { MOCK_BUILDINGS } from '../data/mockData';

const NavigationContext = createContext();

export const NavigationProvider = ({ children }) => {
  const [sourceBuilding, setSourceBuilding] = useState(MOCK_BUILDINGS[0]);
  const [destBuilding, setDestBuilding] = useState(MOCK_BUILDINGS[1]);
  const [activeRoute, setActiveRoute] = useState(null);
  const [navMode, setNavMode] = useState('pedestrian'); // 'pedestrian' or 'vehicle'
  const [isNavigating, setIsNavigating] = useState(false);

  const calculateRoute = (fromNode, toNode, mode = navMode) => {
    if (!fromNode || !toNode) return null;
    
    const startId = fromNode.id || fromNode.code || fromNode._id || fromNode.name;
    const destId = toNode.id || toNode.code || toNode._id || toNode.name;
    
    const route = findGeolocationsRoute(startId, destId, mode);
    setActiveRoute(route);
    setIsNavigating(true);
    return route;
  };

  const clearRoute = () => {
    setActiveRoute(null);
    setIsNavigating(false);
  };

  return (
    <NavigationContext.Provider
      value={{
        sourceBuilding,
        setSourceBuilding,
        destBuilding,
        setDestBuilding,
        activeRoute,
        setActiveRoute,
        calculateRoute,
        clearRoute,
        navMode,
        setNavMode,
        isNavigating,
        setIsNavigating
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => useContext(NavigationContext);
