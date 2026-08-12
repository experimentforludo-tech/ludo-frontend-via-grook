export const GRID_SIZE = 15;
export const TRACK_LENGTH = 52;

export const START_OFFSET = { RED: 0, GREEN: 13, YELLOW: 26, BLUE: 39 };

export const SAFE_POSITIONS = new Set([0, 8, 13, 21, 26, 34, 39, 47]);

export const TRACK_COORDINATES = [
  [6, 1], [6, 2], [6, 3], [6, 4], [6, 5],
  [5, 6], [4, 6], [3, 6], [2, 6], [1, 6], [0, 6],
  [0, 7],
  [0, 8], [1, 8], [2, 8], [3, 8], [4, 8], [5, 8],
  [6, 9], [6, 10], [6, 11], [6, 12], [6, 13], [6, 14],
  [7, 14],
  [8, 14], [8, 13], [8, 12], [8, 11], [8, 10], [8, 9],
  [9, 8], [10, 8], [11, 8], [12, 8], [13, 8], [14, 8],
  [14, 7],
  [14, 6], [13, 6], [12, 6], [11, 6], [10, 6], [9, 6],
  [8, 5], [8, 4], [8, 3], [8, 2], [8, 1], [8, 0],
  [7, 0],
  [7, 1]
];

export const HOME_STRETCH_COORDINATES = {
  RED: [[7, 1], [7, 2], [7, 3], [7, 4], [7, 5], [7, 6]],
  GREEN: [[1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7]],
  YELLOW: [[7, 13], [7, 12], [7, 11], [7, 10], [7, 9], [7, 8]],
  BLUE: [[13, 7], [12, 7], [11, 7], [10, 7], [9, 7], [8, 7]]
};

export const BASE_COORDINATES = {
  RED: [[1.5, 1.5], [1.5, 3.5], [3.5, 1.5], [3.5, 3.5]],
  GREEN: [[1.5, 10.5], [1.5, 12.5], [3.5, 10.5], [3.5, 12.5]],
  YELLOW: [[10.5, 10.5], [10.5, 12.5], [12.5, 10.5], [12.5, 12.5]],
  BLUE: [[10.5, 1.5], [10.5, 3.5], [12.5, 1.5], [12.5, 3.5]]
};

export function getGlobalPosition(color, steps) {
  if (steps < 0 || steps > 50) return null;
  return (START_OFFSET[color] + steps) % TRACK_LENGTH;
}

export function getPawnCell(color, steps) {
  if (steps === -1) return null;
  if (steps === 56) return HOME_STRETCH_COORDINATES[color][5];
  if (steps >= 51) return HOME_STRETCH_COORDINATES[color][steps - 51];
  const globalIdx = getGlobalPosition(color, steps);
  return TRACK_COORDINATES[globalIdx];
}

export function baseCell(color, baseIndex) {
  return BASE_COORDINATES[color][baseIndex];
}