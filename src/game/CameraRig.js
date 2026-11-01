import * as THREE from 'three';

const MENU_RADIUS = 6.4;
const MENU_HEIGHT = 3.05;
const MENU_TARGET = new THREE.Vector3(-3.15, 1.75, -1.4);

export class CameraRig {
  constructor(camera) {
    this.camera = camera;
    this.mode = 'menu';
    this.angle = 0;
    this.time = 0;
    this.shake = 0;
    this.fov = 55;
    this.desired = new THREE.Vector3(0, MENU_HEIGHT, MENU_RADIUS);
    this.target = new THREE.Vector3(0, 1.4, 0);
    this.lookAt = MENU_TARGET.clone();
    this.resultAngle = 0;
  }

  setMode(mode) {
    this.mode = mode;
  }

  shakeScreen(amount = 0.55) {
    this.shake = Math.max(this.shake, amount);
  }

  resetMenu() {
    this.angle = 0;
    this.time = 0;
    this.shake = 0;
    this.fov = 55;
  }

  snapTo(player) {
    const position = player.root.position;
    this.camera.position.set(position.x * 0.52, 3.65, position.z + 7.35);
    this.lookAt.set(position.x * 0.38, 1.32, position.z - 8.5);
    this.fov = 55;
    this.camera.fov = this.fov;
    this.camera.updateProjectionMatrix();
    this.camera.lookAt(this.lookAt);
  }

  update(dt, player, speed = 0) {
    this.time += dt;
    const playerPosition = player?.root?.position;
    const playerZ = playerPosition?.z || 0;
    const playerX = playerPosition?.x || 0;
    const playerY = playerPosition?.y || 0;
    let desiredFov = 55;

    if (this.mode === 'menu') {
      const sway = Math.sin(this.time * 0.16) * 0.52;
      const radius = MENU_RADIUS + Math.sin(this.time * 0.23) * 0.28;
      this.desired.set(
        Math.sin(sway) * radius,
        MENU_HEIGHT + Math.sin(this.time * 0.42) * 0.18,
        Math.cos(sway) * radius + 0.4,
      );
      this.target.copy(MENU_TARGET);
      this.target.z += playerZ;
      this.lookAt.lerp(this.target, 1 - Math.exp(-3 * dt));
      this.camera.position.lerp(this.desired, 1 - Math.exp(-3.4 * dt));
    } else if (this.mode === 'result') {
      this.resultAngle += dt * 0.28;
      const radius = 5.6;
      this.desired.set(
        playerX + Math.sin(this.resultAngle) * radius,
        2.9 + Math.sin(this.resultAngle * 1.6) * 0.25,
        playerZ + Math.cos(this.resultAngle) * radius + 1.1,
      );
      this.target.set(playerX, 1.35, playerZ - 0.4);
      this.lookAt.lerp(this.target, 1 - Math.exp(-4 * dt));
      this.camera.position.lerp(this.desired, 1 - Math.exp(-4 * dt));
      desiredFov = 52;
    } else {
      const followX = playerX * 0.52;
      this.desired.set(
        followX,
        3.65 + playerY * 0.26 + Math.min(0.22, speed * 0.008),
        playerZ + 7.35,
      );
      this.target.set(playerX * 0.38, 1.32 + playerY * 0.34, playerZ - 8.5);
      const smooth = 1 - Math.exp(-7.5 * dt);
      this.lookAt.lerp(this.target, smooth);
      this.camera.position.lerp(this.desired, 1 - Math.exp(-8 * dt));
      desiredFov = 55 + Math.min(6.5, Math.max(0, speed - 12) * 0.42);
    }

    if (this.shake > 0.001) {
      this.shake = Math.max(0, this.shake - dt * 2.4);
      const strength = this.shake * 0.22;
      this.camera.position.x += (Math.random() - 0.5) * strength;
      this.camera.position.y += (Math.random() - 0.5) * strength;
      this.camera.position.z += (Math.random() - 0.5) * strength * 0.5;
    }

    if (Math.abs(desiredFov - this.fov) > 0.01) {
      this.fov += (desiredFov - this.fov) * (1 - Math.exp(-4 * dt));
      this.camera.fov = this.fov;
      this.camera.updateProjectionMatrix();
    }

    this.camera.lookAt(this.lookAt);
  }
}
