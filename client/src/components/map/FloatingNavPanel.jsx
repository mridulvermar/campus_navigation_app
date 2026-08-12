import React, { useState, useMemo } from 'react';
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
  Car,
  Clock,
  CheckCircle,
  X,
  BookOpen,
  Building2,
  List
} from 'lucide-react';
import { getAllSelectableLocations, searchLocations } from '../../services/mapEngine/locationService';
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
  onToggleFullScreen,
  navMode = 'pedestrian',
  onToggleNavMode
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  const [showStepDetails, setShowStepDetails] = useState(false);
  const [showPlacesDrawer, setShowPlacesDrawer] = useState(false);
  const [placesCategoryFilter, setPlacesCategoryFilter] = useState('All');

  const allLocations = useMemo(() => getAllSelectableLocations(), []);
  const searchResults = useMemo(() => searchLocations(searchQuery), [searchQuery]);

  const handleSelectSearchResult = (node) => {
    onSelectDest(node);
    setSearchQuery('');
    setIsSearchFocused(false);
  };

  const handleSelectStartItem = (id) => {
    const matched = allLocations.find((loc) => loc.id === id || loc.roomId === id);
    if (matched) {
      onSelectStart(matched);
    }
  };

  const handleSelectDestItem = (id) => {
    const matched = allLocations.find((loc) => loc.id === id || loc.roomId === id);
    if (matched) {
      onSelectDest(matched);
    }
  };

  const classrooms = useMemo(() => allLocations.filter((l) => l.type === 'room'), [allLocations]);
  const buildings = useMemo(() => allLocations.filter((l) => l.type === 'building' || l.type === 'campus_node'), [allLocations]);
  const tags = useMemo(() => allLocations.filter((l) => l.type === 'tag'), [allLocations]);

  const filteredPlacesList = useMemo(() => {
    if (placesCategoryFilter === 'Classrooms') return classrooms;
    if (placesCategoryFilter === 'Buildings') return buildings;
    if (placesCategoryFilter === 'Landmarks') return tags;
    return allLocations;
  }, [placesCategoryFilter, classrooms, buildings, tags, allLocations]);

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
                <p className="text-[10px] text-slate-400">Classrooms & Dual-Mode Dijkstra</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShowPlacesDrawer(!showPlacesDrawer)}
                className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 text-xs font-bold font-display border border-cyan-500/30 flex items-center gap-1 transition-all"
                title="Browse Places & Classrooms"
              >
                <List className="w-3.5 h-3.5" /> Places
              </button>

              <button
                onClick={() => setIsPanelCollapsed(!isPanelCollapsed)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                {isPanelCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {!isPanelCollapsed && (
            <div className="space-y-3">
              {/* Travel Mode Selector: Pedestrian vs Driving */}
              <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => onToggleNavMode && onToggleNavMode('pedestrian')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold font-display flex items-center justify-center gap-1.5 transition-all ${
                    navMode === 'pedestrian'
                      ? 'bg-cyan-500 text-slate-950 shadow-md font-extrabold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Footprints className="w-3.5 h-3.5" /> 🚶 Pedestrian
                </button>
                <button
                  type="button"
                  onClick={() => onToggleNavMode && onToggleNavMode('vehicle')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold font-display flex items-center justify-center gap-1.5 transition-all ${
                    navMode === 'vehicle'
                      ? 'bg-cyan-500 text-slate-950 shadow-md font-extrabold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Car className="w-3.5 h-3.5" /> 🚗 Driving
                </button>
              </div>
              {/* Autocomplete Search Bar */}
              <div className="relative">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400" />
                  <input
                    type="text"
                    placeholder="Search classrooms (e.g. CS 201, AI Lab, IT 001)..."
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
                    className="absolute left-0 right-0 top-full mt-1 bg-slate-900/95 border border-cyan-500/40 rounded-2xl shadow-2xl max-h-64 overflow-y-auto z-[1100] p-1.5 backdrop-blur-xl"
                  >
                    {searchResults.slice(0, 25).map((loc) => (
                      <button
                        key={loc.roomId || loc.id}
                        onClick={() => handleSelectSearchResult(loc)}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-cyan-500/10 hover:border hover:border-cyan-500/30 transition-all flex items-center justify-between text-xs cursor-pointer group mb-1"
                      >
                        <div>
                          <span className="font-bold font-display text-white group-hover:text-cyan-400 transition-colors block">
                            {loc.name}
                          </span>
                          <span className="text-[10px] text-slate-400">{loc.category}</span>
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
                    value={startNode ? (startNode.roomId || startNode.id) : ''}
                    onChange={(e) => handleSelectStartItem(e.target.value)}
                    className="w-full bg-transparent text-xs text-white focus:outline-none cursor-pointer"
                  >
                    <option value="" disabled className="bg-slate-900 text-slate-400">Select Start Location / Classroom...</option>
                    
                    <optgroup label="🏫 Classrooms & Labs" className="bg-slate-900 text-cyan-400 font-bold">
                      {classrooms.map((c) => (
                        <option key={c.roomId} value={c.roomId} className="bg-slate-900 text-white font-normal">
                          {c.name}
                        </option>
                      ))}
                    </optgroup>

                    <optgroup label="🏢 Buildings & Academic Blocks" className="bg-slate-900 text-cyan-400 font-bold">
                      {buildings.map((b) => (
                        <option key={b.id} value={b.id} className="bg-slate-900 text-white font-normal">
                          {b.name}
                        </option>
                      ))}
                    </optgroup>

                    <optgroup label="📌 Landmarks & Gates" className="bg-slate-900 text-cyan-400 font-bold">
                      {tags.map((t) => (
                        <option key={t.id} value={t.id} className="bg-slate-900 text-white font-normal">
                          {t.name}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                {/* Destination Location */}
                <div className="flex items-center gap-2 bg-slate-900/70 p-2 rounded-xl border border-slate-800">
                  <Navigation className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <select
                    value={destNode ? (destNode.roomId || destNode.id) : ''}
                    onChange={(e) => handleSelectDestItem(e.target.value)}
                    className="w-full bg-transparent text-xs text-white focus:outline-none cursor-pointer"
                  >
                    <option value="" disabled className="bg-slate-900 text-slate-400">Select Destination / Classroom...</option>

                    <optgroup label="🏫 Classrooms & Labs" className="bg-slate-900 text-cyan-400 font-bold">
                      {classrooms.map((c) => (
                        <option key={c.roomId} value={c.roomId} className="bg-slate-900 text-white font-normal">
                          {c.name}
                        </option>
                      ))}
                    </optgroup>

                    <optgroup label="🏢 Buildings & Academic Blocks" className="bg-slate-900 text-cyan-400 font-bold">
                      {buildings.map((b) => (
                        <option key={b.id} value={b.id} className="bg-slate-900 text-white font-normal">
                          {b.name}
                        </option>
                      ))}
                    </optgroup>

                    <optgroup label="📌 Landmarks & Gates" className="bg-slate-900 text-cyan-400 font-bold">
                      {tags.map((t) => (
                        <option key={t.id} value={t.id} className="bg-slate-900 text-white font-normal">
                          {t.name}
                        </option>
                      ))}
                    </optgroup>
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

      {/* Places & Classrooms Directory Slide-Out Drawer */}
      <AnimatePresence>
        {showPlacesDrawer && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            className="fixed inset-y-0 left-0 w-full sm:w-96 bg-slate-950/95 border-r border-cyan-500/30 z-[1200] p-5 shadow-2xl backdrop-blur-2xl flex flex-col pointer-events-auto"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                  <List className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold font-display text-white">Campus Places & Classrooms</h3>
                  <p className="text-[10px] text-slate-400">428 Classrooms, Labs & Landmarks</p>
                </div>
              </div>
              <button
                onClick={() => setShowPlacesDrawer(false)}
                className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 my-4 bg-slate-900/80 p-1 rounded-xl border border-slate-800 text-[11px] font-bold font-display">
              {['All', 'Classrooms', 'Buildings', 'Landmarks'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setPlacesCategoryFilter(cat)}
                  className={`flex-1 py-1.5 rounded-lg transition-all ${
                    placesCategoryFilter === cat
                      ? 'bg-cyan-500 text-slate-950 shadow-md font-extrabold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Places List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {filteredPlacesList.map((place) => (
                <div
                  key={place.roomId || place.id}
                  className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-all space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-bold font-display text-white">{place.name}</h4>
                      <span className="text-[10px] text-slate-400 block">{place.category}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1 border-t border-slate-800/60">
                    <button
                      onClick={() => {
                        handleSelectStartItem(place.roomId || place.id);
                        setShowPlacesDrawer(false);
                      }}
                      className="flex-1 py-1 px-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-[10px] font-bold font-display border border-emerald-500/20 text-center"
                    >
                      Set Start 📍
                    </button>

                    <button
                      onClick={() => {
                        handleSelectDestItem(place.roomId || place.id);
                        onCalculateRoute();
                        setShowPlacesDrawer(false);
                      }}
                      className="flex-1 py-1 px-2 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 text-[10px] font-bold font-display border border-cyan-500/20 text-center"
                    >
                      Navigate Dest 🏁
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
