import { HUD } from './HUD.js';
import { LevelSelect } from './LevelSelect.js';
import { PauseMenu } from './PauseMenu.js';
import { ResultScreen } from './ResultScreen.js';
import { StartScreen } from './StartScreen.js';
import { Tutorial } from './Tutorial.js';

export class UIManager {
  constructor(callbacks) {
    this.startScreen = new StartScreen({
      onPlay: callbacks.onPlay,
      onTutorial: () => this.showTutorial('start'),
      onToggleMute: callbacks.onToggleMute,
    });
    this.levelSelect = new LevelSelect({
      onSelect: callbacks.onSelectLevel,
      onBack: callbacks.onBack,
    });
    this.hud = new HUD();
    this.pauseMenu = new PauseMenu({
      onResume: callbacks.onResume,
      onRestart: callbacks.onRestart,
      onLevels: callbacks.onPauseLevels,
      onMenu: callbacks.onPauseMenu,
    });
    this.resultScreen = new ResultScreen({
      onNext: callbacks.onNext,
      onRetry: callbacks.onRetry,
      onLevels: callbacks.onLevels,
      onMenu: callbacks.onMenu,
    });
    this.tutorial = new Tutorial({ onClose: () => this.closeTutorial() });

    this.toastElement = document.getElementById('toast');
    this.flashElement = document.getElementById('flash');
    this.toastTimer = null;
    this.flashTimer = null;
    this.tutorialReturn = 'start';
  }

  hideAllScreens() {
    this.startScreen.hide();
    this.levelSelect.hide();
    this.pauseMenu.hide();
    this.resultScreen.hide();
    this.tutorial.hide();
    this.hideToast();
  }

  hideToast() {
    window.clearTimeout(this.toastTimer);
    this.toastElement.classList.remove('is-visible');
  }

  showStart() {
    this.hideAllScreens();
    this.hud.hide();
    this.startScreen.show();
  }

  showLevels(levels) {
    this.hideAllScreens();
    this.hud.hide();
    this.levelSelect.render(levels);
    this.levelSelect.show();
  }

  startGame(level) {
    this.hideAllScreens();
    this.hud.setLevel(level);
    this.hud.reset(level.lives);
    this.hud.show();
  }

  pauseGame() {
    this.hud.hide();
    this.hideToast();
    this.pauseMenu.show();
  }

  resumeGame() {
    this.pauseMenu.hide();
    this.hud.show();
  }

  showResult(result, options) {
    this.hideAllScreens();
    this.hud.hide();
    this.resultScreen.show(result, options);
  }

  showTutorial(returnTo = 'start') {
    this.tutorialReturn = returnTo;
    this.hideAllScreens();
    this.hud.hide();
    this.tutorial.show();
  }

  closeTutorial() {
    this.tutorial.hide();
    this.showStart();
  }

  setMuted(muted) {
    this.startScreen.setMuted(muted);
  }

  toast(message, duration = 1700) {
    window.clearTimeout(this.toastTimer);
    this.toastElement.textContent = message;
    this.toastElement.classList.add('is-visible');
    this.toastTimer = window.setTimeout(() => {
      this.toastElement.classList.remove('is-visible');
    }, duration);
  }

  flash(color = 'rgba(230, 57, 70, 0.4)') {
    window.clearTimeout(this.flashTimer);
    this.flashElement.style.setProperty('--flash-color', color);
    this.flashElement.classList.remove('is-flashing');
    void this.flashElement.offsetWidth;
    this.flashElement.classList.add('is-flashing');
    this.flashTimer = window.setTimeout(() => {
      this.flashElement.classList.remove('is-flashing');
    }, 420);
  }
}
