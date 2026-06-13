import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, {
  Path, Circle, Ellipse, G, Defs, Stop, Polygon, Rect, Line,
  LinearGradient as SvgLinearGradient,
} from 'react-native-svg';
import { SKY_GRADIENT } from '../theme/colors';

const { width: W } = Dimensions.get('window');
const HILL_H = 200;

interface Props {
  children?: React.ReactNode;
  balloon?: boolean;
  dim?: boolean;
  hillsHeight?: number;
}

// Sunray wedge path (degrees, around cx/cy, radius r)
function rayPath(startDeg: number, endDeg: number, cx: number, cy: number, r: number): string {
  const toRad = (d: number) => (d - 90) * (Math.PI / 180);
  const x1 = cx + r * Math.cos(toRad(startDeg));
  const y1 = cy + r * Math.sin(toRad(startDeg));
  const x2 = cx + r * Math.cos(toRad(endDeg));
  const y2 = cy + r * Math.sin(toRad(endDeg));
  return `M${cx.toFixed(1)},${cy.toFixed(1)} L${x1.toFixed(1)},${y1.toFixed(1)} A${r},${r},0,0,1,${x2.toFixed(1)},${y2.toFixed(1)}Z`;
}

const SUN_CX = 70;
const SUN_CY = 70;
const SUN_RAYS_R = 108;
const SUN_CORE_R = 30;
const SUN_SVG = 140;

const RAY_PATHS = Array.from({ length: 12 }, (_, i) =>
  rayPath(i * 30, i * 30 + 10, SUN_CX, SUN_CY, SUN_RAYS_R)
);

