import React from 'react';
import { Language, StudentProfile } from '../types';
import { sound } from '../utils/soundEngine';

interface LevelSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLevel: StudentProfile['level'];
  onSelectLevel: (level: StudentProfile['level']) => void;
  lang: Language;
}

export const LevelSelectorModal: React.FC<LevelSelectorModalProps> = ({
  isOpen,
  onClose,
  currentLevel,
  onSelectLevel,
  lang,
}) => {
  if (!isOpen) return null;

  const levels: {
    id: StudentProfile['level'];
    title: Record<Language, string>;
    subtitle: Record<Language, string>;
    age: string;
    icon: string;
    color: string;
    features: Record<Language, string[]>;
  }[] = [
    {
      id: 'Débutant',
      title: {
        fr: '1. Explorateur Débutant',
        en: '1. Beginner Explorer',
        ar: '١. المستكشف المبتدئ',
        es: '1. Explorador Principiante',
      },
      subtitle: {
        fr: "Idéal pour faire ses premiers pas et s'amuser",
        en: 'Ideal for first fun steps with Arabic letters',
        ar: 'مثالي للخطوات الأولى الممتعة مع الحروف',
        es: 'Ideal para los primeros pasos con las letras',
      },
      age: '3 - 5 ans',
      icon: '🌱',
      color: 'from-emerald-400 to-teal-500 border-emerald-400',
      features: {
        fr: [
          "Découverte des 28 lettres une par une avec prononciation lente",
          "Puzzles simples de 3 éléments avec animaux mignons",
          "Labyrinthe facile (grille 4x4) avec guidage visuel",
          "Sourates courtes (Al-Fatiha, Al-Ikhlas) avec récitation douce",
        ],
        en: [
          "28 letters one by one with slow clear pronunciation",
          "Simple 3-piece puzzles with cute animals",
          "Easy maze (4x4 grid) with visual guidance",
          "Short surahs (Al-Fatiha, Al-Ikhlas) with gentle audio",
        ],
        ar: [
          "التعرف على الحروف الـ 28 واحداً تلو الآخر بنطق بطيء واضح",
          "ألغاز بسيطة مع الحيوانات المحبوبة",
          "متاهة سهلة وميسرة (شبكة 4×4) مع إشارات توجيهية",
          "قصار السور (الفاتحة والإخلاص) بتلاوة هادئة",
        ],
        es: [
          "Descubrimiento de las letras una a una con pronunciación lenta",
          "Puzles sencillos de 3 piezas con animalitos",
          "Laberinto fácil (cuadrícula 4x4)",
          "Suras cortas con recitación melodiosa",
        ],
      },
    },
    {
      id: 'Intermédiaire',
      title: {
        fr: '2. Aventurier Curieux',
        en: '2. Curious Adventurer',
        ar: '٢. المغامر المجتهد',
        es: '2. Aventurero Curioso',
      },
      subtitle: {
        fr: "Formes des lettres, mots et histoires illustrées",
        en: 'Letter forms, vocabulary words, and rich stories',
        ar: 'أشكال الحروف، الكلمات المصورة والقصص الجميلة',
        es: 'Formas de letras, palabras e historias ilustradas',
      },
      age: '6 - 8 ans',
      icon: '🌟',
      color: 'from-sky-400 to-blue-600 border-sky-400',
      features: {
        fr: [
          "Les 4 formes de chaque lettre (Début, Milieu, Fin, Isolée)",
          "Tracé interactif des lettres au doigt ou à la souris",
          "Labyrinthes intermédiaires (grille 5x5) avec petites étoiles",
          "Histoires des Prophètes avec quiz de compréhension",
          "Tajwid visuel : initiation à la Ghunna et la Qalqalah",
        ],
        en: [
          "The 4 letter forms (Beginning, Middle, End, Isolated)",
          "Interactive letter tracing canvas with guidelines",
          "Medium mazes (5x5 grid) with bonus stars",
          "Prophet stories with comprehension mini-quizzes",
          "Visual Tajweed: introduction to Ghunna and Qalqalah",
        ],
        ar: [
          "أشكال الحرف الأربعة (أول، وسط، آخر، منفصل)",
          "رسم الحروف بالأصابع أو الفأرة بدقة",
          "متاهات متوسطة (شبكة 5×5) مع نجوم متلألئة",
          "قصص الأنبياء مع أسئلة استيعاب خفيفة",
          "مقدمة ميسرة لأحكام الغنة والقلقلة",
        ],
        es: [
          "Las 4 posiciones de las letras (inicio, medio, fin)",
          "Trazado interactivo de letras con guía visual",
          "Laberintos medianos con estrellas de recompensa",
          "Historias de los Profetas con preguntas de comprensión",
          "Iniciación al Taywid con colores claros",
        ],
      },
    },
    {
      id: 'Petit Savant',
      title: {
        fr: '3. Petit Savant d’Élite',
        en: '3. Young Scholar Elite',
        ar: '٣. العالم الصغير المتميز',
        es: '3. Pequeño Sabio de Élite',
      },
      subtitle: {
        fr: "Coran complet, Tajwid complet et Récits historiques",
        en: 'In-depth Quran, full Tajweed, and historic campaigns',
        ar: 'تجويد متقدم، حفظ القرآن والسيرة النبوية الكبرى',
        es: 'Corán profundo, Taywid completo y campañas históricas',
      },
      age: '9 ans et +',
      icon: '👑',
      color: 'from-amber-400 to-orange-500 border-amber-400',
      features: {
        fr: [
          "Mode mémorisation Hifz avec cache-mots progressif",
          "Toutes les règles de Tajwid colorées et expliquées",
          "Récits des grandes campagnes du Prophète (Badr, Khandaq, Fath Makkah)",
          "Défis de rapidité dans le labyrinthe des lettres (grille 6x6)",
          "Certificat officiel d'excellence et export de rapport en PDF",
        ],
        en: [
          "Hifz memorization tool with progressive word hiding",
          "All color-coded Tajweed rules with child-friendly definitions",
          "Heroic chronicles of the Prophet (Badr, Trench, Makkah)",
          "Speed challenge in the letter maze (6x6 grid)",
          "Official certificate of excellence and printable PDF report",
        ],
        ar: [
          "أداة الحفظ الذاتي مع إخفاء الكلمات تدريجياً لاختبار الحفظ",
          "جميع أحكام التجويد الملونة مشروحة بكل بساطة",
          "غزوات النبي الكبرى (بدر، الخندق، فتح مكة)",
          "تحديات سرعة في المتاهة المتقدمة (شبكة 6×6)",
          "شهادة تفوق رسمية وتصدير تقارير الإنجاز كـ PDF",
        ],
        es: [
          "Modo memorización Hifz ocultando palabras paso a paso",
          "Todas las reglas de Taywid explicadas con colores",
          "Historias de las grandes campañas (Badr, Jandaq, La Meca)",
          "Desafíos de velocidad en laberintos avanzados",
          "Diploma oficial y exportación de informe en PDF",
        ],
      },
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 max-w-3xl w-full shadow-2xl border-4 border-amber-400/50 max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold text-xs uppercase tracking-wider mb-2">
            ⭐ {lang === 'ar' ? 'اختيار المستوى والقدرة' : lang === 'en' ? 'Choose Your Difficulty Level' : 'Choix du Niveau de Difficulté'}
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white font-['Fredoka']">
            {lang === 'ar' ? 'ما هو مستواك اليوم في اللغة العربية؟' : lang === 'en' ? 'What is your Arabic adventure level today?' : 'Quel est ton niveau d’aventure en arabe ?'}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm mt-1 max-w-lg mx-auto">
            {lang === 'ar'
              ? 'يمكنك تغيير المستوى في أي وقت من الشريط العلوي لتكييف المتاهات والقصص والاختبارات.'
              : lang === 'en'
              ? 'You can change this anytime from the top bar to adjust puzzles, mazes, and quizzes.'
              : "Tu pourras changer de niveau à tout moment pour adapter les labyrinthes, puzzles et récits."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {levels.map((lvl) => {
            const isSelected = currentLevel === lvl.id;
            return (
              <button
                key={lvl.id}
                onClick={() => {
                  sound.playStarChime();
                  onSelectLevel(lvl.id);
                  onClose();
                }}
                className={`relative flex flex-col text-left p-5 rounded-2xl border-3 transition-all transform hover:-translate-y-1 hover:shadow-xl cursor-pointer ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/40 ring-4 ring-amber-400/30 shadow-lg'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {isSelected && (
                  <span className="absolute -top-3 right-4 bg-amber-500 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-sm">
                    {lang === 'ar' ? 'المستوى الحالي' : lang === 'en' ? 'Active' : 'Actif'}
                  </span>
                )}

                <div className="flex items-center justify-between mb-2">
                  <span className="text-3xl">{lvl.icon}</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-200 shadow-xs border border-slate-200 dark:border-slate-600">
                    {lvl.age}
                  </span>
                </div>

                <h3 className="text-lg font-black text-slate-800 dark:text-white font-['Fredoka']">
                  {lvl.title[lang]}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-3">
                  {lvl.subtitle[lang]}
                </p>

                <div className="mt-auto space-y-1.5 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300">
                  {lvl.features[lang].map((f, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-2">
                  <div
                    className={`w-full py-2 rounded-xl text-center font-bold text-xs shadow-xs transition-colors ${
                      isSelected
                        ? 'bg-amber-500 text-white shadow-amber-500/20'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-amber-400 hover:text-white'
                    }`}
                  >
                    {isSelected
                      ? (lang === 'ar' ? 'مختار حالياً' : lang === 'en' ? 'Selected' : 'Sélectionné')
                      : (lang === 'ar' ? 'اختيار هذا المستوى' : lang === 'en' ? 'Select Level' : 'Choisir ce niveau')}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="text-center">
          <button
            onClick={() => {
              sound.playPop();
              onClose();
            }}
            className="px-6 py-2.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-sm hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
          >
            {lang === 'ar' ? 'إغلاق' : lang === 'en' ? 'Close' : 'Fermer'}
          </button>
        </div>
      </div>
    </div>
  );
};
