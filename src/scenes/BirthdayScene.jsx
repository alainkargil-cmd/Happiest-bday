import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BirthdayCake } from '../components/3d/BirthdayCake';
import { MagicalButton } from '../components/ui/MagicalButton';
import { StoryOverlay } from '../components/ui/StoryOverlay';
import { birthdayConfig } from '../config/birthdayConfig';
import { audioManager } from '../utils/audioManager';
import { Mic, Wind } from 'lucide-react';

// 3D portion
export const Birthday3D = ({ phase }) => {
  return (
    <BirthdayCake
      position={[0, 0, 0]}
      scale={1.25}
      isBlownOut={phase === 'blown'}
    />
  );
};

// HTML UI overlay
export const BirthdayOverlay = ({ phase, setPhase, onCakeWished, onDiscoverGifts }) => {
  const [micActive, setMicActive] = useState(false);
  const [micSupported, setMicSupported] = useState(false);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const micStreamRef = useRef(null);

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      setMicSupported(true);
    }
  }, []);

  const handleMakeWish = () => {
    setPhase('wishing');
    if (onCakeWished) onCakeWished(true);
    audioManager.playChime();
  };

  const handleBlowCandles = () => {
    if (phase === 'blown') return;
    setPhase('blown');
    audioManager.playCandleBlow();
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const startMicDetection = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;
      setMicActive(true);

      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const checkAudio = () => {
        if (phase === 'blown') return;
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const average = sum / dataArray.length;
        if (average > 55) {
          handleBlowCandles();
          return;
        }
        requestAnimationFrame(checkAudio);
      };
      checkAudio();
    } catch (err) {
      console.warn("Microphone access denied or error:", err);
      setMicActive(false);
    }
  };

  return (
    <div className="fixed inset-0 z-20 flex flex-col items-center justify-between py-10 pointer-events-none px-4">
      <div className="h-4" />

      {phase === 'initial' && (
        <StoryOverlay isVisible={true} className="glass-panel rounded-3xl p-6 border border-white/20">
          <p className="text-base md:text-lg font-cormorant italic text-purple-200">
            {birthdayConfig.narrative.scene3.pretitle}
          </p>
          <h1 className="text-3xl md:text-5xl font-cinzel font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-pink-300 to-purple-200 text-glow-gold my-3">
            {birthdayConfig.narrative.scene3.title}
          </h1>
          <MagicalButton
            id="make-wish-btn"
            variant="gold"
            size="lg"
            onClick={handleMakeWish}
            className="mt-4"
          >
            {birthdayConfig.narrative.scene3.makeWishBtn}
          </MagicalButton>
        </StoryOverlay>
      )}

      {phase === 'wishing' && (
        <StoryOverlay isVisible={true} className="glass-panel rounded-3xl p-6 border border-amber-300/30">
          <p className="text-lg md:text-2xl font-cormorant italic text-amber-200 mb-2">
            {birthdayConfig.narrative.scene3.wishPrompt}
          </p>
          <p className="text-sm font-inter text-purple-200/80 mb-6">
            When you're ready, blow out the candles to send your wish to the universe!
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <MagicalButton
              id="blow-candles-btn"
              variant="gold"
              size="lg"
              onClick={handleBlowCandles}
            >
              {birthdayConfig.narrative.scene3.blowCandlesBtn}
            </MagicalButton>

            {micSupported && !micActive && (
              <button
                onClick={startMicDetection}
                className="px-4 py-3 rounded-full glass-panel text-xs text-purple-200 hover:text-white border border-white/10 hover:border-pink-300/50 flex items-center gap-1.5 transition-all cursor-pointer pointer-events-auto"
              >
                <Mic className="w-3.5 h-3.5 text-pink-400" />
                <span>Blow via Microphone</span>
              </button>
            )}

            {micActive && (
              <div className="flex items-center gap-2 text-xs text-amber-300 animate-pulse bg-amber-500/10 px-4 py-2 rounded-full border border-amber-400/30">
                <Wind className="w-4 h-4" />
                <span>Listening... Blow gently into your mic!</span>
              </div>
            )}
          </div>
        </StoryOverlay>
      )}

      {phase === 'blown' && (
        <StoryOverlay isVisible={true} className="glass-panel rounded-3xl p-6 border border-pink-400/30">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-2xl md:text-4xl font-cinzel font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-200 to-amber-200 text-glow-pink mb-3">
              {birthdayConfig.narrative.scene3.wishGranted}
            </h2>
            <p className="text-sm md:text-base font-inter text-purple-200/90 mb-6">
              Now let us explore the magical gifts waiting across this celestial world...
            </p>
            <MagicalButton
              id="discover-gifts-btn"
              variant="primary"
              size="lg"
              onClick={onDiscoverGifts}
            >
              {birthdayConfig.narrative.scene3.continueBtn}
            </MagicalButton>
          </motion.div>
        </StoryOverlay>
      )}

      <div className="h-4" />
    </div>
  );
};
