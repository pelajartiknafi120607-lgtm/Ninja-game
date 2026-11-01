import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { getGradientMap, getShadowTexture } from './utils/TextureFactory.js';

const PI = Math.PI;

function createMaterials() {
  const gradientMap = getGradientMap();
  const make = (color, options = {}) =>
    new THREE.MeshToonMaterial({
      color,
      gradientMap,
      ...options,
    });

  return {
    suit: make(0x1e1b2a),
    suitLight: make(0x2b2740),
    suitDark: make(0x121019),
    red: make(0xe63946),
    redDark: make(0xb71c2b),
    skin: make(0xf3c6a5),
    skinShadow: make(0xd9a07c),
    hair: make(0x17151f),
    white: make(0xfff8e7),
    gold: make(0xf4b942),
    eyeWhite: make(0xfff8e7),
    iris: make(0x5a3825),
    pupil: make(0x1a1010),
    black: make(0x0d0b12),
    sole: make(0xf1e6d0),
  };
}

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

function addRounded(parent, width, height, depth, radius, material, position, rotation = [0, 0, 0], scale = [1, 1, 1]) {
  const geometry = new RoundedBoxGeometry(width, height, depth, 3, radius);
  return addMesh(parent, geometry, material, position, rotation, scale);
}

function addSphere(parent, radius, material, position, scale = [1, 1, 1], segments = 12) {
  return addMesh(
    parent,
    new THREE.SphereGeometry(radius, segments, Math.max(8, Math.floor(segments * 0.75))),
    material,
    position,
    [0, 0, 0],
    scale,
  );
}

function addCapsule(parent, radius, length, material, position, rotation = [0, 0, 0]) {
  return addMesh(parent, new THREE.CapsuleGeometry(radius, length, 4, 10), material, position, rotation);
}

function addCylinder(parent, radiusTop, radiusBottom, height, material, position, rotation = [0, 0, 0], segments = 12) {
  return addMesh(
    parent,
    new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments),
    material,
    position,
    rotation,
  );
}

function makeStarGeometry(outerRadius = 0.1, innerRadius = 0.045) {
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
    depth: 0.018,
    bevelEnabled: true,
    bevelSegments: 1,
    bevelSize: 0.004,
    bevelThickness: 0.004,
  });
  geometry.center();
  return geometry;
}

