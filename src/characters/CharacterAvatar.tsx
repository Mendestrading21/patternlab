import Svg, { Circle, Ellipse, G, Path } from 'react-native-svg';
import { palette } from '../design-system/tokens';
import type { CharacterId, CharacterState, Expression } from './types';
import { STATE_TO_EXPRESSION } from './types';

export type CharacterAvatarProps = {
  character: CharacterId;
  state?: CharacterState;
  size?: number;
};

/**
 * Avatar SVG stylisé de P0.1 (placeholder maîtrisé, fidèle aux planches : taureau vert / ours rouge).
 * L'art Lottie définitif remplacera ce rendu via le CharacterAnimationController (voir ADR-005).
 */
export function CharacterAvatar({ character, state = 'idle', size = 96 }: CharacterAvatarProps) {
  const expr = STATE_TO_EXPRESSION[state];
  const isToto = character === 'toto';
  const skin = isToto ? palette.green : palette.red;
  const skinDark = isToto ? palette.greenDim : '#9E332C';
  const muzzle = isToto ? '#BFE6C4' : '#E0A878';

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      accessibilityLabel={isToto ? 'Toto, le taureau vert' : 'Bobo, l’ours rouge'}
    >
      {isToto ? (
        <>
          {/* cornes crème */}
          <Path d="M24 34 C12 26 12 14 20 12 C22 20 28 26 33 30 Z" fill="#EFE7CE" />
          <Path d="M76 34 C88 26 88 14 80 12 C78 20 72 26 67 30 Z" fill="#EFE7CE" />
          {/* oreilles */}
          <Ellipse cx="22" cy="46" rx="9" ry="6" fill={skinDark} />
          <Ellipse cx="78" cy="46" rx="9" ry="6" fill={skinDark} />
        </>
      ) : (
        <>
          {/* oreilles rondes */}
          <Circle cx="26" cy="26" r="12" fill={skin} />
          <Circle cx="74" cy="26" r="12" fill={skin} />
          <Circle cx="26" cy="26" r="6" fill={skinDark} />
          <Circle cx="74" cy="26" r="6" fill={skinDark} />
        </>
      )}

      {/* tête */}
      <Circle cx="50" cy="52" r="30" fill={skin} />
      {/* museau */}
      <Ellipse cx="50" cy="62" rx="17" ry="12" fill={muzzle} />
      <Ellipse cx="44" cy="60" rx="1.8" ry="2.6" fill={skinDark} />
      <Ellipse cx="56" cy="60" rx="1.8" ry="2.6" fill={skinDark} />

      <Eyes expr={expr} />
      <Mouth expr={expr} isToto={isToto} />
    </Svg>
  );
}

function Eyes({ expr }: { expr: Expression }) {
  const r = expr === 'excited' ? 6.4 : 5.4;
  const white = '#FFFFFF';
  const pupil = '#141414';
  const pupilR = expr === 'excited' ? 3.2 : 2.7;
  return (
    <G>
      <Circle cx="40" cy="47" r={r} fill={white} />
      <Circle cx="60" cy="47" r={r} fill={white} />
      <Circle cx={expr === 'thinking' ? 41.5 : 40} cy="47" r={pupilR} fill={pupil} />
      <Circle cx={expr === 'thinking' ? 61.5 : 60} cy="47" r={pupilR} fill={pupil} />
      {(expr === 'concerned' || expr === 'sad') && (
        <G stroke="#141414" strokeWidth={2.2} strokeLinecap="round">
          <Path d="M34 40 L45 43" />
          <Path d="M66 40 L55 43" />
        </G>
      )}
    </G>
  );
}

function Mouth({ expr, isToto }: { expr: Expression; isToto: boolean }) {
  const stroke = isToto ? '#0A3D1C' : '#6E241E';
  const common = { stroke, strokeWidth: 2.6, strokeLinecap: 'round' as const, fill: 'none' };
  switch (expr) {
    case 'excited':
      return <Path d="M42 66 Q50 76 58 66 Q50 70 42 66 Z" fill={stroke} />;
    case 'happy':
      return <Path d="M43 67 Q50 73 57 67" {...common} />;
    case 'sad':
      return <Path d="M43 71 Q50 65 57 71" {...common} />;
    case 'concerned':
      return <Path d="M44 70 Q50 68 56 70" {...common} />;
    case 'thinking':
      return <Path d="M46 69 L54 69" {...common} />;
    default:
      return <Path d="M45 68 Q50 70 55 68" {...common} />;
  }
}
