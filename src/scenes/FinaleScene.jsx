import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ConstellationMorph } from '../components/3d/ConstellationMorph';
import { MemorySky } from '../components/3d/MemorySky';
import { MagicalButton } from '../components/ui/MagicalButton';
import { birthdayConfig } from '../config/birthdayConfig';
import { Heart, Sparkles, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

// 3D portion
export const Finale3D = ({ morphMode, collectedMemories }) => {
  return (
    <>
      <ConstellationMorph mode={morphMode} memories={collectedMemories} />
      <MemorySky collectedMemories={collectedMemories} />
    </>
  );
};

// HTML UI overlay
export const FinaleOverlay = ({ morphMode, showLetter, onReplay }) => {
  const cfg = birthdayConfig.narrative.scene6;

  return (
    <div className="fixed inset-0 z-20 flex flex-col items-center justify-center p-4 md:p-8 pointer-events-none overflow-y-auto">
      {/* Step Indicator Header */}
      {!showLetter && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-12 glass-panel px-6 py-3 rounded-full border border-pink-400/30 text-center"
        >
          <p className="font-cinzel text-sm md:text-base text-pink-200 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
            <span>{morphMode === 'heart' ? "All memories form a glowing heart..." : `The stars align for ${birthdayConfig.name}... ✨`}</span>
          </p>
        </motion.div>
      )}

      {/* The Grand Birthday Card & Letter */}
      <AnimatePresence>
        {showLetter && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="glass-panel p-6 md:p-10 rounded-3xl border border-pink-400/40 text-center max-w-2xl shadow-[0_20px_60px_rgba(0,0,0,0.7)] pointer-events-auto my-auto relative overflow-hidden"
          >
            {/* Subtle background stars overlay */}
            <div className="absolute inset-0 stars-overlay opacity-30 pointer-events-none" />

            {/* Glowing header icon */}
            <div className="flex justify-center mb-3">
              <div className="p-3.5 rounded-full bg-pink-500/20 border border-pink-400/40 text-pink-300 shadow-[0_0_20px_rgba(244,114,182,0.5)]">
                <Heart className="w-8 h-8 fill-pink-400 text-pink-300 animate-pulse" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl font-cinzel font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-amber-200 to-purple-200 text-glow-pink mb-4">
              {cfg.birthdayWishTitle}
            </h1>

            {/* Letter Paragraphs */}
            <div className="space-y-3.5 text-purple-100 font-cormorant italic text-base md:text-xl leading-relaxed text-left md:text-center px-2">
              {cfg.paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            {/* Closing & Sender */}
            <div className="mt-6 pt-5 border-t border-white/15 flex flex-col items-center">
              <p className="font-greatVibes text-2xl md:text-3xl text-amber-200 drop-shadow">
                {cfg.closing}
              </p>
              {birthdayConfig.senderName && (
                <p className="font-cinzel text-xs md:text-sm text-purple-300/80 tracking-widest mt-2 uppercase">
                  {birthdayConfig.senderName}
                </p>
              )}

              <MagicalButton
                id="replay-btn"
                variant="gold"
                size="md"
                onClick={onReplay}
                className="mt-6"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                {cfg.replayBtn}
              </MagicalButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
