const FULL_TYPES = ['crate', 'barrel', 'stoneArch', 'spikedRoller', 'phoneMonster', 'notificationMonster'];
const LOW_TYPES = ['barricade', 'hurdle'];
const HIGH_TYPES = ['lanternGate', 'logGate', 'laserGate'];
const BASIC_TYPES = ['book', 'pencil', 'star'];
const ORB_TYPES = ['focusOrb', 'knowledgeOrb'];
const MONSTER_TYPES = ['phoneMonster', 'notificationMonster'];
const ALL_OBSTACLES = [...FULL_TYPES, ...LOW_TYPES, ...HIGH_TYPES];

function shuffle(values) {
  const result = [...values];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function randomLane() {
  return Math.floor(Math.random() * 3);
}

export class TrackManager {
  constructor(level, obstacles, collectibles) {
    this.level = level;
    this.obstacles = obstacles;
    this.collectibles = collectibles;
    this.nextDistance = 36;
    this.patterns = 0;
  }

  reset() {
    this.nextDistance = 36;
    this.patterns = 0;
  }

  pick(weights) {
    const entries = Object.entries(weights || {}).filter(([, weight]) => weight > 0);
    if (!entries.length) return null;
    const total = entries.reduce((sum, [, weight]) => sum + weight, 0);
    let roll = Math.random() * total;
    for (const [key, weight] of entries) {
      roll -= weight;
      if (roll <= 0) return key;
    }
    return entries[entries.length - 1][0];
  }

  pickType(types, weights) {
    const allowed = types.filter((type) => Number(weights?.[type] || 0) > 0);
    if (!allowed.length) return null;
    const filtered = {};
    for (const type of allowed) filtered[type] = weights[type];
    return this.pick(filtered);
  }

  spawnObstacle(lane, distance, types) {
    const type = this.pickType(types, this.level.obstacleWeights);
    if (!type) return false;
    this.obstacles.spawn(type, lane, distance);
    return true;
  }

  spawnCollectible(lane, distance, height = 1.25) {
    const type =
      this.pickType(BASIC_TYPES, this.level.collectibleWeights) ||
      this.pickType(ORB_TYPES, this.level.collectibleWeights);
    if (!type) return;
    this.collectibles.spawn(type, lane, distance, height);
  }

  update(distance) {
    const horizon = Math.min(distance + 145, this.level.length - 18);
    let guard = 0;
    while (this.nextDistance < horizon && guard < 10) {
      const consumed = this.spawnPattern(this.nextDistance);
      const difficulty = (this.level.speed.start - 14) * 1.7 + (this.level.index - 1) * 2.2;
      const gap = 14 + Math.random() * 9 + difficulty;
      this.nextDistance += Math.max(consumed, 2) + gap;
      guard += 1;
      this.patterns += 1;
    }
  }

  spawnPattern(distance) {
    const key = this.pick(this.level.patternWeights);
    switch (key) {
      case 'double':
        return this.spawnDouble(distance);
      case 'jump':
        return this.spawnJump(distance);
      case 'slide':
        return this.spawnSlide(distance);
      case 'line':
        return this.spawnLine(distance);
      case 'arc':
        return this.spawnArc(distance);
      case 'slalom':
        return this.spawnSlalom(distance);
      case 'distraction':
        return this.spawnDistraction(distance);
      case 'single':
      default:
        return this.spawnSingle(distance);
    }
  }

  spawnSingle(distance) {
    const type = this.pickType(ALL_OBSTACLES, this.level.obstacleWeights);
    if (!type) return 2;
    this.obstacles.spawn(type, randomLane(), distance);
    return 2;
  }

  spawnDouble(distance) {
    const lanes = shuffle([0, 1, 2]).slice(0, 2);
    for (const lane of lanes) this.spawnObstacle(lane, distance, FULL_TYPES);
    return 2;
  }

  spawnJump(distance) {
    const lanes = Math.random() < 0.55 ? [randomLane()] : shuffle([0, 1, 2]).slice(0, 2);
    for (const lane of lanes) this.spawnObstacle(lane, distance, LOW_TYPES);
    const lane = lanes[0];
    const type = this.pickType(BASIC_TYPES, this.level.collectibleWeights);
    if (type) {
      this.collectibles.spawn(type, lane, distance - 1.5, 0.85);
      this.collectibles.spawn(type, lane, distance, 1.55);
      this.collectibles.spawn(type, lane, distance + 1.5, 0.85);
    }
    return 4;
  }

  spawnSlide(distance) {
    const lanes = Math.random() < 0.55 ? [randomLane()] : shuffle([0, 1, 2]).slice(0, 2);
    for (const lane of lanes) this.spawnObstacle(lane, distance, HIGH_TYPES);
    const lane = lanes[0];
    const type = this.pickType(BASIC_TYPES, this.level.collectibleWeights);
    if (type) {
      for (let i = 0; i < 3; i += 1) {
        this.collectibles.spawn(type, lane, distance - 1.4 + i * 1.4, 0.55);
      }
    }
    return 4;
  }

  spawnLine(distance) {
    const lane = randomLane();
    const count = 5 + Math.floor(Math.random() * 3);
    const type = this.pickType(BASIC_TYPES, this.level.collectibleWeights);
    if (type) {
      for (let i = 0; i < count; i += 1) {
        this.collectibles.spawn(type, lane, distance + i * 2.1, 1.2);
      }
    }
    return count * 2.1;
  }

  spawnArc(distance) {
    const lane = randomLane();
    this.spawnObstacle(lane, distance + 4.2, LOW_TYPES);
    const heights = [0.9, 1.4, 1.8, 2.0, 1.8, 1.4, 0.9];
    const type = this.pickType(BASIC_TYPES, this.level.collectibleWeights);
    if (type) {
      for (let i = 0; i < heights.length; i += 1) {
        this.collectibles.spawn(type, lane, distance + i * 1.55, heights[i]);
      }
    }
    return 12;
  }

  spawnSlalom(distance) {
    const sequences = [
      [0, 2, 1],
      [2, 0, 1],
      [1, 0, 2],
      [1, 2, 0],
      [2, 1, 0],
      [0, 1, 2],
    ];
    const sequence = sequences[Math.floor(Math.random() * sequences.length)];
    for (let i = 0; i < sequence.length; i += 1) {
      this.spawnObstacle(sequence[i], distance + i * 8.4, FULL_TYPES);
    }
    const rewardLane = sequence[sequence.length - 1];
    const orb = this.pickType(ORB_TYPES, this.level.collectibleWeights);
    if (orb) {
      this.collectibles.spawn(orb, rewardLane, distance + 20.5, 1.25);
    }
    return 22;
  }

  spawnDistraction(distance) {
    const lanes = shuffle([0, 1, 2]).slice(0, Math.random() < 0.5 ? 1 : 2);
    const monster = this.pickType(MONSTER_TYPES, this.level.obstacleWeights);
    const types = monster ? MONSTER_TYPES : FULL_TYPES;
    for (const lane of lanes) this.spawnObstacle(lane, distance, types);

    const freeLane = [0, 1, 2].find((lane) => !lanes.includes(lane)) ?? 1;
    const orb = this.pickType(ORB_TYPES, this.level.collectibleWeights);
    const reward = orb || this.pickType(BASIC_TYPES, this.level.collectibleWeights);
    if (reward) {
      for (let i = 0; i < 4; i += 1) {
        this.collectibles.spawn(reward, freeLane, distance - 0.8 + i * 1.8, 1.25);
      }
    }
    return 9;
  }
}
