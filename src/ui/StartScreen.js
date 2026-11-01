export class StartScreen {
  constructor({ onPlay, onTutorial, onToggleMute }) {
    this.element = document.getElementById('screen-start');
    this.playButton = document.getElementById('btn-play');
    this.tutorialButton = document.getElementById('btn-tutorial');
    this.muteButton = document.getElementById('btn-mute');

    this.playButton.addEventListener('click', () => onPlay());
    this.tutorialButton.addEventListener('click', () => onTutorial());
    this.muteButton.addEventListener('click', () => {
      const muted = onToggleMute();
      this.setMuted(muted);
    });
  }

  setMuted(muted) {
    this.muteButton.classList.toggle('is-muted', muted);
    this.muteButton.setAttribute('aria-pressed', String(muted));
  }

  show() {
    this.element.classList.add('is-active');
  }

  hide() {
    this.element.classList.remove('is-active');
  }
}
