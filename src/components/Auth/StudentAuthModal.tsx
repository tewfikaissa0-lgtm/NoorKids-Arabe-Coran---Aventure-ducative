import React, { useState } from 'react';
import { Language, StudentProfile } from '../../types';
import { sound } from '../../utils/soundEngine';
import { KeyRound, UserPlus, Copy, Check, Sparkles, X, Shield, User } from 'lucide-react';
import confetti from 'canvas-confetti';

interface StudentAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  currentStudent: StudentProfile;
  roster: StudentProfile[];
  onSelectStudent: (student: StudentProfile) => void;
  onAddStudent: (name: string, level: StudentProfile['level'], gender: 'boy' | 'girl', avatar: string) => void;
}

export const StudentAuthModal: React.FC<StudentAuthModalProps> = ({
  isOpen,
  onClose,
  lang,
  currentStudent,
  roster,
  onSelectStudent,
  onAddStudent,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'login' | 'register'>('profile');
  const [loginIdInput, setLoginIdInput] = useState<string>('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // New student self-registration state
  const [regName, setRegName] = useState<string>('');
  const [regGender, setRegGender] = useState<'boy' | 'girl'>('boy');
  const [regAvatar, setRegAvatar] = useState<string>('🦁');
  const [regLevel, setRegLevel] = useState<StudentProfile['level']>('Débutant');
  const [copiedId, setCopiedId] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleLoginById = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = loginIdInput.trim().toUpperCase();
    const found = roster.find((s) => s.id.toUpperCase() === cleanId);

    if (found) {
      if ((found as any).isBanned) {
        setLoginError("Ce compte est banni pour tricherie !");
        sound.playGentleBoing();
        return;
      }
      sound.playCelebrationFanfare();
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      onSelectStudent(found);
      onClose();
    } else {
      sound.playGentleBoing();
      setLoginError(lang === 'ar' ? 'رقم المعرف غير موجود!' : 'ID unique introuvable ! Vérifie ton code.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim()) return;

    sound.playCelebrationFanfare();
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });

    onAddStudent(regName.trim(), regLevel, regGender, regAvatar);
    setRegName('');
    onClose();
  };

  const handleCopyId = () => {
    sound.playPop();
    navigator.clipboard.writeText(currentStudent.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-2 border-amber-300 dark:border-slate-800 space-y-6 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/30 text-2xl">
              🔑
            </div>
            <div>
              <h2 className="text-xl font-black font-['Fredoka'] text-slate-900 dark:text-white">
                {lang === 'ar' ? 'إدارة الهوية والملف الشخصي' : 'Profil & Connexion par ID'}
              </h2>
              <p className="text-xs text-slate-500">
                {lang === 'ar' ? 'قم بتوصيل ملفك الشخصي عبر رقم المعرف الفريد' : 'Accède à ta progression sécurisée'}
              </p>
            </div>
          </div>
          <button
            onClick={() => { sound.playPop(); onClose(); }}
            className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl">
          <button
            onClick={() => { sound.playPop(); setActiveTab('profile'); }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'profile' ? 'bg-amber-500 text-slate-950 shadow-md font-black' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Mon ID 🏷️
          </button>
          <button
            onClick={() => { sound.playPop(); setActiveTab('login'); }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'login' ? 'bg-amber-500 text-slate-950 shadow-md font-black' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Connexion ID 🔑
          </button>
          <button
            onClick={() => { sound.playPop(); setActiveTab('register'); }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'register' ? 'bg-amber-500 text-slate-950 shadow-md font-black' : 'text-slate-600 dark:text-slate-300'
            }`}
          >
            Créer Profil ✨
          </button>
        </div>

        {/* Tab 1: Current Profile & ID */}
        {activeTab === 'profile' && (
          <div className="space-y-4 text-center py-4">
            <div className="w-20 h-20 rounded-3xl bg-amber-100 dark:bg-amber-950 text-4xl flex items-center justify-center mx-auto shadow-inner border-2 border-amber-300">
              {currentStudent.equippedItem || currentStudent.avatar}
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-900 dark:text-white font-['Fredoka']">
                {currentStudent.name}
              </h3>
              <p className="text-xs text-slate-500">{currentStudent.level} · 🌟 {currentStudent.stars} ⭐</p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-2">
              <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 block">
                TON IDENTIFIANT UNIQUE (ID) :
              </span>
              <div className="flex items-center justify-center gap-3">
                <code className="text-lg font-black font-mono bg-white dark:bg-slate-900 px-4 py-1.5 rounded-xl border border-amber-300 text-amber-600 dark:text-amber-400">
                  {currentStudent.id}
                </code>
                <button
                  onClick={handleCopyId}
                  className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md flex items-center gap-1 cursor-pointer"
                >
                  {copiedId ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedId ? 'Copié !' : 'Copier'}</span>
                </button>
              </div>
              <p className="text-[10px] text-slate-500">
                Note bien cet ID pour te reconnecter à ton profil depuis n'importe quel appareil !
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Login by ID */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginById} className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Entre ton identifiant unique (ex: NOOR-XXXXXX) :
              </label>
              <input
                type="text"
                placeholder="NOOR-123456"
                value={loginIdInput}
                onChange={(e) => setLoginIdInput(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm font-mono font-bold text-slate-900 dark:text-white uppercase"
              />
              {loginError && <p className="text-xs text-rose-600 font-bold">{loginError}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg cursor-pointer"
            >
              Se connecter avec mon ID 🚀
            </button>
          </form>
        )}

        {/* Tab 3: Self-Registration */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4 py-2">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Ton Nom :
              </label>
              <input
                type="text"
                placeholder="Ex: Amina ou Adam..."
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Genre :
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setRegGender('boy')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold ${
                    regGender === 'boy' ? 'bg-sky-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700'
                  }`}
                >
                  👦 Garçon
                </button>
                <button
                  type="button"
                  onClick={() => setRegGender('girl')}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold ${
                    regGender === 'girl' ? 'bg-pink-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700'
                  }`}
                >
                  👧 Fille
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Choisis ton avatar :
              </label>
              <div className="grid grid-cols-8 gap-1.5 bg-slate-100 dark:bg-slate-800 p-2 rounded-xl">
                {['🦁', '🐯', '🐼', '🦊', '🐰', '🐨', '🦄', '🦖', '🦉', '🐱', '🐶', '🐢', '👦', '👧', '👶', '🧑‍🎓'].map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => setRegAvatar(av)}
                    className={`w-8 h-8 rounded-lg text-lg flex items-center justify-center transition-all cursor-pointer ${
                      regAvatar === av ? 'bg-amber-500 text-white scale-110 shadow-sm' : 'hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Niveau de départ :
              </label>
              <div className="flex items-center gap-2">
                {(['Débutant', 'Intermédiaire', 'Petit Savant'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setRegLevel(lvl)}
                    className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold ${
                      regLevel === lvl ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-lg cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Créer mon profil (Offre 1000 ⭐ & 200 💎)</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
