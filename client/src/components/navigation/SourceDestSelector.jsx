import { MapPin, Navigation, ArrowRight } from 'lucide-react';
import { MOCK_BUILDINGS } from '../../data/mockData';
import { useNavigation } from '../../context/NavigationContext';

export const SourceDestSelector = () => {
  const { sourceBuilding, setSourceBuilding, destBuilding, setDestBuilding, calculateRoute } = useNavigation();

  const handleSwap = () => {
    const temp = sourceBuilding;
    setSourceBuilding(destBuilding);
    setDestBuilding(temp);
    calculateRoute(destBuilding, temp);
  };

  const handleRouteClick = () => {
    calculateRoute(sourceBuilding, destBuilding);
  };

  return (
    <div className="glass-panel p-5 rounded-2xl border border-cyan-500/20 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Navigation className="w-4 h-4 text-cyan-400" /> Smart Spatial Routing Matrix
        </h3>
        <span className="text-[10px] text-cyan-400 font-mono bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20">
          A* Haversine Engine
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] items-center gap-3">
        {/* Source Selector */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Starting Origin Point</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
            <select
              value={sourceBuilding?._id || ''}
              onChange={(e) => {
                const b = MOCK_BUILDINGS.find((x) => x._id === e.target.value);
                setSourceBuilding(b);
              }}
              className="w-full glass-input pl-9 pr-3 py-2 text-xs font-semibold text-white bg-slate-900/80"
            >
              {MOCK_BUILDINGS.map((b) => (
                <option key={b._id} value={b._id} className="bg-slate-900 text-white">
                  {b.code} - {b.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center pt-4 md:pt-0">
          <button
            onClick={handleSwap}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-400 border border-slate-700 transition-colors"
            title="Swap Origin and Destination"
          >
            <ArrowRight className="w-4 h-4 md:rotate-0 rotate-90" />
          </button>
        </div>

        {/* Destination Selector */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Destination Target</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-400" />
            <select
              value={destBuilding?._id || ''}
              onChange={(e) => {
                const b = MOCK_BUILDINGS.find((x) => x._id === e.target.value);
                setDestBuilding(b);
              }}
              className="w-full glass-input pl-9 pr-3 py-2 text-xs font-semibold text-white bg-slate-900/80"
            >
              {MOCK_BUILDINGS.map((b) => (
                <option key={b._id} value={b._id} className="bg-slate-900 text-white">
                  {b.code} - {b.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <button
        onClick={handleRouteClick}
        className="w-full btn-gradient py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
      >
        <Navigation className="w-4 h-4" /> Calculate Optimal Pedestrian Route
      </button>
    </div>
  );
};
