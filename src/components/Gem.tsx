import React, { useRef, useEffect } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import Svg, { Circle, Ellipse, Defs, RadialGradient, Stop } from 'react-native-svg';
import { GemPalette } from '../theme/colors';
import { AvatarConfig } from '../types/profile';
import AvatarFace from './AvatarFace';

interface Props {
  palette: GemPalette;
  size: number;
  avatar?: AvatarConfig;
  expiring?: boolean;
}

export default function Gem({ palette, size, avatar, expiring = false }: Props) {
  const wobbleAnim = useRef(new Animated.Value(0)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;
  const blinkAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!expiring) {
      wobbleAnim.stopAnimation();
      spinAnim.stopAnimation();
      blinkAnim.stopAnimation();
      wobbleAnim.setValue(0);
      spinAnim.setValue(0);
      blinkAnim.setValue(1);
      return;
    }

    const wobble = Animated.loop(
      Animated.sequence([
        Animated.timing(wobbleAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
        Animated.timing(wobbleAnim, { toValue: 0, duration: 350, useNativeDriver: true }),
      ])
    );
    const spin = Animated.loop(
      Animated.timing(spinAnim, { toValue: 1, duration: 7000, useNativeDriver: true })
    );
    const blink = Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, { toValue: 0.25, duration: 450, useNativeDriver: true }),
        Animated.timing(blinkAnim, { toValue: 0.95, duration: 450, useNativeDriver: true }),
      ])
    );

    wobble.start();
    spin.start();
    blink.start();

    return () => {
      wobble.stop();
      spin.stop();
      blink.stop();
    };
  }, [expiring]);

  const wobbleRotate = wobbleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-5deg', '5deg'],
  });
  const spinRotate = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const bw = Math.max(2, size * 0.06);
  const cx = size / 2;
  const cy = size / 2;
  const r = cx - bw / 2;

  // Dashed ring sits 8px outside the gem
  const ringPad = 8;
  const ringSize = size + ringPad * 2;
  const ringCx = ringSize / 2;
  const ringR = ringCx - 2;
  const circumference = 2 * Math.PI * ringR;
  const dash = circumference * 0.18;
  const gap = circumference * 0.07;

  const faceSize = size * 0.86;
  const faceOffset = (size - faceSize) / 2;

  return (
    <Animated.View
      style={[
        { width: size, height: size },
        expiring && {
          opacity: 0.62,
          transform: [{ rotate: wobbleRotate }],
        },
      ]}
    >
      {/* Gem body SVG */}
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient
            id="gg"
            cx={cx * 0.66}
            cy={cy * 0.54}
            r={size * 0.8}
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0%" stopColor={palette.light} />
            <Stop offset="46%" stopColor={palette.mid} />
            <Stop offset="100%" stopColor={palette.deep} />
          </RadialGradient>
        </Defs>
        {/* Main gem circle */}
        <Circle
          cx={cx}
          cy={cy}
          r={r}
          fill="url(#gg)"
          stroke={palette.outline}
          strokeWidth={bw}
        />
        {/* Inner shadow (dark bottom arc) */}
        <Circle
          cx={cx}
          cy={cy + size * 0.06}
          r={r * 0.88}
          fill="none"
          stroke="rgba(0,0,0,0.22)"
          strokeWidth={size * 0.1}
        />
        {/* White gloss top-left ellipse */}
        <Ellipse
          cx={size * 0.38}
          cy={size * 0.27}
          rx={size * 0.15}
          ry={size * 0.08}
          fill="rgba(255,255,255,0.85)"
          rotation={-24}
          originX={size * 0.38}
          originY={size * 0.27}
        />
        {/* Small gloss dot */}
        <Circle
          cx={size * 0.16}
          cy={size * 0.34}
          r={size * 0.04}
          fill="rgba(255,255,255,0.70)"
        />
      </Svg>

      {/* Avatar face */}
      {avatar && (
        <View
          style={{
            position: 'absolute',
            top: faceOffset,
            left: faceOffset,
            width: faceSize,
            height: faceSize,
          }}
          pointerEvents="none"
        >
          <AvatarFace config={avatar} size={faceSize} />
        </View>
      )}

      {/* Expiring dashed spinning ring */}
      {expiring && (
        <Animated.View
          style={{
            position: 'absolute',
            top: -ringPad,
            left: -ringPad,
            width: ringSize,
            height: ringSize,
            opacity: blinkAnim,
            transform: [{ rotate: spinRotate }],
          }}
          pointerEvents="none"
        >
          <Svg width={ringSize} height={ringSize}>
            <Circle
              cx={ringCx}
              cy={ringCx}
              r={ringR}
              fill="none"
              stroke="rgba(255,255,255,0.95)"
              strokeWidth={3}
              strokeDasharray={`${dash} ${gap}`}
            />
          </Svg>
        </Animated.View>
      )}
    </Animated.View>
  );
}