export default function SkyScene({ children, balloon = true, dim = false, hillsHeight = HILL_H }: Props) {
  const sunRot   = useRef(new Animated.Value(0)).current;
  const cloud1X  = useRef(new Animated.Value(0)).current;
  const cloud2X  = useRef(new Animated.Value(0)).current;
  const cloud3X  = useRef(new Animated.Value(0)).current;
  const bird1X   = useRef(new Animated.Value(-110)).current;
  const bird2X   = useRef(new Animated.Value(-110)).current;
  const bird3X   = useRef(new Animated.Value(-110)).current;
  const bird1Y   = useRef(new Animated.Value(0)).current;
  const bird2Y   = useRef(new Animated.Value(0)).current;
  const bird3Y   = useRef(new Animated.Value(0)).current;
  const balloonY = useRef(new Animated.Value(0)).current;
  const sp1      = useRef(new Animated.Value(0.25)).current;
  const sp2      = useRef(new Animated.Value(0.25)).current;
  const sp3      = useRef(new Animated.Value(0.25)).current;

  useEffect(() => {
    const loop = (anim: Animated.CompositeAnimation) => { anim.start(); return anim; };

    const sunAnim = Animated.loop(
      Animated.timing(sunRot, { toValue: 1, duration: 42000, useNativeDriver: true })
    );

    const c1 = Animated.loop(Animated.sequence([
      Animated.timing(cloud1X, { toValue: 18, duration: 8000, useNativeDriver: true }),
      Animated.timing(cloud1X, { toValue: -14, duration: 8000, useNativeDriver: true }),
    ]));
    const c2 = Animated.loop(Animated.sequence([
      Animated.timing(cloud2X, { toValue: -18, duration: 10500, useNativeDriver: true }),
      Animated.timing(cloud2X, { toValue: 14, duration: 10500, useNativeDriver: true }),
    ]));
    const c3 = Animated.loop(Animated.sequence([
      Animated.timing(cloud3X, { toValue: 14, duration: 13000, useNativeDriver: true }),
      Animated.timing(cloud3X, { toValue: -10, duration: 13000, useNativeDriver: true }),
    ]));

    // Birds fly left→right and loop
    const b1 = Animated.loop(
      Animated.timing(bird1X, { toValue: W + 120, duration: 17000, useNativeDriver: true })
    );
    const b2 = Animated.sequence([
      Animated.delay(7000),
      Animated.loop(Animated.timing(bird2X, { toValue: W + 120, duration: 24000, useNativeDriver: true })),
    ]);
    const b3 = Animated.sequence([
      Animated.delay(12000),
      Animated.loop(Animated.timing(bird3X, { toValue: W + 120, duration: 21000, useNativeDriver: true })),
    ]);

    // Birds bob vertically
    const by1 = Animated.loop(Animated.sequence([
      Animated.timing(bird1Y, { toValue: -7, duration: 1050, useNativeDriver: true }),
      Animated.timing(bird1Y, { toValue: 0,  duration: 1050, useNativeDriver: true }),
    ]));
    const by2 = Animated.loop(Animated.sequence([
      Animated.timing(bird2Y, { toValue: -6, duration: 1200, useNativeDriver: true }),
      Animated.timing(bird2Y, { toValue: 0,  duration: 1200, useNativeDriver: true }),
    ]));
    const by3 = Animated.loop(Animated.sequence([
      Animated.timing(bird3Y, { toValue: -5, duration: 950, useNativeDriver: true }),
      Animated.timing(bird3Y, { toValue: 0,  duration: 950, useNativeDriver: true }),
    ]));

    // Balloon bob 4.8s
    const bal = Animated.loop(Animated.sequence([
      Animated.timing(balloonY, { toValue: -8, duration: 2400, useNativeDriver: true }),
      Animated.timing(balloonY, { toValue: 0,  duration: 2400, useNativeDriver: true }),
    ]));

    // Sparkle twinkle
    const sparkle = (v: Animated.Value, delay: number) => Animated.sequence([
      Animated.delay(delay),
      Animated.loop(Animated.sequence([
        Animated.timing(v, { toValue: 1,    duration: 1300, useNativeDriver: true }),
        Animated.timing(v, { toValue: 0.25, duration: 1300, useNativeDriver: true }),
      ])),
    ]);

    const anims = [
      sunAnim, c1, c2, c3,
      b1, b2, b3, by1, by2, by3,
      bal,
      sparkle(sp1, 0), sparkle(sp2, 900), sparkle(sp3, 1700),
    ];

    anims.forEach(a => loop(a));
    return () => anims.forEach(a => a.stop());
  }, []);

  const sunRotDeg = sunRot.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <View style={styles.root}>
      {/* Sky gradient */}
      <LinearGradient colors={SKY_GRADIENT} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={StyleSheet.absoluteFill} />

      {/* Decorative layer — no touches */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">

        {/* Sun */}
        <View style={styles.sunWrap}>
          <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ rotate: sunRotDeg }] }]}>
            <Svg width={SUN_SVG} height={SUN_SVG} style={StyleSheet.absoluteFill}>
              {RAY_PATHS.map((d, i) => (
                <Path key={i} d={d} fill="rgba(255,240,160,0.55)" />
              ))}
            </Svg>
          </Animated.View>
          <Svg width={SUN_SVG} height={SUN_SVG} style={StyleSheet.absoluteFill}>
            <Defs>
              <SvgLinearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor="#FFFBE0" />
                <Stop offset="48%" stopColor="#FFE382" />
                <Stop offset="100%" stopColor="#FFC93C" />
              </SvgLinearGradient>
            </Defs>
            <Circle cx={SUN_CX} cy={SUN_CY} r={SUN_CORE_R} fill="url(#sg)" />
            <Circle cx={SUN_CX} cy={SUN_CY} r={22} fill="rgba(255,251,220,0.45)" />
            <Ellipse cx={SUN_CX - 7} cy={SUN_CY - 9} rx={8} ry={5} fill="rgba(255,255,255,0.5)" />
          </Svg>
        </View>

        {/* Rainbow */}
        <View style={[styles.rainbowWrap, { bottom: hillsHeight - 112 }]}>
          <Svg viewBox="0 0 200 100" width={330} height={165}>
            {(['#FF6253', '#FF9A3C', '#FFD24A', '#7ED957', '#4F9CF7', '#A86CE8'] as const).map((c, i) => {
              const rb = 92 - i * 7;
              return (
                <Path
                  key={c}
                  d={`M ${100 - rb} 100 A ${rb} ${rb} 0 0 1 ${100 + rb} 100`}
                  fill="none"
                  stroke={c}
                  strokeWidth={7.2}
                  opacity={0.55}
                />
              );
            })}
          </Svg>
        </View>

        {/* Clouds */}
        <Animated.View style={[styles.cloud1, { transform: [{ translateX: cloud1X }] }]}>
          <CloudSvg w={118} />
        </Animated.View>
        <Animated.View style={[styles.cloud2, { transform: [{ translateX: cloud2X }] }]}>
          <CloudSvg w={88} />
        </Animated.View>
        <Animated.View style={[styles.cloud3, { transform: [{ translateX: cloud3X }] }]}>
          <CloudSvg w={62} />
        </Animated.View>

        {/* Balloon */}
        {balloon && (
          <Animated.View style={[styles.balloon, { transform: [{ translateY: balloonY }] }]}>
            <BalloonSvg w={54} />
          </Animated.View>
        )}

        {/* Birds */}
        <Animated.View style={[styles.bird1, { transform: [{ translateX: bird1X }, { translateY: bird1Y }] }]}>
          <BirdSvg size={34} color="#FF8A4B" dark="#E06A28" />
        </Animated.View>
        <Animated.View style={[styles.bird2, { transform: [{ translateX: bird2X }, { translateY: bird2Y }] }]}>
          <BirdSvg size={24} color="#FF7DAE" dark="#E0479A" />
        </Animated.View>
        <Animated.View style={[styles.bird3, { transform: [{ translateX: bird3X }, { translateY: bird3Y }] }]}>
          <BirdSvg size={20} color="#6FD3F2" dark="#2391C9" />
        </Animated.View>

        {/* Sparkles */}
        <Animated.View style={[styles.sp1, { opacity: sp1 }]}><SparkleSvg size={16} /></Animated.View>
        <Animated.View style={[styles.sp2, { opacity: sp2 }]}><SparkleSvg size={11} /></Animated.View>
        <Animated.View style={[styles.sp3, { opacity: sp3 }]}><SparkleSvg size={9}  /></Animated.View>

        {/* Hills */}
        <View style={[styles.hillsWrap, { bottom: hillsHeight - HILL_H }]}>
          <Svg viewBox="0 0 390 200" width="100%" height={HILL_H} preserveAspectRatio="none">
            <Defs>
              <SvgLinearGradient id="cpink" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#FFB9E0" />
                <Stop offset="1" stopColor="#E0479A" />
              </SvgLinearGradient>
              <SvgLinearGradient id="cpurp" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#D9B8FF" />
                <Stop offset="1" stopColor="#8A4DD0" />
              </SvgLinearGradient>
            </Defs>

            {/* Back lavender hills */}
            <Path d="M0 86 Q 70 38 150 84 Q 240 128 320 76 Q 360 52 390 72 L390 200 L0 200 Z" fill="#CDB4F2" />
            <Path d="M0 82 Q 70 34 150 80 Q 240 124 320 72 Q 360 48 390 68 L390 78 Q 360 58 322 80 Q 240 132 148 88 Q 70 44 0 92 Z" fill="#E2D3F8" opacity={0.9} />
            <Path d="M0 128 Q 90 66 195 118 Q 300 168 390 110 L390 200 L0 200 Z" fill="#A98BE0" />

            {/* Left tree */}
            <G>
              <Rect x={58} y={122} width={9} height={30} rx={4} fill="#8A5536" />
              <Circle cx={48} cy={116} r={14} fill="#4CB52E" />
              <Circle cx={77} cy={116} r={14} fill="#4CB52E" />
              <Circle cx={62} cy={102} r={19} fill="#5FC93E" />
              <Circle cx={55} cy={97}  r={8}  fill="#9BE874" opacity={0.85} />
              <Circle cx={50} cy={112} r={3}  fill="#FF7DAE" />
              <Circle cx={70} cy={107} r={3}  fill="#FF7DAE" />
              <Circle cx={61} cy={119} r={3}  fill="#FF7DAE" />
            </G>
            {/* Right tree */}
            <G>
              <Rect x={322} y={112} width={8} height={26} rx={4} fill="#8A5536" />
              <Circle cx={315} cy={106} r={12} fill="#4CB52E" />
              <Circle cx={338} cy={106} r={12} fill="#4CB52E" />
              <Circle cx={326} cy={94}  r={16} fill="#5FC93E" />
              <Circle cx={320} cy={90}  r={7}  fill="#9BE874" opacity={0.85} />
            </G>

            {/* Green front hills */}
            <Path d="M0 150 Q 85 106 195 146 Q 300 184 390 138 L390 200 L0 200 Z" fill="#8FDC69" />
            <Path d="M0 146 Q 85 102 195 142 Q 300 180 390 134 L390 144 Q 300 188 193 150 Q 85 112 0 156 Z" fill="#B8F08C" opacity={0.9} />
            <Path d="M0 180 Q 110 140 235 172 Q 330 194 390 166 L390 200 L0 200 Z" fill="#6CC94B" />

            {/* Bushes */}
            <G fill="#3FA72A">
              <Circle cx={258} cy={186} r={11} />
              <Circle cx={272} cy={182} r={9}  />
              <Circle cx={246} cy={182} r={8}  />
            </G>
            <Circle cx={262} cy={178} r={5} fill="#5FC93E" opacity={0.9} />

            {/* Crystals */}
            <Polygon points="28,196 38,148 48,196" fill="url(#cpurp)" stroke="#5A2B8C" strokeWidth={2} />
            <Polygon points="44,196 52,162 62,196" fill="url(#cpink)" stroke="#A8136B" strokeWidth={2} />
            <Polygon points="14,196 21,170 30,196" fill="url(#cpink)" stroke="#A8136B" strokeWidth={1.8} />
            <Line x1={37} y1={158} x2={34} y2={190} stroke="rgba(255,255,255,0.75)" strokeWidth={2.5} strokeLinecap="round" />
            <Line x1={51} y1={170} x2={49} y2={190} stroke="rgba(255,255,255,0.65)" strokeWidth={2}   strokeLinecap="round" />

            {/* Flowers (static in SVG; subtle) */}
            <FlowerInSvg x={108} y={176} c="#FF7DAE" />
            <FlowerInSvg x={152} y={188} c="#FFD24A" />
            <FlowerInSvg x={232} y={180} c="#FFFFFF" />
            <FlowerInSvg x={296} y={192} c="#FF7DAE" />
            <FlowerInSvg x={342} y={184} c="#FFD24A" />

            {/* Grass blades */}
            <G stroke="#2C7F1D" strokeWidth={2.5} strokeLinecap="round">
              <Path d="M126 196 Q 124 188 127 182" fill="none" />
              <Path d="M132 196 Q 133 187 130 181" fill="none" />
              <Path d="M310 196 Q 308 189 311 184" fill="none" />
              <Path d="M316 196 Q 317 188 314 183" fill="none" />
            </G>

            {/* Corner leaves */}
            <G>
              <Path d="M-4 204 Q 2 168 26 158 Q 22 192 2 204 Z"  fill="#2F9D4F" />
              <Path d="M-8 204 Q 6 184 30 184 Q 18 202 -2 206 Z" fill="#3FB55E" />
            </G>
            <G>
              <Path d="M394 204 Q 388 164 362 154 Q 366 190 388 204 Z"  fill="#2F9D4F" />
              <Path d="M398 204 Q 384 182 358 182 Q 372 202 392 206 Z" fill="#3FB55E" />
            </G>
          </Svg>
        </View>
      </View>

      {/* Dim overlay */}
      {dim && (
        <View
          style={[StyleSheet.absoluteFill, styles.dimOverlay]}
          pointerEvents="none"
        />
      )}

      {/* Screen content */}
      {children}
    </View>
  );
}

