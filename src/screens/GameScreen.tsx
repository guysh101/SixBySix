import React, { useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  SafeAreaView, Animated, ScrollView,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import Svg, { Polygon } from 'react-native-svg';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import GameBoard from '../components/GameBoard';
import { PLAYER_COLORS } from '../components/Cell';
import { useGameStore, GameMode } from '../store/gameStore';
import { useProfileStore } from '../store/profileStore';
import { getAIMove } from '../game/aiPlayer';
import { MAX_PIECES_PER_PLAYER, Player } from '../game/gameLogic';
import { getSkinGemPalette, GEM_PALETTES, GemPalette, Fonts } from '../theme/colors';
import { AvatarConfig } from '../types/profile';
import SkyScene from '../components/SkyScene';
import Gem from '../components/Gem';
import Ribbon from '../components/Ribbon';
import Coin from '../components/Coin';
import JuicyButton from '../components/JuicyButton';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Game'>;
};

// ─── Star polygon helpers ─────────────────────────────────────────────────────

const STAR5_POINTS = (() => {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const ang = (Math.PI * i) / 5 - Math.PI / 2;
    const r   = i % 2 === 0 ? 13 : 5.5;
    pts.push(`${(15 + r * Math.cos(ang)).toFixed(1)},${(15 + r * Math.sin(ang)).toFixed(1)}`);
  }
  return pts.join(' ');
})();

const RAY_BURST_POINTS = (() => {
  const pts: string[] = [];
  for (let i = 0; i < 16; i++) {
    const ang = (Math.PI * i) / 8 - Math.PI / 2;
    const r   = i % 2 === 0 ? 140 : 60;
    pts.push(`${(150 + r * Math.cos(ang)).toFixed(1)},${(150 + r * Math.sin(ang)).toFixed(1)}`);
  }
  return pts.join(' ');
})();

// ─── Confetti ─────────────────────────────────────────────────────────────────

const CONFETTI_COLORS = ['#FF6253','#4F9CF7','#FFC93C','#7ED957','#A86CE8','#FF9A3C','#6FD3F2','#FFB5A6'];
interface ConfettiItem { color: string; x: number; startY: number; duration: number; wide: boolean }
const CONFETTI_ITEMS: ConfettiItem[] = Array.from({ length: 12 }, (_, i) => ({
  color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  x: 10 + i * 34,
  startY: -(30 + (i * 73) % 400),
  duration: 1700 + (i * 157) % 600,
  wide: i % 3 === 0,
}));

function ConfettiPiece({ color, x, startY, duration, wide }: ConfettiItem) {
  const fallY = useRef(new Animated.Value(startY)).current;
  const rot   = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(fallY, { toValue: 900, duration, useNativeDriver: true }),
          Animated.timing(rot,   { toValue: 1,   duration, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(fallY, { toValue: startY, duration: 1, useNativeDriver: true }),
          Animated.timing(rot,   { toValue: 0,      duration: 1, useNativeDriver: true }),
        ]),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  const rotate = rot.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: x,
        top: 0,
        width: wide ? 6 : 8,
        height: wide ? 10 : 6,
        backgroundColor: color,
        borderRadius: 2,
        transform: [{ translateY: fallY }, { rotate }],
      }}
    />
  );
}

// ─── SlotRow ─────────────────────────────────────────────────────────────────

interface SlotRowProps { palette: GemPalette; count: number; expiringFirst: boolean }

