import Svg, { Defs, LinearGradient, Stop, Ellipse, Circle, G } from 'react-native-svg';
import { Eye, Brow, Mouth } from './parts';
import type { VectorFaceProps } from './Toto';

/** Bobo — ours rouge, dessiné en SVG (net à toute taille). */
export function Bobo({ size = 96, expression = 'neutral', style }: VectorFaceProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" style={style}>
      <Defs>
        <LinearGradient id="boboHead" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#E86A5F" />
          <Stop offset="0.55" stopColor="#D0453C" />
          <Stop offset="1" stopColor="#9E2E28" />
        </LinearGradient>
        <LinearGradient id="boboMuzzle" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#F2C79B" />
          <Stop offset="1" stopColor="#E0A574" />
        </LinearGradient>
      </Defs>

      {/* Oreilles */}
      <Circle cx="25" cy="27" r="12" fill="url(#boboHead)" />
      <Circle cx="75" cy="27" r="12" fill="url(#boboHead)" />
      <Circle cx="25" cy="27" r="6" fill="#9E2E28" />
      <Circle cx="75" cy="27" r="6" fill="#9E2E28" />

      {/* Tête */}
      <Ellipse cx="50" cy="54" rx="33" ry="31" fill="url(#boboHead)" />
      {/* Reflet */}
      <Ellipse cx="38" cy="39" rx="13" ry="9" fill="#FFFFFF" opacity="0.12" />

      {/* Museau */}
      <Ellipse cx="50" cy="64" rx="18" ry="14" fill="url(#boboMuzzle)" />
      {/* Truffe */}
      <Ellipse cx="50" cy="57" rx="4.6" ry="3.4" fill="#4A2A1E" />

      {/* Sourcils / yeux / bouche */}
      <G>
        <Brow cx={39} cy={40} expr={expression} side="l" color="#7E2620" />
        <Brow cx={61} cy={40} expr={expression} side="r" color="#7E2620" />
        <Eye cx={39} cy={48} expr={expression} />
        <Eye cx={61} cy={48} expr={expression} />
        <Mouth cx={50} cy={66} expr={expression} color="#5A2A20" />
      </G>
    </Svg>
  );
}
