import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
}

export default function Capsule({ children, style }: Props) {
  return (
    <LinearGradient
      colors={['#FFFEFA', '#FFF3DC']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={[styles.capsule, style]}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  capsule: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
    borderRadius: 22,
    shadowColor: '#BA8A40',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 1,
    elevation: 6,
  },
});