function SlotRow({ palette, count, expiringFirst }: SlotRowProps) {
  const blinkAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (expiringFirst) {
      const anim = Animated.loop(
        Animated.sequence([
          Animated.timing(blinkAnim, { toValue: 0.2, duration: 450, useNativeDriver: true }),
          Animated.timing(blinkAnim, { toValue: 1,   duration: 450, useNativeDriver: true }),
        ])
      );
      anim.start();
      return () => anim.stop();
    }
    blinkAnim.setValue(1);
  }, [expiringFirst]);

  return (
    <View style={slotStyles.row}>
      {Array.from({ length: MAX_PIECES_PER_PLAYER }, (_, i) => {
        const filled   = i < Math.min(count, MAX_PIECES_PER_PLAYER);
        const isExpiry = expiringFirst && i === 0 && filled;
        const dotBg    = filled ? palette.mid : 'rgba(74,44,110,0.2)';
        if (isExpiry) {
          return <Animated.View key={i} style={[slotStyles.dot, { backgroundColor: dotBg, opacity: blinkAnim }]} />;
        }
        return <View key={i} style={[slotStyles.dot, { backgroundColor: dotBg }]} />;
      })}
    </View>
  );
}

const slotStyles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 4 },
  dot: { width: 12, height: 12, borderRadius: 6 },
});

// ─── HudCard ─────────────────────────────────────────────────────────────────

interface HudCardProps {
  name: string;
  palette: GemPalette;
  avatar: AvatarConfig;
  count: number;
  isActive: boolean;
  expiringFirst: boolean;
}

function HudCard({ name, palette, avatar, count, isActive, expiringFirst }: HudCardProps) {
  return (
    <View
      style={[
        hudStyles.card,
        { borderColor: isActive ? palette.mid : 'rgba(255,255,255,0.3)', opacity: isActive ? 1 : 0.78 },
      ]}
    >
      <Gem palette={palette} size={38} avatar={avatar} />
      <Text style={hudStyles.name} numberOfLines={1}>{name}</Text>
      <SlotRow palette={palette} count={count} expiringFirst={expiringFirst} />
    </View>
  );
}

const hudStyles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.82)',
    borderRadius: 18,
    borderWidth: 2,
    padding: 10,
    alignItems: 'center',
    gap: 6,
    shadowColor: 'rgba(58,28,99,0.25)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 6,
  },
  name: { fontFamily: Fonts.uiBold, fontSize: 14, color: '#4A2C6E' },
});

// ─── WinOverlay ──────────────────────────────────────────────────────────────

interface WinOverlayProps {
  isDraw: boolean;
  winner: Player | null;
  winnerPalette: GemPalette;
  winnerAvatar: AvatarConfig | undefined;
  winnerName: string;
  onPlayAgain: () => void;
  onHome: () => void;
}

