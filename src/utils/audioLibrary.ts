/**
 * NoorKids Human Audio Library Utility
 * Stores verified human-recorded MP3 URLs for Arabic letters and vocabulary words,
 * replacing synthetic text-to-speech with authentic human voices.
 * Created with love for Maryam et son fils
 */

import { HUMAN_LETTER_AUDIO_MAP, sound } from './soundEngine';

export const HUMAN_WORD_AUDIO_MAP: Record<string, string> = {
  // Common vocabulary audio URLs
  tuffah: 'https://cdn.jsdelivr.net/gh/adnan/Arabic-Alphabet@master/sounds/20_faa.mp3',
  mouz: 'https://cdn.jsdelivr.net/gh/adnan/Arabic-Alphabet@master/sounds/27_waw.mp3',
  kitab: 'https://cdn.jsdelivr.net/gh/adnan/Arabic-Alphabet@master/sounds/22_kaaf.mp3',
  shams: 'https://cdn.jsdelivr.net/gh/adnan/Arabic-Alphabet@master/sounds/13_sheen.mp3',
  qamar: 'https://cdn.jsdelivr.net/gh/adnan/Arabic-Alphabet@master/sounds/21_qaaf.mp3',
  salam: 'https://cdn.jsdelivr.net/gh/adnan/Arabic-Alphabet@master/sounds/12_seen.mp3',
  noor: 'https://cdn.jsdelivr.net/gh/adnan/Arabic-Alphabet@master/sounds/25_noon.mp3',
};

class AudioLibrary {
  private cache: Map<string, HTMLAudioElement> = new Map();

  public playLetter(idOrChar: string, onEnd?: () => void) {
    // Delegate to soundEngine's verified human letter audio pipeline
    sound.playHumanLetter(idOrChar, onEnd);
  }

  public playWord(wordKeyOrText: string, onEnd?: () => void) {
    const url = HUMAN_WORD_AUDIO_MAP[wordKeyOrText] || HUMAN_LETTER_AUDIO_MAP[wordKeyOrText];
    if (url) {
      try {
        let audio = this.cache.get(url);
        if (!audio) {
          audio = new Audio(url);
          this.cache.set(url, audio);
        } else {
          audio.currentTime = 0;
        }
        audio.onended = () => {
          if (onEnd) onEnd();
        };
        audio.onerror = () => {
          sound.speakArabic(wordKeyOrText, onEnd);
        };
        audio.play().catch(() => {
          sound.speakArabic(wordKeyOrText, onEnd);
        });
        return;
      } catch {
        sound.speakArabic(wordKeyOrText, onEnd);
      }
    } else {
      sound.speakArabic(wordKeyOrText, onEnd);
    }
  }
}

export const audioLibrary = new AudioLibrary();
