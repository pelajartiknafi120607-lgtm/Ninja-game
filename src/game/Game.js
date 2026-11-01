import * as THREE from 'three';
import { AudioManager } from './AudioManager.js';
import { CameraRig } from './CameraRig.js';
import { CollisionSystem } from './CollisionSystem.js';
import { CollectibleManager } from './CollectibleManager.js';
import { Environment } from './Environment.js';
import { InputManager } from './InputManager.js';
import { ObstacleManager } from './ObstacleManager.js';
import { Particles } from './Particles.js';
import { Player } from './Player.js';
import { SceneManager } from './SceneManager.js';
import { ScoreManager } from './ScoreManager.js';
import { ThemeAssets } from './assets/ThemeAssets.js';
import { TrackManager } from './TrackManager.js';
import { LEVELS, getLevel, getNextLevel } from '../levels/index.js';
import { UIManager } from '../ui/UIManager.js';

const BURST_COLORS = {
  book: 0x7fd4ff,
  pencil: 0xffd76a,
  star: 0xffe28a,
  focusOrb: 0x00e5ff,
  knowledgeOrb: 0xc89bff,
};

export class Game {
  constructor(container) {
    this.sceneManager = new SceneManager(container);
    this.audio = new AudioManager();
    this.score = new ScoreManager();
    this.player = new Player(this.sceneManager.scene);
    this.cameraRig = new CameraRig(this.sceneManager.camera);
    this.collision = new CollisionSystem();

    this.state = 'menu';
    this.level = null;
    this.assets = null;
    this.environment = null;
    this.obstacles = null;
    this.collectibles = null;
    this.particles = null;
    this.track = null;
    this.distance = 0;
    this.speed = 0;
    this.time = 0;
    this.menuSceneReady = false;

    this.ui = new UIManager({
      onPlay: () => this.showLevelSelect(),
      onBack: () => this.showMenu(),
      onSelectLevel: (id) => this.startLevel(id),
      onToggleMute: () => {
        this.audio.unlock();
        return this.audio.toggleMuted();
      },
      onResume: () => this.resume(),
      onRestart: () => this.restart(),
      onPauseLevels: () => this.showLevelSelect(),
      onPauseMenu: () => this.showMenu(),
      onNext: () => this.nextLevel(),
      onRetry: () => this.restart(),
      onLevels: () => this.showLevelSelect(),
      onMenu: () => this.showMenu(),
    });
    this.ui.setMuted(this.audio.muted);

    this.input = new InputManager((action) => this.handleAction(action));

    this.loadLevel(LEVELS[0], { menu: true });
    this.ui.showStart();

    this.handlePointerUnlock = () => this.audio.unlock();
    this.handleUiClick = (event) => {
      if (!event.target.closest('button')) return;
      this.audio.unlock();
      this.audio.ui();
    };
    this.handleVisibility = () => {
      if (document.hidden && this.state === 'playing') this.pause();
    };
    window.addEventListener('pointerdown', this.handlePointerUnlock, { passive: true });
    document.getElementById('ui-root').addEventListener('click', this.handleUiClick);
    document.addEventListener('visibilitychange', this.handleVisibility);

    this.lastFrame = performance.now();
    this.raf = 0;
    this.loop = (now) => {
      const dt = Math.min(0.05, Math.max(0, (now - this.lastFrame) / 1000));
      this.lastFrame = now;
      this.update(dt);
      this.raf = requestAnimationFrame(this.loop);
    };
    this.raf = requestAnimationFrame(this.loop);
  }

  loadLevel(level, { menu = false } = {}) {
    this.disposeWorld();
    this.level = level;
    this.assets = new ThemeAssets(level);
    this.sceneManager.applyTheme(level);
    this.environment = new Environment(this.sceneManager.scene, level, this.assets);
    this.obstacles = new ObstacleManager(this.sceneManager.scene, this.assets, level);
    this.collectibles = new CollectibleManager(this.sceneManager.scene, this.assets, level);
    this.particles = new Particles(this.sceneManager.scene, level);
    this.track = new TrackManager(level, this.obstacles, this.collectibles);

    this.player.reset();
    this.player.root.position.set(0, 0, 0);
    this.player.root.rotation.y = menu ? Math.PI : 0;
    this.player.shadow.position.set(0, 0.016, 0);
    this.distance = 0;
    this.speed = level.speed.start;
    this.score.reset(level);
    this.cameraRig.setMode(menu ? 'menu' : 'playing');
    if (menu) {
      this.cameraRig.resetMenu();
    } else {
      this.cameraRig.snapTo(this.player);
    }
    this.menuSceneReady = menu;
  }

  disposeWorld() {
    this.track = null;
    this.obstacles?.dispose();
    this.collectibles?.dispose();
    this.particles?.dispose();
    this.environment?.dispose();
    this.assets?.dispose();
    this.obstacles = null;
    this.collectibles = null;
    this.particles = null;
    this.environment = null;
    this.assets = null;
  }

  ensureMenuScene() {
    if (this.menuSceneReady && this.level?.id === LEVELS[0].id) return;
    this.loadLevel(LEVELS[0], { menu: true });
  }

  showMenu() {
    this.ensureMenuScene();
    this.state = 'menu';
    this.ui.showStart();
  }

  showLevelSelect() {
    this.ensureMenuScene();
    this.state = 'levels';
    this.ui.showLevels(LEVELS);
  }

  startLevel(id) {
    const level = getLevel(id);
    if (!level) return;
    this.loadLevel(level, { menu: false });
    this.state = 'playing';
    this.ui.startGame(level);
    this.audio.unlock();
    this.audio.start();
    this.ui.toast(`GO! ${level.name}`, 1300);
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  }

