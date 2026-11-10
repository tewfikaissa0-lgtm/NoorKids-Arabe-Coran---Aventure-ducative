import React, { useState } from 'react';
import { Language } from '../../types';
import { sound } from '../../utils/soundEngine';
import { Scroll, Award, Sparkles, CheckCircle2, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';

interface DiwanQuestProps {
  lang: Language;
  onReward: (stars: number, gems: number) => void;
}

interface DiwanScenario {
  id: string;
  npcName: { fr: string; ar: string };
  npcAvatar: string;
  dialogue: { fr: string; ar: string };
  options: {
    text: { fr: string; ar: string };
    isCorrect: boolean;
    feedback: { fr: string; ar: string };
  }[];
  proverbUnlock: {
    arabic: string;
    translation: { fr: string; ar: string };
  };
}

const DIWAN_SCENARIOS: DiwanScenario[] = [
  {
    id: 's1',
    npcName: { fr: 'Le Sage de l’Oasis', ar: 'حكيم الواحة' },
    npcAvatar: '🧓🏽',
    dialogue: {
      fr: 'Bienvenue jeune voyageur ! Comment salues-tu ton frère dans la tradition arabe ?',
      ar: 'أهلاً بك أيها المسافر الفطن ! كيف تحيي أخاك في الأدب العربي؟',
    },
    options: [
      {
        text: { fr: 'السَّلَامُ عَلَيْكُمْ (Assalamu Alaykum)', ar: 'السَّلَامُ عَلَيْكُمْ' },
        isCorrect: true,
        feedback: { fr: 'Magnifique ! C’est la salutation de paix et d’amour.', ar: 'رائع ! هذه تحية السلام والمحبة.' },
      },
      {
        text: { fr: 'Bonjour rapide', ar: 'مرحباً سريعاً' },
        isCorrect: false,
        feedback: { fr: 'Ce n’est pas la formule traditionnelle.', ar: 'ليست هذه العبارة التقليدية الأصيلة.' },
      },
    ],
    proverbUnlock: {
      arabic: 'الْجَارُ ثُمَّ الدَّارُ',
      translation: { fr: 'Le voisin avant la maison (Solidarité)', ar: 'الجار قبل الدار' },
    },
  },
  {
    id: 's2',
    npcName: { fr: 'La Poétesse du Jardin', ar: 'شاعرة البستان' },
    npcAvatar: '👩🏻‍🎨',
    dialogue: {
      fr: 'Quelle est la clé pour ouvrir les cœurs et réussir ses apprentissages ?',
      ar: 'ما هو مفتاح فتح القلوب والنجاح في طلب العلم؟',
    },
    options: [
      {
        text: { fr: 'الصَّبْرُ وَالْجِدُّ (Patience et persévérance)', ar: 'الصَّبْرُ وَالْجِدُّ' },
        isCorrect: true,
        feedback: { fr: 'Exact ! La patience mène au succès.', ar: 'أحسنت ! الصبر مفتاح الفرج والنجاح.' },
      },
      {
        text: { fr: 'La vitesse sans réfléchir', ar: 'السرعة بلا تفكير' },
        isCorrect: false,
        feedback: { fr: 'La précipitation mène à l’erreur.', ar: 'العجلة من الشيطان وتوقع في الخطأ.' },
      },
    ],
    proverbUnlock: {
      arabic: 'مَنْ صَبَرَ ظَفَرَ',
      translation: { fr: 'Celui qui est patient triomphe', ar: 'من صبر ظفر' },
    },
  },
];

export const DiwanQuestGame: React.FC<DiwanQuestProps> = ({ lang, onReward }) => {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [unlockedProverbs, setUnlockedProverbs] = useState<string[]>([]);

  const scenario = DIWAN_SCENARIOS[scenarioIndex];

  const handleChooseOption = (index: number, isCorrect: boolean) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    if (isCorrect) {
      sound.playCelebrationFanfare();
      confetti({ particleCount: 75, spread: 65, origin: { y: 0.6 } });
      setUnlockedProverbs((prev) => [...prev, scenario.proverbUnlock.arabic]);
      onReward(25, 4);
    } else {
      sound.playGentleBoing();
    }
  };

  const handleNextScenario = () => {
    sound.playPop();
    setScenarioIndex((prev) => (prev + 1) % DIWAN_SCENARIOS.length);
    setSelectedOption(null);
    setIsAnswered(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4 sm:p-6 bg-gradient-to-br from-teal-900 via-emerald-950 to-slate-900 rounded-3xl text-white shadow-2xl border-2 border-teal-500/40">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20">
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-400/20 text-teal-300 text-xs font-bold uppercase tracking-wider">
            <Scroll className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'ديوان الأدب والحكمة' : 'Diwan: Quête de Sagesse 📜'}</span>
          </div>
          <h2 className="text-2xl font-black font-['Fredoka']">
            {lang === 'ar' ? 'حوارات الحكماء والأمثال العربية' : 'Dialogue & Sagesse Arabe'}
          </h2>
          <p className="text-xs text-teal-200">
            {lang === 'ar'
              ? 'تحدث إلى حكماء الواحة، اختر الردود البليغة، واجمع حكم العرب وأمثالهم الخالدة.'
              : 'Échange avec les sages de l’académie, choisis les bonnes réponses et débloque de précieux proverbes.'}
          </p>
        </div>
      </div>

      {/* NPC Dialogue Box */}
      <div className="p-8 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 space-y-6">
        <div className="flex items-center gap-4">
          <span className="text-5xl p-4 rounded-3xl bg-teal-500/20 border border-teal-400/30">
            {scenario.npcAvatar}
          </span>
          <div>
            <div className="text-xs font-bold text-teal-300 uppercase tracking-widest">
              {scenario.npcName[lang === 'ar' ? 'ar' : 'fr']}
            </div>
            <p className="text-lg md:text-xl font-bold text-white mt-1">
              {scenario.dialogue[lang === 'ar' ? 'ar' : 'fr']}
            </p>
          </div>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          {scenario.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            return (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleChooseOption(idx, opt.isCorrect)}
                className={`p-5 rounded-3xl border-2 transition-all text-left flex flex-col justify-between cursor-pointer ${
                  isAnswered
                    ? opt.isCorrect
                      ? 'bg-emerald-950/60 border-emerald-400'
                      : isSelected
                      ? 'bg-rose-950/60 border-rose-400'
                      : 'bg-white/5 border-white/10 opacity-50'
                    : 'bg-white/5 border-white/10 hover:border-teal-400'
                }`}
              >
                <span className="text-sm font-semibold text-slate-100">
                  {opt.text[lang === 'ar' ? 'ar' : 'fr']}
                </span>
                {isAnswered && isSelected && (
                  <span className="text-xs mt-3 pt-2 border-t border-white/10 text-amber-300 font-medium">
                    {opt.feedback[lang === 'ar' ? 'ar' : 'fr']}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>

        {isAnswered && (
          <div className="flex justify-end pt-4">
            <button
              onClick={handleNextScenario}
              className="px-6 py-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs shadow-lg transition-all cursor-pointer flex items-center gap-2"
            >
              <span>{lang === 'ar' ? 'الحكيم التالي' : 'Prochain Sage'}</span>
              <span>→</span>
            </button>
          </div>
        )}
      </div>

      {/* Unlocked Proverbs Scroll */}
      {unlockedProverbs.length > 0 && (
        <div className="p-5 rounded-3xl bg-amber-500/10 border border-amber-400/30 space-y-3">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
            <Award className="w-4 h-4" />
            <span>{lang === 'ar' ? 'حكم وأمثال تم جمعها' : 'Proverbes & Sagesses Collectés'}</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {unlockedProverbs.map((prov, i) => (
              <span key={i} className="px-4 py-2 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-200 text-sm font-['Amiri'] font-bold" dir="rtl">
                {prov}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
