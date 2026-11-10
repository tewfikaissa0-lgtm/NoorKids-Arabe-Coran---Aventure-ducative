import React from 'react';
import { Badge, Language } from '../../types';
import { ALL_BADGES } from '../../utils/storage';
import { sound } from '../../utils/soundEngine';
import { Award, Lock, CheckCircle2, X, Share2 } from 'lucide-react';

interface BadgesModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  unlockedBadgeIds: string[];
  onOpenShare: (badge: Badge) => void;
}

export const BadgesModal: React.FC<BadgesModalProps> = ({
  isOpen,
  onClose,
  lang,
  unlockedBadgeIds,
  onOpenShare,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl border-4 border-amber-400 max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={() => {
            sound.playPop();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center mx-auto text-2xl shadow-sm mb-2">
            <Award className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-black text-slate-800 dark:text-white font-['Fredoka']">
            {lang === 'ar' ? 'أوسمة الإنجاز والتميز' : 'Les Badges de Réussite'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {unlockedBadgeIds.length} / {ALL_BADGES.length} badges débloqués dans ton aventure !
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {ALL_BADGES.map((badge) => {
            const isUnlocked = unlockedBadgeIds.includes(badge.id);
            return (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border-2 transition-all flex items-start gap-3.5 ${
                  isUnlocked
                    ? 'border-amber-400 bg-amber-50/60 dark:bg-amber-950/30 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 opacity-60'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-xs ${
                    isUnlocked ? 'bg-amber-400 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                  }`}
                >
                  {isUnlocked ? badge.icon : <Lock className="w-5 h-5" />}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-white font-['Fredoka']">
                      {badge.title[lang] || badge.title.fr}
                    </h4>
                    {isUnlocked && (
                      <button
                        onClick={() => {
                          sound.playPop();
                          onOpenShare(badge);
                        }}
                        className="text-amber-600 hover:text-amber-800 p-1"
                        title="Partager ce badge"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-snug">
                    {badge.description[lang] || badge.description.fr}
                  </p>

                  <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 mt-1.5 block">
                    Condition : {badge.requirement}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
