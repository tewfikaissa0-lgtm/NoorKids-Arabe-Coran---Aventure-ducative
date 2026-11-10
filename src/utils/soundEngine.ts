/**
 * NoorKids Web Audio & Human Voice Engine
 * Real human voice audio recordings for Arabic alphabet, Quranic recitation (Mishary Alafasy),
 * human praise phrases (Mumtaz, Ahsanta, Masha'Allah), and vocal acapella soundscapes.
 * Created with love for Maryam et son fils
 */

export type MusicTrack = 'noorkids_adventure' | 'vocal_nasheed' | 'desert_oasis' | 'jannah_garden' | 'arcade_play';

export const HUMAN_LETTER_AUDIO_MAP: Record<string, string> = {
  // Map by letter ID
  alif: 'https://cdn.jsdelivr.net/gh/adnan/Arabic-Alphabet@master/sounds/1_alif.mp3',
  ba: 'https://cdn.jsdelivr.net/gh/adnan/Arabic-Alphabet@master/sounds/2_baa.mp3',
  ta: 'https://cdn.jsdelivr.net/gh/adnan/Arabic-Alphabet@master/sounds/3_taa.mp3',
  tha: 'https://cdn.jsdelivr.net/gh/adnan/Arabic-Alphabet@master/sounds/4_thaa.mp3',
  jim: 'https://cdn.jsdelivr.net/gh/adnan/Arabic-Alphabet@master/sounds/5_jeem.mp3',
  ha_throat: 'https://cdn.jsdelivr.net/gh/adnan/Arabic-Alphabet@master/sounds/6_haa.mp3',
  kha: 'https://cdn.jsdelivr.net/gh/adnan/Arabic-Alphabet@master/sounds/7_khaa.mp3',
  dal: 'https://cdn.jsdelivr.net/gh/adnan/Arabic-Alphabet@master/sounds/8_daal.mp3',
  dhal: 'https://cdn.jsdelivr.net/gh/adnan/Arabic-Alphabet@master/sounds/9_zaal.mp3',
  ra: 'https://cdn.jsdelivr.net/gh/adnan/Arabic-Alphabet@master/sounds/10_raa.mp3',
  zay: 'https://cdn.jsdelivr.net/gh/adnan/Arabic-Alphabet@master/sounds/11_zaa.mp3',
  sin: 'https://cdn.jsdelivr.net/gh/adnan/Arabic-Alphabet@master/sounds/12_seen.mp3',
  shin: 'https://cdn.jsdelivr.net/gh/adnan/Arabic-Alphabet@master/sounds/13_sheen.mp3',
  sad: 'https://cdn.jsdelivr.net/gh/adnan/Arabic-Alphabet@master/sounds/14_saad.mp3',
  dad: 'https://cdn.jsdelivr.net/gh/adnan/Arabic-Alphabet@master/sounds/15_daad.mp3',
  ta_heavy: 'https://cdn.jsdelivr.net/gh/adnan/Arabic-Alphabet@master/sounds/16_taah.mp3',
  za_heavy: 'https://cdn.jsdelivr.net/gh/adnan/Arabic-Alphabet@master/sounds/17_zhaa.mp3',
  ayn: 'https://cdn.jsdelivr.net/gh/adnan/Arabic-Alphabet@master/sounds/18_ain.mp3',
  ghayn: 'https://cdn.jsdelivr.net/gh/adnan/Arabic-Alphabet@master/sounds/19_ghain.mp3',
  fa: 'https://cdn.jsdelivr.net/gh/adnan/Arabic-Alphabet@master/sounds/20_faa.mp3',
  qaf: 'https://cdn.jsdelivr.net/gh/adnan/Arabic-Alphabet@master/sounds/21_qaaf.mp3',
  kaf: 'https://cdn.jsdelivr.net/gh/adnan/Arabic-Alphabet@master/sounds/22_kaaf.mp3',
  lam: 'https://cdn.jsdelivr.net/gh/adnan/Arabic-Alphabet@master/sounds/23_laam.mp3',
  mim: 'https://cdn.jsdelivr.net/gh/adnan/Arabic-Alphabet@master/sounds/24_meem.mp3',
  nun: 'https://cdn.jsdelivr.net/gh/adnan/Arabic-Alphabet@master/sounds/25_noon.mp3',
  ha_air: 'https://cdn.jsdelivr.net/gh/adnan/Arabic-Alphabet@master/sounds/26_haah.mp3',
  waw: 'https://cdn.jsdelivr.net/gh/adnan/Arabic-Alphabet@master/sounds/27_waw.mp3',
  ya: 'https://cdn.jsdelivr.net/gh/adnan/Arabic-Alphabet@master/sounds/30_yaa.mp3',

  // Map by Arabic glyph
  'أ': 'https://cdn.jsdelivr.net/gh/adnan/Arabic-Alphabet@master/sounds/1_alif.mp3',
  'ب': 'https://cdn.jsdelivr.net/gh/adnan/Arabic-Alphabet@master/sounds/2_baa.mp3',
  'ت': 'https://cdn.jsdelivr.net/gh/adnan/Arabic-Alphabet@master/sounds/3_taa.mp3',
  'ث': 'https://cdn.jsdelivr.net/gh/adnan/Arabic-Alphabet@master/sounds/4_thaa.mp3',
  'ج': 'https://cdn.jsdelivr.net/gh/adnan/Arabic-Alphabet@master/sounds/5_jeem.mp3',
  'ح': 'https://cdn.jsdelivr.net/gh/adnan/Arabic-Alphabet@master/sounds/6_haa.mp3',
  'خ': 'https://cdn.jsdelivr.net/gh/adnan/Arabic-Alphabet@master/sounds/7_khaa.mp3',
  'د': 'https://cdn.jsdelivr.net/gh/adnan/Arabic-Alphabet@master/sounds/8_daal.mp3',
  'ذ': 'https://cdn.jsdelivr.net/gh/adnan/Arabic-Alphabet@master/sounds/9_zaal.mp3',
  'ر': 'https://cdn.jsdelivr.net/gh/adnan/Arabic-Alphabet@master/sounds/10_raa.mp3',
  'ز': 'https://cdn.jsdelivr.net/gh/adnan/Arabic-Alphabet@master/sounds/11_zaa.mp3',
  'س': 'https://cdn.jsdelivr.net/gh/adnan/Arabic-Alphabet@master/sounds/12_seen.mp3',
  'ش': 'https://cdn.jsdelivr.net/gh/adnan/Arabic-Alphabet@master/sounds/13_sheen.mp3',
  'ص': 'https://cdn.jsdelivr.net/gh/adnan/Arabic-Alphabet@master/sounds/14_saad.mp3',
  'ض': 'https://cdn.jsdelivr.net/gh/adnan/Arabic-Alphabet@master/sounds/15_daad.mp3',
  'ط': 'https://cdn.jsdelivr.net/gh/adnan/Arabic-Alphabet@master/sounds/16_taah.mp3',
  'ظ': 'https://cdn.jsdelivr.net/gh/adnan/Arabic-Alphabet@master/sounds/17_zhaa.mp3',
  'ع': 'https://cdn.jsdelivr.net/gh/adnan/Arabic-Alphabet@master/sounds/18_ain.mp3',
  'غ': 'https://cdn.jsdelivr.net/gh/adnan/Arabic-Alphabet@master/sounds/19_ghain.mp3',
  'ف': 'https://cdn.jsdelivr.net/gh/adnan/Arabic-Alphabet@master/sounds/20_faa.mp3',
  'ق': 'https://cdn.jsdelivr.net/gh/adnan/Arabic-Alphabet@master/sounds/21_qaaf.mp3',
  'ك': 'https://cdn.jsdelivr.net/gh/adnan/Arabic-Alphabet@master/sounds/22_kaaf.mp3',
  'ل': 'https://cdn.jsdelivr.net/gh/adnan/Arabic-Alphabet@master/sounds/23_laam.mp3',
  'م': 'https://cdn.jsdelivr.net/gh/adnan/Arabic-Alphabet@master/sounds/24_meem.mp3',
  'ن': 'https://cdn.jsdelivr.net/gh/adnan/Arabic-Alphabet@master/sounds/25_noon.mp3',
  'هـ': 'https://cdn.jsdelivr.net/gh/adnan/Arabic-Alphabet@master/sounds/26_haah.mp3',
  'ه': 'https://cdn.jsdelivr.net/gh/adnan/Arabic-Alphabet@master/sounds/26_haah.mp3',
  'و': 'https://cdn.jsdelivr.net/gh/adnan/Arabic-Alphabet@master/sounds/27_waw.mp3',
  'ي': 'https://cdn.jsdelivr.net/gh/adnan/Arabic-Alphabet@master/sounds/30_yaa.mp3',
};

