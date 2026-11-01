import * as THREE from 'three';
import { getGlowTexture, getPetalTexture, getSparkTexture } from './utils/TextureFactory.js';

const AMBIENT_PRESETS = {
  leaves: {
    layers: [{ color: 0xa8e86a, size: 0.5, count: 90, texture: 'petal', fall: 1.1, sway: 1.2 }],
  },
  sparks: {
    layers: [
      { color: 0x00e5ff, size: 0.34, count: 80, texture: 'spark', rise: 1.5, sway: 0.8 },
      { color: 0xff4d9d, size: 0.28, count: 40, texture: 'spark', rise: 1.1, sway: 1.4 },
    ],
  },
  petals: {
    layers: [
      { color: 0xffc2d1, size: 0.62, count: 100, texture: 'petal', fall: 1.25, sway: 1.7 },
      { color: 0xfff3d6, size: 0.32, count: 40, texture: 'spark', fall: 0.7, sway: 1.1 },
    ],
  },
};

const BURST_MAX = 56;

export class Particles {
  constructor(scene, level) {
    this.scene = scene;
    this.level = level;
    this.group = new THREE.Group();
    this.group.name = 'Particles';
    scene.add(this.group);

    this.layers = [];
    this.bursts = [];
    this.burstIndex = 0;

    this.buildAmbient(level.ambientParticles || 'leaves');
    this.buildBursts();
  }

  buildAmbient(kind) {
    const preset = AMBIENT_PRESETS[kind] || AMBIENT_PRESETS.leaves;
    const textures = {
      petal: getPetalTexture(),
      spark: getSparkTexture(),
    };

    for (const layer of preset.layers) {
      const positions = new Float32Array(layer.count * 3);
      const speeds = new Float32Array(layer.count);
      const phases = new Float32Array(layer.count);
      for (let i = 0; i < layer.count; i += 1) {
        positions[i * 3] = (Math.random() - 0.5) * 46;
        positions[i * 3 + 1] = Math.random() * 20;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 90;
        speeds[i] = 0.6 + Math.random() * 0.8;
        phases[i] = Math.random() * Math.PI * 2;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      const material = new THREE.PointsMaterial({
        color: layer.color,
        size: layer.size,
        map: textures[layer.texture],
        transparent: true,
        opacity: layer.texture === 'petal' ? 0.85 : 0.7,
        depthWrite: false,
        alphaTest: 0.02,
        sizeAttenuation: true,
        blending: layer.texture === 'spark' ? THREE.AdditiveBlending : THREE.NormalBlending,
        toneMapped: false,
      });

      const points = new THREE.Points(geometry, material);
      points.frustumCulled = false;
      points.renderOrder = 3;
      this.group.add(points);

      this.layers.push({
        points,
        positions,
        speeds,
        phases,
        count: layer.count,
        fall: layer.fall || 0,
        rise: layer.rise || 0,
        sway: layer.sway || 1,
      });
    }
  }

  buildBursts() {
    const texture = getGlowTexture();
    for (let i = 0; i < BURST_MAX; i += 1) {
      const material = new THREE.SpriteMaterial({
        map: texture,
        color: 0xffffff,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
      });
      const sprite = new THREE.Sprite(material);
      sprite.visible = false;
      sprite.renderOrder = 4;
      this.group.add(sprite);
      this.bursts.push({
        sprite,
        velocity: new THREE.Vector3(),
        life: 0,
        maxLife: 0,
        startScale: 1,
        gravity: 0,
      });
    }
  }

  burst(position, color = 0xffd76a, count = 10, power = 1) {
    for (let i = 0; i < count; i += 1) {
      const item = this.bursts[this.burstIndex];
      this.burstIndex = (this.burstIndex + 1) % BURST_MAX;
      const angle = Math.random() * Math.PI * 2;
      const vertical = (Math.random() - 0.25) * 4.4;
      const radial = (0.9 + Math.random() * 2.4) * power;
      item.velocity.set(Math.cos(angle) * radial, vertical, Math.sin(angle) * radial * 0.8);
      item.life = 0;
      item.maxLife = 0.42 + Math.random() * 0.34;
      item.startScale = (0.32 + Math.random() * 0.45) * power;
      item.gravity = -6;
      item.sprite.position.copy(position);
      item.sprite.position.x += (Math.random() - 0.5) * 0.5;
      item.sprite.position.y += (Math.random() - 0.5) * 0.4;
      item.sprite.position.z += (Math.random() - 0.5) * 0.5;
      item.sprite.material.color.setHex(color);
      item.sprite.material.opacity = 0.9;
      item.sprite.scale.setScalar(item.startScale);
      item.sprite.visible = true;
    }
  }

  update(dt, playerZ = 0) {
    const time = performance.now() * 0.001;
    for (const layer of this.layers) {
      const { positions, speeds, phases, count, fall, rise, sway } = layer;
      for (let i = 0; i < count; i += 1) {
        const ix = i * 3;
        const phase = phases[i];
        if (fall > 0) {
          positions[ix + 1] -= speeds[i] * fall * dt;
          positions[ix] += Math.sin(time * 0.8 + phase) * sway * dt;
        } else {
          positions[ix + 1] += speeds[i] * rise * dt;
          positions[ix] += Math.cos(time * 1.1 + phase) * sway * dt;
        }
        positions[ix + 2] += dt * 1.4;

        if (positions[ix + 1] < -0.4) positions[ix + 1] = 19;
        if (positions[ix + 1] > 21) positions[ix + 1] = 0.5;
        if (positions[ix + 2] > playerZ + 34) positions[ix + 2] = playerZ - 56;
        if (positions[ix + 2] < playerZ - 58) positions[ix + 2] = playerZ + 32;
        if (positions[ix] > 24) positions[ix] = -24;
        if (positions[ix] < -24) positions[ix] = 24;
      }
      layer.points.geometry.attributes.position.needsUpdate = true;
    }

    for (const item of this.bursts) {
      if (item.life >= item.maxLife) {
        if (item.sprite.visible) item.sprite.visible = false;
        continue;
      }
      item.life += dt;
      const progress = Math.min(1, item.life / item.maxLife);
      item.velocity.y += item.gravity * dt;
      item.sprite.position.addScaledVector(item.velocity, dt);
      item.sprite.material.opacity = (1 - progress) * 0.9;
      item.sprite.scale.setScalar(item.startScale * (1 + progress * 1.8));
    }
  }

  dispose() {
    for (const layer of this.layers) {
      layer.points.geometry.dispose();
      layer.points.material.dispose();
    }
    this.layers.length = 0;
    for (const item of this.bursts) {
      item.sprite.material.dispose();
    }
    this.bursts.length = 0;
    this.group.removeFromParent();
  }
}
