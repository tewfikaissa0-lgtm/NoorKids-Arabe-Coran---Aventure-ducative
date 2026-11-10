import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
  style?: React.CSSProperties;
}

// 1. Alphabet 3D Calligraphy Cube Icon
export const AlphabetIcon3D: React.FC<IconProps> = ({ className = '', size = 32 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    className={`transition-transform duration-300 transform group-hover:scale-110 group-hover:rotate-3 ${className}`}
  >
    <defs>
      <linearGradient id="cubeGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
        <stop stopColor="#f59e0b" />
        <stop offset="0.5" stopColor="#d97706" />
        <stop offset="1" stopColor="#b45309" />
      </linearGradient>
      <linearGradient id="cubeTop" x1="0" y1="0" x2="0" y2="24" gradientUnits="userSpaceOnUse">
        <stop stopColor="#fef08a" />
        <stop offset="1" stopColor="#f59e0b" />
      </linearGradient>
      <filter id="glow3D" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#f59e0b" floodOpacity="0.4" />
      </filter>
    </defs>
    {/* Base 3D rounded block */}
    <rect x="6" y="8" width="36" height="34" rx="10" fill="url(#cubeGrad)" filter="url(#glow3D)" />
    <path d="M6 18 C6 12 12 8 18 8 L30 8 C36 8 42 12 42 18 L42 22 L6 22 Z" fill="url(#cubeTop)" opacity="0.8" />
    {/* Arabic Calligraphy Letter Alif/Ba styled in pure golden light */}
    <text x="24" y="32" textAnchor="middle" fontSize="22" fontWeight="bold" fill="#ffffff" fontFamily="Amiri, serif">
      أ
    </text>
    {/* Sparkling star top right */}
    <circle cx="36" cy="12" r="2.5" fill="#ffffff" />
    <circle cx="36" cy="12" r="1.5" fill="#fef08a" />
  </svg>
);

// 2. Daily Word 3D Sunrise Scroll Icon
export const DailyWordIcon3D: React.FC<IconProps> = ({ className = '', size = 32 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    className={`transition-transform duration-300 transform group-hover:scale-110 ${className}`}
  >
    <defs>
      <linearGradient id="scrollGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
        <stop stopColor="#fbbf24" />
        <stop offset="1" stopColor="#ea580c" />
      </linearGradient>
      <filter id="shadowScroll" x="-10%" y="-10%" width="120%" height="130%">
        <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#ea580c" floodOpacity="0.4" />
      </filter>
    </defs>
    <circle cx="24" cy="24" r="20" fill="url(#scrollGrad)" filter="url(#shadowScroll)" />
    <circle cx="24" cy="24" r="16" fill="#fffbeb" opacity="0.95" />
    {/* Shining sun and open book lines */}
    <circle cx="24" cy="18" r="5" fill="#f59e0b" />
    <path d="M16 28 Q24 25 32 28 M16 31 Q24 28 32 31" stroke="#b45309" strokeWidth="2" strokeLinecap="round" />
    <path d="M24 10 L24 12 M16 14 L18 15 M32 14 L30 15" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// 3. Word Puzzle 3D Tactile Icon
export const PuzzleIcon3D: React.FC<IconProps> = ({ className = '', size = 32 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    className={`transition-transform duration-300 transform group-hover:scale-110 group-hover:-rotate-3 ${className}`}
  >
    <defs>
      <linearGradient id="puzzleGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
        <stop stopColor="#38bdf8" />
        <stop offset="0.7" stopColor="#0284c7" />
        <stop offset="1" stopColor="#0369a1" />
      </linearGradient>
    </defs>
    <rect x="8" y="8" width="32" height="32" rx="8" fill="url(#puzzleGrad)" />
    {/* Interlocking tabs */}
    <circle cx="24" cy="8" r="4.5" fill="#38bdf8" />
    <circle cx="40" cy="24" r="4.5" fill="#0284c7" />
    <circle cx="24" cy="24" r="3" fill="#ffffff" opacity="0.9" />
    <path d="M14 24 L20 24 M28 24 L34 24" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
    <path d="M24 14 L24 20 M24 28 L24 34" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
  </svg>
);

// 4. Letter Maze 3D Oasis Pathfinder Icon
export const MazeIcon3D: React.FC<IconProps> = ({ className = '', size = 32 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    className={`transition-transform duration-300 transform group-hover:scale-110 ${className}`}
  >
    <defs>
      <linearGradient id="mazeGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
        <stop stopColor="#10b981" />
        <stop offset="1" stopColor="#047857" />
      </linearGradient>
    </defs>
    <rect x="6" y="6" width="36" height="36" rx="10" fill="url(#mazeGrad)" />
    {/* Maze pathways */}
    <path
      d="M14 14 L34 14 L34 22 L22 22 L22 34 L34 34"
      stroke="#ffffff"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="14" cy="14" r="3.5" fill="#fef08a" />
    <circle cx="34" cy="34" r="3.5" fill="#fef08a" />
  </svg>
);

// 5. Stories 3D Illuminated Book Icon
export const StoriesIcon3D: React.FC<IconProps> = ({ className = '', size = 32 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    className={`transition-transform duration-300 transform group-hover:scale-110 ${className}`}
  >
    <defs>
      <linearGradient id="bookCover" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
        <stop stopColor="#a855f7" />
        <stop offset="1" stopColor="#6b21a8" />
      </linearGradient>
      <linearGradient id="bookPages" x1="0" y1="0" x2="0" y2="48" gradientUnits="userSpaceOnUse">
        <stop stopColor="#fef3c7" />
        <stop offset="1" stopColor="#fde68a" />
      </linearGradient>
    </defs>
    {/* Open book wings */}
    <path d="M6 14 Q24 10 24 20 L24 38 Q24 28 6 32 Z" fill="url(#bookCover)" />
    <path d="M42 14 Q24 10 24 20 L24 38 Q24 28 42 32 Z" fill="url(#bookCover)" />
    <path d="M8 16 Q24 12 24 20 L24 36 Q24 28 8 30 Z" fill="url(#bookPages)" />
    <path d="M40 16 Q24 12 24 20 L24 36 Q24 28 40 30 Z" fill="url(#bookPages)" />
    {/* Magic stars floating from book */}
    <circle cx="24" cy="10" r="2.5" fill="#fef08a" />
    <circle cx="18" cy="8" r="1.5" fill="#fde68a" />
    <circle cx="30" cy="8" r="1.5" fill="#fde68a" />
  </svg>
);

// 6. Holy Quran 3D Mushaf with Crescent Icon
export const QuranIcon3D: React.FC<IconProps> = ({ className = '', size = 32 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    className={`transition-transform duration-300 transform group-hover:scale-110 ${className}`}
  >
    <defs>
      <linearGradient id="quranCover" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
        <stop stopColor="#059669" />
        <stop offset="0.6" stopColor="#047857" />
        <stop offset="1" stopColor="#064e3b" />
      </linearGradient>
      <linearGradient id="goldTrim" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
        <stop stopColor="#fef08a" />
        <stop offset="1" stopColor="#f59e0b" />
      </linearGradient>
    </defs>
    {/* Bound Mushaf book */}
    <rect x="8" y="7" width="32" height="34" rx="6" fill="url(#quranCover)" />
    <rect x="11" y="10" width="26" height="28" rx="4" stroke="url(#goldTrim)" strokeWidth="1.5" fill="none" />
    {/* Central Calligraphic Medallion */}
    <circle cx="24" cy="24" r="8" fill="url(#goldTrim)" opacity="0.3" />
    <circle cx="24" cy="24" r="6" stroke="url(#goldTrim)" strokeWidth="1.5" fill="none" />
    {/* Crescent Moon */}
    <path d="M22 20 A5 5 0 1 0 26 27 A4 4 0 1 1 22 20 Z" fill="url(#goldTrim)" />
  </svg>
);

// 7. Tree of the Prophets 3D Golden Tree Icon
export const TreeProphetsIcon3D: React.FC<IconProps> = ({ className = '', size = 32 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    className={`transition-transform duration-300 transform group-hover:scale-110 ${className}`}
  >
    <defs>
      <linearGradient id="treeFoliage" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
        <stop stopColor="#34d399" />
        <stop offset="1" stopColor="#059669" />
      </linearGradient>
      <linearGradient id="treeTrunk" x1="0" y1="0" x2="0" y2="48" gradientUnits="userSpaceOnUse">
        <stop stopColor="#d97706" />
        <stop offset="1" stopColor="#78350f" />
      </linearGradient>
    </defs>
    {/* Tree Trunk */}
    <path d="M22 24 Q24 34 20 42 L28 42 Q24 34 26 24 Z" fill="url(#treeTrunk)" />
    {/* 3 Tiered foliage crowns */}
    <circle cx="24" cy="18" r="14" fill="url(#treeFoliage)" />
    <circle cx="16" cy="19" r="8" fill="#10b981" />
    <circle cx="32" cy="19" r="8" fill="#10b981" />
    <circle cx="24" cy="12" r="9" fill="#6ee7b7" />
    {/* Golden fruits of wisdom */}
    <circle cx="20" cy="14" r="2.5" fill="#f59e0b" />
    <circle cx="28" cy="15" r="2.5" fill="#f59e0b" />
    <circle cx="24" cy="21" r="2.5" fill="#f59e0b" />
  </svg>
);

// 8. Quiz & Badges 3D Trophy Icon
export const QuizIcon3D: React.FC<IconProps> = ({ className = '', size = 32 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    className={`transition-transform duration-300 transform group-hover:scale-110 ${className}`}
  >
    <defs>
      <linearGradient id="goldTrophy" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
        <stop stopColor="#fef08a" />
        <stop offset="0.6" stopColor="#f59e0b" />
        <stop offset="1" stopColor="#b45309" />
      </linearGradient>
    </defs>
    <path d="M14 10 L34 10 L31 24 Q24 30 17 24 Z" fill="url(#goldTrophy)" />
    {/* Handles */}
    <path d="M14 12 Q8 16 15 22" stroke="#f59e0b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <path d="M34 12 Q40 16 33 22" stroke="#f59e0b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    {/* Stem & Base */}
    <rect x="22" y="27" width="4" height="7" rx="1" fill="#d97706" />
    <path d="M16 34 L32 34 L30 40 L18 40 Z" fill="#b45309" />
    <circle cx="24" cy="17" r="3" fill="#ffffff" />
  </svg>
);

// 9. Star Coin 3D
export const StarCoin3D: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
    <defs>
      <linearGradient id="coinGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
        <stop stopColor="#fef08a" />
        <stop offset="0.6" stopColor="#f59e0b" />
        <stop offset="1" stopColor="#d97706" />
      </linearGradient>
    </defs>
    <circle cx="16" cy="16" r="14" fill="url(#coinGrad)" />
    <circle cx="16" cy="16" r="11" stroke="#fef08a" strokeWidth="1.5" fill="none" />
    {/* Star */}
    <polygon
      points="16,8 18.5,13.5 24.5,14 20,18 21.5,24 16,20.5 10.5,24 12,18 7.5,14 13.5,13.5"
      fill="#ffffff"
    />
  </svg>
);

// 10. Gem Diamond 3D
export const GemDiamond3D: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
    <defs>
      <linearGradient id="gemGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
        <stop stopColor="#67e8f9" />
        <stop offset="0.5" stopColor="#06b6d4" />
        <stop offset="1" stopColor="#0891b2" />
      </linearGradient>
    </defs>
    <polygon points="10,6 22,6 28,13 16,27 4,13" fill="url(#gemGrad)" />
    <polygon points="10,6 22,6 20,13 12,13" fill="#cffafe" opacity="0.8" />
    <polygon points="12,13 20,13 16,27" fill="#0891b2" opacity="0.5" />
    <line x1="4" y1="13" x2="28" y2="13" stroke="#e0f2fe" strokeWidth="1.5" />
  </svg>
);

// 11. Streak Flame 3D
export const StreakFlame3D: React.FC<IconProps> = ({ className = '', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
    <defs>
      <linearGradient id="flameGrad" x1="16" y1="0" x2="16" y2="32" gradientUnits="userSpaceOnUse">
        <stop stopColor="#fef08a" />
        <stop offset="0.3" stopColor="#f97316" />
        <stop offset="1" stopColor="#dc2626" />
      </linearGradient>
    </defs>
    <path
      d="M16 2 C16 2 26 12 26 21 C26 26.5 21.5 30 16 30 C10.5 30 6 26.5 6 21 C6 14 12 8 16 2 Z"
      fill="url(#flameGrad)"
    />
    <path
      d="M16 14 C16 14 20 18 20 22 C20 24.5 18 26 16 26 C14 26 12 24.5 12 22 C12 18 15 16 16 14 Z"
      fill="#fef08a"
    />
  </svg>
);
