import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { getGlowTexture, getSignTexture } from './utils/TextureFactory.js';

const KEEP_ATTRIBUTES = new Set(['position', 'normal', 'uv']);
const _position = new THREE.Vector3();
const _quaternion = new THREE.Quaternion();
const _scale = new THREE.Vector3();
const _euler = new THREE.Euler();
const _matrix = new THREE.Matrix4();

function seededRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function box(width, height, depth) {
  return new THREE.BoxGeometry(width, height, depth);
}

function cylinder(radiusTop, radiusBottom, height, segments = 8) {
  return new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments);
}

function cone(radius, height, segments = 8) {
  return new THREE.ConeGeometry(radius, height, segments);
}

function sphere(radius, widthSegments = 10, heightSegments = 8) {
  return new THREE.SphereGeometry(radius, widthSegments, heightSegments);
}

function torus(radius, tube, radialSegments = 6, tubularSegments = 16) {
  return new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments);
}

function part(geometry, position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1]) {
  return { geometry, position, rotation, scale };
}

function mergeParts(parts) {
  const geometries = [];
  for (const item of parts) {
    const geometry = item.geometry.clone();
    _position.set(item.position[0], item.position[1], item.position[2]);
    _euler.set(item.rotation[0], item.rotation[1], item.rotation[2]);
    _quaternion.setFromEuler(_euler);
    _scale.set(item.scale[0], item.scale[1], item.scale[2]);
    _matrix.compose(_position, _quaternion, _scale);
    geometry.applyMatrix4(_matrix);
    for (const attribute of Object.keys(geometry.attributes)) {
      if (!KEEP_ATTRIBUTES.has(attribute)) geometry.deleteAttribute(attribute);
    }
    if (!geometry.attributes.uv) {
      const count = geometry.attributes.position.count;
      geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(count * 2), 2));
    }
    if (!geometry.attributes.normal) geometry.computeVertexNormals();
    geometries.push(geometry);
    item.geometry.dispose();
  }
  const merged = mergeGeometries(geometries, false);
  for (const geometry of geometries) geometry.dispose();
  if (merged) merged.computeBoundingSphere();
  return merged;
}

function addInstanced(parent, geometry, material, transforms, { castShadow = false, receiveShadow = true } = {}) {
  if (!geometry || transforms.length === 0) return null;
  const mesh = new THREE.InstancedMesh(geometry, material, transforms.length);
  transforms.forEach((transform, index) => {
    _position.set(transform.position[0], transform.position[1], transform.position[2]);
    _euler.set(transform.rotation[0], transform.rotation[1], transform.rotation[2]);
    _quaternion.setFromEuler(_euler);
    _scale.set(transform.scale[0], transform.scale[1], transform.scale[2]);
    _matrix.compose(_position, _quaternion, _scale);
    mesh.setMatrixAt(index, _matrix);
  });
  mesh.instanceMatrix.needsUpdate = true;
  mesh.castShadow = castShadow;
  mesh.receiveShadow = receiveShadow;
  mesh.computeBoundingSphere();
  parent.add(mesh);
  return mesh;
}

function makeTorusGeometry() {
  const gateParts = [];
  const gateHeight = 5.1;
  for (const side of [-1, 1]) {
    gateParts.push(part(cylinder(0.26, 0.3, gateHeight, 8), [side * 4.15, gateHeight / 2, 0]));
    gateParts.push(part(cylinder(0.4, 0.46, 0.35, 8), [side * 4.15, 0.16, 0]));
  }
  gateParts.push(part(box(11.2, 0.4, 0.6), [0, gateHeight + 0.2, 0], [0, 0, 0]));
  gateParts.push(part(box(9.6, 0.3, 0.5), [0, gateHeight - 0.35, 0]));
  gateParts.push(part(box(1.5, 0.85, 0.28), [0, gateHeight - 0.2, -0.18]));
  gateParts.push(part(box(1.2, 0.62, 0.12), [0, gateHeight - 0.2, -0.36]));
  return mergeParts(gateParts);
}

function makeGateAccentGeometry() {
  return mergeParts([
    part(box(1.0, 0.46, 0.14), [0, 5.0, -0.43]),
    part(box(0.62, 0.2, 0.1), [0, 5.0, -0.52]),
  ]);
}

