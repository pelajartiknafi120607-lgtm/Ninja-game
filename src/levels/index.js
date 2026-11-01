import { LEVEL_1 } from './Level1.js';
import { LEVEL_2 } from './Level2.js';
import { LEVEL_3 } from './Level3.js';

export const LEVELS = [LEVEL_1, LEVEL_2, LEVEL_3];

export function getLevel(id) {
  return LEVELS.find((level) => level.id === id) || LEVELS[0];
}

export function getNextLevel(id) {
  const index = LEVELS.findIndex((level) => level.id === id);
  return index >= 0 && index < LEVELS.length - 1 ? LEVELS[index + 1] : null;
}
