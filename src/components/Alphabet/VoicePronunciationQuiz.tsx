import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { ArabicLetter, Language, DailyWord } from '../../types';
import { ALPHABET_DATA } from '../../data/alphabetData';
import { DAILY_WORDS_DATA } from '../../data/dailyWordsData';
import { sound } from '../../utils/soundEngine';
import {
  Mic,
  MicOff,
  Volume2,
  Trophy,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  AlertCircle,
  ChevronRight,
  Flame,
  Award,
} from 'lucide-react';

interface VoicePronunciationQuizProps {
  lang: Language;
  onReward: (stars: number, gems: number, badgeId?: string) => void;
}

type QuizItemType = 'letter' | 'word';

interface TargetItem {
  id: string;
  type: QuizItemType;
  arabicText: string;
  cleanArabic: string;
  name: string;
  transliteration: string;
  translation: string;
  emoji: string;
  phoneticTip: string;
  aliases: string[];
}

export const VoicePronunciationQuiz: React.FC<VoicePronunciationQuizProps> = ({
  lang,
  onReward,
}) => {
  const [mode, setMode] = useState<QuizItemType>('letter');
  const [currentItem, setCurrentItem] = useState<TargetItem | null>(null);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [feedback, setFeedback] = useState<{
    status: 'idle' | 'listening' | 'success' | 'retry';
    message: string;
  }>({ status: 'idle', message: '' });
  const [streak, setStreak] = useState<number>(0);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [speechSupported, setSpeechSupported] = useState<boolean>(true);

  const recognitionRef = useRef<any>(null);

  // Helper to remove Arabic diacritics / tashkeel for fuzzy matching
  const stripTashkeel = (text: string): string => {
    return text
      .normalize('NFKD')
      .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '')
      .replace(/[إأآا]/g, 'ا')
      .replace(/ة/g, 'ه')
      .replace(/ى/g, 'ي')
      .trim()
      .toLowerCase();
  };

  // Build target item
  const pickRandomItem = (targetMode: QuizItemType) => {
    sound.playPop();
    setTranscript('');
    setFeedback({ status: 'idle', message: '' });

    if (targetMode === 'letter') {
      const letter = ALPHABET_DATA[Math.floor(Math.random() * ALPHABET_DATA.length)];
      const target: TargetItem = {
        id: letter.id,
        type: 'letter',
        arabicText: letter.letter,
        cleanArabic: stripTashkeel(letter.letter),
        name: letter.name,
        transliteration: letter.transliteration,
        translation: letter.exampleWord.meaning[lang] || letter.name,
        emoji: letter.exampleWord.emoji,
        phoneticTip: letter.phoneticTip[lang] || letter.phoneticTip.fr,
        aliases: [
          letter.letter,
          letter.name.toLowerCase(),
          letter.arabicName,
          stripTashkeel(letter.arabicName),
          letter.transliteration.toLowerCase(),
          // common phonemes
          letter.name.toLowerCase() + 'a',
          letter.name.toLowerCase() + 'ah',
        ],
      };
      setCurrentItem(target);
    } else {
      const word = DAILY_WORDS_DATA[Math.floor(Math.random() * DAILY_WORDS_DATA.length)];
      const target: TargetItem = {
        id: word.id,
        type: 'word',
        arabicText: word.arabic,
        cleanArabic: stripTashkeel(word.arabic),
        name: word.transliteration,
        transliteration: word.transliteration,
        translation: word.translations[lang] || word.translations.fr,
        emoji: word.emoji,
        phoneticTip: word.funFact[lang] || word.funFact.fr,
        aliases: [
          word.arabic,
          stripTashkeel(word.arabic),
          word.transliteration.toLowerCase(),
          word.id.toLowerCase(),
        ],
      };
      setCurrentItem(target);
    }
  };

  // Initialize Speech Recognition once
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        setSpeechSupported(false);
      }
    }
    pickRandomItem(mode);
  }, [mode, lang]);

  // Start voice recognition
  const startListening = () => {
    if (!currentItem) return;
    sound.playMicStart();

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      setFeedback({
        status: 'retry',
        message:
          lang === 'ar'
            ? 'متصفحك لا يدعم التعرف الصوتي المباشر، يمكنك استخدام زر التحقق اليدوي !'
            : 'La reconnaissance vocale n’est pas disponible sur ce navigateur. Tu peux utiliser le bouton de validation manuelle !',
      });
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      // Arabic language recognition
      recognition.lang = 'ar-SA';
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 5;

      recognition.onstart = () => {
        setIsListening(true);
        setFeedback({
          status: 'listening',
          message:
            lang === 'ar'
              ? 'أنا أستمع إليك الآن... انطق بوضوح !'
              : 'Écoute en cours... Parle bien fort et distinctement !',
        });
      };

      recognition.onresult = (event: any) => {
        setIsListening(false);
        const results = event.results[0];
        let recognizedWords: string[] = [];

        for (let i = 0; i < results.length; i++) {
          recognizedWords.push(results[i].transcript.trim());
        }

        const primarySpoken = results[0]?.transcript || '';
        setTranscript(primarySpoken);
        validatePronunciation(recognizedWords, currentItem);
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setFeedback({
            status: 'retry',
            message:
              lang === 'ar'
                ? 'يرجى السماح بالوصول إلى الميكروفون في المتصفح للتحدث.'
                : 'Veuillez autoriser le microphone dans votre navigateur pour parler.',
          });
        } else {
          setFeedback({
            status: 'retry',
            message:
              lang === 'ar'
                ? 'لم أتمكن من سماعك بوضوح. اضغط على الميكروفون وحاول مرة أخرى !'
                : 'Je n’ai pas bien entendu. Réécoute le son et réessaie !',
          });
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      setIsListening(false);
      setSpeechSupported(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // Validate recognized pronunciation against target
  const validatePronunciation = (candidates: string[], target: TargetItem) => {
    const cleanTarget = target.cleanArabic;
    const lowerTranslit = target.transliteration.toLowerCase();

    let matched = false;

    for (const phrase of candidates) {
      const cleanPhrase = stripTashkeel(phrase);
      const lowerPhrase = phrase.toLowerCase();

      // Direct Arabic text match
      if (cleanPhrase.includes(cleanTarget) || cleanTarget.includes(cleanPhrase)) {
        matched = true;
        break;
      }

      // Check aliases (name in Arabic or transliteration)
      for (const alias of target.aliases) {
        const cleanAlias = stripTashkeel(alias);
        if (
          cleanPhrase.includes(cleanAlias) ||
          cleanAlias.includes(cleanPhrase) ||
          lowerPhrase.includes(alias.toLowerCase())
        ) {
          matched = true;
          break;
        }
      }

      // Special relaxed phonetic checks for letters (e.g. "alif", "baa", "taa", etc.)
      if (target.type === 'letter' && lowerPhrase.includes(target.name.toLowerCase().slice(0, 2))) {
        matched = true;
        break;
      }
    }

    if (matched) {
      // Success!
      sound.playCelebrationFanfare();
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.6 },
      });

      const newStreak = streak + 1;
      setStreak(newStreak);
      setTotalScore((prev) => prev + 15);
      setFeedback({
        status: 'success',
        message:
          lang === 'ar'
            ? `ممتاز ورائع ! نطق متقن للحرف/الكلمة « ${target.arabicText} » (+15 ⭐)`
            : `Bravo champion ! Excellente prononciation de « ${target.arabicText} » (${target.name}) ! (+15 ⭐)`,
      });

      onReward(15, 2, newStreak >= 3 ? 'voice_star' : undefined);
    } else {
      // Gentle retry feedback
      sound.playGentleBoing();
      setStreak(0);
      setFeedback({
        status: 'retry',
        message:
          lang === 'ar'
            ? `محاولة جيدة ! استمع إلى الصوت النموذجي ثم أعد المحاولة بنشاط.`
            : `Bien essayé ! Écoute attentivement le modèle audio et réessaie avec le sourire.`,
      });
    }
  };

  // Manual fallback validation so kids are never blocked
  const handleManualPass = () => {
    if (!currentItem) return;
    sound.playStarChime();
    confetti({
      particleCount: 50,
      spread: 50,
      origin: { y: 0.7 },
    });

    const newStreak = streak + 1;
    setStreak(newStreak);
    setTotalScore((prev) => prev + 10);
    setFeedback({
      status: 'success',
      message:
        lang === 'ar'
          ? `أحسنت ! تم تأكيد نطقك للحرف بنجاح (+10 ⭐)`
          : `Bravo ! Prononciation validée avec succès (+10 ⭐)`,
    });
    onReward(10, 1, newStreak >= 3 ? 'voice_star' : undefined);
  };

  const handlePlayModelAudio = () => {
    if (!currentItem) return;
    sound.playHumanLetter(currentItem.id || currentItem.arabicText);
  };

  if (!currentItem) return null;

  return (
    <div className="bg-gradient-to-br from-rose-50 via-white to-amber-50 dark:from-slate-900 dark:via-slate-800 dark:to-rose-950/40 rounded-3xl p-6 md:p-8 shadow-xl border-3 border-rose-300 dark:border-rose-700/50 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-6 border-b border-rose-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white flex items-center justify-center text-2xl shadow-md">
            <Mic className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white font-['Fredoka']">
                {lang === 'ar' ? 'تحدي النطق الصوتي الذكي' : 'Quiz Vocal & Prononciation'}
              </h3>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                Web Speech API
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {lang === 'ar'
                ? 'انطق الحرف أو الكلمة بصوتك لتربح النجوم وتطور فصاحتك العربية !'
                : 'Prononce la lettre ou le mot à voix haute pour gagner des étoiles !'}
            </p>
          </div>
        </div>

        {/* Mode Selector & Streak Counter */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-extrabold text-xs">
            <Flame className="w-4 h-4 text-orange-500" />
            <span>{streak} en série</span>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              onClick={() => setMode('letter')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mode === 'letter'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {lang === 'ar' ? 'حروف' : 'Lettres'}
            </button>
            <button
              onClick={() => setMode('word')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mode === 'word'
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {lang === 'ar' ? 'كلمات' : 'Mots'}
            </button>
          </div>
        </div>
      </div>

      {/* Weekly Pronunciation Challenge Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-4 sm:p-5 rounded-3xl text-white shadow-lg mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shrink-0">
            🎙️✨
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base font-['Fredoka']">
              Défi de Prononciation Hebdomadaire
            </h3>
            <p className="text-xs text-amber-100">
              Prononcez <span className="font-['Amiri'] font-bold text-amber-200 text-sm">« بِسْمِ اللَّهِ »</span> pour gagner un badge exclusif !
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playStarChime();
            confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
            onReward(100, 30, 'weekly_voice_champion');
          }}
          className="px-4 py-2 rounded-2xl bg-white text-rose-700 font-black text-xs shadow-md hover:bg-amber-50 transition-colors cursor-pointer whitespace-nowrap"
        >
          Valider le Défi (⭐ 100 & 💎 30)
        </button>
      </div>

      {/* Target Letter / Word Card */}
      <div className="flex flex-col items-center text-center p-6 sm:p-8 bg-white dark:bg-slate-800/90 rounded-3xl border-2 border-rose-200 dark:border-slate-700 shadow-md relative mb-6">
        <span className="text-5xl mb-2">{currentItem.emoji}</span>

        {/* Arabic Character in large Amiri typography */}
        <div
          className="text-6xl sm:text-7xl font-bold font-['Amiri'] text-rose-600 dark:text-rose-400 my-2 tracking-wide"
          dir="rtl"
        >
          {currentItem.arabicText}
        </div>

        <div className="text-xl font-black text-slate-800 dark:text-white font-['Fredoka']">
          {currentItem.name}
        </div>
        <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">
          Signification : {currentItem.translation}
        </div>

        {/* Audio Model Guide Button */}
        <button
          onClick={handlePlayModelAudio}
          className="mt-4 flex items-center gap-2 px-4 py-2 rounded-full bg-rose-50 dark:bg-slate-700 text-rose-600 dark:text-rose-300 font-bold text-xs hover:bg-rose-100 transition-colors cursor-pointer"
        >
          <Volume2 className="w-4 h-4 animate-pulse" />
          <span>{lang === 'ar' ? 'استمع إلى النطق الصحيح أولاً' : 'Écouter le modèle sonore d’abord'}</span>
        </button>

        {/* Tip */}
        <div className="mt-3 text-xs text-amber-700 dark:text-amber-400 font-medium">
          💡 {currentItem.phoneticTip}
        </div>
      </div>

      {/* Interactive Microphone Button & Status */}
      <div className="flex flex-col items-center justify-center space-y-4 mb-6">
        {/* Pulsing Mic Circle */}
        <div className="relative flex items-center justify-center">
          {isListening && (
            <>
              <div
                className="absolute w-32 h-32 rounded-full bg-rose-400/30 animate-ping"
                style={{ animationDuration: '1.5s' }}
              />
              <div
                className="absolute w-28 h-28 rounded-full bg-rose-500/20 animate-pulse"
                style={{ animationDuration: '1s' }}
              />
            </>
          )}

          <button
            onClick={isListening ? stopListening : startListening}
            className={`relative z-10 w-24 h-24 rounded-full flex flex-col items-center justify-center shadow-xl transition-all cursor-pointer ${
              isListening
                ? 'bg-rose-600 text-white scale-110 shadow-rose-600/40 ring-4 ring-rose-400'
                : 'bg-gradient-to-tr from-rose-500 via-rose-600 to-amber-500 text-white hover:scale-105 active:scale-95 shadow-rose-500/30'
            }`}
          >
            <Mic className={`w-10 h-10 ${isListening ? 'animate-bounce' : ''}`} />
            <span className="text-[10px] font-black uppercase tracking-wider mt-1">
              {isListening
                ? (lang === 'ar' ? 'استماع...' : 'Écoute...')
                : (lang === 'ar' ? 'انطق الآن' : 'Parler')}
            </span>
          </button>
        </div>

        {/* Sound Wave Animation Visualizer */}
        {isListening && (
          <div className="flex items-center gap-1.5 h-6">
            {[0.4, 0.8, 1.2, 0.6, 1.4, 0.9, 0.5].map((h, i) => (
              <span
                key={i}
                className="w-1.5 bg-rose-500 rounded-full animate-pulse"
                style={{
                  height: `${h * 16}px`,
                  animationDuration: `${0.4 + (i % 3) * 0.2}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* What was heard */}
        {transcript && (
          <div className="px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-mono">
            {lang === 'ar' ? 'تم التقاط :' : 'Entendu :'} « <strong className="font-['Amiri'] text-sm">{transcript}</strong> »
          </div>
        )}

        {/* Feedback Banner */}
        {feedback.message && (
          <div
            className={`p-4 rounded-2xl w-full text-center text-xs sm:text-sm font-bold flex items-center justify-center gap-2 animate-fadeIn ${
              feedback.status === 'success'
                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300'
                : feedback.status === 'listening'
                ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200'
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300'
            }`}
          >
            {feedback.status === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : feedback.status === 'listening' ? (
              <Sparkles className="w-5 h-5 text-rose-500 shrink-0 animate-spin" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}
      </div>

      {/* Footer Controls: Next Card & Manual Validation */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
        {/* Manual fallback validation if microphone is unavailable or child spoke quietly */}
        <button
          onClick={handleManualPass}
          className="text-xs font-bold text-slate-500 hover:text-rose-600 dark:text-slate-400 flex items-center gap-1.5 cursor-pointer underline"
        >
          <Award className="w-4 h-4 text-amber-500" />
          <span>{lang === 'ar' ? 'تحقق يدوي (إذا تعذر الميكروفون)' : 'Valider manuellement'}</span>
        </button>

        <button
          onClick={() => pickRandomItem(mode)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold text-xs shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <span>{lang === 'ar' ? 'الحرف/الكلمة التالية' : 'Suivant'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
