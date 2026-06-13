import React, { useRef, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
  TouchableOpacity, Animated,
} from 'react-native';
import Svg, { Polygon, Defs, LinearGradient as SvgLG, Stop, Text as SvgText } from 'react-native-svg';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useGameStore } from '../store/gameStore';
import { useProfileStore } from '../store/profileStore';
import { getSkinGemPalette, GEM_PALETTES, Fonts } from '../theme/colors';
import SkyScene from '../components/SkyScene';
import Gem from '../components/Gem';
import JuicyButton from '../components/JuicyButton';
import Ribbon from '../components/Ribbon';
import Capsule from '../components/Capsule';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

// 12-pointed star polygon points (centered at 30,30 in 60×60 viewBox)
const VS_STAR_POINTS = (() => {
  const n = 12;
  const pts: string[] = [];
  for (let i = 0; i < n * 2; i++) {
    const ang = (Math.PI * i) / n - Math.PI / 2;
    const r   = i % 2 === 0 ? 27 : 20;
    pts.push(`${(30 + r * Math.cos(ang)).toFixed(1)},${(30 + r * Math.sin(ang)).toFixed(1)}`);
  }
  return pts.join(' ');
})();

function VsBadge() {
  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.05, duration: 1100, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1,    duration: 1100, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);
  return (
    <Animated.View style={[styles.vsBadge, { transform: [{ scale: pulse }] }]}>
      <Svg viewBox="0 0 60 60" width={52} height={52}>
        <Polygon points={VS_STAR_POINTS} fill="#FFC93C" stroke="#E8960C" strokeWidth={2.5} />
      </Svg>
      <Text style={styles.vsText}>VS</Text>
    </Animated.View>
  );
}

