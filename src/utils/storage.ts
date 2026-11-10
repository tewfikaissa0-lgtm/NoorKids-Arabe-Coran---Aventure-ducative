import { StudentProfile, ParentalSettings, Badge } from '../types';

export const ALL_BADGES: Badge[] = [
  {
    id: 'first_letter',
    title: {
      fr: 'Premier Pas Arabe',
      en: 'First Arabic Step',
      ar: 'الخطوة الأولى',
      es: 'Primer Paso Árabe',
    },
    description: {
      fr: "Tu as appris ta première lettre de l'alphabet !",
      en: 'You learned your very first Arabic letter!',
      ar: 'تعلمت أول حرف لك في الأبجدية العربية !',
      es: '¡Aprendiste tu primera letra en árabe!',
    },
    icon: '🔤',
    category: 'alphabet',
    requirement: "Apprendre 1 lettre de l'alphabet",
  },
  {
    id: 'alphabet_master',
    title: {
      fr: "Maître de l'Alphabet",
      en: 'Alphabet Master',
      ar: 'أستاذ الحروف',
      es: 'Maestro del Alfabeto',
    },
    description: {
      fr: 'Tu as maîtrisé les 28 lettres de la langue arabe !',
      en: 'You mastered all 28 letters of the Arabic alphabet!',
      ar: 'أتقنت جميع حروف اللغة العربية الـ 28 !',
      es: '¡Dominaste las 28 letras del alfabeto árabe!',
    },
    icon: '👑',
    category: 'alphabet',
    requirement: 'Maîtriser les 28 lettres',
  },
  {
    id: 'daily_word_hero',
    title: {
      fr: 'Explorateur du Mot du Jour',
      en: 'Daily Word Explorer',
      ar: 'مستكشف كلمة اليوم',
      es: 'Explorador de la Palabra del Día',
    },
    description: {
      fr: 'Tu as complété le défi du mot du jour et enrichi ton vocabulaire !',
      en: 'You completed a daily word challenge and grew your vocabulary!',
      ar: 'أكملت تحدي كلمة اليوم وأثريت رصيدك اللغوي !',
      es: '¡Completaste el reto de la palabra del día!',
    },
    icon: '✨',
    category: 'daily',
    requirement: 'Apprendre au moins 1 mot du jour',
  },
  {
    id: 'streak_3',
    title: {
      fr: 'Flamme de la Série (3 Jours)',
      en: 'Streak Flame (3 Days)',
      ar: 'شعلة الاستمرار (3 أيام)',
      es: 'Llama de Racha (3 Días)',
    },
    description: {
      fr: '3 jours consécutifs d’apprentissage !',
      en: '3 consecutive days of learning adventures!',
      ar: '3 أيام متتالية من التعلم والاجتهاد !',
      es: '¡3 días consecutivos de aprendizaje!',
    },
    icon: '🔥',
    category: 'mastery',
    requirement: '3 jours de série',
  },
  {
    id: 'puzzle_champion',
    title: {
      fr: 'Génie des Puzzles',
      en: 'Word Puzzle Genius',
      ar: 'عبقري الألغاز',
      es: 'Genio de los Puzles',
    },
    description: {
      fr: 'Tu as résolu des puzzles de mots illustrés avec brio !',
      en: 'You solved illustrated word puzzles like a champ!',
      ar: 'قمت بحل ألغاز الكلمات المصورة بمهارة فائقة !',
      es: '¡Resolviste puzles de palabras con éxito!',
    },
    icon: '🧩',
    category: 'alphabet',
    requirement: 'Compléter 3 puzzles de mots',
  },
  {
    id: 'maze_conqueror',
    title: {
      fr: 'Aventurier du Labyrinthe',
      en: 'Maze Adventurer',
      ar: 'بطل المتاهة',
      es: 'Aventurero del Laberinto',
    },
    description: {
      fr: 'Tu as guidé le chamelier à travers le labyrinthe des lettres !',
      en: 'You guided the camel explorer through the letter maze!',
      ar: 'قدت البطل الصغير عبر متاهة الحروف حتى الواحة !',
      es: '¡Cruzaste el laberinto de letras hasta el oasis!',
    },
    icon: '🐪',
    category: 'maze',
    requirement: 'Réussir un niveau de labyrinthe',
  },
  {
    id: 'prophets_friend',
    title: {
      fr: 'Ami des Prophètes',
      en: 'Friend of the Prophets',
      ar: 'صديق الأنبياء',
      es: 'Amigo de los Profetas',
    },
    description: {
      fr: 'Tu as écouté et terminé 3 magnifiques histoires inspirantes !',
      en: 'You listened and finished 3 inspiring stories of the Prophets!',
      ar: 'استمعت إلى 3 من قصص الأنبياء العطرة واستوعبت عبرها !',
      es: '¡Escuchaste 3 historias inspiradoras de los Profetas!',
    },
    icon: '📖',
    category: 'stories',
    requirement: 'Lire 3 histoires',
  },
  {
    id: 'badr_khandaq_scholar',
    title: {
      fr: 'Chevalier de la Paix & du Savoir',
      en: 'Knight of Peace & Wisdom',
      ar: 'فارس الحكمة والسلام',
      es: 'Caballero de la Paz y la Sabiduría',
    },
    description: {
      fr: 'Tu as découvert les récits héroïques et la clémence de Badr et Fath Makkah !',
      en: 'You explored the heroic chronicles and high mercy of Badr and Fath Makkah!',
      ar: "تعلمت دروس التسامح والعفو والشورى من غزوات النبي وسيرته !",
      es: '¡Aprendiste las lecciones de perdón y sabiduría en la historia!',
    },
    icon: '🛡️',
    category: 'stories',
    requirement: 'Lire les histoires de Badr ou Fath Makkah',
  },
  {
    id: 'little_hafiz',
    title: {
      fr: 'Petit Hafiz Étoile',
      en: 'Little Hafiz Star',
      ar: 'الحافظ الصغير',
      es: 'Pequeño Hafiz Estrella',
    },
    description: {
      fr: 'Tu as mémorisé et écouté une sourate sacrée avec son Tajwid !',
      en: 'You memorized and listened to a Holy Surah with Tajweed rules!',
      ar: 'حفظت واستمعت إلى سورة كريمة بأحكام التجويد الميسرة !',
      es: '¡Memorizaste y recitaste una sura con Taywid!',
    },
    icon: '⭐',
    category: 'quran',
    requirement: 'Compléter une sourate du Coran',
  },
  {
    id: 'tajweed_expert',
    title: {
      fr: 'Champion du Tajwid',
      en: 'Tajweed Champion',
      ar: 'بطل التجويد',
      es: 'Campeón de Taywid',
    },
    description: {
      fr: 'Tu connais la Ghunna, la Qalqalah et le Madd comme un savant !',
      en: 'You recognized Ghunna, Qalqalah, and Madd with great skill!',
      ar: 'تعرفت على الغنة والقلقلة والمد بكل براعة ووضوح !',
      es: '¡Conoces las reglas de Taywid como un sabio!',
    },
    icon: '✨',
    category: 'quran',
    requirement: 'Pratiquer le Tajwid dans le lecteur Coran',
  },
];

