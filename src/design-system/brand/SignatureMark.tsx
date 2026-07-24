import Svg, { Line, Rect, Polyline, Circle } from 'react-native-svg';
import { theme } from '../theme';
import { decorative as decorativeA11y } from '../a11y';

/**
 * Signature géométrique Trademy (LOT 4) — motif ORIGINAL dérivé de la géométrie d'un chandelier :
 * un rythme ascendant de trois corps (avec mèches) qui converge vers un POINT DE CONFIRMATION, relié
 * par une fine trajectoire de progression. Il évoque « comprendre la structure » sans imiter un cours
 * réel, et n'a AUCUN rapport avec l'« alphabet chandelier » des références (aucune lettre, aucune copie).
 *
 * Usage : séparateur discret, accent d'en-tête, gabarit de badge. Décoratif par défaut (masqué aux
 * lecteurs d'écran car il accompagne un titre) ; fournir `title` pour un usage autonome.
 * La couleur est TOKENISÉE et héritée : `color` = corps (marque), `accent` = trajectoire + confirmation.
 */
export type SignatureMarkProps = {
  /** Largeur rendue (px). Le motif garde son ratio 2:1 (viewBox 48×24). */
  width?: number;
  /** Couleur des corps de chandelier. Défaut : marque (violet). */
  color?: string;
  /** Couleur de la trajectoire de progression + point de confirmation. Défaut : annotation (cyan). */
  accent?: string;
  /** Épaisseur de trait avant mise à l'échelle. Défaut 2. */
  strokeWidth?: number;
  /** Étiquette accessible optionnelle (sinon décoratif). */
  title?: string;
};

const VB_W = 48;
const VB_H = 24;

/** Corps (x, haut, bas) et mèches (hautWick, basWick) — rythme ascendant déterministe. */
const CANDLES = [
  { x: 8, top: 14, bottom: 18.5, wickTop: 11, wickBottom: 20.5 },
  { x: 20, top: 9.5, bottom: 15, wickTop: 6.5, wickBottom: 17.5 },
  { x: 32, top: 5, bottom: 11, wickTop: 2.5, wickBottom: 13 },
] as const;
const BODY_W = 5;

export function SignatureMark({
  width = 48,
  color = theme.colors.primary,
  accent = theme.colors.technical,
  strokeWidth = 2,
  title,
}: SignatureMarkProps) {
  const decorative = !title;
  const height = (width * VB_H) / VB_W;
  const stroke = {
    stroke: color,
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none' as const,
  };
  // Milieux de corps → trajectoire de progression (le « fil » qui relie les preuves).
  const mids = CANDLES.map((c) => ({ x: c.x + BODY_W / 2, y: (c.top + c.bottom) / 2 }));
  const path = mids.map((m) => `${m.x},${m.y}`).join(' ');
  const last = mids[mids.length - 1];

  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      fill="none"
      accessibilityRole={decorative ? undefined : 'image'}
      accessibilityLabel={title}
      {...(decorative ? decorativeA11y : { importantForAccessibility: 'yes' as const })}
    >
      {/* Trajectoire de progression (accent, fine). */}
      <Polyline
        points={path}
        stroke={accent}
        strokeWidth={Math.max(1, strokeWidth - 0.75)}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity={0.9}
      />
      {/* Corps + mèches ascendants (marque). */}
      {CANDLES.map((c, i) => (
        <Rect key={`b${i}`} x={c.x} y={c.top} width={BODY_W} height={c.bottom - c.top} rx={1.2} {...stroke} />
      ))}
      {CANDLES.map((c, i) => (
        <Line key={`w${i}`} x1={c.x + BODY_W / 2} y1={c.wickTop} x2={c.x + BODY_W / 2} y2={c.wickBottom} {...stroke} />
      ))}
      {/* Point de confirmation final (accent plein). */}
      <Circle cx={last.x} cy={last.y} r={2.1} fill={accent} stroke={accent} />
    </Svg>
  );
}