export default function HomeScreen({ navigation }: Props) {
  const { setGameMode, resetGame } = useGameStore();
  const { p1, p2 } = useProfileStore();

  // Logo bob + tilt
  const logoBob = useRef(new Animated.Value(0)).current;
  // Decorative gem bobs
  const gem1Bob = useRef(new Animated.Value(0)).current;
  const gem2Bob = useRef(new Animated.Value(0)).current;
  const gem3Bob = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const makeBob = (v: Animated.Value, dur: number, delay = 0) =>
      Animated.sequence([
        Animated.delay(delay),
        Animated.loop(
          Animated.sequence([
            Animated.timing(v, { toValue: 1, duration: dur / 2, useNativeDriver: true }),
            Animated.timing(v, { toValue: 0, duration: dur / 2, useNativeDriver: true }),
          ])
        ),
      ]);

    const anims = [
      makeBob(logoBob, 3400),
      makeBob(gem1Bob, 3800),
      makeBob(gem2Bob, 4600, 800),
      makeBob(gem3Bob, 4200, 1600),
    ];
    anims.forEach(a => a.start());
    return () => anims.forEach(a => a.stop());
  }, []);

  const logoBobY = logoBob.interpolate({ inputRange: [0, 1], outputRange: [0, -8] });
  const gem1Y    = gem1Bob.interpolate({ inputRange: [0, 1], outputRange: [0, -7] });
  const gem2Y    = gem2Bob.interpolate({ inputRange: [0, 1], outputRange: [0, -7] });
  const gem3Y    = gem3Bob.interpolate({ inputRange: [0, 1], outputRange: [0, -6] });

  const startGame = useCallback((mode: 'pass-and-play' | 'vs-ai') => {
    setGameMode(mode);
    resetGame();
    navigation.navigate('Game');
  }, [setGameMode, resetGame, navigation]);

  const p1Palette = getSkinGemPalette(p1.activeSkinId);
  const p2Palette = getSkinGemPalette(p2.activeSkinId);

  return (
    <SafeAreaView style={styles.root}>
      <SkyScene balloon>
        {/* Decorative floating gems */}
        <Animated.View style={[styles.decGem1, { transform: [{ translateY: gem1Y }] }]}>
          <Gem palette={GEM_PALETTES.gold}   size={30} />
        </Animated.View>
        <Animated.View style={[styles.decGem2, { transform: [{ translateY: gem2Y }] }]}>
          <Gem palette={GEM_PALETTES.galaxy} size={24} />
        </Animated.View>
        <Animated.View style={[styles.decGem3, { transform: [{ translateY: gem3Y }] }]}>
          <Gem palette={GEM_PALETTES.green}  size={20} />
        </Animated.View>

        {/* Main content column */}
        <View style={styles.content}>
          {/* Logo */}
          <Animated.View style={[styles.logoWrap, { transform: [{ rotate: '-3deg' }, { translateY: logoBobY }] }]}>
            <Text style={styles.logoText}>DRIFT</Text>
          </Animated.View>

          {/* Subtitle ribbon */}
          <Ribbon
            variant="pink"
            fontSize={14}
            letterSpacing={2.5}
            style={{ marginTop: 10 }}
          >
            SLIDING TIC·TAC·TOE
          </Ribbon>

          {/* Player row */}
          <View style={styles.playerRow}>
            {/* P1 Capsule */}
            <TouchableOpacity
              style={styles.capsuleTouch}
              onPress={() => navigation.navigate('Profile', { playerSlot: 'p1' })}
              activeOpacity={0.85}
            >
              <Capsule style={styles.playerCapsule}>
                <Gem palette={p1Palette} size={54} avatar={p1.avatar} />
                <Text style={styles.playerName} numberOfLines={1}>{p1.name}</Text>
                <View style={styles.editPill}><Text style={styles.editPillText}>EDIT ✎</Text></View>
              </Capsule>
            </TouchableOpacity>

            <VsBadge />

            {/* P2 Capsule */}
            <TouchableOpacity
              style={styles.capsuleTouch}
              onPress={() => navigation.navigate('Profile', { playerSlot: 'p2' })}
              activeOpacity={0.85}
            >
              <Capsule style={styles.playerCapsule}>
                <Gem palette={p2Palette} size={54} avatar={p2.avatar} />
                <Text style={styles.playerName} numberOfLines={1}>{p2.name}</Text>
                <View style={styles.editPill}><Text style={styles.editPillText}>EDIT ✎</Text></View>
              </Capsule>
            </TouchableOpacity>
          </View>

          {/* Play buttons */}
          <JuicyButton
            variant="pink"
            label="PLAY WITH A FRIEND"
            subLabel="same device"
            onPress={() => startGame('pass-and-play')}
            style={styles.btn}
          />
          <JuicyButton
            variant="blue"
            label="PLAY VS ROBOT"
            subLabel="challenge the AI"
            onPress={() => startGame('vs-ai')}
            style={[styles.btn, { marginTop: 14 }]}
          />

          {/* How to play pill */}
          <View style={styles.howToWrap}>
            <View style={styles.qChip}>
              <Text style={styles.qText}>?</Text>
            </View>
            <Text style={styles.howToText}>How to play</Text>
          </View>
        </View>
      </SkyScene>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  decGem1: { position: 'absolute', top: 154, left: 26,  opacity: 0.9  },
  decGem2: { position: 'absolute', top: 96,  right: 38, opacity: 0.85 },
  decGem3: { position: 'absolute', top: 286, right: 84, opacity: 0.8  },

  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 26,
    paddingBottom: 30,
  },

  logoWrap: { marginTop: 86 },
  logoText: {
    fontFamily: Fonts.display,
    fontSize: 82,
    color: '#4A2C6E',
    letterSpacing: 4,
    textShadowColor: '#FFFFFF',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 8,
  },

  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 52,
    gap: 10,
  },
  capsuleTouch: { flex: 1 },
  playerCapsule: { alignItems: 'center', paddingVertical: 14, paddingHorizontal: 8, gap: 6 },
  playerName: {
    fontFamily: Fonts.uiBold,
    fontSize: 15,
    color: '#4A2C6E',
    textAlign: 'center',
  },
  editPill: {
    backgroundColor: 'rgba(122,77,184,0.10)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  editPillText: {
    fontFamily: Fonts.uiBold,
    fontSize: 10.5,
    letterSpacing: 1,
    color: '#B08FD8',
  },

  vsBadge: {
    width: 52,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vsText: {
    position: 'absolute',
    fontFamily: Fonts.display,
    fontSize: 17,
    color: '#8A4D00',
    textShadowColor: 'rgba(255,255,255,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 0,
  },

  btn: { width: '100%', marginTop: 30 },

  howToWrap: {
    marginTop: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.8)',
    borderRadius: 999,
    paddingVertical: 6,
    paddingLeft: 8,
    paddingRight: 16,
    shadowColor: 'rgba(127,86,178,0.2)',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  qChip: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#7647BE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qText: { color: '#fff', fontSize: 13, fontFamily: Fonts.uiBold },
  howToText: {
    fontFamily: Fonts.uiBold,
    fontSize: 13,
    color: '#5A3E8C',
  },
});