function WinOverlay({ isDraw, winner, winnerPalette, winnerAvatar, winnerName, onPlayAgain, onHome }: WinOverlayProps) {
  const rayRot   = useRef(new Animated.Value(0)).current;
  const bounceY  = useRef(new Animated.Value(0)).current;
  const star1    = useRef(new Animated.Value(0)).current;
  const star2    = useRef(new Animated.Value(0)).current;
  const star3    = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rayRot, { toValue: 1, duration: 12000, useNativeDriver: true })
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceY, { toValue: -14, duration: 620, useNativeDriver: true }),
        Animated.timing(bounceY, { toValue: 0,   duration: 620, useNativeDriver: true }),
      ])
    ).start();

    [star1, star2, star3].forEach((v, i) => {
      setTimeout(() => {
        Animated.sequence([
          Animated.timing(v, { toValue: 1.25, duration: 180, useNativeDriver: true }),
          Animated.timing(v, { toValue: 1.0,  duration: 100, useNativeDriver: true }),
        ]).start();
      }, i * 160);
    });
  }, []);

  const rayRotate  = rayRot.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const shadowScale = bounceY.interpolate({ inputRange: [-14, 0], outputRange: [0.7, 1] });

  const palette = isDraw ? GEM_PALETTES.gold : winnerPalette;
  const title   = isDraw ? 'DRAW!' : `${winnerName} WINS!`;

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
      {/* Dim */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(52,22,95,0.62)' }} />

      {/* Rotating ray burst (centered, non-blocking) */}
      <View
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}
        pointerEvents="none"
      >
        <Animated.View style={{ transform: [{ rotate: rayRotate }] }}>
          <Svg viewBox="0 0 300 300" width={300} height={300}>
            <Polygon points={RAY_BURST_POINTS} fill="rgba(255,230,100,0.20)" />
          </Svg>
        </Animated.View>
      </View>

      {/* Confetti (non-blocking) */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} pointerEvents="none">
        {CONFETTI_ITEMS.map((item, idx) => <ConfettiPiece key={idx} {...item} />)}
      </View>

      {/* Scrollable content */}
      <ScrollView
        contentContainerStyle={winStyles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Star trio */}
        <View style={winStyles.starRow}>
          {[star1, star2, star3].map((v, i) => (
            <Animated.View key={i} style={{ transform: [{ scale: v }] }}>
              <Svg viewBox="0 0 30 30" width={i === 1 ? 38 : 28} height={i === 1 ? 38 : 28}>
                <Polygon points={STAR5_POINTS} fill="#FFC93C" stroke="#E8960C" strokeWidth={1.5} />
              </Svg>
            </Animated.View>
          ))}
        </View>

        {/* Title ribbon */}
        <Ribbon variant="gold" fontSize={26} letterSpacing={1.5}>{title}</Ribbon>

        {/* Bouncing gem */}
        <Animated.View style={[winStyles.gemWrap, { transform: [{ translateY: bounceY }] }]}>
          <Gem palette={palette} size={130} avatar={winnerAvatar} />
        </Animated.View>

        {/* Gem shadow */}
        <Animated.View style={[winStyles.gemShadow, { transform: [{ scaleX: shadowScale }] }]} />

        {/* Coin chip */}
        {!isDraw && (
          <View style={winStyles.coinChip}>
            <Coin size={22} />
            <Text style={winStyles.coinsText}>+25</Text>
            <Text style={winStyles.coinsLabel}>coins earned</Text>
          </View>
        )}

        {/* Buttons */}
        <JuicyButton variant="gold"  label="PLAY AGAIN" onPress={onPlayAgain} style={winStyles.btn} />
        <JuicyButton variant="ghost" label="HOME"       onPress={onHome}      style={[winStyles.btn, { marginTop: 10 }]} />
      </ScrollView>
    </View>
  );
}

const winStyles = StyleSheet.create({
  content: {
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: 40,
    paddingHorizontal: 32,
  },
  starRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 4, marginBottom: 16 },
  gemWrap: { marginTop: 32 },
  gemShadow: {
    width: 100,
    height: 12,
    borderRadius: 50,
    backgroundColor: 'rgba(0,0,0,0.22)',
    marginTop: 6,
  },
  coinChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderRadius: 999,
    paddingVertical: 5,
    paddingHorizontal: 14,
    marginTop: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  coinsText: { fontFamily: Fonts.uiBold, fontSize: 18, color: '#FFC93C' },
  coinsLabel: { fontFamily: Fonts.ui, fontSize: 12, color: 'rgba(255,255,255,0.85)' },
  btn: { width: 240, marginTop: 20 },
});

// ─── GameScreen ───────────────────────────────────────────────────────────────