const DEFAULT_PROFILE: StudentProfile = {
  id: 'student-badr',
  name: 'Badr (Petit Savant)',
  avatar: '👦🏽',
  stars: 120,
  gems: 35,
  dailyStreak: 3,
  lastActiveDate: new Date().toISOString().split('T')[0],
  masteredLetters: ['alif', 'ba', 'ta', 'tha', 'jim'],
  completedSurahs: [1, 112],
  readStories: ['yunus', 'nuh', 'badr'],
  completedPuzzlesCount: 4,
  mazeLevelsBeaten: [1],
  quizScores: {
    totalQuizzes: 8,
    totalCorrect: 7,
    bestStreak: 5,
  },
  badges: ['first_letter', 'daily_word_hero', 'streak_3', 'prophets_friend'],
  dailyWordsLearned: ['salam', 'kitab', 'shukr'],
  screenTimeTodayMinutes: 12,
  level: 'Débutant',
};

const DEFAULT_ROSTER: StudentProfile[] = [
  DEFAULT_PROFILE,
  {
    id: 'student-sofia',
    name: 'Sofia la Curieuse',
    avatar: '👧🏻',
    stars: 240,
    gems: 60,
    dailyStreak: 7,
    lastActiveDate: new Date().toISOString().split('T')[0],
    masteredLetters: ['alif', 'ba', 'ta', 'tha', 'jim', 'ha_throat', 'kha', 'dal', 'dhal', 'ra'],
    completedSurahs: [1, 112, 113, 114],
    readStories: ['yunus', 'nuh', 'musa', 'kalila_crow', 'khandaq'],
    completedPuzzlesCount: 9,
    mazeLevelsBeaten: [1, 2],
    quizScores: { totalQuizzes: 15, totalCorrect: 14, bestStreak: 10 },
    badges: ['first_letter', 'daily_word_hero', 'streak_3', 'puzzle_champion', 'maze_conqueror', 'prophets_friend', 'little_hafiz'],
    dailyWordsLearned: ['salam', 'kitab', 'shukr', 'shams', 'qamar'],
    screenTimeTodayMinutes: 20,
    level: 'Intermédiaire',
  },
  {
    id: 'student-rayan',
    name: 'Rayan l’Explorateur',
    avatar: '🧒🏽',
    stars: 310,
    gems: 90,
    dailyStreak: 5,
    lastActiveDate: new Date().toISOString().split('T')[0],
    masteredLetters: ['alif', 'ba', 'ta', 'tha', 'jim', 'ha_throat', 'kha', 'dal', 'dhal', 'ra', 'zay', 'sin', 'shin', 'sad'],
    completedSurahs: [1, 112, 113, 114, 108, 103],
    readStories: ['yunus', 'nuh', 'musa', 'muhammad', 'badr', 'khandaq', 'fath_makkah'],
    completedPuzzlesCount: 12,
    mazeLevelsBeaten: [1, 2, 3],
    quizScores: { totalQuizzes: 20, totalCorrect: 19, bestStreak: 14 },
    badges: ['first_letter', 'daily_word_hero', 'streak_3', 'puzzle_champion', 'maze_conqueror', 'prophets_friend', 'badr_khandaq_scholar', 'little_hafiz', 'tajweed_expert'],
    dailyWordsLearned: ['salam', 'kitab', 'shukr', 'shams', 'qamar', 'jamil', 'sadiq', 'birr', 'noor'],
    screenTimeTodayMinutes: 25,
    level: 'Petit Savant',
  },
  {
    id: 'student-amina',
    name: 'Amina la Douce',
    avatar: '🧕🏼',
    stars: 180,
    gems: 45,
    dailyStreak: 4,
    lastActiveDate: new Date().toISOString().split('T')[0],
    masteredLetters: ['alif', 'ba', 'ta', 'tha', 'jim', 'ha_throat'],
    completedSurahs: [1, 112, 108],
    readStories: ['yunus', 'muhammad', 'kalila_crow'],
    completedPuzzlesCount: 6,
    mazeLevelsBeaten: [1],
    quizScores: { totalQuizzes: 10, totalCorrect: 9, bestStreak: 6 },
    badges: ['first_letter', 'daily_word_hero', 'streak_3', 'puzzle_champion', 'prophets_friend', 'little_hafiz'],
    dailyWordsLearned: ['salam', 'kitab', 'shukr', 'birr'],
    screenTimeTodayMinutes: 15,
    level: 'Débutant',
  },
];

