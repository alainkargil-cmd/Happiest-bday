import { Howl, Howler } from 'howler';
import { birthdayConfig } from '../config/birthdayConfig';

class SoundEngine {
  constructor() {
    this.isMuted = false;
    this.volume = birthdayConfig.audio?.defaultVolume ?? 0.65;
    this.audioCtx = null;
    this.bgm = null;
    this.isBgmPlaying = false;
    this.ambientSynthInterval = null;
    this.isInitialized = false;
    this.lastFireworkTime = 0;
  }

  init() {
    if (this.isInitialized) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
      Howler.volume(this.volume);
      this.isInitialized = true;
    } catch (e) {
      console.warn("AudioContext init error:", e);
    }
  }

  ensureContext() {
    if (!this.audioCtx) {
      this.init();
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  playBgm() {
    this.ensureContext();
    if (this.isBgmPlaying || this.isMuted) return;

    const bgmUrl = birthdayConfig.audio?.bgmUrl;
    if (bgmUrl && !this.bgm) {
      try {
        this.bgm = new Howl({
          src: [bgmUrl],
          html5: true,
          loop: true,
          volume: this.volume,
          onloaderror: () => {
            this.startAmbientSynth();
          },
          onplay: () => {
            this.isBgmPlaying = true;
          }
        });
        this.bgm.play();
        this.isBgmPlaying = true;
        return;
      } catch (err) {
        console.warn("Howler BGM error, falling back to synth:", err);
      }
    } else if (this.bgm) {
      this.bgm.play();
      this.isBgmPlaying = true;
      return;
    }

    this.startAmbientSynth();
  }

  startAmbientSynth() {
    if (this.ambientSynthInterval || !this.audioCtx || this.isMuted) return;
    this.isBgmPlaying = true;

    const chordProgressions = [
      [261.63, 329.63, 392.00, 493.88],
      [349.23, 440.00, 523.25, 659.25],
      [392.00, 493.88, 587.33, 783.99],
      [220.00, 261.63, 329.63, 392.00]
    ];

    let currentChordIdx = 0;

    const playChord = () => {
      if (this.isMuted || !this.audioCtx) return;
      const chord = chordProgressions[currentChordIdx];
      currentChordIdx = (currentChordIdx + 1) % chordProgressions.length;

      const now = this.audioCtx.currentTime;
      chord.forEach((freq, idx) => {
        try {
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          const filter = this.audioCtx.createBiquadFilter();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.15);

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(1000, now);

          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(0.035 * this.volume, now + 1.2 + idx * 0.15);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 5.5);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(this.audioCtx.destination);

          osc.start(now + idx * 0.15);
          osc.stop(now + 6.0);
        } catch (e) {}
      });
    };

    playChord();
    this.ambientSynthInterval = setInterval(playChord, 5200);
  }

  stopBgm() {
    if (this.bgm) {
      this.bgm.pause();
    }
    if (this.ambientSynthInterval) {
      clearInterval(this.ambientSynthInterval);
      this.ambientSynthInterval = null;
    }
    this.isBgmPlaying = false;
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    Howler.mute(this.isMuted);
    if (this.isMuted) {
      this.stopBgm();
    } else {
      this.playBgm();
    }
    return this.isMuted;
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    Howler.volume(this.volume);
  }

  /* Procedural Sound Effects */
  playChime() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.audioCtx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    const now = this.audioCtx.currentTime;

    notes.forEach((freq, idx) => {
      try {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.001, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.1 * this.volume, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 1.0);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 1.1);
      } catch (e) {}
    });
  }

  playEnvelopeOpen() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.5);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12 * this.volume, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.65);

      setTimeout(() => this.playChime(), 300);
    } catch (e) {}
  }

  playGiftOpen() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      const arpeggio = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
      arpeggio.forEach((freq, idx) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0.001, now + idx * 0.06);
        gain.gain.linearRampToValueAtTime(0.12 * this.volume, now + idx * 0.06 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 1.2);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 1.3);
      });
    } catch (e) {}
  }

  playCandleBlow() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      const bufferSize = this.audioCtx.sampleRate * 0.4;
      const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.audioCtx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(900, now);
      filter.frequency.linearRampToValueAtTime(350, now + 0.4);

      const gain = this.audioCtx.createGain();
      gain.gain.setValueAtTime(0.15 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.audioCtx.destination);

      whiteNoise.start(now);
      setTimeout(() => this.playChime(), 350);
    } catch (e) {}
  }

  playFirework() {
    if (this.isMuted) return;
    const nowMs = Date.now();
    if (nowMs - this.lastFireworkTime < 1800) return; // Throttle to prevent audio thread lag
    this.lastFireworkTime = nowMs;

    this.ensureContext();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(35, now + 0.35);

      gain.gain.setValueAtTime(0.2 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.45);
    } catch (e) {}
  }

  playCountdownTick() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);

      gain.gain.setValueAtTime(0.1 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    } catch (e) {}
  }
}

export const audioManager = new SoundEngine();