export default function GameScreen({ navigation }: Props) {
  const { gameState, gameMode, makeMove, resetGame } = useGameStore();
  const { currentTurn, winner, isDraw, moveHistory } = gameState;
  const { p1, p2, recordResult } = useProfileStore();

  const pulseAnim        = useRef(new Animated.Value(1)).current;
  const gameStateRef     = useRef(gameState);
  gameStateRef.current   = gameState;
  const resultRecordedRef = useRef(false);

  const isAITurn = gameMode === 'vs-ai' && currentTurn === 'p2' && !winner && !isDraw;
  const gameOver = !!(winner || isDraw);

  const p1Count = moveHistory.filter(m => m.player === 'p1').length;
  const p2Count = moveHistory.filter(m => m.player === 'p2').length;
  const p1Expiring = p1Count >= MAX_PIECES_PER_PLAYER && currentTurn === 'p1' && !gameOver;
  const p2Expiring = p2Count >= MAX_PIECES_PER_PLAYER && currentTurn === 'p2' && !gameOver;
  const anyExpiring = p1Count >= MAX_PIECES_PER_PLAYER || p2Count >= MAX_PIECES_PER_PLAYER;

  const p1Palette = getSkinGemPalette(p1.activeSkinId);
  const p2Palette = getSkinGemPalette(p2.activeSkinId);

  const p1Name = p1.name;
  const p2Name = gameMode === 'vs-ai' ? 'AI' : p2.name;
  const currentName = currentTurn === 'p1' ? p1Name : p2Name;

  const winnerPalette = winner ? (winner === 'p1' ? p1Palette : p2Palette) : GEM_PALETTES.gold;
  const winnerAvatar  = winner ? (winner === 'p1' ? p1.avatar : p2.avatar) : undefined;
  const winnerName    = winner === 'p1' ? p1Name : (winner === 'p2' ? p2Name : '');

  // Record result once
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

  // Turn banner pulse
  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.06, duration: 700, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1,    duration: 700, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [currentTurn]);

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

  const turnColor = PLAYER_COLORS[currentTurn];

  return (
    <SafeAreaView style={styles.root}>
      <SkyScene balloon={false}>
        {/* ── Content column ── */}
        <View style={styles.column}>
          {/* Top bar */}
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.roundBtn}>
              <Text style={styles.roundBtnText}>←</Text>
            </TouchableOpacity>

            <Animated.View
              style={[
                styles.turnPill,
                { backgroundColor: turnColor + '2A', transform: [{ scale: pulseAnim }] },
              ]}
            >
              <Text style={[styles.turnText, { color: turnColor }]}>
                {isAITurn ? '🤖 AI thinking…' : `${currentName}'s turn`}
              </Text>
            </Animated.View>

            <TouchableOpacity onPress={resetGame} style={styles.roundBtn}>
              <Text style={[styles.roundBtnText, { fontSize: 20 }]}>↺</Text>
            </TouchableOpacity>
          </View>

          {/* HUD cards */}
          <View style={styles.hudRow}>
            <HudCard
              name={p1Name}
              palette={p1Palette}
              avatar={p1.avatar}
              count={p1Count}
              isActive={currentTurn === 'p1' && !gameOver}
              expiringFirst={p1Expiring}
            />
            <HudCard
              name={p2Name}
              palette={p2Palette}
              avatar={p2.avatar}
              count={p2Count}
              isActive={currentTurn === 'p2' && !gameOver}
              expiringFirst={p2Expiring}
            />
          </View>

          {/* Board */}
          <View style={styles.boardWrap}>
            <GameBoard
              gameState={gameState}
              onCellPress={handleCellPress}
              disabled={isAITurn}
            />
          </View>

          {/* Hint pill */}
          {anyExpiring && !gameOver && (
            <View style={styles.hintPill}>
              <View style={styles.hintDot} />
              <Text style={styles.hintText}>Marked piece slides off next move</Text>
            </View>
          )}
        </View>

        {/* Win overlay */}
        {gameOver && (
          <WinOverlay
            isDraw={isDraw}
            winner={winner}
            winnerPalette={winnerPalette}
            winnerAvatar={winnerAvatar}
            winnerName={winnerName}
            onPlayAgain={resetGame}
            onHome={() => navigation.goBack()}
          />
        )}
      </SkyScene>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  column: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingTop: 10,
    gap: 10,
  },
  roundBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFDF6',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(58,28,99,0.25)',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  roundBtnText: { fontSize: 18, color: '#4A2C6E' },

  turnPill: {
    flex: 1,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
  },
  turnText: {
    fontFamily: Fonts.uiBold,
    fontSize: 14,
    letterSpacing: 0.5,
  },

  hudRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
    marginTop: 12,
  },

  boardWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  hintPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 999,
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.85)',
    marginBottom: 4,
  },
  hintDot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: '#E8960C',
    borderWidth: 1.5,
    borderColor: '#B86F05',
  },
  hintText: {
    fontFamily: Fonts.ui,
    fontSize: 11,
    color: '#5A3E8C',
  },
});
