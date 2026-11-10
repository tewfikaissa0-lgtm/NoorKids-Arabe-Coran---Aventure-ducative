export type Language = 'fr' | 'en' | 'ar' | 'es';

export interface ArabicLetter {
  id: string;
  letter: string;
  name: string;
  arabicName: string;
  transliteration: string;
  soundDescription: Record<Language, string>;
  phoneticTip: Record<Language, string>;
  forms: {
    isolated: string;
    initial: string;
    medial: string;
    final: string;
  };
  exampleWord: {
    arabic: string;
    meaning: Record<Language, string>;
    transliteration: string;
    emoji: string;
    color: string;
  };
  strokeGuide: string[];
  group: 'easy' | 'dotted' | 'curved' | 'emphatic' | 'complex';
}

export interface DailyWord {
  id: string;
  dayIndex: number;
  arabic: string;
  transliteration: string;
  translations: Record<Language, string>;
  category: 'nature' | 'animals' | 'values' | 'family' | 'quran' | 'everyday' | 'school';
  emoji: string;
  exampleSentenceArabic: string;
  exampleSentenceTranslation: Record<Language, string>;
  funFact: Record<Language, string>;
  letters: string[];
  root: string;
}

export type IllustrationKey =
  | 'ocean_whale'
  | 'desert_caravan'
  | 'ark_animals'
  | 'starry_night'
  | 'parting_sea'
  | 'olive_dove'
  | 'crow_pitcher'
  | 'garden_eden'
  | 'mercy_bird'
  | 'badr_oasis'
  | 'trench_digging'
  | 'mount_uhud'
  | 'fath_makkah';

export interface StoryPage {
  pageNumber: number;
  text: Record<Language, string>;
  arabicExcerpt: string;
  illustrationKey: IllustrationKey;
  audioEffect: 'waves' | 'wind' | 'chime' | 'animals' | 'night' | 'celebration';
}

export interface Story {
  id: string;
  category: 'prophets' | 'literature' | 'fables';
  title: Record<Language, string>;
  arabicTitle: string;
  hero: string;
  coverEmoji: string;
  colorTheme: string;
  summary: Record<Language, string>;
  moral: Record<Language, string>;
  pages: StoryPage[];
  quizQuestions?: {
    question: Record<Language, string>;
    options: Record<Language, string[]>;
    correctIndex: number;
  }[];
}

export type TajweedRuleType = 'ghunna' | 'qalqalah' | 'idgham' | 'madd' | 'ikhfa' | 'normal';

export interface TajweedSegment {
  text: string;
  rule: TajweedRuleType;
}

export interface SurahVerse {
  verseNumber: number;
  textArabic: string;
  segments: TajweedSegment[];
  translation: Record<Language, string>;
  transliteration: string;
  globalAyahNumber: number;
}

export interface Surah {
  number: number;
  nameArabic: string;
  nameTransliteration: string;
  nameTranslation: Record<Language, string>;
  versesCount: number;
  revelationType: 'Meccan' | 'Medinan';
  theme: Record<Language, string>;
  verses: SurahVerse[];
}

export interface Badge {
  id: string;
  title: Record<Language, string>;
  description: Record<Language, string>;
  icon: string;
  category: 'alphabet' | 'maze' | 'quran' | 'stories' | 'daily' | 'mastery';
  requirement: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  avatar: string;
  stars: number;
  gems: number;
  dailyStreak: number;
  lastActiveDate: string;
  masteredLetters: string[];
  completedSurahs: number[];
  readStories: string[];
  completedPuzzlesCount: number;
  mazeLevelsBeaten: number[];
  quizScores: {
    totalQuizzes: number;
    totalCorrect: number;
    bestStreak: number;
  };
  badges: string[];
  dailyWordsLearned: string[];
  screenTimeTodayMinutes: number;
  level: 'Débutant' | 'Intermédiaire' | 'Petit Savant';
}

export interface ParentalSettings {
  pin: string;
  dailyTimeLimitMinutes: number;
  soundEnabled: boolean;
  musicEnabled: boolean;
  narrationSpeed: number;
  screenTimeUsedSeconds: number;
}
