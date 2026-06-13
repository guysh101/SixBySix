import React from 'react';
import { Text, View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Fonts } from '../theme/colors';

interface Props {
  children: string;
  variant?: 'pink' | 'gold';
  fontSize?: number;
  letterSpacing?: number;
  style?: ViewStyle;
}

const VARIANTS = {
  pink: { hi: '#FF7DAE', lo: '#F23E7C', deep: '#B81E55' },
  gold: { hi: '#FFD955', lo: '#FFA31A', deep: '#C26E05' },
};

export default function Ribbon({
  children,
  variant = 'pink',
  fontSize = 14,
  letterSpacing = 2.5,
  style,
}: Props) {
  const c = VARIANTS[variant];
  return (
    <View style={[styles.wrapper, style]}>
      {/* 3D base */}
      <View style={[StyleSheet.absoluteFill, styles.base, { backgroundColor: c.deep }]} />
      {/* Surface */}
      <LinearGradient
        colors={[c.hi, c.lo]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.surface}
      >
        <Text style={[styles.text, { fontSize, letterSpacing }]}>{children}</Text>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: 'center',
    // extra bottom padding to show the 3D base
    paddingBottom: 5,
  },
  base: {
    top: 5, // shift down so only bottom 5px peek out under surface
    borderRadius: 10,
  },
  surface: {
    paddingHorizontal: 26,
    paddingTop: 8,
    paddingBottom: 10,
    borderRadius: 10,
    shadowColor: 'rgba(58,28,99,0.30)',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 8,
  },
  text: {
    fontFamily: Fonts.display,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 1,
  },
});
