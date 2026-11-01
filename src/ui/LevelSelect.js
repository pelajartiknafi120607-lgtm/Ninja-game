import { difficultyStars, icon } from './icons.js';
import { getBestScore } from '../game/ScoreManager.js';

export class LevelSelect {
  constructor({ onSelect, onBack }) {
    this.element = document.getElementById('screen-levels');
    this.cards = document.getElementById('level-cards');
    this.backButton = document.getElementById('btn-levels-back');
    this.onSelect = onSelect;
    this.onBack = onBack;

    this.backButton.addEventListener('click', () => this.onBack());
    this.cards.addEventListener('click', (event) => {
      const card = event.target.closest('.level-card');
      if (!card) return;
      this.onSelect(card.dataset.level);
    });
  }

  render(levels) {
    this.cards.innerHTML = levels
      .map((level) => {
        const best = getBestScore(level.id);
        const bestLabel = best > 0 ? `<span class="level-best">BEST ${best.toLocaleString('id-ID')}</span>` : '';
        return `
          <button class="level-card level-card--${level.cardClass}" data-level="${level.id}" type="button">
            <span class="level-card-art">
              <span class="art-glow"></span>
              ${icon(level.icon)}
            </span>
            <span class="level-card-body">
              <span class="level-card-kicker">${level.label} · ${level.difficulty}</span>
              <span class="level-card-title">${level.name}</span>
              <span class="level-card-desc">${level.description}</span>
              <span class="level-card-footer">
                <span class="difficulty">${difficultyStars(level.difficultyStars)}<span>${level.difficulty}</span></span>
                ${bestLabel}
                <span class="btn btn--primary level-card-play">MAIN</span>
              </span>
            </span>
          </button>
        `;
      })
      .join('');
  }

  show() {
    this.element.classList.add('is-active');
  }

  hide() {
    this.element.classList.remove('is-active');
  }
}
