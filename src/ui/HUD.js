import { ICONS, icon } from './icons.js';

export class HUD {
  constructor() {
    this.element = document.getElementById('hud');
    this.scoreElement = document.getElementById('hud-score');
    this.itemsElement = document.getElementById('hud-items');
    this.heartsElement = document.getElementById('hud-hearts');
    this.levelElement = document.getElementById('hud-level-name');
    this.timeElement = document.getElementById('hud-time');
    this.progressFill = document.getElementById('progress-fill');
    this.progressMarker = document.getElementById('progress-marker');

    this.cache = { score: -1, items: -1, lives: -1, time: -1, progress: -1, level: '' };
    this.hearts = [];
    this.buildHearts(3);
  }

  buildHearts(count) {
    this.heartsElement.innerHTML = Array.from(
      { length: count },
      () => `<span class="heart" aria-hidden="true">${ICONS.heart}</span>`,
    ).join('');
    this.hearts = [...this.heartsElement.querySelectorAll('.heart')];
    this.cache.lives = count;
  }

  show() {
    this.element.classList.remove('is-hidden');
  }

  hide() {
    this.element.classList.add('is-hidden');
  }

  setLevel(level) {
    this.levelElement.textContent = `${level.label} · ${level.name}`;
    this.cache.level = level.id;
  }

  reset(lives) {
    this.buildHearts(lives);
    this.cache.score = -1;
    this.cache.items = -1;
    this.cache.time = -1;
    this.cache.progress = -1;
    this.update({ score: 0, items: 0, lives, elapsed: 0, progress: 0 });
  }

  update({ score, items, lives, elapsed, progress }) {
    if (score !== this.cache.score) {
      this.cache.score = score;
      this.scoreElement.textContent = score.toLocaleString('id-ID');
    }
    if (items !== this.cache.items) {
      this.cache.items = items;
      this.itemsElement.textContent = items.toLocaleString('id-ID');
    }
    if (lives !== this.cache.lives) {
      this.updateLives(lives);
    }
    if (elapsed !== this.cache.time) {
      this.cache.time = elapsed;
      const total = Math.max(0, Math.floor(elapsed));
      const minutes = Math.floor(total / 60);
      const seconds = String(total % 60).padStart(2, '0');
      this.timeElement.textContent = `${minutes}:${seconds}`;
    }
    const percent = Math.max(0, Math.min(100, progress * 100));
    if (Math.abs(percent - this.cache.progress) > 0.05) {
      this.cache.progress = percent;
      this.progressFill.style.width = `${percent}%`;
      this.progressMarker.style.left = `${percent}%`;
    }
  }

  updateLives(lives) {
    const previous = this.cache.lives;
    this.cache.lives = lives;
    this.hearts.forEach((heart, index) => {
      const filled = index < lives;
      heart.classList.toggle('is-empty', !filled);
      const justLost = lives < previous && index === lives;
      const justGained = lives > previous && index >= previous;
      if (justLost || justGained) {
        heart.classList.remove('is-hit');
        void heart.offsetWidth;
        heart.classList.add('is-hit');
        window.setTimeout(() => heart.classList.remove('is-hit'), 380);
      }
    });
  }

  heartPulse(index = 0) {
    const heart = this.hearts[index];
    if (!heart) return;
    heart.classList.remove('is-hit');
    void heart.offsetWidth;
    heart.classList.add('is-hit');
    window.setTimeout(() => heart.classList.remove('is-hit'), 380);
  }
}
