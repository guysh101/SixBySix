import React from 'react';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PlayerProfile, getSkin } from '../types/profile';
import AvatarFace from './AvatarFace';

interface Props {
  profile: PlayerProfile;
  size?: number;
}

export default function AvatarBadge({ profile, size = 60 }: Props) {
  const skin = getSkin(profile.activeSkinId);
  const borderRadius = size / 2;

  return (
    <View style={{ width: size, height: size }}>
      <LinearGradient
        colors={skin.colors}
        style={{ width: size, height: size, borderRadius, justifyContent: 'center', alignItems: 'center' }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <AvatarFace config={profile.avatar} size={size} />
    </View>
  );
}
