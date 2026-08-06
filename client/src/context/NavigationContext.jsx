import React, { createContext, useContext, useState } from 'react';
import { MOCK_BUILDINGS } from '../data/mockData';
import { calculateDistanceMeters, calculateWalkingTimeMinutes, generateTurnByTurnDirections } from '../utils/geoUtils';

const NavigationContext = createContext();

export const NavigationProvider = ({ children }) => {
  const [sourceBuilding, setSourceBuilding] = useState(MOCK_BUILDINGS[2]); // Eng Quad
  const [destBuilding, setDestBuilding] = useState(MOCK_BUILDINGS[0]); // Science A
  const [activeRoute, setActiveRoute] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);

  const calculateRoute = (src = sourceBuilding, dest = destBuilding) => {
    if (!src || !dest) return;
    
    const distance = calculateDistanceMeters(
      src.latitude, src.longitude,
      dest.latitude, dest.longitude
    );
    const timeTaken = calculateWalkingTimeMinutes(distance);
    const steps = generateTurnByTurnDirections(src.name, dest.name, distance);

    const route = {
      source: src,
      destination: dest,
      distanceMeters: distance,
      timeTakenMinutes: timeTaken,
      steps,
      coordinates: [
        [src.latitude, src.longitude],
        [(src.latitude + dest.latitude) / 2 + 0.0003, (src.longitude + dest.longitude) / 2 - 0.0003],
        [dest.latitude, dest.longitude]
      ]
    };

    setActiveRoute(route);
    setIsNavigating(true);
    return route;
  };

  const clearRoute = () => {
    setActiveRoute(null);
    setIsNavigating(false);
  };

  return (
    <NavigationContext.Provider value={{
      sourceBuilding,
      setSourceBuilding,
      destBuilding,
      setDestBuilding,
      activeRoute,
      isNavigating,
      calculateRoute,
      clearRoute
    }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => useContext(NavigationContext);
