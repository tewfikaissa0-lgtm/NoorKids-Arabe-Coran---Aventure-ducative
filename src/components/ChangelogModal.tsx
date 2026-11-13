import React from 'react';
import { sound } from '../utils/soundEngine';
import { Sparkles, X, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Language } from '../types';

interface ChangelogModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  version: string;
}

export const ChangelogModal: React.FC<ChangelogModalProps> = ({ isOpen, onClose, lang, version }) => {
  if (!isOpen) return null;

  const changes = [
    "Ajout des rôles officiels 👑 Admin et 👑✨ Créateur visibles par tous les joueurs.",
    "Option de sélection du genre (Garçon 👦 / Fille 👧) lors de la création d'un profil.",
    "Boîte à Souhaits interactive pour envoyer des rêves directement à Maryam et son fils.",
    "Multiplicateurs de points instantanés (2x jusqu'à 1000x) dans le panneau créateur.",
    "Verrouillage automatique de l'application à l'expiration du minuteur de maintenance.",
    "Optimisation de Noor IA pour des réponses ultrarapides et bienveillantes.",
    "Serveurs Beta globaux avec indicateurs de ping en temps réel (Paris, New York, Dubai, Singapour).",
    "Amélioration de la suppression et de la gestion des élèves dans le roster.",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border-4 border-amber-400 relative overflow-hidden space-y-6"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🚀</span>
            <div>
              <h3 className="text-xl font-black font-['Fredoka']">
                Notes de Version ({version})
              </h3>
              <span className="text-xs text-amber-600 dark:text-amber-400 font-bold">
                NoorKids Arabe & Coran · Maryam et son fils
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playPop();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 font-bold cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
          {changes.map((change, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 rounded-2xl bg-amber-50/60 dark:bg-slate-800 border border-amber-200 dark:border-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <p className="text-xs font-medium text-slate-700 dark:text-slate-200">
                {change}
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            sound.playStarChime();
            onClose();
          }}
          className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-sm shadow-xl transition-all cursor-pointer"
        >
          C'est parti ! ✨
        </button>
      </motion.div>
    </div>
  );
};
