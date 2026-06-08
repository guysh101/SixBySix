import React, { useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, Animated,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import GameBoard from '../components/GameBoard';
import { PLAYER_COLORS } from '../components/Cell';
import { useGameStore, GameMode } from '../store/gameStore';
import { useProfileStore } from '../store/profileStore';
import { getAIMove } from '../game/aiPlayer';
import { MAX_PIECES_PER_PLAYER, Player } from '../game/gameLogic';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Game'>;
};

function getWinnerMessage(
  isDraw: boolean,
  gameMode: GameMode,
  winner: Player | null,
  p1Name: string,
): string {
  if (isDraw) return '🤝 Draw!';
  if (gameMode === 'vs-ai' && winner === 'p2') return '🤖 AI Wins!';
  return `🏆 ${winner === 'p1' ? p1Name : 'Player 2'} Wins!`;
}

export default function GameScreen({ navigation }: Props) {
  const { gameState, gameMode, makeMove, resetGame } = useGameStore();
  const { currentTurn, winner, isDraw, moveHistory } = gameState;
  const { p1, p2, recordResult } = useProfileStore();

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const gameStateRef = useRef(gameState);
  gameStateRef.current = gameState;
  const resultRecordedRef = useRef(false);

  const isAITurn = gameMode === 'vs-ai' && currentTurn === 'p2' && !winner && !isDraw;
  const gameOver = winner || isDraw;

  const p1Count = moveHistory.filter(m => m.player === 'p1').length;
  const p2Count = moveHistory.filter(m => m.player === 'p2').length;
  const anyExpiring = p1Count >= MAX_PIECES_PER_PLAYER || p2Count >= MAX_PIECES_PER_PLAYER;

  // Record game result once when game ends; reset flag on new game
  useEffect(() => {
    if (gameOver) {
      if (!resultRecordedRef.current) {
        resultRecordedRef.current = true;
        recordResult(winner, gameMode);
      }
    } else {
      resultRecordedRef.current = false;
    }
  }, [gameOver]);

  // Pulse animation
  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.08, duration: 600, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [currentTurn, pulseAnim]);

  // AI move
  useEffect(() => {
    if (!isAITurn) return;
    const timer = setTimeout(() => {
      const move = getAIMove(gameStateRef.current);
      if (move !== undefined) makeMove(move);
    }, 500);
    return () => clearTimeout(timer);
  }, [isAITurn, makeMove]);

  const handleCellPress = (index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    makeMove(index);
  };

  const p1Name = p1.name;
  const p2Name = gameMode === 'vs-ai' ? '🤖 AI' : p2.name;
  const currentName = currentTurn === 'p1' ? p1Name : p2Name;

  const renderPieceCounter = (player: Player, count: number) => {
    const dots = [];
    for (let i = 0; i < MAX_PIECES_PER_PLAYER; i++) {
      const isExpiryDot = count >= MAX_PIECES_PER_PLAYER && i === 0 && player === currentTurn && !gameOver;
      dots.push(
        <View
          key={i}
          style={[
            styles.dot,
            { backgroundColor: i < count ? PLAYER_COLORS[player] : '#1E2A3A' },
            isExpiryDot && styles.dotExpiring,
          ]}
        />
      );
    }
    return <View style={styles.dotRow}>{dots}</View>;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={resetGame} style={styles.resetBtn}>
          <Text style={styles.resetText}>↺ Reset</Text>
        </TouchableOpacity>
      </View>

      {/* Status */}
      {gameOver ? (
        <View style={[
          styles.statusBox,
          { backgroundColor: winner ? PLAYER_COLORS[winner] + '33' : '#33333344' },
        ]}>
          <Text style={[styles.statusText, { color: winner ? PLAYER_COLORS[winner] : '#AABBCC' }]}>
            {getWinnerMessage(isDraw, gameMode, winner, p1Name)}
          </Text>
          <TouchableOpacity onPress={resetGame} style={styles.playAgainBtn}>
            <Text style={styles.playAgainText}>Play Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Animated.View
          style={[
            styles.statusBox,
            { backgroundColor: PLAYER_COLORS[currentTurn] + '22', transform: [{ scale: pulseAnim }] },
          ]}
        >
          <Text style={[styles.statusText, { color: PLAYER_COLORS[currentTurn] }]}>
            {isAITurn ? '🤖 AI thinking...' : `${currentName}'s Turn`}
          </Text>
        </Animated.View>
      )}

      {/* Piece counters */}
      <View style={styles.countersRow}>
        <View style={styles.playerInfo}>
          <Text style={[styles.playerLabel, { color: PLAYER_COLORS.p1 }]}>{p1Name}</Text>
          {renderPieceCounter('p1', p1Count)}
        </View>
        <View style={styles.playerInfo}>
          <Text style={[styles.playerLabel, { color: PLAYER_COLORS.p2 }]}>{p2Name}</Text>
          {renderPieceCounter('p2', p2Count)}
        </View>
      </View>

      {/* Board */}
      <View style={styles.boardContainer}>
        <GameBoard
          gameState={gameState}
          onCellPress={handleCellPress}
          disabled={isAITurn}
        />
      </View>

      {anyExpiring && !gameOver && (
        <View style={styles.hint}>
          <View style={styles.hintDot} />
          <Text style={styles.hintText}>Marked piece will be removed on your next move</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0D1821' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1C2E42',
    paddingBottom: 8,
  },
  backBtn: { padding: 8 },
  backText: { color: '#8899AA', fontSize: 16 },
  resetBtn: { padding: 8 },
  resetText: { color: '#8899AA', fontSize: 16 },
  statusBox: {
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    minHeight: 52,
    justifyContent: 'center',
  },
  statusText: { fontSize: 18, fontWeight: '700' },
  playAgainBtn: {
    marginTop: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  playAgainText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  countersRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 16,
    marginTop: 16,
  },
  playerInfo: { alignItems: 'center' },
  playerLabel: { fontSize: 13, fontWeight: '600', marginBottom: 6 },
  dotRow: { flexDirection: 'row', gap: 4 },
  dot: { width: 12, height: 12, borderRadius: 6 },
  dotExpiring: { borderWidth: 2, borderColor: '#FFAA00' },
  boardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  hint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 16,
    gap: 6,
  },
  hintDot: { width: 12, height: 12, borderRadius: 6, borderWidth: 2, borderColor: '#FFAA00' },
  hintText: { color: '#556677', fontSize: 12 },
});
