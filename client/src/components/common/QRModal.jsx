import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, CheckCircle, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const QRModal = ({ isOpen, onClose, title, qrData }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative text-center"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-full bg-cyan-500/20 text-cyan-400 mx-auto flex items-center justify-center mb-3 border border-cyan-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>

          <h3 className="text-lg font-bold text-white mb-1">{title || 'Campus QR Access Ticket'}</h3>
          <p className="text-xs text-slate-400 mb-6">Scan at building turnstile or asset cabinet reader for automated verification.</p>

          <div className="bg-white p-5 rounded-2xl inline-block shadow-inner mb-4 border border-slate-200">
            <QRCodeSVG value={qrData || 'CAMPUS-GENERIC-QR-2026'} size={180} level="H" includeMargin={true} />
          </div>

          <p className="text-xs font-mono text-cyan-400 bg-slate-800/80 py-1.5 px-3 rounded-lg inline-block border border-slate-700">
            {qrData || 'CAMPUS-GENERIC-QR-2026'}
          </p>

          <button
            onClick={onClose}
            className="w-full mt-6 btn-gradient py-2.5 rounded-xl font-medium text-sm"
          >
            Close Access Card
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
