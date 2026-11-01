import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

export const OBSTACLE_TYPES = {
  barricade: { behavior: 'low', width: 2.1, height: 0.72, depth: 0.5, y: 0, label: 'Barricade' },
  crate: { behavior: 'full', width: 1.65, height: 2.1, depth: 1.3, y: 0, label: 'Peti' },
  barrel: { behavior: 'full', width: 1.3, height: 1.6, depth: 1.3, y: 0, label: 'Barel' },
  hurdle: { behavior: 'low', width: 2.2, height: 0.68, depth: 0.55, y: 0, label: 'Hurdle' },
  lanternGate: { behavior: 'high', width: 1.8, height: 1.45, depth: 0.55, y: 0.95, label: 'Gerbang Lentera' },
  logGate: { behavior: 'high', width: 2.3, height: 1.25, depth: 0.55, y: 0.95, label: 'Gerbang Kayu' },
  stoneArch: { behavior: 'full', width: 1.95, height: 2.5, depth: 0.9, y: 0, label: 'Batu Runtuh' },
  spikedRoller: { behavior: 'full', width: 2.0, height: 1.9, depth: 1.75, y: 0, label: 'Roller Berduri' },
  laserGate: { behavior: 'high', width: 2.4, height: 1.4, depth: 0.35, y: 0.9, label: 'Laser' },
  phoneMonster: { behavior: 'full', width: 1.15, height: 2.0, depth: 0.7, y: 0, label: 'Monster HP' },
  notificationMonster: { behavior: 'full', width: 1.35, height: 1.75, depth: 0.85, y: 0, label: 'Monster Notifikasi' },
};

function addMesh(parent, geometry, material, position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1]) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(position[0], position[1], position[2]);
  mesh.rotation.set(rotation[0], rotation[1], rotation[2]);
  mesh.scale.set(scale[0], scale[1], scale[2]);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function addBox(parent, width, height, depth, material, position, rotation = [0, 0, 0]) {
  return addMesh(parent, new THREE.BoxGeometry(width, height, depth), material, position, rotation);
}

function addCylinder(parent, radiusTop, radiusBottom, height, material, position, rotation = [0, 0, 0], segments = 10) {
  return addMesh(
    parent,
    new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments),
    material,
    position,
    rotation,
  );
}

function addSphere(parent, radius, material, position, scale = [1, 1, 1], segments = 10) {
  return addMesh(
    parent,
    new THREE.SphereGeometry(radius, segments, Math.max(6, Math.floor(segments * 0.75))),
    material,
    position,
    [0, 0, 0],
    scale,
  );
}

function addGlow(parent, assets, color, position, scale) {
  const material = assets.glow(`obstacle-glow-${color.toString(16)}`, color, {
    transparent: true,
    opacity: 0.9,
  });
  return addSphere(parent, 0.16, material, position, scale, 8);
}

export class ObstacleFactory {
  constructor(assets) {
    this.assets = assets;
  }

  create(type) {
    switch (type) {
      case 'crate':
        return this.createCrate();
      case 'barrel':
        return this.createBarrel();
      case 'hurdle':
        return this.createHurdle();
      case 'lanternGate':
        return this.createLanternGate();
      case 'logGate':
        return this.createLogGate();
      case 'stoneArch':
        return this.createStoneArch();
      case 'spikedRoller':
        return this.createSpikedRoller();
      case 'laserGate':
        return this.createLaserGate();
      case 'phoneMonster':
        return this.createPhoneMonster();
      case 'notificationMonster':
        return this.createNotificationMonster();
      default:
        return this.createBarricade();
    }
  }

  createBarricade() {
    const group = new THREE.Group();
    const { wood, woodDark, red, white } = this.assets;
    for (const side of [-1, 1]) {
      addBox(group, 0.16, 0.92, 0.16, woodDark, [side * 0.88, 0.46, 0]);
      addBox(group, 0.5, 0.1, 0.36, wood, [side * 0.88, 0.05, 0]);
    }
    addBox(group, 2.05, 0.18, 0.12, wood, [0, 0.58, 0], [0, 0, 0.03]);
    addBox(group, 2.05, 0.16, 0.12, wood, [0, 0.3, 0], [0, 0, -0.03]);
    for (let i = -2; i <= 2; i += 1) {
      addBox(group, 0.16, 0.2, 0.14, i % 2 === 0 ? red : white, [i * 0.38, 0.58, -0.02], [0, 0, 0.03]);
    }
    addGlow(group, this.assets, 0xffb703, [-0.88, 0.94, 0], [1, 1, 1]);
    addGlow(group, this.assets, 0xffb703, [0.88, 0.94, 0], [1, 1, 1]);
    return group;
  }

