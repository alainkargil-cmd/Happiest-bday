import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GiftBox } from '../components/3d/GiftBox';
import { FloatingPhotoCard } from '../components/3d/FloatingPhotoCard';
import { MemorySky } from '../components/3d/MemorySky';
import { MagicalButton } from '../components/ui/MagicalButton';
import { birthdayConfig } from '../config/birthdayConfig';
import { audioManager } from '../utils/audioManager';
import { Sparkles } from 'lucide-react';

// 3D components for inside Canvas
export const GiftMemory3D = ({
  collectedMemories,
  activeGiftIndex,
  openedGifts,
  revealingMemory,
  isFlyingToSky,
  giftPositions,
  onOpenGift,
  onHoverGift,
  onFlyFinish
}) => {
  const memories = birthdayConfig.memories || [];

  return (
    <>
      {/* Starry Memory Sky Constellation */}
      <MemorySky collectedMemories={collectedMemories} />

      {/* 3D Gift Boxes */}
      {memories.map((mem, idx) => {
        const isCurrent = idx === activeGiftIndex;
        const isOpened = !!openedGifts[mem.id];

        return (
          <GiftBox
            key={mem.id}
            id={mem.id}
            position={giftPositions[idx] || [0, 0, 0]}
            scale={isCurrent ? 1.15 : 0.95}
            color={mem.color || "#ec4899"}
            ribbonColor={mem.ribbonColor || "#fef08a"}
            isOpen={isOpened}
            isActive={isCurrent && !revealingMemory}
            onClick={() => onOpenGift(mem.id)}
            onHover={(id, isHov) => onHoverGift(isHov ? id : null)}
          />
        );
      })}

      {/* 3D Photo Card emerging from box */}
      {revealingMemory && (
        <FloatingPhotoCard
          memory={revealingMemory}
          boxPosition={giftPositions[memories.findIndex((m) => m.id === revealingMemory.id)] || [0, 0, 0]}
          isRevealed={true}
          isFlyingToSky={isFlyingToSky}
          skyTarget={[
            (collectedMemories.length - memories.length / 2) * 3,
            12,
            -10
          ]}
          onFlyToSkyFinish={onFlyFinish}
        />
      )}
    </>
  );
};

// HTML UI overlay for outside Canvas
export const GiftMemoryOverlay = ({
  collectedMemories,
  activeGiftIndex,
  revealingMemory,
  isFlyingToSky,
  hoveredGiftId,
  onContinueJourney
}) => {
  const memories = birthdayConfig.memories || [];

  return (
    <div className="fixed inset-0 z-20 flex flex-col items-center justify-between py-10 pointer-events-none px-4">
      {/* Top Header info */}
      <div className="glass-panel px-6 py-2.5 rounded-full border border-white/10 flex items-center gap-3">
        <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '8s' }} />
        <span className="font-cinzel text-xs md:text-sm text-purple-200">
          Memory Gifts: <strong className="text-amber-300 font-bold">{collectedMemories.length} / {memories.length}</strong>
        </span>
      </div>

      {/* Hover Hint when no gift is open */}
      {!revealingMemory && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="glass-panel px-8 py-4 rounded-2xl border border-white/15 text-center max-w-lg mb-12 shadow-2xl"
          >
            <h2 className="text-xl md:text-2xl font-cinzel font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-amber-200 mb-1">
              {birthdayConfig.narrative.scene4.title}
            </h2>
            <p className="text-xs md:text-sm font-inter text-purple-200/80">
              {hoveredGiftId
                ? "✨ Click to open this memory gift!"
                : `Select Gift #${activeGiftIndex + 1} waiting on the floating island ✨`}
            </p>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Active Memory Modal / Story Card */}
      {revealingMemory && !isFlyingToSky && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="glass-panel p-6 rounded-3xl border border-amber-300/30 text-center max-w-lg shadow-[0_15px_50px_rgba(0,0,0,0.6)] pointer-events-auto mb-10"
        >
          <div className="flex items-center justify-center gap-1.5 text-xs text-amber-300 font-cinzel tracking-wider uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{revealingMemory.date || "Cherished Memory"}</span>
          </div>

          <h3 className="text-2xl md:text-3xl font-cinzel font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-amber-200 to-purple-200 mb-2">
            {revealingMemory.title}
          </h3>

          <p className="text-sm md:text-base font-cormorant italic text-purple-100 font-normal leading-relaxed mb-5 px-2">
            "{revealingMemory.caption}"
          </p>

          <MagicalButton
            id="continue-journey-btn"
            variant="gold"
            size="md"
            onClick={onContinueJourney}
          >
            {birthdayConfig.narrative.scene4.continueBtn}
          </MagicalButton>
        </motion.div>
      )}

      <div className="h-4" />
    </div>
  );
};
