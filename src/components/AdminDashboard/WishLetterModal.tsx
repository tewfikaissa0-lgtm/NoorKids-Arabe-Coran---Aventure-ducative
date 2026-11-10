import React, { useState } from 'react';
import { sound } from '../../utils/soundEngine';
import { Sparkles, Heart, Send } from 'lucide-react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';

interface WishLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
}

export interface WishLetter {
  id: string;
  studentName: string;
  message: string;
  timestamp: string;
  status: 'Reçu' | 'Répondu' | 'Lu';
}

export const loadWishLetters = (): WishLetter[] => {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem('noorkids_wish_letters_v1');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  }
  return [
    {
      id: 'wish-1',
      studentName: 'Amine',
      message: 'Je souhaite que vous ajoutiez un niveau spécial sur l\'histoire du Prophète Ibrahim !',
      timestamp: '2026-11-09 14:30',
      status: 'Reçu',
    },
    {
      id: 'wish-2',
      studentName: 'Sarah',
      message: 'J\'adore cette application, merci Maryam et son fils pour ces superbes jeux coraniques !',
      timestamp: '2026-11-09 16:15',
      status: 'Répondu',
    },
  ];
};

export const saveWishLetters = (letters: WishLetter[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('noorkids_wish_letters_v1', JSON.stringify(letters));
};

export const WishLetterModal: React.FC<WishLetterModalProps> = ({ isOpen, onClose, studentName }) => {
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    sound.playCelebrationFanfare();
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });

    const newWish: WishLetter = {
      id: `wish-${Date.now()}`,
      studentName: studentName || 'Petit Savant',
      message: message.trim(),
      timestamp: new Date().toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }),
      status: 'Reçu',
    };

    const existing = loadWishLetters();
    saveWishLetters([newWish, ...existing]);

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setMessage('');
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border-4 border-amber-400 relative overflow-hidden space-y-6"
      >
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💌</span>
            <h3 className="text-xl font-black font-['Fredoka']">
              Boîte à Souhaits & Rêves
            </h3>
          </div>
          <button
            onClick={() => {
              sound.playPop();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 font-bold"
          >
            ✕
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="text-5xl animate-bounce">✨📬✨</div>
            <h4 className="text-lg font-bold text-amber-600 font-['Fredoka']">
              Souhait bien reçu par Maryam et son fils !
            </h4>
            <p className="text-xs text-slate-500">
              Ton message a été transmis avec succès dans la boîte secrète du créateur.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Envoie un vœu, une idée de jeu ou un rêve directement au créateur de NoorKids (Maryam et son fils) !
            </p>

            <textarea
              rows={4}
              placeholder="Écris ton vœu ou ton idée magique ici..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800 dark:text-white"
            />

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-sm shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Envoyer mon Vœu au Créateur 🌟</span>
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};
