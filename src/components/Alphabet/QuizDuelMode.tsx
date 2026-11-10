/**
 * Quiz Duel Mode - Asynchronous 5-question alphabet challenge against roster opponents
 * Created with love for Maryam et son fils
 */

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Language, StudentProfile, ArabicLetter } from '../../types';
import { ALPHABET_DATA } from '../../data/alphabetData';
import { sound } from '../../utils/soundEngine';
import { Swords, Trophy, RotateCcw, Volume2, ArrowRight, Sparkles, CheckCircle2, XCircle } from 'lucide-react';

interface QuizDuelModeProps {
  lang: Language;
  roster: StudentProfile[];
  currentStudent: StudentProfile;
  onReward: (stars: number, gems: number) => void;
  onBack: () => void;
}

interface Question {
  targetLetter: ArabicLetter;
  options: ArabicLetter[];
}

export const QuizDuelMode: React.FC<QuizDuelModeProps> = ({
  lang,
  roster,
  currentStudent,
  onReward,
  onBack,
}) => {
  const [selectedOpponent, setSelectedOpponent] = useState<StudentProfile | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // Filter out current student from opponents list
  const availableOpponents = roster.filter((s) => s.id !== currentStudent.id);
  const defaultOpponent = availableOpponents[0] || {
    id: 'opp-default',
    name: 'Rayan l’Explorateur',
    avatar: '🧒🏽',
    stars: 310,
    gems: 90,
  };

  const opponentTargetScore = 3; // Opponent scored 3 out of 5

  const startDuel = (opponent: StudentProfile) => {
    sound.playOudStrum();
    setSelectedOpponent(opponent);
    setCurrentIndex(0);
    setScore(0);
    setIsFinished(false);
    generateQuestions();
  };

  const generateQuestions = () => {
    const shuffledAlphabet = [...ALPHABET_DATA].sort(() => Math.random() - 0.5);
    const generated: Question[] = [];

    for (let i = 0; i < 5; i++) {
      const target = shuffledAlphabet[i % shuffledAlphabet.length];
      const distractors = ALPHABET_DATA.filter((l) => l.id !== target.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      const options = [target, ...distractors].sort(() => Math.random() - 0.5);
      generated.push({ targetLetter: target, options });
    }

    setQuestions(generated);
    if (generated[0]) {
      setTimeout(() => {
        sound.playHumanLetter(generated[0].targetLetter.id);
      }, 400);
    }
  };

  const handleSelectOption = (opt: ArabicLetter) => {
    if (isAnswered || !questions[currentIndex]) return;

    sound.playHumanLetter(opt.id);
    setSelectedOptionId(opt.id);
    setIsAnswered(true);

    const correct = opt.id === questions[currentIndex].targetLetter.id;
    setIsCorrect(correct);

    if (correct) {
      sound.playMatchSuccess();
      setScore((prev) => prev + 1);
    } else {
      sound.playGentleBoing();
    }

    setTimeout(() => {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex((prev) => prev + 1);
        setSelectedOptionId(null);
        setIsAnswered(false);
        setIsCorrect(false);
        sound.playHumanLetter(questions[currentIndex + 1].targetLetter.id);
      } else {
        // Finished duel!
        setIsFinished(true);
        const finalScore = score + (correct ? 1 : 0);
        if (finalScore >= opponentTargetScore) {
          sound.playCelebrationFanfare();
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.6 },
          });
          onReward(30, 5);
        } else {
          sound.playGentleBoing();
          onReward(10, 1); // consolation reward
        }
      }
    }, 1200);
  };

  // If no opponent selected yet, show opponent selection screen
  if (!selectedOpponent) {
    return (
      <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950 rounded-3xl p-6 md:p-8 shadow-xl border-3 border-indigo-300 dark:border-indigo-700/50 max-w-3xl mx-auto">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center text-2xl shadow-md">
              <Swords className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-800 dark:text-white font-['Fredoka']">
                {lang === 'ar' ? 'وضع تحدي المبارزة (Quiz Duel)' : 'Mode Quiz Duel & Défis'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {lang === 'ar'
                  ? 'اختر منافساً من أصدقائك وتحدى سجله في 5 أسئلة سريعة حول الحروف !'
                  : 'Défie un autre élève du roster sur une série rapide de 5 questions sur l’alphabet !'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playPop();
              onBack();
            }}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 transition-colors cursor-pointer"
          >
            ← {lang === 'ar' ? 'رجوع' : 'Retour'}
          </button>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-sm text-slate-700 dark:text-slate-300 font-['Fredoka']">
            {lang === 'ar' ? 'اختر منافساً للتحدي :' : 'Choisis ton adversaire :'}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(availableOpponents.length > 0 ? availableOpponents : [defaultOpponent]).map((opp) => (
              <div
                key={opp.id}
                onClick={() => startDuel(opp)}
                className="p-5 rounded-3xl bg-white dark:bg-slate-800 border-2 border-indigo-200 dark:border-slate-700 hover:border-indigo-500 shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <span className="text-4xl p-2 rounded-2xl bg-indigo-50 dark:bg-slate-700">
                    {opp.avatar}
                  </span>
                  <div>
                    <h5 className="font-bold text-base text-slate-800 dark:text-white font-['Fredoka'] group-hover:text-indigo-600 transition-colors">
                      {opp.name}
                    </h5>
                    <p className="text-xs text-slate-500">
                      Niveau {opp.level} · {opp.stars} ⭐
                    </p>
                  </div>
                </div>

                <div className="px-4 py-2 rounded-2xl bg-indigo-600 text-white font-black text-xs shadow-md group-hover:scale-105 transition-transform flex items-center gap-1.5">
                  <Swords className="w-4 h-4" />
                  <span>Défier</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // If duel is finished
  if (isFinished) {
    const won = score >= opponentTargetScore;
    return (
      <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950 rounded-3xl p-6 md:p-8 shadow-xl border-3 border-indigo-300 dark:border-indigo-700/50 max-w-2xl mx-auto text-center animate-fadeIn">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center mx-auto text-4xl shadow-xl mb-4 animate-bounce">
          <Trophy className="w-10 h-10 text-yellow-300" />
        </div>

        <h3 className="text-3xl font-black text-slate-800 dark:text-white font-['Fredoka'] mb-2">
          {won
            ? (lang === 'ar' ? 'أنت الفائز في المبارزة ! 🏆' : 'Victoire Éclatante ! 🏆')
            : (lang === 'ar' ? 'مبارزة رائعة، حاول مجدداً !' : 'Beau combat ! Continue à t’entraîner !')}
        </h3>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-6">
          Score de <strong>{currentStudent.name}</strong> : {score} / 5 <br />
          Score de <strong>{selectedOpponent.name}</strong> : {opponentTargetScore} / 5
        </p>

        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="px-4 py-2 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold text-xs">
            ⭐ +{won ? 30 : 10} Étoiles
          </div>
          <div className="px-4 py-2 rounded-2xl bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 font-bold text-xs">
            💎 +{won ? 5 : 1} Diamants
          </div>
        </div>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => startDuel(selectedOpponent)}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 text-white font-black text-xs shadow-md hover:bg-indigo-700 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Revanche</span>
          </button>
          <button
            onClick={() => setSelectedOpponent(null)}
            className="px-6 py-3 rounded-2xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-300 cursor-pointer"
          >
            Changer d'adversaire
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  if (!currentQ) return null;

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950 rounded-3xl p-6 md:p-8 shadow-xl border-3 border-indigo-300 dark:border-indigo-700/50 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{selectedOpponent.avatar}</span>
          <div>
            <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase">
              Duel contre {selectedOpponent.name}
            </div>
            <h4 className="text-lg font-black text-slate-800 dark:text-white font-['Fredoka']">
              Question {currentIndex + 1} / 5
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold text-xs">
          ⭐ Score : {score}
        </div>
      </div>

      {/* Audio Prompt Card */}
      <div className="text-center p-6 mb-6 rounded-3xl bg-white dark:bg-slate-800 border-2 border-indigo-200 dark:border-slate-700 shadow-md">
        <button
          onClick={() => sound.playHumanLetter(currentQ.targetLetter.id)}
          className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center mx-auto text-3xl shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer mb-3"
          title="Écouter le son"
        >
          <Volume2 className="w-8 h-8 animate-pulse" />
        </button>

        <h5 className="text-sm font-bold text-slate-600 dark:text-slate-300">
          {lang === 'ar' ? 'استمع إلى صوت الحرف واختر الإجابة الصحيحة :' : 'Écoute le son de la lettre et choisis la bonne réponse :'}
        </h5>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-2 gap-4">
        {currentQ.options.map((opt) => {
          const isSelected = selectedOptionId === opt.id;
          const isTarget = opt.id === currentQ.targetLetter.id;

          let btnStyle = 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white hover:border-indigo-400';
          if (isAnswered) {
            if (isTarget) {
              btnStyle = 'bg-emerald-500 text-white border-emerald-600 shadow-md';
            } else if (isSelected) {
              btnStyle = 'bg-rose-500 text-white border-rose-600 shadow-md';
            } else {
              btnStyle = 'bg-slate-100 dark:bg-slate-800 opacity-50 border-slate-200 dark:border-slate-700 text-slate-400';
            }
          }

          return (
            <button
              key={opt.id}
              onClick={() => handleSelectOption(opt)}
              disabled={isAnswered}
              className={`p-5 rounded-3xl border-3 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer ${btnStyle}`}
            >
              <span className="text-5xl font-bold font-['Amiri']" dir="rtl">
                {opt.letter}
              </span>
              <span className="text-xs font-black font-['Fredoka']">
                {opt.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
