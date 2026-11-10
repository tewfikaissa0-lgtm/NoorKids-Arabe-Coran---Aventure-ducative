import React, { useState } from 'react';
import { Language } from '../../types';
import { ALPHABET_DATA } from '../../data/alphabetData';
import { DAILY_WORDS_DATA } from '../../data/dailyWordsData';
import { sound } from '../../utils/soundEngine';
import { Search, Volume2, BookOpen, Sparkles, Tag, Layers, Bookmark } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VisualDictionaryProps {
  lang: Language;
}

interface DictionaryItem {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string;
  category: string;
  emoji: string;
  funFact?: string;
  root?: string;
  isDailyWord?: boolean;
}

export const VisualDictionary: React.FC<VisualDictionaryProps> = ({ lang }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeModalItem, setActiveModalItem] = useState<DictionaryItem | null>(null);

  // Compile dictionary items from alphabet example words and daily words
  const alphabetItems: DictionaryItem[] = ALPHABET_DATA.map((l) => ({
    id: `alpha-${l.id}`,
    arabic: l.exampleWord.arabic,
    transliteration: l.exampleWord.transliteration,
    translation: l.exampleWord.meaning[lang] || l.exampleWord.meaning.fr,
    category: l.group || 'explorer',
    emoji: l.exampleWord.emoji,
    funFact: `${l.name} (${l.letter}) - ${l.soundDescription[lang] || l.soundDescription.fr}`,
    root: l.letter,
    isDailyWord: false,
  }));

  const dailyItems: DictionaryItem[] = DAILY_WORDS_DATA.map((d) => ({
    id: `daily-${d.id}`,
    arabic: d.arabic,
    transliteration: d.transliteration,
    translation: d.translations[lang] || d.translations.fr,
    category: d.category,
    emoji: d.emoji,
    funFact: d.funFact[lang] || d.funFact.fr,
    root: d.root,
    isDailyWord: true,
  }));

  const allItems: DictionaryItem[] = [...dailyItems, ...alphabetItems];

  const categories = [
    { id: 'all', label: { fr: 'Tous les Mots', ar: 'جميع الكلمات', en: 'All Words', es: 'Todas las Palabras' } },
    { id: 'values', label: { fr: 'Valeurs & Sagesse', ar: 'قيم وأخلاق', en: 'Values', es: 'Valores' } },
    { id: 'nature', label: { fr: 'Nature & Univers', ar: 'الطبيعة والكون', en: 'Nature', es: 'Naturaleza' } },
    { id: 'animals', label: { fr: 'Animaux', ar: 'حيوانات', en: 'Animals', es: 'Animales' } },
    { id: 'quran', label: { fr: 'Coran & Foi', ar: 'قرآن وإيمان', en: 'Quran & Faith', es: 'Corán y Fe' } },
    { id: 'school', label: { fr: 'Savoir & École', ar: 'علم ومعرفة', en: 'Knowledge', es: 'Saberes' } },
    { id: 'family', label: { fr: 'Famille & Amis', ar: 'عائلة وأصدقاء', en: 'Family', es: 'Familia' } },
  ];

  const filteredItems = allItems.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesQuery =
      item.arabic.includes(searchQuery) ||
      item.transliteration.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.translation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const handlePlayWord = (e: React.MouseEvent, arabicText: string) => {
    e.stopPropagation();
    sound.playMatchSuccess();
    sound.speakArabic(arabicText);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="space-y-2 text-center md:text-left z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-violet-100">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'القاموس البصري التفاعلي' : 'Dictionnaire Visuel Interactif'}</span>
          </div>
          <h2 className="text-3xl font-black font-['Fredoka']">
            {lang === 'ar' ? 'موسوعة الكلمات العربية والقرآنية' : 'Explore ton Trésor de Mots'}
          </h2>
          <p className="text-sm text-violet-100 max-w-xl">
            {lang === 'ar'
              ? 'ابحث في مئات الكلمات، استمع إلى نطقها الصحيح، واكتشف معانيها الجميلة وجذورها في اللغة العربية.'
              : 'Recherche parmi des dizaines de mots du Coran, de la nature et des valeurs. Écoute leur prononciation et découvre leurs racines.'}
          </p>
        </div>

        {/* Quick Search */}
        <div className="w-full md:w-72 z-10">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-violet-300" />
            <input
              type="text"
              placeholder={lang === 'ar' ? 'ابحث عن كلمة...' : 'Chercher un mot...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/15 backdrop-blur-md border border-white/30 text-white placeholder-violet-200 text-sm focus:outline-none focus:ring-2 focus:ring-white/60 shadow-inner"
            />
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              sound.playPop();
              setSelectedCategory(cat.id);
            }}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 shadow-xs ${
              selectedCategory === cat.id
                ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30 scale-105'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <span>{cat.label[lang] || cat.label.fr}</span>
          </button>
        ))}
      </div>

      {/* Words Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              sound.playCardFlip();
              setActiveModalItem(item);
            }}
            className="group p-5 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200/80 dark:border-slate-800 hover:border-violet-400 dark:hover:border-violet-500 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden"
          >
            {/* Top row badges */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl p-2 rounded-2xl bg-violet-50 dark:bg-violet-950/50 group-hover:scale-110 transition-transform">
                {item.emoji}
              </span>
              <button
                onClick={(e) => handlePlayWord(e, item.arabic)}
                className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:text-violet-600 dark:group-hover:text-violet-400 hover:scale-110 transition-all shadow-xs"
                title="Écouter la prononciation"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {/* Arabic Word & Transliteration */}
            <div className="space-y-1 text-center my-2">
              <div
                className="text-3xl md:text-4xl font-bold font-['Amiri'] text-slate-900 dark:text-white group-hover:text-violet-600 transition-colors"
                dir="rtl"
              >
                {item.arabic}
              </div>
              <div className="text-xs font-black text-violet-600 dark:text-violet-400 font-['Fredoka'] tracking-wide">
                {item.transliteration}
              </div>
            </div>

            {/* Translation & Category footer */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-600 dark:text-slate-300 truncate max-w-[130px]">
                {item.translation}
              </span>
              {item.root && (
                <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-mono text-slate-500 dark:text-slate-400">
                  {item.root}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-16 space-y-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <div className="text-4xl">🔍</div>
          <h4 className="font-bold text-lg text-slate-700 dark:text-slate-200">
            {lang === 'ar' ? 'لم يتم العثور على كلمات مطابقة' : 'Aucun mot trouvé'}
          </h4>
          <p className="text-xs text-slate-400">
            {lang === 'ar' ? 'جرب البحث بكلمة أخرى أو تصفح جميع التصنيفات.' : 'Essaie un autre terme ou change de catégorie.'}
          </p>
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {activeModalItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-violet-200 dark:border-slate-800 relative space-y-6"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveModalItem(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
              >
                ✕
              </button>

              <div className="flex items-center gap-4">
                <div className="text-5xl p-4 rounded-3xl bg-violet-100 dark:bg-violet-950/60 shadow-inner">
                  {activeModalItem.emoji}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 text-[10px] font-bold uppercase tracking-wider">
                      {activeModalItem.category}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black font-['Fredoka'] text-slate-900 dark:text-white mt-1">
                    {activeModalItem.translation}
                  </h3>
                </div>
              </div>

              {/* Big Arabic Display */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800/80 text-center border border-violet-100 dark:border-slate-700 space-y-3">
                <div
                  className="text-5xl md:text-6xl font-bold font-['Amiri'] text-violet-900 dark:text-violet-200"
                  dir="rtl"
                >
                  {activeModalItem.arabic}
                </div>
                <div className="text-sm font-black text-violet-700 dark:text-violet-300 font-['Fredoka'] tracking-wider">
                  {activeModalItem.transliteration}
                </div>

                <button
                  onClick={() => sound.speakArabic(activeModalItem.arabic)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-lg shadow-violet-600/30 transition-all hover:scale-105 cursor-pointer mt-2"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'استمع للتعرف على النطق' : 'Écouter la prononciation'}</span>
                </button>
              </div>

              {/* Fun Fact / Root info */}
              {activeModalItem.funFact && (
                <div className="space-y-2 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                  <div className="font-bold flex items-center gap-1.5 text-amber-700 dark:text-amber-400">
                    <Sparkles className="w-4 h-4" />
                    <span>{lang === 'ar' ? 'معلومة لطيفة وبوتقة لغوية' : 'Le savais-tu ?'}</span>
                  </div>
                  <p>{activeModalItem.funFact}</p>
                </div>
              )}

              {/* Footer action */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setActiveModalItem(null)}
                  className="px-6 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors cursor-pointer"
                >
                  {lang === 'ar' ? 'إغلاق' : 'Fermer'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
