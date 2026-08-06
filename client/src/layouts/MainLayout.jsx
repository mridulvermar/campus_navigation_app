import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Sidebar } from '../components/common/Sidebar';
import { Footer } from '../components/common/Footer';
import { MobileBottomNav } from '../components/common/MobileBottomNav';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export const MainLayout = () => {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-white">
      {/* Navbar with Drawer Trigger */}
      <Navbar onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)} />

      {/* Main Body Layout */}
      <div className="flex flex-1 max-w-7xl w-full mx-auto px-3 sm:px-4 md:px-6 py-4 md:py-6 gap-6">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Main Content Viewport with Framer Motion Page Transition */}
        <main className="flex-1 w-full min-w-0 overflow-x-hidden pb-24 lg:pb-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Footer */}
      <Footer />

      {/* Mobile Bottom Bar (visible on small/medium screens) */}
      <MobileBottomNav onOpenDrawer={() => setIsMobileDrawerOpen(true)} />

      {/* Mobile Slide-In Side Navigation Drawer */}
      <AnimatePresence>
        {isMobileDrawerOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileDrawerOpen(false)}
              className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md lg:hidden"
            />

            {/* Slide-out Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 left-0 bottom-0 z-50 w-72 bg-slate-900 border-r border-slate-800 shadow-2xl flex flex-col lg:hidden"
            >
              {/* Drawer Header */}
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <span className="font-display font-bold text-sm bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent uppercase tracking-wider">
                  CampusNav Menu
                </span>
                <button
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
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

