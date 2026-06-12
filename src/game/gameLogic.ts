export type Player = 'p1' | 'p2';
export type Cell = Player | null;

export interface MoveRecord {
  player: Player;
  cellIndex: number;
  turn: number;
}

export interface GameState {
  board: Cell[];
  moveHistory: MoveRecord[];
  currentTurn: Player;
  winner: Player | null;
  isDraw: boolean;
  turnCount: number;
  winningLine: number[] | null;
}

export const BOARD_SIZE = 5;
export const MAX_PIECES_PER_PLAYER = 5;
export const WIN_LENGTH = 4;
const MAX_TURNS_BEFORE_DRAW = 60;

export function createInitialState(): GameState {
  return {
    board: Array(BOARD_SIZE * BOARD_SIZE).fill(null),
    moveHistory: [],
    currentTurn: 'p1',
    winner: null,
    isDraw: false,
    turnCount: 0,
    winningLine: null,
  };
}

export function applyMove(state: GameState, cellIndex: number): GameState {
  if (
    cellIndex < 0 ||
    cellIndex >= BOARD_SIZE * BOARD_SIZE ||
    state.board[cellIndex] !== null ||
    state.winner ||
    state.isDraw
  ) return state;

  const board = [...state.board];
  const moveHistory = [...state.moveHistory];
  const { currentTurn, turnCount } = state;

  board[cellIndex] = currentTurn;
  moveHistory.push({ player: currentTurn, cellIndex, turn: turnCount });

  const playerMoves = moveHistory.filter(m => m.player === currentTurn);
  if (playerMoves.length > MAX_PIECES_PER_PLAYER) {
    const oldest = playerMoves[0];
    board[oldest.cellIndex] = null;
    moveHistory.splice(moveHistory.indexOf(oldest), 1);
  }

  const winningLine = findWinningLine(board, cellIndex, currentTurn);
  const winner = winningLine ? currentTurn : null;
  const nextTurn: Player = currentTurn === 'p1' ? 'p2' : 'p1';
  const newTurnCount = turnCount + 1;
  const isDraw = !winner && newTurnCount >= MAX_TURNS_BEFORE_DRAW;

  return {
    board,
    moveHistory,
    currentTurn: winner ? currentTurn : nextTurn,
    winner,
    isDraw,
    turnCount: newTurnCount,
    winningLine,
  };
}

// Check if placing at cellIndex would win — accounting for the sliding window removal
export function wouldWin(
  board: Cell[],
  cellIndex: number,
  player: Player,
  moveHistory: MoveRecord[]
): boolean {
  if (board[cellIndex] !== null) return false;
  const testBoard = [...board];
  testBoard[cellIndex] = player;
  const playerMoves = moveHistory.filter(m => m.player === player);
  if (playerMoves.length >= MAX_PIECES_PER_PLAYER) {
    testBoard[playerMoves[0].cellIndex] = null;
  }
  return findWinningLine(testBoard, cellIndex, player) !== null;
}

function findWinningLine(board: Cell[], lastIndex: number, player: Player): number[] | null {
  const row = Math.floor(lastIndex / BOARD_SIZE);
  const col = lastIndex % BOARD_SIZE;
  const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];

  for (const [dr, dc] of directions) {
    const line = collectLineIndices(board, row, col, dr, dc, player);
    if (line.length >= WIN_LENGTH) return line.slice(0, WIN_LENGTH);
  }
  return null;
}

function collectLineIndices(
  board: Cell[],
  row: number,
  col: number,
  dr: number,
  dc: number,
  player: Player
): number[] {
  const cells: number[] = [];
  let r = row - dr;
  let c = col - dc;
  while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r * BOARD_SIZE + c] === player) {
    cells.unshift(r * BOARD_SIZE + c);
    r -= dr;
    c -= dc;
  }
  cells.push(row * BOARD_SIZE + col);
  r = row + dr;
  c = col + dc;
  while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r * BOARD_SIZE + c] === player) {
    cells.push(r * BOARD_SIZE + c);
    r += dr;
    c += dc;
  }
  return cells;
}

// Returns the index of the piece that will expire on this player's NEXT move
export function getExpiringPiece(moveHistory: MoveRecord[], player: Player): number | null {
  const playerMoves = moveHistory.filter(m => m.player === player);
  if (playerMoves.length < MAX_PIECES_PER_PLAYER) return null;
  return playerMoves[0].cellIndex;
}

// Returns age rank (1=oldest, N=newest) for each cell of a player
export function getPieceAges(moveHistory: MoveRecord[], player: Player): Map<number, number> {
  const playerMoves = moveHistory.filter(m => m.player === player);
  const ages = new Map<number, number>();
  playerMoves.forEach((m, i) => {
    ages.set(m.cellIndex, i + 1);
  });
  return ages;
}
