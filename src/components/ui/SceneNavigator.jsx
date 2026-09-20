import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, SkipForward, RefreshCw } from 'lucide-react';
import { birthdayConfig } from '../../config/birthdayConfig';

export const SceneNavigator = ({ currentScene, totalScenes = 6, onJumpScene, onReset }) => {
  const sceneNames = [
    "The Invitation",
    "Dream World",
    "Birthday Island",
    "Gifts of Memories",
    "Final Gift",
    "Grand Finale"
  ];

  return (
    <div className="fixed bottom-6 inset-x-0 z-40 flex flex-col items-center pointer-events-none">
      {/* Scene Dots / Progress */}
      <div className="glass-panel px-5 py-2.5 rounded-full flex items-center space-x-3 pointer-events-auto border border-white/10 shadow-lg">
        {sceneNames.map((name, idx) => {
          const sceneNum = idx + 1;
          const isActive = currentScene === sceneNum;
          const isPassed = currentScene > sceneNum;

          return (
            <button
              key={sceneNum}
              onClick={() => onJumpScene(sceneNum)}
              title={`${sceneNum}. ${name}`}
              className="group relative flex items-center justify-center p-1 cursor-pointer transition-all duration-300"
            >
              <div
                className={`transition-all duration-500 rounded-full ${
                  isActive
                    ? 'w-6 h-2 bg-gradient-to-r from-pink-400 to-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.8)]'
                    : isPassed
                    ? 'w-2 h-2 bg-purple-300/80 hover:bg-white'
                    : 'w-2 h-2 bg-white/20 hover:bg-white/50'
                }`}
              />
              
              {/* Tooltip */}
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded bg-slate-900/90 text-white text-[11px] font-sans whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none border border-white/10 shadow-md">
                {name}
              </span>
            </button>
          );
        })}

        {/* Quick Skip button */}
        {currentScene < totalScenes && (
          <button
            onClick={() => onJumpScene(currentScene + 1)}
            title="Next Chapter"
            className="ml-2 pl-2 border-l border-white/20 text-white/50 hover:text-amber-300 transition-colors cursor-pointer"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        )}

        {/* Reset button in finale */}
        {currentScene === totalScenes && (
          <button
            onClick={onReset}
            title="Replay from Beginning"
            className="ml-2 pl-2 border-l border-white/20 text-pink-300 hover:text-white transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
