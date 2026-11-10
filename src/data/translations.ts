import { Language } from '../types';

export interface Translations {
  appName: string;
  appSubtitle: string;
  creatorCredit: string;
  navAlphabet: string;
  navDailyWord: string;
  navPuzzle: string;
  navMaze: string;
  navStories: string;
  navQuran: string;
  navQuiz: string;
  navVoiceQuiz: string;
  navLeaderboard: string;
  navParental: string;
  navAdmin: string;
  navDictionary: string;
  starsLabel: string;
  gemsLabel: string;
  streakLabel: string;
  streakDays: string;
  themeToggle: string;
  soundToggle: string;
  playAudio: string;
  startStory: string;
  listenAyah: string;
  pause: string;
  resume: string;
  next: string;
  previous: string;
  checkAnswer: string;
  congratulations: string;
  tryAgain: string;
  learnMore: string;
  badgeUnlocked: string;
  shareMilestone: string;
  aiCompanionName: string;
  aiAskPlaceholder: string;
  aiButton: string;
  screenTimeLeft: string;
  screenTimeAlertTitle: string;
  screenTimeAlertDesc: string;
  dailyGoalReached: string;
  studentDiplomaTitle: string;
  printPdf: string;
  offlineReady: string;
  tajweedLegend: string;
}

