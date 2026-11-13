import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Language, StudentProfile } from '../../types';
import { sound } from '../../utils/soundEngine';
import { Target, Award, Sparkles, CheckCircle2, Gift, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DailyChallengesModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  student: StudentProfile;
  onUpdateStudent: (updater: (prev: StudentProfile) => StudentProfile) => void;
  onReward: (stars: number, gems: number) => void;
}

export const DailyChallengesModal: React.FC<DailyChallengesModalProps> = ({
  isOpen,
  onClose,
  lang,
  student,
  onUpdateStudent,
  onReward,
}) => {
  if (!isOpen) return null;

  const todayStr = new Date().toISOString().split('T')[0];

  // Initialize or get today's challenges
  const currentChallengesData = student.dailyChallenges;
  let challenges = currentChallengesData?.date === todayStr ? currentChallengesData.challenges : null;

  if (!challenges) {
    // Generate 3 random daily challenges based on date seed
    const possiblePool = [
      {
        id: 'c1',
        title: { fr: 'Maître des Lettres', ar: 'سيد الحروف', en: 'Letter Master', es: 'Maestro de Letras' },
        description: { fr: 'Apprendre ou réviser 2 lettres de l’alphabet', ar: 'تعلم أو مراجعة حرفين من الحروف', en: 'Learn or review 2 alphabet letters', es: 'Aprender o repasar 2 letras' },
        target: 2,
        current: Math.min(2, student.masteredLetters.length),
        rewardStars: 40,
        rewardGems: 15,
        icon: '🔤',
      },
      {
        id: 'c2',
        title: { fr: 'Explorateur du Coran', ar: 'مستكشف القرآن', en: 'Quran Explorer', es: 'Explorador del Corán' },
        description: { fr: 'Écouter ou réciter 1 sourate', ar: 'استماع أو تلاوة سورة واحدة', en: 'Listen or recite 1 surah', es: 'Escuchar o recitar 1 sura' },
        target: 1,
        current: student.completedSurahs.length > 0 ? 1 : 0,
        rewardStars: 50,
        rewardGems: 20,
        icon: '📖',
      },
      {
        id: 'c3',
        title: { fr: 'Champion des Puzzles', ar: 'بطل الألغاز', en: 'Puzzle Champion', es: 'Campeón de Puzles' },
        description: { fr: 'Réussir 2 mini-jeux ou puzzles', ar: 'إكمال لعبتين أو لغزين', en: 'Complete 2 mini-games or puzzles', es: 'Completar 2 minijuegos' },
        target: 2,
        current: Math.min(2, student.completedPuzzlesCount || 0),
        rewardStars: 35,
        rewardGems: 10,
        icon: '🧩',
      },
      {
        id: 'c4',
        title: { fr: 'Sage des Histoires', ar: 'حكيم القصص', en: 'Story Sage', es: 'Sabio de Historias' },
        description: { fr: 'Lire 1 histoire des Prophètes', ar: 'قراءة قصة واحدة من قصص الأنبياء', en: 'Read 1 Prophets story', es: 'Leer 1 historia de los Profetas' },
        target: 1,
        current: student.readStories.length > 0 ? 1 : 0,
        rewardStars: 45,
        rewardGems: 15,
        icon: '✨',
      },
      {
        id: 'c5',
        title: { fr: 'Quiz Vocal Magique', ar: 'اختبار صوتي سحري', en: 'Magic Voice Quiz', es: 'Test de Voz Mágico' },
        description: { fr: 'Essayer le quiz de prononciation vocale', ar: 'تجربة اختبار النطق الصوتي', en: 'Try voice pronunciation quiz', es: 'Probar test de voz' },
        target: 1,
        current: student.quizScores.totalQuizzes > 0 ? 1 : 0,
        rewardStars: 40,
        rewardGems: 12,
        icon: '🎤',
      },
    ];

    // Pick 3 pseudo-random challenges based on day
    const daySeed = parseInt(todayStr.replace(/-/g, ''), 10);
    const shuffled = [...possiblePool].sort((a, b) => ((daySeed * a.id.charCodeAt(0)) % 7) - ((daySeed * b.id.charCodeAt(0)) % 7));
    const selected = shuffled.slice(0, 3).map((c) => ({
      ...c,
      completed: c.current >= c.target,
      claimed: false,
    }));

    challenges = selected;

    // Save initial generated challenges
    setTimeout(() => {
      onUpdateStudent((prev) => ({
        ...prev,
        dailyChallenges: {
          date: todayStr,
          challenges: selected,
        },
      }));
    }, 0);
  }

  const handleClaim = (challengeId: string, rewardStars: number, rewardGems: number, alreadyClaimed?: boolean) => {
    if (alreadyClaimed) return;
    sound.playStarChime();
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    onReward(rewardStars, rewardGems);

    onUpdateStudent((prev) => {
      if (!prev.dailyChallenges) return prev;
      const updatedList = prev.dailyChallenges.challenges.map((c) =>
        c.id === challengeId ? { ...c, claimed: true } : c
      );
      return {
        ...prev,
        dailyChallenges: {
          ...prev.dailyChallenges,
          challenges: updatedList,
        },
      };
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-2 border-amber-300 dark:border-slate-800 space-y-6 relative overflow-hidden"
      >
        {/* Header decoration */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-amber-400/20 to-orange-500/0 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/30 text-2xl">
              🎯
            </div>
            <div>
              <h2 className="text-xl font-black font-['Fredoka'] text-slate-900 dark:text-white">
                {lang === 'ar' ? 'التحديات اليومية' : 'Défis Quotidiens Dynamiques'}
              </h2>
              <p className="text-xs text-slate-500">
                {lang === 'ar' ? 'أهداف جديدة تتجدد كل صباح!' : 'Générés chaque matin pour progresser en douceur'}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playPop();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Challenge list */}
        <div className="space-y-3.5 max-h-[60vh] overflow-y-auto pr-1">
          {challenges.map((c) => {
            const isFinished = c.current >= c.target;
            return (
              <div
                key={c.id}
                className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between gap-4 ${
                  c.claimed
                    ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-75'
                    : isFinished
                    ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-400 dark:border-emerald-700 shadow-md'
                    : 'bg-white dark:bg-slate-800/80 border-amber-200 dark:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center text-2xl shadow-inner shrink-0">
                    {c.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white font-['Fredoka'] flex items-center gap-2">
                      <span>{c.title[lang] || c.title.fr}</span>
                      {c.claimed && <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">Récompensé ✓</span>}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {c.description[lang] || c.description.fr}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs font-semibold">
                      <span className="text-amber-700 dark:text-amber-400">⭐ +{c.rewardStars}</span>
                      <span className="text-sky-700 dark:text-sky-400">💎 +{c.rewardGems}</span>
                      <span className="text-slate-400">
                        ({Math.min(c.current, c.target)}/{c.target})
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  {c.claimed ? (
                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-300 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                  ) : isFinished ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleClaim(c.id, c.rewardStars, c.rewardGems, c.claimed)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/30 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Gift className="w-4 h-4" />
                      <span>Réclamer</span>
                    </motion.button>
                  ) : (
                    <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 font-bold text-xs">
                      En cours...
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/40 p-3.5 rounded-2xl border border-amber-200 dark:border-amber-900/50 text-center text-xs text-amber-800 dark:text-amber-300 font-semibold">
          💡 Astuce : Revenez chaque jour pour découvrir 3 nouveaux défis et booster votre trésor d’étoiles !
        </div>
      </motion.div>
    </div>
  );
};
