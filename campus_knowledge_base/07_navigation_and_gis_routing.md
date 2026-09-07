# Bannari Amman Institute of Technology - GIS Navigation Engine & Routing Guide

This document details the architectural principles, routing algorithms, graph topology, and wayfinding capabilities powering the Smart Campus Navigation system.

---

## 1. Dijkstra Road Network Routing Engine
Unlike naive navigation apps that draw straight "as-the-crow-flies" vectors that slice right through multi-story buildings, the campus navigation engine uses a calibrated mathematical road graph:
- **Calibrated Road Junctions:** 320 precision-mapped road intersections and walkway vertices.
- **Weighted Graph Algorithm:** Dijkstra’s shortest path algorithm calculates the exact path using real paved pathways, pedestrian corridors, and internal avenues.
- **Obstacle & Building Wall Avoidance:** Guarantees routes strictly adhere to legitimate roads, avoiding campus walls, lakes, gardens, and athletic turf fields.

---

## 2. Dual Navigation Modes: Walk vs Drive

### A. Walk Mode (Pedestrian Navigation)
- **Pathway Access:** Utilizes all pedestrian avenues, paved walking corridors, courtyard walkways, garden paths, covered pergolas, and indoor corridors.
- **Speed Assumption:** Average walking speed of 4.5 km/h (~1.25 m/s).
- **Turn-by-Turn Waypoints:** Provides step-by-step turn directions (e.g., *"Walk 40m past the Learning Center, turn left at the Central Fountain walkway"*).
- **Accessibility:** Automatically filters for wheelchair-accessible ramps, tactile paving, and elevator-connected entrances.

### B. Drive Mode (Vehicle Navigation)
- **Road Access:** Strictly routes along asphalt vehicular roads, ring roads, and parking access paths. Excludes pedestrian-only walking plazas.
- **Speed Assumption:** Campus safety speed limit of 20 km/h.
- **Parking Logic:** Routes vehicles to the closest designated parking sector (`BIT-PRK` or Visitor Bays) before guiding the remaining stretch on foot.

---

## 3. Spatial Telemetry & GPS Tracking
- **Live User Positioning:** Uses mobile device GPS with Kalman filter smoothing to project real-time coordinates onto Leaflet GIS maps.
- **Live Sync:** Utilizes Socket.IO web sockets for high-frequency telemetry updates and emergency beacon tracking.
- **Pulsing Marker:** Visual indication of current user location, heading orientation, and proximity radius.

---

## 4. Indoor Multi-Floor Navigation
For multi-story structures (e.g., SF Block 5 floors, IB Block 4 floors, Learning Center 4 floors):
- **Level Selection:** Interactive floor switcher (Base, Ground, 1st, 2nd, 3rd, 4th, 5th Floor).
- **Vertical Transit Waypoints:** Routes guide users to the nearest elevator, staircase, or ramp.
- **Room Index Lookup:** Direct search by room code (e.g., *"IT 204"* or *"AI Lab"*) guides user to the exact exterior entrance, nearest stairwell, and corridor door.

---

## 5. Landmark & Wayfinding Reference Points
Key campus navigation waypoints:
1. **Central Clock Tower & Fountain:** Central junction between Learning Center, Cafeteria, and IB Block.
2. **Main Gate Arch & Security Check:** Northernmost landmark and primary vehicle arrival hub.
3. **East Academic Promenade:** Connects Aeronautical Block, SF Block, and Mechanical Block.
4. **Sports Boulevard:** Connects Cricket Ground, Athletic Stadium, Tennis Courts, and Gate C.
5. **Auditorium Quadrangle:** Connects Vedhanayagam Auditorium, Learning Center, and AS Block.

---

## 6. Accessibility & Special Needs Routing
- 100% of academic blocks are equipped with ground-level wheelchair access ramps.
- Elevators with braille buttons and audio floor announcers operate in SF Block, IB Block, Learning Center, and AS Block.
- Students requesting mobility assistance can toggle the **"Wheelchair Accessible Route"** filter in the navigation screen to eliminate staircases from the path.
