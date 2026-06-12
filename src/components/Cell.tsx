import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, View, StyleSheet, Animated } from 'react-native';
import { Player } from '../game/gameLogic';
import { AvatarConfig } from '../types/profile';
import AvatarFace from './AvatarFace';

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
  pieceColors?: [string, string];
  pieceAvatar?: AvatarConfig;
}

export const PLAYER_COLORS: Record<Player, string> = {
  p1: '#C0392B',
  p2: '#2C4A6B',
};

function Cell({ value, onPress, disabled, isExpiring, pieceAge, maxAge, isWinning, winningOrder, ghostPlayer, pieceColors, pieceAvatar }: Props) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const winOverlayAnim = useRef(new Animated.Value(0)).current;
  const ghostAnim = useRef(new Animated.Value(0)).current;

  const color = (value && pieceColors) ? pieceColors[0] : (value ? PLAYER_COLORS[value] : PLAYER_COLORS.p1);

  // Placement pop
  useEffect(() => {
    if (value !== null) {
      scaleAnim.setValue(0.3);
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.35, duration: 120, useNativeDriver: true }),
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
  const ghostColor = ghostPlayer ? (pieceColors ? pieceColors[0] : PLAYER_COLORS[ghostPlayer]) : PLAYER_COLORS.p1;

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
          style={[
            styles.piece,
            { backgroundColor: color, opacity: pieceOpacity, transform: [{ scale: scaleAnim }] },
          ]}
        >
          {pieceAvatar && <AvatarFace config={pieceAvatar} size={40} />}
          {isExpiring && <View style={styles.expiryRing} />}
        </Animated.View>
      )}
    </TouchableOpacity>
  );
}

export default React.memo(Cell);

const styles = StyleSheet.create({
  cell: {
    width: 54,
    height: 54,
    margin: 2,
    borderRadius: 8,
    backgroundColor: '#2D1F14',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4A3020',
    overflow: 'hidden',
  },
  occupied: { backgroundColor: '#251A0F' },
  piece: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 4,
  },
  expiryRing: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#D4853A',
  },
});
