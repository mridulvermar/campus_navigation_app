import geolocationsData from '../../data/geolocations_graph.json';

/**
 * Calculate Euclidean distance between two pixel coordinates (left1, top1) and (left2, top2)
 */
export function calculatePixelDistance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

/**
 * Calibrated linear transformation from GeoBits pixel (left, top) to Satellite GPS [lat, lng]
 */
export function convertPixelToGPS(left, top) {
  const lat = 11.501635 - top * 0.0000026848;
  const lng = 77.275713 + left * 0.0000012653;
  return [parseFloat(lat.toFixed(6)), parseFloat(lng.toFixed(6))];
}

/**
 * Convert Satellite GPS [lat, lng] to GeoBits L.CRS.Simple [3876 - top, left]
 */
export function convertGPSToCRSSimple(lat, lng) {
  const top = (11.501635 - lat) / 0.0000026848;
  const left = (lng - 77.275713) / 0.0000012653;
  return [3876 - top, left];
}

/**
 * Find nearest junction ID for given (left, top) pixel coordinates
 */
export function findNearestJunction(left, top, type = 'pedestrian') {
  const junctions = type === 'vehicle' ? geolocationsData.vehicleJunctions : geolocationsData.pedestrianJunctions;
  let minDistance = Infinity;
  let nearestId = null;

  junctions.forEach((j) => {
    const dist = calculatePixelDistance(j.left, j.top, left, top);
    if (dist < minDistance) {
      minDistance = dist;
      nearestId = j.id;
    }
  });

  return nearestId;
}

import campusGraphData from '../../data/campus_graph.json';

/**
 * Resolve start or destination location ID/tag/object/coords to road junction ID
 */
export function resolveLocationToJunction(locationParam, type = 'pedestrian') {
  const junctions = type === 'vehicle' ? geolocationsData.vehicleJunctions : geolocationsData.pedestrianJunctions;

  if (!locationParam) return junctions[0]?.id || 1;

  let targetLat = null;
  let targetLng = null;
  let targetIdStr = typeof locationParam === 'string' ? locationParam : locationParam.id || locationParam._id || locationParam.code || locationParam.name || '';

  if (typeof locationParam === 'object' && locationParam !== null) {
    if (Array.isArray(locationParam.coords) && locationParam.coords.length >= 2) {
      targetLat = locationParam.coords[0];
      targetLng = locationParam.coords[1];
    } else if (locationParam.latitude && locationParam.longitude) {
      targetLat = locationParam.latitude;
      targetLng = locationParam.longitude;
    }
  }

  // 1. Direct match on junction surroundings array
  if (targetIdStr) {
    const matchedJunction = junctions.find(
      (j) => j.surroundings && j.surroundings.some(s => String(s).toLowerCase() === String(targetIdStr).toLowerCase())
    );
    if (matchedJunction) return matchedJunction.id;
  }

  // 2. Lookup tag in tags array to get pixel (left, top)
  if (targetIdStr) {
    const tag = geolocationsData.tags.find((t) => 
      String(t.id).toLowerCase() === String(targetIdStr).toLowerCase() ||
      String(t.name).toLowerCase().includes(String(targetIdStr).toLowerCase())
    );
    if (tag) {
      return findNearestJunction(parseFloat(tag.left), parseFloat(tag.top), type);
    }
  }

  // 3. Lookup building in geolocationsData.buildings
  if (targetIdStr) {
    const building = geolocationsData.buildings.find((b) => 
      String(b.id).toLowerCase() === String(targetIdStr).toLowerCase() ||
      String(b.name).toLowerCase().includes(String(targetIdStr).toLowerCase())
    );
    if (building) {
      const buildingTag = geolocationsData.tags.find((t) => t.id === building.id);
      if (buildingTag) {
        return findNearestJunction(parseFloat(buildingTag.left), parseFloat(buildingTag.top), type);
      }
    }
  }

  // 4. Lookup in campusGraphData nodes by ID, code, or name
  if (targetIdStr && campusGraphData && campusGraphData.nodes) {
    const cNode = campusGraphData.nodes.find(n => 
      String(n.id).toLowerCase() === String(targetIdStr).toLowerCase() ||
      String(n.code).toLowerCase() === String(targetIdStr).toLowerCase() ||
      String(n.name).toLowerCase().includes(String(targetIdStr).toLowerCase())
    );
    if (cNode && Array.isArray(cNode.coords)) {
      targetLat = cNode.coords[0];
      targetLng = cNode.coords[1];
    }
  }

  // 5. Convert GPS [targetLat, targetLng] to pixel (left, top)
  if (targetLat !== null && targetLng !== null) {
    const top = (11.501635 - targetLat) / 0.0000026848;
    const left = (targetLng - 77.275713) / 0.0000012653;
    return findNearestJunction(left, top, type);
  }

  // 6. If locationParam is numeric junction ID
  const numericId = parseInt(targetIdStr, 10);
  if (!isNaN(numericId) && junctions.some((j) => j.id === numericId)) {
    return numericId;
  }

  return junctions[0]?.id || 1;
}

