import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MagicalEnvelope } from '../components/3d/MagicalEnvelope';
import { MagicalButton } from '../components/ui/MagicalButton';
import { StoryOverlay } from '../components/ui/StoryOverlay';
import { birthdayConfig } from '../config/birthdayConfig';
import { audioManager } from '../utils/audioManager';

// 3D portion for Inside Canvas
export const Intro3D = ({ isOpening, onOpenComplete }) => {
  return <MagicalEnvelope isOpen={isOpening} onOpenComplete={onOpenComplete} />;
};

// HTML UI overlay for Outside Canvas
export const IntroOverlay = ({ onEnterDream, isOpening, setIsOpening }) => {
  const [stage, setStage] = useState(0);

  React.useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 1600);
    const t2 = setTimeout(() => setStage(2), 3000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const handleEnterClick = () => {
    if (isOpening) return;
    setIsOpening(true);
    audioManager.playEnvelopeOpen();
    audioManager.playBgm();
  };

  return (
    <div className="fixed inset-0 z-20 flex flex-col items-center justify-between py-12 pointer-events-none">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 1.5 }}
        className="text-xs tracking-widest uppercase font-cinzel text-purple-300/80"
      >
        ✨ A Celestial Birthday Journey ✨
      </motion.div>

      <StoryOverlay isVisible={!isOpening}>
        {stage >= 0 && (
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0 }}
            className="text-lg md:text-xl font-cormorant italic text-purple-200/90 mb-2 font-light"
          >
            {birthdayConfig.narrative.scene1.pretitle}
          </motion.p>
        )}

        {stage >= 1 && (
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0 }}
            className="text-sm md:text-base font-inter text-pink-300 tracking-wide mb-6"
          >
            {birthdayConfig.narrative.scene1.subtitle}
          </motion.p>
        )}

        {stage >= 2 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, type: "spring" }}
            className="flex flex-col items-center space-y-6"
          >
            <h1 className="text-5xl md:text-7xl font-cinzel font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-pink-300 to-purple-200 drop-shadow-[0_0_25px_rgba(251,191,36,0.6)]">
              {birthdayConfig.name}
            </h1>

            <MagicalButton
              id="enter-dream-btn"
              variant="gold"
              size="lg"
              onClick={handleEnterClick}
              className="mt-4"
            >
              {birthdayConfig.narrative.scene1.buttonText}
            </MagicalButton>
          </motion.div>
        )}
      </StoryOverlay>

      <div className="h-6" />
    </div>
  );
};
