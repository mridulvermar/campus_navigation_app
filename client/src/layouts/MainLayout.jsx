import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Sidebar } from '../components/common/Sidebar';
import { Footer } from '../components/common/Footer';
import { MobileBottomNav } from '../components/common/MobileBottomNav';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Compass } from 'lucide-react';

export const MainLayout = () => {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-cyan-500/40 selection:text-cyan-200">

      {/* Subtle ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-[-5%] right-[10%] w-[500px] h-[500px] rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #06b6d4, transparent)', filter: 'blur(80px)' }}
        />
        <div
          className="absolute bottom-[10%] left-[5%] w-[400px] h-[400px] rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent)', filter: 'blur(80px)' }}
        />
      </div>

      {/* Navbar */}
      <Navbar onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)} />

      {/* Main Body Layout */}
      <div className="flex flex-1 max-w-7xl w-full mx-auto px-3 sm:px-4 md:px-6 py-4 md:py-6 gap-5 relative z-10">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Main Content with Page Transitions */}
        <main className="flex-1 w-full min-w-0 overflow-x-hidden pb-28 lg:pb-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <Footer />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav onOpenDrawer={() => setIsMobileDrawerOpen(true)} />

      {/* Mobile Side Drawer */}
      <AnimatePresence>
        {isMobileDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileDrawerOpen(false)}
              className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md lg:hidden"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 bottom-0 z-50 w-72 border-r border-slate-800/60 shadow-2xl flex flex-col lg:hidden"
              style={{
                background: 'rgba(8, 12, 22, 0.95)',
                backdropFilter: 'blur(32px)'
              }}
            >
              {/* Drawer Header */}
              <div className="p-4 border-b border-slate-800/60 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center">
                    <Compass className="w-5 h-5 text-white animate-spin-slow" />
                  </div>
                  <span className="font-display font-black text-sm bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                    CampusNav
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="p-1.5 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto">
                <Sidebar isMobile onItemClick={() => setIsMobileDrawerOpen(false)} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
