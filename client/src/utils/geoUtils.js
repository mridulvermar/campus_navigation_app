/**
 * Haversine formula to calculate distance between two lat/lng coordinates in meters
 */
export const calculateDistanceMeters = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
};

/**
 * Calculates estimated travel time in minutes based on distance and mode
 * - Walking (pedestrian): ~1.35 m/s (~4.86 km/h)
 * - Driving (vehicle): 30 km/h speed limit (500 m/min or ~8.33 m/s)
 */
export const calculateTravelTimeMinutes = (distanceMeters, mode = 'pedestrian') => {
  const isDriving = mode === 'vehicle' || mode === 'drive' || mode === 'driving';
  if (isDriving) {
    const speedMetersPerMin = 500; // 30 km/h = 30000 m / 60 min = 500 m/min
    return Math.max(1, Math.round(distanceMeters / speedMetersPerMin));
  }
  const speedMetersPerSec = 1.35;
  const seconds = distanceMeters / speedMetersPerSec;
  return Math.max(1, Math.ceil(seconds / 60));
};

export const calculateWalkingTimeMinutes = (distanceMeters, mode = 'pedestrian') => {
  return calculateTravelTimeMinutes(distanceMeters, mode);
};

/**
 * Generates turn-by-turn indoor/outdoor navigation step instructions
 */
export const generateTurnByTurnDirections = (sourceName, destName, distanceMeters) => {
  const timeMin = calculateWalkingTimeMinutes(distanceMeters);
  return [
    {
      step: 1,
      instruction: `Start at ${sourceName}. Head towards the nearest main walkway corridor.`,
      distance: `${Math.round(distanceMeters * 0.15)}m`,
      type: 'straight'
    },
    {
      step: 2,
      instruction: `Turn right onto Central Campus Plaza towards the Science Block.`,
      distance: `${Math.round(distanceMeters * 0.35)}m`,
      type: 'turn-right'
    },
    {
      step: 3,
      instruction: `Cross the green quadrangle crosswalk. Emergency exit call box available on left.`,
      distance: `${Math.round(distanceMeters * 0.30)}m`,
      type: 'straight'
    },
    {
      step: 4,
      instruction: `Arrive at main entrance of ${destName}. Check-in station available at main foyer.`,
      distance: `${Math.round(distanceMeters * 0.20)}m`,
      type: 'destination'
    }
  ];
};
