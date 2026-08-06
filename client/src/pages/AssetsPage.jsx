import React, { useState } from 'react';
import { MOCK_ASSETS } from '../data/mockData';
import { AssetCard } from '../components/booking/AssetCard';
import { BookingForm } from '../components/booking/BookingForm';
import { GlassCard } from '../components/common/GlassCard';
import { Package, Search, Filter, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AssetsPage = () => {
  const { user } = useAuth();
  const [assets, setAssets] = useState(MOCK_ASSETS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedAssetForBooking, setSelectedAssetForBooking] = useState(null);

  const categories = ['All', 'Electronics', 'VR Headset', 'Drone', '3D Printer', 'Projector'];

  const filteredAssets = assets.filter((ast) => {
    const matchesCat = selectedCategory === 'All' || ast.category === selectedCategory;
    const matchesSearch = ast.assetName.toLowerCase().includes(searchQuery.toLowerCase()) || ast.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-indigo-400" /> High-Value Campus Asset Inventory
          </h1>
          <p className="text-xs text-slate-400">
            Reserve lab hardware, VR dev kits, MacBooks, drones, and 3D printing equipment
          </p>
        </div>

        {user?.role === 'Administrator' && (
          <button
            onClick={() => alert('New Asset Addition modal triggered')}
            className="btn-gradient px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Asset Unit
          </button>
        )}
      </div>

      {/* Filters Bar */}
      <GlassCard className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search equipment by name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full glass-input pl-10 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Asset Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssets.map((ast) => (
          <AssetCard key={ast._id} asset={ast} onReserve={(item) => setSelectedAssetForBooking(item)} />
        ))}
      </div>

      {/* Booking Form Overlay Modal */}
      {selectedAssetForBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
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
