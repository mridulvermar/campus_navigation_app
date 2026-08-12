import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { InteractiveCampusMap } from '../components/map/InteractiveCampusMap';
import { FloatingNavPanel } from '../components/map/FloatingNavPanel';
import { BuildingDetailDrawer } from '../components/map/BuildingDetailDrawer';
import { findShortestPath } from '../services/mapEngine/dijkstraEngine';
import campusGraphData from '../data/campus_graph.json';
import { apiService } from '../services/api';

export const MapPage = () => {
  const [searchParams] = useSearchParams();

  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [startNode, setStartNode] = useState(campusGraphData.nodes[0]); // Default BIT Main Gate
  const [destNode, setDestNode] = useState(campusGraphData.nodes[11]); // Default AS Block
  const [routeData, setRouteData] = useState(null);
  const [zoomAction, setZoomAction] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [navMode, setNavMode] = useState('pedestrian');

  const calculateAndSetRoute = useCallback((src, dest, mode = navMode) => {
    if (!src || !dest) return;
    const result = findShortestPath(src.id, dest.id, mode);
    if (result) {
      setRouteData(result);
      try {
        apiService.logNavigation({
          source: src.name || 'Current Location',
          destination: dest.name || 'Destination',
          distance: result.totalDistanceMeters || 0,
          timeTaken: result.estimatedWalkingTimeSeconds || 0,
          mode: mode === 'vehicle' ? 'Driving' : 'Walking'
        }).catch(() => {});
      } catch (err) {
        // Prevent logging error from interrupting route rendering
      }
    }
  }, [navMode]);

  useEffect(() => {
    const startParam = searchParams.get('start');
    const destParam = searchParams.get('dest') || searchParams.get('building');

    let sNode = startNode;
    let dNode = destNode;

    if (startParam) {
      const foundStart = campusGraphData.nodes.find(
        (n) => n.id === startParam || n.code === startParam || (n.name || '').toLowerCase().includes(startParam.toLowerCase())
      );
      if (foundStart) sNode = foundStart;
    }

    if (destParam) {
      const foundDest = campusGraphData.nodes.find(
        (n) => n.id === destParam || n.code === destParam || (n.name || '').toLowerCase().includes(destParam.toLowerCase())
      );
      if (foundDest) {
        dNode = foundDest;
        setSelectedBuilding(foundDest);
      }
    }

    setStartNode(sNode);
    setDestNode(dNode);
    calculateAndSetRoute(sNode, dNode, navMode);
  }, [searchParams, calculateAndSetRoute, navMode]);

  // Compute Dijkstra Route Button Handler
  const handleCalculateRoute = () => {
    if (startNode && destNode) {
      calculateAndSetRoute(startNode, destNode, navMode);
    }
  };

  const handleToggleNavMode = (newMode) => {
    setNavMode(newMode);
    if (startNode && destNode) {
      calculateAndSetRoute(startNode, destNode, newMode);
    }
  };

  // Reset Route
  const handleResetRoute = () => {
    setRouteData(null);
    setSelectedBuilding(null);
  };

  return (
    <div className="relative w-full min-h-[85vh] space-y-4">
      {/* Interactive Map Renderer */}
      <InteractiveCampusMap
        selectedBuilding={selectedBuilding}
        onSelectBuilding={(b) => setSelectedBuilding(b)}
        routeData={routeData}
        zoomAction={zoomAction}
        onZoomHandled={() => setZoomAction(null)}
      />

      {/* Floating Navigation & Search Controls Panel */}
      <FloatingNavPanel
        startNode={startNode}
        destNode={destNode}
        onSelectStart={(n) => setStartNode(n)}
        onSelectDest={(n) => {
          setDestNode(n);
          setSelectedBuilding(n);
        }}
        routeData={routeData}
        onCalculateRoute={handleCalculateRoute}
        onResetRoute={handleResetRoute}
        onZoomIn={() => setZoomAction('in')}
        onZoomOut={() => setZoomAction('out')}
        onFitBounds={() => setZoomAction('fit')}
        isFullScreen={isFullScreen}
        onToggleFullScreen={() => setIsFullScreen(!isFullScreen)}
        navMode={navMode}
        onToggleNavMode={handleToggleNavMode}
      />

      {/* Building Detail Drawer */}
      <BuildingDetailDrawer
        building={selectedBuilding}
        onClose={() => setSelectedBuilding(null)}
        onSetStart={(b) => setStartNode(b)}
        onSetDestination={(b) => {
          setDestNode(b);
          handleCalculateRoute();
        }}
        onStartRoute={() => handleCalculateRoute()}
      />
    </div>
  );
};
