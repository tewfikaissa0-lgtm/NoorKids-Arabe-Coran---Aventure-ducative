import React, { useState } from 'react';
import { ArabicLetter, Language } from '../../types';
import { ALPHABET_DATA } from '../../data/alphabetData';
import { LetterDetailModal } from './LetterDetailModal';
import { sound } from '../../utils/soundEngine';
import { audioLibrary } from '../../utils/audioLibrary';
import { Volume2, Sparkles, CheckCircle2, Search, Filter } from 'lucide-react';

interface AlphabetExplorerProps {
  lang: Language;
  masteredLetterIds: string[];
  onToggleMaster: (letterId: string) => void;
}

export const AlphabetExplorer: React.FC<AlphabetExplorerProps> = ({
  lang,
  masteredLetterIds,
  onToggleMaster,
}) => {
  const [selectedLetter, setSelectedLetter] = useState<ArabicLetter | null>(null);
  const [activeGroup, setActiveGroup] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const groups = [
    { id: 'all', label: { fr: 'Toutes (28)', ar: 'جميع الحروف (28)', en: 'All Letters (28)', es: 'Todas (28)' } },
    { id: 'easy', label: { fr: 'Faciles', ar: 'حروف سهلة', en: 'Easy Shapes', es: 'Formas Fáciles' } },
    { id: 'dotted', label: { fr: 'Avec Points', ar: 'حروف منقوطة', en: 'Dotted Letters', es: 'Con Puntos' } },
    { id: 'curved', label: { fr: 'Courbées', ar: 'حروف منحنية', en: 'Curved Shapes', es: 'Curvadas' } },
    { id: 'emphatic', label: { fr: 'Emphatiques', ar: 'حروف مفخمة', en: 'Emphatic', es: 'Enfáticas' } },
  ];

  const filteredLetters = ALPHABET_DATA.filter((l) => {
    const matchesGroup = activeGroup === 'all' || l.group === activeGroup;
    const matchesSearch =
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.arabicName.includes(searchQuery) ||
      l.letter.includes(searchQuery);
    return matchesGroup && matchesSearch;
  });

  const handlePlayLetter = (e: React.MouseEvent, letter: (typeof ALPHABET_DATA)[0]) => {
    e.stopPropagation();
    audioLibrary.playLetter(letter.id);
  };

  const masteredCount = masteredLetterIds.length;
  const progressPercent = Math.round((masteredCount / 28) * 100);

  return (
    <div className="space-y-6">
      {/* Progress & Quick Stats Card */}
      <div className="p-5 md:p-6 rounded-3xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-xs font-black uppercase tracking-wider text-amber-100">
            {lang === 'ar' ? 'رحلة تعلم الحروف الـ 28' : 'Progression de l’Alphabet'}
          </span>
          <h3 className="text-2xl font-black font-['Fredoka']">
            {masteredCount} / 28 {lang === 'ar' ? 'حرفاً تم إتقانه بنجاح !' : 'lettres maîtrisées !'}
          </h3>
          <p className="text-xs text-amber-100">
            {lang === 'ar'
              ? 'اضغط على أي حرف للاستماع وتجربة كتابته بالإصبع والتعرف على كلماته.'
              : 'Clique sur n’importe quelle lettre pour écouter sa prononciation et tester le tracé au doigt.'}
          </p>
        </div>

        {/* Circular / Bar Indicator */}
        <div className="w-full sm:w-48 bg-white/30 backdrop-blur-md rounded-2xl p-3 text-center border border-white/40">
          <div className="text-2xl font-black">{progressPercent}%</div>
          <div className="w-full bg-white/40 h-2 rounded-full overflow-hidden mt-1">
            <div
              className="bg-white h-full rounded-full transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Group tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 no-scrollbar">
          {groups.map((g) => (
            <button
              key={g.id}
              onClick={() => {
                sound.playPop();
                setActiveGroup(g.id);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeGroup === g.id
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {g.label[lang] || g.label.fr}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={lang === 'ar' ? 'ابحث عن حرف...' : 'Chercher une lettre...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-full text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
      </div>

      {/* Letters Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3.5">
        {filteredLetters.map((letter) => {
          const isMastered = masteredLetterIds.includes(letter.id);
          return (
            <div
              key={letter.id}
              onClick={() => {
                audioLibrary.playLetter(letter.id);
                setSelectedLetter(letter);
              }}
              className={`group relative p-4 rounded-3xl border-3 transition-all cursor-pointer flex flex-col items-center justify-between hover:scale-105 hover:shadow-xl hover:-translate-y-1 ${
                isMastered
                  ? 'bg-amber-50/60 dark:bg-amber-950/30 border-amber-400 shadow-sm'
                  : 'bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 hover:border-amber-400 shadow-xs'
              }`}
            >
              {/* Audio button top right */}
              <button
                onClick={(e) => handlePlayLetter(e, letter)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-400 group-hover:text-amber-600 hover:scale-110 transition-all"
                title="Écouter le son"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>

              {/* Mastered badge top left */}
              {isMastered && (
                <span className="absolute top-2 left-2 text-amber-500">
                  <CheckCircle2 className="w-4 h-4 fill-amber-400 text-white" />
                </span>
              )}

              {/* Big Arabic Letter */}
              <div
                className="text-5xl md:text-6xl font-bold font-['Amiri'] text-slate-800 dark:text-white my-2 group-hover:text-amber-500 transition-colors"
                dir="rtl"
              >
                {letter.letter}
              </div>

              {/* Transliteration and Name */}
              <div className="text-center w-full pt-1 border-t border-slate-100 dark:border-slate-700/60">
                <div className="text-xs font-black text-slate-700 dark:text-slate-200 font-['Fredoka']">
                  {letter.name}
                </div>
                <div className="text-[10px] text-slate-400">
                  {letter.exampleWord.emoji} {letter.exampleWord.arabic}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Letter Detail Modal */}
      {selectedLetter && (
        <LetterDetailModal
          letter={selectedLetter}
          isOpen={!!selectedLetter}
          onClose={() => setSelectedLetter(null)}
          lang={lang}
          isMastered={masteredLetterIds.includes(selectedLetter.id)}
          onToggleMaster={onToggleMaster}
        />
      )}
    </div>
  );
};