  restart() {
    if (this.level) this.startLevel(this.level.id);
    else this.showLevelSelect();
  }

  nextLevel() {
    const next = this.level ? getNextLevel(this.level.id) : null;
    if (next) this.startLevel(next.id);
    else this.showLevelSelect();
  }

  pause() {
    if (this.state !== 'playing') return;
    this.state = 'paused';
    this.ui.pauseGame();
  }

  resume() {
    if (this.state !== 'paused') return;
    this.state = 'playing';
    this.ui.resumeGame();
  }

  handleAction(action) {
    this.audio.unlock();
    if (action === 'pause') {
      if (this.state === 'playing') this.pause();
      else if (this.state === 'paused') this.resume();
      return;
    }
    if (this.state !== 'playing') return;

    if (action === 'left') {
      this.player.moveLeft();
      this.audio.lane();
    } else if (action === 'right') {
      this.player.moveRight();
      this.audio.lane();
    } else if (action === 'jump') {
      if (this.player.jump()) this.audio.jump();
    } else if (action === 'slide') {
      if (this.player.slide()) this.audio.slide();
    }
  }

  update(dt) {
    if (this.state === 'playing') {
      this.updatePlaying(dt);
    } else if (this.state === 'menu' || this.state === 'levels') {
      this.updateMenu(dt);
    } else if (this.state === 'result') {
      this.updateResult(dt);
    }
    this.sceneManager.render(this.player.root.position.z);
  }

  updateMenu(dt) {
    this.time += dt;
    this.player.update(dt, 0, this.time, { menu: true, distance: 0 });
    this.cameraRig.update(dt, this.player, 0);
    this.particles?.update(dt, 0);
  }

  updatePlaying(dt) {
    this.time += dt;
    this.score.update(dt);

    const progress = Math.min(1, this.distance / this.level.length);
    const speedProgress = Math.min(1, this.distance / (this.level.length * 0.78));
    const targetSpeed = this.level.speed.start + (this.level.speed.max - this.level.speed.start) * speedProgress;
    this.speed += (targetSpeed - this.speed) * (1 - Math.exp(-1.4 * dt));
    this.distance += this.speed * dt;

    this.player.update(dt, this.speed, this.time, { distance: this.distance });
    this.track.update(this.distance);
    this.obstacles.update(dt, this.player.root.position.z, this.time);
    this.collectibles.update(dt, this.player.root.position.z, this.time);
    this.particles.update(dt, this.player.root.position.z);
    this.cameraRig.update(dt, this.player, this.speed);

    this.handleCollisions();
    if (this.state !== 'playing') return;

    this.ui.hud.update({
      score: this.score.score,
      items: this.score.items,
      lives: this.score.lives,
      elapsed: this.score.elapsed,
      progress: this.distance / this.level.length,
    });

    if (this.distance >= this.level.length) this.finishLevel(true);
  }

  updateResult(dt) {
    this.time += dt;
    const playerZ = this.player.root.position.z;
    this.player.update(dt, 0, this.time, {
      menu: !this.score.completed,
      distance: this.distance,
    });
    this.cameraRig.update(dt, this.player, 0);
    this.obstacles?.update(dt, playerZ, this.time);
    this.collectibles?.update(dt, playerZ, this.time);
    this.particles?.update(dt, playerZ);
  }

  handleCollisions() {
    const result = this.collision.check(
      this.player,
      this.obstacles.getActive(),
      this.collectibles.getActive(),
    );

    for (const item of result.collectibles) {
      const type = item.userData.type;
      const position = item.position.clone();
      this.score.addCollectible(type);
      this.audio.collect(type);
      this.particles.burst(position, BURST_COLORS[type] || 0xffd76a, type.includes('Orb') ? 10 : 6, 0.9);
      this.collectibles.release(item);
    }

    if (result.obstacle && this.player.invulnerable <= 0) {
      this.hitObstacle();
    }
  }

  hitObstacle() {
    if (!this.score.registerHit()) return;
    this.player.hit();
    this.audio.hit();
    this.cameraRig.shakeScreen(0.9);
    this.ui.flash('rgba(230, 57, 70, 0.4)');
    const position = this.player.root.position.clone();
    position.y += 1.1;
    this.particles.burst(position, 0xff4d5e, 13, 1.25);
    if (this.score.lives <= 0) {
      this.finishLevel(false);
    } else {
      this.ui.toast('Aduh! Fokus lagi.', 1200);
    }
  }

  finishLevel(completed) {
    if (this.state !== 'playing') return;
    this.state = 'result';
    this.cameraRig.setMode('result');
    this.player.root.rotation.y = Math.PI;
    this.score.finish(completed);

    if (completed) {
      this.player.celebrate();
      this.audio.complete();
      this.ui.flash('rgba(255, 215, 106, 0.35)');
      const position = this.player.root.position.clone();
      position.y += 1.8;
      this.particles.burst(position, 0xffd76a, 20, 1.5);
      this.particles.burst(position, 0xff9fb5, 10, 1.2);
    } else {
      this.player.clearEmote();
      this.audio.fail();
      this.ui.flash('rgba(230, 57, 70, 0.4)');
    }

    this.ui.showResult(this.score.getResult(), {
      hasNext: Boolean(getNextLevel(this.level.id)),
    });
  }

  dispose() {
    cancelAnimationFrame(this.raf);
    window.removeEventListener('pointerdown', this.handlePointerUnlock);
    document.getElementById('ui-root')?.removeEventListener('click', this.handleUiClick);
    document.removeEventListener('visibilitychange', this.handleVisibility);
    this.input.dispose();
    this.disposeWorld();
    this.player.dispose();
    this.sceneManager.dispose();
  }
}
