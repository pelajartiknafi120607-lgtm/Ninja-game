import * as THREE from 'three';
import { CollectibleFactory } from './CollectibleFactory.js';
import { LANES } from '../levels/ThemeConfig.js';

export class CollectibleManager {
  constructor(scene, assets, level) {
    this.scene = scene;
    this.assets = assets;
    this.level = level;
    this.group = new THREE.Group();
    this.group.name = 'Collectibles';
    scene.add(this.group);

    this.factory = new CollectibleFactory(assets);
    this.pools = new Map();
    this.active = [];
    this.geometries = new Set();
    this.materials = new Set();
  }

  spawn(type, lane, distance, height = 1.25) {
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
        const material = child.material;
        if (material?.userData?.local) this.materials.add(material);
      });
    }

    object.visible = true;
    object.position.set(LANES[lane], height, -distance);
    object.rotation.set(0, 0, 0);
    object.userData.type = type;
    object.userData.lane = lane;
    object.userData.distance = distance;
    object.userData.baseY = height;
    object.userData.phase = Math.random() * Math.PI * 2;
    object.userData.spin = 1.6 + Math.random() * 1.4;
    if (object.userData.glow) {
      object.userData.glow.material.opacity = 0.52;
      object.userData.glow.scale.set(1.55, 1.55, 1);
    }

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
      if (object.position.z > playerZ + 12) {
        this.release(object);
        continue;
      }

      object.rotation.y += dt * object.userData.spin;
      object.position.y = object.userData.baseY + Math.sin(time * 2.2 + object.userData.phase) * 0.16;
      const glow = object.userData.glow;
      if (glow) {
        const pulse = 1.55 + Math.sin(time * 3.1 + object.userData.phase) * 0.16;
        glow.scale.set(pulse, pulse, 1);
        glow.material.opacity = 0.46 + Math.sin(time * 3.1 + object.userData.phase) * 0.1;
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
    for (const material of this.materials) material.dispose();
    this.geometries.clear();
    this.materials.clear();
    this.pools.clear();
    this.factory.dispose();
    this.group.removeFromParent();
  }
}
