import React, { useState } from 'react';
import { ArabicLetter, Language } from '../../types';
import { sound } from '../../utils/soundEngine';
import { LetterTracingCanvas } from './LetterTracingCanvas';
import { Volume2, Award, CheckCircle2, PenTool, BookOpen, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LetterDetailModalProps {
  letter: ArabicLetter;
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  isMastered: boolean;
  onToggleMaster: (letterId: string) => void;
}

export const LetterDetailModal: React.FC<LetterDetailModalProps> = ({
  letter,
  isOpen,
  onClose,
  lang,
  isMastered,
  onToggleMaster,
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'trace'>('details');

  if (!isOpen) return null;

  const handlePlaySound = (text: string) => {
    sound.playPop();
    sound.speakArabic(text);
  };

  const handleMasterClick = () => {
    sound.playCelebrationFanfare();
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
    });
    onToggleMaster(letter.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl border-4 border-amber-400 max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playPop();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Hero */}
        <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="relative group">
            <button
              onClick={() => handlePlaySound(letter.letter)}
              className="w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center text-6xl font-['Amiri'] font-bold shadow-lg shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              title="Cliquer pour écouter"
            >
              {letter.letter}
            </button>
            <span className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-white dark:bg-slate-800 text-amber-600 shadow-md">
              <Volume2 className="w-4 h-4 animate-pulse" />
            </span>
          </div>

          <div className="text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
              <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                Lettre {letter.arabicName}
              </span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Translit. : {letter.transliteration}
              </span>
            </div>
            <h2 className="text-3xl font-black text-slate-800 dark:text-white font-['Fredoka']">
              {letter.name}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              {letter.soundDescription[lang]}
            </p>
            <p className="text-xs font-medium text-amber-600 dark:text-amber-400 mt-1">
              💡 {letter.phoneticTip[lang]}
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 my-5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
          <button
            onClick={() => {
              sound.playPop();
              setActiveTab('details');
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'details'
                ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{lang === 'ar' ? 'أشكال الحرف والكلمات' : lang === 'en' ? 'Forms & Vocabulary' : 'Les 4 Formes & Vocabulaire'}</span>
          </button>
          <button
            onClick={() => {
              sound.playPop();
              setActiveTab('trace');
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'trace'
                ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            <PenTool className="w-4 h-4" />
            <span>{lang === 'ar' ? 'أتمرن على الكتابة' : lang === 'en' ? 'Letter Tracing Studio' : "Atelier de Tracé au Doigt"}</span>
          </button>
        </div>

        {/* Tab 1: 4 Forms & Example Word */}
        {activeTab === 'details' ? (
          <div className="space-y-6">
            {/* The 4 Forms */}
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                {lang === 'ar' ? 'أشكال الحرف بحسب موقعه في الكلمة' : 'Les 4 formes selon la position :'}
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Isolée / منفصل', form: letter.forms.isolated },
                  { label: 'Début / في البداية', form: letter.forms.initial },
                  { label: 'Milieu / في الوسط', form: letter.forms.medial },
                  { label: 'Fin / في النهاية', form: letter.forms.final },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePlaySound(item.form)}
                    className="flex flex-col items-center justify-center p-3 rounded-2xl bg-amber-50/60 dark:bg-slate-800/80 border border-amber-200 dark:border-slate-700 hover:border-amber-400 transition-all cursor-pointer group shadow-xs"
                  >
                    <span className="text-4xl font-bold text-amber-600 dark:text-amber-400 font-['Amiri'] group-hover:scale-110 transition-transform">
                      {item.form}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-2">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Example Word Card */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-amber-100/70 to-orange-100/70 dark:from-slate-800 dark:to-slate-800 border border-amber-300 dark:border-slate-700">
              <div className="flex items-center gap-4">
                <span className="text-5xl">{letter.exampleWord.emoji}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-3xl font-bold text-slate-800 dark:text-white font-['Amiri']"
                      dir="rtl"
                    >
                      {letter.exampleWord.arabic}
                    </span>
                    <button
                      onClick={() => handlePlaySound(letter.exampleWord.arabic)}
                      className="p-1.5 rounded-full bg-amber-500 text-white shadow-xs hover:scale-110 transition-transform"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    {letter.exampleWord.transliteration} = {letter.exampleWord.meaning[lang]}
                  </div>
                </div>
              </div>

              <div className="hidden sm:block text-right text-xs text-amber-700 dark:text-amber-400 font-bold">
                ⭐ Mot Illustré
              </div>
            </div>
          </div>
        ) : (
          <LetterTracingCanvas
            letter={letter}
            lang={lang}
            onComplete={() => {
              if (!isMastered) onToggleMaster(letter.id);
            }}
          />
        )}

        {/* Footer Master Button */}
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {isMastered ? (
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Lettre maîtrisée !
              </span>
            ) : (
              <span>Entraîne-toi pour valider cette lettre</span>
            )}
          </div>

          <button
            onClick={handleMasterClick}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-xs transition-all shadow-md cursor-pointer ${
              isMastered
                ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-500/20'
                : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:scale-105 active:scale-95 shadow-amber-500/20'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>
              {isMastered
                ? (lang === 'ar' ? 'تم إتقان الحرف بنجاح' : 'Lettre maîtrisée ✓')
                : (lang === 'ar' ? 'وضع علامة إتقان (+20 ⭐)' : 'Marquer comme appris (+20 ⭐)')}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
