import React from 'react';
import { View } from 'react-native';
import { AvatarConfig } from '../types/profile';

interface Props {
  config: AvatarConfig;
  size: number;
}

export default function AvatarFace({ config, size }: Props) {
  const { eyeStyle, mouthStyle } = config;
  const s = size / 40;

  const leftEyeX = size * 0.32;
  const rightEyeX = size * 0.68;
  const eyeTopY = size * 0.36;
  const mouthCX = size * 0.5;
  const mouthTopY = size * 0.60;

  const white = 'rgba(255,255,255,0.92)';
  const bw = Math.max(1.5, 2 * s);

  // --- Eyes ---
  const eyes: React.ReactNode[] = [];

  if (eyeStyle === 0) {
    // Simple dots
    const r = Math.max(2, 3.5 * s);
    eyes.push(
      <View key="le" style={{ position: 'absolute', width: r * 2, height: r * 2, borderRadius: r, backgroundColor: white, left: leftEyeX - r, top: eyeTopY - r }} />,
      <View key="re" style={{ position: 'absolute', width: r * 2, height: r * 2, borderRadius: r, backgroundColor: white, left: rightEyeX - r, top: eyeTopY - r }} />,
    );
  } else if (eyeStyle === 1) {
    // Big surprised circles
    const r = Math.max(3, 5 * s);
    eyes.push(
      <View key="le" style={{ position: 'absolute', width: r * 2, height: r * 2, borderRadius: r, backgroundColor: white, left: leftEyeX - r, top: eyeTopY - r }} />,
      <View key="re" style={{ position: 'absolute', width: r * 2, height: r * 2, borderRadius: r, backgroundColor: white, left: rightEyeX - r, top: eyeTopY - r }} />,
    );
  } else if (eyeStyle === 2) {
    // Horizontal bars — cool/squint
    const w = Math.max(7, 9 * s);
    const h = Math.max(2, 2.5 * s);
    eyes.push(
      <View key="le" style={{ position: 'absolute', width: w, height: h, borderRadius: h / 2, backgroundColor: white, left: leftEyeX - w / 2, top: eyeTopY - h / 2 }} />,
      <View key="re" style={{ position: 'absolute', width: w, height: h, borderRadius: h / 2, backgroundColor: white, left: rightEyeX - w / 2, top: eyeTopY - h / 2 }} />,
    );
  } else {
    // Wink: left = dot, right = line
    const r = Math.max(2.5, 4 * s);
    const lw = Math.max(6, 8 * s);
    const lh = Math.max(1.5, 2 * s);
    eyes.push(
      <View key="le" style={{ position: 'absolute', width: r * 2, height: r * 2, borderRadius: r, backgroundColor: white, left: leftEyeX - r, top: eyeTopY - r }} />,
      <View key="re" style={{ position: 'absolute', width: lw, height: lh, borderRadius: lh / 2, backgroundColor: white, left: rightEyeX - lw / 2, top: eyeTopY - lh / 2 }} />,
    );
  }

  // --- Mouth ---
  let mouth: React.ReactNode;
  const mw = Math.max(10, 14 * s);
  const mh = Math.max(4, 6 * s);

  if (mouthStyle === 0) {
    // Smile
    mouth = (
      <View style={{
        position: 'absolute',
        left: mouthCX - mw / 2,
        top: mouthTopY,
        width: mw,
        height: mh,
        borderBottomLeftRadius: mh,
        borderBottomRightRadius: mh,
        borderColor: white,
        borderBottomWidth: bw,
        borderLeftWidth: bw,
        borderRightWidth: bw,
        borderTopWidth: 0,
      }} />
    );
  } else if (mouthStyle === 1) {
    // Smirk (asymmetric half-curve offset right)
    const sw = Math.max(8, 10 * s);
    const sh = Math.max(3, 5 * s);
    mouth = (
      <View style={{
        position: 'absolute',
        left: mouthCX - sw / 3,
        top: mouthTopY,
        width: sw,
        height: sh,
        borderBottomLeftRadius: sh,
        borderBottomRightRadius: 1,
        borderColor: white,
        borderBottomWidth: bw,
        borderLeftWidth: bw,
        borderRightWidth: bw * 0.3,
        borderTopWidth: 0,
      }} />
    );
  } else if (mouthStyle === 2) {
    // Open mouth — filled oval
    const ow = Math.max(6, 8 * s);
    const oh = Math.max(4, 6 * s);
    mouth = (
      <View style={{
        position: 'absolute',
        left: mouthCX - ow / 2,
        top: mouthTopY,
        width: ow,
        height: oh,
        borderRadius: Math.min(ow, oh) / 2,
        backgroundColor: white,
      }} />
    );
  } else {
    // Frown
    mouth = (
      <View style={{
        position: 'absolute',
        left: mouthCX - mw / 2,
        top: mouthTopY - mh / 2,
        width: mw,
        height: mh,
        borderTopLeftRadius: mh,
        borderTopRightRadius: mh,
        borderColor: white,
        borderTopWidth: bw,
        borderLeftWidth: bw,
        borderRightWidth: bw,
        borderBottomWidth: 0,
      }} />
    );
  }

  return (
    <View style={{ width: size, height: size, position: 'absolute' }} pointerEvents="none">
      {eyes}
      {mouth}
    </View>
  );
}
