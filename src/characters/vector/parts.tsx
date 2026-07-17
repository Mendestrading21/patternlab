import { G, Ellipse, Circle, Path } from 'react-native-svg';
import type { Expression } from '../types';

// Décalage de pupille (regard) par expression.
const PUPIL: Record<Expression, { dx: number; dy: number }> = {
  happy: { dx: 0, dy: 0 },
  excited: { dx: 0, dy: -1 },
  neutral: { dx: 0, dy: 0 },
  thinking: { dx: 2, dy: -1.5 },
  concerned: { dx: 0, dy: 1 },
  sad: { dx: 0, dy: 1.5 },
};

/** Œil : blanc + pupille (regard selon expression) + reflet. */
export function Eye({ cx, cy, expr, r = 6.5 }: { cx: number; cy: number; expr: Expression; r?: number }) {
  const p = PUPIL[expr];
  return (
    <G>
      <Ellipse cx={cx} cy={cy} rx={r} ry={r * 1.06} fill="#FFFFFF" />
      <Circle cx={cx + p.dx} cy={cy + p.dy} r={r * 0.52} fill="#1F2E38" />
      <Circle cx={cx + p.dx - r * 0.22} cy={cy + p.dy - r * 0.26} r={r * 0.17} fill="#FFFFFF" />
    </G>
  );
}

/** Sourcil : inclinaison selon l'expression (interrogatif / inquiet). */
export function Brow({
  cx,
  cy,
  expr,
  side,
  color,
}: {
  cx: number;
  cy: number;
  expr: Expression;
  side: 'l' | 'r';
  color: string;
}) {
  let rot = 0;
  if (expr === 'thinking') rot = side === 'l' ? -16 : -4;
  else if (expr === 'concerned' || expr === 'sad') rot = side === 'l' ? 18 : -18;
  else if (expr === 'excited') rot = side === 'l' ? -6 : 6;
  const w = 8;
  const curve = expr === 'sad' || expr === 'concerned' ? 1.6 : -2.2;
  return (
    <Path
      d={`M${cx - w / 2} ${cy} q ${w / 2} ${curve} ${w} 0`}
      stroke={color}
      strokeWidth={2.4}
      strokeLinecap="round"
      fill="none"
      transform={`rotate(${rot} ${cx} ${cy})`}
    />
  );
}

/** Bouche : forme selon l'expression. */
export function Mouth({
  cx,
  cy,
  expr,
  color = '#7A3B2E',
}: {
  cx: number;
  cy: number;
  expr: Expression;
  color?: string;
}) {
  let d: string;
  switch (expr) {
    case 'excited':
      d = `M${cx - 9} ${cy} q ${9} ${9} ${18} 0`;
      break;
    case 'happy':
      d = `M${cx - 7} ${cy} q ${7} ${6} ${14} 0`;
      break;
    case 'thinking':
      d = `M${cx - 4} ${cy + 1} q ${4} ${2} ${8} 0`;
      break;
    case 'concerned':
      d = `M${cx - 5} ${cy + 1} q ${5} ${1} ${10} 0`;
      break;
    case 'sad':
      d = `M${cx - 6} ${cy + 3} q ${6} ${-4.5} ${12} 0`;
      break;
    case 'neutral':
    default:
      d = `M${cx - 6} ${cy} q ${6} ${3.5} ${12} 0`;
  }
  return <Path d={d} stroke={color} strokeWidth={2.4} strokeLinecap="round" fill="none" />;
}
