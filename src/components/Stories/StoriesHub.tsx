import React, { useState } from 'react';
import { Story, Language } from '../../types';
import { STORIES_DATA } from '../../data/storiesData';
import { STORY_IMAGES } from '../../assets/images';
import { StoryReader } from './StoryReader';
import { ProphetsTreeModal } from './ProphetsTreeModal';
import { sound } from '../../utils/soundEngine';
import { BookOpen, Sparkles, CheckCircle2, Trees, Play, Award } from 'lucide-react';

interface StoriesHubProps {
  lang: Language;
  readStoryIds: string[];
  onReward: (stars: number, gems: number, storyId: string) => void;
}

export const StoriesHub: React.FC<StoriesHubProps> = ({ lang, readStoryIds, onReward }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'prophets' | 'literature'>('all');
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [isTreeOpen, setIsTreeOpen] = useState<boolean>(false);

  const categories = [
    { id: 'all', label: { fr: 'Toutes les Histoires', ar: 'جميع القصص', en: 'All Stories', es: 'Todas las Historias' } },
    { id: 'prophets', label: { fr: 'Prophètes & Grandes Campagnes', ar: 'الأنبياء والغزوات الكبرى', en: 'Prophets & Battles', es: 'Profetas y Campañas' } },
    { id: 'literature', label: { fr: 'Littérature & Fables (Kalila)', ar: 'أدب الأطفال وكليلة ودمنة', en: 'Literature & Fables', es: 'Literatura y Fábulas' } },
  ];

  const filteredStories = activeCategory === 'all'
    ? STORIES_DATA
    : STORIES_DATA.filter((s) => s.category === activeCategory);

  const handleOpenStory = (story: Story) => {
    sound.playPop();
    setSelectedStory(story);
  };

  const handleStoryCompleted = (storyId: string) => {
    onReward(30, 4, storyId);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Tree of Prophets CTA */}
      <div className="relative rounded-3xl overflow-hidden p-6 md:p-8 bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-600 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'مكتبة الحكايات التفاعلية المصورة' : 'Bibliothèque Animée avec Voix & Images IA'}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black font-['Fredoka']">
            {lang === 'ar' ? 'قصص الأنبياء، المعارك الكبرى والأدب' : 'Histoires des Prophètes & Littérature Enfants'}
          </h2>
          <p className="text-xs sm:text-sm text-amber-100 leading-relaxed">
            {lang === 'ar'
              ? 'رحلات ملهمة، بطولات بدر والخندق، فتح مكة، وحكايات كليلة ودمنة الذكية بصور ورسوم مبهجة.'
              : 'Des récits remplis de sagesse, la clémence de Badr et Fath Makkah, et les fables de Kalila & Dimna avec audio et images générées par IA.'}
          </p>
        </div>

        {/* Tree of Prophets Button */}
        <button
          onClick={() => {
            sound.playPop();
            setIsTreeOpen(true);
          }}
          className="flex items-center gap-3 px-6 py-4 rounded-3xl bg-white text-slate-900 font-extrabold text-sm shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer border-3 border-amber-300"
        >
          <Trees className="w-7 h-7 text-emerald-600 animate-pulse" />
          <div className="text-left">
            <div className="text-[10px] uppercase font-bold text-emerald-700">
              {lang === 'ar' ? 'استكشف الآن' : 'Nouveau !'}
            </div>
            <div className="text-sm font-black font-['Fredoka']">
              {lang === 'ar' ? 'شَجَرَةُ الأَنْبِيَاءِ الكِرَام' : "L'Arbre des Prophètes"}
            </div>
          </div>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              sound.playPop();
              setActiveCategory(cat.id as any);
            }}
            className={`px-4 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {cat.label[lang] || cat.label.fr}
          </button>
        ))}
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStories.map((s) => {
          const isRead = readStoryIds.includes(s.id);
          const firstPageImg = STORY_IMAGES[s.pages[0]?.illustrationKey];

          return (
            <div
              key={s.id}
              onClick={() => handleOpenStory(s)}
              className="group bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border-3 border-slate-200 dark:border-slate-700 hover:border-amber-400 transition-all shadow-md hover:shadow-xl hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Story Image / Preview */}
                <div className="relative h-44 sm:h-48 overflow-hidden bg-slate-100 dark:bg-slate-900">
                  {firstPageImg ? (
                    <img
                      src={firstPageImg}
                      alt={s.title[lang]}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">
                      {s.coverEmoji}
                    </div>
                  )}

                  {/* Badges Overlay */}
                  <div className="absolute top-3 right-3 flex items-center gap-2">
                    {isRead ? (
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500 text-white font-bold text-[11px] shadow-sm">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Lu
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-amber-500 text-white font-bold text-[11px] shadow-sm">
                        Nouveau
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-white font-bold text-xs">
                    {s.pages.length} pages
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-5">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-600 dark:text-amber-400 mb-1">
                    <span>{s.hero}</span>
                    <span className="font-['Amiri'] text-sm" dir="rtl">
                      {s.arabicTitle}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-slate-800 dark:text-white font-['Fredoka'] group-hover:text-amber-600 transition-colors">
                    {s.title[lang] || s.title.fr}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2">
                    {s.summary[lang] || s.summary.fr}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-5 pt-0">
                <div className="w-full py-2.5 rounded-2xl bg-amber-50 dark:bg-slate-700/60 group-hover:bg-amber-500 group-hover:text-white text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-all">
                  <BookOpen className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'اقرأ القصة واستمع إليها' : "Ouvrir l'histoire"}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reader Modal */}
      {selectedStory && (
        <StoryReader
          story={selectedStory}
          isOpen={!!selectedStory}
          onClose={() => setSelectedStory(null)}
          lang={lang}
          onStoryCompleted={handleStoryCompleted}
        />
      )}

      {/* Tree of Prophets Modal */}
      <ProphetsTreeModal
        isOpen={isTreeOpen}
        onClose={() => setIsTreeOpen(false)}
        lang={lang}
        onOpenStory={(storyId) => {
          const match = STORIES_DATA.find((s) => s.id === storyId);
          if (match) setSelectedStory(match);
        }}
      />
    </div>
  );
};
