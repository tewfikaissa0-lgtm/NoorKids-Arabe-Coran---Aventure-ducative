import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Story, Language } from '../../types';
import { sound } from '../../utils/soundEngine';
import { STORY_IMAGES } from '../../assets/images';
import { StorySceneAnimation } from './StorySceneAnimation';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  Trophy,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';

interface StoryReaderProps {
  story: Story;
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onStoryCompleted: (storyId: string) => void;
}

export const StoryReader: React.FC<StoryReaderProps> = ({
  story,
  isOpen,
  onClose,
  lang,
  onStoryCompleted,
}) => {
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [isNarrating, setIsNarrating] = useState<boolean>(false);
  const [narrationSpeed, setNarrationSpeed] = useState<number>(0.9);
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [isQuizCorrect, setIsQuizCorrect] = useState<boolean>(false);

  const page = story.pages[currentPageIndex];
  const isLastPage = currentPageIndex === story.pages.length - 1;

  useEffect(() => {
    setCurrentPageIndex(0);
    setIsNarrating(false);
    setQuizAnswered(false);
    setSelectedQuizOption(null);
  }, [story]);

  // Handle ambient sound effect for page
  useEffect(() => {
    if (!isOpen) {
      sound.stopSpeaking();
      return;
    }
    // Ambient sound cue
    if (page?.audioEffect === 'waves') {
      sound.playAmbient('ocean_waves');
    } else {
      sound.playAmbient('peaceful_lute');
    }

    return () => {
      sound.stopSpeaking();
      sound.stopAmbient();
    };
  }, [currentPageIndex, isOpen, page]);

  if (!isOpen) return null;

  const handleNextPage = () => {
    sound.stopSpeaking();
    setIsNarrating(false);
    sound.playPop();
    if (!isLastPage) {
      setCurrentPageIndex((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    sound.stopSpeaking();
    setIsNarrating(false);
    sound.playPop();
    if (currentPageIndex > 0) {
      setCurrentPageIndex((prev) => prev - 1);
    }
  };

  const handleToggleNarration = () => {
    sound.playPop();
    if (isNarrating) {
      sound.stopSpeaking();
      setIsNarrating(false);
    } else {
      setIsNarrating(true);
      const textToRead = page.text[lang] || page.text.fr;
      sound.speakStoryText(textToRead, lang, narrationSpeed, () => {
        setIsNarrating(false);
      });
    }
  };

  const handleQuizSelect = (optIdx: number) => {
    if (quizAnswered || !story.quizQuestions?.[0]) return;
    sound.playPop();
    setSelectedQuizOption(optIdx);
    setQuizAnswered(true);

    const correct = optIdx === story.quizQuestions[0].correctIndex;
    setIsQuizCorrect(correct);

    if (correct) {
      sound.playCelebrationFanfare();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
      onStoryCompleted(story.id);
    } else {
      sound.playGentleBoing();
    }
  };

  // Image lookup
  const aiImageSrc = STORY_IMAGES[page.illustrationKey];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 md:p-8 max-w-3xl w-full shadow-2xl border-4 border-amber-400 max-h-[92vh] overflow-y-auto relative flex flex-col justify-between">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{story.coverEmoji}</span>
            <div>
              <span className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                {story.arabicTitle}
              </span>
              <h3 className="text-xl font-black text-slate-800 dark:text-white font-['Fredoka']">
                {story.title[lang] || story.title.fr}
              </h3>
            </div>
          </div>

          <button
            onClick={() => {
              sound.stopSpeaking();
              sound.stopAmbient();
              sound.playPop();
              onClose();
            }}
            className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="my-5 space-y-5">
          {/* AI Generated / Animated Illustration */}
          <div className="rounded-2xl overflow-hidden shadow-lg border-2 border-amber-300 dark:border-slate-700 max-h-72 sm:max-h-80 w-full relative">
            {aiImageSrc ? (
              <img
                src={aiImageSrc}
                alt={story.title[lang]}
                className="w-full h-64 sm:h-80 object-cover transform hover:scale-102 transition-transform duration-500"
              />
            ) : (
              <StorySceneAnimation sceneKey={page.illustrationKey} />
            )}
            <div className="absolute bottom-3 right-4 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-xs font-bold">
              Page {page.pageNumber} / {story.pages.length}
            </div>
          </div>

          {/* Arabic Calligraphy Excerpt */}
          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-slate-800/80 border border-amber-200 dark:border-slate-700 text-center">
            <p className="text-2xl font-bold font-['Amiri'] text-amber-700 dark:text-amber-300 leading-relaxed" dir="rtl">
              {page.arabicExcerpt}
            </p>
          </div>

          {/* Story Text in Selected Language */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 relative">
            <p className="text-base sm:text-lg text-slate-800 dark:text-slate-100 leading-relaxed font-medium">
              {page.text[lang] || page.text.fr}
            </p>

            {/* Read-Aloud Voice Button */}
            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={handleToggleNarration}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-xs shadow-md transition-all cursor-pointer ${
                  isNarrating
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:scale-105 active:scale-95'
                }`}
              >
                {isNarrating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>
                  {isNarrating
                    ? (lang === 'ar' ? 'إيقاف القراءة' : 'Pause la voix')
                    : (lang === 'ar' ? 'استمع إلى القصة بصوت معبر' : 'Écouter la voix de lecture')}
                </span>
              </button>

              <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                <span>Vitesse :</span>
                {[0.8, 1.0].map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      sound.playPop();
                      setNarrationSpeed(s);
                    }}
                    className={`px-2 py-0.5 rounded-md ${
                      narrationSpeed === s
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Comprehension Quiz on Last Page */}
          {isLastPage && story.quizQuestions && story.quizQuestions.length > 0 && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-100/70 to-orange-100/70 dark:from-slate-800 dark:to-slate-800 border-2 border-amber-400">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-amber-600" />
                <h4 className="font-black text-slate-800 dark:text-white text-sm">
                  {lang === 'ar' ? 'سؤال الفهم الذكي (+30 ⭐)' : 'Mini-Défi de Compréhension (+30 ⭐)'}
                </h4>
              </div>

              <p className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-3">
                {story.quizQuestions[0].question[lang] || story.quizQuestions[0].question.fr}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {(story.quizQuestions[0].options[lang] || story.quizQuestions[0].options.fr).map(
                  (optText, idx) => {
                    const isSelected = selectedQuizOption === idx;
                    const isTarget = idx === story.quizQuestions![0].correctIndex;

                    let btnClass = 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 hover:border-amber-400';
                    if (quizAnswered) {
                      if (isTarget) btnClass = 'bg-emerald-500 text-white border-emerald-600 font-bold';
                      else if (isSelected) btnClass = 'bg-rose-500 text-white border-rose-600';
                    }

                    return (
                      <button
                        key={idx}
                        disabled={quizAnswered}
                        onClick={() => handleQuizSelect(idx)}
                        className={`p-3 rounded-xl border-2 text-xs font-semibold transition-all cursor-pointer ${btnClass}`}
                      >
                        {optText}
                      </button>
                    );
                  }
                )}
              </div>

              {quizAnswered && (
                <div className="mt-3 text-center text-xs font-bold text-emerald-700 dark:text-emerald-400">
                  {isQuizCorrect
                    ? (lang === 'ar' ? 'أحسنت ! إجابة رائعة تضاف إلى إنجازاتك !' : 'Bravo ! Tu as parfaitement compris la leçon !')
                    : (lang === 'ar' ? 'محاولة جيدة، اقرأ العبرة الجميلة في الأسفل !' : 'Bien essayé ! Relis bien la morale de cette histoire.')}
                </div>
              )}
            </div>
          )}

          {/* Moral Lesson Footer */}
          {isLastPage && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/60 text-xs text-emerald-900 dark:text-emerald-300">
              <strong className="block font-bold mb-1">
                💎 {lang === 'ar' ? 'الحكمة والعبرة من القصة :' : 'La Morale & Sagesse de cette histoire :'}
              </strong>
              {story.moral[lang] || story.moral.fr}
            </div>
          )}
        </div>

        {/* Navigation Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={handlePrevPage}
            disabled={currentPageIndex === 0}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              currentPageIndex === 0
                ? 'opacity-40 cursor-not-allowed text-slate-400'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{lang === 'ar' ? 'السابق' : 'Précédent'}</span>
          </button>

          <div className="flex items-center gap-1.5">
            {story.pages.map((_, idx) => (
              <span
                key={idx}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  idx === currentPageIndex ? 'w-6 bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              />
            ))}
          </div>

          {!isLastPage ? (
            <button
              onClick={handleNextPage}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-500 text-white font-bold text-xs shadow-md hover:bg-amber-600 transition-all cursor-pointer"
            >
              <span>{lang === 'ar' ? 'التالي' : 'Suivant'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => {
                sound.playPop();
                onStoryCompleted(story.id);
                onClose();
              }}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-500 text-white font-bold text-xs shadow-md hover:bg-emerald-600 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{lang === 'ar' ? 'إنهاء القصة' : 'Terminer'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
