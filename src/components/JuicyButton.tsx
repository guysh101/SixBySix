import React, { useRef, useState, useCallback } from 'react';
import { Text, View, StyleSheet, Pressable, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BUTTON_COLORS, ButtonVariant, Fonts } from '../theme/colors';

interface Props {
  variant: ButtonVariant;
  label: string;
  subLabel?: string;
  onPress?: () => void;
  style?: object;
}

const DEPTH = 6;

export default function JuicyButton({ variant, label, subLabel, onPress, style }: Props) {
  const c = BUTTON_COLORS[variant];
  const isGhost = variant === 'ghost';
  const pressY = useRef(new Animated.Value(0)).current;
  const [pressed, setPressed] = useState(false);

  const pressIn = useCallback(() => {
    setPressed(true);
    Animated.timing(pressY, { toValue: 4, duration: 70, useNativeDriver: true }).start();
  }, [pressY]);

  const pressOut = useCallback(() => {
    setPressed(false);
    Animated.timing(pressY, { toValue: 0, duration: 100, useNativeDriver: true }).start();
  }, [pressY]);

  const depthNow = pressed ? 2 : DEPTH;

  const gradientColors: [string, string] = isGhost
    ? ['rgba(255,255,255,0.30)', 'rgba(255,255,255,0.16)']
    : [c.hi, c.lo];

  return (
    <Pressable
      onPress={onPress}
      onPressIn={pressIn}
      onPressOut={pressOut}
      style={style}
    >
      <Animated.View
        style={[
          styles.wrapper,
          {
            transform: [{ translateY: pressY }],
            shadowColor: isGhost ? 'rgba(255,255,255,0.6)' : c.deep,
            shadowOffset: { width: 0, height: depthNow },
            shadowOpacity: isGhost ? 0.6 : 1,
            shadowRadius: 0,
            elevation: depthNow,
          },
        ]}
      >
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[styles.surface, isGhost && styles.ghostSurface]}
        >
          {/* top gloss highlight */}
          <View style={styles.gloss} pointerEvents="none" />
          <Text style={styles.labelText}>{label}</Text>
          {subLabel != null && <Text style={styles.subText}>{subLabel}</Text>}
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 20,
  },
  surface: {
    borderRadius: 20,
    paddingTop: 13,
    paddingBottom: 15,
    paddingHorizontal: 24,
    alignItems: 'center',
    overflow: 'hidden',
  },
  ghostSurface: {
    borderWidth: 2.5,
    borderColor: 'rgba(255,255,255,0.65)',
  },
  gloss: {
    position: 'absolute',
    top: 3,
    left: 10,
    right: 10,
    height: '42%',
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.28)',
  },
  labelText: {
    fontFamily: Fonts.uiBold,
    fontSize: 20,
    color: '#FFFFFF',
    letterSpacing: 0.6,
    textShadowColor: 'rgba(0,0,0,0.28)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 0,
    lineHeight: 23,
  },
  subText: {
    fontFamily: Fonts.uiBold,
    fontSize: 12.5,
    color: 'rgba(255,255,255,0.88)',
    textShadowColor: 'rgba(0,0,0,0.18)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 0,
    lineHeight: 14,
  },
});
