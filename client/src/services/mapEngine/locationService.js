import geolocationsGraphData from '../../data/geolocations_graph.json';
import campusGraphData from '../../data/campus_graph.json';

/**
 * Get all selectable campus locations (Buildings, Tags, and Classrooms/Labs)
 */
export function getAllSelectableLocations() {
  const locations = [];
  const addedIds = new Set();

  // 1. Add Campus Tags & Landmarks (Landmarks, Gates, Amenities)
  (geolocationsGraphData.tags || []).forEach((t) => {
    if (t.id && !addedIds.has(t.id)) {
      addedIds.add(t.id);
      locations.push({
        id: t.id,
        name: t.name,
        category: 'Landmarks & Amenities',
        type: 'tag',
        top: t.top,
        left: t.left
      });
    }
  });

  // 2. Add Campus Buildings & Floor Classrooms/Labs
  (geolocationsGraphData.buildings || []).forEach((b) => {
    if (b.id && !addedIds.has(b.id)) {
      addedIds.add(b.id);
      locations.push({
        id: b.id,
        name: b.name,
        category: 'Academic & Main Blocks',
        type: 'building',
        mainName: b.main || b.name,
        about: b.about || '',
        floors: b.floors || []
      });
    }

    // Add individual rooms and labs inside this building
    if (b.floors) {
      b.floors.forEach((flr) => {
        if (flr.rooms) {
          flr.rooms.forEach((roomName) => {
            const roomId = `${b.id}__room__${roomName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
            if (!addedIds.has(roomId)) {
              addedIds.add(roomId);
              locations.push({
                id: b.id, // Parent building ID for Dijkstra routing
                roomId: roomId,
                name: `${roomName} (${b.name} - ${flr.name})`,
                roomOnlyName: roomName,
                buildingId: b.id,
                buildingName: b.name,
                floorName: flr.name,
                category: 'Classrooms & Labs',
                type: 'room'
              });
            }
          });
        }
      });
    }
  });

  // 3. Add standard BIT Campus Nodes if not present
  (campusGraphData.nodes || []).forEach((n) => {
    if (n.id && n.category !== 'Intersection' && !addedIds.has(n.id)) {
      addedIds.add(n.id);
      locations.push({
        id: n.id,
        name: n.name,
        category: n.category || 'Campus Location',
        type: 'campus_node',
        coords: n.coords
      });
    }
  });

  return locations;
}

/**
 * Filter and search across all locations (Buildings, Classrooms, Tags)
 */
export function searchLocations(query) {
  if (!query || !query.trim()) return [];
  const q = query.toLowerCase().replace(/\s+/g, '');
  const allLocs = getAllSelectableLocations();

  return allLocs.filter((item) => {
    const nameMatch = (item.name || '').toLowerCase().replace(/\s+/g, '').includes(q);
    const roomMatch = (item.roomOnlyName || '').toLowerCase().replace(/\s+/g, '').includes(q);
    const buildingMatch = (item.buildingName || '').toLowerCase().replace(/\s+/g, '').includes(q);
    const floorMatch = (item.floorName || '').toLowerCase().replace(/\s+/g, '').includes(q);
    return nameMatch || roomMatch || buildingMatch || floorMatch;
  });
}
