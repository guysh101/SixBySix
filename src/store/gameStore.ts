import { create } from 'zustand';
import { GameState, createInitialState, applyMove } from '../game/gameLogic';

export type GameMode = 'pass-and-play' | 'vs-ai';

interface GameStore {
  gameState: GameState;
  gameMode: GameMode;
  setGameMode: (mode: GameMode) => void;
  makeMove: (cellIndex: number) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  gameState: createInitialState(),
  gameMode: 'pass-and-play',
  setGameMode: (mode) => set({ gameMode: mode }),
  makeMove: (cellIndex) =>
    set((state) => ({ gameState: applyMove(state.gameState, cellIndex) })),
  resetGame: () => set({ gameState: createInitialState() }),
}));
