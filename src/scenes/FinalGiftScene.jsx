import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GiftBox } from '../components/3d/GiftBox';
import { MagicalButton } from '../components/ui/MagicalButton';
import { StoryOverlay } from '../components/ui/StoryOverlay';
import { birthdayConfig } from '../config/birthdayConfig';

// 3D portion
export const FinalGift3D = ({ countdown, isOpening }) => {
  return (
    <GiftBox
      id={999}
      position={[0, 0, 0]}
      scale={1.4}
      color="#701a75"
      ribbonColor="#facc15"
      isOpen={countdown === 'BOOM'}
      isOpening={isOpening}
      isFinal={true}
      isActive={!isOpening}
    />
  );
};

// HTML UI overlay
export const FinalGiftOverlay = ({ countdown, onStartCountdown }) => {
  return (
    <div className="fixed inset-0 z-20 flex flex-col items-center justify-between py-10 pointer-events-none px-4">
      <div className="h-4" />

      {countdown === null && (
        <StoryOverlay isVisible={true} className="glass-panel rounded-3xl p-8 border border-amber-300/40 text-center max-w-lg">
          <h1 className="text-3xl md:text-5xl font-cinzel font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-pink-300 to-purple-200 text-glow-gold mb-3">
            {birthdayConfig.narrative.scene5.title}
          </h1>
          <p className="text-sm md:text-base font-inter text-purple-200/90 mb-6">
            {birthdayConfig.narrative.scene5.subtitle}
          </p>
          <MagicalButton
            id="ready-final-gift-btn"
            variant="gold"
            size="lg"
            onClick={onStartCountdown}
          >
            {birthdayConfig.narrative.scene5.readyBtn}
          </MagicalButton>
        </StoryOverlay>
      )}

      {countdown !== null && countdown !== 'BOOM' && (
        <AnimatePresence mode="wait">
          <motion.div
            key={countdown}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1.3, opacity: 1 }}
            exit={{ scale: 1.8, opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="font-cinzel text-7xl md:text-9xl font-black text-amber-300 select-none"
          >
            {countdown}
          </motion.div>
        </AnimatePresence>
      )}

      {countdown === 'BOOM' && (
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1.1, opacity: 1 }}
          className="text-3xl md:text-5xl font-cinzel font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-yellow-200 to-cyan-200 text-glow-pink"
        >
          ✨ MAGICAL REVEAL ✨
        </motion.div>
      )}

      <div className="h-4" />
    </div>
  );
};