  createCrate() {
    const group = new THREE.Group();
    const { wood, woodDark, woodLight, gold } = this.assets;
    addBox(group, 1.3, 1.2, 1.2, wood, [0, 0.6, 0]);
    addBox(group, 1.34, 0.14, 1.24, woodLight, [0, 1.14, 0]);
    addBox(group, 1.34, 0.14, 1.24, woodLight, [0, 0.08, 0]);
    for (const x of [-0.5, 0.5]) {
      addBox(group, 0.12, 1.0, 1.24, woodDark, [x, 0.6, 0]);
    }
    addBox(group, 0.9, 0.78, 0.9, wood, [0.08, 1.58, -0.04], [0, 0.24, 0]);
    addBox(group, 0.94, 0.1, 0.94, woodLight, [0.08, 1.94, -0.04], [0, 0.24, 0]);
    addBox(group, 0.5, 0.5, 0.08, gold, [0.08, 1.58, 0.42], [0, 0.24, 0], [1, 1, 1]);
    return group;
  }

  createBarrel() {
    const group = new THREE.Group();
    const { wood, woodDark, metal, gold } = this.assets;
    addCylinder(group, 0.56, 0.62, 1.34, wood, [0, 0.68, 0], [0, 0, 0], 12);
    for (const y of [0.2, 0.68, 1.16]) {
      addCylinder(group, 0.6, 0.6, 0.09, metal, [0, y, 0], [0, 0, 0], 12);
    }
    addCylinder(group, 0.6, 0.6, 0.08, woodDark, [0, 1.36, 0], [0, 0, 0], 12);
    addCylinder(group, 0.5, 0.5, 0.05, woodDark, [0, 1.4, 0], [0, 0, 0], 12);
    addBox(group, 0.34, 0.34, 0.05, gold, [0, 0.72, 0.58], [0, 0, 0]);
    return group;
  }

  createHurdle() {
    const group = new THREE.Group();
    const { bamboo, bambooDark, red, gold } = this.assets;
    for (const side of [-1, 1]) {
      addCylinder(group, 0.08, 0.1, 0.9, bambooDark, [side * 1.0, 0.45, 0], [0, 0, 0], 7);
      addBox(group, 0.5, 0.1, 0.36, bambooDark, [side * 1.0, 0.05, 0]);
      addCylinder(group, 0.1, 0.1, 0.08, gold, [side * 1.0, 0.76, 0], [0, 0, 0], 7);
    }
    addCylinder(group, 0.075, 0.075, 2.15, bamboo, [0, 0.56, 0], [0, 0, Math.PI / 2], 8);
    addCylinder(group, 0.06, 0.06, 2.0, red, [0, 0.4, 0], [0, 0, Math.PI / 2], 7);
    return group;
  }

  createLanternGate() {
    const group = new THREE.Group();
    const { wood, woodDark, red, gold, lanternGlow } = this.assets;
    for (const side of [-1, 1]) {
      addBox(group, 0.2, 2.75, 0.2, woodDark, [side * 1.28, 1.38, 0]);
      addBox(group, 0.6, 0.12, 0.6, wood, [side * 1.28, 0.06, 0]);
    }
    addBox(group, 2.95, 0.24, 0.34, wood, [0, 2.62, 0]);
    addBox(group, 2.7, 0.12, 0.26, red, [0, 2.42, 0]);
    for (const side of [-1, 1]) {
      addBox(group, 0.04, 0.9, 0.04, woodDark, [side * 0.62, 1.95, 0]);
      addCylinder(group, 0.19, 0.16, 0.42, red, [side * 0.62, 1.32, 0], [0, 0, 0], 8);
      addCylinder(group, 0.2, 0.2, 0.05, gold, [side * 0.62, 1.54, 0], [0, 0, 0], 8);
      addCylinder(group, 0.2, 0.2, 0.05, gold, [side * 0.62, 1.1, 0], [0, 0, 0], 8);
      addSphere(group, 0.13, lanternGlow, [side * 0.62, 1.32, 0], [1, 1.3, 1], 8);
    }
    addGlow(group, this.assets, 0xffb703, [0, 2.64, 0.18], [1.4, 0.8, 1.4]);
    return group;
  }

