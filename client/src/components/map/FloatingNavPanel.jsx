import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  Navigation, 
  RotateCcw, 
  Plus, 
  Minus, 
  Maximize2, 
  ChevronDown, 
  ChevronUp,
  Footprints,
  Clock,
  CheckCircle,
  X
} from 'lucide-react';
import { searchCampusLocations } from '../../services/mapEngine/searchEngine';
import campusGraphData from '../../data/campus_graph.json';

export const FloatingNavPanel = ({
  startNode,
  destNode,
  onSelectStart,
  onSelectDest,
  routeData,
  onCalculateRoute,
  onResetRoute,
  onZoomIn,
  onZoomOut,
  onFitBounds,
  isFullScreen,
  onToggleFullScreen
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  const [showStepDetails, setShowStepDetails] = useState(false);

  const searchResults = searchCampusLocations(searchQuery);

  const handleSelectSearchResult = (node) => {
    onSelectDest(node);
    setSearchQuery('');
    setIsSearchFocused(false);
  };

  const validNodes = campusGraphData.nodes.filter((n) => n.category !== 'Intersection');

  return (
    <>
      {/* Main Floating Glass Navigation Panel */}
      <div className="absolute top-4 left-4 right-4 md:right-auto md:w-96 z-[1000] space-y-3 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="pointer-events-auto glass-panel p-4 rounded-3xl border border-cyan-500/40 shadow-2xl backdrop-blur-2xl"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
                <Navigation className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs md:text-sm font-extrabold font-display text-white">Campus GIS Navigator</h3>
                <p className="text-[10px] text-slate-400">Dijkstra Shortest Path Pathfinder</p>
              </div>
            </div>

            <button
              onClick={() => setIsPanelCollapsed(!isPanelCollapsed)}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              {isPanelCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>

          {!isPanelCollapsed && (
            <div className="space-y-3">
              {/* Autocomplete Search Bar */}
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
                  <input
                    type="text"
                    placeholder="Search building, department, room..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsSearchFocused(true);
                    }}
                    onFocus={() => setIsSearchFocused(true)}
                    className="w-full glass-input pl-10 pr-8 text-xs py-2.5 rounded-xl border-cyan-500/30 focus:border-cyan-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Autocomplete Dropdown List */}
                {isSearchFocused && searchResults.length > 0 && searchQuery.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute left-0 right-0 top-full mt-1 bg-slate-900/95 border border-cyan-500/40 rounded-2xl shadow-2xl max-h-56 overflow-y-auto z-[1100] p-1.5 backdrop-blur-xl"
                  >
                    {searchResults.map((node) => (
                      <button
                        key={node.id}
                        onClick={() => handleSelectSearchResult(node)}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-cyan-500/10 hover:border hover:border-cyan-500/30 transition-all flex items-center justify-between text-xs cursor-pointer group"
                      >
                        <div>
                          <span className="font-bold font-display text-white group-hover:text-cyan-400 transition-colors block">
                            {node.name}
                          </span>
                          <span className="text-[10px] text-slate-400">{node.category} • {node.code}</span>
                        </div>
                        <span className="text-[10px] font-mono text-cyan-400 font-semibold px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                          Select
                        </span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Start & Destination Selectors */}
              <div className="space-y-2 pt-1">
                {/* Start Location */}
                <div className="flex items-center gap-2 bg-slate-900/70 p-2 rounded-xl border border-slate-800">
                  <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <select
                    value={startNode ? startNode.id : ''}
                    onChange={(e) => {
                      const selected = validNodes.find((n) => n.id === e.target.value);
                      onSelectStart(selected || null);
                    }}
                    className="w-full bg-transparent text-xs text-white focus:outline-none cursor-pointer"
                  >
                    <option value="" disabled className="bg-slate-900 text-slate-400">Select Current Location...</option>
                    {validNodes.map((n) => (
                      <option key={n.id} value={n.id} className="bg-slate-900 text-white">
                        {n.name} ({n.code})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Destination Location */}
                <div className="flex items-center gap-2 bg-slate-900/70 p-2 rounded-xl border border-slate-800">
                  <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <select
                    value={destNode ? destNode.id : ''}
                    onChange={(e) => {
                      const selected = validNodes.find((n) => n.id === e.target.value);
                      onSelectDest(selected || null);
                    }}
                    className="w-full bg-transparent text-xs text-white focus:outline-none cursor-pointer"
                  >
                    <option value="" disabled className="bg-slate-900 text-slate-400">Select Destination Location...</option>
                    {validNodes.map((n) => (
                      <option key={n.id} value={n.id} className="bg-slate-900 text-white">
                        {n.name} ({n.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={onCalculateRoute}
                  disabled={!startNode || !destNode}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold font-display flex items-center justify-center gap-2 transition-all ${
                    startNode && destNode
                      ? 'btn-gradient shadow-glow-cyan cursor-pointer'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  }`}
                >
                  <Navigation className="w-4 h-4" /> Compute Dijkstra Route
                </button>

                <button
                  onClick={onResetRoute}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
                  title="Reset Route"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Route Summary Stats */}
              {routeData && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3 p-3 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs">
                      <Footprints className="w-4 h-4 text-cyan-400" />
                      <span className="font-bold text-white">{routeData.formattedDistance}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Clock className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold text-emerald-400">{routeData.formattedWalkingTime}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowStepDetails(!showStepDetails)}
                    className="w-full text-center text-[11px] font-bold font-display text-cyan-400 hover:underline pt-1 flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>{showStepDetails ? 'Hide Steps' : 'View Step-by-Step Directions'}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showStepDetails ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Turn-by-Turn Steps */}
                  {showStepDetails && routeData.stepInstructions && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-1.5 pt-2 border-t border-cyan-500/20 max-h-40 overflow-y-auto pr-1"
                    >
                      {routeData.stepInstructions.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-300">
                          <CheckCircle className="w-3.5 h-3.5 text-cyan-400 mt-0.5 flex-shrink-0" />
                          <span>{step}</span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      </div>

      {/* Floating Map Zoom & Controls Widget */}
      <div className="absolute bottom-6 right-4 z-[1000] flex flex-col gap-2 pointer-events-auto">
        <button
          onClick={onZoomIn}
          className="p-3 rounded-2xl glass-panel text-slate-200 hover:text-cyan-400 hover:border-cyan-500/50 shadow-xl transition-all cursor-pointer"
          title="Zoom In"
        >
          <Plus className="w-5 h-5" />
        </button>
        <button
          onClick={onZoomOut}
          className="p-3 rounded-2xl glass-panel text-slate-200 hover:text-cyan-400 hover:border-cyan-500/50 shadow-xl transition-all cursor-pointer"
          title="Zoom Out"
        >
          <Minus className="w-5 h-5" />
        </button>
        <button
          onClick={onFitBounds}
          className="p-3 rounded-2xl glass-panel text-slate-200 hover:text-cyan-400 hover:border-cyan-500/50 shadow-xl transition-all cursor-pointer"
          title="Fit Campus View"
        >
          <Maximize2 className="w-5 h-5" />
        </button>
      </div>
    </>
  );
};
