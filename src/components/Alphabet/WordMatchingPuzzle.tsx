import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ArabicLetter, Language, StudentProfile } from '../../types';
import { ALPHABET_DATA } from '../../data/alphabetData';
import { sound } from '../../utils/soundEngine';
import { Sparkles, RotateCcw, Volume2, Trophy, CheckCircle2 } from 'lucide-react';

interface WordMatchingPuzzleProps {
  lang: Language;
  level: StudentProfile['level'];
  onReward: (stars: number, gems: number) => void;
}

interface PuzzleItem {
  id: string;
  type: 'letter' | 'word';
  letterId: string;
  display: string;
  arabicWord?: string;
  meaning?: string;
  emoji?: string;
  isMatched: boolean;
}

export const WordMatchingPuzzle: React.FC<WordMatchingPuzzleProps> = ({ lang, level, onReward }) => {
  const pairCount = level === 'Débutant' ? 3 : level === 'Intermédiaire' ? 4 : 6;

  const [cards, setCards] = useState<PuzzleItem[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<PuzzleItem | null>(null);
  const [selectedWord, setSelectedWord] = useState<PuzzleItem | null>(null);
  const [matchedPairsCount, setMatchedPairsCount] = useState<number>(0);
  const [roundCompleted, setRoundCompleted] = useState<boolean>(false);

  // Initialize new game board
  const setupBoard = () => {
    sound.playPop();
    // Pick random subset of letters
    const shuffledLetters = [...ALPHABET_DATA].sort(() => Math.random() - 0.5).slice(0, pairCount);

    const letterCards: PuzzleItem[] = shuffledLetters.map((l) => ({
      id: `letter-${l.id}`,
      type: 'letter',
      letterId: l.id,
      display: l.letter,
      isMatched: false,
    }));

    const wordCards: PuzzleItem[] = shuffledLetters.map((l) => ({
      id: `word-${l.id}`,
      type: 'word',
      letterId: l.id,
      display: l.exampleWord.arabic,
      arabicWord: l.exampleWord.arabic,
      meaning: l.exampleWord.meaning[lang],
      emoji: l.exampleWord.emoji,
      isMatched: false,
    }));

    // Shuffle both independently for a clean 2-column or grid layout
    setCards([...letterCards.sort(() => Math.random() - 0.5), ...wordCards.sort(() => Math.random() - 0.5)]);
    setSelectedLetter(null);
    setSelectedWord(null);
    setMatchedPairsCount(0);
    setRoundCompleted(false);
  };

  useEffect(() => {
    setupBoard();
  }, [pairCount, lang]);

  const handleCardClick = (card: PuzzleItem) => {
    if (card.isMatched) return;

    sound.playPop();

    if (card.type === 'letter') {
      sound.speakArabic(card.display);
      setSelectedLetter(card);

      if (selectedWord) {
        checkMatch(card, selectedWord);
      }
    } else {
      if (card.arabicWord) sound.speakArabic(card.arabicWord);
      setSelectedWord(card);

      if (selectedLetter) {
        checkMatch(selectedLetter, card);
      }
    }
  };

  const checkMatch = (letterCard: PuzzleItem, wordCard: PuzzleItem) => {
    if (letterCard.letterId === wordCard.letterId) {
      // Match found!
      sound.playStarChime();
      const updatedCards = cards.map((c) =>
        c.letterId === letterCard.letterId ? { ...c, isMatched: true } : c
      );
      setCards(updatedCards);
      setSelectedLetter(null);
      setSelectedWord(null);

      const newCount = matchedPairsCount + 1;
      setMatchedPairsCount(newCount);

      if (newCount === pairCount) {
        // Round won!
        sound.playCelebrationFanfare();
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
        setRoundCompleted(true);
        onReward(25, 3);
      }
    } else {
      // Wrong match
      sound.playGentleBoing();
      setTimeout(() => {
        setSelectedLetter(null);
        setSelectedWord(null);
      }, 500);
    }
  };

  const letterCards = cards.filter((c) => c.type === 'letter');
  const wordCards = cards.filter((c) => c.type === 'word');

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-xl border-3 border-amber-300 dark:border-amber-700/50">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500 text-white shadow-xs">
              <Sparkles className="w-5 h-5" />
            </span>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white font-['Fredoka']">
              {lang === 'ar' ? 'ألغاز مطابقة الحروف والكلمات' : lang === 'en' ? 'Interactive Word Matching Puzzle' : 'Puzzles Mots & Lettres'}
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {lang === 'ar'
              ? 'اختر حرفاً ثم اضغط على الكلمة المصورة المناسبة له !'
              : lang === 'en'
              ? 'Tap a letter, then tap its matching illustrated word card!'
              : 'Clique sur une lettre puis sur son mot illustré correspondant !'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold text-xs">
            ⭐ {matchedPairsCount} / {pairCount} {lang === 'ar' ? 'أزواج' : 'paires'}
          </div>
          <button
            onClick={setupBoard}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-amber-200 font-bold text-xs transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'لوحة جديدة' : 'Nouveau plateau'}</span>
          </button>
        </div>
      </div>

      {/* Matching Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Letters Column */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
            1. {lang === 'ar' ? 'الحروف العربية' : 'Les Lettres Arabes'}
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {letterCards.map((card) => {
              const isSelected = selectedLetter?.id === card.id;
              return (
                <button
                  key={card.id}
                  disabled={card.isMatched}
                  onClick={() => handleCardClick(card)}
                  className={`h-24 rounded-2xl flex flex-col items-center justify-center font-['Amiri'] font-bold text-5xl transition-all border-3 cursor-pointer ${
                    card.isMatched
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-600 opacity-60 scale-95 shadow-none'
                      : isSelected
                      ? 'bg-amber-100 dark:bg-amber-950 border-amber-500 text-amber-700 dark:text-amber-300 scale-105 shadow-lg ring-4 ring-amber-400/30'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white hover:border-amber-400 hover:scale-102 shadow-sm'
                  }`}
                >
                  <span>{card.display}</span>
                  {card.isMatched && <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-1" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Illustrated Words Column */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-sky-600 dark:text-sky-400">
            2. {lang === 'ar' ? 'الكلمات المصورة' : 'Les Mots Illustrés'}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {wordCards.map((card) => {
              const isSelected = selectedWord?.id === card.id;
              return (
                <button
                  key={card.id}
                  disabled={card.isMatched}
                  onClick={() => handleCardClick(card)}
                  className={`p-3.5 rounded-2xl flex items-center justify-between transition-all border-3 cursor-pointer text-left ${
                    card.isMatched
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 opacity-60 scale-95 shadow-none'
                      : isSelected
                      ? 'bg-sky-100 dark:bg-sky-950 border-sky-500 scale-105 shadow-lg ring-4 ring-sky-400/30'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-sky-400 hover:scale-102 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{card.emoji}</span>
                    <div>
                      <div className="text-2xl font-bold font-['Amiri'] text-slate-800 dark:text-white" dir="rtl">
                        {card.display}
                      </div>
                      <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {card.meaning}
                      </div>
                    </div>
                  </div>
                  {card.isMatched ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-slate-400" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Completion Modal / Banner */}
      {roundCompleted && (
        <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white flex flex-col sm:flex-row items-center justify-between gap-4 animate-bounce">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <Trophy className="w-8 h-8 text-yellow-300" />
            <div>
              <div className="font-black text-lg">
                {lang === 'ar' ? 'ممتاز ! لقد ربطت جميع الحروف بنجاح !' : 'Bravo ! Tu as trouvé toutes les paires !'}
              </div>
              <div className="text-xs text-emerald-100">
                +25 Étoiles & +3 Diamants ajoutés à ta récompense
              </div>
            </div>
          </div>
          <button
            onClick={setupBoard}
            className="px-5 py-2 rounded-xl bg-white text-emerald-700 font-black text-xs shadow-md hover:scale-105 transition-transform cursor-pointer"
          >
            {lang === 'ar' ? 'العب جولة أخرى' : 'Nouvelle partie'}
          </button>
        </div>
      )}
    </div>
  );
};
