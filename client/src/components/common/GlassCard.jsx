import React from 'react';
import { motion } from 'framer-motion';

export const GlassCard = ({ children, className = '', hover = true, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { y: -3 } : undefined}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`glass-card p-5 md:p-6 ${hover ? 'hover:border-cyan-500/40 hover:shadow-glow-cyan' : ''} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

