import React, { useState } from 'react';
import { Language } from '../../types';
import { sound } from '../../utils/soundEngine';
import { Building2, Trees, Sparkles, CheckCircle2, Flame, Droplets } from 'lucide-react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';

interface MadinaBuilderProps {
  lang: Language;
  onReward: (stars: number, gems: number) => void;
}

interface VocabularyFlashcard {
  id: string;
  arabic: string;
  translation: { fr: string; en: string; ar: string; es: string };
  emoji: string;
  isCorrectPluralRule: boolean; // For swipe mechanism
}

const CARDS: VocabularyFlashcard[] = [
  { id: 'c1', arabic: 'كِتَابٌ -> كُتُبٌ', translation: { fr: 'Livre / Livres (Pluriel brisé)', en: 'Book -> Books', ar: 'كتاب -> كتب', es: 'Libro -> Libros' }, emoji: '📚', isCorrectPluralRule: true },
  { id: 'c2', arabic: 'بَيْتٌ -> بَيْتَاتٌ', translation: { fr: 'Maison / Maisons (Faux pluriel)', en: 'House -> Houses (Incorrect)', ar: 'بيت -> بيتا ت', es: 'Casa' }, emoji: '🏠', isCorrectPluralRule: false },
  { id: 'c3', arabic: 'قَلَمٌ -> أَقْلَامٌ', translation: { fr: 'Stylo -> Stylos', en: 'Pen -> Pens', ar: 'قلم -> أقلام', es: 'Pluma' }, emoji: '✒️', isCorrectPluralRule: true },
  { id: 'c4', arabic: 'شَمْسٌ -> شُمُوسٌ', translation: { fr: 'Soleil -> Soleils', en: 'Sun -> Suns', ar: 'شمس -> شموس', es: 'Sol' }, emoji: '☀️', isCorrectPluralRule: true },
];

export const MadinaBuilderGame: React.FC<MadinaBuilderProps> = ({ lang, onReward }) => {
  const [cardIndex, setCardIndex] = useState(0);
  const [bricks, setBricks] = useState(1);
  const [trees, setTrees] = useState(1);
  const [fountains, setFountains] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentCard = CARDS[cardIndex % CARDS.length];

  const handleSwipe = (userAnswer: boolean) => {
    const isCorrect = userAnswer === currentCard.isCorrectPluralRule;
    if (isCorrect) {
      sound.playMatchSuccess();
      sound.playStarChime();
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
      setBricks((prev) => prev + 1);
      if (Math.random() > 0.5) setTrees((prev) => prev + 1);
      else setFountains((prev) => prev + 1);
      onReward(15, 2);
    } else {
      sound.playGentleBoing();
    }

    if (cardIndex + 1 >= CARDS.length * 2) {
      setIsCompleted(true);
      sound.playCelebrationFanfare();
    } else {
      setCardIndex((prev) => prev + 1);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4 sm:p-6 bg-gradient-to-br from-cyan-900 via-blue-950 to-slate-900 rounded-3xl text-white shadow-2xl border-2 border-cyan-500/40">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20">
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-300 text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'مدينة الكلمات والواحة' : 'Madina Match & Oasis Builder 🏙️'}</span>
          </div>
          <h2 className="text-2xl font-black font-['Fredoka']">
            {lang === 'ar' ? 'ابنِ مدينتك عبر اختبار المفردات' : 'Construis ta Cité avec les Mots'}
          </h2>
          <p className="text-xs text-cyan-200">
            {lang === 'ar'
              ? 'صنف القواعد والمفردات الصحيحة لجمع الموارد وبناء أجمل مدينة في الواحة !'
              : 'Valide les règles de vocabulaire et de pluriel pour récolter des briques et bâtir ton oasis !'}
          </p>
        </div>

        {/* Resources Stats */}
        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 rounded-2xl bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold flex items-center gap-1.5">
            🧱 {bricks} {lang === 'ar' ? 'طوب' : 'Briques'}
          </span>
          <span className="px-3 py-1.5 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
            🌴 {trees} {lang === 'ar' ? 'نخيل' : 'Palmiers'}
          </span>
        </div>
      </div>

      {/* Swipe Flashcard Card */}
      {!isCompleted ? (
        <div className="max-w-md mx-auto p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/25 text-center space-y-6 shadow-2xl">
          <div className="text-6xl p-4 rounded-3xl bg-white/10 inline-block">
            {currentCard.emoji}
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold font-['Amiri'] text-amber-300" dir="rtl">
              {currentCard.arabic}
            </div>
            <div className="text-xs font-bold text-slate-200">
              {currentCard.translation[lang] || currentCard.translation.fr}
            </div>
          </div>

          <div className="text-xs text-cyan-200 font-semibold">
            {lang === 'ar' ? 'هل هذه القاعدة صحيحة؟' : 'Est-ce que cette règle de pluriel est correcte ?'}
          </div>

          <div className="flex items-center justify-center gap-4 pt-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSwipe(false)}
              className="flex-1 py-3 px-5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg cursor-pointer"
            >
              ❌ {lang === 'ar' ? 'خطأ' : 'Faux (Gauche)'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSwipe(true)}
              className="flex-1 py-3 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg cursor-pointer"
            >
              ✅ {lang === 'ar' ? 'صحيح' : 'Vrai (Droite)'}
            </motion.button>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 space-y-4 bg-white/10 rounded-3xl border border-white/20">
          <div className="text-5xl">🏰</div>
          <h3 className="text-2xl font-black font-['Fredoka'] text-amber-300">
            {lang === 'ar' ? 'مبارك ! اكتملت مدينة الواحة الرائعة' : 'Félicitations ! Ton Oasis est Magnifique !'}
          </h3>
          <p className="text-xs text-cyan-200">
            {lang === 'ar' ? 'لقد جمعت الكثير من الموارد بفضل حفظك للمفردات العربية.' : 'Tu as bâti une cité prospère grâce à ton apprentissage.'}
          </p>
          <button
            onClick={() => {
              setCardIndex(0);
              setIsCompleted(false);
            }}
            className="px-6 py-2.5 rounded-2xl bg-cyan-500 text-slate-950 font-bold text-xs shadow-lg cursor-pointer"
          >
            {lang === 'ar' ? 'العب مرة أخرى' : 'Rejouer'}
          </button>
        </div>
      )}

      {/* Visual Oasis City Preview */}
      <div className="p-6 rounded-3xl bg-black/40 border border-white/10 flex flex-wrap items-center justify-center gap-6 text-center">
        <div className="space-y-1">
          <div className="text-2xl">🏛️</div>
          <div className="text-[10px] text-cyan-200 font-bold">{bricks} {lang === 'ar' ? 'مباني' : 'Bâtiments'}</div>
        </div>
        <div className="space-y-1">
          <div className="text-2xl">🌴</div>
          <div className="text-[10px] text-emerald-200 font-bold">{trees} {lang === 'ar' ? 'نخيل' : 'Palmiers'}</div>
        </div>
        <div className="space-y-1">
          <div className="text-2xl">⛲</div>
          <div className="text-[10px] text-blue-200 font-bold">{fountains} {lang === 'ar' ? 'ينابيع' : 'Fontaines'}</div>
        </div>
      </div>
    </div>
  );
};
