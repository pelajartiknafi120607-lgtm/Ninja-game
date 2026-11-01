export class PauseMenu {
  constructor({ onResume, onRestart, onLevels, onMenu }) {
    this.element = document.getElementById('screen-pause');
    document.getElementById('btn-resume').addEventListener('click', () => onResume());
    document.getElementById('btn-restart').addEventListener('click', () => onRestart());
    document.getElementById('btn-pause-levels').addEventListener('click', () => onLevels());
    document.getElementById('btn-pause-menu').addEventListener('click', () => onMenu());
  }

  show() {
    this.element.classList.add('is-active');
  }

  hide() {
    this.element.classList.remove('is-active');
  }
}