export const translations: Record<Language, Translations> = {
  fr: {
    appName: "NoorKids Arabe & Coran",
    appSubtitle: "L'Aventure Ludique des Petits Savants",
    creatorCredit: "Créé avec amour par Maryam et son fils",
    navAlphabet: "Alphabet",
    navDailyWord: "Mot du Jour",
    navPuzzle: "Puzzles Mots",
    navMaze: "Labyrinthe",
    navStories: "Histoires Prophètes",
    navQuran: "Saint Coran",
    navQuiz: "Défis & Quiz",
    navVoiceQuiz: "Quiz Vocal",
    navLeaderboard: "Classement",
    navParental: "Parental",
    navAdmin: "Admin",
    navDictionary: "Dictionnaire",
    starsLabel: "Étoiles",
    gemsLabel: "Diamants",
    streakLabel: "Série",
    streakDays: "jours consécutifs",
    themeToggle: "Thème Sombre / Clair",
    soundToggle: "Sons & Musique",
    playAudio: "Écouter la prononciation",
    startStory: "Lire l'histoire animée",
    listenAyah: "Écouter la récitation",
    pause: "Pause",
    resume: "Reprendre",
    next: "Suivant",
    previous: "Précédent",
    checkAnswer: "Vérifier",
    congratulations: "Bravo champion !",
    tryAgain: "Essaie encore !",
    learnMore: "En savoir plus",
    badgeUnlocked: "Nouveau Badge Débloqué !",
    shareMilestone: "Partager ma réussite",
    aiCompanionName: "Noor l'Ami Sage",
    aiAskPlaceholder: "Pose une question sur les lettres, un prophète ou un mot...",
    aiButton: "Conseiller IA",
    screenTimeLeft: "Temps d'écran restant",
    screenTimeAlertTitle: "C'est l'heure de la pause !",
    screenTimeAlertDesc: "Tu as bien travaillé aujourd'hui ! Repose tes yeux et reviens demain pour plus d'aventures.",
    dailyGoalReached: "Objectif du jour accompli !",
    studentDiplomaTitle: "Diplôme d'Excellence NoorKids",
    printPdf: "Exporter en PDF / Imprimer",
    offlineReady: "Mode hors ligne actif",
    tajweedLegend: "Règles de Tajwid simplifiées",
  },
  en: {
    appName: "NoorKids Arabic & Quran",
    appSubtitle: "The Playful Adventure for Young Learners",
    creatorCredit: "Created with love by Maryam and her son",
    navAlphabet: "Alphabet",
    navDailyWord: "Daily Word",
    navPuzzle: "Word Puzzles",
    navMaze: "Letter Maze",
    navStories: "Prophet Stories",
    navQuran: "Holy Quran",
    navQuiz: "Quizzes",
    navVoiceQuiz: "Voice Quiz",
    navLeaderboard: "Leaderboard",
    navParental: "Parents",
    navAdmin: "Admin",
    navDictionary: "Dictionary",
    starsLabel: "Stars",
    gemsLabel: "Gems",
    streakLabel: "Streak",
    streakDays: "days in a row",
    themeToggle: "Dark / Light Theme",
    soundToggle: "Sound & Music",
    playAudio: "Listen to pronunciation",
    startStory: "Read animated story",
    listenAyah: "Listen to recitation",
    pause: "Pause",
    resume: "Resume",
    next: "Next",
    previous: "Previous",
    checkAnswer: "Check",
    congratulations: "Well done champion!",
    tryAgain: "Try again!",
    learnMore: "Learn more",
    badgeUnlocked: "New Badge Unlocked!",
    shareMilestone: "Share my achievement",
    aiCompanionName: "Noor the Wise Friend",
    aiAskPlaceholder: "Ask a question about letters, prophets or Arabic...",
    aiButton: "AI Companion",
    screenTimeLeft: "Screen time remaining",
    screenTimeAlertTitle: "Time for a break!",
    screenTimeAlertDesc: "You did great work today! Rest your eyes and come back tomorrow for more adventures.",
    dailyGoalReached: "Daily goal achieved!",
    studentDiplomaTitle: "NoorKids Certificate of Excellence",
    printPdf: "Export PDF / Print",
    offlineReady: "Offline mode active",
    tajweedLegend: "Simplified Tajweed Rules",
  },
  ar: {
    appName: "نور كيدز - العربية والقرآن",
    appSubtitle: "المغامرة التعليمية الممتعة للعلماء الصغار",
    creatorCredit: "صُنِع بحب من قِبَل مريم وابنها",
    navAlphabet: "الحروف",
    navDailyWord: "كلمة اليوم",
    navPuzzle: "ألغاز الكلمات",
    navMaze: "متاهة الحروف",
    navStories: "قصص الأنبياء",
    navQuran: "القرآن الكريم",
    navQuiz: "الاختبارات",
    navVoiceQuiz: "التحدي الصوتي",
    navLeaderboard: "لوحة الشرف",
    navParental: "ولي الأمر",
    navAdmin: "المعلم",
    navDictionary: "القاموس البصري",
    starsLabel: "النجوم",
    gemsLabel: "الجواهر",
    streakLabel: "الحماس",
    streakDays: "أيام متتالية",
    themeToggle: "المظهر الليلي / النهاري",
    soundToggle: "الصوت والموسيقى",
    playAudio: "استمع إلى النطق",
    startStory: "اقرأ القصة المصورة",
    listenAyah: "استمع إلى التلاوة",
    pause: "إيقاف مؤقت",
    resume: "متابعة",
    next: "التالي",
    previous: "السابق",
    checkAnswer: "تحقق",
    congratulations: "أحسنت يا بطل !",
    tryAgain: "حاول مرة أخرى !",
    learnMore: "تعرف على المزيد",
    badgeUnlocked: "تم فتح وسام جديد !",
    shareMilestone: "شارك إنجازي",
    aiCompanionName: "نور الصديق الحكيم",
    aiAskPlaceholder: "اسأل عن حرف أو نبي أو كلمة عربية...",
    aiButton: "المساعد الذكي",
    screenTimeLeft: "الوقت المتبقي للشاشة",
    screenTimeAlertTitle: "حان وقت الراحة !",
    screenTimeAlertDesc: "أحسنت صنعاً اليوم ! أرح عينيك ونلتقي غداً في مغامرة جديدة.",
    dailyGoalReached: "تحقق هدف اليوم !",
    studentDiplomaTitle: "شهادة تفوق نور كيدز",
    printPdf: "تصدير كـ PDF / طباعة",
    offlineReady: "يعمل دون إنترنت",
    tajweedLegend: "أحكام التجويد المبسطة",
  },
  es: {
    appName: "NoorKids Árabe y Corán",
    appSubtitle: "La Aventura Divertida para Pequeños Sabios",
    creatorCredit: "Creado con amor por Maryam y su hijo",
    navAlphabet: "Alfabeto",
    navDailyWord: "Palabra del Día",
    navPuzzle: "Puzles de Palabras",
    navMaze: "Laberinto",
    navStories: "Historias Profetas",
    navQuran: "Santo Corán",
    navQuiz: "Cuestionarios",
    navVoiceQuiz: "Quiz de Voz",
    navLeaderboard: "Clasificación",
    navParental: "Padres",
    navAdmin: "Admin",
    navDictionary: "Diccionario",
    starsLabel: "Estrellas",
    gemsLabel: "Gemas",
    streakLabel: "Racha",
    streakDays: "días seguidos",
    themeToggle: "Tema Oscuro / Claro",
    soundToggle: "Sonido y Música",
    playAudio: "Escuchar pronunciación",
    startStory: "Leer historia animada",
    listenAyah: "Escuchar recitación",
    pause: "Pausa",
    resume: "Reanudar",
    next: "Siguiente",
    previous: "Anterior",
    checkAnswer: "Comprobar",
    congratulations: "¡Bravo campeón!",
    tryAgain: "¡Inténtalo de nuevo!",
    learnMore: "Saber más",
    badgeUnlocked: "¡Nueva insignia desbloqueada!",
    shareMilestone: "Compartir mi logro",
    aiCompanionName: "Noor el Amigo Sabio",
    aiAskPlaceholder: "Haz una pregunta sobre letras, profetas o palabras...",
    aiButton: "Guía IA",
    screenTimeLeft: "Tiempo de pantalla restante",
    screenTimeAlertTitle: "¡Hora de un descanso!",
    screenTimeAlertDesc: "¡Has trabajado genial hoy! Descansa la vista y vuelve mañana.",
    dailyGoalReached: "¡Objetivo diario cumplido!",
    studentDiplomaTitle: "Diploma de Excelencia NoorKids",
    printPdf: "Exportar a PDF / Imprimir",
    offlineReady: "Modo sin conexión activo",
    tajweedLegend: "Reglas de Taywid simplificadas",
  },
};
