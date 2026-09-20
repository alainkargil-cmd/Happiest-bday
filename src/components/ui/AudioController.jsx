import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { audioManager } from '../../utils/audioManager';

export const AudioController = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleSound = () => {
    const muted = audioManager.toggleMute();
    setIsMuted(muted);
    setIsPlaying(!muted);
  };

  return (
    <div className="fixed top-5 right-5 z-50 flex items-center gap-2">
      <motion.button
        id="audio-toggle-btn"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        onClick={toggleSound}
        title={isMuted ? "Unmute Magical Sounds" : "Mute Sounds"}
        className="p-3 rounded-full glass-panel text-white/90 hover:text-amber-300 transition-colors shadow-lg border border-white/20 backdrop-blur-md flex items-center gap-2 group cursor-pointer"
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5 text-rose-400" />
        ) : (
          <>
            <Volume2 className="w-5 h-5 text-amber-300" />
            <span className="flex space-x-0.5 items-end h-3">
              <span className="w-0.5 h-1.5 bg-amber-300 rounded-full animate-bounce" style={{ animationDuration: '0.6s' }} />
              <span className="w-0.5 h-3 bg-pink-400 rounded-full animate-bounce" style={{ animationDuration: '0.8s', animationDelay: '0.1s' }} />
              <span className="w-0.5 h-2 bg-purple-300 rounded-full animate-bounce" style={{ animationDuration: '0.7s', animationDelay: '0.2s' }} />
            </span>
          </>
        )}
      </motion.button>
    </div>
  );
};
