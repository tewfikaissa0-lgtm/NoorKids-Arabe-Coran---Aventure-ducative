import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { DailyWord, Language } from '../../types';
import { DAILY_WORDS_DATA } from '../../data/dailyWordsData';
import { sound } from '../../utils/soundEngine';
import { Volume2, Sparkles, CheckCircle2, RotateCcw, BookOpen, ChevronLeft, ChevronRight, Award } from 'lucide-react';

interface DailyWordCardProps {
  lang: Language;
  onReward: (stars: number, gems: number, wordId: string) => void;
  learnedWords: string[];
}

export const DailyWordCard: React.FC<DailyWordCardProps> = ({ lang, onReward, learnedWords }) => {
  // Cycle by current day of year or let user browse
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
  const initialIndex = dayOfYear % DAILY_WORDS_DATA.length;

  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);
  const word: DailyWord = DAILY_WORDS_DATA[currentIndex];

  // Scramble letters puzzle state
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [scrambledPool, setScrambledPool] = useState<string[]>(() => {
    return [...word.letters].sort(() => Math.random() - 0.5);
  });
  const [isSuccess, setIsSuccess] = useState<boolean>(learnedWords.includes(word.id));
  const [showArchive, setShowArchive] = useState<boolean>(false);

  // When word changes, reset game state
  const handleSelectWord = (idx: number) => {
    sound.playPop();
    const newWord = DAILY_WORDS_DATA[idx];
    setCurrentIndex(idx);
    setSelectedLetters([]);
    setScrambledPool([...newWord.letters].sort(() => Math.random() - 0.5));
    setIsSuccess(learnedWords.includes(newWord.id));
  };

  const handleLetterClick = (letter: string, poolIndex: number) => {
    sound.playLetterSnap();
    sound.speakArabic(letter);
    const newSelected = [...selectedLetters, letter];
    setSelectedLetters(newSelected);

    // remove from pool
    const newPool = [...scrambledPool];
    newPool.splice(poolIndex, 1);
    setScrambledPool(newPool);

    // Check if word completed
    if (newSelected.length === word.letters.length) {
      const spelled = newSelected.join('');
      const target = word.letters.join('');
      if (spelled === target) {
        // Correct!
        sound.playMatchSuccess();
        sound.playCelebrationFanfare();
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
        setIsSuccess(true);
        onReward(15, 2, word.id);
      } else {
        // Wrong order, gentle boing
        sound.playGentleBoing();
      }
    }
  };

  const handleResetPuzzle = () => {
    sound.playPop();
    setSelectedLetters([]);
    setScrambledPool([...word.letters].sort(() => Math.random() - 0.5));
  };

  const handlePlayAudio = (arabicText: string) => {
    sound.playPop();
    sound.speakArabic(arabicText);
  };

  return (
    <div className="bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-slate-900 dark:via-slate-800 dark:to-amber-950/40 rounded-3xl p-6 md:p-8 shadow-xl border-3 border-amber-300/60 dark:border-amber-700/40 relative overflow-hidden">
      {/* Decorative top pattern */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header with Navigation between daily words */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-amber-200/60 dark:border-amber-800/40">
        <div className="flex items-center gap-2">
          <span className="p-2.5 rounded-2xl bg-amber-500 text-white shadow-md shadow-amber-500/30">
            <Sparkles className="w-6 h-6 animate-spin" style={{ animationDuration: '6s' }} />
          </span>
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-amber-600 dark:text-amber-400">
              {lang === 'ar' ? 'التعليم اليومي' : lang === 'en' ? 'Daily Arabic Education' : 'Éducation Quotidienne'}
            </span>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white font-['Fredoka']">
              {lang === 'ar' ? 'كَلِمَةُ اليَوْمِ المُبَارَكَةُ' : lang === 'en' ? 'Daily Word Adventure' : 'Le Mot du Jour Éducatif'}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSelectWord((currentIndex - 1 + DAILY_WORDS_DATA.length) % DAILY_WORDS_DATA.length)}
            className="p-2 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-amber-100 hover:text-amber-700 transition-colors shadow-xs"
            title="Mot précédent"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
            {currentIndex + 1} / {DAILY_WORDS_DATA.length}
          </span>
          <button
            onClick={() => handleSelectWord((currentIndex + 1) % DAILY_WORDS_DATA.length)}
            className="p-2 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-amber-100 hover:text-amber-700 transition-colors shadow-xs"
            title="Mot suivant"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              sound.playPop();
              setShowArchive(!showArchive);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 text-white font-bold text-xs shadow-md hover:bg-amber-600 transition-all cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>{lang === 'ar' ? 'سجل الكلمات' : lang === 'en' ? 'Word Notebook' : 'Carnet de Vocabulaire'}</span>
          </button>
        </div>
      </div>

      {/* Main Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: Big Arabic Word & Pronunciation */}
        <div className="lg:col-span-5 flex flex-col items-center text-center p-6 bg-white dark:bg-slate-800/80 rounded-2xl border-2 border-amber-200 dark:border-slate-700 shadow-sm relative">
          <div className="text-6xl mb-3 transform hover:scale-110 transition-transform">
            {word.emoji}
          </div>

          <h3
            className="text-5xl md:text-6xl font-bold text-amber-600 dark:text-amber-400 font-['Amiri'] tracking-wide my-2 leading-relaxed"
            dir="rtl"
          >
            {word.arabic}
          </h3>

          <div className="text-lg font-bold text-slate-700 dark:text-slate-200">
            {word.transliteration}
          </div>
          <div className="text-sm font-semibold text-amber-700 dark:text-amber-300 mt-1">
            {word.translations[lang]}
          </div>

          <div className="mt-2 text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/60 px-3 py-1 rounded-full">
            Racine arabe : {word.root}
          </div>

          <button
            onClick={() => handlePlayAudio(word.arabic)}
            className="mt-4 flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Volume2 className="w-4 h-4 animate-pulse" />
            <span>{lang === 'ar' ? 'استمع إلى النطق' : lang === 'en' ? 'Listen to Audio' : 'Écouter la prononciation'}</span>
          </button>
        </div>

        {/* Right Column: Sentence & Interactive Letter Puzzle */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          {/* Example Sentence Box */}
          <div className="p-4 rounded-2xl bg-amber-100/60 dark:bg-slate-800/60 border border-amber-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wide">
                {lang === 'ar' ? 'مثال في جملة مفيدة' : lang === 'en' ? 'Example Sentence' : 'Exemple en contexte'}
              </span>
              <button
                onClick={() => handlePlayAudio(word.exampleSentenceArabic)}
                className="text-amber-700 dark:text-amber-300 hover:text-amber-900 flex items-center gap-1 text-xs font-bold"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'استماع' : 'Écouter'}</span>
              </button>
            </div>
            <p className="text-xl font-bold text-slate-800 dark:text-slate-100 font-['Amiri'] leading-relaxed" dir="rtl">
              {word.exampleSentenceArabic}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 italic">
              « {word.exampleSentenceTranslation[lang]} »
            </p>
          </div>

          {/* Interactive Letter Reordering Game */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border-2 border-dashed border-amber-400 dark:border-amber-600/50">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase">
                🎯 {lang === 'ar' ? 'رتّب حروف الكلمة لتربح النجوم !' : lang === 'en' ? 'Arrange the letters to win stars!' : 'Reconstitue le mot du jour en arabe !'}
              </span>
              {selectedLetters.length > 0 && !isSuccess && (
                <button
                  onClick={handleResetPuzzle}
                  className="flex items-center gap-1 text-xs text-amber-600 font-bold hover:underline"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'إعادة المحاولة' : 'Recommencer'}</span>
                </button>
              )}
            </div>

            {/* Target Slots */}
            <div className="flex flex-row-reverse items-center justify-center gap-2 mb-4 min-h-[52px]">
              {word.letters.map((_, idx) => {
                const char = selectedLetters[idx];
                return (
                  <div
                    key={idx}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-bold font-['Amiri'] transition-all shadow-inner border-2 ${
                      char
                        ? 'bg-amber-500 text-white border-amber-600 shadow-md scale-105'
                        : 'bg-slate-100 dark:bg-slate-700/60 border-slate-300 dark:border-slate-600 text-transparent'
                    }`}
                  >
                    {char || 'ـ'}
                  </div>
                );
              })}
            </div>

            {/* Scrambled Letter Buttons Pool */}
            {!isSuccess ? (
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                {scrambledPool.map((letter, poolIdx) => (
                  <button
                    key={poolIdx}
                    onClick={() => handleLetterClick(letter, poolIdx)}
                    className="w-11 h-11 rounded-xl bg-gradient-to-b from-white to-amber-100 dark:from-slate-700 dark:to-slate-800 text-slate-900 dark:text-white font-bold text-2xl font-['Amiri'] shadow-md hover:scale-110 active:scale-95 border-2 border-amber-300 dark:border-slate-600 cursor-pointer transition-transform"
                  >
                    {letter}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold text-sm animate-bounce">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>
                  {lang === 'ar'
                    ? 'أحسنت صنعاً ! ربحت +15 نجمة و +2 جوهرة !'
                    : lang === 'en'
                    ? 'Bravo! You earned +15 stars & +2 gems!'
                    : 'Bravo champion ! Tu as gagné +15 étoiles et +2 diamants !'}
                </span>
              </div>
            )}

            {/* Fun Fact */}
            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2">
              <span className="text-amber-500 text-base">💡</span>
              <p>
                <strong className="text-slate-800 dark:text-slate-200 font-bold">
                  {lang === 'ar' ? 'معلومة ذهبية :' : lang === 'en' ? 'Did you know?' : 'Le savais-tu ?'}{' '}
                </strong>
                {word.funFact[lang]}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Archive Modal / Vocabulary Notebook */}
      {showArchive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-2xl w-full shadow-2xl border-4 border-amber-400 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📚</span>
                <h3 className="text-xl font-black text-slate-800 dark:text-white font-['Fredoka']">
                  {lang === 'ar' ? 'دفتر مفرداتي العربية' : lang === 'en' ? 'My Arabic Vocabulary Notebook' : 'Mon Carnet de Vocabulaire Arabe'}
                </h3>
              </div>
              <button
                onClick={() => setShowArchive(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
              {lang === 'ar'
                ? 'استعرض الكلمات التي تعلمتها واضغط على أي كلمة لاستعراضها والتمرن عليها.'
                : lang === 'en'
                ? 'Review the words you learned. Click any word to practice and listen.'
                : 'Passe en revue tous les mots du jour. Clique sur un mot pour le réécouter et jouer !'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DAILY_WORDS_DATA.map((w, idx) => {
                const isMastered = learnedWords.includes(w.id);
                return (
                  <button
                    key={w.id}
                    onClick={() => {
                      handleSelectWord(idx);
                      setShowArchive(false);
                    }}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border-2 transition-all text-left ${
                      idx === currentIndex
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40'
                        : 'border-slate-200 dark:border-slate-800 hover:border-amber-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{w.emoji}</span>
                      <div>
                        <div className="text-xl font-bold text-amber-600 font-['Amiri']" dir="rtl">
                          {w.arabic}
                        </div>
                        <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          {w.transliteration} · {w.translations[lang]}
                        </div>
                      </div>
                    </div>
                    {isMastered && (
                      <span className="p-1 rounded-full bg-emerald-100 text-emerald-600">
                        <Award className="w-4 h-4" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
