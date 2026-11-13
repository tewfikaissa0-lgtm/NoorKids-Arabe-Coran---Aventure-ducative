import React, { useState } from 'react';
import { StudentProfile, Language } from '../../types';
import { sound } from '../../utils/soundEngine';
import { Trophy, Star, Gem, Award, Medal, X, Flame } from 'lucide-react';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  roster: StudentProfile[];
  currentStudentId: string;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  lang,
  roster,
  currentStudentId,
}) => {
  const [filter, setFilter] = useState<'all' | 'weekly'>('all');

  if (!isOpen) return null;

  // Sort students by stars descending
  const sortedStudents = [...roster].sort((a, b) => b.stars - a.stars);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 max-w-xl w-full shadow-2xl border-4 border-amber-400 max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={() => {
            sound.playPop();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-3xl bg-amber-100 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center mx-auto text-3xl shadow-sm mb-2">
            <Trophy className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-black text-slate-800 dark:text-white font-['Fredoka']">
            {lang === 'ar' ? 'لوحة الشرف وتحدي الأبطال' : 'Tableau d’Honneur des Petits Savants'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {lang === 'ar'
              ? 'الترتيب العام للطلاب المشاركين بروح المودة والتنافس الشريف 🌟'
              : 'Classement amical et public de tous les élèves explorateurs 🌟'}
          </p>
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center justify-center gap-2 mb-5">
          <button
            onClick={() => {
              sound.playPop();
              setFilter('all');
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              filter === 'all'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            {lang === 'ar' ? 'الترتيب العام' : 'Général'}
          </button>
          <button
            onClick={() => {
              sound.playPop();
              setFilter('weekly');
            }}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              filter === 'weekly'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            {lang === 'ar' ? 'هذا الأسبوع' : 'Cette Semaine'}
          </button>
        </div>

        {/* Top 3 Podium Highlights */}
        <div className="grid grid-cols-3 gap-2.5 mb-6 text-center items-end">
          {/* 2nd Place */}
          {sortedStudents[1] && (
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-300 dark:border-slate-700 h-36 flex flex-col justify-end">
              <span className="text-2xl block mb-1">{sortedStudents[1].avatar}</span>
              <span className="text-xs font-black truncate block">{sortedStudents[1].name}</span>
              <span className="text-[11px] font-bold text-amber-600">{sortedStudents[1].stars} ⭐</span>
              <span className="text-[10px] font-black uppercase text-slate-400 mt-1">🥈 2ème</span>
            </div>
          )}

          {/* 1st Place */}
          {sortedStudents[0] && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-3 border-amber-400 h-44 flex flex-col justify-end shadow-md">
              <span className="text-4xl block mb-1">{sortedStudents[0].avatar}</span>
              <span className="text-xs font-black truncate block text-amber-900 dark:text-amber-200">
                {sortedStudents[0].name}
              </span>
              <span className="text-xs font-black text-amber-600">{sortedStudents[0].stars} ⭐</span>
              <span className="text-xs font-black uppercase text-amber-600 mt-1">🥇 Champion</span>
            </div>
          )}

          {/* 3rd Place */}
          {sortedStudents[2] && (
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border-2 border-amber-700/30 h-32 flex flex-col justify-end">
              <span className="text-2xl block mb-1">{sortedStudents[2].avatar}</span>
              <span className="text-xs font-black truncate block">{sortedStudents[2].name}</span>
              <span className="text-[11px] font-bold text-amber-600">{sortedStudents[2].stars} ⭐</span>
              <span className="text-[10px] font-black uppercase text-amber-700 mt-1">🥉 3ème</span>
            </div>
          )}
        </div>

        {/* Full List */}
        <div className="space-y-2">
          {sortedStudents.map((s, idx) => {
            const isSelf = s.id === currentStudentId;
            return (
              <div
                key={s.id}
                className={`flex items-center justify-between p-3.5 rounded-2xl border-2 transition-all ${
                  isSelf
                    ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/40 ring-2 ring-amber-400/30 shadow-xs'
                    : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 text-center font-bold text-xs text-slate-400">
                    #{idx + 1}
                  </span>
                  <span className="text-2xl">{s.avatar}</span>
                  <div>
                    <div className="font-bold text-xs sm:text-sm text-slate-800 dark:text-white flex items-center gap-1.5 flex-wrap">
                      <span>{s.name}</span>
                      {s.role === 'admin' && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 font-black">
                          👑 Admin
                        </span>
                      )}
                      {s.role === 'creator' && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 border border-amber-400 font-black">
                          👑✨ Créateur
                        </span>
                      )}
                      {isSelf && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500 text-white font-black">
                          Moi
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Niveau {s.level} · {s.dailyStreak} 🔥
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-black text-amber-600 text-sm">
                    {s.stars} ⭐
                  </div>
                  <div className="text-[10px] text-sky-500 font-bold">
                    {s.gems} 💎
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