export function createNinja() {
  const materials = createMaterials();
  const starGeometry = makeStarGeometry();

  const root = new THREE.Group();
  root.name = 'FocusNinja';

  const model = new THREE.Group();
  root.add(model);

  // ---------------------------------------------------------------------------
  // Legs
  // ---------------------------------------------------------------------------
  function makeLeg(side) {
    const pivot = new THREE.Group();
    pivot.position.set(side * 0.19, 0.82, 0);
    model.add(pivot);

    addCapsule(pivot, 0.125, 0.24, materials.suit, [0, -0.16, 0]);
    addRounded(pivot, 0.24, 0.1, 0.24, 0.04, materials.redDark, [0, -0.34, 0]);

    const knee = new THREE.Group();
    knee.position.set(0, -0.34, 0);
    pivot.add(knee);

    addCapsule(knee, 0.105, 0.22, materials.suit, [0, -0.15, 0]);
    addCylinder(knee, 0.12, 0.12, 0.06, materials.red, [0, -0.31, 0]);

    const shoe = new THREE.Group();
    shoe.position.set(0, -0.37, -0.04);
    knee.add(shoe);

    addRounded(shoe, 0.29, 0.1, 0.44, 0.04, materials.sole, [0, -0.03, -0.06]);
    addRounded(shoe, 0.27, 0.18, 0.36, 0.055, materials.red, [0, 0.07, -0.02]);
    addRounded(shoe, 0.24, 0.12, 0.18, 0.04, materials.white, [0, 0.05, -0.19]);
    addRounded(shoe, 0.26, 0.045, 0.3, 0.02, materials.white, [0, 0.155, 0.02]);
    for (let i = 0; i < 3; i += 1) {
      addRounded(shoe, 0.16, 0.014, 0.022, 0.006, materials.white, [0, 0.125, 0.015 + i * 0.052]);
    }

    return { pivot, knee, shoe };
  }

  const legL = makeLeg(-1);
  const legR = makeLeg(1);

  // ---------------------------------------------------------------------------
  // Torso
  // ---------------------------------------------------------------------------
  const torso = new THREE.Group();
  torso.position.set(0, 0.82, 0);
  model.add(torso);

  addRounded(torso, 0.72, 0.7, 0.46, 0.12, materials.suit, [0, 0.35, 0]);
  addRounded(torso, 0.62, 0.38, 0.44, 0.1, materials.suitLight, [0, 0.38, -0.015]);
  addRounded(torso, 0.68, 0.16, 0.48, 0.05, materials.red, [0, 0.1, 0]);
  addRounded(torso, 0.78, 0.08, 0.5, 0.035, materials.redDark, [0, 0.01, 0]);
  addRounded(torso, 0.1, 0.1, 0.07, 0.025, materials.gold, [0, 0.1, -0.255]);
  addRounded(torso, 0.08, 0.22, 0.06, 0.025, materials.red, [0, 0.42, -0.245]);

  const chestStar = addMesh(torso, starGeometry, materials.white, [0, 0.42, -0.27], [0, PI, 0], [0.7, 0.7, 0.7]);
  chestStar.castShadow = false;
  const backStar = addMesh(torso, starGeometry, materials.white, [0, 0.42, 0.27], [0, 0, 0], [0.62, 0.62, 0.62]);
  backStar.castShadow = false;

  addRounded(torso, 0.16, 0.16, 0.16, 0.05, materials.skin, [0, 0.73, 0]);

  // ---------------------------------------------------------------------------
  // Arms
  // ---------------------------------------------------------------------------
  function makeArm(side) {
    const pivot = new THREE.Group();
    pivot.position.set(side * 0.42, 0.58, 0);
    torso.add(pivot);

    addSphere(pivot, 0.14, materials.red, [0, 0.015, 0], [1, 0.9, 1], 10);
    addCapsule(pivot, 0.105, 0.22, materials.suit, [0, -0.17, 0]);

    const elbow = new THREE.Group();
    elbow.position.set(0, -0.32, 0);
    pivot.add(elbow);

    addCapsule(elbow, 0.09, 0.18, materials.suit, [0, -0.12, 0]);
    addCylinder(elbow, 0.105, 0.105, 0.06, materials.red, [0, -0.25, 0]);
    addSphere(elbow, 0.1, materials.skin, [0, -0.32, 0], [1, 0.9, 1], 10);
    addRounded(elbow, 0.16, 0.12, 0.13, 0.04, materials.suitDark, [0, -0.3, 0]);

    return { pivot, elbow };
  }

  const armL = makeArm(-1);
  const armR = makeArm(1);

  // ---------------------------------------------------------------------------
  // Head
  // ---------------------------------------------------------------------------
  const head = new THREE.Group();
  head.position.set(0, 0.78, 0);
  torso.add(head);

  addSphere(head, 0.5, materials.skin, [0, 0.32, 0], [1.02, 1.0, 0.98], 18);

  const hairCap = new THREE.Mesh(
    new THREE.SphereGeometry(0.52, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.57),
    materials.hair,
  );
  hairCap.position.set(0, 0.36, 0.01);
  hairCap.scale.set(1.02, 1.02, 1.02);
  hairCap.castShadow = true;
  head.add(hairCap);

  addSphere(head, 0.46, materials.hair, [0, 0.32, 0.16], [1.0, 0.95, 0.72], 14);

  // Hair fringe
  addRounded(head, 0.2, 0.2, 0.12, 0.04, materials.hair, [-0.2, 0.58, -0.37], [0.1, 0, 0.28]);
  addRounded(head, 0.24, 0.17, 0.13, 0.04, materials.hair, [0.02, 0.62, -0.38], [-0.05, 0, -0.12]);
  addRounded(head, 0.18, 0.16, 0.12, 0.04, materials.hair, [0.22, 0.57, -0.36], [0.1, 0, -0.3]);

  // Ears
  addSphere(head, 0.13, materials.skin, [-0.49, 0.3, 0.01], [0.55, 0.9, 0.7], 10);
  addSphere(head, 0.13, materials.skin, [0.49, 0.3, 0.01], [0.55, 0.9, 0.7], 10);

  // Eyes
  for (const side of [-1, 1]) {
    addSphere(head, 0.105, materials.eyeWhite, [side * 0.17, 0.31, -0.455], [1, 1.24, 0.34], 12);
    addSphere(head, 0.058, materials.iris, [side * 0.17, 0.31, -0.49], [1, 1.12, 0.3], 10);
    addSphere(head, 0.033, materials.pupil, [side * 0.17, 0.31, -0.505], [1, 1.1, 0.3], 8);
    addSphere(head, 0.016, materials.white, [side * 0.17 - 0.018, 0.335, -0.518], [1, 1, 1], 6);
    addRounded(
      head,
      0.17,
      0.035,
      0.03,
      0.012,
      materials.hair,
      [side * 0.17, 0.455, -0.47],
      [0, 0, side * 0.16],
    );
  }

  addSphere(head, 0.032, materials.skinShadow, [0, 0.235, -0.505], [1, 0.8, 0.6], 8);
  addRounded(head, 0.1, 0.022, 0.022, 0.008, materials.hair, [0, 0.135, -0.48], [0, 0, 0]);

  // Headband
  const headband = new THREE.Mesh(
    new THREE.CylinderGeometry(0.525, 0.525, 0.145, 24, 1, true),
    materials.red,
  );
  headband.position.set(0, 0.46, 0);
  headband.castShadow = true;
  head.add(headband);
  addCylinder(head, 0.535, 0.535, 0.045, materials.redDark, [0, 0.405, 0]);
  addCylinder(head, 0.535, 0.535, 0.045, materials.redDark, [0, 0.515, 0]);
  addMesh(head, starGeometry, materials.white, [0, 0.46, -0.53], [0, PI, 0], [0.55, 0.55, 0.55]);

  const headbandKnot = addSphere(head, 0.11, materials.redDark, [0, 0.46, 0.44], [1, 1, 1], 10);

  function makeRibbon(x, y, z, width, length, rotation) {
    const group = new THREE.Group();
    group.position.set(x, y, z);
    group.rotation.set(rotation[0], rotation[1], rotation[2]);
    head.add(group);
    addRounded(group, width, 0.055, length, 0.018, materials.red, [0, 0, length * 0.5]);
    addRounded(group, width * 0.82, 0.045, length * 0.72, 0.014, materials.redDark, [0, 0, length * 0.7]);
    return group;
  }

  const headbandTailL = makeRibbon(-0.06, 0.46, 0.45, 0.11, 0.55, [0.18, -0.16, 0.12]);
  const headbandTailR = makeRibbon(0.06, 0.44, 0.45, 0.1, 0.46, [0.28, 0.2, -0.14]);

  // Scarf
  const scarf = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.075, 8, 18), materials.red);
  scarf.position.set(0, 0.68, 0);
  scarf.rotation.x = PI / 2;
  scarf.scale.set(1.05, 1, 0.9);
  scarf.castShadow = true;
  torso.add(scarf);

  const scarfTail = new THREE.Group();
  scarfTail.position.set(0.1, 0.65, 0.22);
  torso.add(scarfTail);
  addRounded(scarfTail, 0.15, 0.06, 0.62, 0.02, materials.red, [0, 0, 0.3], [0.1, 0.15, 0]);
  addRounded(scarfTail, 0.12, 0.05, 0.46, 0.016, materials.redDark, [0.02, -0.01, 0.52], [0.1, 0.15, 0]);

  // ---------------------------------------------------------------------------
  // Shadow blob
  // ---------------------------------------------------------------------------
  const shadowMaterial = new THREE.MeshBasicMaterial({
    map: getShadowTexture(),
    transparent: true,
    opacity: 0.58,
    depthWrite: false,
    color: 0xffffff,
  });
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(1.55, 1.55), shadowMaterial);
  shadow.rotation.x = -PI / 2;
  shadow.position.y = 0.015;
  shadow.renderOrder = 2;

  // ---------------------------------------------------------------------------
  // Animation
  // ---------------------------------------------------------------------------
  const bones = {
    torso,
    head,
    armL,
    armR,
    legL,
    legR,
    scarfTail,
    headbandTailL,
    headbandTailR,
    headbandKnot,
  };

  const current = {
    torsoX: 0.04,
    torsoY: 0,
    headX: 0,
    headY: 0,
    armLX: 0,
    armRX: 0,
    armLZ: 0.06,
    armRZ: -0.06,
    elbowLX: -0.18,
    elbowRX: -0.18,
    legLX: 0,
    legRX: 0,
    kneeLX: 0.08,
    kneeRX: 0.08,
    modelY: 0,
    modelX: 0,
    modelZ: 0,
    scarfX: 0.2,
    scarfY: 0,
    bandLX: 0.2,
    bandRX: 0.3,
  };

  let flashTimer = 0;

  function setFlash(amount = 0.16) {
    flashTimer = amount;
    for (const material of Object.values(materials)) {
      if (material.emissive) {
        material.emissive.setHex(0xff2b3d);
        material.emissiveIntensity = 0.85;
      }
    }
  }

  function update(dt, { state, speed = 0, time = 0 }) {
    const blend = 1 - Math.exp(-14 * Math.min(dt, 0.05));
    const phase = time * (7.2 + speed * 0.28);

    let targets;

    if (state === 'jump') {
      targets = {
        torsoX: 0.22,
        headX: -0.1,
        headY: 0,
        armLX: -2.25,
        armRX: -2.25,
        armLZ: 0.45,
        armRZ: -0.45,
        elbowLX: -0.35,
        elbowRX: -0.35,
        legLX: -0.95,
        legRX: -0.55,
        kneeLX: 1.15,
        kneeRX: 0.9,
        modelY: 0,
        modelX: 0.06,
        modelZ: 0,
        scarfX: 0.75,
        scarfY: 0.1,
        bandLX: 0.8,
        bandRX: 0.9,
      };
    } else if (state === 'slide') {
      targets = {
        torsoX: -0.18,
        headX: 0.28,
        headY: 0,
        armLX: 1.15,
        armRX: 1.0,
        armLZ: 0.35,
        armRZ: -0.35,
        elbowLX: 0.1,
        elbowRX: 0.1,
        legLX: -1.35,
        legRX: -1.15,
        kneeLX: 0.18,
        kneeRX: 0.22,
        modelY: 0.06,
        modelX: 1.04,
        modelZ: 0.02,
        scarfX: -0.35,
        scarfY: -0.1,
        bandLX: -0.2,
        bandRX: -0.1,
      };
    } else if (state === 'hit') {
      const wobble = Math.sin(time * 34);
      targets = {
        torsoX: -0.08,
        headX: 0.12 + wobble * 0.08,
        headY: wobble * 0.08,
        armLX: -1.35 + wobble * 0.35,
        armRX: -1.15 - wobble * 0.35,
        armLZ: 0.85,
        armRZ: -0.85,
        elbowLX: -0.2,
        elbowRX: -0.2,
        legLX: 0.25 * wobble,
        legRX: -0.25 * wobble,
        kneeLX: 0.25,
        kneeRX: 0.25,
        modelY: 0.04,
        modelX: -0.15,
        modelZ: wobble * 0.1,
        scarfX: 0.6,
        scarfY: wobble * 0.3,
        bandLX: 0.6,
        bandRX: 0.5,
      };
    } else if (state === 'victory') {
      const hop = Math.abs(Math.sin(time * 5.4));
      targets = {
        torsoX: 0.03,
        headX: -0.12,
        headY: 0,
        armLX: -2.8,
        armRX: -2.8,
        armLZ: 0.55,
        armRZ: -0.55,
        elbowLX: -0.1,
        elbowRX: -0.1,
        legLX: -0.12,
        legRX: 0.12,
        kneeLX: 0.2,
        kneeRX: 0.2,
        modelY: hop * 0.16,
        modelX: 0,
        modelZ: Math.sin(time * 2.4) * 0.04,
        scarfX: 0.6 + Math.sin(time * 4) * 0.1,
        scarfY: Math.sin(time * 3) * 0.2,
        bandLX: 0.6,
        bandRX: 0.5,
      };
    } else if (state === 'run') {
      const swing = Math.sin(phase);
      const swing2 = Math.sin(phase * 2);
      targets = {
        torsoX: 0.15,
        headX: -0.07,
        headY: 0,
        armLX: swing * 1.0,
        armRX: -swing * 1.0,
        armLZ: 0.12,
        armRZ: -0.12,
        elbowLX: -0.28 - Math.max(0, -swing) * 0.55,
        elbowRX: -0.28 - Math.max(0, swing) * 0.55,
        legLX: -swing * 0.95,
        legRX: swing * 0.95,
        kneeLX: 0.18 + Math.max(0, swing) * 0.9,
        kneeRX: 0.18 + Math.max(0, -swing) * 0.9,
        modelY: Math.abs(swing2) * 0.035,
        modelX: 0,
        modelZ: 0,
        scarfX: 0.35 + Math.sin(phase * 0.8) * 0.18,
        scarfY: Math.sin(phase * 0.6) * 0.16,
        bandLX: 0.35 + Math.sin(phase * 0.9) * 0.2,
        bandRX: 0.28 + Math.sin(phase * 1.1 + 1) * 0.18,
      };
    } else {
      const idle = Math.sin(time * 1.6);
      targets = {
        torsoX: 0.035 + idle * 0.012,
        headX: -0.02,
        headY: Math.sin(time * 0.8) * 0.06,
        armLX: idle * 0.08,
        armRX: -idle * 0.08,
        armLZ: 0.08,
        armRZ: -0.08,
        elbowLX: -0.18,
        elbowRX: -0.18,
        legLX: 0,
        legRX: 0,
        kneeLX: 0.08,
        kneeRX: 0.08,
        modelY: idle * 0.008,
        modelX: 0,
        modelZ: 0,
        scarfX: 0.22 + idle * 0.08,
        scarfY: Math.sin(time * 0.7) * 0.1,
        bandLX: 0.22 + idle * 0.1,
        bandRX: 0.3 + Math.sin(time * 0.9 + 1) * 0.08,
      };
    }

    for (const key of Object.keys(current)) {
      if (targets[key] === undefined) continue;
      current[key] += (targets[key] - current[key]) * blend;
    }

    torso.rotation.x = current.torsoX;
    torso.rotation.z = current.torsoY;
    head.rotation.x = current.headX;
    head.rotation.y = current.headY;
    armL.pivot.rotation.x = current.armLX;
    armR.pivot.rotation.x = current.armRX;
    armL.pivot.rotation.z = current.armLZ;
    armR.pivot.rotation.z = current.armRZ;
    armL.elbow.rotation.x = current.elbowLX;
    armR.elbow.rotation.x = current.elbowRX;
    legL.pivot.rotation.x = current.legLX;
    legR.pivot.rotation.x = current.legRX;
    legL.knee.rotation.x = current.kneeLX;
    legR.knee.rotation.x = current.kneeRX;
    model.position.y = current.modelY;
    model.rotation.x = current.modelX;
    model.rotation.z = current.modelZ;

    scarfTail.rotation.x = current.scarfX;
    scarfTail.rotation.y = current.scarfY;
    headbandTailL.rotation.x = current.bandLX;
    headbandTailR.rotation.x = current.bandRX;
    headbandKnot.rotation.z = Math.sin(time * 2.2) * 0.08;

    if (flashTimer > 0) {
      flashTimer -= dt;
      if (flashTimer <= 0) {
        for (const material of Object.values(materials)) {
          if (material.emissive) {
            material.emissive.setHex(0x000000);
            material.emissiveIntensity = 0;
          }
        }
      }
    }
  }

  function dispose() {
    for (const material of Object.values(materials)) material.dispose();
    root.traverse((child) => {
      if (child.isMesh) child.geometry.dispose();
    });
    shadow.geometry.dispose();
    shadowMaterial.dispose();
  }

  return {
    root,
    model,
    shadow,
    materials,
    bones,
    update,
    setFlash,
    dispose,
  };
}