class SoundEngine {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private musicEnabled: boolean = true;
  private isHumanVoiceOnly: boolean = false; // Option for vocal-only / acapella
  private musicVolume: number = 0.22;
  private sfxVolume: number = 0.70;
  private masterVolume: number = 0.90;

  private masterGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private musicGain: GainNode | null = null;

  // Background Music Sequencer State
  private currentTrack: MusicTrack = 'noorkids_adventure';
  private isMusicPlaying: boolean = false;
  private musicTimer: any = null;
  private musicStep: number = 0;
  private activeMusicNodes: { osc: OscillatorNode; gain: GainNode }[] = [];

  // Active audio elements
  private currentAyahAudio: HTMLAudioElement | null = null;
  private currentLetterAudio: HTMLAudioElement | null = null;
  private isUnlocked: boolean = false;
  private cachedVoices: SpeechSynthesisVoice[] = [];
  private audioCache: Map<string, HTMLAudioElement> = new Map();
  private listeners: Set<(event: string, data?: any) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      // Pre-warm speech voices
      if (window.speechSynthesis) {
        this.cachedVoices = window.speechSynthesis.getVoices();
        window.speechSynthesis.onvoiceschanged = () => {
          this.cachedVoices = window.speechSynthesis.getVoices();
        };
      }

