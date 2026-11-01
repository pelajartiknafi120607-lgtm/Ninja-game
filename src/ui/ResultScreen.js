import { ICONS, icon } from './icons.js';

export class ResultScreen {
  constructor({ onNext, onRetry, onLevels, onMenu }) {
    this.element = document.getElementById('screen-result');
    this.ribbon = document.getElementById('result-ribbon');
    this.title = document.getElementById('result-title');
    this.rank = document.getElementById('result-rank');
    this.score = document.getElementById('result-score');
    this.stats = document.getElementById('result-stats');
    this.actions = document.getElementById('result-actions');

    this.callbacks = { next: onNext, retry: onRetry, levels: onLevels, menu: onMenu };
    this.actions.addEventListener('click', (event) => {
      const button = event.target.closest('[data-action]');
      if (!button) return;
      const callback = this.callbacks[button.dataset.action];
      if (callback) callback();
    });
  }

  show(result, { hasNext = false } = {}) {
    const completed = result.completed;
    this.title.textContent = completed ? 'LEVEL COMPLETE!' : 'COBA LAGI!';
    this.ribbon.className = `ribbon ${completed ? 'ribbon--gold' : 'ribbon--red'}`;
    this.score.textContent = result.score.toLocaleString('id-ID');
    this.rank.innerHTML = `
      <span class="rank-label">${completed ? 'RANK KAMU' : 'FOKUS BELUM CUKUP'}</span>
      <span class="rank-name">${icon(result.rank.icon)}${result.rank.name}</span>
      ${result.newBest ? '<span class="rank-best">★ REKOR BARU!</span>' : ''}
    `;

    const minutes = Math.floor(result.elapsed / 60);
    const seconds = String(Math.floor(result.elapsed % 60)).padStart(2, '0');
    this.stats.innerHTML = `
      <div class="result-stat"><span>${icon('book', 'stat-icon')}Item</span><strong>${result.items}</strong></div>
      <div class="result-stat"><span>${icon('obstacle', 'stat-icon')}Tabrakan</span><strong>${result.hits}</strong></div>
      <div class="result-stat"><span>${icon('clock', 'stat-icon')}Waktu</span><strong>${minutes}:${seconds}</strong></div>
      <div class="result-stat"><span>${icon('heart', 'stat-icon')}Nyawa</span><strong>${result.lives}</strong></div>
    `;

    let buttons = '';
    if (completed && hasNext) {
      buttons += '<button class="btn btn--primary" data-action="next" type="button">LEVEL BERIKUTNYA</button>';
      buttons += '<button class="btn btn--cream" data-action="retry" type="button">ULANGI</button>';
      buttons += '<button class="btn btn--ghost" data-action="menu" type="button">MENU</button>';
    } else if (completed) {
      buttons += '<button class="btn btn--primary" data-action="retry" type="button">MAIN LAGI</button>';
      buttons += '<button class="btn btn--cream" data-action="levels" type="button">PILIH LEVEL</button>';
      buttons += '<button class="btn btn--ghost" data-action="menu" type="button">MENU</button>';
    } else {
      buttons += '<button class="btn btn--primary" data-action="retry" type="button">COBA LAGI</button>';
      buttons += '<button class="btn btn--cream" data-action="levels" type="button">PILIH LEVEL</button>';
      buttons += '<button class="btn btn--ghost" data-action="menu" type="button">MENU</button>';
    }
    this.actions.innerHTML = buttons;

    this.element.classList.add('is-active');
  }

  hide() {
    this.element.classList.remove('is-active');
  }
}
