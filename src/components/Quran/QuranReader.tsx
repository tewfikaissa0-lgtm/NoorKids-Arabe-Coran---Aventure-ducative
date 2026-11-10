import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Surah, Language, TajweedRuleType } from '../../types';
import { SURAHS_DATA, TAJWEED_RULES_INFO } from '../../data/quranData';
import { sound } from '../../utils/soundEngine';
import {
  Volume2,
  Play,
  Pause,
  RotateCcw,
  BookOpen,
  Award,
  Eye,
  EyeOff,
  Sparkles,
  Info,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface QuranReaderProps {
  lang: Language;
  onReward: (stars: number, gems: number, surahNumber: number) => void;
  completedSurahs: number[];
}

export const QuranReader: React.FC<QuranReaderProps> = ({ lang, onReward, completedSurahs }) => {
  const [selectedSurah, setSelectedSurah] = useState<Surah>(SURAHS_DATA[0]);
  const [activeVerseIndex, setActiveVerseIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<1 | 3 | 5>(1);
  const [repeatCounter, setRepeatCounter] = useState<number>(0);
  const [hifzHideLevel, setHifzHideLevel] = useState<0 | 1 | 2>(0); // 0: All shown, 1: 50% hidden, 2: 100% hidden
  const [showTajweedModal, setShowTajweedModal] = useState<boolean>(false);
  const [inspectedRule, setInspectedRule] = useState<TajweedRuleType | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // When surah changes, stop audio and reset index
  useEffect(() => {
    stopCurrentAudio();
    setActiveVerseIndex(0);
    setRepeatCounter(0);
  }, [selectedSurah]);

  const stopCurrentAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    sound.stopSpeaking();
    setIsPlaying(false);
  };

  const playVerse = (index: number) => {
    stopCurrentAudio();
    setActiveVerseIndex(index);
    setIsPlaying(true);

    const verse = selectedSurah.verses[index];
    if (!verse) return;

    // Use sound engine to play verse
    const audio = sound.playAyahAudio(
      verse.globalAyahNumber,
      () => {
        // On ended
        if (repeatCounter + 1 < repeatMode) {
          setRepeatCounter((prev) => prev + 1);
          playVerse(index);
        } else {
          setRepeatCounter(0);
          // Auto advance to next verse
          if (index + 1 < selectedSurah.verses.length) {
            playVerse(index + 1);
          } else {
            setIsPlaying(false);
            sound.playStarChime();
          }
        }
      },
      () => {
        // Fallback to speech synthesis if network fails
        sound.speakArabic(verse.textArabic, () => {
          setIsPlaying(false);
        });
      }
    );
    audioRef.current = audio;
  };

  const handleTogglePlay = () => {
    sound.playPop();
    if (isPlaying) {
      stopCurrentAudio();
    } else {
      playVerse(activeVerseIndex);
    }
  };

  const handleCompleteSurah = () => {
    sound.playCelebrationFanfare();
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
    });
    onReward(40, 5, selectedSurah.number);
  };

  const isCurrentCompleted = completedSurahs.includes(selectedSurah.number);

  return (
    <div className="space-y-6">
      {/* Surah Selector Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {SURAHS_DATA.map((surah) => {
          const isSelected = selectedSurah.number === surah.number;
          const isDone = completedSurahs.includes(surah.number);
          return (
            <button
              key={surah.number}
              onClick={() => {
                sound.playPop();
                setSelectedSurah(surah);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs whitespace-nowrap transition-all cursor-pointer border-2 ${
                isSelected
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/20 scale-102'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-emerald-400'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white/20 dark:bg-slate-700 flex items-center justify-center text-[10px]">
                {surah.number}
              </span>
              <span className="font-['Amiri'] text-base" dir="rtl">
                {surah.nameArabic}
              </span>
              <span>({surah.nameTransliteration})</span>
              {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-300" />}
            </button>
          );
        })}
      </div>

      {/* Main Quran Card */}
      <div className="bg-gradient-to-b from-emerald-50/50 via-white to-amber-50/40 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 rounded-3xl p-6 md:p-8 shadow-xl border-3 border-emerald-300 dark:border-emerald-700/40 relative">
        {/* Surah Header Lockup */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-emerald-200/60 dark:border-emerald-800/40">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-black uppercase tracking-wider">
                Sourate {selectedSurah.number} · {selectedSurah.revelationType === 'Meccan' ? 'Mecquoise' : 'Médinoise'}
              </span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                {selectedSurah.versesCount} versets
              </span>
            </div>
            <h2 className="text-3xl font-black text-slate-800 dark:text-white font-['Fredoka']">
              {selectedSurah.nameTranslation[lang] || selectedSurah.nameTranslation.fr} ({selectedSurah.nameTransliteration})
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-xl">
              {selectedSurah.theme[lang] || selectedSurah.theme.fr}
            </p>
          </div>

          {/* Quick Tajweed & Audio Tools */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playPop();
                setShowTajweedModal(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 font-bold text-xs hover:bg-purple-200 transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>{lang === 'ar' ? 'أحكام التجويد الملونة' : 'Guide Tajwid'}</span>
            </button>

            <button
              onClick={() => {
                sound.playPop();
                setHifzHideLevel((prev) => ((prev + 1) % 3) as any);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                hifzHideLevel > 0
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {hifzHideLevel === 0 ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              <span>
                {hifzHideLevel === 0
                  ? (lang === 'ar' ? 'مدرب الحفظ' : 'Entraîneur Hifz')
                  : hifzHideLevel === 1
                  ? (lang === 'ar' ? 'إخفاء 50% من الكلمات' : 'Cache 50%')
                  : (lang === 'ar' ? 'إخفاء كامل الكلمات' : 'Cache 100%')}
              </span>
            </button>
          </div>
        </div>

        {/* Bismillah Header (except Tawbah) */}
        {selectedSurah.number !== 9 && selectedSurah.number !== 1 && (
          <div className="text-center my-6">
            <span
              className="text-3xl md:text-4xl font-bold font-['Amiri'] text-emerald-800 dark:text-emerald-300 select-none"
              dir="rtl"
            >
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </span>
          </div>
        )}

        {/* Verses List */}
        <div className="space-y-4 my-6">
          {selectedSurah.verses.map((verse, idx) => {
            const isActive = isPlaying && activeVerseIndex === idx;
            return (
              <div
                key={verse.verseNumber}
                onClick={() => playVerse(idx)}
                className={`p-4 md:p-5 rounded-2xl border-2 transition-all cursor-pointer relative group ${
                  isActive
                    ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 shadow-lg ring-4 ring-emerald-400/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-emerald-300 bg-white dark:bg-slate-800/80'
                }`}
              >
                {/* Verse Number & Play indicator */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-slate-700 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-center">
                      {verse.verseNumber}
                    </span>
                    {isActive && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 animate-pulse">
                        <Volume2 className="w-3.5 h-3.5" /> En cours de récitation
                      </span>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playVerse(idx);
                    }}
                    className="p-1.5 rounded-full text-slate-400 group-hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                </div>

                {/* Arabic Text with Tajweed Segments & Hifz Mode Hiding */}
                <div
                  className="text-right text-3xl md:text-4xl font-['Amiri'] font-bold leading-loose py-2"
                  dir="rtl"
                >
                  {hifzHideLevel === 2 ? (
                    <span className="tracking-widest text-emerald-300/60 dark:text-emerald-800 select-none">
                      ••••••••••••••••••••••••••••••••
                    </span>
                  ) : (
                    verse.segments.map((seg, sIdx) => {
                      const ruleInfo = TAJWEED_RULES_INFO[seg.rule];
                      const isHidden = hifzHideLevel === 1 && sIdx % 2 === 1;

                      if (isHidden) {
                        return (
                          <span
                            key={sIdx}
                            className="bg-amber-200 dark:bg-amber-900/60 text-transparent rounded px-2 mx-1 select-none cursor-pointer hover:text-inherit"
                            title="Clique pour révéler"
                          >
                            {seg.text}
                          </span>
                        );
                      }

                      return (
                        <span
                          key={sIdx}
                          onClick={(e) => {
                            if (seg.rule !== 'normal') {
                              e.stopPropagation();
                              setInspectedRule(seg.rule);
                            }
                          }}
                          className={`${ruleInfo.colorClass} ${
                            seg.rule !== 'normal'
                              ? 'cursor-help border-b-2 border-dotted border-current'
                              : 'text-slate-800 dark:text-slate-100'
                          }`}
                        >
                          {seg.text}
                        </span>
                      );
                    })
                  )}
                  {/* End of Ayah Symbol */}
                  <span className="inline-block mx-2 text-2xl text-emerald-600 font-['Amiri']">
                    ۝{verse.verseNumber}
                  </span>
                </div>

                {/* Transliteration and Translation */}
                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/60">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 italic">
                    {verse.transliteration}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 mt-1 font-medium">
                    {verse.translation[lang] || verse.translation.fr}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Audio Player Controls Bar */}
        <div className="sticky bottom-4 z-20 p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-2 border-emerald-400 shadow-xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleTogglePlay}
              className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform cursor-pointer"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>
            <div>
              <div className="text-xs font-black text-slate-800 dark:text-white">
                {isPlaying
                  ? `Verset ${activeVerseIndex + 1} / ${selectedSurah.versesCount}`
                  : 'Récitation avec Tajwid (Mishary Alafasy)'}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                {selectedSurah.nameArabic} · {selectedSurah.nameTransliteration}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Repeat Mode */}
            <div className="flex items-center gap-1 text-xs font-bold bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
              <RotateCcw className="w-3.5 h-3.5 text-emerald-600" />
              <span>Répéter :</span>
              {([1, 3, 5] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    sound.playPop();
                    setRepeatMode(r);
                  }}
                  className={`px-1.5 py-0.5 rounded ${
                    repeatMode === r ? 'bg-emerald-500 text-white' : 'text-slate-500'
                  }`}
                >
                  {r}x
                </button>
              ))}
            </div>

            {/* Validate Mastery Button */}
            <button
              onClick={handleCompleteSurah}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs transition-all shadow-md cursor-pointer ${
                isCurrentCompleted
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:scale-105'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>
                {isCurrentCompleted
                  ? (lang === 'ar' ? 'تم الحفظ بنجاح ✓' : 'Sourate apprise ✓')
                  : (lang === 'ar' ? 'تأكيد الحفظ (+40 ⭐)' : 'Valider mémorisation (+40 ⭐)')}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Tajweed Rules Guide Modal */}
      {showTajweedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl border-4 border-purple-400 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-600" />
                <h3 className="text-xl font-black text-slate-800 dark:text-white font-['Fredoka']">
                  {lang === 'ar' ? 'دليل أحكام التجويد الميسر للأطفال' : 'Guide des Règles de Tajwid pour Enfants'}
                </h3>
              </div>
              <button
                onClick={() => setShowTajweedModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 mb-6">
              {lang === 'ar'
                ? 'التجويد هو تحسين نطق كلمات القرآن الكريم بتطبيق هذه القواعد الملونة الجميلة :'
                : 'Le Tajwid permet d’embellir la lecture du Saint Coran grâce à des couleurs intuitives :'}
            </p>

            <div className="space-y-4">
              {Object.entries(TAJWEED_RULES_INFO)
                .filter(([k]) => k !== 'normal')
                .map(([key, info]) => (
                  <div
                    key={key}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-start gap-4"
                  >
                    <div className={`px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap ${info.badgeBg}`}>
                      {info.name[lang] || info.name.fr}
                    </div>
                    <div>
                      <p className="text-xs text-slate-700 dark:text-slate-200">
                        {info.description[lang] || info.description.fr}
                      </p>
                      <span className="text-sm font-['Amiri'] font-bold text-slate-800 dark:text-white mt-1 block" dir="rtl">
                        Exemple : {info.example}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Specific Inspected Rule Popup */}
      {inspectedRule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full shadow-2xl border-4 border-purple-400 text-center">
            <span className="text-4xl mb-2 block">✨</span>
            <h4 className="text-lg font-black text-slate-800 dark:text-white font-['Fredoka'] mb-2">
              {TAJWEED_RULES_INFO[inspectedRule].name[lang] || TAJWEED_RULES_INFO[inspectedRule].name.fr}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              {TAJWEED_RULES_INFO[inspectedRule].description[lang] || TAJWEED_RULES_INFO[inspectedRule].description.fr}
            </p>
            <div className="text-xl font-['Amiri'] font-bold text-purple-600 mb-4" dir="rtl">
              {TAJWEED_RULES_INFO[inspectedRule].example}
            </div>
            <button
              onClick={() => setInspectedRule(null)}
              className="w-full py-2 rounded-xl bg-purple-600 text-white font-bold text-xs"
            >
              Compris !
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
