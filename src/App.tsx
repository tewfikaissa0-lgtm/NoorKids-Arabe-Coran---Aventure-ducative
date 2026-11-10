/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * NoorKids Arabe & Coran - Aventure Éducative
 * Créé avec amour par Maryam et son fils
 */

import React, { useState, useEffect } from 'react';
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
} from './components/Icons/NoorIcons';

// Core Application Components
import { Navbar } from './components/Navbar';
import { LevelSelectorModal } from './components/LevelSelectorModal';
import { DailyWordCard } from './components/DailyWord/DailyWordCard';
import { AlphabetExplorer } from './components/Alphabet/AlphabetExplorer';
import { WordMatchingPuzzle } from './components/Alphabet/WordMatchingPuzzle';
import { LetterMazeGame } from './components/Alphabet/LetterMazeGame';
import { AlphabetQuiz } from './components/Alphabet/AlphabetQuiz';
import { StoriesHub } from './components/Stories/StoriesHub';
import { QuranReader } from './components/Quran/QuranReader';
import { AIAssistantModal } from './components/AICompanion/AIAssistantModal';
import { LeaderboardModal } from './components/Gamification/LeaderboardModal';
import { BadgesModal } from './components/Gamification/BadgesModal';
import { SocialShareModal } from './components/Gamification/SocialShareModal';
import { ParentalModal } from './components/ParentalControls/ParentalModal';
import { ScreenTimeBreakModal } from './components/ParentalControls/ScreenTimeBreakModal';
import { AdminDashboard } from './components/AdminDashboard/AdminDashboard';
import { Sparkles, Heart, Trees } from 'lucide-react';

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

  // Active top-level navigation module
  const [activeTab, setActiveTab] = useState<'daily' | 'alphabet' | 'stories' | 'quran' | 'admin'>('daily');
  // Sub-tabs inside Alphabet module
  const [alphabetSubTab, setAlphabetSubTab] = useState<'explorer' | 'puzzle' | 'maze' | 'quiz'>('explorer');

  // Modals state
  const [isLevelModalOpen, setIsLevelModalOpen] = useState<boolean>(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState<boolean>(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState<boolean>(false);
  const [isBadgesModalOpen, setIsBadgesModalOpen] = useState<boolean>(false);
  const [isParentalModalOpen, setIsParentalModalOpen] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [sharedBadge, setSharedBadge] = useState<Badge | null>(null);
  const [isBreakAlertOpen, setIsBreakAlertOpen] = useState<boolean>(false);

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

        // Check daily limit
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

  // Global rewards dispatcher
  const handleReward = (starsToAdd: number, gemsToAdd: number, milestoneId?: string) => {
    setStudent((prev) => {
      const newBadges = [...prev.badges];

      // Check unlocking badges
      if (milestoneId && !newBadges.includes(milestoneId)) {
        newBadges.push(milestoneId);
      }
      if (prev.stars + starsToAdd >= 100 && !newBadges.includes('first_letter')) {
        newBadges.push('first_letter');
      }

      const updated: StudentProfile = {
        ...prev,
        stars: prev.stars + starsToAdd,
        gems: prev.gems + gemsToAdd,
        badges: newBadges,
      };

      saveStudentProfile(updated);
      return updated;
    });
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
        stars: isAlready ? prev.stars : prev.stars + 20,
      };

      saveStudentProfile(updated);
      return updated;
    });
  };

  const handleAddStudent = (name: string, level: StudentProfile['level']) => {
    const newStudent: StudentProfile = {
      id: `student-${Date.now()}`,
      name,
      avatar: '🧒',
      stars: 50,
      gems: 15,
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
    };
    const updatedRoster = [...roster, newStudent];
    setRoster(updatedRoster);
    saveStudentRoster(updatedRoster);
    setStudent(newStudent);
    saveStudentProfile(newStudent);
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
        isSoundOn={sound.isSoundEnabled()}
        onToggleSound={() => sound.setSoundEnabled(!sound.isSoundEnabled())}
        student={student}
        onOpenLevelSelector={() => setIsLevelModalOpen(true)}
        onOpenAI={() => setIsAIModalOpen(true)}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        onOpenBadges={() => setIsBadgesModalOpen(true)}
        onOpenParental={() => setIsParentalModalOpen(true)}
        onOpenAdmin={() => setActiveTab('admin')}
      />

      {/* Primary Navigation Ribbon with 3D Icons */}
      <nav className="bg-white dark:bg-slate-900 border-b border-amber-200/60 dark:border-slate-800 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto py-2.5 no-scrollbar">
            {/* 1. Daily Word Tab */}
            <button
              onClick={() => {
                sound.playPop();
                setActiveTab('daily');
              }}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'daily'
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20 scale-102'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-slate-800'
              }`}
            >
              <DailyWordIcon3D size={26} />
              <span>{t.navDailyWord}</span>
            </button>

            {/* 2. Alphabet Tab */}
            <button
              onClick={() => {
                sound.playPop();
                setActiveTab('alphabet');
              }}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'alphabet'
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20 scale-102'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-slate-800'
              }`}
            >
              <AlphabetIcon3D size={26} />
              <span>{t.navAlphabet}</span>
            </button>

            {/* 3. Stories Tab */}
            <button
              onClick={() => {
                sound.playPop();
                setActiveTab('stories');
              }}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'stories'
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20 scale-102'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-slate-800'
              }`}
            >
              <StoriesIcon3D size={26} />
              <span>{t.navStories}</span>
            </button>

            {/* 4. Holy Quran Tab */}
            <button
              onClick={() => {
                sound.playPop();
                setActiveTab('quran');
              }}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'quran'
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20 scale-102'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-slate-800'
              }`}
            >
              <QuranIcon3D size={26} />
              <span>{t.navQuran}</span>
            </button>

            {/* 5. Admin Command Tab */}
            <button
              onClick={() => {
                sound.playPop();
                setActiveTab('admin');
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 scale-102'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-800'
              }`}
            >
              <span>⚙️</span>
              <span>{t.navAdmin}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Sub-Navigation for Alphabet module */}
      {activeTab === 'alphabet' && (
        <div className="bg-amber-50/60 dark:bg-slate-900/60 border-b border-amber-200/40 dark:border-slate-800/60 py-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-center sm:justify-start gap-2 overflow-x-auto no-scrollbar">
              <button
                onClick={() => {
                  sound.playPop();
                  setAlphabetSubTab('explorer');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  alphabetSubTab === 'explorer'
                    ? 'bg-white dark:bg-slate-800 text-amber-700 dark:text-amber-300 shadow-xs border border-amber-300 dark:border-slate-700'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <span>🔤</span>
                <span>{lang === 'ar' ? 'استعراض الحروف (28)' : "L'Alphabet (28 lettres)"}</span>
              </button>

              <button
                onClick={() => {
                  sound.playPop();
                  setAlphabetSubTab('puzzle');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  alphabetSubTab === 'puzzle'
                    ? 'bg-white dark:bg-slate-800 text-sky-700 dark:text-sky-300 shadow-xs border border-sky-300 dark:border-slate-700'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <PuzzleIcon3D size={18} />
                <span>{t.navPuzzle}</span>
              </button>

              <button
                onClick={() => {
                  sound.playPop();
                  setAlphabetSubTab('maze');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  alphabetSubTab === 'maze'
                    ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 shadow-xs border border-emerald-300 dark:border-slate-700'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <MazeIcon3D size={18} />
                <span>{t.navMaze}</span>
              </button>

              <button
                onClick={() => {
                  sound.playPop();
                  setAlphabetSubTab('quiz');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  alphabetSubTab === 'quiz'
                    ? 'bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-300 shadow-xs border border-purple-300 dark:border-slate-700'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <QuizIcon3D size={18} />
                <span>{t.navQuiz}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main View Port */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
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

            {/* Quick jump to game sections */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => {
                  sound.playPop();
                  setActiveTab('alphabet');
                  setAlphabetSubTab('puzzle');
                }}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border-2 border-sky-300 dark:border-slate-700 hover:border-sky-500 shadow-sm hover:shadow-md transition-all text-left flex items-center gap-4 cursor-pointer"
              >
                <PuzzleIcon3D size={42} />
                <div>
                  <h4 className="font-bold text-sm text-slate-800 dark:text-white font-['Fredoka']">
                    Puzzles de Mots
                  </h4>
                  <p className="text-xs text-slate-500">Relie les lettres aux animaux illustrés</p>
                </div>
              </button>

              <button
                onClick={() => {
                  sound.playPop();
                  setActiveTab('alphabet');
                  setAlphabetSubTab('maze');
                }}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border-2 border-emerald-300 dark:border-slate-700 hover:border-emerald-500 shadow-sm hover:shadow-md transition-all text-left flex items-center gap-4 cursor-pointer"
              >
                <MazeIcon3D size={42} />
                <div>
                  <h4 className="font-bold text-sm text-slate-800 dark:text-white font-['Fredoka']">
                    Le Labyrinthe
                  </h4>
                  <p className="text-xs text-slate-500">Guide Badr à travers les lettres</p>
                </div>
              </button>

              <button
                onClick={() => {
                  sound.playPop();
                  setActiveTab('stories');
                }}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border-2 border-amber-300 dark:border-slate-700 hover:border-amber-500 shadow-sm hover:shadow-md transition-all text-left flex items-center gap-4 cursor-pointer"
              >
                <StoriesIcon3D size={42} />
                <div>
                  <h4 className="font-bold text-sm text-slate-800 dark:text-white font-['Fredoka']">
                    Histoires des Prophètes
                  </h4>
                  <p className="text-xs text-slate-500">Récits animés avec images IA & voix</p>
                </div>
              </button>
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
                if (prev.completedSurahs.includes(surahNumber)) return prev;
                const updated = {
                  ...prev,
                  completedSurahs: [...prev.completedSurahs, surahNumber],
                };
                saveStudentProfile(updated);
                return updated;
              });
            }}
            completedSurahs={student.completedSurahs}
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
          />
        )}
      </main>

      {/* Footer with dedication and offline badge */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 mt-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-800 dark:text-white font-['Fredoka'] text-sm">
              NoorKids Arabe & Coran
            </span>
            <span>·</span>
            <span className="flex items-center gap-1 text-amber-700 dark:text-amber-400 font-semibold">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              Créé avec amour par Maryam et son fils
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              100% Fonctionnel Hors Ligne
            </span>
            <span>·</span>
            <span>Français · العربية · English · Español</span>
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
    </div>
  );
}
