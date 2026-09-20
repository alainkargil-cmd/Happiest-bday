import React, { useState, useMemo } from 'react';
import { DreamWorldCanvas } from './components/3d/DreamWorldCanvas';
import { Intro3D, IntroOverlay } from './scenes/IntroScene';
import { DreamWorldOverlay } from './scenes/DreamWorldScene';
import { Birthday3D, BirthdayOverlay } from './scenes/BirthdayScene';
import { GiftMemory3D, GiftMemoryOverlay } from './scenes/GiftMemoryScene';
import { FinalGift3D, FinalGiftOverlay } from './scenes/FinalGiftScene';
import { Finale3D, FinaleOverlay } from './scenes/FinaleScene';
import { AudioController } from './components/ui/AudioController';
import { SceneNavigator } from './components/ui/SceneNavigator';
import { birthdayConfig } from './config/birthdayConfig';
import { audioManager } from './utils/audioManager';
import confetti from 'canvas-confetti';

export function App() {
  const [sceneId, setSceneId] = useState(1);
  const [collectedMemories, setCollectedMemories] = useState([]);
  const [isCakeWished, setIsCakeWished] = useState(false);
  const [selectedGiftId, setSelectedGiftId] = useState(null);

  // Scene 1 state
  const [isIntroOpening, setIsIntroOpening] = useState(false);

  // Scene 3 state
  const [cakePhase, setCakePhase] = useState('initial'); // 'initial', 'wishing', 'blown'

  // Scene 4 state
  const memories = birthdayConfig.memories || [];
  const [activeGiftIndex, setActiveGiftIndex] = useState(0);
  const [openedGifts, setOpenedGifts] = useState({});
  const [revealingMemory, setRevealingMemory] = useState(null);
  const [isFlyingToSky, setIsFlyingToSky] = useState(false);
  const [hoveredGiftId, setHoveredGiftId] = useState(null);

  // Scene 5 state
  const [finalCountdown, setFinalCountdown] = useState(null);
  const [isFinalOpening, setIsFinalOpening] = useState(false);

  // Scene 6 state
  const [morphMode, setMorphMode] = useState('heart');
  const [showLetter, setShowLetter] = useState(false);

  // Compute gift box positions
  const giftPositions = useMemo(() => {
    return memories.map((_, idx) => {
      const total = memories.length;
      const angle = ((idx / Math.max(total - 1, 1)) - 0.5) * Math.PI * 0.75;
      const radius = 5.2;
      const x = Math.sin(angle) * radius;
      const z = -Math.cos(angle) * radius + 3.2;
      const y = 0.2;
      return [x, y, z];
    });
  }, [memories]);

  // Scene 1: Intro complete
  const handleIntroOpenComplete = () => {
    setTimeout(() => {
      setSceneId(2);
    }, 600);
  };

  // Scene 2: Follow magic
  const handleFollowMagic = () => {
    setSceneId(3);
  };

  // Scene 3: Discover gifts
  const handleDiscoverGifts = () => {
    setSceneId(4);
  };

  // Scene 4: Gift interactions
  const handleOpenGift = (giftId) => {
    const memory = memories.find((m) => m.id === giftId);
    if (!memory || openedGifts[giftId]) return;

    setSelectedGiftId(giftId);
    setOpenedGifts((prev) => ({ ...prev, [giftId]: true }));
    setRevealingMemory(memory);
  };

  const handleContinueJourney = () => {
    if (!revealingMemory) return;
    setIsFlyingToSky(true);
    audioManager.playChime();
  };

  const handleFlyFinish = () => {
    if (revealingMemory) {
      setCollectedMemories((prev) => {
        if (prev.some((m) => m.id === revealingMemory.id)) return prev;
        return [...prev, revealingMemory];
      });
    }
    const nextIdx = activeGiftIndex + 1;
    setRevealingMemory(null);
    setIsFlyingToSky(false);
    setSelectedGiftId(null);
    setActiveGiftIndex(nextIdx);

    if (nextIdx >= memories.length) {
      setTimeout(() => {
        setSceneId(5);
      }, 1000);
    }
  };

  // Scene 5: Final gift countdown
  const handleStartFinalCountdown = () => {
    setIsFinalOpening(true);
    setFinalCountdown(3);
    audioManager.playCountdownTick();

    setTimeout(() => {
      setFinalCountdown(2);
      audioManager.playCountdownTick();
    }, 1200);

    setTimeout(() => {
      setFinalCountdown(1);
      audioManager.playCountdownTick();
    }, 2400);

    setTimeout(() => {
      setFinalCountdown('BOOM');
      audioManager.playGiftOpen();
      audioManager.playFirework();

      try {
        confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.6 },
          colors: ['#f472b6', '#fbbf24', '#c084fc', '#38bdf8', '#ffffff']
        });
      } catch (e) {}

      setTimeout(() => {
        if (collectedMemories.length < memories.length) {
          setCollectedMemories(memories);
        }
        setSceneId(6);
        // Start finale timeline
        setTimeout(() => setMorphMode('name'), 4000);
        setTimeout(() => setShowLetter(true), 7000);
      }, 2000);
    }, 3600);
  };

  // Reset / Replay
  const handleReplay = () => {
    setCollectedMemories([]);
    setIsCakeWished(false);
    setSelectedGiftId(null);
    setIsIntroOpening(false);
    setCakePhase('initial');
    setActiveGiftIndex(0);
    setOpenedGifts({});
    setRevealingMemory(null);
    setIsFlyingToSky(false);
    setFinalCountdown(null);
    setIsFinalOpening(false);
    setMorphMode('heart');
    setShowLetter(false);
    setSceneId(1);
  };

  // Jump scene
  const handleJumpScene = (targetScene) => {
    if (targetScene >= 5 && collectedMemories.length === 0) {
      setCollectedMemories(memories);
    }
    if (targetScene === 6) {
      setMorphMode('name');
      setShowLetter(true);
    }
    setSceneId(targetScene);
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#07071a] select-none">
      {/* Audio Controller */}
      <AudioController />

      {/* 3D Canvas with 3D Meshes ONLY */}
      <DreamWorldCanvas
        sceneId={sceneId}
        selectedGiftId={selectedGiftId}
        isCakeWished={isCakeWished}
      >
        {sceneId === 1 && (
          <Intro3D
            isOpening={isIntroOpening}
            onOpenComplete={handleIntroOpenComplete}
          />
        )}

        {sceneId === 3 && (
          <Birthday3D phase={cakePhase} />
        )}

        {sceneId === 4 && (
          <GiftMemory3D
            collectedMemories={collectedMemories}
            activeGiftIndex={activeGiftIndex}
            openedGifts={openedGifts}
            revealingMemory={revealingMemory}
            isFlyingToSky={isFlyingToSky}
            giftPositions={giftPositions}
            onOpenGift={handleOpenGift}
            onHoverGift={(id) => setHoveredGiftId(id)}
            onFlyFinish={handleFlyFinish}
          />
        )}

        {sceneId === 5 && (
          <FinalGift3D
            countdown={finalCountdown}
            isOpening={isFinalOpening}
          />
        )}

        {sceneId === 6 && (
          <Finale3D
            morphMode={morphMode}
            collectedMemories={collectedMemories}
          />
        )}
      </DreamWorldCanvas>

      {/* HTML UI Overlays outside Canvas */}
      {sceneId === 1 && (
        <IntroOverlay
          onEnterDream={() => setIsIntroOpening(true)}
          isOpening={isIntroOpening}
          setIsOpening={setIsIntroOpening}
        />
      )}

      {sceneId === 2 && (
        <DreamWorldOverlay onFollowMagic={handleFollowMagic} />
      )}

      {sceneId === 3 && (
        <BirthdayOverlay
          phase={cakePhase}
          setPhase={setCakePhase}
          onCakeWished={(wished) => setIsCakeWished(wished)}
          onDiscoverGifts={handleDiscoverGifts}
        />
      )}

      {sceneId === 4 && (
        <GiftMemoryOverlay
          collectedMemories={collectedMemories}
          activeGiftIndex={activeGiftIndex}
          revealingMemory={revealingMemory}
          isFlyingToSky={isFlyingToSky}
          hoveredGiftId={hoveredGiftId}
          onContinueJourney={handleContinueJourney}
        />
      )}

      {sceneId === 5 && (
        <FinalGiftOverlay
          countdown={finalCountdown}
          onStartCountdown={handleStartFinalCountdown}
        />
      )}

      {sceneId === 6 && (
        <FinaleOverlay
          morphMode={morphMode}
          showLetter={showLetter}
          onReplay={handleReplay}
        />
      )}

      {/* Scene Navigation bar */}
      <SceneNavigator
        currentScene={sceneId}
        totalScenes={6}
        onJumpScene={handleJumpScene}
        onReset={handleReplay}
      />
    </main>
  );
}

export default App;
