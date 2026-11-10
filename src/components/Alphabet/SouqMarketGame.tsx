import React, { useState } from 'react';
import { Language } from '../../types';
import { sound } from '../../utils/soundEngine';
import { ShoppingBag, Coins, Sparkles, CheckCircle2, Gift } from 'lucide-react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';

interface SouqMarketProps {
  lang: Language;
  onReward: (stars: number, gems: number) => void;
}

interface SouqItem {
  id: string;
  name: { fr: string; en: string; ar: string; es: string };
  arabic: string;
  price: number;
  emoji: string;
  letters: string[];
}

const MARKET_ITEMS: SouqItem[] = [
  { id: 'tuffah', name: { fr: 'Pomme Rouge', en: 'Red Apple', ar: 'تفاحة', es: 'Manzana' }, arabic: 'تُفَّاحَةٌ', price: 10, emoji: '🍎', letters: ['ت', 'ف', 'ا', 'ح'] },
  { id: 'mouz', name: { fr: 'Banane Douce', en: 'Sweet Banana', ar: 'موز', es: 'Plátano' }, arabic: 'مَوْزٌ', price: 15, emoji: '🍌', letters: ['م', 'و', 'ز'] },
  { id: 'ward', name: { fr: 'Fraise / Rose', en: 'Flower', ar: 'وَرْدَةٌ', es: 'Flor' }, arabic: 'وَرْدَةٌ', price: 20, emoji: '🌹', letters: ['و', 'ر', 'د', 'ة'] },
  { id: 'kitab', name: { fr: 'Livre de Conte', en: 'Story Book', ar: 'كِتَابٌ', es: 'Libro' }, arabic: 'كِتَابٌ', price: 30, emoji: '📖', letters: ['ك', 'ت', 'ا', 'ب'] },
];

export const SouqMarketGame: React.FC<SouqMarketProps> = ({ lang, onReward }) => {
  const [coins, setCoins] = useState(25);
  const [activeItem, setActiveItem] = useState<SouqItem | null>(null);
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [purchasedItems, setPurchasedItems] = useState<string[]>([]);

  const handleSelectItem = (item: SouqItem) => {
    sound.playPop();
    setActiveItem(item);
    setSelectedLetters([]);
  };

  const handleTapLetter = (letter: string) => {
    if (!activeItem) return;
    sound.playLetterSnap();
    const updated = [...selectedLetters, letter];
    setSelectedLetters(updated);

    if (updated.length === activeItem.letters.length) {
      if (updated.join('') === activeItem.letters.join('')) {
        // Success!
        sound.playCelebrationFanfare();
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        setCoins((prev) => prev + activeItem.price + 10);
        setPurchasedItems((prev) => [...prev, activeItem.id]);
        onReward(20, 3);
        setActiveItem(null);
      } else {
        sound.playGentleBoing();
        setSelectedLetters([]);
      }
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4 sm:p-6 bg-gradient-to-br from-amber-900 via-orange-950 to-slate-900 rounded-3xl text-white shadow-2xl border-2 border-amber-500/40">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20">
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'سوق الحروف التقليدي' : 'Souq Al-Huruf 🛒'}</span>
          </div>
          <h2 className="text-2xl font-black font-['Fredoka']">
            {lang === 'ar' ? 'تسوق واجمع الكلمات في السوق' : 'Achète au Marché des Lettres'}
          </h2>
          <p className="text-xs text-amber-200">
            {lang === 'ar'
              ? 'اختر شيئاً لشرائه، ثم قم بتوصيل حروفه الصحيحة لفتح الكنز وكسب القطع الذهبية !'
              : 'Choisis un article à acheter, puis assemble ses lettres pour compléter ta commande !'}
          </p>
        </div>

        {/* Coins Badge */}
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-500 text-slate-950 font-black text-sm shadow-lg">
          <Coins className="w-5 h-5" />
          <span>{coins} {lang === 'ar' ? 'قطعة' : 'Pièces'}</span>
        </div>
      </div>

      {/* Market Stalls Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {MARKET_ITEMS.map((item) => {
          const isBought = purchasedItems.includes(item.id);
          return (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => !isBought && handleSelectItem(item)}
              className={`p-5 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between text-center ${
                isBought
                  ? 'bg-emerald-950/40 border-emerald-400 opacity-80'
                  : 'bg-white/5 border-white/10 hover:border-amber-400 shadow-xl'
              }`}
            >
              <div className="text-4xl mb-3 p-3 rounded-2xl bg-white/10 inline-block mx-auto">
                {item.emoji}
              </div>
              <div className="space-y-1 my-2">
                <div className="text-2xl font-bold font-['Amiri'] text-white" dir="rtl">
                  {item.arabic}
                </div>
                <div className="text-xs font-black text-amber-300 font-['Fredoka']">
                  {item.name[lang] || item.name.fr}
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-amber-200 font-bold">{item.price} 🪙</span>
                {isBought ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> {lang === 'ar' ? 'تم الشراء' : 'Acheté'}
                  </span>
                ) : (
                  <span className="text-violet-300 font-bold">{lang === 'ar' ? 'اشترِ' : 'Acheter'}</span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Active Puzzle Tray if an item is selected */}
      {activeItem && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-3xl bg-amber-900/60 backdrop-blur-md border-2 border-amber-400 text-center space-y-4"
        >
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-lg font-['Fredoka'] text-amber-200">
              {lang === 'ar' ? `تهجئة كلمة: ${activeItem.arabic}` : `Assemble : ${activeItem.name[lang] || activeItem.name.fr}`}
            </h4>
            <button
              onClick={() => setActiveItem(null)}
              className="text-xs font-bold px-3 py-1 rounded-full bg-white/20 hover:bg-white/30"
            >
              ✕ {lang === 'ar' ? 'إلغاء' : 'Fermer'}
            </button>
          </div>

          {/* Current assembled letters tray */}
          <div className="flex items-center justify-center gap-2 min-h-[60px] p-3 rounded-2xl bg-black/30 border border-white/20" dir="rtl">
            {selectedLetters.length === 0 ? (
              <span className="text-xs text-amber-300/70">
                {lang === 'ar' ? 'اضغط على الحروف بالترتيب الصحيح أدناه' : 'Clique sur les lettres dans le bon ordre ci-dessous'}
              </span>
            ) : (
              selectedLetters.map((l, i) => (
                <span key={i} className="text-3xl font-bold font-['Amiri'] text-amber-300 px-3 py-1 rounded-xl bg-white/10">
                  {l}
                </span>
              ))
            )}
          </div>

          {/* Scrambled letter options */}
          <div className="flex items-center justify-center gap-3">
            {[...activeItem.letters].sort(() => Math.random() - 0.5).map((letter, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleTapLetter(letter)}
                className="w-14 h-14 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-2xl font-['Amiri'] shadow-lg cursor-pointer"
              >
                {letter}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};
