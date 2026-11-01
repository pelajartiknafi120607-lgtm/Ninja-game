import * as THREE from 'three';
import { getGradientMap } from '../utils/TextureFactory.js';

export class ThemeAssets {
  constructor(level) {
    this.level = level;
    this.colors = level.colors;
    this.gradientMap = getGradientMap();
    this.materials = new Map();
    this.textures = [];
  }

  toon(key, color, options = {}) {
    return this.#get(key, () => {
      const material = new THREE.MeshToonMaterial({
        color,
        gradientMap: this.gradientMap,
        ...options,
      });
      material.userData.shared = true;
      return material;
    });
  }

  glow(key, color, options = {}) {
    return this.#get(key, () => {
      const material = new THREE.MeshBasicMaterial({
        color,
        toneMapped: false,
        ...options,
      });
      material.userData.shared = true;
      return material;
    });
  }

  standard(key, color, options = {}) {
    return this.#get(key, () => {
      const material = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.45,
        metalness: 0.05,
        flatShading: true,
        ...options,
      });
      material.userData.shared = true;
      return material;
    });
  }

  #get(key, factory) {
    if (this.materials.has(key)) return this.materials.get(key);
    const material = factory();
    this.materials.set(key, material);
    return material;
  }

  get stone() {
    return this.toon('stone', this.colors.stone);
  }

  get stoneLight() {
    return this.toon('stoneLight', this.colors.stoneLight);
  }

  get stoneDark() {
    return this.toon('stoneDark', this.colors.stoneDark);
  }

  get grass() {
    return this.toon('grass', this.colors.grass);
  }

  get grassDark() {
    return this.toon('grassDark', this.colors.grassDark);
  }

  get dirt() {
    return this.toon('dirt', this.colors.dirt);
  }

  get wood() {
    return this.toon('wood', this.colors.wood);
  }

  get woodDark() {
    return this.toon('woodDark', this.colors.woodDark);
  }

  get woodLight() {
    return this.toon('woodLight', this.colors.woodLight);
  }

  get red() {
    return this.toon('red', this.colors.red);
  }

  get redDark() {
    return this.toon('redDark', this.colors.redDark);
  }

  get gold() {
    return this.toon('gold', this.colors.gold);
  }

  get goldLight() {
    return this.toon('goldLight', this.colors.goldLight);
  }

  get bamboo() {
    return this.toon('bamboo', this.colors.bamboo);
  }

  get bambooDark() {
    return this.toon('bambooDark', this.colors.bambooDark);
  }

  get leaf() {
    return this.toon('leaf', this.colors.leaf);
  }

  get leafLight() {
    return this.toon('leafLight', this.colors.leafLight);
  }

  get rock() {
    return this.toon('rock', this.colors.rock);
  }

  get rockDark() {
    return this.toon('rockDark', this.colors.rockDark);
  }

  get sakura() {
    return this.toon('sakura', this.colors.sakura);
  }

  get sakuraLight() {
    return this.toon('sakuraLight', this.colors.sakuraLight);
  }

  get roof() {
    return this.toon('roof', this.colors.roof);
  }

  get roofDark() {
    return this.toon('roofDark', this.colors.roofDark);
  }

  get cityWall() {
    return this.toon('cityWall', this.colors.cityWall);
  }

  get cityWallDark() {
    return this.toon('cityWallDark', this.colors.cityWallDark);
  }

  get templeWall() {
    return this.toon('templeWall', this.colors.templeWall);
  }

  get templeWallDark() {
    return this.toon('templeWallDark', this.colors.templeWallDark);
  }

  get white() {
    return this.toon('white', 0xfff8e7);
  }

  get black() {
    return this.toon('black', 0x17151f);
  }

  get metal() {
    return this.toon('metal', 0x6b6b7a);
  }

  get water() {
    return this.toon('water', this.colors.water);
  }

  get windowWarm() {
    return this.glow('windowWarm', this.colors.window);
  }

  get windowCool() {
    return this.glow('windowCool', this.colors.windowCool);
  }

  get neonPink() {
    return this.glow('neonPink', this.colors.neonPink);
  }

  get neonCyan() {
    return this.glow('neonCyan', this.colors.neonCyan);
  }

  get neonPurple() {
    return this.glow('neonPurple', this.colors.neonPurple);
  }

  get lanternGlow() {
    return this.glow('lanternGlow', this.colors.glowWarm);
  }

  get focusGlow() {
    return this.glow('focusGlow', this.colors.glowCool);
  }

  get moon() {
    return this.glow('moon', this.colors.moon);
  }

  get ember() {
    return this.glow('ember', 0xff7a3d);
  }

  dispose() {
    for (const material of this.materials.values()) {
      material.dispose();
    }
    this.materials.clear();
    for (const texture of this.textures) texture.dispose();
    this.textures.length = 0;
  }
}
