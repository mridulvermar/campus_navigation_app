import React, { useState } from 'react';
import { GlassCard } from '../common/GlassCard';
import { Badge } from '../common/Badge';
import { QrCode, Calendar, MapPin, CheckCircle, Clock } from 'lucide-react';
import { QRModal } from '../common/QRModal';

export const AssetCard = ({ asset, onReserve }) => {
  const [showQR, setShowQR] = useState(false);

  return (
    <GlassCard className="flex flex-col justify-between overflow-hidden group">
      <div>
        {/* Asset Image */}
        <div className="relative h-44 -mx-6 -mt-6 mb-4 overflow-hidden">
          <img
            src={asset.image || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=600'}
            alt={asset.assetName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 right-3">
            <Badge
              variant={asset.status === 'Available' ? 'success' : asset.status === 'Reserved' ? 'warning' : 'danger'}
            >
              {asset.status}
            </Badge>
          </div>
          <div className="absolute bottom-2 left-3 text-[10px] font-mono text-white bg-slate-950/70 backdrop-blur-md px-2 py-0.5 rounded">
            {asset.category}
          </div>
        </div>

        <h4 className="text-base font-bold text-white mb-1">{asset.assetName}</h4>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
          <MapPin className="w-3.5 h-3.5 text-cyan-400" />
          <span className="truncate">{asset.location}</span>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
        <button
          onClick={() => setShowQR(true)}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 border border-slate-700 transition-colors"
          title="View Quick Asset QR Tag"
        >
          <QrCode className="w-4 h-4" />
        </button>

        <button
          onClick={() => onReserve(asset)}
          disabled={asset.status !== 'Available'}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            asset.status === 'Available'
              ? 'btn-gradient'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>{asset.status === 'Available' ? 'Reserve Asset' : 'Unavailable'}</span>
        </button>

        <QRModal
          isOpen={showQR}
          onClose={() => setShowQR(false)}
          title={asset.assetName}
          qrData={asset.serialNumber || `CAMPUS-ASSET-${asset._id}`}
        />
      </div>
    </GlassCard>
  );
};
