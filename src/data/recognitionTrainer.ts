/**
 * Entraîneur de reconnaissance de figures — logique PURE et déterministe (aucune I/O, aucun hasard
 * non graine). Construit des manches de quiz « reconnais la figure » à partir de `PATTERN_LIBRARY` :
 * une figure cible à afficher + des intitulés parmi lesquels choisir. Les distracteurs sont pris en
 * priorité dans la même famille (plus exigeant), complétés par d'autres familles.
 *
 * Pédagogique et sans jugement de marché : on nomme des figures, on n'émet aucun signal.
 */
import { PATTERN_LIBRARY, glyphToVisualSpec, type PatternGlyph, type PatternFamily } from './patternLibrary';
import type { VisualSpec } from './learningConcept';

// ─── Groupes d'entraînement (familles regroupées pour le choix à l'écran) ──
export type RecognitionGroup = 'all' | 'chandeliers' | 'figures' | 'indicateurs' | 'smc';

export const RECOGNITION_GROUPS: { id: RecognitionGroup; label: string; families: PatternFamily[] | 'all' }[] = [
  { id: 'all', label: 'Tout', families: 'all' },
  { id: 'chandeliers', label: 'Chandeliers', families: ['chandelier-simple', 'chandelier-double', 'chandelier-triple'] },
  { id: 'figures', label: 'Figures', families: ['figure-chartiste', 'structure'] },
  { id: 'indicateurs', label: 'Indicateurs', families: ['indicateur'] },
  { id: 'smc', label: 'SMC', families: ['structure-smc'] },
];

/** Sous-ensemble de la bibliothèque pour un groupe (défaut : tout). */
export function poolForGroup(group: RecognitionGroup, pool: PatternGlyph[] = PATTERN_LIBRARY): PatternGlyph[] {
  const def = RECOGNITION_GROUPS.find((g) => g.id === group);
  if (!def || def.families === 'all') return pool;
  const fams = new Set<PatternFamily>(def.families);
  return pool.filter((g) => fams.has(g.family));
}

export interface RecognitionRound {
  figureId: string;
  /** Spec à rendre (en mode « énigme » côté écran). */
  spec: VisualSpec;
  /** Intitulé correct. */
  title: string;
  /** Intitulés proposés (dont le bon), ordre mélangé de façon déterministe. */
  options: string[];
  correctIndex: number;
  family: PatternGlyph['family'];
}

/** PRNG déterministe (mulberry32) — même graine → même suite. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Mélange (Fisher-Yates) déterministe : ne mute pas l'entrée. */
export function shuffle<T>(arr: T[], rng: () => number): T[] {
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Construit une session de `count` manches distinctes. `optionCount` = nombre d'intitulés proposés.
 * Déterministe pour une graine donnée.
 */
export function buildRecognitionSession(
  seed: number,
  count = 8,
  optionCount = 4,
  pool: PatternGlyph[] = PATTERN_LIBRARY,
): RecognitionRound[] {
  const rng = mulberry32(seed);
  const targets = shuffle(pool, rng).slice(0, Math.min(count, pool.length));
  return targets.map((target) => {
    const sameFamily = shuffle(
      pool.filter((g) => g.family === target.family && g.id !== target.id),
      rng,
    );
    const otherFamily = shuffle(
      pool.filter((g) => g.family !== target.family),
      rng,
    );
    const distractors = [...sameFamily, ...otherFamily].slice(0, Math.max(0, optionCount - 1));
    const options = shuffle([target, ...distractors], rng);
    return {
      figureId: target.id,
      spec: glyphToVisualSpec(target),
      title: target.title,
      options: options.map((o) => o.title),
      correctIndex: options.findIndex((o) => o.id === target.id),
      family: target.family,
    };
  });
}
