import './styles/main.css';
import './styles/game.css';
import { Game } from './game/Game.js';

const root = document.getElementById('game-root');

try {
  const game = new Game(root);
  window.__focusNinja = game;
} catch (error) {
  console.error('Focus Ninja failed to start:', error);
  const message = document.createElement('div');
  message.style.cssText =
    'position:fixed;inset:0;display:grid;place-items:center;padding:32px;text-align:center;background:#1b1730;color:#fff3d6;font-family:sans-serif;z-index:100;';
  message.innerHTML =
    '<div><h1 style="font-size:1.4rem;margin:0 0 8px">Focus Ninja tidak bisa dimulai</h1><p style="opacity:.7;margin:0">Perangkat ini membutuhkan WebGL. Coba buka dengan Chrome terbaru.</p></div>';
  document.body.appendChild(message);
}
