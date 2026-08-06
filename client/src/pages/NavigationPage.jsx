import React from 'react';
import { MapPage } from './MapPage';
import { Navigation } from 'lucide-react';

export const NavigationPage = () => {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl md:text-2xl font-black font-display text-white flex items-center gap-2">
          <Navigation className="w-6 h-6 text-cyan-400" /> Multi-Modal Smart Campus Navigation
        </h1>
        <p className="text-xs text-slate-400">
          Spatial localization analytics engine with Dijkstra shortest-path navigation & turn-by-turn guidance
        </p>
      </div>

      <MapPage />
    </div>
  );
};
