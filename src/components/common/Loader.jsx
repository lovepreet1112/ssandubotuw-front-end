import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const WelcomeScreen = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2200); // 2.2 seconds elegant intro
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#FAEDCD] text-[#2A2923] px-6 text-center select-none"
    >
      <div className="relative max-w-lg w-full flex flex-col items-center">
        {/* Decorative Golden Needle / Thread Motif */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="w-16 h-16 mb-6 rounded-full border border-[#D4A373]/60 flex items-center justify-center bg-[#E9EDC9]/40 shadow-sm"
        >
          <span className="text-2xl font-serif text-[#D4A373]">ਸ</span>
        </motion.div>

        {/* Punjabi Royal Script */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-3xl md:text-5xl font-serif font-semibold text-[#2A2923] tracking-wide"
        >
          ਸਿੱਧੂ ਬੁਟੀਕ
        </motion.h1>

        {/* Punjabi Heritage Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="text-base md:text-lg text-[#686558] mt-2 font-medium tracking-wide"
        >
          ਹੱਥੀਂ ਬੁਣਿਆ ਨਿੱਘ ਅਤੇ ਸ਼ਾਨ
        </motion.p>

        {/* Divider accent line */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 120 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="h-[1.5px] bg-[#D4A373] my-5"
        />

        {/* English Brand Welcome */}
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.75 }}
          className="space-y-1"
        >
          <p className="text-xs uppercase tracking-[0.25em] text-[#D4A373] font-semibold">
            Handmade Winter Atelier
          </p>
          <p className="text-sm md:text-base text-[#2A2923]/80 italic font-serif">
            Welcome to Sidhu Boutique — Artisanal Winter Knitwear
          </p>
        </motion.div>

        {/* Subtle Warm Loader Bar */}
        <div className="w-48 h-1 bg-[#CCD5AE]/40 rounded-full mt-8 overflow-hidden">
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
            className="w-full h-full bg-[#D4A373]"
          />
        </div>
      </div>
    </motion.div>
  );
};

// Reusable spinner loader for buttons/sections
export const InlineLoader = ({ size = 'md', color = 'brand' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-10 h-10 border-3',
  };

  const colorClasses = {
    brand: 'border-[#D4A373] border-t-transparent',
    white: 'border-white border-t-transparent',
    dark: 'border-[#2A2923] border-t-transparent',
  };

  return (
    <div className="flex items-center justify-center p-2">
      <div
        className={`rounded-full animate-spin ${sizeClasses[size]} ${colorClasses[color]}`}
        role="status"
        aria-label="loading"
      />
    </div>
  );
};

// Full-width/Centered Block Data Loader (for Admin or Sections)
export const DataLoader = ({ message = 'Loading atelier data...' }) => (
  <div className="py-16 flex flex-col items-center justify-center space-y-3">
    <InlineLoader size="lg" color="brand" />
    <p className="text-xs font-medium text-[#686558] tracking-wide animate-pulse">
      {message}
    </p>
  </div>
);

// Table Row Loader for Admin Tables
export const TableLoader = ({ colSpan, message = 'Loading atelier records...' }) => (
  <tr>
    <td colSpan={colSpan} className="py-16 text-center">
      <div className="flex flex-col items-center justify-center space-y-2">
        <InlineLoader size="lg" color="brand" />
        <p className="text-xs font-medium text-[#686558] tracking-wide animate-pulse">
          {message}
        </p>
      </div>
    </td>
  </tr>
);

// Table Empty State Row
export const TableEmpty = ({ colSpan, message = 'No records found' }) => (
  <tr>
    <td colSpan={colSpan} className="py-12 text-center text-xs text-[#686558]">
      {message}
    </td>
  </tr>
);

export default WelcomeScreen;
