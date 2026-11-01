import * as THREE from 'three';

let gradientMap = null;
let glowTexture = null;
let shadowTexture = null;
let petalTexture = null;
let sparkTexture = null;

const signTextures = new Map();

export function getGradientMap() {
  if (gradientMap) return gradientMap;
  const data = new Uint8Array([64, 148, 255]);
  gradientMap = new THREE.DataTexture(data, 3, 1, THREE.RedFormat);
  gradientMap.minFilter = THREE.NearestFilter;
  gradientMap.magFilter = THREE.NearestFilter;
  gradientMap.generateMipmaps = false;
  gradientMap.needsUpdate = true;
  return gradientMap;
}

function makeRadialTexture(size, stops) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  for (const [offset, color] of stops) gradient.addColorStop(offset, color);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

export function getGlowTexture() {
  if (!glowTexture) {
    glowTexture = makeRadialTexture(128, [
      [0, 'rgba(255,255,255,0.95)'],
      [0.25, 'rgba(255,255,255,0.55)'],
      [0.55, 'rgba(255,255,255,0.18)'],
      [1, 'rgba(255,255,255,0)'],
    ]);
  }
  return glowTexture;
}

export function getShadowTexture() {
  if (!shadowTexture) {
    shadowTexture = makeRadialTexture(128, [
      [0, 'rgba(0,0,0,0.55)'],
      [0.45, 'rgba(0,0,0,0.28)'],
      [1, 'rgba(0,0,0,0)'],
    ]);
  }
  return shadowTexture;
}

export function getPetalTexture() {
  if (!petalTexture) {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.translate(32, 32);
    ctx.rotate(-0.35);
    const gradient = ctx.createLinearGradient(-20, -20, 20, 20);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(1, 'rgba(255,255,255,0.45)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(0, 0, 15, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(8, -4, 8, 4, 0.5, 0, Math.PI * 2);
    ctx.fill();
    petalTexture = new THREE.CanvasTexture(canvas);
    petalTexture.colorSpace = THREE.SRGBColorSpace;
  }
  return petalTexture;
}

export function getSparkTexture() {
  if (!sparkTexture) {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.translate(32, 32);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(0, -28);
    ctx.quadraticCurveTo(4, -6, 26, 0);
    ctx.quadraticCurveTo(4, 6, 0, 28);
    ctx.quadraticCurveTo(-4, 6, -26, 0);
    ctx.quadraticCurveTo(-4, -6, 0, -28);
    ctx.fill();
    sparkTexture = new THREE.CanvasTexture(canvas);
    sparkTexture.colorSpace = THREE.SRGBColorSpace;
  }
  return sparkTexture;
}

function roundRect(ctx, x, y, w, h, radius) {
  const r = Math.min(radius, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawCat(ctx, color) {
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 6;
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(46, 48);
  ctx.lineTo(42, 26);
  ctx.lineTo(64, 38);
  ctx.quadraticCurveTo(96, 24, 128, 38);
  ctx.lineTo(150, 26);
  ctx.lineTo(146, 50);
  ctx.quadraticCurveTo(154, 78, 128, 94);
  ctx.quadraticCurveTo(96, 110, 64, 94);
  ctx.quadraticCurveTo(38, 78, 46, 48);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(78, 68, 6, 8, 0, 0, Math.PI * 2);
  ctx.ellipse(118, 68, 6, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(92, 82);
  ctx.lineTo(104, 82);
  ctx.lineTo(98, 90);
  ctx.closePath();
  ctx.fill();
}

export function getSignTexture(kind = 'focus', color = '#ff4d9d', background = '#1b123d') {
  const key = `${kind}|${color}|${background}`;
  if (signTextures.has(key)) return signTextures.get(key);

  const canvas = document.createElement('canvas');
  canvas.width = 320;
  canvas.height = 160;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = background;
  roundRect(ctx, 4, 4, 312, 152, 22);
  ctx.fill();

  ctx.strokeStyle = color;
  ctx.lineWidth = 6;
  ctx.shadowColor = color;
  ctx.shadowBlur = 18;
  roundRect(ctx, 12, 12, 296, 136, 16);
  ctx.stroke();

  if (kind === 'cat') {
    drawCat(ctx, color);
  } else {
    const labels = {
      focus: '集中',
      study: '勉強',
      ninja: '忍',
      ramen: '拉麺',
      dream: '夢',
      future: '未来',
    };
    const label = labels[kind] || labels.focus;
    ctx.fillStyle = color;
    ctx.font = '800 74px "Hiragino Sans", "Yu Gothic", "Noto Sans JP", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, 160, 86);
    ctx.font = '700 18px "Baloo 2", sans-serif';
    ctx.globalAlpha = 0.72;
    ctx.fillText(kind.toUpperCase(), 160, 134);
    ctx.globalAlpha = 1;
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  signTextures.set(key, texture);
  return texture;
}
