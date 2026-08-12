import React, { useState, useEffect } from 'react';
import { MOCK_ASSETS } from '../data/mockData';
import { AssetCard } from '../components/booking/AssetCard';
import { BookingForm } from '../components/booking/BookingForm';
import { GlassCard } from '../components/common/GlassCard';
import { Package, Search, Filter, Plus, Loader2, Cpu, Zap, Camera } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import { motion } from 'framer-motion';

const CATEGORY_CONFIG = {
  'All':         { color: 'text-slate-400', bg: 'bg-slate-800/60',    border: 'border-slate-700/50',    icon: Package },
  'Electronics': { color: 'text-cyan-400',  bg: 'bg-cyan-500/15',    border: 'border-cyan-500/25',    icon: Cpu },
  'VR Headset':  { color: 'text-indigo-400',bg: 'bg-indigo-500/15',  border: 'border-indigo-500/25',  icon: Zap },
  'Drone':       { color: 'text-rose-400',  bg: 'bg-rose-500/15',    border: 'border-rose-500/25',    icon: Camera },
  '3D Printer':  { color: 'text-emerald-400',bg: 'bg-emerald-500/15',border: 'border-emerald-500/25', icon: Package },
  'Projector':   { color: 'text-amber-400', bg: 'bg-amber-500/15',   border: 'border-amber-500/25',   icon: Zap },
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } }
};

export const AssetsPage = () => {
  const { user } = useAuth();
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedAssetForBooking, setSelectedAssetForBooking] = useState(null);

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const res = await apiService.getAssets();
      if (res && res.data && Array.isArray(res.data)) {
        setAssets(res.data);
      } else {
        setAssets(MOCK_ASSETS);
      }
    } catch (err) {
      console.error('[AssetsPage fetch error]', err);
      setAssets(MOCK_ASSETS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAssets(); }, []);

  const categories = ['All', 'Electronics', 'VR Headset', 'Drone', '3D Printer', 'Projector'];

  const filteredAssets = assets.filter((ast) => {
    const matchesCat = selectedCategory === 'All' || ast.category === selectedCategory;
    const matchesSearch = (ast.assetName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (ast.location || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/25">
              <Package className="w-5 h-5" />
            </div>
            High-Value Campus Asset Inventory
          </h1>
          <p className="text-xs text-slate-400 mt-1 ml-12">
            Reserve lab hardware, VR dev kits, MacBooks, drones, and 3D printing equipment
          </p>
        </div>

        {user?.role === 'Administrator' && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => alert('New Asset Addition modal triggered')}
            className="btn-gradient px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 flex-shrink-0"
          >
            <Plus className="w-4 h-4" /> Add Asset Unit
          </motion.button>
        )}
      </div>

      {/* Filters Bar */}
      <GlassCard hover={false} className="p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Search */}
          <div className="relative w-full sm:w-72 flex-shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search equipment by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full glass-input pl-10 text-xs"
            />
          </div>

          {/* Category filter chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-0.5 flex-1">
            {categories.map((cat) => {
              const cfg = CATEGORY_CONFIG[cat] || CATEGORY_CONFIG['All'];
              const CatIcon = cfg.icon;
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 flex-shrink-0 border ${
                    isActive
                      ? `${cfg.bg} ${cfg.color} ${cfg.border} shadow-sm`
                      : 'bg-slate-900/60 text-slate-400 border-slate-800/70 hover:text-slate-200'
                  }`}
                >
                  <CatIcon className="w-3.5 h-3.5" />
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </GlassCard>

      {/* Result count */}
      {!loading && (
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Filter className="w-3.5 h-3.5" />
          <span>Showing <strong className="text-slate-300">{filteredAssets.length}</strong> of {assets.length} assets</span>
        </div>
      )}

      {/* Asset Grid */}
      {loading ? (
        <GlassCard hover={false} className="p-12 text-center flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
          <p className="text-xs text-slate-400">Loading asset inventory...</p>
        </GlassCard>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {filteredAssets.length === 0 ? (
            <GlassCard hover={false} className="col-span-full p-12 text-center">
              <p className="text-slate-400 text-sm">No assets found matching your search.</p>
            </GlassCard>
          ) : (
            filteredAssets.map((ast) => (
              <motion.div key={ast._id} variants={itemVariants}>
                <AssetCard asset={ast} onReserve={(item) => setSelectedAssetForBooking(item)} />
              </motion.div>
            ))
          )}
        </motion.div>
      )}

      {/* Booking Modal */}
      {selectedAssetForBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <BookingForm
            targetItem={selectedAssetForBooking}
            bookingType="Asset"
            onClose={() => setSelectedAssetForBooking(null)}
          />
        </div>
      )}
    </div>
  );
};
