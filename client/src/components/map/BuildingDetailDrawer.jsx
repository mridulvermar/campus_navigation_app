import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Clock, 
  MapPin, 
  Layers, 
  Building2, 
  Navigation, 
  BookOpen, 
  Utensils, 
  Trophy, 
  Car, 
  Cross, 
  Bus, 
  ShieldAlert, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const categoryIconMap = {
  'Academic Buildings': Building2,
  'Hostel': Building2,
  'Sports Complex': Trophy,
  'Library': BookOpen,
  'Cafeteria': Utensils,
  'Parking': Car,
  'Medical Centre': Cross,
  'Bus Stop': Bus,
  'Administration Block': ShieldAlert,
  'Auditorium': Sparkles
};

export const BuildingDetailDrawer = ({
  building,
  onClose,
  onSetStart,
  onSetDestination,
  onStartRoute
}) => {
  if (!building) return null;

  const IconComponent = categoryIconMap[building.category] || Building2;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="fixed bottom-20 left-4 right-4 md:bottom-6 md:left-auto md:right-6 md:w-96 z-50 glass-panel p-5 rounded-3xl border border-cyan-500/40 shadow-2xl backdrop-blur-2xl max-h-[80vh] overflow-y-auto"
      >
        {/* Top Header Bar */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 text-cyan-400 border border-cyan-500/30">
              <IconComponent className="w-6 h-6" />
            </div>
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[10px] font-bold uppercase tracking-wider font-display">
                {building.category}
              </span>
              <h3 className="text-base md:text-lg font-extrabold font-display text-white mt-1 leading-tight">
                {building.name}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Image Preview if available */}
        {building.image && (
          <div className="mt-4 rounded-2xl overflow-hidden border border-slate-800 relative h-36">
            <img
              src={building.image}
              alt={building.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-[10px] font-bold font-mono text-cyan-400 border border-cyan-500/30">
              {building.code}
            </div>
          </div>
        )}

        {/* Working Hours & Quick Info */}
        <div className="flex items-center gap-4 mt-4 text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold">{building.workingHours}</span>
          </div>
        </div>

        {/* Description */}
        <div className="mt-4 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-display">Overview</span>
          <p className="text-xs text-slate-300 leading-relaxed">{building.description}</p>
        </div>

        {/* Departments */}
        {building.departments && building.departments.length > 0 && (
          <div className="mt-4 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-display">Departments & Divisions</span>
            <div className="flex flex-wrap gap-1.5">
              {building.departments.map((dept, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-200 text-[11px] font-medium border border-slate-700/60"
                >
                  {dept}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Floor Breakdown */}
        {building.floors && building.floors.length > 0 && (
          <div className="mt-4 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-display flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-indigo-400" /> Floor Directory
            </span>
            <div className="space-y-1.5">
              {building.floors.map((flr, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded-lg bg-slate-900/80 text-[11px] text-slate-300 border border-slate-800/80"
                >
                  {flr}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Route Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-5">
          <button
            onClick={() => onSetStart(building)}
            className="btn-secondary py-2.5 text-xs font-bold font-display"
          >
            Set Start
          </button>
          <button
            onClick={() => onSetDestination(building)}
            className="btn-gradient py-2.5 text-xs font-bold font-display"
          >
            <Navigation className="w-4 h-4" /> Route Here
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
