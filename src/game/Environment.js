import * as THREE from 'three';
import { PropFactory } from './PropFactory.js';
import { LANE_WIDTH, TRACK_WIDTH } from '../levels/ThemeConfig.js';

function makePathTexture(level) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (level.id === 'city') {
    ctx.fillStyle = '#241d3d';
    ctx.fillRect(0, 0, 512, 512);
    const glow = ctx.createLinearGradient(0, 0, 512, 512);
    glow.addColorStop(0, 'rgba(108, 92, 231, 0.18)');
    glow.addColorStop(0.5, 'rgba(0, 0, 0, 0)');
    glow.addColorStop(1, 'rgba(255, 77, 157, 0.12)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, 512, 512);
    ctx.strokeStyle = 'rgba(127, 232, 255, 0.16)';
    ctx.lineWidth = 2;
    for (let x = 0; x <= 512; x += 128) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 512);
      ctx.stroke();
    }
    for (let y = 0; y <= 512; y += 128) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(512, y);
      ctx.stroke();
    }
    for (let i = 0; i < 60; i += 1) {
      ctx.fillStyle = i % 3 === 0 ? 'rgba(0, 229, 255, 0.2)' : 'rgba(255, 77, 157, 0.12)';
      ctx.fillRect(Math.random() * 512, Math.random() * 512, 2 + Math.random() * 3, 2 + Math.random() * 3);
    }
  } else if (level.id === 'temple') {
    ctx.fillStyle = '#9a8fa0';
    ctx.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 500; i += 1) {
      const shade = 120 + Math.floor(Math.random() * 60);
      ctx.fillStyle = `rgba(${shade}, ${shade - 8}, ${shade + 8}, 0.16)`;
      ctx.fillRect(Math.random() * 512, Math.random() * 512, 3 + Math.random() * 7, 2 + Math.random() * 5);
    }
    ctx.strokeStyle = 'rgba(82, 70, 88, 0.55)';
    ctx.lineWidth = 3;
    for (let y = 0; y <= 512; y += 128) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(512, y);
      ctx.stroke();
    }
    for (let x = 0; x <= 512; x += 170) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 512);
      ctx.stroke();
    }
    for (let i = 0; i < 26; i += 1) {
      ctx.fillStyle = 'rgba(255, 194, 209, 0.6)';
      ctx.beginPath();
      ctx.ellipse(Math.random() * 512, Math.random() * 512, 3, 1.6, Math.random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }
  } else {
    ctx.fillStyle = '#8a6a45';
    ctx.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 650; i += 1) {
      const tone = Math.random() > 0.5 ? 'rgba(106, 78, 49, 0.35)' : 'rgba(176, 143, 96, 0.28)';
      ctx.fillStyle = tone;
      const size = 2 + Math.random() * 6;
      ctx.fillRect(Math.random() * 512, Math.random() * 512, size, size * 0.7);
    }
    for (let i = 0; i < 22; i += 1) {
      ctx.fillStyle = 'rgba(196, 186, 166, 0.45)';
      ctx.beginPath();
      ctx.ellipse(
        Math.random() * 512,
        Math.random() * 512,
        4 + Math.random() * 7,
        3 + Math.random() * 5,
        Math.random() * Math.PI,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }
    ctx.fillStyle = 'rgba(111, 191, 74, 0.18)';
    ctx.fillRect(0, 0, 26, 512);
    ctx.fillRect(486, 0, 26, 512);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 4;
  return texture;
}

export class Environment {
  constructor(scene, level, assets) {
    this.scene = scene;
    this.level = level;
    this.assets = assets;
    this.group = new THREE.Group();
    this.group.name = 'Environment';
    scene.add(this.group);

    this.pathTexture = null;
    this.pathMaterial = null;
    this.groundMaterial = null;

    this.buildGround();
    this.props = new PropFactory(level, assets).build();
    this.group.add(this.props);
  }

  buildGround() {
    const assets = this.assets;
    const level = this.level;
    const trackStart = 20;
    const trackEnd = -(level.length + 60);
    const totalLength = trackStart - trackEnd;
    const centerZ = (trackStart + trackEnd) / 2;

    this.pathTexture = makePathTexture(level);
    this.pathTexture.repeat.set(2, totalLength / 8);
    this.pathMaterial = new THREE.MeshToonMaterial({
      map: this.pathTexture,
      gradientMap: assets.gradientMap,
      color: 0xffffff,
    });
    const pathGeometry = new THREE.PlaneGeometry(TRACK_WIDTH + 0.8, totalLength);
    const path = new THREE.Mesh(pathGeometry, this.pathMaterial);
    path.rotation.x = -Math.PI / 2;
    path.position.set(0, 0.005, centerZ);
    path.receiveShadow = true;
    this.group.add(path);

    this.groundMaterial = assets.toon(
      'sideGround',
      level.id === 'city' ? level.colors.cityWallDark : level.id === 'temple' ? level.colors.grassDark : level.colors.grass,
    );
    const groundGeometry = new THREE.PlaneGeometry(230, totalLength + 60);
    const ground = new THREE.Mesh(groundGeometry, this.groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(0, -0.07, centerZ);
    ground.receiveShadow = true;
    this.group.add(ground);

    if (level.id !== 'city') {
      const dividerMaterial = level.id === 'temple' ? assets.stoneLight : assets.stone;
      const dividerGeometry = new THREE.BoxGeometry(0.09, 0.035, totalLength);
      for (const side of [-1, 1]) {
        const divider = new THREE.Mesh(dividerGeometry.clone(), dividerMaterial);
        divider.position.set(side * (LANE_WIDTH / 2), 0.025, centerZ);
        divider.receiveShadow = true;
        this.group.add(divider);
      }
      dividerGeometry.dispose();
    }

    const curbMaterial = level.id === 'city' ? assets.stoneDark : level.id === 'temple' ? assets.stoneDark : assets.woodDark;
    const curbGeometry = new THREE.BoxGeometry(0.24, 0.16, totalLength);
    for (const side of [-1, 1]) {
      const curb = new THREE.Mesh(curbGeometry.clone(), curbMaterial);
      curb.position.set(side * (TRACK_WIDTH / 2 + 0.16), 0.06, centerZ);
      curb.receiveShadow = true;
      this.group.add(curb);
    }
    curbGeometry.dispose();
  }

  update() {
    // Environment geometry is static; animation lives in Particles and obstacle managers.
  }

  dispose() {
    const geometries = new Set();
    const localMaterials = new Set();
    this.group.traverse((child) => {
      if (child.geometry) geometries.add(child.geometry);
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      for (const material of materials) {
        if (material?.userData?.local) localMaterials.add(material);
      }
    });
    for (const geometry of geometries) geometry.dispose();
    for (const material of localMaterials) material.dispose();
    this.pathTexture?.dispose();
    this.pathMaterial?.dispose();
    this.group.removeFromParent();
    this.props = null;
  }
}
