import campusGraphData from '../../data/campus_graph.json';
import { findGeolocationsRoute, convertGPSToCRSSimple } from './geolocationsDijkstra';

/**
 * Build Adjacency Graph from campus_graph.json
 */
const buildAdjacencyList = (nodes = [], edges = []) => {
  const nodeMap = new Map();
  nodes.forEach((n) => n && n.id && nodeMap.set(n.id, n));

  const adj = new Map();
  nodes.forEach((n) => n && n.id && adj.set(n.id, []));

  edges.forEach((edge) => {
    if (!edge) return;
    const { source, target, weight, instruction } = edge;
    if (adj.has(source) && adj.has(target)) {
      adj.get(source).push({ node: target, weight: weight || 10, instruction });
      adj.get(target).push({ node: source, weight: weight || 10, instruction: instruction ? `Return: ${instruction}` : '' });
    }
  });

  return { nodeMap, adj };
};

/**
 * Dijkstra's Shortest Path Algorithm Implementation
 * @param {string} startId - Source Node ID
 * @param {string} endId - Destination Node ID
 * @param {string|object} modeOrGraph - Route mode ('pedestrian'|'vehicle') or custom graph object
 * @returns {object|null} Shortest path object with distance, time, and instructions
 */
export const findShortestPath = (startId, endId, modeOrGraph = 'pedestrian') => {
  if (!startId || !endId) return null;

  const mode = typeof modeOrGraph === 'string' ? modeOrGraph : 'pedestrian';

  let graphData = campusGraphData;
  if (typeof modeOrGraph === 'object' && modeOrGraph !== null && modeOrGraph.nodes) {
    graphData = modeOrGraph;
  }

  const nodes = graphData.nodes || [];
  const edges = graphData.edges || [];

  const startExists = nodes.some((n) => n && n.id === startId);
  const endExists = nodes.some((n) => n && n.id === endId);

  // Fallback to Geolocations road-following Dijkstra engine
  if (!startExists || !endExists) {
    return findGeolocationsRoute(startId, endId, mode);
  }

  if (startId === endId) {
    const node = nodes.find((n) => n.id === startId);
    if (!node) return null;
    const coords = node.coords || [11.4960, 77.2765];
    return {
      pathNodes: [node],
      coordinates: [coords],
      crsSimpleCoordinates: [convertGPSToCRSSimple(coords[0], coords[1])],
      totalDistanceMeters: 0,
      formattedDistance: '0 m',
      estimatedWalkingTimeSeconds: 0,
      formattedWalkingTime: '0 min',
      stepInstructions: ['You are already at your destination.']
    };
  }

  const { nodeMap, adj } = buildAdjacencyList(nodes, edges);

  if (!nodeMap.has(startId) || !nodeMap.has(endId)) return null;

  const distances = new Map();
  const previous = new Map();
  const stepTextMap = new Map();
  const unvisited = new Set();

  nodeMap.forEach((_, id) => {
    distances.set(id, Infinity);
    previous.set(id, null);
    unvisited.add(id);
  });

  distances.set(startId, 0);

  while (unvisited.size > 0) {
    // Select unvisited node with smallest distance
    let current = null;
    let minDistance = Infinity;

    unvisited.forEach((id) => {
      if (distances.get(id) < minDistance) {
        minDistance = distances.get(id);
        current = id;
      }
    });

    if (current === null || minDistance === Infinity) break;
    if (current === endId) break; // Destination reached

    unvisited.delete(current);

    const neighbors = adj.get(current) || [];
    for (const neighbor of neighbors) {
      if (!unvisited.has(neighbor.node)) continue;

      const alt = distances.get(current) + neighbor.weight;
      if (alt < distances.get(neighbor.node)) {
        distances.set(neighbor.node, alt);
        previous.set(neighbor.node, current);
        stepTextMap.set(neighbor.node, neighbor.instruction);
      }
    }
  }

  // Reconstruct Shortest Path
  const pathIds = [];
  let curr = endId;

  if (previous.get(curr) === null && curr !== startId) {
    return null; // Path not found
  }

  while (curr !== null) {
    pathIds.unshift(curr);
    curr = previous.get(curr);
  }

  // Gather path nodes & coordinates
  const pathNodes = pathIds.map((id) => nodeMap.get(id));
  const coordinates = pathNodes.map((n) => n.coords);
  const crsSimpleCoordinates = coordinates.map((c) => convertGPSToCRSSimple(c[0], c[1]));
  const totalDistanceMeters = Math.round(distances.get(endId));

  // Walking speed constant: 1.2 meters / second (~4.3 km/h)
  const estimatedWalkingTimeSeconds = Math.round(totalDistanceMeters / 1.2);
  const minutes = Math.floor(estimatedWalkingTimeSeconds / 60);
  const seconds = estimatedWalkingTimeSeconds % 60;

  const formattedDistance = totalDistanceMeters >= 1000
    ? `${(totalDistanceMeters / 1000).toFixed(2)} km`
    : `${totalDistanceMeters} m`;

  const formattedWalkingTime = minutes > 0
    ? `${minutes} min ${seconds > 0 ? `${seconds} sec` : ''}`
    : `${seconds} sec`;

  // Build step-by-step navigation instructions
  const stepInstructions = [];
  for (let i = 1; i < pathIds.length; i++) {
    const targetId = pathIds[i];
    const instruction = stepTextMap.get(targetId) || `Walk to ${nodeMap.get(targetId).name}`;
    stepInstructions.push(instruction);
  }

  return {
    pathNodes,
    coordinates,
    crsSimpleCoordinates,
    totalDistanceMeters,
    formattedDistance,
    estimatedWalkingTimeSeconds,
    formattedWalkingTime,
    stepInstructions
  };
};
