import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const _position = new THREE.Vector3();
const _quaternion = new THREE.Quaternion();
const _scale = new THREE.Vector3();
const _euler = new THREE.Euler();
const _matrix = new THREE.Matrix4();

const KEEP_ATTRIBUTES = new Set(['position', 'normal', 'uv']);

export class GeometryMerger {
  constructor() {
    this.groups = new Map();
  }

  add(geometry, material, transform = {}) {
    const {
      position = [0, 0, 0],
      rotation = [0, 0, 0],
      scale = [1, 1, 1],
    } = transform;

    const geo = geometry.clone();
    _position.set(position[0], position[1], position[2]);
    _euler.set(rotation[0], rotation[1], rotation[2]);
    _quaternion.setFromEuler(_euler);
    _scale.set(scale[0], scale[1], scale[2]);
    _matrix.compose(_position, _quaternion, _scale);
    geo.applyMatrix4(_matrix);

    for (const attribute of Object.keys(geo.attributes)) {
      if (!KEEP_ATTRIBUTES.has(attribute)) geo.deleteAttribute(attribute);
    }

    if (!geo.attributes.uv) {
      const count = geo.attributes.position.count;
      geo.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(count * 2), 2));
    }

    if (!geo.attributes.normal) {
      geo.computeVertexNormals();
    }

    const key = material.uuid;
    let group = this.groups.get(key);
    if (!group) {
      group = { material, geometries: [] };
      this.groups.set(key, group);
    }
    group.geometries.push(geo);
  }

  build(parent, options = {}) {
    const { castShadow = false, receiveShadow = true } = options;
    const meshes = [];

    for (const { material, geometries } of this.groups.values()) {
      if (geometries.length === 0) continue;
      const merged = mergeGeometries(geometries, false);
      for (const geometry of geometries) geometry.dispose();
      if (!merged) continue;
      merged.computeBoundingSphere();
      const mesh = new THREE.Mesh(merged, material);
      mesh.castShadow = castShadow;
      mesh.receiveShadow = receiveShadow;
      parent.add(mesh);
      meshes.push(mesh);
    }

    this.groups.clear();
    return meshes;
  }
}

export function makeBox(width, height, depth) {
  return new THREE.BoxGeometry(width, height, depth);
}

export function makeCylinder(radiusTop, radiusBottom, height, segments = 10) {
  return new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments);
}

export function makeSphere(radius, widthSegments = 10, heightSegments = 8) {
  return new THREE.SphereGeometry(radius, widthSegments, heightSegments);
}

export function makeCone(radius, height, segments = 8) {
  return new THREE.ConeGeometry(radius, height, segments);
}