function makeLanternStoneGeometry() {
  return mergeParts([
    part(cylinder(0.34, 0.42, 0.2, 6), [0, 0.1, 0]),
    part(cylinder(0.09, 0.12, 1.15, 6), [0, 0.68, 0]),
    part(box(0.5, 0.14, 0.5), [0, 1.28, 0]),
    part(box(0.4, 0.34, 0.4), [0, 1.5, 0]),
    part(cone(0.52, 0.34, 4), [0, 1.84, 0], [0, Math.PI / 4, 0]),
    part(sphere(0.08, 6, 5), [0, 2.03, 0]),
  ]);
}

function makeLanternGlowGeometry() {
  return box(0.3, 0.24, 0.3);
}

export class PropFactory {
  constructor(level, assets) {
    this.level = level;
    this.assets = assets;
    this.length = level.length;
    this.group = new THREE.Group();
    this.group.name = 'EnvironmentProps';
    this.random = seededRandom(level.id.charCodeAt(0) * 733 + level.index * 977);
  }

  build() {
    if (this.level.id === 'city') this.buildCity();
    else if (this.level.id === 'temple') this.buildTemple();
    else this.buildBamboo();

    this.addFinishGate();
    return this.group;
  }

  buildBamboo() {
    const rand = this.random;
    const assets = this.assets;

    // Bamboo stalks with leaf crowns.
    const stalkParts = [];
    for (let i = 0; i < 4; i += 1) {
      stalkParts.push(
        part(cylinder(0.1, 0.125, 1.25, 6), [(rand() - 0.5) * 0.08, 0.62 + i * 1.18, (rand() - 0.5) * 0.08]),
      );
      stalkParts.push(part(torus(0.125, 0.016, 4, 8), [0, 1.2 + i * 1.18, 0], [Math.PI / 2, 0, 0]));
    }
    stalkParts.push(part(cylinder(0.06, 0.08, 1.25, 5), [0.32, 3.4, 0.1], [0, 0, -0.75]));
    stalkParts.push(part(cylinder(0.05, 0.07, 0.95, 5), [-0.28, 2.9, -0.08], [0, 0, 0.7]));
    const stalkGeometry = mergeParts(stalkParts);

    const leafParts = [];
    for (let i = 0; i < 8; i += 1) {
      const angle = (i / 8) * Math.PI * 2 + rand() * 0.5;
      leafParts.push(
        part(
          cone(0.17, 0.95, 4),
          [Math.cos(angle) * (0.2 + rand() * 0.5), 3.85 + rand() * 1.1, Math.sin(angle) * (0.2 + rand() * 0.5)],
          [0, -angle, 0.95 + rand() * 0.5],
          [1, 1, 0.4],
        ),
      );
    }
    const leafGeometry = mergeParts(leafParts);

    const stalkTransforms = [];
    for (const side of [-1, 1]) {
      for (let i = 0; i < 108; i += 1) {
        const scale = 0.68 + rand() * 0.85;
        stalkTransforms.push({
          position: [side * (5.6 + rand() * 20), 0, 18 - rand() * (this.length + 60)],
          rotation: [0, rand() * Math.PI * 2, (rand() - 0.5) * 0.06],
          scale: [scale, scale * (0.9 + rand() * 0.35), scale],
        });
      }
    }
    addInstanced(this.group, stalkGeometry, assets.bamboo, stalkTransforms);
    addInstanced(this.group, leafGeometry, assets.leaf, stalkTransforms);

    // Rocks.
    const rockGeometry = new THREE.DodecahedronGeometry(0.62, 0);
    const rockTransforms = [];
    for (const side of [-1, 1]) {
      for (let i = 0; i < 26; i += 1) {
        rockTransforms.push({
          position: [side * (5.2 + rand() * 13), 0.16, 16 - rand() * (this.length + 40)],
          rotation: [rand() * 2, rand() * Math.PI * 2, rand() * 2],
          scale: [0.5 + rand() * 0.9, 0.4 + rand() * 0.7, 0.5 + rand() * 0.9],
        });
      }
    }
    addInstanced(this.group, rockGeometry, assets.rock, rockTransforms);

    // Stone lanterns.
    const lanternTransforms = [];
    for (const side of [-1, 1]) {
      for (let i = 0; i < 11; i += 1) {
        lanternTransforms.push({
          position: [side * (5.25 + rand() * 0.5), 0, -12 - i * 68 - rand() * 8],
          rotation: [0, rand() * Math.PI * 2, 0],
          scale: [1, 1, 1],
        });
      }
    }
    addInstanced(this.group, makeLanternStoneGeometry(), assets.stoneDark, lanternTransforms);
    addInstanced(this.group, makeLanternGlowGeometry(), assets.lanternGlow, lanternTransforms);

    // Torii gates.
    const gateGeometry = makeTorusGeometry();
    const accentGeometry = makeGateAccentGeometry();
    const gateTransforms = [];
    for (let z = -28; z > -this.length - 30; z -= 172) {
      gateTransforms.push({ position: [0, 0, z], rotation: [0, 0, 0], scale: [1, 1, 1] });
    }
    addInstanced(this.group, gateGeometry, assets.red, gateTransforms, { castShadow: false });
    addInstanced(this.group, accentGeometry, assets.gold, gateTransforms, { castShadow: false });

    this.addMountains(assets.grassDark, 12);
    this.addClouds();
  }

