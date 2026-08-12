import React from 'react';
import { motion } from 'framer-motion';

export const GlassCard = ({ children, className = '', hover = true, glow = false, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { y: -4 } : undefined}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className={`glass-card p-5 md:p-6 ${hover ? 'hover:border-cyan-500/30 hover:shadow-glow-cyan' : ''} ${glow ? 'shadow-glow-cyan' : ''} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};
