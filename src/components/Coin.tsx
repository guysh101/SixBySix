import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

interface Props {
  size?: number;
}

export default function Coin({ size = 28 }: Props) {
  const r = size / 2;
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Defs>
          <RadialGradient
            id="cg"
            cx={r * 0.7}
            cy={r * 0.56}
            r={r * 1.2}
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0%" stopColor="#FFEC9C" />
            <Stop offset="52%" stopColor="#FFC93C" />
            <Stop offset="100%" stopColor="#E8960C" />
          </RadialGradient>
        </Defs>
        <Circle
          cx={r}
          cy={r}
          r={r - 1}
          fill="url(#cg)"
          stroke="#C77B07"
          strokeWidth={2}
        />
        {/* inner shadow ring */}
        <Circle
          cx={r}
          cy={r + 1}
          r={r - 3}
          fill="none"
          stroke="rgba(0,0,0,0.14)"
          strokeWidth={1.5}
        />
        {/* highlight dot top-left */}
        <Circle
          cx={r * 0.62}
          cy={r * 0.52}
          r={r * 0.18}
          fill="rgba(255,255,255,0.7)"
        />
      </Svg>
    </View>
  );
}
