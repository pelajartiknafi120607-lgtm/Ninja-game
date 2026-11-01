const KEY_ACTIONS = new Map([
  ['ArrowLeft', 'left'],
  ['KeyA', 'left'],
  ['ArrowRight', 'right'],
  ['KeyD', 'right'],
  ['ArrowUp', 'jump'],
  ['KeyW', 'jump'],
  ['Space', 'jump'],
  ['ArrowDown', 'slide'],
  ['KeyS', 'slide'],
  ['Escape', 'pause'],
  ['KeyP', 'pause'],
]);

const PREVENT_KEYS = new Set(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Space']);

export class InputManager {
  constructor(onAction) {
    this.onAction = onAction;
    this.pressed = new Set();
    this.pointerStart = null;
    this.enabled = true;

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handlePointerDown = this.handlePointerDown.bind(this);
    this.handlePointerUp = this.handlePointerUp.bind(this);
    this.handleBlur = this.handleBlur.bind(this);

    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    window.addEventListener('blur', this.handleBlur);
    window.addEventListener('pointerdown', this.handlePointerDown, { passive: true });
    window.addEventListener('pointerup', this.handlePointerUp, { passive: true });
  }

  setEnabled(enabled) {
    this.enabled = enabled;
    if (!enabled) this.pressed.clear();
  }

  handleKeyDown(event) {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    const action = KEY_ACTIONS.get(event.code);
    if (!action) return;
    if (PREVENT_KEYS.has(event.code)) event.preventDefault();
    if (event.repeat || this.pressed.has(event.code)) return;
    this.pressed.add(event.code);
    if (this.enabled) this.onAction(action);
  }

  handleKeyUp(event) {
    this.pressed.delete(event.code);
  }

  handlePointerDown(event) {
    if (event.target.closest?.('button, a, input, textarea, select')) return;
    this.pointerStart = { x: event.clientX, y: event.clientY, time: performance.now() };
  }

  handlePointerUp(event) {
    if (!this.pointerStart) return;
    const start = this.pointerStart;
    this.pointerStart = null;
    if (!this.enabled) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    const distance = Math.hypot(dx, dy);
    if (distance < 28 || performance.now() - start.time > 700) return;
    if (Math.abs(dx) > Math.abs(dy)) {
      this.onAction(dx > 0 ? 'right' : 'left');
    } else {
      this.onAction(dy > 0 ? 'slide' : 'jump');
    }
  }

  handleBlur() {
    this.pressed.clear();
  }

  dispose() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('blur', this.handleBlur);
    window.removeEventListener('pointerdown', this.handlePointerDown);
    window.removeEventListener('pointerup', this.handlePointerUp);
    this.pressed.clear();
  }
}