  buildCity() {
    const rand = this.random;
    const assets = this.assets;

    // Buildings in three variants, each with a matching window strip mesh.
    const variants = [];
    for (let i = 0; i < 4; i += 1) {
      const width = 4.8 + rand() * 3.6;
      const depth = 5.5 + rand() * 4;
      const height = 8 + rand() * 17;
      const bodyParts = [
        part(box(width, height, depth), [0, height / 2, 0]),
        part(box(width * 1.06, 0.42, depth * 1.06), [0, height + 0.2, 0]),
      ];
      if (rand() > 0.45) {
        bodyParts.push(part(cylinder(0.07, 0.09, 2.5 + rand() * 4, 5), [width * 0.22, height + 2, 0]));
        bodyParts.push(part(box(0.08, 0.08, 1.6), [width * 0.22, height + 3.2, 0]));
      }
      bodyParts.push(part(box(width * 0.7, 0.9, 0.18), [-width / 2 - 0.06, 2.1, depth * 0.18]));
      bodyParts.push(part(box(width * 0.55, 0.7, 0.16), [-width / 2 - 0.06, 4.2, -depth * 0.2]));

      const windowParts = [];
      const columns = 2 + Math.floor(rand() * 2);
      const floors = Math.max(2, Math.floor(height / 3));
      for (let floor = 1; floor < floors; floor += 1) {
        for (let column = 0; column < columns; column += 1) {
          if (rand() > 0.82) continue;
          windowParts.push(
            part(
              box(0.82, 0.5, 0.08),
              [
                -width / 2 - 0.02,
                floor * 3 + 0.7,
                -depth / 2 + 0.9 + (column * (depth - 1.8)) / Math.max(1, columns - 1),
              ],
            ),
          );
        }
      }
      variants.push({
        body: mergeParts(bodyParts),
        windows: mergeParts(windowParts),
        height,
      });
    }

    const windowMaterials = [assets.windowCool, assets.windowWarm, assets.neonPink, assets.windowCool];
    const buildingTransforms = variants.map(() => []);

    for (const side of [-1, 1]) {
      let z = 20;
      while (z > -this.length - 50) {
        const variantIndex = Math.floor(rand() * variants.length);
        const yScale = 0.75 + rand() * 0.65;
        buildingTransforms[variantIndex].push({
          position: [side * (10.5 + rand() * 23), 0, z],
          rotation: [0, side > 0 ? 0 : Math.PI, 0],
          scale: [1, yScale, 1],
        });
        z -= 10 + rand() * 14;
      }
    }

    variants.forEach((variant, index) => {
      addInstanced(this.group, variant.body, assets.cityWall, buildingTransforms[index], {
        receiveShadow: true,
      });
      addInstanced(this.group, variant.windows, windowMaterials[index], buildingTransforms[index], {
        receiveShadow: false,
      });
    });

    // Neon signs facing the track.
    const signKinds = ['focus', 'study', 'ninja', 'ramen', 'dream', 'future', 'cat'];
    const signColors = ['#ff4d9d', '#00e5ff', '#9d6bff', '#ffd76a', '#7fe8ff'];
    const signGeometry = new THREE.PlaneGeometry(4.2, 2.1);
    for (let i = 0; i < 14; i += 1) {
      const side = i % 2 === 0 ? -1 : 1;
      const kind = signKinds[Math.floor(rand() * signKinds.length)];
      const color = signColors[Math.floor(rand() * signColors.length)];
      const material = new THREE.MeshBasicMaterial({
        map: getSignTexture(kind, color, '#120c24'),
        transparent: false,
        toneMapped: false,
        side: THREE.DoubleSide,
      });
      material.userData.local = true;
      const sign = new THREE.Mesh(signGeometry, material);
      sign.position.set(side * 7.6, 4.2 + rand() * 6.5, 5 - rand() * (this.length + 30));
      sign.rotation.y = side > 0 ? -Math.PI / 2 : Math.PI / 2;
      this.group.add(sign);
    }

    // Street lamps.
    const lampPostParts = [
      part(cylinder(0.09, 0.13, 4.8, 6), [0, 2.4, 0]),
      part(cylinder(0.26, 0.34, 0.22, 6), [0, 0.1, 0]),
      part(box(0.5, 0.12, 0.5), [0, 4.85, 0]),
    ];
    const lampGeometry = mergeParts(lampPostParts);
    const lampGlowGeometry = sphere(0.2, 8, 6);
    const lampTransforms = [];
    for (const side of [-1, 1]) {
      for (let i = 0; i < 30; i += 1) {
        lampTransforms.push({
          position: [side * 5.15, 0, 10 - i * 35 - rand() * 4],
          rotation: [0, 0, 0],
          scale: [1, 1, 1],
        });
      }
    }
    addInstanced(this.group, lampGeometry, assets.metal, lampTransforms);
    addInstanced(this.group, lampGlowGeometry, assets.neonCyan, lampTransforms);

    // Lane markers and curbs.
    const dashGeometry = box(0.07, 0.03, 2.6);
    const dashTransforms = [];
    for (let z = 16; z > -this.length - 30; z -= 6) {
      dashTransforms.push({ position: [-1.2, 0.03, z], rotation: [0, 0, 0], scale: [1, 1, 1] });
      dashTransforms.push({ position: [1.2, 0.03, z], rotation: [0, 0, 0], scale: [1, 1, 1] });
    }
    addInstanced(this.group, dashGeometry, assets.neonCyan, dashTransforms, { receiveShadow: false });

    const curbGeometry = box(0.12, 0.08, this.length + 60);
    for (const side of [-1, 1]) {
      const curb = new THREE.Mesh(curbGeometry.clone(), assets.neonPink);
      curb.position.set(side * 4.35, 0.04, 10 - (this.length + 60) / 2);
      curb.receiveShadow = false;
      this.group.add(curb);
    }
    curbGeometry.dispose();

    // Neon arches over the road.
    const archParts = [
      part(box(0.36, 6.2, 0.36), [-5.05, 3.1, 0]),
      part(box(0.36, 6.2, 0.36), [5.05, 3.1, 0]),
      part(box(10.6, 0.36, 0.36), [0, 6.15, 0]),
    ];
    const archAccentParts = [
      part(box(0.16, 5.4, 0.16), [-4.82, 2.9, 0]),
      part(box(0.16, 5.4, 0.16), [4.82, 2.9, 0]),
      part(box(9.8, 0.16, 0.16), [0, 5.75, 0]),
    ];
    const archGeometry = mergeParts(archParts);
    const archAccentGeometry = mergeParts(archAccentParts);
    const archTransforms = [];
    for (let z = -80; z > -this.length - 20; z -= 175) {
      archTransforms.push({ position: [0, 0, z], rotation: [0, 0, 0], scale: [1, 1, 1] });
    }
    addInstanced(this.group, archGeometry, assets.neonPink, archTransforms, { receiveShadow: false });
    addInstanced(this.group, archAccentGeometry, assets.neonCyan, archTransforms, { receiveShadow: false });

    // Distant skyline.
    const skylineGeometry = box(1, 1, 1);
    const skylineTransforms = [];
    for (const side of [-1, 1]) {
      for (let i = 0; i < 26; i += 1) {
        const height = 18 + rand() * 38;
        skylineTransforms.push({
          position: [side * (46 + rand() * 48), height / 2 - 1, 20 - i * 46 - rand() * 20],
          rotation: [0, rand() * Math.PI, 0],
          scale: [8 + rand() * 10, height, 8 + rand() * 8],
        });
      }
    }
    addInstanced(this.group, skylineGeometry, assets.cityWallDark, skylineTransforms, { receiveShadow: false });
    this.addClouds(0.16);
  }

