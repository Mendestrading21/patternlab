import Svg, { Defs, LinearGradient, Stop, Path, Ellipse, G } from 'react-native-svg';
import type { StyleProp, ViewStyle } from 'react-native';
import type { Expression } from '../types';
import { Eye, Brow, Mouth } from './parts';

export type VectorFaceProps = {
  size?: number;
  expression?: Expression;
  style?: StyleProp<ViewStyle>;
};

/** Toto — taureau vert, dessiné en SVG (net à toute taille). */
export function Toto({ size = 96, expression = 'neutral', style }: VectorFaceProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" style={style}>
      <Defs>
        <LinearGradient id="totoHead" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#4FDA86" />
          <Stop offset="0.55" stopColor="#2FB35C" />
          <Stop offset="1" stopColor="#1B7A3C" />
        </LinearGradient>
        <LinearGradient id="totoHorn" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#F6EDCC" />
          <Stop offset="1" stopColor="#D6BF82" />
        </LinearGradient>
        <LinearGradient id="totoMuzzle" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#A2EAB5" />
          <Stop offset="1" stopColor="#6FCD8A" />
        </LinearGradient>
      </Defs>

      {/* Cornes */}
      <Path d="M30 35 Q16 24 13 8 Q26 17 39 31 Z" fill="url(#totoHorn)" stroke="#C7AE6F" strokeWidth="0.6" strokeLinejoin="round" />
      <Path d="M70 35 Q84 24 87 8 Q74 17 61 31 Z" fill="url(#totoHorn)" stroke="#C7AE6F" strokeWidth="0.6" strokeLinejoin="round" />

      {/* Oreilles */}
      <Ellipse cx="19" cy="47" rx="8" ry="5" fill="#279B4F" transform="rotate(-22 19 47)" />
      <Ellipse cx="81" cy="47" rx="8" ry="5" fill="#279B4F" transform="rotate(22 81 47)" />

      {/* Tête */}
      <Ellipse cx="50" cy="55" rx="33" ry="31" fill="url(#totoHead)" />
      {/* Reflet */}
      <Ellipse cx="38" cy="40" rx="13" ry="9" fill="#FFFFFF" opacity="0.12" />
      {/* Touffe de crin */}
      <Path d="M43 27 C46 20 54 20 57 27 C53 24 47 24 43 27 Z" fill="#166B34" />

      {/* Museau */}
      <Ellipse cx="50" cy="67" rx="20" ry="14" fill="url(#totoMuzzle)" />
      <Ellipse cx="43" cy="66" rx="2.3" ry="2.9" fill="#3C9E64" />
      <Ellipse cx="57" cy="66" rx="2.3" ry="2.9" fill="#3C9E64" />

      {/* Sourcils / yeux / bouche */}
      <G>
        <Brow cx={39} cy={40} expr={expression} side="l" color="#12592C" />
        <Brow cx={61} cy={40} expr={expression} side="r" color="#12592C" />
        <Eye cx={39} cy={49} expr={expression} />
        <Eye cx={61} cy={49} expr={expression} />
        <Mouth cx={50} cy={72} expr={expression} color="#2C6E3E" />
      </G>
    </Svg>
  );
}
