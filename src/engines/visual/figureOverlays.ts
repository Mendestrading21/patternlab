/**
 * Overlays de figures chartistes (Lot 2) — tracés géométriques (lignes de cou, lignes de tendance,
 * bornes de canaux) ancrés dans l'espace (index de bougie, prix) d'un dataset déterministe.
 *
 * Pur : aucune dépendance de rendu. `VisualCard` lit `figureOverlay(variant)` et passe guides/zones/
 * markers à `CandlestickGlyphs`. Les schémas restent originaux, générés en code.
 */
import { colors } from '../../design-system/tokens';
import type { Guide, Marker, Zone } from './components/CandlestickGlyphs';

export interface FigureOverlay {
  guides?: Guide[];
  zones?: Zone[];
  markers?: Marker[];
}

const NECK = colors.technical; // ligne de cou / niveau
const TREND = colors.advanced; // ligne de tendance
const line = (fromI: number, fromP: number, toI: number, toP: number, color: string = TREND, label?: string): Guide => ({
  from: { i: fromI, price: fromP },
  to: { i: toI, price: toP },
  color,
  dashed: color === NECK,
  label,
});
const mark = (i: number, price: number, text: string): Marker => ({ i, price, text, color: colors.textSecondary });
const band = (from: number, to: number, color: string, label?: string): Zone => ({ from, to, color, label });

/** Registre indexé par `variant` (= id de glyphe / de concept). */
export const FIGURE_OVERLAYS: Record<string, FigureOverlay> = {
  // ─── Doubles / triples / épaule-tête-épaule (lignes de cou) ─────────
  'double-bottom': { guides: [line(2, 52, 12, 52, NECK, 'ligne de cou')] },
  'double-top': { guides: [line(2, 48, 12, 48, NECK, 'ligne de cou')] },
  'triple-bottom': {
    guides: [line(1, 53, 7, 53, NECK, 'ligne de cou')],
    markers: [mark(2, 46, '•'), mark(4, 46, '•'), mark(6, 46, '•')],
  },
  'triple-top': {
    guides: [line(1, 48, 7, 48, NECK, 'ligne de cou')],
    markers: [mark(2, 54, '•'), mark(4, 54, '•'), mark(6, 54, '•')],
  },
  'head-shoulders': {
    guides: [line(2, 49, 7, 49, NECK, 'ligne de cou')],
    markers: [mark(2, 54, 'épaule'), mark(4, 60, 'tête'), mark(6, 54, 'épaule')],
  },
  'inverse-head-shoulders': {
    guides: [line(2, 55, 7, 55, NECK, 'ligne de cou')],
    markers: [mark(2, 50, 'épaule'), mark(4, 44, 'tête'), mark(6, 50, 'épaule')],
  },

  // ─── Triangles (deux droites) ──────────────────────────────────────
  'ascending-triangle': { guides: [line(1, 56, 7, 56, NECK), line(2, 50, 6, 54)] },
  'descending-triangle': { guides: [line(1, 48, 7, 48, NECK), line(2, 54, 6, 50)] },
  'symmetrical-triangle': { guides: [line(1, 56, 7, 51), line(2, 47, 6, 50)] },

  // ─── Biseaux (deux droites convergentes de même sens) ──────────────
  'rising-wedge': { guides: [line(1, 52, 7, 59), line(2, 49, 6, 55)] },
  'falling-wedge': { guides: [line(0, 60, 6, 49), line(1, 54, 7, 46)] },

  // ─── Drapeaux (canal court) ────────────────────────────────────────
  'bull-flag': { guides: [line(2, 58, 7, 56), line(3, 55, 7, 53)] },
  'bear-flag': { guides: [line(3, 49, 7, 51), line(2, 46, 7, 48)] },

  // ─── Fanions (convergence) ─────────────────────────────────────────
  'bullish-pennant': { guides: [line(1, 58, 6, 54), line(2, 52, 6, 54)] },
  'bearish-pennant': { guides: [line(2, 52, 6, 50), line(1, 46, 6, 50)] },

  // ─── Rectangles (deux plats) ───────────────────────────────────────
  'bull-rectangle': { guides: [line(1, 56, 6, 56, NECK), line(1, 50, 6, 50, NECK)] },
  'bear-rectangle': { guides: [line(1, 54, 6, 54, NECK), line(1, 48, 6, 48, NECK)] },

  // ─── Canaux (parallèles) ───────────────────────────────────────────
  'ascending-channel': { guides: [line(1, 50, 6, 62), line(2, 46, 6, 54)] },
  'descending-channel': { guides: [line(0, 62, 6, 52), line(1, 56, 6, 44)] },

  // ─── Tasse / arrondis (repère de bord) ─────────────────────────────
  'cup-handle': { guides: [line(1, 57, 10, 57, NECK, 'bord')] },

  // ─── Structure & Smart Money Concepts (Lot 3) ──────────────────────
  'choch': {
    guides: [line(1, 48, 6, 48, NECK, 'dernier sommet inférieur')],
    markers: [mark(6, 50, 'CHoCH')],
  },
  'supply-zone': {
    zones: [band(54, 58, colors.bearish, 'offre')],
    markers: [mark(2, 56, 'rejet')],
  },
  'demand-zone': {
    zones: [band(44, 48, colors.bullish, 'demande')],
    markers: [mark(3, 46, 'rebond')],
  },
  'order-block': {
    zones: [band(50, 52.5, colors.advanced, 'order block')],
    markers: [mark(3, 58, 'impulsion')],
  },
  'fair-value-gap': {
    zones: [band(49, 52, colors.technical, 'FVG (déséquilibre)')],
  },
  'liquidity-sweep': {
    guides: [line(1, 55, 4, 55, NECK, 'hauts égaux')],
    markers: [mark(5, 58, 'sweep')],
  },
  'fakeout': {
    guides: [line(1, 55, 6, 55, NECK, 'résistance')],
    markers: [mark(3, 57, 'faux signal')],
  },
  'break-retest': {
    guides: [line(1, 55, 6, 55, NECK, 'niveau cassé')],
    markers: [mark(4, 54, 'retest')],
  },
};

export function figureOverlay(variant?: string): FigureOverlay | undefined {
  return variant ? FIGURE_OVERLAYS[variant] : undefined;
}
