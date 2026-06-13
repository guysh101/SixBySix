import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, View, StyleSheet, Animated } from 'react-native';
import { Player } from '../game/gameLogic';
import { AvatarConfig } from '../types/profile';
import { GemPalette, getSkinGemPalette } from '../theme/colors';
import Gem from './Gem';

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
  // Gem palette derived from skin ID — passed from GameBoard
  gemPalette?: GemPalette;
}

// Kept for backward compatibility (GameScreen uses PLAYER_COLORS)
export const PLAYER_COLORS: Record<Player, string> = {
  p1: '#FF6253',
  p2: '#4F9CF7',
};

const PLAYER_PALETTE: Record<Player, GemPalette> = {
  p1: getSkinGemPalette('classic_red'),
  p2: getSkinGemPalette('classic_teal'),
};

function Cell({
  value,
  onPress,
  disabled,
  isExpiring,
  pieceAge,
  maxAge,
  isWinning,
  winningOrder,
  ghostPlayer,
  pieceColors,
  pieceAvatar,
  gemPalette,
}: Props) {
  const scaleAnim      = useRef(new Animated.Value(1)).current;
  const winOverlayAnim = useRef(new Animated.Value(0)).current;
  const ghostAnim      = useRef(new Animated.Value(0)).current;

  // Placement pop
  useEffect(() => {
    if (value !== null) {
      scaleAnim.setValue(0.3);
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.3, duration: 120, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1.0, duration: 80,  useNativeDriver: true }),
      ]).start();
    }
  }, [value]);

  // Win highlight (staggered)
  useEffect(() => {
    if (isWinning && value !== null) {
      winOverlayAnim.setValue(0);
      const timer = setTimeout(() => {
        Animated.parallel([
          Animated.timing(winOverlayAnim, { toValue: 0.35, duration: 200, useNativeDriver: true }),
          Animated.sequence([
            Animated.timing(scaleAnim, { toValue: 1.2, duration: 150, useNativeDriver: true }),
            Animated.timing(scaleAnim, { toValue: 1.0, duration: 150, useNativeDriver: true }),
          ]),
        ]).start();
      }, 200 + winningOrder * 80);
      return () => clearTimeout(timer);
    } else {
      winOverlayAnim.setValue(0);
    }
  }, [isWinning]);

  // Ghost fade-out
  useEffect(() => {
    if (ghostPlayer !== null) {
      ghostAnim.setValue(1);
      Animated.timing(ghostAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start();
    }
  }, [ghostPlayer]);

  // Piece opacity based on age (expiring handled by Gem component internally)
  let pieceOpacity = 1;
  if (!isExpiring && pieceAge !== null) {
    pieceOpacity = 0.52 + (pieceAge / maxAge) * 0.48;
  }

  const palette: GemPalette = gemPalette ?? (value ? PLAYER_PALETTE[value] : PLAYER_PALETTE.p1);

  const ghostPalette: GemPalette = ghostPlayer
    ? (PLAYER_PALETTE[ghostPlayer])
    : PLAYER_PALETTE.p1;

  const ghostScale = ghostAnim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1.0] });

  return (
    <TouchableOpacity
      style={styles.cell}
      onPress={onPress}
      disabled={disabled || value !== null}
      activeOpacity={0.8}
    >
      {/* Inset socket overlay (dark top arc) */}
      <View style={styles.inset} pointerEvents="none" />

      {/* Win glow overlay */}
      {isWinning && value && (
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: PLAYER_COLORS[value],
              opacity: winOverlayAnim,
              borderRadius: 15,
            },
          ]}
          pointerEvents="none"
        />
      )}

      {/* Ghost piece (fade-out on removal) */}
      {ghostPlayer !== null && value === null && (
        <Animated.View
          style={{
            opacity: ghostAnim,
            transform: [{ scale: ghostScale }],
          }}
          pointerEvents="none"
        >
          <Gem palette={ghostPalette} size={GEM_SIZE} />
        </Animated.View>
      )}

      {/* Live piece */}
      {value && (
        <Animated.View
          style={{
            opacity: pieceOpacity,
            transform: [{ scale: scaleAnim }],
          }}
        >
          <Gem
            palette={palette}
            size={GEM_SIZE}
            avatar={pieceAvatar}
            expiring={isExpiring}
          />
        </Animated.View>
      )}
    </TouchableOpacity>
  );
}

export default React.memo(Cell);

const CELL_SIZE = 58;
const GEM_SIZE  = 46;

const styles = StyleSheet.create({
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: 15,
    backgroundColor: '#2A1755',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
    // subtle gradient via shadow layers instead of LinearGradient to keep it flat
    shadowColor: '#382371',
    shadowOffset: { width: 0, height: CELL_SIZE },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  inset: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: CELL_SIZE * 0.45,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
});
