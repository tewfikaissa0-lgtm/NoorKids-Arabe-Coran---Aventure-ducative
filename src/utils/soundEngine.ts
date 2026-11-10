/**
 * NoorKids Web Audio & Speech Engine
 * High quality procedural chimes, fanfares, ambient loops and speech narration
 * Created for Maryam et son fils
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private musicEnabled: boolean = true;
  private currentAyahAudio: HTMLAudioElement | null = null;
  private ambientOscillators: { osc: OscillatorNode; gain: GainNode }[] = [];
  private ambientGain: GainNode | null = null;

  constructor() {
    // AudioContext will be initialized on first user gesture
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  public setMusicEnabled(enabled: boolean) {
    this.musicEnabled = enabled;
    if (!enabled) {
      this.stopAmbient();
    }
  }

  public isSoundEnabled() {
    return this.soundEnabled;
  }

  public isMusicEnabled() {
    return this.musicEnabled;
  }

  // 1. Playful pop click
  public playPop() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch {
      // AudioContext may be blocked before interaction
    }
  }

  // 2. Star reward chime
  public playStarChime() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, index) => {
      if (!this.ctx) return;
      const startTime = this.ctx.currentTime + index * 0.07;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.35);
    });
  }

  // 3. Gem pickup sound
  public playGemPickup() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const notes = [880, 1318.51]; // A5, E6
    notes.forEach((freq, index) => {
      if (!this.ctx) return;
      const startTime = this.ctx.currentTime + index * 0.05;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.25, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.2);
    });
  }

  // 4. Celebration fanfare (big win / completed surah / maze win)
  public playCelebrationFanfare() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    const chords = [
      { notes: [523.25, 659.25], delay: 0 },
      { notes: [587.33, 698.46], delay: 0.12 },
      { notes: [659.25, 783.99], delay: 0.24 },
      { notes: [783.99, 1046.5, 1318.51], delay: 0.38, duration: 0.8 },
    ];

    chords.forEach(({ notes, delay, duration = 0.3 }) => {
      notes.forEach((freq) => {
        if (!this.ctx) return;
        const startTime = this.ctx.currentTime + delay;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.18, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration);
      });
    });
  }

  // 5. Gentle boing (friendly mistake)
  public playGentleBoing() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(160, this.ctx.currentTime + 0.2);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.2);
    } catch {}
  }

  // 6. Ambient background nature / harp sound
  public playAmbient(type: 'desert_wind' | 'ocean_waves' | 'peaceful_lute' = 'peaceful_lute') {
    if (!this.musicEnabled) return;
    this.stopAmbient();
    this.initContext();
    if (!this.ctx) return;

    try {
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      this.ambientGain.connect(this.ctx.destination);

      if (type === 'peaceful_lute') {
        const freqs = [220, 277.18, 329.63, 440];
        freqs.forEach((freq, idx) => {
          if (!this.ctx || !this.ambientGain) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

          // Subtle LFO modulation
          gain.gain.setValueAtTime(0.03 / (idx + 1), this.ctx.currentTime);
          osc.connect(gain);
          gain.connect(this.ambientGain);

          osc.start();
          this.ambientOscillators.push({ osc, gain });
        });
      }
    } catch {}
  }

  public stopAmbient() {
    this.ambientOscillators.forEach(({ osc }) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {}
    });
    this.ambientOscillators = [];
    if (this.ambientGain) {
      try {
        this.ambientGain.disconnect();
      } catch {}
      this.ambientGain = null;
    }
  }

  // 7. Speech synthesis for Arabic letters, words and story narration
  public speakArabic(text: string, onEnd?: () => void) {
    if (!this.soundEnabled || typeof window === 'undefined' || !window.speechSynthesis) {
      if (onEnd) onEnd();
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.85; // Slightly slower for children
      utterance.pitch = 1.1; // Cheerful friendly pitch

      // Try to find an Arabic voice if available
      const voices = window.speechSynthesis.getVoices();
      const arabicVoice = voices.find((v) => v.lang.startsWith('ar'));
      if (arabicVoice) {
        utterance.voice = arabicVoice;
      }

      utterance.onend = () => {
        if (onEnd) onEnd();
      };
      utterance.onerror = () => {
        if (onEnd) onEnd();
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      if (onEnd) onEnd();
    }
  }

  // 8. Story read-aloud in selected language
  public speakStoryText(text: string, lang: string = 'fr', rate: number = 0.9, onEnd?: () => void) {
    if (!this.soundEnabled || typeof window === 'undefined' || !window.speechSynthesis) {
      if (onEnd) onEnd();
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const langMap: Record<string, string> = {
        fr: 'fr-FR',
        en: 'en-US',
        ar: 'ar-SA',
        es: 'es-ES',
      };
      utterance.lang = langMap[lang] || 'fr-FR';
      utterance.rate = rate;
      utterance.pitch = 1.05;

      const voices = window.speechSynthesis.getVoices();
      const matchingVoice = voices.find((v) => v.lang.startsWith(lang));
      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }

      utterance.onend = () => {
        if (onEnd) onEnd();
      };
      utterance.onerror = () => {
        if (onEnd) onEnd();
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      if (onEnd) onEnd();
    }
  }

  public stopSpeaking() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (this.currentAyahAudio) {
      this.currentAyahAudio.pause();
      this.currentAyahAudio = null;
    }
  }

  // 9. Quran Ayah Audio Player with fallback
  public playAyahAudio(
    globalAyahNumber: number,
    onEnded?: () => void,
    onError?: () => void
  ): HTMLAudioElement {
    this.stopSpeaking();

    // Standard high-reliability Islamic Network Quran CDN (Mishary Rashid Alafasy)
    const audioUrl = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${globalAyahNumber}.mp3`;
    const audio = new Audio(audioUrl);
    this.currentAyahAudio = audio;

    audio.onended = () => {
      this.currentAyahAudio = null;
      if (onEnded) onEnded();
    };

    audio.onerror = () => {
      this.currentAyahAudio = null;
      if (onError) onError();
    };

    audio.play().catch(() => {
      if (onError) onError();
    });

    return audio;
  }
}

export const sound = new SoundEngine();
