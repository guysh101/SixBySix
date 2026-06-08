import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PlayerProfile, getSkin } from '../types/profile';

interface Props {
  profile: PlayerProfile;
  size?: number;
}

export default function AvatarBadge({ profile, size = 60 }: Props) {
  const skin = getSkin(profile.activeSkinId);
  const fontSize = size * 0.42;
  const borderRadius = size / 2;

  return (
    <LinearGradient
      colors={skin.colors}
      style={[styles.badge, { width: size, height: size, borderRadius }]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={[styles.inner, { borderRadius }]}>
        <Text style={[styles.initial, { fontSize }]}>
          {profile.name.trim()[0]?.toUpperCase() ?? '?'}
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  badge: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  inner: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initial: {
    fontFamily: 'Orbitron_900Black',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
});
