import React from 'react';
import { Language, StudentProfile } from '../../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Trophy, Clock, Award, Sparkles, BookOpen, Layers } from 'lucide-react';

interface StudentStatsCardProps {
  student: StudentProfile;
  lang: Language;
}

export const StudentStatsCard: React.FC<StudentStatsCardProps> = ({ student, lang }) => {
  const alphabetCount = student.masteredLetters.length;
  const quranCount = student.completedSurahs.length;
  const storiesCount = student.readStories.length;
  const puzzlesCount = student.completedPuzzlesCount || 0;
  const wordsCount = student.dailyWordsLearned.length;

  const data = [
    { name: lang === 'ar' ? 'الحروف' : 'Alphabet', progress: Math.round((alphabetCount / 28) * 100), count: `${alphabetCount}/28`, color: '#f59e0b' },
    { name: lang === 'ar' ? 'القرآن' : 'Quran', progress: Math.min(100, Math.round((quranCount / 10) * 100)), count: `${quranCount} sourates`, color: '#10b981' },
    { name: lang === 'ar' ? 'القصص' : 'Histoires', progress: Math.min(100, Math.round((storiesCount / 5) * 100)), count: `${storiesCount} récits`, color: '#6366f1' },
    { name: lang === 'ar' ? 'الألغاز' : 'Puzzles', progress: Math.min(100, Math.round((puzzlesCount / 10) * 100)), count: `${puzzlesCount} réussis`, color: '#3b82f6' },
    { name: lang === 'ar' ? 'الكلمات' : 'Mots', progress: Math.min(100, Math.round((wordsCount / 14) * 100)), count: `${wordsCount} mots`, color: '#ec4899' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border-2 border-amber-300 dark:border-slate-800 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-2xl shadow-md">
            📊
          </div>
          <div>
            <h3 className="text-lg font-black font-['Fredoka'] text-slate-900 dark:text-white">
              Statistiques & Évolution de {student.name}
            </h3>
            <p className="text-xs text-slate-500">
              Visualisation graphique de tes progrès d'apprentissage
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-bold text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>Temps : {student.screenTimeTodayMinutes} min</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-900">
            <Award className="w-4 h-4 text-purple-600" />
            <span>Succès : {student.badges.length} badges</span>
          </div>
        </div>
      </div>

      {/* Recharts Bar Graph */}
      <div className="space-y-2">
        <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
          Progression par Catégorie (%)
        </h4>
        <div className="h-64 w-full bg-slate-50 dark:bg-slate-950/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#888888' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#888888' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  borderColor: '#475569',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                }}
                formatter={(value: any, name: any, item: any) => [`${value}% (${item.payload.count})`, 'Maîtrise']}
              />
              <Bar dataKey="progress" radius={[8, 8, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-center space-y-1">
          <span className="text-2xl block">⭐</span>
          <span className="text-lg font-black text-amber-700 dark:text-amber-400 font-['Fredoka']">{student.stars}</span>
          <span className="text-[10px] font-bold text-slate-500 block">Étoiles Totales</span>
        </div>
        <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900/50 text-center space-y-1">
          <span className="text-2xl block">💎</span>
          <span className="text-lg font-black text-sky-700 dark:text-sky-400 font-['Fredoka']">{student.gems}</span>
          <span className="text-[10px] font-bold text-slate-500 block">Diamants</span>
        </div>
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 text-center space-y-1">
          <span className="text-2xl block">🔥</span>
          <span className="text-lg font-black text-emerald-700 dark:text-emerald-400 font-['Fredoka']">{student.dailyStreak} j</span>
          <span className="text-[10px] font-bold text-slate-500 block">Série Active</span>
        </div>
        <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/50 text-center space-y-1">
          <span className="text-2xl block">👑</span>
          <span className="text-lg font-black text-purple-700 dark:text-purple-400 font-['Fredoka']">{student.level}</span>
          <span className="text-[10px] font-bold text-slate-500 block">Niveau Actuel</span>
        </div>
      </div>
    </div>
  );
};
