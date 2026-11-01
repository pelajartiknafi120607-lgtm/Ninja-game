import { createNinja } from './CharacterFactory.js';
import { LANES } from '../levels/ThemeConfig.js';

const GRAVITY = 30;
const JUMP_VELOCITY = 9.6;
const SLIDE_DURATION = 0.62;
const INVULNERABLE_DURATION = 1.25;

export class Player {
  constructor(scene) {
    this.character = createNinja();
    this.root = this.character.root;
    this.model = this.character.model;
    this.shadow = this.character.shadow;

    scene.add(this.root);
    scene.add(this.shadow);

    this.lane = 1;
    this.x = 0;
    this.targetX = 0;
    this.y = 0;
    this.vy = 0;
    this.isJumping = false;
    this.isSliding = false;
    this.slideTimer = 0;
    this.invulnerable = 0;
    this.blinkTimer = 0;
    this.state = 'idle';
    this.speed = 0;
    this.time = 0;
    this.emote = null;
  }

  reset() {
    this.lane = 1;
    this.x = 0;
    this.targetX = 0;
    this.y = 0;
    this.vy = 0;
    this.isJumping = false;
    this.isSliding = false;
    this.slideTimer = 0;
    this.invulnerable = 0;
    this.blinkTimer = 0;
    this.state = 'idle';
    this.emote = null;
    this.root.visible = true;
    this.shadow.visible = true;
    this.root.position.set(0, 0, 0);
    this.shadow.position.set(0, 0.016, 0);
  }

  celebrate() {
    this.emote = 'victory';
  }

  clearEmote() {
    this.emote = null;
  }

  moveLeft() {
    if (this.lane > 0) {
      this.lane -= 1;
      this.targetX = LANES[this.lane];
    }
  }

  moveRight() {
    if (this.lane < LANES.length - 1) {
      this.lane += 1;
      this.targetX = LANES[this.lane];
    }
  }

  jump() {
    if (this.isJumping || this.isSliding) return false;
    this.isJumping = true;
    this.vy = JUMP_VELOCITY;
    return true;
  }

  slide() {
    if (this.isSliding || this.isJumping) return false;
    this.isSliding = true;
    this.slideTimer = SLIDE_DURATION;
    return true;
  }

  hit() {
    if (this.invulnerable > 0) return false;
    this.invulnerable = INVULNERABLE_DURATION;
    this.blinkTimer = 0;
    this.character.setFlash();
    return true;
  }

  update(dt, speed, time, options = {}) {
    const { menu = false, distance = 0 } = options;
    this.speed = speed;
    this.time = time;

    const laneBlend = 1 - Math.exp(-15 * dt);
    this.x += (this.targetX - this.x) * laneBlend;

    if (this.isJumping) {
      this.vy -= GRAVITY * dt;
      this.y += this.vy * dt;
      if (this.y <= 0) {
        this.y = 0;
        this.vy = 0;
        this.isJumping = false;
      }
    }

    if (this.isSliding) {
      this.slideTimer -= dt;
      if (this.slideTimer <= 0) {
        this.isSliding = false;
        this.slideTimer = 0;
      }
    }

    if (this.invulnerable > 0) {
      this.invulnerable -= dt;
      this.blinkTimer += dt;
      this.root.visible = Math.floor(this.blinkTimer * 15) % 2 === 0;
      if (this.invulnerable <= 0) {
        this.invulnerable = 0;
        this.root.visible = true;
      }
    } else {
      this.root.visible = true;
    }

    let state = 'idle';
    if (this.invulnerable > INVULNERABLE_DURATION - 0.4) state = 'hit';
    else if (this.isSliding) state = 'slide';
    else if (this.isJumping) state = 'jump';
    else if (this.emote === 'victory') state = 'victory';
    else if (menu) state = 'idle';
    else state = 'run';

    this.state = state;
    this.character.update(dt, { state, speed, time });

    this.root.position.set(this.x, this.y, -distance);

    this.shadow.position.set(this.x, 0.016, -distance);
    const shadowScale = Math.max(0.56, 1 - this.y * 0.2);
    this.shadow.scale.set(shadowScale, shadowScale, shadowScale);
    this.shadow.material.opacity = 0.58 * Math.max(0.24, 1 - this.y * 0.24);
  }

  getCollisionBox() {
    return {
      x: this.x,
      y: this.y,
      width: 0.82,
      height: this.isSliding ? 0.75 : 2.2,
      depth: 0.72,
    };
  }

  dispose() {
    this.character.dispose();
    this.root.removeFromParent();
    this.shadow.removeFromParent();
  }
}