  createLogGate() {
    const group = new THREE.Group();
    const { wood, woodDark, woodLight, red } = this.assets;
    for (const side of [-1, 1]) {
      addBox(group, 0.24, 2.35, 0.24, woodDark, [side * 1.36, 1.18, 0]);
      addBox(group, 0.62, 0.14, 0.62, wood, [side * 1.36, 0.07, 0]);
    }
    addCylinder(group, 0.22, 0.22, 2.75, wood, [0, 1.36, 0], [0, 0, Math.PI / 2], 10);
    addCylinder(group, 0.15, 0.15, 2.7, woodLight, [0, 1.82, 0], [0, 0, Math.PI / 2], 9);
    for (const side of [-1, 1]) {
      addCylinder(group, 0.05, 0.05, 0.55, red, [side * 1.0, 1.6, 0], [0, 0, 0], 5);
      addCylinder(group, 0.08, 0.08, 0.18, red, [side * 1.0, 1.92, 0], [0, 0, 0], 6);
    }
    return group;
  }

  createStoneArch() {
    const group = new THREE.Group();
    const { stone, stoneDark, stoneLight, gold } = this.assets;
    addBox(group, 0.65, 2.3, 0.85, stoneDark, [-0.8, 1.15, 0]);
    addBox(group, 0.65, 2.3, 0.85, stoneDark, [0.8, 1.15, 0]);
    addBox(group, 2.35, 0.5, 0.95, stone, [0, 2.45, 0]);
    addBox(group, 2.5, 0.18, 1.0, stoneLight, [0, 2.72, 0]);
    for (let i = 0; i < 5; i += 1) {
      addBox(
        group,
        0.5 + Math.random() * 0.45,
        0.36 + Math.random() * 0.5,
        0.5 + Math.random() * 0.4,
        i % 2 === 0 ? stone : stoneDark,
        [(Math.random() - 0.5) * 1.6, 0.2 + Math.random() * 0.35, (Math.random() - 0.5) * 0.55],
        [Math.random() * 0.3, Math.random() * Math.PI, Math.random() * 0.2],
      );
    }
    addBox(group, 0.42, 0.42, 0.08, gold, [0, 2.05, 0.5]);
    return group;
  }

  createSpikedRoller() {
    const group = new THREE.Group();
    const { woodDark, metal, red, gold } = this.assets;
    for (const side of [-1, 1]) {
      addBox(group, 0.26, 0.5, 1.6, metal, [side * 1.22, 0.25, 0]);
      addBox(group, 0.5, 0.16, 1.8, woodDark, [side * 1.22, 0.05, 0]);
    }
    const roller = new THREE.Group();
    roller.position.set(0, 0.98, 0);
    group.add(roller);
    addCylinder(roller, 0.52, 0.52, 1.95, metal, [0, 0, 0], [0, 0, Math.PI / 2], 12);
    for (let ring = 0; ring < 4; ring += 1) {
      const x = -0.72 + ring * 0.48;
      addCylinder(roller, 0.56, 0.56, 0.12, red, [x, 0, 0], [0, 0, Math.PI / 2], 12);
      for (let i = 0; i < 8; i += 1) {
        const angle = (i / 8) * Math.PI * 2 + ring * 0.2;
        addMesh(
          roller,
          new THREE.ConeGeometry(0.12, 0.32, 5),
          gold,
          [x, Math.cos(angle) * 0.68, Math.sin(angle) * 0.68],
          [angle, 0, 0],
        );
      }
    }
    addCylinder(roller, 0.13, 0.13, 2.15, woodDark, [0, 0, 0], [0, 0, Math.PI / 2], 8);
    group.userData.roller = roller;
    return group;
  }

