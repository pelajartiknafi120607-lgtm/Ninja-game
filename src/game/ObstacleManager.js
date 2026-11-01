import * as THREE from 'three';
import { ObstacleFactory, OBSTACLE_TYPES } from './ObstacleFactory.js';
import { LANES } from '../levels/ThemeConfig.js';

export class ObstacleManager {
  constructor(scene, assets, level) {
    this.scene = scene;
    this.assets = assets;
    this.level = level;
    this.group = new THREE.Group();
    this.group.name = 'Obstacles';
    scene.add(this.group);

    this.factory = new ObstacleFactory(assets);
    this.pools = new Map();
    this.active = [];
    this.geometries = new Set();
  }

  spawn(type, lane, distance) {
    const meta = OBSTACLE_TYPES[type];
    if (!meta) return null;

    let pool = this.pools.get(type);
    if (!pool) {
      pool = [];
      this.pools.set(type, pool);
    }

    let object = pool.pop();
    if (!object) {
      object = this.factory.create(type);
      object.traverse((child) => {
        if (child.geometry) this.geometries.add(child.geometry);
      });
    }

    object.visible = true;
    object.position.set(LANES[lane], 0, -distance);
    object.rotation.set(0, 0, 0);
    if (object.userData.roller) {
      object.userData.roller.rotation.set(0, 0, 0);
    }
    object.userData.type = type;
    object.userData.meta = meta;
    object.userData.lane = lane;
    object.userData.distance = distance;
    object.userData.phase = Math.random() * Math.PI * 2;

    if (!object.parent) this.group.add(object);
    this.active.push(object);
    return object;
  }

  release(object) {
    object.visible = false;
    object.position.set(0, -60, 0);
    const index = this.active.indexOf(object);
    if (index >= 0) this.active.splice(index, 1);
    const pool = this.pools.get(object.userData.type);
    if (pool) pool.push(object);
  }

  update(dt, playerZ, time) {
    for (let i = this.active.length - 1; i >= 0; i -= 1) {
      const object = this.active[i];
      if (object.position.z > playerZ + 14) {
        this.release(object);
        continue;
      }

      const type = object.userData.type;
      const phase = object.userData.phase || 0;

      if (type === 'spikedRoller') {
        const roller = object.userData.roller;
        if (roller) roller.rotation.x += dt * 5.6;
      } else if (type === 'phoneMonster' || type === 'notificationMonster') {
        object.position.y = Math.sin(time * 2.7 + phase) * 0.06;
        object.rotation.z = Math.sin(time * 2.1 + phase) * 0.035;
        const arms = object.userData.arms;
        if (arms && arms.length) {
          arms.forEach((arm, index) => {
            arm.rotation.z = (index === 0 ? 1 : -1) * (0.18 + Math.sin(time * 3.2 + phase + index) * 0.2);
          });
        }
      } else if (type === 'lanternGate') {
        object.rotation.z = Math.sin(time * 1.4 + phase) * 0.008;
      }
    }
  }

  reset() {
    for (const object of [...this.active]) this.release(object);
  }

  getActive() {
    return this.active;
  }

  dispose() {
    this.reset();
    for (const geometry of this.geometries) geometry.dispose();
    this.geometries.clear();
    this.pools.clear();
    this.group.removeFromParent();
  }
}
