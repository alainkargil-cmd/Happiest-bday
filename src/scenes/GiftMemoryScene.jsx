import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GiftBox } from '../components/3d/GiftBox';
import { FloatingPhotoCard } from '../components/3d/FloatingPhotoCard';
import { MemorySky } from '../components/3d/MemorySky';
import { MagicalButton } from '../components/ui/MagicalButton';
import { birthdayConfig } from '../config/birthdayConfig';
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
            (collectedMemories.length - memories.length / 2) * 2.8,
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
    <div className="fixed inset-0 z-20 pointer-events-none">
      {/* Top Header info */}
      <div className="fixed top-5 inset-x-0 flex justify-center px-4">
        <div className="glass-panel px-5 py-2 rounded-full border border-white/10 flex items-center gap-2 text-xs sm:text-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '8s' }} />
          <span className="font-cinzel text-purple-200">
            Memories: <strong className="text-amber-300 font-bold">{collectedMemories.length} / {memories.length}</strong>
          </span>
        </div>
      </div>

      {/* Hover Hint when no gift is open */}
      {!revealingMemory && (
        <div className="fixed bottom-20 inset-x-0 flex justify-center px-4">
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="glass-panel px-6 py-3.5 rounded-2xl border border-white/15 text-center max-w-md shadow-2xl"
            >
              <h2 className="text-lg sm:text-xl font-cinzel font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-amber-200 mb-0.5">
                {birthdayConfig.narrative.scene4.title}
              </h2>
              <p className="text-xs sm:text-sm font-inter text-purple-200/80">
                {hoveredGiftId
                  ? "✨ Tap to open this gift!"
                  : `Tap Gift #${activeGiftIndex + 1} waiting on the island ✨`}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Active Memory Caption at bottom - positioned completely below 3D photo */}
      {revealingMemory && !isFlyingToSky && (
        <div className="fixed bottom-20 inset-x-0 flex justify-center px-4 pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="glass-panel p-4 sm:p-5 rounded-2xl border border-amber-300/30 text-center max-w-md w-full shadow-[0_15px_40px_rgba(0,0,0,0.6)]"
          >
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-amber-300 font-cinzel tracking-wider uppercase mb-1">
              <Sparkles className="w-3 h-3" />
              <span>{revealingMemory.date || "Cherished Memory"}</span>
            </div>

            <h3 className="text-lg sm:text-2xl font-cinzel font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-amber-200 to-purple-200 mb-1">
              {revealingMemory.title}
            </h3>

            <p className="text-xs sm:text-sm font-cormorant italic text-purple-100 font-normal leading-snug mb-3.5 px-1 line-clamp-2 sm:line-clamp-none">
              "{revealingMemory.caption}"
            </p>

            <MagicalButton
              id="continue-journey-btn"
              variant="gold"
              size="sm"
              onClick={onContinueJourney}
              className="w-full sm:w-auto"
            >
              {birthdayConfig.narrative.scene4.continueBtn}
            </MagicalButton>
          </motion.div>
        </div>
      )}
    </div>
  );
};
