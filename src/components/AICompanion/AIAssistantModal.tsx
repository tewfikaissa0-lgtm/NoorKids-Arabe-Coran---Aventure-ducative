import React, { useState } from 'react';
import { Language, StudentProfile } from '../../types';
import { sound } from '../../utils/soundEngine';
import { Sparkles, Send, Volume2, X, Bot, BookOpen, Lightbulb, Heart } from 'lucide-react';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  student: StudentProfile;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  lang,
  student,
}) => {
  const [messages, setMessages] = useState<{ sender: 'ai' | 'user'; text: string }[]>([
    {
      sender: 'ai',
      text:
        lang === 'ar'
          ? `مرحباً بك يا بطلنا ${student.name} ! 🌟 أنا "نور الصديق الحكيم". اسألني عن الحروف، أو قصص الأنبياء، أو اطلب مني قصة مشوقة عن مكارم الأخلاق !`
          : `Bonjour cher petit savant ${student.name} ! 🌟 Je suis "Noor l'Ami Sage". Tu peux me poser des questions sur les lettres arabes, les prophètes, ou me demander une merveilleuse histoire sur mesure !`,
    },
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const quickPrompts: Record<Language, string>[] = [
    {
      fr: "Raconte-moi une courte histoire sur la générosité avec des mots arabes",
      ar: "احكِ لي قصة قصيرة عن الكرم والإحسان باللغة العربية",
      en: "Tell me a short story about generosity with Arabic words",
      es: "Cuéntame una historia corta sobre la generosidad con palabras árabes",
    },
    {
      fr: "Pourquoi la lettre Ba (ب) a-t-elle un point en dessous ?",
      ar: "لماذا يوجد تحت حرف الباء نقطة واحدة ؟",
      en: "Why does the letter Ba (ب) have a dot underneath?",
      es: "¿Por qué la letra Ba (ب) tiene un punto debajo?",
    },
    {
      fr: "Quelle sourate me recommandes-tu de lire aujourd'hui ?",
      ar: "أي سورة تنصحني بقراءتها وحفظها اليوم ؟",
      en: "Which surah do you recommend I read today?",
      es: "¿Qué sura me recomiendas leer hoy?",
    },
    {
      fr: "Comment dire 'Je t’aime maman' en arabe ?",
      ar: "كيف أقول 'أحبك يا أمي' باللغة العربية ؟",
      en: "How do you say 'I love you mom' in Arabic?",
      es: "¿Cómo se dice 'Te quiero mamá' en árabe?",
    },
  ];

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    sound.playPop();
    const userMsg = textToSend.trim();
    setInputText('');
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/story-helper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userMsg,
          language: lang,
          childName: student.name,
          age: student.level === 'Débutant' ? 5 : student.level === 'Intermédiaire' ? 7 : 10,
        }),
      });

      const data = await response.json();
      const reply = data.reply || "C'est une excellente question mon ami ! Continue toujours d'apprendre avec curiosité.";
      setMessages((prev) => [...prev, { sender: 'ai', text: reply }]);
      sound.playStarChime();
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text:
            lang === 'ar'
              ? 'أحسنت يا بطلنا الصغير ! العلم نور والأدب زينة، واستمر دائماً في تلاوة القرآن وتعلم لغة الضاد الجميلة ! 🌸'
              : 'Bravo petit savant ! La langue arabe est remplie de trésors et de douceur. Continue chaque jour avec le sourire ! 🌸',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeakText = (text: string) => {
    sound.playPop();
    sound.speakStoryText(text, lang, 0.95);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 md:p-7 max-w-2xl w-full shadow-2xl border-4 border-amber-400 max-h-[90vh] overflow-hidden flex flex-col justify-between">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center text-2xl shadow-md">
              <Bot className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-slate-800 dark:text-white font-['Fredoka']">
                  Noor l'Ami Sage
                </h3>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  IA Guide
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {lang === 'ar' ? 'مساعد الحكايات والتوجيه الذكي' : 'Conseiller d’histoires & guide de lecture'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.stopSpeaking();
              sound.playPop();
              onClose();
            }}
            className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Stream */}
        <div className="my-4 space-y-3 overflow-y-auto max-h-[380px] p-2 pr-3">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 text-sm shadow-xs mt-1">
                  🌟
                </div>
              )}

              <div
                className={`p-4 rounded-2xl max-w-[85%] text-xs sm:text-sm leading-relaxed shadow-xs relative group ${
                  m.sender === 'user'
                    ? 'bg-amber-500 text-white rounded-br-none'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-200 dark:border-slate-700'
                }`}
              >
                <p className="whitespace-pre-line">{m.text}</p>
                {m.sender === 'ai' && (
                  <button
                    onClick={() => handleSpeakText(m.text)}
                    className="mt-2 text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 hover:underline"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{lang === 'ar' ? 'استمع إلى القصة' : 'Écouter'}</span>
                  </button>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 font-bold animate-pulse p-2">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>{lang === 'ar' ? 'نور يفكّر في حكاية لطيفة...' : 'Noor prépare une belle réponse...'}</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-3 no-scrollbar">
          {quickPrompts.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(q[lang] || q.fr)}
              className="px-3 py-1.5 rounded-full bg-amber-50 dark:bg-slate-800 border border-amber-300 dark:border-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap hover:bg-amber-100 transition-colors cursor-pointer"
            >
              💬 {q[lang] || q.fr}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputText);
          }}
          className="flex items-center gap-2 pt-3 border-t border-slate-200 dark:border-slate-800"
        >
          <input
            type="text"
            placeholder={
              lang === 'ar'
                ? 'اكتب سؤالك لنور الصديق الحكيم...'
                : 'Pose ta question ou demande une histoire...'
            }
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md hover:scale-105 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
