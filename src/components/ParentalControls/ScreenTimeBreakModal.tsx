import React from 'react';
import { Language } from '../../types';
import { sound } from '../../utils/soundEngine';
import { Clock, Heart, Sparkles, Moon } from 'lucide-react';

interface ScreenTimeBreakModalProps {
  isOpen: boolean;
  onExtend: () => void;
  lang: Language;
}

export const ScreenTimeBreakModal: React.FC<ScreenTimeBreakModalProps> = ({
  isOpen,
  onExtend,
  lang,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-md w-full shadow-2xl border-4 border-amber-400 text-center space-y-5">
        {/* Calming Breathing Animation Ring */}
        <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-amber-400/30 animate-ping" style={{ animationDuration: '3s' }} />
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-orange-400 text-white flex items-center justify-center text-3xl shadow-lg">
            <Moon className="w-10 h-10" />
          </div>
        </div>

        <div>
          <span className="text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 block mb-1">
            {lang === 'ar' ? 'استراحة الأبطال الصغار' : 'C’est l’heure de la pause !'}
          </span>
          <h3 className="text-2xl font-black text-slate-800 dark:text-white font-['Fredoka']">
            {lang === 'ar' ? 'أحسنت صنعاً اليوم !' : 'Tu as bien travaillé aujourd’hui !'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
            {lang === 'ar'
              ? 'حان وقت إراحة عينيك وشرب كأس ماء عذب. نلتقي قريباً في مغامرة جديدة مع مريم وابنها !'
              : 'Repose tes yeux quelques instants, étire tes bras et bois un bon verre d’eau fraîche. À très bientôt pour de nouvelles aventures !'}
          </p>
        </div>

        {/* Parent Option to extend */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
          <button
            onClick={() => {
              sound.playPop();
              onExtend();
            }}
            className="w-full py-2.5 rounded-xl bg-amber-50 dark:bg-slate-800 text-amber-700 dark:text-amber-300 text-xs font-bold hover:bg-amber-100 transition-colors cursor-pointer"
          >
            {lang === 'ar' ? 'تمديد 15 دقيقة إضافية (بإذن الوالدين)' : 'Accorder 15 minutes de plus (Parent)'}
          </button>
        </div>
      </div>
    </div>
  );
};
