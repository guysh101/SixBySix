import { GameState, wouldWin, BOARD_SIZE } from './gameLogic';

export function getAIMove(state: GameState): number | undefined {
  const { board, moveHistory } = state;
  const empty = board
    .map((cell, i) => (cell === null ? i : -1))
    .filter(i => i !== -1);

  if (empty.length === 0) return undefined;

  // Try to win (accounting for sliding window)
  for (const idx of empty) {
    if (wouldWin(board, idx, 'p2', moveHistory)) return idx;
  }

  // Try to block player (accounting for sliding window)
  for (const idx of empty) {
    if (wouldWin(board, idx, 'p1', moveHistory)) return idx;
  }

  // Prefer center area
  const centerCells = empty.filter(i => {
    const r = Math.floor(i / BOARD_SIZE);
    const c = i % BOARD_SIZE;
    return r >= 1 && r <= 4 && c >= 1 && c <= 4;
  });

  const pool = centerCells.length > 0 ? centerCells : empty;
  return pool[Math.floor(Math.random() * pool.length)];
}
