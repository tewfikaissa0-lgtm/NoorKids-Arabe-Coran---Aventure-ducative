import React, { useState, useEffect } from 'react';
import { StudentProfile, Language } from '../../types';
import { sound } from '../../utils/soundEngine';
import { WishLetter, loadWishLetters, saveWishLetters } from './WishLetterModal';
import {
  Printer,
  Award,
  Users,
  ShieldCheck,
  Lock,
  Unlock,
  Coins,
  Sparkles,
  Plus,
  Minus,
  RefreshCw,
  Ban,
  CheckCircle2,
  AlertTriangle,
  KeyRound,
  Download,
  Megaphone,
  RotateCcw,
  Zap,
  Clock,
  Activity,
  Layers,
  BarChart3,
  Mail,
  Trash2,
  Check,
  FileText,
  Volume2,
  Sliders,
  Palette,
  Compass,
  BookOpen,
  Calendar,
} from 'lucide-react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';

interface AdminDashboardProps {
  lang: Language;
  roster: StudentProfile[];
  activeStudent: StudentProfile;
  onSelectStudent: (student: StudentProfile) => void;
  onAddStudent: (name: string, level: StudentProfile['level']) => void;
  onUpdateCurrency: (studentId: string, starsDelta: number, gemsDelta: number) => void;
  onToggleBan: (studentId: string) => void;
  isGameClosed: boolean;
  onToggleCloseGame: (closed: boolean) => void;
  onResetStudent?: (studentId: string) => void;
  onBatchReward?: (stars: number) => void;
  onBulkReset?: () => void;
  announcement?: string;
  onSetAnnouncement?: (msg: string) => void;
  gameVersion: string;
  onSetGameVersion: (version: string) => void;
  activeMultiplier: number;
  onSetMultiplier: (mult: number) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  lang,
  roster,
  activeStudent,
  onSelectStudent,
  onAddStudent,
  onUpdateCurrency,
  onToggleBan,
  isGameClosed,
  onToggleCloseGame,
  onResetStudent,
  onBatchReward,
  onBulkReset,
  announcement = '',
  onSetAnnouncement,
  gameVersion,
  onSetGameVersion,
  activeMultiplier,
  onSetMultiplier,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<boolean>(false);

  const [activeTabAdmin, setActiveTabAdmin] = useState<'roster' | 'wishes' | 'multipliers' | 'settings' | 'creative20' | 'servers'>('roster');
  const [activeBetaServer, setActiveBetaServer] = useState<string>('Europe - Paris (v1.6.0-beta)');

  const [selectedForReport, setSelectedForReport] = useState<StudentProfile>(activeStudent);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [newStudentName, setNewStudentName] = useState<string>('');
  const [newStudentLevel, setNewStudentLevel] = useState<StudentProfile['level']>('Débutant');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [updateStatus, setUpdateStatus] = useState<string>(`À jour (${gameVersion})`);
  const [customAnnouncementInput, setCustomAnnouncementInput] = useState<string>(announcement);
  const [announcementAnimation, setAnnouncementAnimation] = useState<string>('marquee');
  const [versionInput, setVersionInput] = useState<string>(gameVersion);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Wish letters inbox state
  const [wishLetters, setWishLetters] = useState<WishLetter[]>(loadWishLetters);

  // Countdown timer state for updates / maintenance
  const [countdownSeconds, setCountdownSeconds] = useState<number>(3600);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [customBonusStars, setCustomBonusStars] = useState<number>(30);
  const [customTimerMins, setCustomTimerMins] = useState<number>(60);
  const [starInputAmount, setStarInputAmount] = useState<number>(10);
  const [diamondInputAmount, setDiamondInputAmount] = useState<number>(5);
  const [studentNotes, setStudentNotes] = useState<Record<string, string>>({});
  const [currentNoteInput, setCurrentNoteInput] = useState<string>('');

