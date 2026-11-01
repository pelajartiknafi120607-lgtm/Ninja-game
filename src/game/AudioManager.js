const STORAGE_KEY = 'focus-ninja-muted';

function readMuted() {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

export class AudioManager {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.muted = readMuted();
    this.volume = 0.55;
  }

  unlock() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      this.ctx = new AudioContext();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.muted ? 0 : this.volume;
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  setMuted(muted) {
    this.muted = muted;
    if (this.master) {
      this.master.gain.setTargetAtTime(muted ? 0 : this.volume, this.ctx.currentTime, 0.02);
    }
    try {
      localStorage.setItem(STORAGE_KEY, muted ? '1' : '0');
    } catch {
      // Storage may be unavailable; sound still works for this session.
    }
  }

  toggleMuted() {
    this.setMuted(!this.muted);
    if (!this.muted) this.ui();
    return this.muted;
  }

  #ready() {
    return Boolean(this.ctx && this.master) && !this.muted;
  }

  tone({
    frequency,
    to,
    duration = 0.16,
    type = 'sine',
    volume = 0.16,
    delay = 0,
    attack = 0.008,
    release = 0.08,
  }) {
    if (!this.#ready()) return;
    const now = this.ctx.currentTime + delay;
    const oscillator = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(Math.max(20, frequency), now);
    if (to) oscillator.frequency.exponentialRampToValueAtTime(Math.max(20, to), now + duration);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration + release);
    oscillator.connect(gain);
    gain.connect(this.master);
    oscillator.start(now);
    oscillator.stop(now + duration + release + 0.02);
  }

  noise({ duration = 0.18, volume = 0.12, frequency = 1400, delay = 0, type = 'bandpass' }) {
    if (!this.#ready()) return;
    const now = this.ctx.currentTime + delay;
    const frameCount = Math.max(1, Math.floor(this.ctx.sampleRate * duration));
    const buffer = this.ctx.createBuffer(1, frameCount, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < frameCount; i += 1) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / frameCount);
    }
    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = type;
    filter.frequency.value = frequency;
    filter.Q.value = 0.9;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.master);
    source.start(now);
    source.stop(now + duration + 0.02);
  }

  ui() {
    this.tone({ frequency: 520, to: 700, duration: 0.07, type: 'triangle', volume: 0.1, release: 0.04 });
  }

  back() {
    this.tone({ frequency: 420, to: 280, duration: 0.09, type: 'triangle', volume: 0.09, release: 0.05 });
  }

  jump() {
    this.tone({ frequency: 320, to: 720, duration: 0.16, type: 'triangle', volume: 0.15 });
    this.noise({ duration: 0.1, volume: 0.04, frequency: 2200 });
  }

  slide() {
    this.noise({ duration: 0.28, volume: 0.13, frequency: 900, type: 'lowpass' });
    this.tone({ frequency: 260, to: 150, duration: 0.18, type: 'sawtooth', volume: 0.05 });
  }

  lane() {
    this.tone({ frequency: 620, to: 680, duration: 0.05, type: 'sine', volume: 0.05, release: 0.03 });
  }

  collect(type = 'star') {
    const sequences = {
      star: [880, 1320],
      pencil: [660, 990],
      book: [520, 780, 1040],
      focusOrb: [740, 1108, 1480],
      knowledgeOrb: [620, 930, 1240, 1550],
    };
    const notes = sequences[type] || sequences.star;
    notes.forEach((frequency, index) => {
      this.tone({
        frequency,
        duration: 0.1,
        type: 'triangle',
        volume: 0.12,
        delay: index * 0.045,
        release: 0.05,
      });
    });
  }

  hit() {
    this.tone({ frequency: 180, to: 70, duration: 0.26, type: 'sawtooth', volume: 0.18, release: 0.1 });
    this.noise({ duration: 0.2, volume: 0.18, frequency: 420, type: 'lowpass' });
  }

  start() {
    [392, 523, 659, 784].forEach((frequency, index) => {
      this.tone({
        frequency,
        duration: 0.18,
        type: 'triangle',
        volume: 0.13,
        delay: index * 0.09,
        release: 0.08,
      });
    });
  }

  complete() {
    const melody = [
      [523, 0],
      [659, 0.12],
      [784, 0.24],
      [1047, 0.38],
      [784, 0.58],
      [1047, 0.7],
    ];
    melody.forEach(([frequency, delay]) => {
      this.tone({
        frequency,
        duration: 0.22,
        type: 'triangle',
        volume: 0.15,
        delay,
        release: 0.12,
      });
    });
    this.noise({ duration: 0.5, volume: 0.04, frequency: 5000, delay: 0.3, type: 'highpass' });
  }

  fail() {
    [392, 330, 262, 196].forEach((frequency, index) => {
      this.tone({
        frequency,
        duration: 0.28,
        type: 'sawtooth',
        volume: 0.1,
        delay: index * 0.14,
        release: 0.12,
      });
    });
  }
}
