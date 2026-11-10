import React, { useState } from 'react';
import { Badge, StudentProfile, Language } from '../../types';
import { sound } from '../../utils/soundEngine';
import { Share2, Copy, Check, MessageCircle, X, Sparkles, Heart } from 'lucide-react';

interface SocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  student: StudentProfile;
  badge?: Badge | null;
}

export const SocialShareModal: React.FC<SocialShareModalProps> = ({
  isOpen,
  onClose,
  lang,
  student,
  badge,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const shareTitle = badge
    ? `🏆 ${student.name} vient de débloquer le badge "${badge.title[lang] || badge.title.fr}" sur NoorKids !`
    : `🌟 Félicitations à ${student.name} pour ses progrès sur NoorKids Arabe & Coran !`;

  const shareMessage = `🌟 ${shareTitle}
📚 Lettres apprises : ${student.masteredLetters.length}/28
📖 Sourates mémorisées : ${student.completedSurahs.length}
⭐ Étoiles gagnées : ${student.stars}
🔥 Série d'apprentissage : ${student.dailyStreak} jours consécutifs !
✨ Application créée avec amour par Maryam et son fils pour les petits savants.`;

  const handleCopy = async () => {
    sound.playStarChime();
    try {
      await navigator.clipboard.writeText(shareMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {}
  };

  const handleNativeShare = async () => {
    sound.playPop();
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Réussite NoorKids',
          text: shareMessage,
          url: window.location.href,
        });
      } catch {}
    } else {
      handleCopy();
    }
  };

  const handleWhatsAppShare = () => {
    sound.playPop();
    const url = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border-4 border-amber-400 relative">
        <button
          onClick={() => {
            sound.playPop();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center mx-auto text-2xl shadow-sm mb-2">
            <Share2 className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-black text-slate-800 dark:text-white font-['Fredoka']">
            {lang === 'ar' ? 'مشاركة الإنجاز مع العائلة' : 'Partager la Réussite avec la Famille'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Partagez ce beau moment avec les parents, grands-parents ou proches !
          </p>
        </div>

        {/* Milestone Preview Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-800 border-2 border-amber-300 dark:border-slate-700 text-center mb-5">
          <span className="text-4xl block mb-2">{badge ? badge.icon : '🎓'}</span>
          <h4 className="font-black text-slate-800 dark:text-white text-base">
            {badge ? badge.title[lang] || badge.title.fr : student.name}
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
            {badge ? badge.description[lang] || badge.description.fr : `${student.stars} Étoiles · ${student.masteredLetters.length} Lettres`}
          </p>
          <div className="mt-3 pt-2 border-t border-amber-200 dark:border-slate-700 text-[11px] font-bold text-amber-700 dark:text-amber-400 flex items-center justify-center gap-1">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>Fierté de Maryam et son fils</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={handleWhatsAppShare}
            className="w-full py-3 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Partager sur WhatsApp</span>
          </button>

          <button
            onClick={handleCopy}
            className="w-full py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Message copié !' : 'Copier le texte du message'}</span>
          </button>

          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              onClick={handleNativeShare}
              className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Plus d’options de partage</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
