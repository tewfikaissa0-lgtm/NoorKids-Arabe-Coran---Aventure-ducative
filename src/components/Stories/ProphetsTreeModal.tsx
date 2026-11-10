import React, { useState } from 'react';
import { Language } from '../../types';
import { PROPHETS_TREE_DATA, ProphetNode } from '../../data/prophetsTreeData';
import { sound } from '../../utils/soundEngine';
import { STORY_IMAGES } from '../../assets/images';
import { Volume2, X, Sparkles, BookOpen, Star, ChevronRight } from 'lucide-react';

interface ProphetsTreeModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onOpenStory?: (storyId: string) => void;
}

export const ProphetsTreeModal: React.FC<ProphetsTreeModalProps> = ({
  isOpen,
  onClose,
  lang,
  onOpenStory,
}) => {
  const [selectedEra, setSelectedEra] = useState<string>('all');
  const [activeProphet, setActiveProphet] = useState<ProphetNode>(PROPHETS_TREE_DATA[0]);

  if (!isOpen) return null;

  const eras = [
    { id: 'all', label: { fr: 'Tous les Prophètes', ar: 'جميع الأنبياء', en: 'All Prophets', es: 'Todos los Profetas' } },
    { id: 'ancient', label: { fr: 'Les Premiers Temps', ar: 'الأوائل من آدم ونوح', en: 'Early Prophets', es: 'Primeros Tiempos' } },
    { id: 'ibrahim_branch', label: { fr: 'Ibrahim & Fils', ar: 'إبراهيم وإسماعيل وإسحاق', en: 'Ibrahim & Sons', es: 'Ibrahim e Hijos' } },
    { id: 'israelite', label: { fr: 'Musa, Dawud, Yunus & Isa', ar: 'موسى وداود ويونس وعيسى', en: 'Musa, David & Jesus', es: 'Moisés, David y Jesús' } },
    { id: 'final', label: { fr: 'Muhammad (SAW)', ar: 'خاتم الأنبياء محمد ﷺ', en: 'Prophet Muhammad ﷺ', es: 'Profeta Muhammad ﷺ' } },
  ];

  const filteredProphets = selectedEra === 'all'
    ? PROPHETS_TREE_DATA
    : PROPHETS_TREE_DATA.filter((p) => p.era === selectedEra);

  const handlePlayPronunciation = (arabicName: string) => {
    sound.playPop();
    sound.speakArabic(arabicName);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 md:p-8 max-w-4xl w-full shadow-2xl border-4 border-amber-400 max-h-[92vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playPop();
            onClose();
          }}
          className="absolute top-5 right-5 z-20 p-2 rounded-full bg-white/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 shadow-md transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tree Banner with AI Art */}
        <div className="relative rounded-2xl overflow-hidden mb-6 h-48 sm:h-64 shadow-md border-2 border-amber-300 dark:border-amber-700">
          <img
            src={STORY_IMAGES.tree_of_prophets}
            alt="Arbre des Prophètes"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-6 text-white">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/90 text-white font-black text-[11px] uppercase tracking-wider w-fit mb-2 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              {lang === 'ar' ? 'شَجَرَةُ الأَنْبِيَاءِ الكِرَام' : "L'Arbre Lumineux des Prophètes"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-['Fredoka']">
              {lang === 'ar' ? 'شجرة النبوة والرسالة المباركة' : 'La Généalogie des Prophètes dans le Coran'}
            </h2>
            <p className="text-xs sm:text-sm text-amber-200 max-w-xl">
              {lang === 'ar'
                ? 'استكشف مسيرة أنبياء الله من آدم عليه السلام وصولاً إلى خاتم المرسلين محمد ﷺ'
                : "Explore la lignée bénie d'Adam (AS) jusqu'au Sceau des Prophètes Muhammad (SAW)."}
            </p>
          </div>
        </div>

        {/* Era Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-6 no-scrollbar">
          {eras.map((era) => (
            <button
              key={era.id}
              onClick={() => {
                sound.playPop();
                setSelectedEra(era.id);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedEra === era.id
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {era.label[lang] || era.label.fr}
            </button>
          ))}
        </div>

        {/* Two-Column Explorer Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column: Interactive Prophet Nodes List */}
          <div className="md:col-span-6 space-y-2.5 max-h-[420px] overflow-y-auto pr-2">
            {filteredProphets.map((p) => {
              const isSelected = activeProphet.id === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => {
                    sound.playPop();
                    setActiveProphet(p);
                  }}
                  className={`flex items-center justify-between p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-amber-500 bg-amber-50/80 dark:bg-amber-950/40 shadow-md ring-2 ring-amber-400/30'
                      : 'border-slate-200 dark:border-slate-800 hover:border-amber-300 bg-white dark:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-slate-700 flex items-center justify-center text-xl shadow-xs">
                      {p.icon}
                    </span>
                    <div>
                      <div className="text-xl font-bold font-['Amiri'] text-amber-700 dark:text-amber-300" dir="rtl">
                        {p.nameArabic}
                      </div>
                      <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {p.transliteration}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayPronunciation(p.nameArabic);
                      }}
                      className="p-2 rounded-xl bg-amber-500 text-white hover:bg-amber-600 transition-colors shadow-xs"
                      title="Écouter le nom"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Detailed Prophet Card */}
          <div className="md:col-span-6 flex flex-col justify-between p-6 rounded-3xl bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900 border-2 border-amber-300 dark:border-slate-700 shadow-lg">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl">{activeProphet.icon}</span>
                <button
                  onClick={() => handlePlayPronunciation(activeProphet.nameArabic)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 transition-colors shadow-xs"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'استمع إلى الاسم' : 'Écouter'}</span>
                </button>
              </div>

              <h3 className="text-4xl font-bold font-['Amiri'] text-amber-600 dark:text-amber-400 mb-1" dir="rtl">
                {activeProphet.nameArabic}
              </h3>
              <div className="text-lg font-black text-slate-800 dark:text-white font-['Fredoka']">
                {activeProphet.transliteration}
              </div>
              <p className="text-xs font-bold text-amber-700 dark:text-amber-400 mt-1">
                {activeProphet.title[lang] || activeProphet.title.fr}
              </p>

              <div className="mt-4 p-4 rounded-2xl bg-white dark:bg-slate-700/60 border border-amber-200 dark:border-slate-600">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-300 block mb-1">
                  ⭐ {lang === 'ar' ? 'المعجزة والكتاب والرسالة' : 'Miracle, Livre & Message Béni :'}
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                  {activeProphet.miracleOrBook[lang] || activeProphet.miracleOrBook.fr}
                </p>
              </div>
            </div>

            {/* Link to storybook if available */}
            {activeProphet.storyId && onOpenStory ? (
              <div className="mt-6 pt-4 border-t border-amber-200 dark:border-slate-700">
                <button
                  onClick={() => {
                    sound.playPop();
                    onOpenStory(activeProphet.storyId!);
                    onClose();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xs shadow-md hover:scale-102 active:scale-98 transition-all cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>
                    {lang === 'ar'
                      ? 'اقرأ القصة المصورة التفاعلية لهذا النبي'
                      : 'Lire l’Histoire Animée de ce Prophète 📖'}
                  </span>
                </button>
              </div>
            ) : (
              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 text-center text-xs text-slate-500">
                ✨ {lang === 'ar' ? 'عليه وعلى نبينا أفضل الصلاة والسلام' : 'Que la paix et les bénédictions soient sur lui'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
