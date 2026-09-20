import React from 'react';
import { motion } from 'framer-motion';
import { StoryOverlay } from '../components/ui/StoryOverlay';
import { MagicalButton } from '../components/ui/MagicalButton';
import { birthdayConfig } from '../config/birthdayConfig';

export const DreamWorldOverlay = ({ onFollowMagic }) => {
  return (
    <div className="fixed inset-0 z-20 flex flex-col items-center justify-center pointer-events-none p-6">
      <StoryOverlay isVisible={true} className="glass-panel rounded-3xl p-8 border border-white/20">
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.3 }}
          className="text-lg md:text-xl font-cormorant italic text-purple-200"
        >
          {birthdayConfig.narrative.scene2.welcome}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.8 }}
          className="text-4xl md:text-6xl font-cinzel font-bold tracking-widest my-3 text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-200 to-amber-200 text-glow-pink"
        >
          {birthdayConfig.name} ✨
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 1.4 }}
          className="text-sm md:text-base font-inter text-purple-200/80 mb-6 font-light"
        >
          {birthdayConfig.narrative.scene2.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 2.0 }}
        >
          <MagicalButton
            id="follow-magic-btn"
            variant="primary"
            size="lg"
            onClick={onFollowMagic}
          >
            {birthdayConfig.narrative.scene2.buttonText}
          </MagicalButton>
        </motion.div>
      </StoryOverlay>
    </div>
  );
};