  createLaserGate() {
    const group = new THREE.Group();
    const { metal, metal: dark, red, gold } = this.assets;
    const laser = this.assets.glow('laserBeam', 0xff2b3d);
    for (const side of [-1, 1]) {
      addBox(group, 0.24, 2.5, 0.24, dark, [side * 1.32, 1.25, 0]);
      addBox(group, 0.7, 0.14, 0.7, metal, [side * 1.32, 0.07, 0]);
      for (const y of [1.02, 1.42, 1.82]) {
        addSphere(group, 0.09, laser, [side * 1.16, y, 0], [1, 1, 1], 7);
      }
    }
    for (const y of [1.02, 1.42, 1.82]) {
      addBox(group, 2.5, 0.055, 0.055, laser, [0, y, 0]);
    }
    addBox(group, 0.55, 0.2, 0.16, gold, [0, 2.45, 0.16]);
    addGlow(group, this.assets, 0xff2b3d, [0, 2.45, 0.2], [1.6, 0.7, 1.6]);
    addBox(group, 0.08, 0.08, 0.08, red, [0, 2.3, 0.18]);
    return group;
  }

  createPhoneMonster() {
    const group = new THREE.Group();
    const { suitDark, suit, white, black, neonCyan, neonPink, red } = this.assets;
    addMesh(
      group,
      new RoundedBoxGeometry(1.0, 1.82, 0.4, 3, 0.13),
      suitDark,
      [0, 1.08, 0],
      [0, 0, 0],
    );
    addBox(group, 0.78, 1.16, 0.05, neonCyan, [0, 1.12, 0.22]);
    addBox(group, 0.7, 1.08, 0.03, suit, [0, 1.12, 0.25]);
    for (const side of [-1, 1]) {
      addBox(group, 0.18, 0.24, 0.05, white, [side * 0.2, 1.36, 0.29]);
      addBox(group, 0.09, 0.13, 0.03, black, [side * 0.2, 1.33, 0.32]);
    }
    addBox(group, 0.3, 0.06, 0.04, white, [0, 0.94, 0.29]);
    addCylinder(group, 0.035, 0.045, 0.5, suit, [0.3, 2.05, 0], [0, 0, -0.12], 5);
    addSphere(group, 0.09, red, [0.36, 2.3, 0], [1, 1, 1], 8);
    addBox(group, 0.5, 0.5, 0.12, neonPink, [0.48, 1.86, 0.14], [0, 0, 0.2]);
    addBox(group, 0.09, 0.24, 0.04, white, [0.48, 1.9, 0.22], [0, 0, 0.2]);
    addBox(group, 0.09, 0.09, 0.04, white, [0.48, 1.7, 0.22], [0, 0, 0.2]);

    const arms = [];
    for (const side of [-1, 1]) {
      const arm = new THREE.Group();
      arm.position.set(side * 0.52, 1.45, 0);
      group.add(arm);
      addCylinder(arm, 0.075, 0.09, 0.55, suit, [0, -0.27, 0], [0, 0, side * 0.28], 7);
      addSphere(arm, 0.1, red, [side * 0.08, -0.55, 0], [1, 1, 1], 8);
      arms.push(arm);
    }
    group.userData.arms = arms;
    return group;
  }

  createNotificationMonster() {
    const group = new THREE.Group();
    const { red, redDark, white, suitDark, neonPink, gold } = this.assets;
    addMesh(group, new RoundedBoxGeometry(1.2, 1.15, 0.7, 3, 0.16), red, [0, 1.05, 0]);
    addBox(group, 1.24, 0.18, 0.74, redDark, [0, 0.48, 0]);
    addSphere(group, 0.42, white, [0, 1.18, 0.36], [1, 1, 0.35], 12);
    addBox(group, 0.13, 0.4, 0.05, red, [0, 1.24, 0.53]);
    addBox(group, 0.13, 0.13, 0.05, red, [0, 0.96, 0.53]);
    for (const side of [-1, 1]) {
      addSphere(group, 0.075, suitDark, [side * 0.2, 1.55, 0.32], [1, 1, 0.6], 7);
      addCylinder(group, 0.06, 0.075, 0.48, redDark, [side * 0.58, 0.62, 0], [0, 0, side * 0.35], 6);
      addSphere(group, 0.1, gold, [side * 0.66, 0.36, 0], [1, 1, 1], 8);
    }
    addBox(group, 0.4, 0.12, 0.12, neonPink, [0, 1.78, 0], [0, 0, 0.1]);
    group.userData.arms = [];
    return group;
  }
}
