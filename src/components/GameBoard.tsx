import { useRef, useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Cell from './Cell';
import { GameState, Player, Cell as CellType, BOARD_SIZE, MAX_PIECES_PER_PLAYER, getExpiringPiece, getPieceAges } from '../game/gameLogic';
import { useProfileStore } from '../store/profileStore';
import { getSkin } from '../types/profile';

interface Props {
  gameState: GameState;
  onCellPress: (index: number) => void;
  disabled: boolean;
}

interface Ghost {
  index: number;
  player: Player;
}

export default function GameBoard({ gameState, onCellPress, disabled }: Props) {
  const { board, moveHistory, winner, isDraw, currentTurn, winningLine } = gameState;

  const { p1, p2 } = useProfileStore();
  const pieceColors: Record<Player, string> = {
    p1: getSkin(p1.activeSkinId).colors[0],
    p2: getSkin(p2.activeSkinId).colors[0],
  };

  const prevBoardRef = useRef<CellType[]>(board);
  const [ghost, setGhost] = useState<Ghost | null>(null);

  // Detect sliding-window removal: exactly one cell went from non-null to null
  useEffect(() => {
    const prevBoard = prevBoardRef.current;
    prevBoardRef.current = board;

    const removed: Ghost[] = [];
    for (let i = 0; i < board.length; i++) {
      if (prevBoard[i] !== null && board[i] === null) {
        removed.push({ index: i, player: prevBoard[i] as Player });
      }
    }

    if (removed.length === 1) {
      setGhost(removed[0]);
      const timer = setTimeout(() => setGhost(null), 400);
      return () => clearTimeout(timer);
    }
  }, [board]);

  const expiringIndex = getExpiringPiece(moveHistory, currentTurn);

  const ages: Record<Player, Map<number, number>> = {
    p1: getPieceAges(moveHistory, 'p1'),
    p2: getPieceAges(moveHistory, 'p2'),
  };

  const isGameOver = !!winner || isDraw;

  return (
    <View style={styles.board}>
      {Array.from({ length: BOARD_SIZE }, (_, row) => (
        <View key={row} style={styles.row}>
          {Array.from({ length: BOARD_SIZE }, (_, col) => {
            const index = row * BOARD_SIZE + col;
            const value = board[index];
            const pieceAge = value ? (ages[value].get(index) ?? null) : null;
            const maxAge = value ? ages[value].size : MAX_PIECES_PER_PLAYER;
            const winIdx = winningLine ? winningLine.indexOf(index) : -1;

            return (
              <Cell
                key={index}
                value={value}
                onPress={() => onCellPress(index)}
                disabled={disabled || isGameOver}
                isExpiring={index === expiringIndex && value === currentTurn}
                pieceAge={pieceAge}
                maxAge={maxAge}
                isWinning={winIdx >= 0}
                winningOrder={winIdx >= 0 ? winIdx : 0}
                ghostPlayer={ghost?.index === index ? ghost.player : null}
                pieceColor={value ? pieceColors[value] : undefined}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    padding: 10,
    backgroundColor: '#111D2B',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1C2E42',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  row: {
    flexDirection: 'row',
  },
});
