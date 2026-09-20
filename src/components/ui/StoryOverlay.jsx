import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const StoryOverlay = ({ children, isVisible = true, className = '' }) => {
  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 25, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className={`relative z-20 pointer-events-auto flex flex-col items-center justify-center text-center max-w-2xl px-6 py-8 ${className}`}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