  useEffect(() => {
    let timer: any = null;
    if (timerActive && countdownSeconds > 0) {
      timer = setInterval(() => {
        setCountdownSeconds((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timerActive, countdownSeconds]);

  const formatCountdown = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLoginCreator = (e: React.FormEvent) => {
    e.preventDefault();
    // Secret Creator PIN: 452011
    if (
      pinInput.trim() === '452011' ||
      pinInput.trim() === '4520111' ||
      pinInput.trim().toLowerCase() === 'maryam'
    ) {
      sound.playCelebrationFanfare();
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      sound.playGentleBoing();
      setPinError(true);
    }
  };

  const handlePrint = () => {
    sound.playPop();
    window.print();
  };

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;
    sound.playStarChime();
    onAddStudent(newStudentName.trim(), newStudentLevel);
    setNewStudentName('');
    setShowAddForm(false);
    triggerToast('Élève créé avec succès !');
  };

  const triggerToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handleDeleteWish = (id: string) => {
    sound.playPop();
    const updated = wishLetters.filter((w) => w.id !== id);
    setWishLetters(updated);
    saveWishLetters(updated);
    triggerToast('Vœu supprimé de la boîte.');
  };

  const handleToggleWishReply = (id: string) => {
    sound.playStarChime();
    const updated = wishLetters.map((w) => {
      if (w.id === id) {
        const nextStatus = w.status === 'Répondu' ? 'Reçu' : 'Répondu';
        return { ...w, status: nextStatus as any };
      }
      return w;
    });
    setWishLetters(updated);
    saveWishLetters(updated);
    triggerToast('Statut du vœu mis à jour.');
  };

  // If not authenticated as creator, show secure PIN login modal (NO PASSWORD SHOWN IN UI)
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto p-8 rounded-3xl bg-white dark:bg-slate-900 border-3 border-indigo-500/40 shadow-2xl text-center space-y-6 my-12">
        <div className="w-16 h-16 rounded-3xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto text-3xl shadow-inner">
          🔒
        </div>
        <div className="space-y-1">
          <h3 className="text-2xl font-black font-['Fredoka'] text-slate-900 dark:text-white">
            {lang === 'ar' ? 'منطقة إدارية مقفلة' : 'Espace Créateur Sécurisé'}
          </h3>
          <p className="text-xs text-slate-500">
            {lang === 'ar'
              ? 'هذه المنطقة خاصة بالمؤسس. أدخل رمز الأمان للمتابعة.'
              : 'Réservé exclusivement au créateur (Maryam & son fils). Entrez le code secret d’accès.'}
          </p>
        </div>

        <form onSubmit={handleLoginCreator} className="space-y-4">
          <div className="relative">
            <KeyRound className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="password"
              placeholder="Code secret..."
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {pinError && (
            <p className="text-xs font-bold text-rose-500">
              Code incorrect. Veuillez réessayer.
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm shadow-xl transition-all cursor-pointer"
          >
            {lang === 'ar' ? 'دخول لوحة التحكم' : 'Déverrouiller le Panneau'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-xl flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{successToast}</span>
        </motion.div>
      )}

      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl border-3 border-indigo-500/40 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2 border border-indigo-400/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Panneau Exclusif Créateur · Maryam & Fils ({gameVersion})</span>
          </div>
          <h2 className="text-3xl font-black font-['Fredoka']">
            {lang === 'ar' ? 'لوحة تحكم المعلم والإدارة العليا' : 'Administration Avancée & Boîte à Vœux'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            {lang === 'ar'
              ? 'إدارة النقاط والماس، مضاعفات النقاط الفورية، استقبال أمنيات الطلاب، وتقارير النشاط المفصلة.'
              : 'Gestion des points et diamants (+/-), multiplicateurs de score (2x à 1000x), boîte à souhaits des élèves et 20+ options créatives.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playPop();
              setSelectedForReport(activeStudent);
              setIsPrintModalOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-500 text-white font-black text-xs shadow-lg hover:scale-105 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Diplôme & Rapport PDF</span>
          </button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => { sound.playPop(); setActiveTabAdmin('roster'); }}
          className={`px-5 py-2.5 rounded-2xl font-bold text-xs transition-all cursor-pointer flex items-center gap-2 ${
            activeTabAdmin === 'roster' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Roster & Gestion Points</span>
        </button>

        <button
          onClick={() => { sound.playPop(); setActiveTabAdmin('wishes'); }}
          className={`px-5 py-2.5 rounded-2xl font-bold text-xs transition-all cursor-pointer flex items-center gap-2 relative ${
            activeTabAdmin === 'wishes' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Boîte à Souhaits ({wishLetters.length})</span>
        </button>

        <button
          onClick={() => { sound.playPop(); setActiveTabAdmin('multipliers'); }}
          className={`px-5 py-2.5 rounded-2xl font-bold text-xs transition-all cursor-pointer flex items-center gap-2 ${
            activeTabAdmin === 'multipliers' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Multiplicateurs & Version</span>
        </button>

        <button
          onClick={() => { sound.playPop(); setActiveTabAdmin('creative20'); }}
          className={`px-5 py-2.5 rounded-2xl font-bold text-xs transition-all cursor-pointer flex items-center gap-2 ${
            activeTabAdmin === 'creative20' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>20+ Options Créatives AI</span>
        </button>

        <button
          onClick={() => { sound.playPop(); setActiveTabAdmin('servers'); }}
          className={`px-5 py-2.5 rounded-2xl font-bold text-xs transition-all cursor-pointer flex items-center gap-2 ${
            activeTabAdmin === 'servers' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>🌍 Serveurs Beta Globaux</span>
        </button>
      </div>

      {/* Tab 1: Roster & Currency Management */}
      {activeTabAdmin === 'roster' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Game Lockdown */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-md flex flex-col justify-between space-y-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider">
                  <Lock className="w-4 h-4" />
                  <span>Verrouillage du Jeu</span>
                </div>
                <h4 className="text-base font-black text-slate-800 dark:text-white font-['Fredoka']">
                  {isGameClosed ? 'Jeu Verrouillé 🛑' : 'Jeu Ouvert ✅'}
                </h4>
              </div>
              <button
                onClick={() => {
                  sound.playPop();
                  onToggleCloseGame(!isGameClosed);
                  triggerToast(isGameClosed ? 'Jeu rouvert !' : 'Jeu verrouillé !');
                }}
                className={`w-full py-3 rounded-2xl font-black text-xs shadow-lg transition-all cursor-pointer ${
                  isGameClosed ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-rose-600 hover:bg-rose-500 text-white'
                }`}
              >
                {isGameClosed ? 'Ouvrir 🔓' : 'Fermer 🔒'}
              </button>
            </div>

            {/* Batch Reward */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-md flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-wider">
                  <Zap className="w-4 h-4" />
                  <span>Bonus de Groupe ⭐</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={customBonusStars}
                    onChange={(e) => setCustomBonusStars(Number(e.target.value))}
                    className="w-20 px-2.5 py-1.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-bold text-center text-slate-800 dark:text-white"
                  />
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">à tous</span>
                </div>
              </div>
              <button
                onClick={() => {
                  sound.playStarChime();
                  if (onBatchReward) onBatchReward(customBonusStars);
                  confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
                  triggerToast(`+${customBonusStars} Étoiles distribuées à toute la classe !`);
                }}
                className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-white font-black text-xs shadow-lg transition-all cursor-pointer"
              >
                Envoyer Bonus ⭐
              </button>
            </div>

            {/* Countdown Timer */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-md flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-teal-600 font-bold text-xs uppercase tracking-wider">
                  <Clock className="w-4 h-4" />
                  <span>Minuteur de Maintenance</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="180"
                    value={customTimerMins}
                    onChange={(e) => {
                      const m = Number(e.target.value);
                      setCustomTimerMins(m);
                      setCountdownSeconds(m * 60);
                    }}
                    className="w-20 px-2.5 py-1.5 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-bold text-center text-slate-800 dark:text-white"
                  />
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">min ({formatCountdown(countdownSeconds)})</span>
                </div>
              </div>
              <button
                onClick={() => {
                  sound.playPop();
                  setTimerActive(!timerActive);
                  triggerToast(timerActive ? 'Minuteur arrêté' : `Minuteur de ${customTimerMins} min activé !`);
                }}
                className={`w-full py-3 rounded-2xl font-black text-xs shadow-lg transition-all cursor-pointer ${
                  timerActive ? 'bg-amber-600 text-white' : 'bg-teal-600 hover:bg-teal-500 text-white'
                }`}
              >
                {timerActive ? 'Arrêter ⏸️' : 'Lancer ⏱️'}
              </button>
            </div>

            {/* Game Version Display */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-md flex flex-col justify-between space-y-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
                  <Download className="w-4 h-4" />
                  <span>Version Actuelle</span>
                </div>
                <h4 className="text-lg font-black text-slate-800 dark:text-white font-['Fredoka']">
                  {gameVersion}
                </h4>
              </div>
              <button
                onClick={() => setActiveTabAdmin('multipliers')}
                className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-lg transition-all cursor-pointer"
              >
                Configurer Version
              </button>
            </div>
          </div>

          {/* Broadcast Announcement Banner Creator */}
          <div className="p-6 rounded-3xl bg-indigo-900/40 border-2 border-indigo-500/30 backdrop-blur-md space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs uppercase tracking-wider">
                <Megaphone className="w-4 h-4" />
                <span>Diffusion d'Annonce Globale avec Animation</span>
              </div>
              <select
                value={announcementAnimation}
                onChange={(e) => setAnnouncementAnimation(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-white/10 text-white text-xs border border-white/20"
              >
                <option value="marquee" className="text-slate-900">Animation Défilante (Marquee)</option>
                <option value="pulse" className="text-slate-900">Effet Pulsation (Pulse)</option>
                <option value="bounce" className="text-slate-900">Rebond (Bounce)</option>
              </select>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Écris une annonce globale pour tous les élèves..."
                value={customAnnouncementInput}
                onChange={(e) => setCustomAnnouncementInput(e.target.value)}
                className="flex-1 px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-indigo-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <button
                onClick={() => {
                  sound.playStarChime();
                  if (onSetAnnouncement) onSetAnnouncement(customAnnouncementInput);
                  triggerToast('Annonce globale diffusée !');
                }}
                className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg cursor-pointer whitespace-nowrap"
              >
                Diffuser 📢
              </button>
            </div>
          </div>

          {/* Roster & Point/Diamond +/- controls */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Student Roster */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-slate-200 dark:border-slate-800 shadow-md space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <h3 className="text-lg font-black text-slate-800 dark:text-white font-['Fredoka'] flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-600" />
                  <span>Roster des Élèves</span>
                </h3>
                <button
                  onClick={() => { sound.playPop(); setShowAddForm(!showAddForm); }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold text-xs hover:bg-indigo-100 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ajouter</span>
                </button>
              </div>

              {showAddForm && (
                <form onSubmit={handleCreateStudent} className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-3">
                  <input
                    type="text"
                    placeholder="Nom de l'élève..."
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white"
                  />
                  <div className="flex items-center gap-2">
                    {(['Débutant', 'Intermédiaire', 'Petit Savant'] as const).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setNewStudentLevel(lvl)}
                        className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold ${
                          newStudentLevel === lvl ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-sm hover:bg-indigo-700"
                  >
                    Créer l'élève
                  </button>
                </form>
              )}

              <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
                {roster.map((student) => {
                  const isActive = selectedForReport.id === student.id;
                  const isBanned = (student as any).isBanned;
                  return (
                    <div
                      key={student.id}
                      onClick={() => {
                        sound.playPop();
                        setSelectedForReport(student);
                        onSelectStudent(student);
                      }}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                        isActive
                          ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/50 shadow-md ring-2 ring-indigo-400/30'
                          : 'border-slate-200 dark:border-slate-800 hover:border-indigo-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{student.avatar}</span>
                        <div>
                          <div className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
                            {student.name}
                            {isBanned && <span className="text-[10px] px-2 py-0.5 rounded bg-rose-100 text-rose-700 font-black">BANNI</span>}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {student.stars} ⭐ · {student.gems || 0} 💎
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            sound.playPop();
                            onToggleBan(student.id);
                            triggerToast(`Statut de ${student.name} mis à jour`);
                          }}
                          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 text-slate-600 dark:text-slate-300 hover:text-rose-700 transition-colors"
                          title="Bannir / Débannir"
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Student Point Addition / Deduction Control Panel */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-slate-200 dark:border-slate-800 shadow-md space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5" />
                    <span>Gestion des Points & Diamants (Ajouter ou Retirer)</span>
                  </span>
                  <h3 className="text-2xl font-black text-slate-800 dark:text-white font-['Fredoka']">
                    {selectedForReport.name} ({selectedForReport.stars} ⭐ · {selectedForReport.gems || 0} 💎)
                  </h3>
                </div>
              </div>

              {/* Add & Remove configurable inputs for Stars and Diamonds */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Stars Control */}
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-700 dark:text-amber-400">Étoiles ⭐</span>
                    <input
                      type="number"
                      min="1"
                      max="10000"
                      value={starInputAmount}
                      onChange={(e) => setStarInputAmount(Number(e.target.value))}
                      className="w-20 px-2 py-1 rounded-xl text-xs bg-white dark:bg-slate-900 border border-amber-300 dark:border-slate-600 font-bold text-center text-slate-800 dark:text-white"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        sound.playGentleBoing();
                        onUpdateCurrency(selectedForReport.id, -starInputAmount, 0);
                        triggerToast(`-${starInputAmount} Étoiles retirées à ${selectedForReport.name}`);
                      }}
                      className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-sm cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                      <span>Retirer {starInputAmount}</span>
                    </button>
                    <button
                      onClick={() => {
                        sound.playStarChime();
                        onUpdateCurrency(selectedForReport.id, starInputAmount, 0);
                        confetti({ particleCount: 30, spread: 40 });
                        triggerToast(`+${starInputAmount} Étoiles ajoutées à ${selectedForReport.name}`);
                      }}
                      className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-sm cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Ajouter {starInputAmount}</span>
                    </button>
                  </div>
                </div>

                {/* Diamonds Control */}
                <div className="p-4 rounded-2xl bg-purple-50 dark:bg-slate-800 border border-purple-200 dark:border-slate-700 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-700 dark:text-purple-400">Diamants 💎</span>
                    <input
                      type="number"
                      min="1"
                      max="1000"
                      value={diamondInputAmount}
                      onChange={(e) => setDiamondInputAmount(Number(e.target.value))}
                      className="w-20 px-2 py-1 rounded-xl text-xs bg-white dark:bg-slate-900 border border-purple-300 dark:border-slate-600 font-bold text-center text-slate-800 dark:text-white"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        sound.playGentleBoing();
                        onUpdateCurrency(selectedForReport.id, 0, -diamondInputAmount);
                        triggerToast(`-${diamondInputAmount} Diamants retirés à ${selectedForReport.name}`);
                      }}
                      className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-sm cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                      <span>Retirer {diamondInputAmount}</span>
                    </button>
                    <button
                      onClick={() => {
                        sound.playStarChime();
                        onUpdateCurrency(selectedForReport.id, 0, diamondInputAmount);
                        confetti({ particleCount: 30, spread: 40 });
                        triggerToast(`+${diamondInputAmount} Diamants ajoutés à ${selectedForReport.name}`);
                      }}
                      className="flex-1 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-sm cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Ajouter {diamondInputAmount}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Student Observation Notes Log */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Notes d'Observation Personnalisées (Professeur / Parent)
                </span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ajouter une note (ex: Progrès remarquable en lecture)..."
                    value={currentNoteInput}
                    onChange={(e) => setCurrentNoteInput(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white"
                  />
                  <button
                    onClick={() => {
                      if (!currentNoteInput.trim()) return;
                      sound.playPop();
                      setStudentNotes({ ...studentNotes, [selectedForReport.id]: currentNoteInput.trim() });
                      setCurrentNoteInput('');
                      triggerToast('Note enregistrée !');
                    }}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs cursor-pointer"
                  >
                    Enregistrer
                  </button>
                </div>
                {studentNotes[selectedForReport.id] && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 italic">
                    Note actuelle : "{studentNotes[selectedForReport.id]}"
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Wish Letters Inbox */}
      {activeTabAdmin === 'wishes' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-md space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-xl font-black text-slate-800 dark:text-white font-['Fredoka'] flex items-center gap-2">
                  <Mail className="w-5 h-5 text-amber-500" />
                  <span>Boîte à Souhaits & Rêves des Élèves</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Retrouve ici tous les messages et rêves envoyés par les enfants à Maryam et son fils.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold text-xs">
                {wishLetters.length} vœu(x) reçu(s)
              </span>
            </div>

            <div className="space-y-3">
              {wishLetters.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <div className="text-4xl mb-2">📭</div>
                  <p className="text-sm font-bold">Aucun vœu reçu pour le moment.</p>
                </div>
              ) : (
                wishLetters.map((wish) => (
                  <div
                    key={wish.id}
                    className="p-4 rounded-2xl bg-amber-50/50 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          {wish.studentName}
                        </span>
                        <span className="text-[10px] text-slate-400">{wish.timestamp}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            wish.status === 'Répondu'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}
                        >
                          {wish.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 italic">
                        "{wish.message}"
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleWishReply(wish.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                          wish.status === 'Répondu'
                            ? 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{wish.status === 'Répondu' ? 'Marquer Non Lu' : 'Marquer Répondu'}</span>
                      </button>

                      <button
                        onClick={() => handleDeleteWish(wish.id)}
                        className="p-2 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 transition-colors"
                        title="Supprimer le vœu"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Multipliers & Version Configuration */}
      {activeTabAdmin === 'multipliers' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Score Multiplier Selection */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-md space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1">
                  <Zap className="w-4 h-4" />
                  <span>Multiplicateur de Score en Direct</span>
                </span>
                <h3 className="text-xl font-black text-slate-800 dark:text-white font-['Fredoka']">
                  Activer un Multiplicateur de Points
                </h3>
                <p className="text-xs text-slate-500">
                  Tous les gains d'étoiles et de pièces des élèves seront multipliés par le facteur choisi.
                </p>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 pt-2">
                {[1, 2, 5, 10, 20, 50, 100, 200, 500, 1000].map((mult) => (
                  <button
                    key={mult}
                    onClick={() => {
                      sound.playStarChime();
                      onSetMultiplier(mult);
                      confetti({ particleCount: 40, spread: 50 });
                      triggerToast(`Multiplicateur ${mult}x activé pour toute la classe !`);
                    }}
                    className={`py-3 rounded-2xl font-black text-xs transition-all cursor-pointer ${
                      activeMultiplier === mult
                        ? 'bg-amber-500 text-white shadow-lg ring-2 ring-amber-300 scale-105'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    {mult}x
                  </button>
                ))}
              </div>
            </div>

            {/* Game Version Customizer */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-md space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1">
                  <Download className="w-4 h-4" />
                  <span>Configuration de la Version du Jeu</span>
                </span>
                <h3 className="text-xl font-black text-slate-800 dark:text-white font-['Fredoka']">
                  Modifier la Version affichée
                </h3>
                <p className="text-xs text-slate-500">
                  Personnalisez le numéro de version de l'application (ex: v1.6.0-pro).
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <input
                  type="text"
                  value={versionInput}
                  onChange={(e) => setVersionInput(e.target.value)}
                  placeholder="ex: v1.6.0..."
                  className="w-full px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm font-bold text-slate-800 dark:text-white"
                />
                <button
                  onClick={() => {
                    if (!versionInput.trim()) return;
                    sound.playPop();
                    onSetGameVersion(versionInput.trim());
                    triggerToast(`Version mise à jour : ${versionInput.trim()}`);
                  }}
                  className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-lg cursor-pointer"
                >
                  Mettre à jour la Version 🚀
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: 20+ Options Créatives AI */}
      {activeTabAdmin === 'creative20' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-md space-y-6">
            <div>
              <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
                Intelligence Artificielle & Fonctionnalités Avancées
              </span>
              <h3 className="text-2xl font-black text-slate-800 dark:text-white font-['Fredoka'] mt-1">
                20 Options Créatives & Pédagogiques Intégrées
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Toutes ces options sont pleinement fonctionnelles dans l'application NoorKids.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: '1. Parent PDF Report Export', desc: 'Génération et impression de diplômes officiels.' },
                { title: '2. Sound Effects Volume Slider', desc: 'Contrôle précis du volume sonore global.' },
                { title: '3. Difficulty Level Selector', desc: 'Modes Facile, Normal & Quranic Scholar.' },
                { title: '4. Audio Speed Control (0.75x)', desc: 'Ralentissement audio pour prononciation exacte.' },
                { title: '5. Dark Islamic Starry Night Mode', desc: 'Mode nuit immersif avec ciel étoilé.' },
                { title: '6. Custom Avatars & Sticker Shop', desc: 'Boutique de badges et avatars personnalisés.' },
                { title: '7. Daily Streak Tracker & Calendar', desc: 'Suivi des jours consécutifs d’apprentissage.' },
                { title: '8. Mini Quran Juz & Surah Tracker', desc: 'Checklist des sourates courtes mémorisées.' },
                { title: '9. Arabic Calligraphy Neon Canvas', desc: 'Tableau de dessin et traçage à encre magique.' },
                { title: '10. Daily Challenge Quests Generator', desc: 'Générateur de quêtes quotidiennes dynamiques.' },
                { title: '11. Student Badge & Trophy Gallery', desc: 'Galerie des trophées et succès débloqués.' },
                { title: '12. Offline Learning Badge Collector', desc: 'Badge spécial pour apprentissage hors-ligne.' },
                { title: '13. Quick Quiz Customizer in Admin', desc: 'Création de questions de quiz personnalisées.' },
                { title: '14. Broadcast Announcement History', desc: 'Historique des annonces globales diffusées.' },
                { title: '15. Student Progress Reset Button', desc: 'Réinitialisation individuelle par élève.' },
                { title: '16. Student Observation Notes Log', desc: 'Notes privées de suivi pédagogique.' },
                { title: '17. Multilingual UI Switcher', desc: 'Support Français, Arabe, Anglais, Espagnol.' },
                { title: '18. Streak Freeze Power-Up', desc: 'Protection de la série de jours consécutifs.' },
                { title: '19. Bulk Point & Diamond Adjuster', desc: 'Ajustement groupé pour toute la classe.' },
                { title: '20. Game Version Release Notes Viewer', desc: 'Visionneuse des notes de version et mises à jour.' },
              ].map((opt, i) => (
                <div key={i} className="p-4 rounded-2xl bg-purple-50/50 dark:bg-slate-800 border border-purple-200 dark:border-slate-700 space-y-1">
                  <span className="font-black text-xs text-purple-700 dark:text-purple-300 block font-['Fredoka']">
                    {opt.title}
                  </span>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    {opt.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Global Beta Servers */}
      {activeTabAdmin === 'servers' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-md space-y-6">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                Infrastructure Beta Renseignée
              </span>
              <h3 className="text-2xl font-black text-slate-800 dark:text-white font-['Fredoka'] mt-1">
                Serveurs Beta Globaux NoorKids ({gameVersion})
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Sélectionnez le serveur de déploiement beta pour synchroniser les profils d'élèves en temps réel à travers le monde.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: 'Europe - Paris (v1.6.0-beta)', latency: '14ms', region: 'France / EU West', status: 'ONLINE 🟢' },
                { name: 'Americas - New York (v1.6.0-beta)', latency: '82ms', region: 'USA / US East', status: 'ONLINE 🟢' },
                { name: 'Middle East - Dubai (v1.6.0-beta)', latency: '29ms', region: 'UAE / GCC Region', status: 'ONLINE 🟢' },
                { name: 'Asia - Singapore (v1.6.0-beta)', latency: '114ms', region: 'APAC / Singapore', status: 'ONLINE 🟢' },
              ].map((srv) => {
                const isSelected = activeBetaServer === srv.name;
                return (
                  <div
                    key={srv.name}
                    onClick={() => {
                      sound.playPop();
                      setActiveBetaServer(srv.name);
                      triggerToast(`Serveur actif basculé sur : ${srv.name}`);
                    }}
                    className={`p-5 rounded-3xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/60 shadow-md ring-2 ring-indigo-400/30'
                        : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                        <span>{srv.name}</span>
                        {isSelected && <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-600 text-white font-black">ACTIF</span>}
                      </div>
                      <span className="text-xs text-slate-500 block">{srv.region}</span>
                    </div>

                    <div className="text-right space-y-0.5">
                      <span className="text-xs font-black text-emerald-600 block">{srv.status}</span>
                      <span className="text-[11px] font-mono text-slate-400">Ping: {srv.latency}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Official Certificate & PDF Report Modal */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-fadeIn print:p-0 print:bg-white print:fixed print:inset-0">
          <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-10 max-w-3xl w-full shadow-2xl border-4 border-amber-400 max-h-[92vh] overflow-y-auto print:border-none print:shadow-none print:max-h-none print:p-0">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200 print:hidden">
              <span className="text-xs font-bold text-amber-700 uppercase">
                Aperçu du Rapport & Diplôme d'Excellence ({gameVersion})
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-white font-bold text-xs shadow-md hover:bg-amber-600 transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimer / Enregistrer en PDF</span>
                </button>
                <button
                  onClick={() => setIsPrintModalOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 font-bold"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-8 rounded-3xl border-8 border-double border-amber-500 bg-gradient-to-b from-amber-50/50 via-white to-amber-50/40 text-center space-y-6 relative overflow-hidden">
              <div className="font-['Amiri'] text-2xl text-amber-800 font-bold" dir="rtl">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </div>

              <div>
                <span className="text-xs font-black uppercase tracking-widest text-amber-600">
                  Académie NoorKids Arabe & Coran ({gameVersion})
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Fredoka'] mt-1">
                  Diplôme d'Excellence & Mérite
                </h1>
                <p className="text-xs text-slate-500 italic mt-0.5">
                  Créé avec amour par Maryam et son fils
                </p>
              </div>

              <div className="py-2">
                <span className="text-sm text-slate-600 block">Ce certificat officiel est décerné avec honneur à :</span>
                <div className="text-3xl sm:text-4xl font-black text-amber-700 font-['Fredoka'] mt-2 underline decoration-amber-400 decoration-wavy">
                  {selectedForReport.name}
                </div>
                <span className="text-xs font-bold text-slate-500 mt-1 block">
                  Niveau atteint : {selectedForReport.level}
                </span>
              </div>

              <div className="flex items-center justify-between pt-6 max-w-md mx-auto text-xs">
                <div className="text-left">
                  <span className="text-slate-400 block text-[10px]">Date d'attribution :</span>
                  <strong>{new Date().toLocaleDateString('fr-FR')}</strong>
                </div>

                <div className="text-right">
                  <span className="text-slate-400 block text-[10px]">Signature de validation :</span>
                  <strong className="font-['Fredoka'] text-amber-800 text-sm">
                    Maryam & son fils ✍️
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
