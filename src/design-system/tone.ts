/**
 * Tonalité pédagogique par difficulté — logique pure, testable.
 * Traduit une difficulté 1→5 en couleur sémantique + libellé. Le violet `advanced`
 * marque les concepts experts (4–5). Aucune sémantique financière ici.
 */
import { colors } from './tokens';

export interface Tone {
  /** Libellé humain (jamais un chiffre seul). */
  label: string;
  /** Couleur de texte/accent (tenue AA sur les surfaces de carte — voir contrast.test). */
  color: string;
}

/** Borne + arrondit la difficulté dans [1, 5]. */
export function clampDifficulty(difficulty: number): number {
  if (Number.isNaN(difficulty)) return 1;
  return Math.max(1, Math.min(5, Math.round(difficulty)));
}

/** Tonalité d'une difficulté : Découverte (1–2, technique) · Intermédiaire (3, ambre) · Avancé (4–5, violet). */
export function difficultyTone(difficulty: number): Tone {
  const d = clampDifficulty(difficulty);
  if (d <= 2) return { label: 'Découverte', color: colors.technical };
  if (d === 3) return { label: 'Intermédiaire', color: colors.warning };
  return { label: 'Avancé', color: colors.advanced };
}