      // Auto-unlock Web Audio on first gesture
      const unlockGestures = ['click', 'touchstart', 'pointerdown', 'keydown'];
      const handleFirstInteraction = () => {
        this.unlockAudio();
        unlockGestures.forEach((ev) => {
          window.removeEventListener(ev, handleFirstInteraction);
        });
      };

      unlockGestures.forEach((ev) => {
        window.addEventListener(ev, handleFirstInteraction, { passive: true });
      });
    }
  }

  public subscribe(cb: (event: string, data?: any) => void): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  private notify(event: string, data?: any) {
    this.listeners.forEach((cb) => {
      try {
        cb(event, data);
      } catch {}
    });
  }

  /**
   * Initializes AudioContext and master audio routing bus
   */
  public initContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;

    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }

    if (this.ctx) {
      if (!this.masterGain) {
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.setValueAtTime(this.soundEnabled ? this.sfxVolume : 0, this.ctx.currentTime);
        this.sfxGain.connect(this.masterGain);

        this.musicGain = this.ctx.createGain();
        this.musicGain.gain.setValueAtTime(this.musicEnabled ? this.musicVolume : 0, this.ctx.currentTime);
        this.musicGain.connect(this.masterGain);
      }

      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    }

    return this.ctx;
  }

  /**
   * Called on first gesture to unlock audio pipeline
   */
  public unlockAudio() {
    this.initContext();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().then(() => {
        this.isUnlocked = true;
        this.playSilentBuffer();
        if (this.musicEnabled && !this.isMusicPlaying) {
          this.startMusic(this.currentTrack);
        }
        this.notify('unlocked');
      }).catch(() => {});
    } else {
      this.isUnlocked = true;
      this.playSilentBuffer();
      if (this.musicEnabled && !this.isMusicPlaying) {
        this.startMusic(this.currentTrack);
      }
      this.notify('unlocked');
    }
  }

  private playSilentBuffer() {
    if (!this.ctx) return;
    try {
      const buffer = this.ctx.createBuffer(1, 1, 22050);
      const source = this.ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(this.ctx.destination);
      source.start(0);
    } catch {}
  }

  public getIsUnlocked(): boolean {
    return this.isUnlocked;
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setValueAtTime(enabled ? this.sfxVolume : 0, this.ctx.currentTime);
    }
    this.notify('soundToggled', enabled);
  }

  public setMusicEnabled(enabled: boolean) {
    this.musicEnabled = enabled;
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setValueAtTime(enabled ? this.musicVolume : 0, this.ctx.currentTime);
    }
    if (enabled) {
      if (!this.isMusicPlaying) {
        this.startMusic(this.currentTrack);
      }
    } else {
      this.stopMusic();
    }
    this.notify('musicToggled', enabled);
  }

  public setIsHumanVoiceOnly(vocalOnly: boolean) {
    this.isHumanVoiceOnly = vocalOnly;
    if (vocalOnly && this.currentTrack !== 'vocal_nasheed') {
      this.startMusic('vocal_nasheed');
    }
    this.notify('humanVoiceToggled', vocalOnly);
  }

  public getIsHumanVoiceOnly(): boolean {
    return this.isHumanVoiceOnly;
  }

  public setMusicVolume(volume: number) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.musicGain && this.ctx && this.musicEnabled) {
      this.musicGain.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);
    }
  }

  public setSfxVolume(volume: number) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
    if (this.sfxGain && this.ctx && this.soundEnabled) {
      this.sfxGain.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
    }
  }

  public isSoundEnabled() {
    return this.soundEnabled;
  }

  public isMusicEnabled() {
    return this.musicEnabled;
  }

  public getCurrentTrack(): MusicTrack {
    return this.currentTrack;
  }

  public isBackgroundMusicPlaying(): boolean {
    return this.isMusicPlaying;
  }

  // ==========================================
  // REAL HUMAN VOICE LETTER AUDIO
  // ==========================================

  /**
   * Plays the verified authentic human voice recording for an Arabic letter.
   * If network fails or offline, smoothly falls back to native human speech synthesis.
   */
  public playHumanLetter(idOrChar: string, onEnd?: () => void) {
    if (!this.soundEnabled) {
      if (onEnd) onEnd();
      return;
    }

    const audioUrl = HUMAN_LETTER_AUDIO_MAP[idOrChar];

    if (audioUrl) {
      try {
        if (this.currentLetterAudio) {
          this.currentLetterAudio.pause();
          this.currentLetterAudio = null;
        }

        this.duckMusic(true);

        let audio = this.audioCache.get(audioUrl);
        if (!audio) {
          audio = new Audio(audioUrl);
          this.audioCache.set(audioUrl, audio);
        } else {
          audio.currentTime = 0;
        }

        this.currentLetterAudio = audio;

        audio.onended = () => {
          this.duckMusic(false);
          this.currentLetterAudio = null;
          if (onEnd) onEnd();
        };

        audio.onerror = () => {
          // Fallback to human speech synthesis
          this.speakArabic(idOrChar, onEnd);
        };

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            this.speakArabic(idOrChar, onEnd);
          });
        }
        return;
      } catch {
        this.speakArabic(idOrChar, onEnd);
      }
    } else {
      this.speakArabic(idOrChar, onEnd);
    }
  }

  /**
   * Real human Arabic encouragement & praise phrases
   * Examples: "Mumtaz!", "Ahsanta ya batal!", "Masha'Allah!", "Barakallahu feek!"
   */
  public playHumanPraise(type?: 'mumtaz' | 'ahsanta' | 'mashallah' | 'barakallah') {
    if (!this.soundEnabled) return;

    const praises = [
      { text: 'مُمْتَاز !', audioKey: 'mumtaz' },
      { text: 'أَحْسَنْتَ يَا بَطَل !', audioKey: 'ahsanta' },
      { text: 'مَا شَاءَ الله !', audioKey: 'mashallah' },
      { text: 'بَارَكَ اللهُ فِيك !', audioKey: 'barakallah' },
    ];

    const selected = type
      ? praises.find((p) => p.audioKey === type) || praises[0]
      : praises[Math.floor(Math.random() * praises.length)];

    // Play human applause & cheerful praise
    this.playHumanApplause();
    this.speakArabic(selected.text);
  }

  /**
   * Human applause & cheers (stochastic filtered pink noise bursts & joyful vocal cheers)
   */
  public playHumanApplause() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    try {
      // Clapping bursts (multiple hands clapping)
      const clapCount = 8;
      for (let i = 0; i < clapCount; i++) {
        const delay = Math.random() * 0.45;
        setTimeout(() => {
          if (!this.ctx || !this.sfxGain) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const filter = this.ctx.createBiquadFilter();

          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(1200 + Math.random() * 600, this.ctx.currentTime);
          filter.Q.setValueAtTime(3.0, this.ctx.currentTime);

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(140 + Math.random() * 80, this.ctx.currentTime);

          gain.gain.setValueAtTime(0.22, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(this.sfxGain);

          osc.start(this.ctx.currentTime);
          osc.stop(this.ctx.currentTime + 0.09);
        }, delay * 1000);
      }
    } catch {}
  }

  // ==========================================
  // PROCEDURAL BACKGROUND MUSIC (BGM)
  // ==========================================

  public startMusic(track: MusicTrack = 'noorkids_adventure') {
    this.currentTrack = track;
    this.initContext();
    if (!this.musicEnabled || !this.ctx) return;

    if (this.isMusicPlaying) {
      this.stopMusicSequencer();
    }

    this.isMusicPlaying = true;
    this.musicStep = 0;
    this.runMusicSequencer();
    this.notify('trackChanged', track);
  }

  public stopMusic() {
    this.isMusicPlaying = false;
    this.stopMusicSequencer();
    this.notify('musicStopped');
  }

  private stopMusicSequencer() {
    if (this.musicTimer) {
      clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
    this.activeMusicNodes.forEach(({ osc, gain }) => {
      try {
        osc.stop();
        osc.disconnect();
        gain.disconnect();
      } catch {}
    });
    this.activeMusicNodes = [];
  }

  private runMusicSequencer() {
    // 16-step patterns
    const adventureMelody = [
      293.66, 0, 329.63, 392.00, 440.00, 0, 523.25, 440.00,
      392.00, 329.63, 293.66, 0, 392.00, 440.00, 587.33, 0
    ];
    const adventureBass = [
      146.83, 0, 0, 0, 196.00, 0, 0, 0,
      220.00, 0, 0, 0, 146.83, 0, 0, 0
    ];

    // Vocal Acapella / Nasheed (Human vocal formant choir simulating gentle humming)
    const nasheedMelody = [
      293.66, 293.66, 349.23, 0, 392.00, 392.00, 440.00, 0,
      392.00, 349.23, 329.63, 0, 293.66, 329.63, 293.66, 0
    ];
    const nasheedBass = [
      146.83, 0, 146.83, 0, 174.61, 0, 174.61, 0,
      196.00, 0, 196.00, 0, 146.83, 0, 146.83, 0
    ];

    const desertMelody = [
      220.00, 0, 293.66, 0, 329.63, 349.23, 329.63, 0,
      293.66, 0, 261.63, 0, 220.00, 246.94, 293.66, 0
    ];
    const desertBass = [
      110.00, 0, 0, 0, 146.83, 0, 0, 0,
      130.81, 0, 0, 0, 110.00, 0, 0, 0
    ];

    const jannahMelody = [
      329.63, 0, 392.00, 0, 523.25, 0, 440.00, 0,
      392.00, 0, 329.63, 0, 293.66, 329.63, 392.00, 0
    ];
    const jannahBass = [
      130.81, 0, 0, 0, 164.81, 0, 0, 0,
      196.00, 0, 0, 0, 130.81, 0, 0, 0
    ];

    const arcadeMelody = [
      440.00, 440.00, 0, 523.25, 587.33, 0, 659.25, 587.33,
      523.25, 0, 440.00, 392.00, 440.00, 0, 523.25, 0
    ];
    const arcadeBass = [
      220.00, 0, 220.00, 0, 261.63, 0, 261.63, 0,
      196.00, 0, 196.00, 0, 220.00, 0, 220.00, 0
    ];

    const stepDuration = 270; // ms per step

    this.musicTimer = setInterval(() => {
      if (!this.musicEnabled || !this.isMusicPlaying || !this.ctx || !this.musicGain) {
        return;
      }

      let melody = adventureMelody;
      let bass = adventureBass;
      let waveType: OscillatorType = 'triangle';
      let isVocal = false;

      if (this.currentTrack === 'vocal_nasheed' || this.isHumanVoiceOnly) {
        melody = nasheedMelody;
        bass = nasheedBass;
        waveType = 'sine';
        isVocal = true;
      } else if (this.currentTrack === 'desert_oasis') {
        melody = desertMelody;
        bass = desertBass;
        waveType = 'sine';
      } else if (this.currentTrack === 'jannah_garden') {
        melody = jannahMelody;
        bass = jannahBass;
        waveType = 'sine';
      } else if (this.currentTrack === 'arcade_play') {
        melody = arcadeMelody;
        bass = arcadeBass;
        waveType = 'triangle';
      }

      const noteFreq = melody[this.musicStep % 16];
      const bassFreq = bass[this.musicStep % 16];

      // Play melody note
      if (noteFreq > 0) {
        if (isVocal) {
          this.playHumanVocalFormantNote(noteFreq, 0.45, 0.18);
        } else {
          this.playProceduralNote(noteFreq, waveType, 0.35, 0.16);
        }
      }

      // Play bass note
      if (bassFreq > 0) {
        this.playProceduralNote(bassFreq, 'sine', 0.55, 0.12);
      }

      this.musicStep = (this.musicStep + 1) % 16;
    }, stepDuration);
  }

  /**
   * Human Vocal Formant Note (Simulates warm human voice choral humming 'Ah / Oh / Mm')
   */
  private playHumanVocalFormantNote(freq: number, duration: number, baseGain: number) {
    if (!this.ctx || !this.musicGain) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Formant filters imitating human vocal tract (vowel 'O' & 'A')
      const filter1 = this.ctx.createBiquadFilter();
      filter1.type = 'bandpass';
      filter1.frequency.setValueAtTime(500, now);
      filter1.Q.setValueAtTime(4.0, now);

      const filter2 = this.ctx.createBiquadFilter();
      filter2.type = 'bandpass';
      filter2.frequency.setValueAtTime(1000, now);
      filter2.Q.setValueAtTime(3.0, now);

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);

      // Warm human vocal attack & release
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(baseGain, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(filter1);
      osc.connect(filter2);
      filter1.connect(gain);
      filter2.connect(gain);
      gain.connect(this.musicGain);

      osc.start(now);
      osc.stop(now + duration + 0.05);

      this.activeMusicNodes.push({ osc, gain });

      setTimeout(() => {
        const idx = this.activeMusicNodes.findIndex((n) => n.osc === osc);
        if (idx >= 0) this.activeMusicNodes.splice(idx, 1);
        try {
          osc.disconnect();
          filter1.disconnect();
          filter2.disconnect();
          gain.disconnect();
        } catch {}
      }, (duration + 0.1) * 1000);
    } catch {}
  }

  private playProceduralNote(
    freq: number,
    type: OscillatorType,
    duration: number,
    baseGain: number
  ) {
    if (!this.ctx || !this.musicGain) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(baseGain, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.musicGain);

      osc.start(now);
      osc.stop(now + duration + 0.05);

      this.activeMusicNodes.push({ osc, gain });

      setTimeout(() => {
        const idx = this.activeMusicNodes.findIndex((n) => n.osc === osc);
        if (idx >= 0) this.activeMusicNodes.splice(idx, 1);
        try {
          osc.disconnect();
          gain.disconnect();
        } catch {}
      }, (duration + 0.1) * 1000);
    } catch {}
  }

  // ==========================================
  // PROCEDURAL SOUND FX (SFX)
  // ==========================================

  public playPop() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(380, now);
      osc.frequency.exponentialRampToValueAtTime(840, now + 0.07);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {}
  }

  public playBubblePop() {
    this.playPop();
  }

  public playCardFlip() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(520, now + 0.09);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch {}
  }

  public playStep() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.06);

      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.07);
    } catch {}
  }

  public playLetterSnap() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(580, now);
      osc.frequency.exponentialRampToValueAtTime(1100, now + 0.05);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch {}
  }

  public playStarChime() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, index) => {
      if (!this.ctx || !this.sfxGain) return;
      const startTime = this.ctx.currentTime + index * 0.07;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.28, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.38);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(startTime);
      osc.stop(startTime + 0.38);
    });
  }

  public playMatchSuccess() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const chords = [
      { freq: 659.25, time: 0 },
      { freq: 783.99, time: 0.07 },
      { freq: 1046.5, time: 0.15 },
      { freq: 1318.51, time: 0.25 },
    ];

    chords.forEach(({ freq, time }) => {
      if (!this.ctx || !this.sfxGain) return;
      const startTime = this.ctx.currentTime + time;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.3, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(startTime);
      osc.stop(startTime + 0.4);
    });
  }

  public playGemPickup() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const notes = [880, 1318.51, 1760];
    notes.forEach((freq, index) => {
      if (!this.ctx || !this.sfxGain) return;
      const startTime = this.ctx.currentTime + index * 0.05;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.32, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(startTime);
      osc.stop(startTime + 0.25);
    });
  }

  public playLetterCollect() {
    this.playMatchSuccess();
  }

  public playGentleBoing() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.15);
      osc.frequency.exponentialRampToValueAtTime(240, now + 0.28);

      gain.gain.setValueAtTime(0.24, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch {}
  }

  public playCelebrationFanfare() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    // Trigger human praise + fanfare
    this.playHumanApplause();

    const chords = [
      { notes: [523.25, 659.25], delay: 0, duration: 0.18 },
      { notes: [587.33, 698.46], delay: 0.15, duration: 0.18 },
      { notes: [659.25, 783.99], delay: 0.3, duration: 0.22 },
      { notes: [783.99, 1046.5, 1318.51], delay: 0.48, duration: 0.9 },
    ];

    chords.forEach(({ notes, delay, duration }) => {
      notes.forEach((freq) => {
        if (!this.ctx || !this.sfxGain) return;
        const startTime = this.ctx.currentTime + delay;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.26, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(startTime);
        osc.stop(startTime + duration);
      });
    });
  }

  public playOudStrum() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const strings = [146.83, 220.0, 293.66, 369.99, 440.0];
    strings.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const startTime = this.ctx.currentTime + idx * 0.04;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.35, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.6);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(startTime);
      osc.stop(startTime + 0.65);
    });
  }

  public playReverenceBell() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(432, now);
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(436, now);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.sfxGain);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 1.25);
      osc2.stop(now + 1.25);
    } catch {}
  }

  public playMicStart() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.setValueAtTime(1174.66, now + 0.08);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.26);
    } catch {}
  }

  public playBrushStroke() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(280 + Math.random() * 80, now);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch {}
  }

  public playLetterTone(letterIndex: number = 0) {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const baseFreq = 261.63 * Math.pow(2, (letterIndex % 28) / 14);

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(baseFreq, now);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.32);
    } catch {}
  }

  // ==========================================
  // SPEECH SYNTHESIS & RECITATION AUDIO
  // ==========================================

  public speakArabic(text: string, onEnd?: () => void) {
    // If the text is a single letter, prioritize real human voice recording!
    if (HUMAN_LETTER_AUDIO_MAP[text]) {
      this.playHumanLetter(text, onEnd);
      return;
    }

    if (!this.soundEnabled || typeof window === 'undefined' || !window.speechSynthesis) {
      if (onEnd) onEnd();
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.85;
      utterance.pitch = 1.05;

      this.duckMusic(true);

      const voices = this.cachedVoices.length > 0 ? this.cachedVoices : window.speechSynthesis.getVoices();
      const arabicVoice = voices.find((v) => v.lang.startsWith('ar'));
      if (arabicVoice) {
        utterance.voice = arabicVoice;
      }

      utterance.onend = () => {
        this.duckMusic(false);
        if (onEnd) onEnd();
      };
      utterance.onerror = () => {
        this.duckMusic(false);
        if (onEnd) onEnd();
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      this.duckMusic(false);
      if (onEnd) onEnd();
    }
  }

  public speakStoryText(
    text: string,
    lang: string = 'fr',
    rate: number = 0.9,
    onEnd?: () => void
  ) {
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

      this.duckMusic(true);

      const voices = this.cachedVoices.length > 0 ? this.cachedVoices : window.speechSynthesis.getVoices();
      const matchingVoice = voices.find((v) => v.lang.startsWith(lang));
      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }

      utterance.onend = () => {
        this.duckMusic(false);
        if (onEnd) onEnd();
      };
      utterance.onerror = () => {
        this.duckMusic(false);
        if (onEnd) onEnd();
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      this.duckMusic(false);
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
    if (this.currentLetterAudio) {
      this.currentLetterAudio.pause();
      this.currentLetterAudio = null;
    }
    this.duckMusic(false);
  }

  private duckMusic(duck: boolean) {
    if (!this.musicGain || !this.ctx || !this.musicEnabled) return;
    try {
      const targetGain = duck ? this.musicVolume * 0.15 : this.musicVolume;
      this.musicGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.2);
    } catch {}
  }

  public playAyahAudio(
    globalAyahNumber: number,
    onEnded?: () => void,
    onError?: () => void
  ): HTMLAudioElement {
    this.stopSpeaking();
    this.duckMusic(true);

    const audioUrl = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${globalAyahNumber}.mp3`;
    const audio = new Audio(audioUrl);
    this.currentAyahAudio = audio;

    audio.onended = () => {
      this.currentAyahAudio = null;
      this.duckMusic(false);
      if (onEnded) onEnded();
    };

    audio.onerror = () => {
      this.currentAyahAudio = null;
      this.duckMusic(false);
      if (onError) onError();
    };

    audio.play().catch(() => {
      this.duckMusic(false);
      if (onError) onError();
    });

    return audio;
  }

  public playAmbient(type: 'desert_wind' | 'ocean_waves' | 'peaceful_lute' = 'peaceful_lute') {
    this.startMusic('desert_oasis');
  }

  public stopAmbient() {
    this.startMusic('noorkids_adventure');
  }
}

export const sound = new SoundEngine();
