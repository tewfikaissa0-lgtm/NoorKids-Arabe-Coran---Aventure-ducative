import React from 'react';
import { IllustrationKey } from '../../types';

interface StorySceneAnimationProps {
  sceneKey: IllustrationKey;
  className?: string;
}

export const StorySceneAnimation: React.FC<StorySceneAnimationProps> = ({ sceneKey, className = '' }) => {
  switch (sceneKey) {
    case 'ocean_whale':
      return (
        <div className={`relative w-full h-64 md:h-80 rounded-3xl overflow-hidden bg-gradient-to-b from-sky-400 via-blue-600 to-indigo-950 flex items-center justify-center shadow-inner ${className}`}>
          {/* Animated Water Caustics / Waves */}
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-transparent to-transparent animate-pulse" />
          
          <svg className="w-full h-full max-w-lg" viewBox="0 0 500 320" fill="none">
            {/* Background bubbles */}
            <circle cx="80" cy="240" r="8" fill="white" fillOpacity="0.3" className="animate-bounce" style={{ animationDuration: '3s' }} />
            <circle cx="120" cy="180" r="5" fill="white" fillOpacity="0.4" className="animate-bounce" style={{ animationDuration: '4s' }} />
            <circle cx="420" cy="200" r="10" fill="white" fillOpacity="0.25" className="animate-bounce" style={{ animationDuration: '3.5s' }} />
            <circle cx="380" cy="120" r="6" fill="white" fillOpacity="0.3" className="animate-bounce" style={{ animationDuration: '2.5s' }} />
            
            {/* Friendly Blue Whale Body */}
            <g className="transition-transform duration-1000 transform hover:scale-105">
              {/* Tail fin */}
              <path d="M70 170 C40 140, 20 130, 10 120 C15 150, 25 170, 40 180 C20 190, 10 210, 10 240 C30 220, 50 200, 80 185 Z" fill="#38bdf8" />
              {/* Main Body */}
              <ellipse cx="230" cy="180" rx="160" ry="85" fill="#0284c7" />
              {/* Belly */}
              <path d="M120 195 Q230 265 340 195 Q230 240 120 195 Z" fill="#bae6fd" />
              {/* Whale Spout (Gentle fountain of water) */}
              <path d="M280 95 Q275 50 240 40 Q285 45 285 95" stroke="#e0f2fe" strokeWidth="4" strokeLinecap="round" className="animate-pulse" />
              <path d="M285 95 Q295 40 330 35 Q290 50 285 95" stroke="#e0f2fe" strokeWidth="4" strokeLinecap="round" className="animate-pulse" />
              {/* Whale smiling face */}
              <circle cx="330" cy="165" r="9" fill="#0f172a" />
              <circle cx="333" cy="162" r="3" fill="white" />
              {/* Sweet smile */}
              <path d="M320 185 Q335 198 355 185" stroke="#0369a1" strokeWidth="4" strokeLinecap="round" fill="none" />
              {/* Flipper */}
              <ellipse cx="220" cy="205" rx="35" ry="18" fill="#38bdf8" transform="rotate(25 220 205)" />
              {/* Glowing internal sanctuary of Prophet Yunus */}
              <circle cx="190" cy="175" r="32" fill="#fef08a" fillOpacity="0.4" className="animate-ping" style={{ animationDuration: '3s' }} />
              <circle cx="190" cy="175" r="24" fill="#fef08a" fillOpacity="0.85" />
              <text x="190" y="182" textAnchor="middle" fontSize="20">✨</text>
            </g>
          </svg>
          <div className="absolute bottom-3 left-4 text-xs font-semibold text-white/90 bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
            🌊 Au cœur de l'océan bienveillant
          </div>
        </div>
      );

    case 'ark_animals':
      return (
        <div className={`relative w-full h-64 md:h-80 rounded-3xl overflow-hidden bg-gradient-to-b from-sky-300 via-sky-500 to-blue-700 flex items-center justify-center shadow-inner ${className}`}>
          {/* Animated Rainbow */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-96 h-48 border-8 border-pink-400/40 border-b-0 rounded-t-full pointer-events-none" />
          <div className="absolute top-6 left-1/2 -translate-x-1/2 w-88 h-44 border-8 border-yellow-300/40 border-b-0 rounded-t-full pointer-events-none" />
          <div className="absolute top-8 left-1/2 -translate-x-1/2 w-80 h-40 border-8 border-emerald-400/40 border-b-0 rounded-t-full pointer-events-none" />

          <svg className="w-full h-full max-w-lg" viewBox="0 0 500 320" fill="none">
            {/* Big wooden Noah's Ark */}
            <g className="transition-transform duration-700 hover:rotate-1">
              {/* Hull */}
              <path d="M70 190 Q250 250 430 190 L400 240 Q250 280 100 240 Z" fill="#92400e" />
              <path d="M60 190 L440 190 L425 210 L75 210 Z" fill="#78350f" />
              {/* Wooden cabin */}
              <rect x="140" y="115" width="220" height="75" rx="12" fill="#b45309" />
              <rect x="160" y="90" width="180" height="30" rx="8" fill="#d97706" />
              {/* Roof */}
              <polygon points="130,90 250,55 370,90" fill="#78350f" />
              
              {/* Animal windows with cute emojis */}
              <circle cx="180" cy="150" r="16" fill="#fef3c7" stroke="#92400e" strokeWidth="3" />
              <text x="180" y="157" textAnchor="middle" fontSize="18">🦁</text>

              <circle cx="250" cy="150" r="16" fill="#fef3c7" stroke="#92400e" strokeWidth="3" />
              <text x="250" y="157" textAnchor="middle" fontSize="18">🦒</text>

              <circle cx="320" cy="150" r="16" fill="#fef3c7" stroke="#92400e" strokeWidth="3" />
              <text x="320" y="157" textAnchor="middle" fontSize="18">🐘</text>
            </g>

            {/* Ocean waves in foreground */}
            <path d="M0 260 Q60 240 125 260 T250 260 T375 260 T500 260 L500 320 L0 320 Z" fill="#1d4ed8" fillOpacity="0.8" />
            <path d="M0 275 Q60 260 125 275 T250 275 T375 275 T500 275 L500 320 L0 320 Z" fill="#1e40af" />
          </svg>
          <div className="absolute bottom-3 left-4 text-xs font-semibold text-white/90 bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
            ⛵ L'Arche de la Paix voguant sur les eaux
          </div>
        </div>
      );

    case 'badr_oasis':
      return (
        <div className={`relative w-full h-64 md:h-80 rounded-3xl overflow-hidden bg-gradient-to-b from-indigo-950 via-purple-900 to-amber-900 flex items-center justify-center shadow-inner ${className}`}>
          {/* Desert night sky with bright stars */}
          <div className="absolute inset-0 pointer-events-none">
            <span className="absolute top-6 left-12 text-yellow-300 text-lg animate-ping">✨</span>
            <span className="absolute top-16 right-20 text-yellow-200 text-xl animate-pulse">⭐</span>
            <span className="absolute top-10 left-1/2 text-yellow-100 text-sm animate-pulse">✨</span>
            <span className="absolute top-28 left-1/4 text-amber-200 text-base animate-ping">✨</span>
          </div>

          <svg className="w-full h-full max-w-lg" viewBox="0 0 500 320" fill="none">
            {/* Crescent moon */}
            <path d="M410 40 A30 30 0 1 0 440 85 A24 24 0 1 1 410 40 Z" fill="#fef08a" />
            
            {/* Golden Desert Dunes */}
            <path d="M-50 230 Q120 180 300 240 T550 220 L550 320 L-50 320 Z" fill="#b45309" />
            <path d="M-50 250 Q160 220 360 260 T550 240 L550 320 L-50 320 Z" fill="#d97706" />
            
            {/* Oasis Water Pool */}
            <ellipse cx="250" cy="275" rx="80" ry="25" fill="#38bdf8" stroke="#7dd3fc" strokeWidth="3" />
            <ellipse cx="250" cy="275" rx="60" ry="16" fill="#0284c7" />

            {/* Date Palms */}
            <g transform="translate(140, 160)">
              <path d="M20 90 Q30 40 25 0" stroke="#78350f" strokeWidth="8" strokeLinecap="round" />
              <path d="M25 0 Q-15 -10 -35 15" stroke="#15803d" strokeWidth="6" strokeLinecap="round" />
              <path d="M25 0 Q55 -10 75 15" stroke="#15803d" strokeWidth="6" strokeLinecap="round" />
              <path d="M25 0 Q25 -30 20 -40" stroke="#16a34a" strokeWidth="6" strokeLinecap="round" />
            </g>

            {/* Angels of Light / Divine Peace */}
            <g className="animate-pulse">
              <circle cx="250" cy="120" r="18" fill="#fef08a" fillOpacity="0.8" />
              <circle cx="250" cy="120" r="28" fill="#fef08a" fillOpacity="0.3" />
              <text x="250" y="128" textAnchor="middle" fontSize="22">🌟</text>
            </g>
          </svg>
          <div className="absolute bottom-3 left-4 text-xs font-semibold text-white/90 bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
            🛡️ Badr : La Sérénité et les Anges de Lumière
          </div>
        </div>
      );

    case 'trench_digging':
      return (
        <div className={`relative w-full h-64 md:h-80 rounded-3xl overflow-hidden bg-gradient-to-b from-amber-700 via-amber-800 to-stone-900 flex items-center justify-center shadow-inner ${className}`}>
          <svg className="w-full h-full max-w-lg" viewBox="0 0 500 320" fill="none">
            {/* Madinah City Mountains in distance */}
            <polygon points="-20,180 80,100 180,180" fill="#78350f" fillOpacity="0.6" />
            <polygon points="120,180 240,80 360,180" fill="#92400e" fillOpacity="0.5" />
            <polygon points="300,180 420,110 520,180" fill="#78350f" fillOpacity="0.6" />

            {/* Ground surface */}
            <rect x="0" y="170" width="500" height="150" fill="#b45309" />

            {/* The Great Trench */}
            <polygon points="120,170 150,270 350,270 380,170" fill="#292524" />
            <polygon points="135,170 160,260 340,260 365,170" fill="#1c1917" />

            {/* Friendly Lantern shining on the trench */}
            <g transform="translate(240, 150)">
              <circle cx="10" cy="10" r="24" fill="#fbbf24" fillOpacity="0.4" className="animate-ping" />
              <rect x="0" y="0" width="20" height="28" rx="4" fill="#d97706" />
              <rect x="4" y="6" width="12" height="16" rx="2" fill="#fef08a" />
              <path d="M10 -5 L10 0" stroke="#78350f" strokeWidth="3" />
            </g>

            {/* Tools & Solidarity */}
            <text x="180" y="160" fontSize="32">⛏️</text>
            <text x="310" y="160" fontSize="32">🤝</text>
          </svg>
          <div className="absolute bottom-3 left-4 text-xs font-semibold text-white/90 bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
            ⛏️ Le Fossé de Salman : L'Idée qui protégea la Cité
          </div>
        </div>
      );

    case 'fath_makkah':
      return (
        <div className={`relative w-full h-64 md:h-80 rounded-3xl overflow-hidden bg-gradient-to-b from-sky-400 via-amber-200 to-amber-50 flex items-center justify-center shadow-inner ${className}`}>
          <svg className="w-full h-full max-w-lg" viewBox="0 0 500 320" fill="none">
            {/* Sunrise halo over Makkah */}
            <circle cx="250" cy="170" r="120" fill="#fde68a" fillOpacity="0.4" className="animate-pulse" />

            {/* The Holy Kaaba */}
            <g transform="translate(190, 110)">
              {/* Kaaba Black Cube */}
              <rect x="15" y="20" width="90" height="95" rx="4" fill="#0f172a" />
              {/* Golden Kiswah Belt */}
              <rect x="15" y="45" width="90" height="14" fill="#f59e0b" />
              <rect x="15" y="48" width="90" height="2" fill="#fef08a" />
              {/* Golden Door (Bab al-Kaaba) */}
              <rect x="70" y="65" width="22" height="45" rx="3" fill="#d97706" stroke="#fef08a" strokeWidth="2" />
              {/* Foundation marble (Shadharwan) */}
              <rect x="10" y="113" width="100" height="8" rx="2" fill="#e2e8f0" />
            </g>

            {/* White Doves flying in peaceful sky */}
            <g className="animate-bounce" style={{ animationDuration: '4s' }}>
              <text x="120" y="80" fontSize="26">🕊️</text>
              <text x="350" y="90" fontSize="24">🕊️</text>
              <text x="240" y="55" fontSize="20">🕊️</text>
            </g>

            {/* Banner of peace */}
            <path d="M100 240 Q250 220 400 240" stroke="#15803d" strokeWidth="4" strokeLinecap="round" fill="none" />
            <text x="250" y="270" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#166534">
              « اذهبوا فأنتم الطلقاء - Vous êtes tous libres ! »
            </text>
          </svg>
          <div className="absolute bottom-3 left-4 text-xs font-semibold text-emerald-900 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full">
            🕋 Fath Makkah : Le Jour du Pardon Universel
          </div>
        </div>
      );

    case 'parting_sea':
      return (
        <div className={`relative w-full h-64 md:h-80 rounded-3xl overflow-hidden bg-gradient-to-b from-cyan-500 via-blue-600 to-teal-800 flex items-center justify-center shadow-inner ${className}`}>
          <svg className="w-full h-full max-w-lg" viewBox="0 0 500 320" fill="none">
            {/* Left Water Wall */}
            <path d="M0 0 L160 0 C130 100 130 220 160 320 L0 320 Z" fill="#0284c7" fillOpacity="0.85" />
            <path d="M0 0 L140 0 C110 100 110 220 140 320 L0 320 Z" fill="#38bdf8" fillOpacity="0.5" />
            {/* Fish in left water wall */}
            <text x="60" y="120" fontSize="24">🐟</text>
            <text x="40" y="220" fontSize="20">🐠</text>

            {/* Right Water Wall */}
            <path d="M500 0 L340 0 C370 100 370 220 340 320 L500 320 Z" fill="#0284c7" fillOpacity="0.85" />
            <path d="M500 0 L360 0 C390 100 390 220 360 320 L500 320 Z" fill="#38bdf8" fillOpacity="0.5" />
            {/* Fish in right water wall */}
            <text x="420" y="140" fontSize="24">🐬</text>
            <text x="440" y="240" fontSize="20">🐠</text>

            {/* Safe Sandy Path in the Middle */}
            <polygon points="160,320 220,180 280,180 340,320" fill="#fde68a" />
            <polygon points="220,180 240,140 260,140 280,180" fill="#fef08a" />

            {/* Moses' Staff shining with divine light */}
            <g transform="translate(245, 120)" className="animate-pulse">
              <line x1="5" y1="0" x2="5" y2="80" stroke="#78350f" strokeWidth="6" strokeLinecap="round" />
              <circle cx="5" cy="0" r="16" fill="#fef08a" fillOpacity="0.8" />
              <text x="5" y="6" textAnchor="middle" fontSize="16">✨</text>
            </g>
          </svg>
          <div className="absolute bottom-3 left-4 text-xs font-semibold text-white/90 bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
            🌊 Le Bâton de Musa et la Mer Ouverte
          </div>
        </div>
      );

    case 'crow_pitcher':
      return (
        <div className={`relative w-full h-64 md:h-80 rounded-3xl overflow-hidden bg-gradient-to-b from-amber-200 via-orange-100 to-emerald-200 flex items-center justify-center shadow-inner ${className}`}>
          <svg className="w-full h-full max-w-lg" viewBox="0 0 500 320" fill="none">
            {/* Sun */}
            <circle cx="420" cy="50" r="35" fill="#f59e0b" className="animate-pulse" />

            {/* Garden ground */}
            <path d="M0 260 Q250 240 500 260 L500 320 L0 320 Z" fill="#15803d" />

            {/* Clay Pitcher */}
            <g transform="translate(210, 140)">
              {/* Pitcher neck */}
              <rect x="25" y="10" width="30" height="30" fill="#ea580c" />
              <ellipse cx="40" cy="10" rx="18" ry="6" fill="#c2410c" />
              {/* Pitcher belly */}
              <ellipse cx="40" cy="75" rx="42" ry="40" fill="#c2410c" />
              {/* Water rising inside */}
              <ellipse cx="40" cy="40" rx="14" ry="4" fill="#38bdf8" />
              {/* Dropped pebbles in pitcher bottom */}
              <circle cx="30" cy="95" r="7" fill="#64748b" />
              <circle cx="45" cy="100" r="8" fill="#475569" />
              <circle cx="40" cy="90" r="6" fill="#94a3b8" />
            </g>

            {/* Clever Crow */}
            <g transform="translate(140, 120)">
              <text x="0" y="40" fontSize="48">🦅</text>
              {/* Pebble in beak */}
              <circle cx="52" cy="15" r="5" fill="#475569" />
            </g>

            {/* Splashing droplets */}
            <circle cx="250" cy="165" r="4" fill="#0284c7" className="animate-ping" />
          </svg>
          <div className="absolute bottom-3 left-4 text-xs font-semibold text-stone-800 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full">
            🦅 Kalila & Dimna : Le Corbeau Ingénieux
          </div>
        </div>
      );

    default:
      return (
        <div className={`relative w-full h-64 md:h-80 rounded-3xl overflow-hidden bg-gradient-to-b from-amber-400 via-orange-300 to-sky-400 flex items-center justify-center shadow-inner ${className}`}>
          <div className="text-center p-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/50 max-w-sm">
            <span className="text-5xl mb-2 block">📖✨</span>
            <p className="font-bold text-slate-800 text-lg">Merveilleuse Histoire</p>
            <p className="text-xs text-slate-600 mt-1">Écoute attentivement et regarde la sagesse briller !</p>
          </div>
        </div>
      );
  }
};
