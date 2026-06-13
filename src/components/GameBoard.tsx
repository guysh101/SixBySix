import { useRef, useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Cell from './Cell';
import {
  GameState, Player, Cell as CellType,
  BOARD_SIZE, MAX_PIECES_PER_PLAYER,
  getExpiringPiece, getPieceAges,
} from '../game/gameLogic';
import { useProfileStore } from '../store/profileStore';
import { getSkinGemPalette, GemPalette } from '../theme/colors';

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
  const gemPalettes: Record<Player, GemPalette> = {
    p1: getSkinGemPalette(p1.activeSkinId),
    p2: getSkinGemPalette(p2.activeSkinId),
  };
  const avatars: Record<Player, import('../types/profile').AvatarConfig> = {
    p1: p1.avatar,
    p2: p2.avatar,
  };

  const prevBoardRef = useRef<CellType[]>(board);
  const [ghost, setGhost] = useState<Ghost | null>(null);

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
    <View style={styles.boardOuter}>
      {/* 3D base layer */}
      <View style={styles.board3dBase} />
      {/* Board surface */}
      <LinearGradient
        colors={['#4B2F8C', '#38216B']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.board}
      >
        {/* Inner top highlight */}
        <View style={styles.innerHighlight} pointerEvents="none" />

        {Array.from({ length: BOARD_SIZE }, (_, row) => (
          <View key={row} style={styles.row}>
            {Array.from({ length: BOARD_SIZE }, (_, col) => {
              const index = row * BOARD_SIZE + col;
              const value = board[index];
              const pieceAge  = value ? (ages[value].get(index) ?? null) : null;
              const maxAge    = value ? ages[value].size : MAX_PIECES_PER_PLAYER;
              const winIdx    = winningLine ? winningLine.indexOf(index) : -1;

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
                  pieceColors={value ? [gemPalettes[value].mid, gemPalettes[value].deep] : undefined}
                  pieceAvatar={value ? avatars[value] : undefined}
                  gemPalette={value ? gemPalettes[value] : undefined}
                />
              );
            })}
          </View>
        ))}
      </LinearGradient>
    </View>
  );
}

const GAP     = 7;
const PADDING = 12;

const styles = StyleSheet.create({
  boardOuter: {
    // extra bottom space for the 3D base
    paddingBottom: 10,
  },
  board3dBase: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 26,
    backgroundColor: '#271253',
  },
  board: {
    borderRadius: 26,
    borderWidth: 3,
    borderColor: '#7551C2',
    padding: PADDING,
    gap: GAP,
    shadowColor: 'rgba(42,22,80,0.55)',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 16,
  },
  innerHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    borderTopLeftRadius: 23,
    borderTopRightRadius: 23,
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  row: {
    flexDirection: 'row',
    gap: GAP,
  },
});