/**
 * Compute shortest Dijkstra route between fromLocation and toLocation
 */
export function findGeolocationsRoute(fromLocationId, toLocationId, type = 'pedestrian') {
  const junctions = type === 'vehicle' ? geolocationsData.vehicleJunctions : geolocationsData.pedestrianJunctions;
  const rawEdges = type === 'vehicle' ? geolocationsData.vehicleEdges : geolocationsData.pedestrianEdges;

  const startJunctionId = resolveLocationToJunction(fromLocationId, type);
  const endJunctionId = resolveLocationToJunction(toLocationId, type);

  // Build Adjacency List Graph
  const graph = {};
  junctions.forEach((j) => {
    graph[j.id] = {};
  });

  rawEdges.forEach(([u, v, weight]) => {
    if (!graph[u]) graph[u] = {};
    if (!graph[v]) graph[v] = {};
    graph[u][v] = weight;
    graph[v][u] = weight; // Undirected campus pathway graph
  });

  // Dijkstra Shortest Path Calculation
  const distances = {};
  const previous = {};
  const unvisited = new Set();

  Object.keys(graph).forEach((nodeId) => {
    const id = parseInt(nodeId, 10);
    distances[id] = Infinity;
    previous[id] = null;
    unvisited.add(id);
  });

  distances[startJunctionId] = 0;

  while (unvisited.size > 0) {
    let current = null;
    let minDist = Infinity;

    unvisited.forEach((nodeId) => {
      if (distances[nodeId] < minDist) {
        minDist = distances[nodeId];
        current = nodeId;
      }
    });

    if (current === null || current === endJunctionId || minDist === Infinity) {
      break;
    }

    unvisited.delete(current);

    const neighbors = graph[current] || {};
    Object.keys(neighbors).forEach((neighborStr) => {
      const neighbor = parseInt(neighborStr, 10);
      if (unvisited.has(neighbor)) {
        const alt = distances[current] + neighbors[neighbor];
        if (alt < distances[neighbor]) {
          distances[neighbor] = alt;
          previous[neighbor] = current;
        }
      }
    });
  }

  // Reconstruct Shortest Path Sequence
  const path = [];
  let curr = endJunctionId;
  while (curr !== null) {
    path.unshift(curr);
    curr = previous[curr];
  }

  // Map path node sequence to pixel coordinates and instructions
  const junctionMap = {};
  junctions.forEach((j) => {
    junctionMap[j.id] = j;
  });

  const pathCoordinates = [];
  const crsSimpleCoordinates = [];
  const stepInstructions = [];
  let totalPixelDistance = distances[endJunctionId] === Infinity ? 0 : distances[endJunctionId];

  path.forEach((nodeId, index) => {
    const j = junctionMap[nodeId];
    if (j) {
      const gpsCoords = convertPixelToGPS(j.left, j.top);
      pathCoordinates.push(gpsCoords);

      // GeoBits L.CRS.Simple coordinates: [3876 - top, left]
      const crsY = 3876 - j.top;
      const crsX = j.left;
      crsSimpleCoordinates.push([crsY, crsX]);

      if (index === 0) {
        stepInstructions.push(`Start at ${fromLocationId.replace(/-/g, ' ')}`);
      } else {
        const prevJ = junctionMap[path[index - 1]];
        if (prevJ) {
          const segDist = Math.round(calculatePixelDistance(prevJ.left, prevJ.top, j.left, j.top) * 0.8);
          stepInstructions.push(`Proceed ${segDist} meters towards Junction ${j.id}`);
        }
      }
    }
  });

  const estimatedMeters = Math.round(totalPixelDistance * 0.75);
  const estimatedWalkingTimeMinutes = Math.max(1, Math.round(estimatedMeters / 75));

  return {
    success: path.length > 0 && distances[endJunctionId] !== Infinity,
    startId: fromLocationId,
    destId: toLocationId,
    mode: type,
    totalDistanceMeters: estimatedMeters,
    estimatedWalkingTimeMinutes,
    formattedDistance: `${estimatedMeters} m`,
    formattedWalkingTime: `${estimatedWalkingTimeMinutes} min ${type === 'vehicle' ? 'drive' : 'walk'}`,
    pathJunctionIds: path,
    coordinates: pathCoordinates,
    crsSimpleCoordinates: crsSimpleCoordinates,
    stepInstructions
  };
}

export const findGeoBitsRoute = findGeolocationsRoute;
