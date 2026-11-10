import React, { useState } from 'react';
import { Language, StudentProfile } from '../types';
import { translations } from '../data/translations';
import { sound } from '../utils/soundEngine';
import { StarCoin3D, GemDiamond3D, StreakFlame3D } from './Icons/NoorIcons';
import {
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Bot,
  Trophy,
  Award,
  Shield,
  Heart,
  Globe,
  WifiOff,
  ChevronDown,
} from 'lucide-react';

interface NavbarProps {
  lang: Language;
  onSetLang: (lang: Language) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  isSoundOn: boolean;
  onToggleSound: () => void;
  student: StudentProfile;
  onOpenLevelSelector: () => void;
  onOpenAI: () => void;
  onOpenLeaderboard: () => void;
  onOpenBadges: () => void;
  onOpenParental: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  onSetLang,
  isDark,
  onToggleTheme,
  isSoundOn,
  onToggleSound,
  student,
  onOpenLevelSelector,
  onOpenAI,
  onOpenLeaderboard,
  onOpenBadges,
  onOpenParental,
  onOpenAdmin,
}) => {
  const t = translations[lang] || translations.fr;
  const [logoClicks, setLogoClicks] = useState(0);

  const handleLogoClick = () => {
    sound.playPop();
    const newCount = logoClicks + 1;
    setLogoClicks(newCount);
    if (newCount >= 3) {
      setLogoClicks(0);
      onOpenAdmin();
    }
  };

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'ar', label: 'العربية', flag: '🇸🇦' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b-2 border-amber-300/80 dark:border-amber-700/40 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Branding & Creator Credit (Secret triple-click on logo opens Admin panel) */}
        <div className="flex items-center gap-3">
          <div
            onClick={handleLogoClick}
            className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-400 to-amber-500 text-white flex items-center justify-center text-2xl font-bold font-['Amiri'] shadow-md shadow-amber-500/20 cursor-pointer select-none hover:scale-105 transition-transform"
            title="Logo NoorKids (Triple-clic secret Admin)"
          >
            نُور
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white font-['Fredoka'] tracking-tight">
                {t.appName}
              </h1>
              {/* Difficulty Level Tag */}
              <button
                onClick={() => {
                  sound.playPop();
                  onOpenLevelSelector();
                }}
                className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-extrabold text-[11px] border border-amber-300 dark:border-amber-700 hover:scale-105 transition-transform cursor-pointer"
                title="Changer de niveau de difficulté"
              >
                <span>⭐ {student.level}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>
            {/* Maryam et son fils dedication */}
            <div className="flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-400">
              <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline" />
              <span>{t.creatorCredit}</span>
            </div>
          </div>
        </div>

        {/* Center: Live Stats Clusters (Stars, Gems, Streak) */}
        <div className="flex items-center gap-2 sm:gap-3 bg-amber-50/80 dark:bg-slate-800/80 px-3 py-1.5 rounded-2xl border border-amber-200 dark:border-slate-700">
          <div className="flex items-center gap-1.5" title="Étoiles gagnées">
            <StarCoin3D size={22} className="animate-spin" style={{ animationDuration: '10s' }} />
            <span className="font-black text-slate-800 dark:text-white text-xs sm:text-sm tabular-nums">
              {student.stars}
            </span>
          </div>

          <span className="text-slate-300 dark:text-slate-600">|</span>

          <div className="flex items-center gap-1.5" title="Diamants précieux">
            <GemDiamond3D size={20} />
            <span className="font-black text-slate-800 dark:text-white text-xs sm:text-sm tabular-nums">
              {student.gems}
            </span>
          </div>

          <span className="text-slate-300 dark:text-slate-600">|</span>

          <div className="flex items-center gap-1" title="Série de jours">
            <StreakFlame3D size={20} />
            <span className="font-black text-amber-600 dark:text-amber-400 text-xs sm:text-sm tabular-nums">
              {student.dailyStreak}j
            </span>
          </div>
        </div>

        {/* Right: Quick Action Controls (Admin button removed from student view, accessible via secret triple-click on logo) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* AI Companion Noor */}
          <button
            onClick={() => {
              sound.playPop();
              onOpenAI();
            }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-xs shadow-md shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Bot className="w-4 h-4 animate-bounce" />
            <span className="hidden md:inline">Noor IA</span>
          </button>

          {/* Leaderboard */}
          <button
            onClick={() => {
              sound.playPop();
              onOpenLeaderboard();
            }}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-amber-100 hover:text-amber-800 transition-colors shadow-2xs"
            title="Classement public"
          >
            <Trophy className="w-4 h-4 text-amber-500" />
          </button>

          {/* Badges */}
          <button
            onClick={() => {
              sound.playPop();
              onOpenBadges();
            }}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-amber-100 hover:text-amber-800 transition-colors shadow-2xs"
            title="Mes Badges"
          >
            <Award className="w-4 h-4 text-purple-500" />
          </button>

          {/* Language Selector */}
          <div className="relative group">
            <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer">
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span className="uppercase">{lang}</span>
            </button>
            <div className="absolute right-0 top-full mt-1 hidden group-hover:block bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-1.5 min-w-[130px] z-50">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    sound.playPop();
                    onSetLang(l.code);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    lang === l.code ? 'bg-amber-500 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <span>{l.flag}</span>
                  <span>{l.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              sound.playPop();
              onToggleSound();
            }}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-colors cursor-pointer"
            title={isSoundOn ? 'Couper le son' : 'Activer le son'}
          >
            {isSoundOn ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={() => {
              sound.playPop();
              onToggleTheme();
            }}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-colors cursor-pointer"
            title="Basculer thème sombre / clair"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Parental Controls */}
          <button
            onClick={() => {
              sound.playPop();
              onOpenParental();
            }}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-emerald-100 transition-colors cursor-pointer"
            title="Espace Parental"
          >
            <Shield className="w-4 h-4 text-emerald-600" />
          </button>
        </div>
      </div>
    </header>
  );
};