  buildTemple() {
    const rand = this.random;
    const assets = this.assets;

    // Cherry trees.
    const trunkParts = [
      part(cylinder(0.16, 0.28, 2.3, 6), [0, 1.15, 0]),
      part(cylinder(0.07, 0.12, 1.3, 5), [0.35, 2.4, 0], [0, 0, -0.72]),
      part(cylinder(0.06, 0.1, 1.1, 5), [-0.32, 2.2, 0.1], [0.2, 0, 0.78]),
    ];
    const trunkGeometry = mergeParts(trunkParts);
    const foliageParts = [];
    for (let i = 0; i < 6; i += 1) {
      const angle = (i / 6) * Math.PI * 2;
      foliageParts.push(
        part(
          sphere(0.9 + rand() * 0.5, 8, 6),
          [Math.cos(angle) * (0.5 + rand() * 0.8), 3.0 + rand() * 0.9, Math.sin(angle) * (0.5 + rand() * 0.8)],
          [0, 0, 0],
          [1.15, 0.8, 1.15],
        ),
      );
    }
    foliageParts.push(part(sphere(1.15, 8, 6), [0, 3.6, 0], [0, 0, 0], [1.2, 0.85, 1.2]));
    const foliageGeometry = mergeParts(foliageParts);

    const treeTransforms = [];
    for (const side of [-1, 1]) {
      for (let i = 0; i < 44; i += 1) {
        const scale = 0.7 + rand() * 0.85;
        treeTransforms.push({
          position: [side * (6.2 + rand() * 16), 0, 16 - rand() * (this.length + 45)],
          rotation: [0, rand() * Math.PI * 2, 0],
          scale: [scale, scale * (0.85 + rand() * 0.3), scale],
        });
      }
    }
    addInstanced(this.group, trunkGeometry, assets.woodDark, treeTransforms);
    addInstanced(this.group, foliageGeometry, assets.sakura, treeTransforms);

    // Stone lanterns.
    const lanternTransforms = [];
    for (const side of [-1, 1]) {
      for (let i = 0; i < 13; i += 1) {
        lanternTransforms.push({
          position: [side * (5.3 + rand() * 0.4), 0, -10 - i * 62 - rand() * 9],
          rotation: [0, rand() * Math.PI * 2, 0],
          scale: [1, 1, 1],
        });
      }
    }
    addInstanced(this.group, makeLanternStoneGeometry(), assets.stoneDark, lanternTransforms);
    addInstanced(this.group, makeLanternGlowGeometry(), assets.lanternGlow, lanternTransforms);

    // Torii gates.
    const gateGeometry = makeTorusGeometry();
    const accentGeometry = makeGateAccentGeometry();
    const gateTransforms = [];
    for (let z = -34; z > -this.length - 30; z -= 166) {
      gateTransforms.push({ position: [0, 0, z], rotation: [0, 0, 0], scale: [1, 1, 1] });
    }
    addInstanced(this.group, gateGeometry, assets.red, gateTransforms);
    addInstanced(this.group, accentGeometry, assets.gold, gateTransforms);

    // Rocks.
    const rockGeometry = new THREE.DodecahedronGeometry(0.55, 0);
    const rockTransforms = [];
    for (const side of [-1, 1]) {
      for (let i = 0; i < 20; i += 1) {
        rockTransforms.push({
          position: [side * (5.1 + rand() * 12), 0.14, 14 - rand() * (this.length + 30)],
          rotation: [rand() * 2, rand() * Math.PI * 2, rand() * 2],
          scale: [0.5 + rand() * 0.8, 0.4 + rand() * 0.6, 0.5 + rand() * 0.8],
        });
      }
    }
    addInstanced(this.group, rockGeometry, assets.rock, rockTransforms);

    // Pagodas.
    const pagoda = this.makePagodaGeometry();
    const pagodaPositions = [
      [-24, -150, 1.05],
      [26, -470, 0.9],
      [-30, -790, 1.15],
      [0, -this.length - 42, 1.3],
    ];
    for (const [x, z, scale] of pagodaPositions) {
      for (const [geometry, material] of pagoda) {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, 0, z);
        mesh.scale.setScalar(scale);
        mesh.castShadow = false;
        mesh.receiveShadow = true;
        this.group.add(mesh);
      }
    }

