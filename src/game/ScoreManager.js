import { COLLECTIBLE_VALUES, getRank } from '../levels/ThemeConfig.js';

const BEST_KEY = 'focus-ninja-best-scores';

export function loadBestScores() {
  try {
    const raw = localStorage.getItem(BEST_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export function getBestScore(levelId) {
  return Number(loadBestScores()[levelId] || 0);
}

export function saveBestScore(levelId, score) {
  const scores = loadBestScores();
  if (score > Number(scores[levelId] || 0)) {
    scores[levelId] = score;
    try {
      localStorage.setItem(BEST_KEY, JSON.stringify(scores));
    } catch {
      // Ignore storage failures.
    }
    return true;
  }
  return false;
}

export class ScoreManager {
  constructor() {
    this.level = null;
    this.score = 0;
    this.items = 0;
    this.hits = 0;
    this.lives = 3;
    this.elapsed = 0;
    this.collected = {};
    this.completed = false;
    this.newBest = false;
  }

  reset(level) {
    this.level = level;
    this.score = 0;
    this.items = 0;
    this.hits = 0;
    this.lives = level.lives;
    this.elapsed = 0;
    this.collected = {};
    this.completed = false;
    this.newBest = false;
  }

  update(dt) {
    this.elapsed += dt;
  }

  addCollectible(type) {
    const value = COLLECTIBLE_VALUES[type] || 0;
    this.score += value;
    this.items += 1;
    this.collected[type] = (this.collected[type] || 0) + 1;
    return value;
  }

  registerHit() {
    if (this.lives <= 0) return false;
    this.lives -= 1;
    this.hits += 1;
    this.score = Math.max(0, this.score - 50);
    return true;
  }

  finish(completed) {
    this.completed = completed;
    if (completed) {
      this.score += this.level.bonus;
    }
    this.newBest = saveBestScore(this.level.id, this.score);
    return this.getResult();
  }

  getResult() {
    return {
      levelId: this.level.id,
      levelName: this.level.name,
      score: this.score,
      items: this.items,
      hits: this.hits,
      lives: this.lives,
      elapsed: this.elapsed,
      completed: this.completed,
      newBest: this.newBest,
      rank: getRank(this.score, this.level.rankThresholds),
      collected: { ...this.collected },
    };
  }
}
