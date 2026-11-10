/**
 * CSS-based Celebration Overlay with Confetti & Human Praise Trigger
 * Created with love for Maryam et son fils
 */

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/soundEngine';
import { Trophy, Sparkles, Star } from 'lucide-react';
import { Language } from '../../types';

interface CelebrationOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  title?: string;
  subtitle?: string;
  starsEarned?: number;
  gemsEarned?: number;
}

export const CelebrationOverlay: React.FC<CelebrationOverlayProps> = ({
  isOpen,
  onClose,
  lang,
  title,
  subtitle,
  starsEarned = 25,
  gemsEarned = 3,
}) => {
  useEffect(() => {
    if (isOpen) {
      sound.playCelebrationFanfare();

      // Grand confetti burst
      const duration = 2.5 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6'],
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6'],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 rounded-3xl p-8 max-w-md w-full text-white shadow-2xl border-4 border-white text-center animate-bounce duration-1000">
        {/* Floating sparkles background */}
        <div className="absolute -top-6 -left-6 text-4xl animate-spin" style={{ animationDuration: '6s' }}>✨</div>
        <div className="absolute -top-4 -right-6 text-4xl animate-bounce">⭐</div>
        <div className="absolute -bottom-4 left-6 text-4xl animate-pulse">🌟</div>

        <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto text-4xl shadow-lg border-2 border-white/60 mb-4">
          <Trophy className="w-12 h-12 text-yellow-200 animate-pulse" />
        </div>

        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/30 text-white font-black text-xs uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          {lang === 'ar' ? 'إنجاز عظيم وبطولي !' : 'Victoire Éclatante !'}
        </span>

        <h2 className="text-3xl font-black font-['Fredoka'] mb-2 drop-shadow-md">
          {title || (lang === 'ar' ? 'أحسنت يا بطل !' : 'Bravo Champion !')}
        </h2>

        <p className="text-xs sm:text-sm text-amber-100 mb-6 font-medium">
          {subtitle ||
            (lang === 'ar'
              ? 'لقد أتممت التحدي بنجاح باهر وأضفت مكافآت جديدة إلى رصيدك !'
              : "Tu as accompli ce défi avec brio ! Continue sur cette lancée magique.")}
        </p>

        {/* Reward pills */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/20 backdrop-blur-md border border-white/40 shadow-inner">
            <span className="text-2xl">⭐</span>
            <div className="text-left">
              <div className="text-[10px] font-bold text-amber-100 uppercase">Étoiles</div>
              <div className="text-lg font-black">+{starsEarned}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/20 backdrop-blur-md border border-white/40 shadow-inner">
            <span className="text-2xl">💎</span>
            <div className="text-left">
              <div className="text-[10px] font-bold text-amber-100 uppercase">Diamants</div>
              <div className="text-lg font-black">+{gemsEarned}</div>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playPop();
            onClose();
          }}
          className="w-full py-3.5 rounded-2xl bg-white text-orange-600 font-black text-sm shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer font-['Fredoka']"
        >
          {lang === 'ar' ? 'متابعة المغامرة 🚀' : 'Continuer l’Aventure 🚀'}
        </button>
      </div>
    </div>
  );
};
