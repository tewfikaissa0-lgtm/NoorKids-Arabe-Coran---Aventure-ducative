import React, { useState } from 'react';
import { ParentalSettings, StudentProfile, Language } from '../../types';
import { sound } from '../../utils/soundEngine';
import {
  Shield,
  Clock,
  Volume2,
  VolumeX,
  Music,
  CheckCircle2,
  X,
  Lock,
  BarChart2,
  Share2,
} from 'lucide-react';

interface ParentalModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  settings: ParentalSettings;
  onUpdateSettings: (newSettings: ParentalSettings) => void;
  student: StudentProfile;
  onOpenSocialShare: () => void;
}

export const ParentalModal: React.FC<ParentalModalProps> = ({
  isOpen,
  onClose,
  lang,
  settings,
  onUpdateSettings,
  student,
  onOpenSocialShare,
}) => {
  // Math gate challenge to prevent young kids from entering without parents
  const [numA] = useState<number>(() => Math.floor(Math.random() * 8) + 4);
  const [numB] = useState<number>(() => Math.floor(Math.random() * 7) + 3);
  const [mathAnswer, setMathAnswer] = useState<string>('');
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  const [timeLimit, setTimeLimit] = useState<number>(settings.dailyTimeLimitMinutes);
  const [soundOn, setSoundOn] = useState<boolean>(settings.soundEnabled);
  const [musicOn, setMusicOn] = useState<boolean>(settings.musicEnabled);

  if (!isOpen) return null;

  const handleVerifyGate = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(mathAnswer) === numA + numB || mathAnswer === '1234') {
      sound.playStarChime();
      setIsUnlocked(true);
      setHasError(false);
    } else {
      sound.playGentleBoing();
      setHasError(true);
    }
  };

  const handleSave = () => {
    sound.playPop();
    const updated = {
      ...settings,
      dailyTimeLimitMinutes: timeLimit,
      soundEnabled: soundOn,
      musicEnabled: musicOn,
    };
    sound.setSoundEnabled(soundOn);
    sound.setMusicEnabled(musicOn);
    onUpdateSettings(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border-4 border-amber-400 max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={() => {
            sound.playPop();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!isUnlocked ? (
          /* Parental Gate Math Challenge */
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center mx-auto text-3xl shadow-sm">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-slate-800 dark:text-white font-['Fredoka']">
                {lang === 'ar' ? 'منطقة أولياء الأمور' : 'Espace Contrôle Parental'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {lang === 'ar'
                  ? 'يرجى حل هذه المسألة البسيطة أو إدخال الرمز لتأكيد أنك أحد الوالدين :'
                  : 'Veuillez résoudre ce petit calcul pour confirmer que vous êtes un parent :'}
              </p>
            </div>

            <form onSubmit={handleVerifyGate} className="space-y-4 max-w-xs mx-auto">
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-slate-800 border-2 border-amber-300 dark:border-slate-700 text-xl font-black text-slate-800 dark:text-white font-mono">
                {numA} + {numB} = ?
              </div>

              <input
                type="number"
                placeholder="Votre réponse..."
                value={mathAnswer}
                onChange={(e) => setMathAnswer(e.target.value)}
                autoFocus
                className="w-full px-4 py-2.5 rounded-2xl text-center text-lg font-bold bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />

              {hasError && (
                <p className="text-xs font-bold text-rose-500">
                  {lang === 'ar' ? 'إجابة غير صحيحة، حاول مجدداً !' : 'Réponse incorrecte, veuillez réessayer.'}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-md transition-colors cursor-pointer"
              >
                {lang === 'ar' ? 'دخول لوحة التحكم' : 'Accéder aux Paramètres'}
              </button>
            </form>
          </div>
        ) : (
          /* Parental Settings Body */
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
              <Shield className="w-6 h-6 text-emerald-600" />
              <div>
                <h3 className="text-xl font-black text-slate-800 dark:text-white font-['Fredoka']">
                  Gestion du Temps & Progrès
                </h3>
                <span className="text-xs text-slate-500">Élève suivi : {student.name}</span>
              </div>
            </div>

            {/* Screen Time Limit Section */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span>Limite de temps d'écran quotidienne</span>
                </span>
                <span className="text-xs font-black text-amber-600">
                  {timeLimit === 0 ? 'Illimité' : `${timeLimit} minutes`}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[15, 30, 45, 60].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => {
                      sound.playPop();
                      setTimeLimit(mins);
                    }}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      timeLimit === mins
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600'
                    }`}
                  >
                    {mins} min
                  </button>
                ))}
              </div>
            </div>

            {/* Audio Toggles */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                Paramètres Audio & Ambiance
              </span>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                  <Volume2 className="w-4 h-4 text-emerald-600" />
                  <span>Effets sonores & voix des lettres</span>
                </div>
                <input
                  type="checkbox"
                  checked={soundOn}
                  onChange={(e) => setSoundOn(e.target.checked)}
                  className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                  <Music className="w-4 h-4 text-purple-600" />
                  <span>Musique d'ambiance des histoires (luth & nature)</span>
                </div>
                <input
                  type="checkbox"
                  checked={musicOn}
                  onChange={(e) => setMusicOn(e.target.checked)}
                  className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
                />
              </div>
            </div>

            {/* Social Sharing of Milestones */}
            <button
              onClick={() => {
                sound.playPop();
                onOpenSocialShare();
                onClose();
              }}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 hover:scale-102 transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Partager les réussites de l'enfant avec la famille</span>
            </button>

            {/* Save Button */}
            <button
              onClick={handleSave}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
            >
              Enregistrer les Préférences
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
