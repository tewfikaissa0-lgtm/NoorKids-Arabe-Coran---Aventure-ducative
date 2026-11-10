import React, { useState, useEffect } from 'react';
import { sound, MusicTrack } from '../utils/soundEngine';
import { Language } from '../types';
import { Volume2, VolumeX, Music, Play, Pause, ChevronUp, ChevronDown, Sparkles } from 'lucide-react';

interface SoundBarProps {
  lang: Language;
}

export const SoundBar: React.FC<SoundBarProps> = ({ lang }) => {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(sound.getIsUnlocked());
  const [isSoundOn, setIsSoundOn] = useState<boolean>(sound.isSoundEnabled());
  const [isMusicOn, setIsMusicOn] = useState<boolean>(sound.isMusicEnabled());
  const [currentTrack, setCurrentTrack] = useState<MusicTrack>(sound.getCurrentTrack());
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(75);

  useEffect(() => {
    const unsubscribe = sound.subscribe((event, data) => {
      if (event === 'unlocked') {
        setIsUnlocked(true);
        setIsMusicOn(sound.isMusicEnabled());
      } else if (event === 'soundToggled') {
        setIsSoundOn(data);
      } else if (event === 'musicToggled') {
        setIsMusicOn(data);
      } else if (event === 'trackChanged') {
        setCurrentTrack(data);
      } else if (event === 'musicStopped') {
        setIsMusicOn(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleUnlockAudio = () => {
    sound.unlockAudio();
    sound.playStarChime();
    setIsUnlocked(true);
    setIsMusicOn(true);
  };

  const handleToggleSound = () => {
    const next = !isSoundOn;
    sound.setSoundEnabled(next);
    setIsSoundOn(next);
    if (next) sound.playPop();
  };

  const handleToggleMusic = () => {
    const next = !isMusicOn;
    sound.setMusicEnabled(next);
    setIsMusicOn(next);
    if (next) {
      sound.playPop();
      sound.startMusic(currentTrack);
    }
  };

  const handleChangeTrack = (track: MusicTrack) => {
    sound.playPop();
    setCurrentTrack(track);
    if (!isMusicOn) {
      sound.setMusicEnabled(true);
      setIsMusicOn(true);
    }
    sound.startMusic(track);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVolume(val);
    sound.setMusicVolume((val / 100) * 0.35);
    sound.setSfxVolume((val / 100) * 0.8);
  };

  const trackLabels: Record<MusicTrack, { fr: string; ar: string; en: string; es: string; emoji: string }> = {
    noorkids_adventure: {
      fr: 'Aventure Joyeuse',
      ar: 'مغامرة نور كيدز',
      en: 'Happy Adventure',
      es: 'Aventura Feliz',
      emoji: '🌟',
    },
    vocal_nasheed: {
      fr: 'Voix Humaine & Anachid',
      ar: 'أناشيد وأصوات بشرية',
      en: 'Human Vocal Acapella',
      es: 'Vocal Humano Acapella',
      emoji: '🎙️',
    },
    desert_oasis: {
      fr: 'Oasis & Histoires',
      ar: 'واحة الأنبياء',
      en: 'Oasis & Stories',
      es: 'Oasis de Historias',
      emoji: '🏜️',
    },
    jannah_garden: {
      fr: 'Jardin & Coran',
      ar: 'روضة القرآن',
      en: 'Jannah & Quran',
      es: 'Jardín y Corán',
      emoji: '🌿',
    },
    arcade_play: {
      fr: 'Arcade & Jeux',
      ar: 'ألعاب ومتاهة',
      en: 'Arcade Fun',
      es: 'Arcade y Juegos',
      emoji: '🎮',
    },
  };

  // If audio is locked on initial page load (due to browser autoplay policies), show cheerful tap-to-start banner
  if (!isUnlocked) {
    return (
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-md w-[92%] animate-bounce">
        <button
          onClick={handleUnlockAudio}
          className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-amber-500/30 border-2 border-white/60 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">🎵</span>
            <span>
              {lang === 'ar'
                ? 'اضغط هنا لتشغيل الموسيقى والأصوات الممتعة !'
                : 'Clique ici pour allumer la musique et les sons magiques !'}
            </span>
          </div>
          <span className="p-1.5 rounded-xl bg-white/20 text-white font-extrabold text-xs">
            🔊 ON
          </span>
        </button>
      </div>
    );
  }

  // Floating Minimized Pill
  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={() => {
            sound.playPop();
            setIsMinimized(false);
          }}
          className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-2 border-amber-400 text-slate-800 dark:text-white shadow-lg hover:scale-105 transition-all text-xs font-bold cursor-pointer"
          title="Ouvrir le contrôleur audio"
        >
          <span className={`w-2.5 h-2.5 rounded-full ${isMusicOn ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
          <Music className={`w-4 h-4 ${isMusicOn ? 'text-amber-500 animate-pulse' : 'text-slate-400'}`} />
          <span className="hidden sm:inline font-['Fredoka']">
            {trackLabels[currentTrack].emoji} {trackLabels[currentTrack][lang] || trackLabels[currentTrack].fr}
          </span>
          <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 max-w-sm w-[90%] sm:w-auto animate-fadeIn">
      <div className="p-3 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-2 border-amber-300 dark:border-slate-700 shadow-2xl text-slate-800 dark:text-slate-100 space-y-2">
        {/* Header with track name and minimize */}
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-300">
              <Music className={`w-3.5 h-3.5 ${isMusicOn ? 'animate-bounce' : ''}`} />
            </span>
            <div className="leading-tight">
              <div className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                {lang === 'ar' ? 'الموسيقى التعليمية' : 'Musique & Ambiance'}
              </div>
              <div className="text-xs font-bold font-['Fredoka'] text-slate-800 dark:text-white truncate max-w-[150px]">
                {trackLabels[currentTrack].emoji} {trackLabels[currentTrack][lang] || trackLabels[currentTrack].fr}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                sound.playPop();
                setIsMinimized(true);
              }}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              title="Réduire"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick controls: Music Play/Pause, Sound FX, Volume */}
        <div className="flex items-center justify-between gap-2">
          {/* Music Play/Pause Toggle */}
          <button
            onClick={handleToggleMusic}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isMusicOn
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            {isMusicOn ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isMusicOn ? (lang === 'ar' ? 'إيقاف' : 'Pause') : (lang === 'ar' ? 'تشغيل' : 'Musique')}</span>
          </button>

          {/* Sound FX Toggle */}
          <button
            onClick={handleToggleSound}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isSoundOn
                ? 'bg-emerald-500 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-slate-200'
            }`}
            title="Effets sonores (bruitages)"
          >
            {isSoundOn ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{isSoundOn ? (lang === 'ar' ? 'المؤثرات' : 'Bruitages') : (lang === 'ar' ? 'مكتوم' : 'Muet')}</span>
          </button>

          {/* Volume slider */}
          <div className="flex items-center gap-1.5">
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
              className="w-16 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
              title="Volume général"
            />
          </div>
        </div>

        {/* Track quick presets */}
        <div className="grid grid-cols-2 gap-1 pt-1">
          {(Object.keys(trackLabels) as MusicTrack[]).map((tr) => (
            <button
              key={tr}
              onClick={() => handleChangeTrack(tr)}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold text-left truncate transition-colors cursor-pointer ${
                currentTrack === tr && isMusicOn
                  ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-700'
                  : 'bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {trackLabels[tr].emoji} {trackLabels[tr][lang] || trackLabels[tr].fr}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
