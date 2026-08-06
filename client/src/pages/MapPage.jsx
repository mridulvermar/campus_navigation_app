import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { InteractiveCampusMap } from '../components/map/InteractiveCampusMap';
import { FloatingNavPanel } from '../components/map/FloatingNavPanel';
import { BuildingDetailDrawer } from '../components/map/BuildingDetailDrawer';
import { findShortestPath } from '../services/mapEngine/dijkstraEngine';
import campusGraphData from '../data/campus_graph.json';

export const MapPage = () => {
  const [searchParams] = useSearchParams();
  const searchBuildingId = searchParams.get('building');

  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [startNode, setStartNode] = useState(campusGraphData.nodes[0]); // Default Gate
  const [destNode, setDestNode] = useState(campusGraphData.nodes[2]); // Default Academic Block A
  const [routeData, setRouteData] = useState(null);
  const [zoomAction, setZoomAction] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    if (searchBuildingId) {
      const found = campusGraphData.nodes.find((n) => n.id === searchBuildingId);
      if (found) {
        setSelectedBuilding(found);
        setDestNode(found);
      }
    }
  }, [searchBuildingId]);

  // Compute Dijkstra Route
  const handleCalculateRoute = () => {
    if (startNode && destNode) {
      const result = findShortestPath(startNode.id, destNode.id);
      setRouteData(result);
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