// ── Inline SVG sub-shapes ──

function FlowerInSvg({ x, y, c }: { x: number; y: number; c: string }) {
  return (
    <G transform={`translate(${x} ${y})`}>
      <Line x1={0} y1={0} x2={0} y2={-13} stroke="#2C7F1D" strokeWidth={2.5} strokeLinecap="round" />
      <G transform="translate(0 -17)">
        <Circle cx={0}    cy={-4.4} r={3.4} fill={c} />
        <Circle cx={4.2}  cy={-1.4} r={3.4} fill={c} />
        <Circle cx={2.6}  cy={3.6}  r={3.4} fill={c} />
        <Circle cx={-2.6} cy={3.6}  r={3.4} fill={c} />
        <Circle cx={-4.2} cy={-1.4} r={3.4} fill={c} />
        <Circle cx={0}    cy={0}    r={2.6} fill="#FFC93C" stroke="#E8960C" strokeWidth={1} />
      </G>
    </G>
  );
}

function CloudSvg({ w }: { w: number }) {
  const h = w * (58 / 130);
  return (
    <Svg viewBox="0 0 130 58" width={w} height={h}>
      <G fill="#FFFFFF">
        <Ellipse cx={34} cy={40} rx={28} ry={17} />
        <Ellipse cx={65} cy={28} rx={27} ry={21} />
        <Ellipse cx={96} cy={40} rx={26} ry={16} />
      </G>
      <G fill="#E2F1FD">
        <Ellipse cx={34} cy={49} rx={25} ry={8} />
        <Ellipse cx={94} cy={49} rx={23} ry={7} />
      </G>
    </Svg>
  );
}

