import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ArabicLetter, Language } from '../../types';
import { ALPHABET_DATA } from '../../data/alphabetData';
import { sound } from '../../utils/soundEngine';
import { Volume2, Trophy, RotateCcw, CheckCircle2, HelpCircle } from 'lucide-react';

interface AlphabetQuizProps {
  lang: Language;
  onReward: (stars: number, gems: number) => void;
}

interface Question {
  type: 'sound_to_letter' | 'word_to_letter';
  targetLetter: ArabicLetter;
  promptText: Record<Language, string>;
  options: ArabicLetter[];
}

export const AlphabetQuiz: React.FC<AlphabetQuizProps> = ({ lang, onReward }) => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [questionCount, setQuestionCount] = useState<number>(0);

  const generateQuestion = () => {
    sound.playPop();
    const target = ALPHABET_DATA[Math.floor(Math.random() * ALPHABET_DATA.length)];
    const distractors = ALPHABET_DATA.filter((l) => l.id !== target.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    const options = [target, ...distractors].sort(() => Math.random() - 0.5);

    const isAudioType = Math.random() > 0.4;
    const q: Question = {
      type: isAudioType ? 'sound_to_letter' : 'word_to_letter',
      targetLetter: target,
      promptText: isAudioType
        ? {
            fr: "Écoute bien ce son et trouve la bonne lettre :",
            en: "Listen to the sound and choose the correct letter:",
            ar: "استمع إلى الصوت بدقة واختر الحرف المناسب :",
            es: "Escucha el sonido y elige la letra correcta:",
          }
        : {
            fr: `Quelle lettre commence le mot « ${target.exampleWord.arabic} » (${target.exampleWord.meaning[lang]}) ?`,
            en: `Which letter starts the word "${target.exampleWord.arabic}" (${target.exampleWord.meaning[lang]})?`,
            ar: `ما هو الحرف الذي تبدأ به كلمة « ${target.exampleWord.arabic} » ؟`,
            es: `¿Qué letra empieza la palabra "${target.exampleWord.arabic}"?`,
          },
      options,
    };

    setCurrentQuestion(q);
    setSelectedOptionId(null);
    setIsAnswered(false);
    setIsCorrect(false);

    // If sound type, automatically play audio
    if (isAudioType) {
      setTimeout(() => {
        sound.playHumanLetter(target.id);
      }, 300);
    }
  };

  useEffect(() => {
    generateQuestion();
  }, [lang]);

  const handleSelectOption = (opt: ArabicLetter) => {
    if (isAnswered || !currentQuestion) return;

    sound.playHumanLetter(opt.id);
    setSelectedOptionId(opt.id);
    setIsAnswered(true);

    const correct = opt.id === currentQuestion.targetLetter.id;
    setIsCorrect(correct);
    setQuestionCount((prev) => prev + 1);

    if (correct) {
      sound.playMatchSuccess();
      setScore((prev) => prev + 1);
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.6 },
      });
      onReward(10, 1);
    } else {
      sound.playGentleBoing();
    }
  };

  const handlePlayPromptSound = () => {
    if (!currentQuestion) return;
    sound.playHumanLetter(currentQuestion.targetLetter.id);
  };

  if (!currentQuestion) return null;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-xl border-3 border-amber-300 dark:border-amber-700/50 max-w-2xl mx-auto">
      {/* Quiz Header */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-amber-500 text-white shadow-xs">
            <HelpCircle className="w-5 h-5" />
          </span>
          <h3 className="text-xl font-black text-slate-800 dark:text-white font-['Fredoka']">
            {lang === 'ar' ? 'اختبار الحروف الذكي' : lang === 'en' ? 'Smart Alphabet Quiz' : 'Le Grand Défi des Lettres'}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
            Score : {score} / {questionCount}
          </span>
        </div>
      </div>

      {/* Question Prompt */}
      <div className="text-center mb-8">
        <p className="text-base md:text-lg font-bold text-slate-700 dark:text-slate-200 mb-4">
          {currentQuestion.promptText[lang]}
        </p>

        {currentQuestion.type === 'sound_to_letter' ? (
          <button
            onClick={handlePlayPromptSound}
            className="inline-flex items-center gap-3 px-6 py-4 rounded-3xl bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold text-base shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer animate-pulse"
          >
            <Volume2 className="w-6 h-6" />
            <span>{lang === 'ar' ? 'اضغط لإعادة الاستماع للصوت' : 'Clique pour réécouter le son'}</span>
          </button>
        ) : (
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-amber-50 dark:bg-slate-800 border-2 border-amber-300">
            <span className="text-4xl">{currentQuestion.targetLetter.exampleWord.emoji}</span>
            <span className="text-3xl font-bold font-['Amiri'] text-amber-700 dark:text-amber-300" dir="rtl">
              {currentQuestion.targetLetter.exampleWord.arabic}
            </span>
          </div>
        )}
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {currentQuestion.options.map((opt) => {
          const isSelected = selectedOptionId === opt.id;
          const isTarget = opt.id === currentQuestion.targetLetter.id;

          let btnColor = 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-amber-400';
          if (isAnswered) {
            if (isTarget) {
              btnColor = 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-300 ring-4 ring-emerald-400/30';
            } else if (isSelected) {
              btnColor = 'bg-rose-100 dark:bg-rose-950/60 border-rose-500 text-rose-700';
            }
          }

          return (
            <button
              key={opt.id}
              disabled={isAnswered}
              onClick={() => handleSelectOption(opt)}
              className={`h-24 rounded-2xl border-3 flex flex-col items-center justify-center font-['Amiri'] font-bold text-5xl transition-all cursor-pointer ${btnColor}`}
            >
              <span>{opt.letter}</span>
              <span className="text-xs font-['Outfit'] font-semibold text-slate-500 dark:text-slate-400 mt-1">
                {opt.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Answer feedback & Next button */}
      {isAnswered && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            {isCorrect ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span className="font-bold text-emerald-700 text-sm">
                  {lang === 'ar' ? 'إجابة صحيحة ! أحسنت يا بطل ! (+10 ⭐)' : 'Excellente réponse ! (+10 ⭐)'}
                </span>
              </>
            ) : (
              <span className="font-bold text-rose-600 text-sm">
                {lang === 'ar'
                  ? `الإجابة الصحيحة كانت : ${currentQuestion.targetLetter.letter} (${currentQuestion.targetLetter.name})`
                  : `La bonne réponse était la lettre ${currentQuestion.targetLetter.letter} (${currentQuestion.targetLetter.name})`}
              </span>
            )}
          </div>

          <button
            onClick={generateQuestion}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            {lang === 'ar' ? 'السؤال التالي' : 'Question suivante ➔'}
          </button>
        </div>
      )}
    </div>
  );
};
