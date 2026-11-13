/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * NoorKids Arabe & Coran - Aventure Éducative
 * Créé avec amour par Maryam et son fils
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Language, StudentProfile, ParentalSettings, Badge } from './types';
import { translations } from './data/translations';
import { sound } from './utils/soundEngine';
import {
  loadStudentProfile,
  saveStudentProfile,
  loadStudentRoster,
  saveStudentRoster,
  loadParentalSettings,
  saveParentalSettings,
  ALL_BADGES,
} from './utils/storage';

// Bespoke 3D NoorIcons
import {
  AlphabetIcon3D,
  DailyWordIcon3D,
  PuzzleIcon3D,
  MazeIcon3D,
  StoriesIcon3D,
  QuranIcon3D,
  QuizIcon3D,
  TreeProphetsIcon3D,
  VoiceMicIcon3D,
} from './components/Icons/NoorIcons';

// Core Application Components
import { Navbar } from './components/Navbar';
import { LevelSelectorModal } from './components/LevelSelectorModal';
import { DailyWordCard } from './components/DailyWord/DailyWordCard';
import { AlphabetExplorer } from './components/Alphabet/AlphabetExplorer';
import { WordMatchingPuzzle } from './components/Alphabet/WordMatchingPuzzle';
import { LetterMazeGame } from './components/Alphabet/LetterMazeGame';
import { AlphabetQuiz } from './components/Alphabet/AlphabetQuiz';
import { VoicePronunciationQuiz } from './components/Alphabet/VoicePronunciationQuiz';
import { QuizDuelMode } from './components/Alphabet/QuizDuelMode';
import { VisualDictionary } from './components/Alphabet/VisualDictionary';
import { RootDetectiveGame } from './components/Alphabet/RootDetectiveGame';
import { SouqMarketGame } from './components/Alphabet/SouqMarketGame';
import { DiwanQuestGame } from './components/Alphabet/DiwanQuestGame';
import { MadinaBuilderGame } from './components/Alphabet/MadinaBuilderGame';
import { StoriesHub } from './components/Stories/StoriesHub';
import { QuranReader } from './components/Quran/QuranReader';
import { AIAssistantModal } from './components/AICompanion/AIAssistantModal';
import { LeaderboardModal } from './components/Gamification/LeaderboardModal';
import { BadgesModal } from './components/Gamification/BadgesModal';
import { DailyChallengesModal } from './components/Gamification/DailyChallengesModal';
import { StudentAuthModal } from './components/Auth/StudentAuthModal';
import { StudentStatsCard } from './components/Gamification/StudentStatsCard';
import { SocialShareModal } from './components/Gamification/SocialShareModal';
import { ParentalModal } from './components/ParentalControls/ParentalModal';
import { ScreenTimeBreakModal } from './components/ParentalControls/ScreenTimeBreakModal';
import { AdminDashboard } from './components/AdminDashboard/AdminDashboard';
import { WishLetterModal } from './components/AdminDashboard/WishLetterModal';
import { ChangelogModal } from './components/ChangelogModal';
import { SoundBar } from './components/SoundBar';
import { Sparkles, Heart, Trees, Mail } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  // App state
  const [lang, setLang] = useState<Language>('fr');
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('noorkids_theme') === 'dark';
    }
    return false;
  });

  const [student, setStudent] = useState<StudentProfile>(loadStudentProfile);
  const [roster, setRoster] = useState<StudentProfile[]>(loadStudentRoster);
  const [parentalSettings, setParentalSettings] = useState<ParentalSettings>(loadParentalSettings);
  const [isGameClosed, setIsGameClosed] = useState<boolean>(false);
  const [announcement, setAnnouncement] = useState<string>('');
  const [gameVersion, setGameVersion] = useState<string>('v1.6.0');
  const [activeMultiplier, setActiveMultiplier] = useState<number>(1);

  // Active top-level navigation module
  const [activeTab, setActiveTab] = useState<'daily' | 'alphabet' | 'stories' | 'quran' | 'admin'>('daily');
  const [alphabetSubTab, setAlphabetSubTab] = useState<'explorer' | 'puzzle' | 'maze' | 'quiz' | 'voice' | 'duel' | 'dictionary' | 'roots' | 'souq' | 'diwan' | 'madina'>('explorer');

  // Modals state
  const [isLevelModalOpen, setIsLevelModalOpen] = useState<boolean>(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState<boolean>(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState<boolean>(false);
  const [isBadgesModalOpen, setIsBadgesModalOpen] = useState<boolean>(false);
  const [isDailyChallengesOpen, setIsDailyChallengesOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isParentalModalOpen, setIsParentalModalOpen] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [sharedBadge, setSharedBadge] = useState<Badge | null>(null);
  const [isBreakAlertOpen, setIsBreakAlertOpen] = useState<boolean>(false);
  const [isWishModalOpen, setIsWishModalOpen] = useState<boolean>(false);
  const [isChangelogOpen, setIsChangelogOpen] = useState<boolean>(false);
  const [isSoundOn, setIsSoundOn] = useState<boolean>(() => parentalSettings.soundEnabled);
  const [isMusicOn, setIsMusicOn] = useState<boolean>(() => parentalSettings.musicEnabled);

  // Sync sound settings & subscription
  useEffect(() => {
    sound.setSoundEnabled(parentalSettings.soundEnabled);
    sound.setMusicEnabled(parentalSettings.musicEnabled);
    setIsSoundOn(parentalSettings.soundEnabled);
    setIsMusicOn(parentalSettings.musicEnabled);

    const unsubscribe = sound.subscribe((event, data) => {
      if (event === 'soundToggled') setIsSoundOn(data);
      if (event === 'musicToggled') setIsMusicOn(data);
    });
    return () => unsubscribe();
  }, [parentalSettings]);

  // Dynamic background music themed by current section
  useEffect(() => {
    if (activeTab === 'stories') {
      sound.startMusic('desert_oasis');
    } else if (activeTab === 'quran') {
      sound.startMusic('jannah_garden');
    } else {
      sound.startMusic('noorkids_adventure');
    }
  }, [activeTab]);

  // Sync dark mode class
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('noorkids_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('noorkids_theme', 'light');
    }
  }, [isDark]);

  // Screen time tracking interval (every minute)
  useEffect(() => {
    const timer = setInterval(() => {
      setStudent((prev) => {
        const newMinutes = prev.screenTimeTodayMinutes + 1;
        const updated = { ...prev, screenTimeTodayMinutes: newMinutes };
        saveStudentProfile(updated);

        if (
          parentalSettings.dailyTimeLimitMinutes > 0 &&
          newMinutes >= parentalSettings.dailyTimeLimitMinutes &&
          !isBreakAlertOpen
        ) {
          setIsBreakAlertOpen(true);
        }

        return updated;
      });
    }, 60000);

    return () => clearInterval(timer);
  }, [parentalSettings.dailyTimeLimitMinutes, isBreakAlertOpen]);

  // Global rewards dispatcher with activeMultiplier
  const handleReward = (starsToAdd: number, gemsToAdd: number, milestoneId?: string) => {
    const multipliedStars = starsToAdd * activeMultiplier;
    const multipliedGems = gemsToAdd * activeMultiplier;

    setStudent((prev) => {
      const newBadges = [...prev.badges];

      if (milestoneId && !newBadges.includes(milestoneId)) {
        newBadges.push(milestoneId);
      }
      if (prev.stars + multipliedStars >= 100 && !newBadges.includes('first_letter')) {
        newBadges.push('first_letter');
      }
      if (prev.stars + multipliedStars >= 1000 && !newBadges.includes('stars_1000')) {
        newBadges.push('stars_1000');
      }

      const updated: StudentProfile = {
        ...prev,
        stars: prev.stars + multipliedStars,
        gems: prev.gems + multipliedGems,
        badges: newBadges,
      };

      saveStudentProfile(updated);
      return updated;
    });

    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
  };

  const handleToggleMasterLetter = (letterId: string) => {
    setStudent((prev) => {
      const isAlready = prev.masteredLetters.includes(letterId);
      const newMastered = isAlready
        ? prev.masteredLetters.filter((id) => id !== letterId)
        : [...prev.masteredLetters, letterId];

      const newBadges = [...prev.badges];
      if (newMastered.length >= 28 && !newBadges.includes('alphabet_master')) {
        newBadges.push('alphabet_master');
      }

      const updated = {
        ...prev,
        masteredLetters: newMastered,
        badges: newBadges,
        stars: isAlready ? prev.stars : prev.stars + (20 * activeMultiplier),
      };

      saveStudentProfile(updated);
      return updated;
    });
  };

  const handleAddStudent = (name: string, level: StudentProfile['level'], gender: 'boy' | 'girl', avatar: string) => {
    const newStudent: StudentProfile = {
      id: `NOOR-${Math.floor(100000 + Math.random() * 900000)}`,
      name,
      avatar: avatar || (gender === 'boy' ? '👦' : '👧'),
      stars: 1000,
      gems: 200,
      dailyStreak: 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
      masteredLetters: [],
      completedSurahs: [],
      readStories: [],
      completedPuzzlesCount: 0,
      mazeLevelsBeaten: [],
      quizScores: { totalQuizzes: 0, totalCorrect: 0, bestStreak: 0 },
      badges: ['first_letter'],
      dailyWordsLearned: [],
      screenTimeTodayMinutes: 0,
      level,
      gender,
    };
    const updatedRoster = [...roster, newStudent];
    setRoster(updatedRoster);
    saveStudentRoster(updatedRoster);
    setStudent(newStudent);
    saveStudentProfile(newStudent);
  };

  const handleDeleteStudent = (studentId: string) => {
    if (roster.length <= 1) {
      alert("Impossible de supprimer le dernier élève du roster !");
      return;
    }
    const updatedRoster = roster.filter((s) => s.id !== studentId);
    setRoster(updatedRoster);
    saveStudentRoster(updatedRoster);
    if (student.id === studentId) {
      setStudent(updatedRoster[0]);
      saveStudentProfile(updatedRoster[0]);
    }
  };

  const handleUpdateStudentRole = (studentId: string, role: 'student' | 'admin' | 'creator') => {
    const updatedRoster = roster.map((s) => (s.id === studentId ? { ...s, role } : s));
    setRoster(updatedRoster);
    saveStudentRoster(updatedRoster);
    if (student.id === studentId) {
      const updatedStudent = { ...student, role };
      setStudent(updatedStudent);
      saveStudentProfile(updatedStudent);
    }
  };

  const handleUpdateCurrency = (studentId: string, starsDelta: number, gemsDelta: number) => {
    setRoster((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          const updated = { ...s, stars: Math.max(0, s.stars + starsDelta), gems: Math.max(0, s.gems + gemsDelta) };
          if (student.id === studentId) {
            setStudent(updated);
            saveStudentProfile(updated);
          }
          return updated;
        }
        return s;
      })
    );
  };

  const handleToggleBan = (studentId: string) => {
    setRoster((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          const isCurrentlyBanned = (s as any).isBanned;
          return { ...s, isBanned: !isCurrentlyBanned };
        }
        return s;
      })
    );
  };

  const handleBatchReward = (starsToAdd: number) => {
    const multStars = starsToAdd * activeMultiplier;
    setRoster((prev) =>
      prev.map((s) => ({ ...s, stars: s.stars + multStars }))
    );
    setStudent((prev) => {
      const updated = { ...prev, stars: prev.stars + multStars };
      saveStudentProfile(updated);
      return updated;
    });
  };

  const handleBulkReset = () => {
    setRoster((prev) =>
      prev.map((s) => ({ ...s, stars: 50, gems: 15, masteredLetters: [], completedSurahs: [], badges: ['first_letter'] }))
    );
    setStudent((prev) => {
      const updated = { ...prev, stars: 50, gems: 15, masteredLetters: [], completedSurahs: [], badges: ['first_letter'] };
      saveStudentProfile(updated);
      return updated;
    });
  };

  const t = translations[lang] || translations.fr;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-['Outfit'] transition-colors">
      {/* Navbar with stats and tools */}
      <Navbar
        lang={lang}
        onSetLang={setLang}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        isSoundOn={isSoundOn}
        onToggleSound={() => sound.setSoundEnabled(!isSoundOn)}
        student={student}
        onOpenLevelSelector={() => setIsLevelModalOpen(true)}
        onOpenAI={() => setIsAIModalOpen(true)}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        onOpenBadges={() => setIsBadgesModalOpen(true)}
        onOpenDailyChallenges={() => setIsDailyChallengesOpen(true)}
        onOpenParental={() => setIsParentalModalOpen(true)}
        onOpenAdmin={() => setActiveTab('admin')}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {announcement && (
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white px-4 py-2.5 text-center text-xs font-bold shadow-md flex items-center justify-center gap-2">
          <span>📢 {announcement}</span>
          <button onClick={() => setAnnouncement('')} className="ml-4 opacity-80 hover:opacity-100 text-sm cursor-pointer">✕</button>
        </div>
      )}

      {/* Active Multiplier Notification Badge if > 1 */}
      {activeMultiplier > 1 && (
        <div className="bg-indigo-600 text-white px-4 py-1.5 text-center text-xs font-black shadow-inner flex items-center justify-center gap-2">
          <span>⚡ MULTIPLICATEUR ACTIF : {activeMultiplier}X sur tous les gains ⭐ & 💎 !</span>
        </div>
      )}

      {/* Primary Navigation Ribbon with 3D Icons */}
      <nav className="bg-white dark:bg-slate-900 border-b border-amber-200/60 dark:border-slate-800 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto py-2.5 no-scrollbar">
            {/* 1. Daily Word Tab */}
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { sound.playPop(); setActiveTab('daily'); }}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'daily' ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20' : 'text-slate-600 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-slate-800'
              }`}
            >
              <DailyWordIcon3D size={26} />
              <span>{t.navDailyWord}</span>
            </motion.button>

            {/* 2. Alphabet Tab */}
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { sound.playPop(); setActiveTab('alphabet'); }}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'alphabet' ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20' : 'text-slate-600 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-slate-800'
              }`}
            >
              <AlphabetIcon3D size={26} />
              <span>{t.navAlphabet}</span>
            </motion.button>

            {/* 3. Stories Tab */}
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { sound.playPop(); setActiveTab('stories'); }}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'stories' ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20' : 'text-slate-600 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-slate-800'
              }`}
            >
              <StoriesIcon3D size={26} />
              <span>{t.navStories}</span>
            </motion.button>

            {/* 4. Holy Quran Tab */}
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { sound.playPop(); setActiveTab('quran'); }}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'quran' ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20' : 'text-slate-600 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-slate-800'
              }`}
            >
              <QuranIcon3D size={26} />
              <span>{t.navQuran}</span>
            </motion.button>

            {/* 5. Admin Command Tab */}
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { sound.playPop(); setActiveTab('admin'); }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'admin' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' : 'text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-800'
              }`}
            >
              <span>⚙️</span>
              <span>{t.navAdmin}</span>
            </motion.button>
          </div>

          {/* Wish Letter Modal Button in Navbar */}
          <button
            onClick={() => {
              sound.playPop();
              setIsWishModalOpen(true);
            }}
            className="hidden lg:flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md cursor-pointer"
          >
            <Mail className="w-4 h-4" />
            <span>Boîte à Souhaits 💌</span>
          </button>
        </div>
      </nav>

      {/* Sub-Navigation for Alphabet module */}
      {activeTab === 'alphabet' && (
        <div className="bg-amber-50/60 dark:bg-slate-900/60 border-b border-amber-200/40 dark:border-slate-800/60 py-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-center sm:justify-start gap-2 overflow-x-auto no-scrollbar">
              <button
                onClick={() => { sound.playPop(); setAlphabetSubTab('explorer'); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  alphabetSubTab === 'explorer' ? 'bg-white dark:bg-slate-800 text-amber-700 dark:text-amber-300 shadow-xs border border-amber-300 dark:border-slate-700' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <span>🔤</span>
                <span>{lang === 'ar' ? 'استعراض الحروف (28)' : "L'Alphabet"}</span>
              </button>

              <button
                onClick={() => { sound.playPop(); setAlphabetSubTab('puzzle'); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  alphabetSubTab === 'puzzle' ? 'bg-white dark:bg-slate-800 text-sky-700 dark:text-sky-300 shadow-xs border border-sky-300 dark:border-slate-700' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <PuzzleIcon3D size={18} />
                <span>{t.navPuzzle}</span>
              </button>

              <button
                onClick={() => { sound.playPop(); setAlphabetSubTab('maze'); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  alphabetSubTab === 'maze' ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 shadow-xs border border-emerald-300 dark:border-slate-700' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <MazeIcon3D size={18} />
                <span>{t.navMaze}</span>
              </button>

              <button
                onClick={() => { sound.playPop(); setAlphabetSubTab('quiz'); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  alphabetSubTab === 'quiz' ? 'bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-300 shadow-xs border border-purple-300 dark:border-slate-700' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <QuizIcon3D size={18} />
                <span>{t.navQuiz}</span>
              </button>

              <button
                onClick={() => { sound.playPop(); setAlphabetSubTab('voice'); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  alphabetSubTab === 'voice' ? 'bg-white dark:bg-slate-800 text-rose-700 dark:text-rose-300 shadow-xs border border-rose-300 dark:border-slate-700' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <VoiceMicIcon3D size={18} />
                <span>{t.navVoiceQuiz || 'Quiz Vocal'}</span>
              </button>

              <button
                onClick={() => { sound.playPop(); setAlphabetSubTab('duel'); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  alphabetSubTab === 'duel' ? 'bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 shadow-xs border border-indigo-300 dark:border-slate-700' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <span>⚔️</span>
                <span>Quiz Duel</span>
              </button>

              <button
                onClick={() => { sound.playPop(); setAlphabetSubTab('dictionary'); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  alphabetSubTab === 'dictionary' ? 'bg-white dark:bg-slate-800 text-violet-700 dark:text-violet-300 shadow-xs border border-violet-300 dark:border-slate-700' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <span>📖</span>
                <span>Dictionnaire</span>
              </button>

              <button
                onClick={() => { sound.playPop(); setAlphabetSubTab('roots'); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  alphabetSubTab === 'roots' ? 'bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-300 shadow-xs border border-purple-300 dark:border-slate-700' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <span>🕵️‍♂️</span>
                <span>Racines</span>
              </button>

              <button
                onClick={() => { sound.playPop(); setAlphabetSubTab('souq'); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  alphabetSubTab === 'souq' ? 'bg-white dark:bg-slate-800 text-amber-700 dark:text-amber-300 shadow-xs border border-amber-300 dark:border-slate-700' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <span>🛒</span>
                <span>Souq</span>
              </button>

              <button
                onClick={() => { sound.playPop(); setAlphabetSubTab('diwan'); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  alphabetSubTab === 'diwan' ? 'bg-white dark:bg-slate-800 text-teal-700 dark:text-teal-300 shadow-xs border border-teal-300 dark:border-slate-700' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <span>📜</span>
                <span>Diwan</span>
              </button>

              <button
                onClick={() => { sound.playPop(); setAlphabetSubTab('madina'); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  alphabetSubTab === 'madina' ? 'bg-white dark:bg-slate-800 text-cyan-700 dark:text-cyan-300 shadow-xs border border-cyan-300 dark:border-slate-700' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <span>🏙️</span>
                <span>Madina</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main View Port */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + (activeTab === 'alphabet' ? alphabetSubTab : '')}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            {activeTab === 'daily' && (
              <div className="space-y-6">
                <DailyWordCard
                  lang={lang}
                  onReward={(stars, gems, wordId) => {
                    handleReward(stars, gems, 'daily_word_hero');
                    setStudent((prev) => {
                      if (prev.dailyWordsLearned.includes(wordId)) return prev;
                      const updated = {
                        ...prev,
                        dailyWordsLearned: [...prev.dailyWordsLearned, wordId],
                      };
                      saveStudentProfile(updated);
                      return updated;
                    });
                  }}
                  learnedWords={student.dailyWordsLearned}
                />

                <StudentStatsCard student={student} lang={lang} />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <motion.button
                    whileHover={{ scale: 1.03, y: -3 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => { sound.playPop(); setActiveTab('alphabet'); setAlphabetSubTab('voice'); }}
                    className="p-5 rounded-3xl bg-white dark:bg-slate-900 border-2 border-rose-300 dark:border-slate-700 hover:border-rose-500 shadow-sm hover:shadow-md transition-colors text-left flex items-center gap-4 cursor-pointer"
                  >
                    <VoiceMicIcon3D size={42} />
                    <div>
                      <h4 className="font-bold text-sm text-slate-800 dark:text-white font-['Fredoka']">Quiz Vocal</h4>
                      <p className="text-xs text-slate-500">Parle au micro pour prononcer l'arabe</p>
                    </div>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.03, y: -3 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => { sound.playPop(); setActiveTab('alphabet'); setAlphabetSubTab('puzzle'); }}
                    className="p-5 rounded-3xl bg-white dark:bg-slate-900 border-2 border-sky-300 dark:border-slate-700 hover:border-sky-500 shadow-sm hover:shadow-md transition-colors text-left flex items-center gap-4 cursor-pointer"
                  >
                    <PuzzleIcon3D size={42} />
                    <div>
                      <h4 className="font-bold text-sm text-slate-800 dark:text-white font-['Fredoka']">Puzzles de Mots</h4>
                      <p className="text-xs text-slate-500">Relie les lettres aux animaux illustrés</p>
                    </div>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.03, y: -3 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => { sound.playPop(); setActiveTab('alphabet'); setAlphabetSubTab('maze'); }}
                    className="p-5 rounded-3xl bg-white dark:bg-slate-900 border-2 border-emerald-300 dark:border-slate-700 hover:border-emerald-500 shadow-sm hover:shadow-md transition-colors text-left flex items-center gap-4 cursor-pointer"
                  >
                    <MazeIcon3D size={42} />
                    <div>
                      <h4 className="font-bold text-sm text-slate-800 dark:text-white font-['Fredoka']">Le Labyrinthe</h4>
                      <p className="text-xs text-slate-500">Guide Badr à travers les lettres</p>
                    </div>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.03, y: -3 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => { sound.playPop(); setActiveTab('stories'); }}
                    className="p-5 rounded-3xl bg-white dark:bg-slate-900 border-2 border-amber-300 dark:border-slate-700 hover:border-amber-500 shadow-sm hover:shadow-md transition-colors text-left flex items-center gap-4 cursor-pointer"
                  >
                    <StoriesIcon3D size={42} />
                    <div>
                      <h4 className="font-bold text-sm text-slate-800 dark:text-white font-['Fredoka']">Histoires des Prophètes</h4>
                      <p className="text-xs text-slate-500">Récits animés avec images IA</p>
                    </div>
                  </motion.button>
                </div>
              </div>
            )}

            {activeTab === 'alphabet' && (
              <div>
                {alphabetSubTab === 'explorer' && (
                  <AlphabetExplorer
                    lang={lang}
                    masteredLetterIds={student.masteredLetters}
                    onToggleMaster={handleToggleMasterLetter}
                  />
                )}
                {alphabetSubTab === 'puzzle' && (
                  <WordMatchingPuzzle
                    lang={lang}
                    level={student.level}
                    onReward={(stars, gems) => handleReward(stars, gems, 'puzzle_champion')}
                  />
                )}
                {alphabetSubTab === 'maze' && (
                  <LetterMazeGame
                    lang={lang}
                    level={student.level}
                    onReward={(stars, gems) => handleReward(stars, gems, 'maze_conqueror')}
                  />
                )}
                {alphabetSubTab === 'quiz' && (
                  <AlphabetQuiz
                    lang={lang}
                    onReward={(stars, gems) => handleReward(stars, gems)}
                  />
                )}
                {alphabetSubTab === 'voice' && (
                  <VoicePronunciationQuiz
                    lang={lang}
                    onReward={(stars, gems, badgeId) => handleReward(stars, gems, badgeId || 'voice_star')}
                  />
                )}
                {alphabetSubTab === 'duel' && (
                  <QuizDuelMode
                    lang={lang}
                    roster={roster}
                    currentStudent={student}
                    onReward={(stars, gems) => handleReward(stars, gems, 'first_letter')}
                    onBack={() => setAlphabetSubTab('explorer')}
                  />
                )}
                {alphabetSubTab === 'dictionary' && (
                  <VisualDictionary lang={lang} />
                )}
                {alphabetSubTab === 'roots' && (
                  <RootDetectiveGame lang={lang} onReward={(s, g) => handleReward(s, g, 'first_letter')} />
                )}
                {alphabetSubTab === 'souq' && (
                  <SouqMarketGame
                    lang={lang}
                    student={student}
                    onUpdateStudent={setStudent}
                  />
                )}
                {alphabetSubTab === 'diwan' && (
                  <DiwanQuestGame lang={lang} onReward={(s, g) => handleReward(s, g, 'first_letter')} />
                )}
                {alphabetSubTab === 'madina' && (
                  <MadinaBuilderGame lang={lang} onReward={(s, g) => handleReward(s, g, 'first_letter')} />
                )}
              </div>
            )}

            {activeTab === 'stories' && (
              <StoriesHub
                lang={lang}
                readStoryIds={student.readStories}
                onReward={(stars, gems, storyId) => {
                  handleReward(stars, gems, 'prophets_friend');
                  setStudent((prev) => {
                    if (prev.readStories.includes(storyId)) return prev;
                    const updated = {
                      ...prev,
                      readStories: [...prev.readStories, storyId],
                    };
                    saveStudentProfile(updated);
                    return updated;
                  });
                }}
              />
            )}

            {activeTab === 'quran' && (
              <QuranReader
                lang={lang}
                onReward={(stars, gems, surahNumber) => {
                  handleReward(stars, gems, 'little_hafiz');
                  setStudent((prev) => {
                    const newSurahs = prev.completedSurahs.includes(surahNumber)
                      ? prev.completedSurahs
                      : [...prev.completedSurahs, surahNumber];
                    const updated = {
                      ...prev,
                      completedSurahs: newSurahs,
                      surahRewardCooldowns: {
                        ...(prev.surahRewardCooldowns || {}),
                        [surahNumber]: Date.now(),
                      },
                    };
                    saveStudentProfile(updated);
                    return updated;
                  });
                }}
                completedSurahs={student.completedSurahs}
                surahRewardCooldowns={student.surahRewardCooldowns || {}}
              />
            )}

            {activeTab === 'admin' && (
              <AdminDashboard
                lang={lang}
                roster={roster}
                activeStudent={student}
                onSelectStudent={(selected) => {
                  setStudent(selected);
                  saveStudentProfile(selected);
                }}
                onAddStudent={handleAddStudent}
                onDeleteStudent={handleDeleteStudent}
                onUpdateStudentRole={handleUpdateStudentRole}
                onUpdateCurrency={handleUpdateCurrency}
                onToggleBan={handleToggleBan}
                isGameClosed={isGameClosed}
                onToggleCloseGame={setIsGameClosed}
                onBatchReward={handleBatchReward}
                onBulkReset={handleBulkReset}
                announcement={announcement}
                onSetAnnouncement={setAnnouncement}
                gameVersion={gameVersion}
                onSetGameVersion={setGameVersion}
                activeMultiplier={activeMultiplier}
                onSetMultiplier={setActiveMultiplier}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Banned for Cheating Overlay */}
      {Boolean((student as any).isBanned) && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-md w-full text-center space-y-6 border-4 border-rose-600 shadow-2xl">
            <div className="w-20 h-20 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto text-4xl animate-bounce">
              🛑
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black font-['Fredoka'] text-slate-900 dark:text-white">
                Compte Banni pour Tricherie !
              </h3>
              <p className="text-xs text-rose-600 dark:text-rose-400 font-bold">
                You are banned for cheating. Votre accès aux jeux a été suspendu par l’administrateur.
              </p>
            </div>
            <div className="text-xs text-slate-500">
              Veuillez contacter le créateur (Maryam & son fils) depuis le panneau administrateur.
            </div>
          </div>
        </div>
      )}

      {/* Game Closed / Lockdown Overlay */}
      {isGameClosed && activeTab !== 'admin' && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-md w-full text-center space-y-6 border-4 border-rose-500 shadow-2xl">
            <div className="w-20 h-20 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto text-4xl">
              🔒
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black font-['Fredoka'] text-slate-900 dark:text-white">
                Jeu Fermé & Verrouillé
              </h3>
              <p className="text-xs text-slate-500">
                L’application a été temporairement fermée par le créateur. Revenez plus tard.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('admin')}
              className="w-full py-3.5 rounded-2xl bg-indigo-600 text-white font-black text-xs shadow-lg hover:bg-indigo-700 cursor-pointer"
            >
              Accéder au Panneau Créateur
            </button>
          </div>
        </div>
      )}

      {/* Footer with version and dedication */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 mt-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-800 dark:text-white font-['Fredoka'] text-sm">
              NoorKids Arabe & Coran ({gameVersion})
            </span>
            <span>·</span>
            <span className="flex items-center gap-1 text-amber-700 dark:text-amber-400 font-semibold">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              Créé avec amour par Maryam et son fils
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sound.playPop();
                setIsChangelogOpen(true);
              }}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 font-bold text-xs hover:bg-indigo-200 transition-colors cursor-pointer"
            >
              <span>🚀</span>
              <span>Notes de Version</span>
            </button>
            <button
              onClick={() => setIsWishModalOpen(true)}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold text-xs hover:bg-amber-200 transition-colors cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Envoyer un vœu</span>
            </button>
            <span>·</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              100% Fonctionnel Hors Ligne
            </span>
          </div>
        </div>
      </footer>

      {/* Modals Collection */}
      <LevelSelectorModal
        isOpen={isLevelModalOpen}
        onClose={() => setIsLevelModalOpen(false)}
        currentLevel={student.level}
        onSelectLevel={(lvl) => {
          setStudent((prev) => {
            const updated = { ...prev, level: lvl };
            saveStudentProfile(updated);
            return updated;
          });
        }}
        lang={lang}
      />

      <AIAssistantModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        lang={lang}
        student={student}
      />

      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        lang={lang}
        roster={roster}
        currentStudentId={student.id}
      />

      <BadgesModal
        isOpen={isBadgesModalOpen}
        onClose={() => setIsBadgesModalOpen(false)}
        lang={lang}
        unlockedBadgeIds={student.badges}
        onOpenShare={(b) => {
          setSharedBadge(b);
          setIsShareModalOpen(true);
        }}
      />

      <SocialShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        lang={lang}
        student={student}
        badge={sharedBadge}
      />

      <ParentalModal
        isOpen={isParentalModalOpen}
        onClose={() => setIsParentalModalOpen(false)}
        lang={lang}
        settings={parentalSettings}
        onUpdateSettings={(newSettings) => {
          setParentalSettings(newSettings);
          saveParentalSettings(newSettings);
        }}
        student={student}
        onOpenSocialShare={() => setIsShareModalOpen(true)}
      />

      <ScreenTimeBreakModal
        isOpen={isBreakAlertOpen}
        onExtend={() => {
          setIsBreakAlertOpen(false);
          setParentalSettings((prev) => {
            const updated = { ...prev, dailyTimeLimitMinutes: prev.dailyTimeLimitMinutes + 15 };
            saveParentalSettings(updated);
            return updated;
          });
        }}
        lang={lang}
      />

      <WishLetterModal
        isOpen={isWishModalOpen}
        onClose={() => setIsWishModalOpen(false)}
        studentName={student.name}
      />

      <ChangelogModal
        isOpen={isChangelogOpen}
        onClose={() => setIsChangelogOpen(false)}
        lang={lang}
        version={gameVersion}
      />

      <StudentAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        lang={lang}
        currentStudent={student}
        roster={roster}
        onSelectStudent={(selected) => {
          setStudent(selected);
          saveStudentProfile(selected);
        }}
        onAddStudent={handleAddStudent}
      />

      <DailyChallengesModal
        isOpen={isDailyChallengesOpen}
        onClose={() => setIsDailyChallengesOpen(false)}
        lang={lang}
        student={student}
        onUpdateStudent={setStudent}
        onReward={handleReward}
      />

      {/* Floating Sound & Music Controller */}
      <SoundBar lang={lang} />
    </div>
  );
}