function BirdSvg({ size, color, dark }: { size: number; color: string; dark: string }) {
  return (
    <Svg viewBox="0 0 44 34" width={size} height={size * (34 / 44)}>
      <Polygon points="6,15 15,14 14,21" fill={dark} />
      <Ellipse cx={22} cy={18} rx={12} ry={10.5} fill={color} />
      <Ellipse cx={24} cy={22.5} rx={7} ry={5} fill="#FFEFDC" opacity={0.95} />
      <Polygon points="33,15.5 41.5,18 33,20.5" fill="#FFC93C" />
      <Circle cx={28} cy={14} r={2.3} fill="#3E1F66" />
      <Circle cx={28.9} cy={13.3} r={0.9} fill="#FFFFFF" />
      <Ellipse cx={19} cy={13} rx={9} ry={5.5} fill={dark} rotation={-14} originX={19} originY={13} />
    </Svg>
  );
}

function BalloonSvg({ w }: { w: number }) {
  const h = w * (84 / 60);
  return (
    <Svg viewBox="0 0 60 84" width={w} height={h}>
      <Line x1={15} y1={50} x2={23} y2={66} stroke="#8A5536" strokeWidth={1.6} />
      <Line x1={45} y1={50} x2={37} y2={66} stroke="#8A5536" strokeWidth={1.6} />
      <Path d="M30 2 C 13 2 4 17 4 30 C 4 44 18 52 30 57 C 42 52 56 44 56 30 C 56 17 47 2 30 2 Z" fill="#F23E7C" stroke="#B81E55" strokeWidth={2} />
      <Path d="M30 2 C 24 14 24 45 30 57 C 36 45 36 14 30 2 Z" fill="#FFD24A" />
      <Path d="M14 8 C 8 16 6 24 6.5 31 C 8 40 14 46 20 50 C 14 38 13 18 14 8 Z" fill="#FF7DAE" opacity={0.85} />
      <Path d="M46 8 C 52 16 54 24 53.5 31 C 52 40 46 46 40 50 C 46 38 47 18 46 8 Z" fill="#FF7DAE" opacity={0.85} />
      <Ellipse cx={21} cy={15} rx={5} ry={9} fill="rgba(255,255,255,0.4)" rotation={18} originX={21} originY={15} />
      <Rect x={22} y={64} width={16} height={13} rx={3.5} fill="#C98A4B" stroke="#8A5536" strokeWidth={1.8} />
      <Line x1={22} y1={69} x2={38} y2={69} stroke="#8A5536" strokeWidth={1.2} />
      <Line x1={27} y1={64} x2={27} y2={77} stroke="#8A5536" strokeWidth={1} />
      <Line x1={33} y1={64} x2={33} y2={77} stroke="#8A5536" strokeWidth={1} />
    </Svg>
  );
}

