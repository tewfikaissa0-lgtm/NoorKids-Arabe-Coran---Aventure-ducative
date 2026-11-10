import React, { useState } from 'react';
import { StudentProfile, Language } from '../../types';
import { sound } from '../../utils/soundEngine';
import {
  Printer,
  Award,
  Users,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldAlert,
  Plus,
  TrendingUp,
} from 'lucide-react';

interface AdminDashboardProps {
  lang: Language;
  roster: StudentProfile[];
  activeStudent: StudentProfile;
  onSelectStudent: (student: StudentProfile) => void;
  onAddStudent: (name: string, level: StudentProfile['level']) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  lang,
  roster,
  activeStudent,
  onSelectStudent,
  onAddStudent,
}) => {
  const [selectedForReport, setSelectedForReport] = useState<StudentProfile>(activeStudent);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [newStudentName, setNewStudentName] = useState<string>('');
  const [newStudentLevel, setNewStudentLevel] = useState<StudentProfile['level']>('Débutant');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

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
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl border-3 border-indigo-500/40 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2 border border-indigo-400/30">
            <Users className="w-3.5 h-3.5" />
            <span>Espace Enseignant & Administration · Maryam et son fils</span>
          </div>
          <h2 className="text-3xl font-black font-['Fredoka']">
            {lang === 'ar' ? 'لوحة تحكم المعلم ومتابعة الطلاب' : 'Tableau de Bord Pédagogique & Suivi'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            {lang === 'ar'
              ? 'متابعة أداء كل طالب، تحليل تقدم الحفظ، وتصدير التقارير والشهادات الرسمية كـ PDF.'
              : 'Supervisez les performances de chaque élève, le temps d’écran, et exportez des rapports et diplômes en PDF.'}
          </p>
        </div>

        <button
          onClick={() => {
            sound.playPop();
            setSelectedForReport(activeStudent);
            setIsPrintModalOpen(true);
          }}
          className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-sm shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <Printer className="w-5 h-5" />
          <span>{lang === 'ar' ? 'تصدير تقرير PDF / طباعة شهادة' : 'Exporter Rapport PDF / Diplôme'}</span>
        </button>
      </div>

      {/* Roster & Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Student Roster */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-slate-200 dark:border-slate-800 shadow-md">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-black text-slate-800 dark:text-white font-['Fredoka'] flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              <span>{lang === 'ar' ? 'قائمة الطلاب المسجلين' : 'Liste des Élèves'}</span>
            </h3>
            <button
              onClick={() => {
                sound.playPop();
                setShowAddForm(!showAddForm);
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold text-xs hover:bg-indigo-100 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ajouter</span>
            </button>
          </div>

          {showAddForm && (
            <form onSubmit={handleCreateStudent} className="p-4 mb-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-3">
              <input
                type="text"
                placeholder="Prénom de l'élève (ex: Rayan, Sofia)..."
                value={newStudentName}
                onChange={(e) => setNewStudentName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700"
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
                Créer la fiche élève
              </button>
            </form>
          )}

          <div className="space-y-2.5">
            {roster.map((student) => {
              const isActive = activeStudent.id === student.id;
              return (
                <div
                  key={student.id}
                  onClick={() => {
                    sound.playPop();
                    onSelectStudent(student);
                    setSelectedForReport(student);
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
                      <div className="font-bold text-sm text-slate-800 dark:text-white">
                        {student.name}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Niveau : {student.level} · {student.stars} ⭐
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedForReport(student);
                        setIsPrintModalOpen(true);
                      }}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 text-slate-600 dark:text-slate-300 hover:text-amber-700 transition-colors"
                      title="Générer Diplôme"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Student Analytics */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-slate-200 dark:border-slate-800 shadow-md space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Fiche de performance détaillée
              </span>
              <h3 className="text-2xl font-black text-slate-800 dark:text-white font-['Fredoka']">
                {activeStudent.name} ({activeStudent.level})
              </h3>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-extrabold text-xs">
              🔥 {activeStudent.dailyStreak} jours de série
            </div>
          </div>

          {/* Metric cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 text-center">
              <span className="text-xs text-slate-500 font-bold block">Lettres Apprises</span>
              <span className="text-2xl font-black text-amber-600">
                {activeStudent.masteredLetters.length} / 28
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-slate-800 border border-emerald-200 dark:border-slate-700 text-center">
              <span className="text-xs text-slate-500 font-bold block">Sourates Mémorisées</span>
              <span className="text-2xl font-black text-emerald-600">
                {activeStudent.completedSurahs.length}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-slate-800 border border-purple-200 dark:border-slate-700 text-center">
              <span className="text-xs text-slate-500 font-bold block">Histoires Lues</span>
              <span className="text-2xl font-black text-purple-600">
                {activeStudent.readStories.length}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-sky-50 dark:bg-slate-800 border border-sky-200 dark:border-slate-700 text-center">
              <span className="text-xs text-slate-500 font-bold block">Temps d'écran (J)</span>
              <span className="text-2xl font-black text-sky-600">
                {activeStudent.screenTimeTodayMinutes} min
              </span>
            </div>
          </div>

          {/* Progress Bars */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-700 dark:text-slate-300">Maîtrise de l'Alphabet</span>
                <span className="text-amber-600 font-bold">
                  {Math.round((activeStudent.masteredLetters.length / 28) * 100)}%
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(activeStudent.masteredLetters.length / 28) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-700 dark:text-slate-300">Précision aux Quiz & Puzzles</span>
                <span className="text-emerald-600 font-bold">
                  {activeStudent.quizScores.totalQuizzes > 0
                    ? Math.round(
                        (activeStudent.quizScores.totalCorrect / activeStudent.quizScores.totalQuizzes) * 100
                      )
                    : 100}
                  %
                </span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      activeStudent.quizScores.totalQuizzes > 0
                        ? (activeStudent.quizScores.totalCorrect / activeStudent.quizScores.totalQuizzes) * 100
                        : 100
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Badges unlocked */}
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-slate-400 block mb-2">
              Badges Débloqués ({activeStudent.badges.length})
            </span>
            <div className="flex flex-wrap gap-2">
              {activeStudent.badges.map((bId) => (
                <span
                  key={bId}
                  className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                >
                  🏅 {bId.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Official Certificate & PDF Report Modal */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-fadeIn print:p-0 print:bg-white print:fixed print:inset-0">
          <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-10 max-w-3xl w-full shadow-2xl border-4 border-amber-400 max-h-[92vh] overflow-y-auto print:border-none print:shadow-none print:max-h-none print:p-0">
            {/* Modal Controls (Hidden in Print) */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200 print:hidden">
              <span className="text-xs font-bold text-amber-700 uppercase">
                Aperçu du Rapport & Diplôme d'Excellence
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-white font-bold text-xs shadow-md hover:bg-amber-600 transition-colors"
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

            {/* Official Diploma Printable Template */}
            <div className="p-8 rounded-3xl border-8 border-double border-amber-500 bg-gradient-to-b from-amber-50/50 via-white to-amber-50/40 text-center space-y-6 relative overflow-hidden">
              {/* Corner Ornaments */}
              <div className="absolute top-2 left-2 text-2xl text-amber-500">⚜️</div>
              <div className="absolute top-2 right-2 text-2xl text-amber-500">⚜️</div>
              <div className="absolute bottom-2 left-2 text-2xl text-amber-500">⚜️</div>
              <div className="absolute bottom-2 right-2 text-2xl text-amber-500">⚜️</div>

              {/* Bismillah */}
              <div className="font-['Amiri'] text-2xl text-amber-800 font-bold" dir="rtl">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </div>

              <div>
                <span className="text-xs font-black uppercase tracking-widest text-amber-600">
                  Académie NoorKids Arabe & Coran
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

              <p className="text-xs sm:text-sm text-slate-700 max-w-lg mx-auto leading-relaxed">
                Pour son assiduité remarquable, sa brillante mémorisation des sourates sacrées,
                sa maîtrise de l'alphabet arabe et sa compréhension bienveillante des récits des Prophètes.
              </p>

              {/* Summary Stats Table */}
              <div className="grid grid-cols-4 gap-2 max-w-md mx-auto pt-2 border-t border-b border-amber-200 py-3 text-xs">
                <div>
                  <span className="text-slate-500 block">Alphabet</span>
                  <strong className="text-amber-700 text-sm">{selectedForReport.masteredLetters.length}/28</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Sourates</span>
                  <strong className="text-emerald-700 text-sm">{selectedForReport.completedSurahs.length}</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Étoiles</span>
                  <strong className="text-amber-700 text-sm">{selectedForReport.stars} ⭐</strong>
                </div>
                <div>
                  <span className="text-slate-500 block">Badges</span>
                  <strong className="text-purple-700 text-sm">{selectedForReport.badges.length}</strong>
                </div>
              </div>

              {/* Signatures */}
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
