import React from 'react';
import { Sparkles, SkipForward, RefreshCw } from 'lucide-react';

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
    <div className="fixed bottom-3 inset-x-0 z-40 flex flex-col items-center pointer-events-none px-2">
      {/* Scene Dots / Progress */}
      <div className="glass-panel px-4 py-1.5 sm:px-5 sm:py-2 rounded-full flex items-center space-x-2 sm:space-x-3 pointer-events-auto border border-white/10 shadow-lg">
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
                    ? 'w-5 sm:w-6 h-1.5 sm:h-2 bg-gradient-to-r from-pink-400 to-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.8)]'
                    : isPassed
                    ? 'w-1.5 sm:w-2 h-1.5 sm:h-2 bg-purple-300/80 hover:bg-white'
                    : 'w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/20 hover:bg-white/50'
                }`}
              />
              
              {/* Tooltip */}
              <span className="hidden sm:block absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-slate-900/90 text-white text-[10px] font-sans whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none border border-white/10 shadow-md">
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
            className="ml-1 pl-2 border-l border-white/20 text-white/50 hover:text-amber-300 transition-colors cursor-pointer"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Reset button in finale */}
        {currentScene === totalScenes && (
          <button
            onClick={onReset}
            title="Replay from Beginning"
            className="ml-1 pl-2 border-l border-white/20 text-pink-300 hover:text-white transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