function SparkleSvg({ size }: { size: number }) {
  return (
    <Svg viewBox="0 0 20 20" width={size} height={size}>
      <Path d="M10 0 L12.4 7.6 L20 10 L12.4 12.4 L10 20 L7.6 12.4 L0 10 L7.6 7.6 Z" fill="#FFFFFF" />
    </Svg>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, overflow: 'hidden' },
  sunWrap:     { position: 'absolute', top: -32, left: -28, width: SUN_SVG, height: SUN_SVG },
  rainbowWrap: { position: 'absolute', right: -70 },
  cloud1:  { position: 'absolute', top: 66,  left: 64 },
  cloud2:  { position: 'absolute', top: 142, right: -14 },
  cloud3:  { position: 'absolute', top: 256, left: 22 },
  balloon: { position: 'absolute', top: 168, right: 20 },
  bird1:   { position: 'absolute', top: 96 },
  bird2:   { position: 'absolute', top: 212 },
  bird3:   { position: 'absolute', top: 58 },
  sp1:     { position: 'absolute', top: 92,  right: 64 },
  sp2:     { position: 'absolute', top: 200, left: 46 },
  sp3:     { position: 'absolute', top: 152, left: 128 },
  hillsWrap:   { position: 'absolute', left: 0, right: 0 },
  dimOverlay:  { backgroundColor: 'rgba(52,22,95,0.50)' },
});
