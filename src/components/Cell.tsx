import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, View, StyleSheet, Animated } from 'react-native';
import { Player } from '../game/gameLogic';

interface Props {
  value: Player | null;
  onPress: () => void;
  disabled: boolean;
  isExpiring: boolean;
  pieceAge: number | null;
  maxAge: number;
  isWinning: boolean;
  winningOrder: number;
  ghostPlayer: Player | null;
  pieceColor?: string;
}

export const PLAYER_COLORS: Record<Player, string> = {
  p1: '#FF5757',
  p2: '#00E5CC',
};

function Cell({ value, onPress, disabled, isExpiring, pieceAge, maxAge, isWinning, winningOrder, ghostPlayer, pieceColor }: Props) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const winOverlayAnim = useRef(new Animated.Value(0)).current;
  const ghostAnim = useRef(new Animated.Value(0)).current;

  const color = (value && pieceColor) ? pieceColor : (value ? PLAYER_COLORS[value] : '#FF5757');

  // Placement pop
  useEffect(() => {
    if (value !== null) {
      scaleAnim.setValue(0.3);
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.1, duration: 120, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1.0, duration: 80, useNativeDriver: true }),
      ]).start();
    }
  }, [value]);

  // Win highlight with stagger — 200ms delay lets placement finish first
  useEffect(() => {
    if (isWinning && value !== null) {
      winOverlayAnim.setValue(0);
      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(winOverlayAnim, { toValue: 0.35, duration: 200, useNativeDriver: true }),
          Animated.sequence([
            Animated.timing(scaleAnim, { toValue: 1.25, duration: 150, useNativeDriver: true }),
            Animated.timing(scaleAnim, { toValue: 1.0, duration: 150, useNativeDriver: true }),
          ]),
        ]).start();
      }, 200 + winningOrder * 80);
      return () => clearTimeout(timer);
    } else {
      winOverlayAnim.setValue(0);
    }
  }, [isWinning]);

  // Ghost fade-out when sliding window removes this piece
  useEffect(() => {
    if (ghostPlayer !== null) {
      ghostAnim.setValue(1);
      Animated.timing(ghostAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start();
    }
  }, [ghostPlayer]);

  let pieceOpacity: number;
  if (isExpiring) {
    pieceOpacity = 0.35;
  } else if (pieceAge !== null) {
    pieceOpacity = 0.5 + (pieceAge / maxAge) * 0.5;
  } else {
    pieceOpacity = 1;
  }

  const ghostScale = ghostAnim.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1.0] });
  const ghostColor = ghostPlayer ? (pieceColor ?? PLAYER_COLORS[ghostPlayer]) : '#FF5757';

  return (
    <TouchableOpacity
      style={[
        styles.cell,
        value !== null && styles.occupied,
        isWinning && value && { borderColor: color, borderWidth: 2 },
      ]}
      onPress={onPress}
      disabled={disabled || value !== null}
      activeOpacity={0.7}
    >
      {isWinning && value && (
        <Animated.View
          style={[StyleSheet.absoluteFill, { backgroundColor: color, opacity: winOverlayAnim, borderRadius: 6 }]}
        />
      )}
      {ghostPlayer !== null && value === null && (
        <Animated.View
          style={[styles.piece, { backgroundColor: ghostColor, opacity: ghostAnim, transform: [{ scale: ghostScale }] }]}
        />
      )}
      {value && (
        <Animated.View
          style={[styles.piece, { backgroundColor: color, opacity: pieceOpacity, transform: [{ scale: scaleAnim }] }]}
        >
          {isExpiring && <View style={styles.expiryRing} />}
        </Animated.View>
      )}
    </TouchableOpacity>
  );
}

export default React.memo(Cell);

const styles = StyleSheet.create({
  cell: {
    width: 52,
    height: 52,
    margin: 2,
    borderRadius: 6,
    backgroundColor: '#1E2A3A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2D3F52',
    overflow: 'hidden',
  },
  occupied: { backgroundColor: '#1A2535' },
  piece: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  expiryRing: {
    position: 'absolute',
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    borderColor: '#FFAA00',
  },
});
