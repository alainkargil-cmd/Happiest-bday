import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { audioManager } from '../../utils/audioManager';

export const MagicalButton = ({
  children,
  onClick,
  variant = 'primary', // 'primary', 'gold', 'outline', 'subtle'
  size = 'md', // 'sm', 'md', 'lg'
  icon = true,
  disabled = false,
  className = '',
  id = ''
}) => {
  const handleClick = (e) => {
    if (disabled) return;
    audioManager.playChime();
    if (onClick) onClick(e);
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm gap-1.5',
    md: 'px-6 py-3.5 text-base gap-2.5',
    lg: 'px-8 py-4.5 text-lg gap-3 font-semibold tracking-wide'
  }[size];

  const variantClasses = {
    primary: 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-[0_0_25px_rgba(236,72,153,0.5)] hover:shadow-[0_0_35px_rgba(168,85,247,0.7)] border border-pink-300/30',
    gold: 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-900 shadow-[0_0_25px_rgba(251,191,36,0.6)] hover:shadow-[0_0_40px_rgba(251,191,36,0.85)] border border-yellow-100 font-bold',
    outline: 'bg-white/10 backdrop-blur-md text-white border border-white/30 hover:border-pink-300 hover:bg-white/20 shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(244,114,182,0.4)]',
    subtle: 'bg-slate-900/60 backdrop-blur-sm text-purple-200 border border-purple-500/20 hover:bg-purple-900/40 hover:text-white'
  }[variant];

  return (
    <motion.button
      id={id}
      whileHover={{ scale: disabled ? 1 : 1.05, y: -2 }}
      whileTap={{ scale: disabled ? 1 : 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      onClick={handleClick}
      disabled={disabled}
      className={`relative group inline-flex items-center justify-center rounded-full font-cinzel cursor-pointer transition-all duration-300 select-none overflow-hidden ${sizeClasses} ${variantClasses} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {/* Shimmer light sweep */}
      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
      
      {/* Icon */}
      {icon && (
        <Sparkles className="w-4 h-4 text-amber-200 animate-pulse transition-transform group-hover:rotate-12" />
      )}

      {/* Button label */}
      <span className="relative z-10 drop-shadow-md">
        {children}
      </span>
    </motion.button>
  );
};
