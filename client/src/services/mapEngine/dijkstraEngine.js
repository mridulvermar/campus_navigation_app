import { findGeolocationsRoute, convertGPSToCRSSimple } from './geolocationsDijkstra';

/**
 * Main Shortest Path Dijkstra Entry Point
 * Always routes via the 320-junction Road Network Graph (geolocations_graph.json)
 * ensuring paths travel strictly along roads and pathways without cutting through buildings.
 *
 * @param {string|object} startLocation - Source node ID, tag, name, or location object
 * @param {string|object} endLocation - Destination node ID, tag, name, or location object
 * @param {string} mode - Route mode ('pedestrian' | 'vehicle')
 * @returns {object|null} Shortest path object containing coordinates, distance, walking time, and instructions
 */
export const findShortestPath = (startLocation, endLocation, mode = 'pedestrian') => {
  if (!startLocation || !endLocation) return null;

  const modeStr = typeof mode === 'string' ? mode : 'pedestrian';
  return findGeolocationsRoute(startLocation, endLocation, modeStr);
};

export default findShortestPath;
