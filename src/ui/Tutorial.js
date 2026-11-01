export class Tutorial {
  constructor({ onClose }) {
    this.element = document.getElementById('screen-tutorial');
    document.getElementById('btn-tutorial-close').addEventListener('click', () => onClose());
  }

  show() {
    this.element.classList.add('is-active');
  }

  hide() {
    this.element.classList.remove('is-active');
  }
}
