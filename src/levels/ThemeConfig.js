export const LANE_WIDTH = 2.4;
export const TRACK_WIDTH = 8.8;
export const LANES = [-LANE_WIDTH, 0, LANE_WIDTH];

const DEFAULTS = {
  laneWidth: LANE_WIDTH,
  trackWidth: TRACK_WIDTH,
  lives: 3,
  bonus: 300,
  difficultyStars: 1,
  speed: { start: 14, max: 18 },
  length: 800,
  obstacleWeights: {},
  collectibleWeights: {},
  patternWeights: {},
  rankThresholds: [1200, 2200, 3200],
  ambientParticles: 'leaves',
};

export function createLevel(config) {
  return {
    ...DEFAULTS,
    ...config,
    speed: { ...DEFAULTS.speed, ...config.speed },
    obstacleWeights: { ...DEFAULTS.obstacleWeights, ...config.obstacleWeights },
    collectibleWeights: { ...DEFAULTS.collectibleWeights, ...config.collectibleWeights },
    patternWeights: { ...DEFAULTS.patternWeights, ...config.patternWeights },
    rankThresholds: config.rankThresholds || DEFAULTS.rankThresholds,
  };
}

export const COLLECTIBLE_VALUES = {
  book: 100,
  pencil: 50,
  star: 25,
  focusOrb: 150,
  knowledgeOrb: 200,
};

export const COLLECTIBLE_LABELS = {
  book: 'Buku',
  pencil: 'Pensil',
  star: 'Bintang',
  focusOrb: 'Focus Orb',
  knowledgeOrb: 'Knowledge Orb',
};

export const RANKS = [
  { name: 'Beginner Ninja', icon: 'star' },
  { name: 'Focus Ninja', icon: 'star' },
  { name: 'Master Ninja', icon: 'crown' },
  { name: 'Focus Legend', icon: 'crown' },
];

export function getRank(score, thresholds) {
  if (score >= thresholds[2]) return RANKS[3];
  if (score >= thresholds[1]) return RANKS[2];
  if (score >= thresholds[0]) return RANKS[1];
  return RANKS[0];
}

export function formatTime(seconds) {
  const safe = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safe / 60);
  const rest = String(safe % 60).padStart(2, '0');
  return `${minutes}:${rest}`;
}
