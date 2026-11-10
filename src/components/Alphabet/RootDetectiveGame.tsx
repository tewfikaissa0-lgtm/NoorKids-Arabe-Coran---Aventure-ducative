import React, { useState } from 'react';
import { Language } from '../../types';
import { sound } from '../../utils/soundEngine';
import { Search, Sparkles, Volume2, CheckCircle2, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';

interface RootDetectiveProps {
  lang: Language;
  onReward: (stars: number, gems: number) => void;
}

interface RootChallenge {
  id: string;
  root: string;
  rootLetters: string[];
  meaning: Record<Language, string>;
  derivedWords: {
    arabic: string;
    transliteration: string;
    translation: Record<Language, string>;
    pattern: string;
    emoji: string;
  }[];
}

const ROOT_CHALLENGES: RootChallenge[] = [
  {
    id: 'ktb',
    root: 'ك - ت - ب',
    rootLetters: ['ك', 'ت', 'ب'],
    meaning: { fr: 'Écriture et Savoir', en: 'Writing & Knowledge', ar: 'الكتابة والعلم', es: 'Escritura y Saber' },
    derivedWords: [
      { arabic: 'كِتَابٌ', transliteration: 'Kitab', translation: { fr: 'Livre', en: 'Book', ar: 'كتاب', es: 'Libro' }, pattern: 'Fi\'al', emoji: '📖' },
      { arabic: 'كَاتِبٌ', transliteration: 'Katib', translation: { fr: 'Écrivain', en: 'Writer', ar: 'كاتب', es: 'Escritor' }, pattern: 'Fail', emoji: '✍️' },
      { arabic: 'مَكْتَبَةٌ', transliteration: 'Maktabah', translation: { fr: 'Bibliothèque', en: 'Library', ar: 'مكتبة', es: 'Biblioteca' }, pattern: 'Mafala', emoji: '🏛️' },
    ],
  },
  {
    id: 'slm',
    root: 'س - ل - م',
    rootLetters: ['س', 'ل', 'م'],
    meaning: { fr: 'Paix et Sécurité', en: 'Peace & Safety', ar: 'السلام والأمان', es: 'Paz y Seguridad' },
    derivedWords: [
      { arabic: 'سَلَامٌ', transliteration: 'Salam', translation: { fr: 'Paix', en: 'Peace', ar: 'سلام', es: 'Paz' }, pattern: 'Faal', emoji: '🕊️' },
      { arabic: 'مُسْلِمٌ', transliteration: 'Muslim', translation: { fr: 'Soumis à Dieu / Pacifique', en: 'Muslim / Peacemaker', ar: 'مسلم', es: 'Musulmán' }, pattern: 'Mufil', emoji: '🤲' },
      { arabic: 'سَلِيمٌ', transliteration: 'Salim', translation: { fr: 'Sain et Sûr', en: 'Safe & Sound', ar: 'سليم', es: 'Sano' }, pattern: 'Fail', emoji: '✨' },
    ],
  },
  {
    id: 'ilm',
    root: 'ع - ل - م',
    rootLetters: ['ع', 'ل', 'م'],
    meaning: { fr: 'Science et Connaissance', en: 'Science & Knowledge', ar: 'العلم والمعرفة', es: 'Ciencia y Conocimiento' },
    derivedWords: [
      { arabic: 'عِلْمٌ', transliteration: 'Ilm', translation: { fr: 'Science', en: 'Science', ar: 'علم', es: 'Ciencia' }, pattern: 'Fils', emoji: '🔬' },
      { arabic: 'عَالِمٌ', transliteration: 'Alim', translation: { fr: 'Savant', en: 'Scholar / Scientist', ar: 'عالم', es: 'Sabio' }, pattern: 'Fail', emoji: '🧠' },
      { arabic: 'مَعْلُومَةٌ', transliteration: 'Malumah', translation: { fr: 'Information', en: 'Information', ar: 'معلومة', es: 'Información' }, pattern: 'Mafoula', emoji: '💡' },
    ],
  },
];

export const RootDetectiveGame: React.FC<RootDetectiveProps> = ({ lang, onReward }) => {
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [discoveredWords, setDiscoveredWords] = useState<string[]>([]);
  const [selectedWord, setSelectedWord] = useState<any | null>(null);

  const challenge = ROOT_CHALLENGES[currentChallengeIndex];

  const handleUnlockWord = (word: (typeof challenge.derivedWords)[0]) => {
    if (discoveredWords.includes(word.arabic)) return;
    sound.playMatchSuccess();
    sound.speakArabic(word.arabic);
    const updated = [...discoveredWords, word.arabic];
    setDiscoveredWords(updated);
    setSelectedWord(word);

    if (updated.length === challenge.derivedWords.length) {
      sound.playCelebrationFanfare();
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      onReward(25, 3);
    }
  };

  const handleNextChallenge = () => {
    sound.playPop();
    setCurrentChallengeIndex((prev) => (prev + 1) % ROOT_CHALLENGES.length);
    setDiscoveredWords([]);
    setSelectedWord(null);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4 sm:p-6 bg-gradient-to-br from-indigo-900 via-violet-900 to-slate-900 rounded-3xl text-white shadow-2xl border-2 border-violet-500/40">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20">
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-400/20 text-violet-300 text-xs font-bold uppercase tracking-wider">
            <Search className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'محقق الجذور اللغوية' : 'The Root Detective 🕵️‍♂️'}</span>
          </div>
          <h2 className="text-2xl font-black font-['Fredoka']">
            {lang === 'ar' ? 'اكتشف عائلة الكلمات' : 'Décode la Famille de Mots'}
          </h2>
          <p className="text-xs text-violet-200">
            {lang === 'ar'
              ? 'كل كلمة في العربية تخرج من جذر ثلاثي كالشجرة المباركة. اكتشف الكلمات المشتقة !'
              : 'En arabe, les mots naissent d’une racine de 3 lettres comme un arbre. Découvre toutes les branches !'}
          </p>
        </div>

        <button
          onClick={handleNextChallenge}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-lg transition-all cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>{lang === 'ar' ? 'جذر آخر' : 'Autre Racine'}</span>
        </button>
      </div>

      {/* Root Skeleton Board */}
      <div className="p-8 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 text-center space-y-6">
        <div className="text-xs font-bold text-violet-300 uppercase tracking-widest">
          {lang === 'ar' ? 'الجذر الثلاثي الأساسي' : 'Racine Tri-latérale'}
        </div>
        <div className="flex items-center justify-center gap-4 my-4" dir="rtl">
          {challenge.rootLetters.map((l, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.1, y: -5 }}
              className="w-20 h-20 rounded-3xl bg-violet-600/60 border-2 border-violet-300 flex items-center justify-center text-4xl font-black font-['Amiri'] shadow-xl text-white"
            >
              {l}
            </motion.div>
          ))}
        </div>
        <div className="text-sm font-semibold text-amber-300">
          {challenge.root} — {challenge.meaning[lang] || challenge.meaning.fr}
        </div>
      </div>

      {/* Derived Words Factory Grid */}
      <div className="space-y-3">
        <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          {lang === 'ar' ? 'الكلمات المشتقة (اضغط لاكتشافها)' : 'Mots Dérivés à Découvrir :'}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {challenge.derivedWords.map((word) => {
            const isUnlocked = discoveredWords.includes(word.arabic);
            return (
              <motion.div
                key={word.arabic}
                whileHover={{ scale: 1.03, y: -3 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleUnlockWord(word)}
                className={`p-5 rounded-3xl border-2 transition-all cursor-pointer flex flex-col items-center justify-between text-center ${
                  isUnlocked
                    ? 'bg-emerald-950/40 border-emerald-400 shadow-lg shadow-emerald-500/20'
                    : 'bg-white/5 border-white/10 hover:border-violet-400'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <span className="text-3xl p-2 rounded-2xl bg-white/10">{word.emoji}</span>
                  {isUnlocked ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-500/30 text-violet-200">
                      ?
                    </span>
                  )}
                </div>

                <div className="space-y-1 my-2">
                  <div className="text-3xl font-bold font-['Amiri'] text-white" dir="rtl">
                    {isUnlocked ? word.arabic : '؟ ؟ ؟'}
                  </div>
                  <div className="text-xs font-black text-amber-300 font-['Fredoka']">
                    {isUnlocked ? word.transliteration : '???'}
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 w-full text-xs text-slate-300">
                  {isUnlocked ? word.translation[lang] || word.translation.fr : (lang === 'ar' ? 'انقر لفتح الكلمة' : 'Clique pour débloquer')}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