const DEFAULT_SETTINGS: ParentalSettings = {
  pin: '1234',
  dailyTimeLimitMinutes: 30,
  soundEnabled: true,
  musicEnabled: true,
  narrationSpeed: 0.9,
  screenTimeUsedSeconds: 12 * 60,
};

const STORAGE_KEY_PROFILE = 'noorkids_student_profile_v2';
const STORAGE_KEY_ROSTER = 'noorkids_student_roster_v2';
const STORAGE_KEY_SETTINGS = 'noorkids_parental_settings_v2';

export function loadStudentProfile(): StudentProfile {
  if (typeof window === 'undefined') return DEFAULT_PROFILE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROFILE);
    if (raw) {
      return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
    }
  } catch {}
  return DEFAULT_PROFILE;
}

export function saveStudentProfile(profile: StudentProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
    // also update in roster
    const roster = loadStudentRoster();
    const idx = roster.findIndex((s) => s.id === profile.id);
    if (idx >= 0) {
      roster[idx] = profile;
    } else {
      roster.push(profile);
    }
    saveStudentRoster(roster);
  } catch {}
}

export function loadStudentRoster(): StudentProfile[] {
  if (typeof window === 'undefined') return DEFAULT_ROSTER;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ROSTER);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return DEFAULT_ROSTER;
}

export function saveStudentRoster(roster: StudentProfile[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_ROSTER, JSON.stringify(roster));
  } catch {}
}

export function loadParentalSettings(): ParentalSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (raw) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    }
  } catch {}
  return DEFAULT_SETTINGS;
}

export function saveParentalSettings(settings: ParentalSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  } catch {}
}