    // Side halls.
    this.addTempleHall(-16, -280, 1);
    this.addTempleHall(17, -650, -1);
    this.addTempleHall(-18, -980, 1);

    this.addMountains(assets.rockDark, 14);
    this.addClouds(0.3);
  }

  makePagodaGeometry() {
    const assets = this.assets;
    const wallParts = [];
    const roofParts = [];
    const trimParts = [];

    wallParts.push(part(box(3.6, 0.7, 3.6), [0, 0.35, 0]));
    for (let tier = 0; tier < 5; tier += 1) {
      const width = 3.1 - tier * 0.42;
      const y = 0.7 + tier * 1.15;
      wallParts.push(part(box(width, 1.0, width), [0, y + 0.5, 0]));
      trimParts.push(part(box(width + 0.12, 0.16, width + 0.12), [0, y + 0.02, 0]));
      roofParts.push(part(cone(width * 0.94, 0.72, 4), [0, y + 1.35, 0], [0, Math.PI / 4, 0]));
      roofParts.push(part(box(width + 1.15, 0.14, width + 1.15), [0, y + 1.03, 0]));
    }
    wallParts.push(part(cylinder(0.07, 0.1, 1.3, 5), [0, 6.8, 0]));
    trimParts.push(part(sphere(0.2, 6, 5), [0, 7.5, 0]));

    return [
      [mergeParts(wallParts), assets.templeWall],
      [mergeParts(roofParts), assets.roof],
      [mergeParts(trimParts), assets.gold],
    ];
  }

  addTempleHall(x, z, facing) {
    const assets = this.assets;
    const wallParts = [
      part(box(7.2, 0.6, 4.6), [0, 0.3, 0]),
      part(box(6.2, 2.6, 3.6), [0, 1.9, 0]),
      part(box(6.8, 0.22, 4.0), [0, 3.3, 0]),
    ];
    const roofParts = [
      part(cone(4.9, 1.5, 4), [0, 4.0, 0], [0, Math.PI / 4, 0]),
      part(box(7.6, 0.16, 4.8), [0, 3.38, 0]),
    ];
    const trimParts = [part(box(6.4, 0.12, 3.8), [0, 3.0, 0])];
    const wallMesh = new THREE.Mesh(mergeParts(wallParts), assets.templeWall);
    const roofMesh = new THREE.Mesh(mergeParts(roofParts), assets.roof);
    const trimMesh = new THREE.Mesh(mergeParts(trimParts), assets.gold);
    for (const mesh of [wallMesh, roofMesh, trimMesh]) {
      mesh.position.set(x, 0, z);
      mesh.rotation.y = facing > 0 ? 0 : Math.PI;
      mesh.receiveShadow = true;
      this.group.add(mesh);
    }
  }

  addMountains(material, count) {
    const rand = this.random;
    const geometry = cone(1, 1, 5);
    for (let i = 0; i < count; i += 1) {
      const side = i % 2 === 0 ? -1 : 1;
      const height = 20 + rand() * 34;
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(side * (58 + rand() * 62), height / 2 - 3, 30 - (i / count) * (this.length + 120) - rand() * 30);
      mesh.scale.set(18 + rand() * 26, height, 18 + rand() * 26);
      mesh.rotation.y = rand() * Math.PI;
      mesh.receiveShadow = false;
      this.group.add(mesh);
    }
  }

  addClouds(opacity = 0.42) {
    const texture = getGlowTexture();
    const rand = this.random;
    for (let i = 0; i < 7; i += 1) {
      const material = new THREE.SpriteMaterial({
        map: texture,
        color: this.level.id === 'city' ? 0x9d6bff : 0xfff8e7,
        transparent: true,
        opacity,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
        fog: false,
      });
      material.userData.local = true;
      const sprite = new THREE.Sprite(material);
      sprite.position.set((rand() - 0.5) * 130, 28 + rand() * 22, -40 - rand() * (this.length + 80));
      sprite.scale.set(28 + rand() * 22, 8 + rand() * 6, 1);
      this.group.add(sprite);
    }
  }

  addFinishGate() {
    const assets = this.assets;
    const gate = new THREE.Mesh(makeTorusGeometry(), assets.red);
    gate.position.set(0, 0, -this.length);
    gate.scale.set(1.15, 1.15, 1.15);
    this.group.add(gate);

    const ringMaterial = this.level.id === 'city' ? assets.neonCyan : assets.gold;
    const ring = new THREE.Mesh(new THREE.TorusGeometry(3.15, 0.16, 8, 40), ringMaterial);
    ring.position.set(0, 3.5, -this.length);
    ring.scale.set(1.2, 1.2, 1.2);
    this.group.add(ring);

    const glowMaterial = new THREE.SpriteMaterial({
      map: getGlowTexture(),
      color: this.level.id === 'city' ? 0x00e5ff : 0xffd76a,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    });
    glowMaterial.userData.local = true;
    const glow = new THREE.Sprite(glowMaterial);
    glow.position.set(0, 3.7, -this.length + 0.2);
    glow.scale.set(11, 11, 1);
    this.group.add(glow);
  }
}
