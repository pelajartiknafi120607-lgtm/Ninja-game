import * as THREE from 'three';
import { getGlowTexture } from './utils/TextureFactory.js';

const COLLECTIBLE_STYLES = {
  book: { color: 0x4d9de0, glow: 0x7fd4ff, scale: 1 },
  pencil: { color: 0xf4b942, glow: 0xffd76a, scale: 1 },
  star: { color: 0xffd76a, glow: 0xffd76a, scale: 1 },
  focusOrb: { color: 0x00e5ff, glow: 0x00e5ff, scale: 1 },
  knowledgeOrb: { color: 0x9d6bff, glow: 0xc89bff, scale: 1 },
};

function addMesh(parent, geometry, material, position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1]) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(position[0], position[1], position[2]);
  mesh.rotation.set(rotation[0], rotation[1], rotation[2]);
  mesh.scale.set(scale[0], scale[1], scale[2]);
  mesh.castShadow = false;
  mesh.receiveShadow = false;
  parent.add(mesh);
  return mesh;
}

function makeStarGeometry(outerRadius = 0.3, innerRadius = 0.13) {
  const shape = new THREE.Shape();
  const points = 5;
  for (let i = 0; i < points * 2; i += 1) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.1,
    bevelEnabled: true,
    bevelSegments: 1,
    bevelSize: 0.02,
    bevelThickness: 0.02,
  });
  geometry.center();
  return geometry;
}

export class CollectibleFactory {
  constructor(assets) {
    this.assets = assets;
    this.starGeometry = makeStarGeometry();
  }

  create(type) {
    const group = new THREE.Group();
    const style = COLLECTIBLE_STYLES[type] || COLLECTIBLE_STYLES.star;
    const { assets } = this;

    if (type === 'book') {
      addMesh(group, new THREE.BoxGeometry(0.52, 0.66, 0.16), assets.red, [0, 0, 0], [0.2, 0.25, -0.12]);
      addMesh(group, new THREE.BoxGeometry(0.46, 0.58, 0.12), assets.white, [0.02, 0, 0], [0.2, 0.25, -0.12]);
      addMesh(group, new THREE.BoxGeometry(0.54, 0.08, 0.18), assets.gold, [0, 0.3, 0], [0.2, 0.25, -0.12]);
      addMesh(group, new THREE.BoxGeometry(0.08, 0.66, 0.17), assets.redDark, [-0.23, 0, 0], [0.2, 0.25, -0.12]);
    } else if (type === 'pencil') {
      addMesh(group, new THREE.CylinderGeometry(0.075, 0.075, 0.72, 8), assets.gold, [0, 0, 0], [0, 0, -0.55]);
      addMesh(group, new THREE.ConeGeometry(0.075, 0.2, 8), assets.white, [0, -0.45, 0], [0, 0, -0.55]);
      addMesh(group, new THREE.ConeGeometry(0.035, 0.1, 8), assets.black, [0, -0.53, 0], [0, 0, -0.55]);
      addMesh(group, new THREE.CylinderGeometry(0.078, 0.078, 0.09, 8), assets.sakura, [0, 0.39, 0], [0, 0, -0.55]);
      addMesh(group, new THREE.CylinderGeometry(0.082, 0.082, 0.07, 8), assets.metal, [0, 0.33, 0], [0, 0, -0.55]);
    } else if (type === 'star') {
      addMesh(group, this.starGeometry, assets.goldLight, [0, 0, 0], [0.1, 0.2, 0]);
      addMesh(group, this.starGeometry, assets.gold, [0, 0, -0.02], [0.1, 0.2, 0], [0.8, 0.8, 0.8]);
    } else if (type === 'focusOrb') {
      addMesh(group, new THREE.SphereGeometry(0.28, 14, 10), assets.glow('focusCore', 0x9ff5ff), [0, 0, 0]);
      addMesh(group, new THREE.SphereGeometry(0.17, 10, 8), assets.glow('focusInner', 0xffffff), [0.03, 0.04, 0.06]);
      addMesh(group, new THREE.TorusGeometry(0.4, 0.028, 6, 28), assets.focusGlow, [0, 0, 0], [1.2, 0.2, 0]);
      addMesh(group, new THREE.TorusGeometry(0.34, 0.02, 6, 24), assets.focusGlow, [0, 0, 0], [0.3, 1.1, 0.4]);
    } else if (type === 'knowledgeOrb') {
      addMesh(group, new THREE.SphereGeometry(0.29, 14, 10), assets.glow('knowledgeCore', 0xc89bff), [0, 0, 0]);
      addMesh(group, new THREE.SphereGeometry(0.18, 10, 8), assets.glow('knowledgeInner', 0xffffff), [0.02, 0.05, 0.08]);
      addMesh(group, new THREE.TorusGeometry(0.42, 0.03, 6, 28), assets.neonPurple, [0, 0, 0], [0.8, 0.4, 0.2]);
      addMesh(group, new THREE.TorusGeometry(0.36, 0.025, 6, 24), assets.neonPink, [0, 0, 0], [1.4, 0.1, 0.7]);
      addMesh(group, this.starGeometry, assets.goldLight, [0, 0.02, 0], [0.4, 0.2, 0], [0.28, 0.28, 0.28]);
    }

    const glowMaterial = new THREE.SpriteMaterial({
      map: getGlowTexture(),
      color: style.glow,
      transparent: true,
      opacity: 0.52,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    });
    glowMaterial.userData.local = true;
    const glow = new THREE.Sprite(glowMaterial);
    glow.scale.set(1.55, 1.55, 1);
    glow.renderOrder = 3;
    group.add(glow);
    group.userData.glow = glow;
    group.userData.type = type;
    return group;
  }

  dispose() {
    this.starGeometry.dispose();
  }
}
