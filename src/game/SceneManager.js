import * as THREE from 'three';
import { getGlowTexture } from './utils/TextureFactory.js';

const SKY_VERTEX = /* glsl */ `
  varying vec3 vWorldPosition;
  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const SKY_FRAGMENT = /* glsl */ `
  uniform vec3 topColor;
  uniform vec3 horizonColor;
  uniform float offset;
  uniform float exponent;
  varying vec3 vWorldPosition;
  void main() {
    float h = normalize(vWorldPosition + vec3(0.0, offset, 0.0)).y;
    float mixAmount = pow(max(h, 0.0), exponent);
    gl_FragColor = vec4(mix(horizonColor, topColor, mixAmount), 1.0);
  }
`;

export class SceneManager {
  constructor(container) {
    this.container = container;
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.08;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 420);
    this.camera.position.set(0, 4.6, 8);

    this.skyMaterial = new THREE.ShaderMaterial({
      uniforms: {
        topColor: { value: new THREE.Color(0x3d9bff) },
        horizonColor: { value: new THREE.Color(0xdff6ff) },
        offset: { value: 20 },
        exponent: { value: 0.8 },
      },
      vertexShader: SKY_VERTEX,
      fragmentShader: SKY_FRAGMENT,
      side: THREE.BackSide,
      depthWrite: false,
    });
    this.sky = new THREE.Mesh(new THREE.SphereGeometry(320, 24, 16), this.skyMaterial);
    this.sky.frustumCulled = false;
    this.scene.add(this.sky);

    this.moonGroup = new THREE.Group();
    this.moonMaterial = new THREE.MeshBasicMaterial({
      color: 0xfff3d6,
      fog: false,
      toneMapped: false,
    });
    this.moon = new THREE.Mesh(new THREE.SphereGeometry(6.5, 24, 16), this.moonMaterial);
    this.moonGroup.add(this.moon);
    const moonGlowMaterial = new THREE.SpriteMaterial({
      map: getGlowTexture(),
      color: 0xfff3d6,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      fog: false,
      toneMapped: false,
    });
    this.moonGlow = new THREE.Sprite(moonGlowMaterial);
    this.moonGlow.scale.set(46, 46, 1);
    this.moonGroup.add(this.moonGlow);
    this.moonGroup.visible = false;
    this.scene.add(this.moonGroup);

    this.scene.fog = new THREE.Fog(0xbfe8ff, 45, 155);

    this.hemisphere = new THREE.HemisphereLight(0xbfe8ff, 0x5f8f3a, 1.15);
    this.scene.add(this.hemisphere);

    this.ambient = new THREE.AmbientLight(0xffffff, 0.38);
    this.scene.add(this.ambient);

    this.sun = new THREE.DirectionalLight(0xfff0c8, 2.2);
    this.sun.position.set(16, 28, 18);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(2048, 2048);
    this.sun.shadow.camera.left = -22;
    this.sun.shadow.camera.right = 22;
    this.sun.shadow.camera.top = 28;
    this.sun.shadow.camera.bottom = -12;
    this.sun.shadow.camera.near = 1;
    this.sun.shadow.camera.far = 90;
    this.sun.shadow.bias = -0.0004;
    this.sun.shadow.normalBias = 0.025;
    this.sun.target.position.set(0, 0, -8);
    this.scene.add(this.sun);
    this.scene.add(this.sun.target);

    this.fill = new THREE.DirectionalLight(0x7fd4ff, 0.42);
    this.fill.position.set(-14, 10, -12);
    this.fill.target.position.set(0, 0, -8);
    this.scene.add(this.fill);
    this.scene.add(this.fill.target);

    this.resize = this.resize.bind(this);
    window.addEventListener('resize', this.resize);
  }

  applyTheme(level) {
    const c = level.colors;
    this.skyMaterial.uniforms.topColor.value.setHex(c.skyTop);
    this.skyMaterial.uniforms.horizonColor.value.setHex(c.skyHorizon);
    this.scene.fog.color.setHex(c.fog);
    this.scene.fog.near = 42;
    this.scene.fog.far = 155;

    this.hemisphere.color.setHex(c.hemiSky);
    this.hemisphere.groundColor.setHex(c.hemiGround);
    this.hemisphere.intensity = level.id === 'city' ? 1.0 : 1.15;

    this.sun.color.setHex(c.sun);
    this.sun.intensity = c.sunIntensity;
    this.sun.position.set(level.id === 'city' ? -14 : 16, 28, level.id === 'temple' ? 12 : 18);

    this.ambient.intensity = c.ambient;
    this.fill.color.setHex(level.id === 'city' ? c.neonCyan : level.id === 'temple' ? c.sakura : c.glowCool);
    this.fill.intensity = level.id === 'city' ? 0.55 : 0.35;

    this.moonGroup.visible = level.id === 'temple';
    this.moonMaterial.color.setHex(c.moon);
    this.moonGlow.material.color.setHex(c.moon);
  }

  resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setSize(width, height);
  }

  render(playerZ = 0) {
    this.sky.position.copy(this.camera.position);
    this.moonGroup.position.set(this.camera.position.x + 54, 48, this.camera.position.z - 188);

    this.sun.position.z = playerZ + 18;
    this.sun.target.position.set(0, 0, playerZ - 8);
    this.fill.position.z = playerZ - 12;
    this.fill.target.position.set(0, 0, playerZ - 8);

    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    window.removeEventListener('resize', this.resize);
    this.renderer.dispose();
    this.renderer.domElement.remove();
    this.sky.geometry.dispose();
    this.skyMaterial.dispose();
    this.moon.geometry.dispose();
    this.moonMaterial.dispose();
    this.moonGlow.material.dispose();
  }
}
