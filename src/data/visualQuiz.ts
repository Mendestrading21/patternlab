/**
 * Quiz visuel enrichi — logique PURE et déterministe (aucune I/O, hasard uniquement par graine).
 * Étend l'entraîneur de reconnaissance : au lieu de toujours demander le NOM d'une figure, il
 * génère des questions VARIÉES basées sur l'image (nom, sens de lecture, famille) selon un niveau
 * de difficulté, chacune avec une explication illustrée. Pédagogique : on lit des figures, on
 * n'émet aucun signal de marché.
 */
import { PATTERN_FAMILIES, glyphToVisualSpec, type PatternGlyph } from './patternLibrary';
import type { VisualSpec, Direction } from './learningConcept';
import { mulberry32, shuffle, poolForGroup, type RecognitionGroup } from './recognitionTrainer';

export type VisualQuizKind = 'name' | 'direction' | 'family';
export type QuizDifficulty = 'facile' | 'moyen' | 'expert';

export const QUIZ_DIFFICULTIES: { id: QuizDifficulty; label: string; hint: string }[] = [
  { id: 'facile', label: 'Facile', hint: 'Sens de la figure' },
  { id: 'moyen', label: 'Moyen', hint: 'Nom · sens · famille' },
  { id: 'expert', label: 'Expert', hint: 'Nom & famille, pièges' },
];

export interface VisualQuizQuestion {
  id: string;
  figureId: string;
  /** Nom de la figure cible (révélé après réponse). */
  figureTitle: string;
  kind: VisualQuizKind;
  spec: VisualSpec;
  prompt: string;
  options: string[];
  correctIndex: number;
  /** Explication illustrée (résumé de la figure). */
  explanation: string;
  difficulty: QuizDifficulty;
}

const DIRECTION_LABEL: Record<Direction, string> = {
  bullish: 'Plutôt haussière',
  bearish: 'Plutôt baissière',
  neutral: 'Neutre / indécision',
};
const DIRECTION_OPTIONS = [DIRECTION_LABEL.bullish, DIRECTION_LABEL.bearish, DIRECTION_LABEL.neutral];
const FAMILY_LABEL: Record<string, string> = Object.fromEntries(PATTERN_FAMILIES.map((f) => [f.id, f.title]));

const DIFFICULTY_KINDS: Record<QuizDifficulty, VisualQuizKind[]> = {
  facile: ['direction'],
  moyen: ['name', 'direction', 'family'],
  expert: ['name', 'family'],
};
const DIFFICULTY_OPTIONS: Record<QuizDifficulty, number> = { facile: 3, moyen: 4, expert: 4 };

function directionQuestion(target: PatternGlyph, spec: VisualSpec, difficulty: QuizDifficulty, rng: () => number, i: number): VisualQuizQuestion {
  const options = shuffle(DIRECTION_OPTIONS, rng);
  return {
    id: `q${i}-dir-${target.id}`,
    figureId: target.id,
    figureTitle: target.title,
    kind: 'direction',
    spec,
    prompt: 'Quelle lecture cette figure suggère-t-elle ?',
    options,
    correctIndex: options.indexOf(DIRECTION_LABEL[target.direction]),
    explanation: target.summary,
    difficulty,
  };
}

function nameQuestion(target: PatternGlyph, spec: VisualSpec, pool: PatternGlyph[], difficulty: QuizDifficulty, rng: () => number, i: number, optionCount: number): VisualQuizQuestion {
  const sameFamily = shuffle(pool.filter((g) => g.family === target.family && g.id !== target.id), rng);
  const otherFamily = shuffle(pool.filter((g) => g.family !== target.family), rng);
  // Expert : distracteurs de la même famille d'abord (plus exigeant). Sinon, mélange.
  const ordered = difficulty === 'expert' ? [...sameFamily, ...otherFamily] : shuffle([...sameFamily, ...otherFamily], rng);
  const distractors = ordered.slice(0, Math.max(0, optionCount - 1));
  const options = shuffle([target, ...distractors], rng);
  return {
    id: `q${i}-name-${target.id}`,
    figureId: target.id,
    figureTitle: target.title,
    kind: 'name',
    spec,
    prompt: 'Quelle figure reconnais-tu ?',
    options: options.map((o) => o.title),
    correctIndex: options.findIndex((o) => o.id === target.id),
    explanation: target.summary,
    difficulty,
  };
}

function familyQuestion(target: PatternGlyph, spec: VisualSpec, pool: PatternGlyph[], difficulty: QuizDifficulty, rng: () => number, i: number, optionCount: number): VisualQuizQuestion | undefined {
  const families = [...new Set(pool.map((g) => g.family))];
  if (families.length < 2) return undefined;
  const others = shuffle(families.filter((f) => f !== target.family), rng).slice(0, Math.min(optionCount - 1, families.length - 1));
  const chosen = shuffle([target.family, ...others], rng);
  return {
    id: `q${i}-fam-${target.id}`,
    figureId: target.id,
    figureTitle: target.title,
    kind: 'family',
    spec,
    prompt: 'À quelle famille cette figure appartient-elle ?',
    options: chosen.map((f) => FAMILY_LABEL[f] ?? f),
    correctIndex: chosen.indexOf(target.family),
    explanation: `${target.title} — famille « ${FAMILY_LABEL[target.family] ?? target.family} ». ${target.summary}`,
    difficulty,
  };
}

/**
 * Construit une session de quiz visuel de `count` questions distinctes, mixant les types selon la
 * difficulté. Déterministe pour une graine donnée.
 */
export function buildVisualQuiz(
  seed: number,
  opts: { count?: number; difficulty?: QuizDifficulty; group?: RecognitionGroup } = {},
): VisualQuizQuestion[] {
  const { count = 8, difficulty = 'moyen', group = 'all' } = opts;
  const pool = poolForGroup(group);
  const rng = mulberry32(seed);
  const kinds = DIFFICULTY_KINDS[difficulty];
  const optionCount = DIFFICULTY_OPTIONS[difficulty];
  const targets = shuffle(pool, rng).slice(0, Math.min(count, pool.length));
  return targets.map((target, i) => {
    const spec = glyphToVisualSpec(target);
    const kind = kinds[Math.floor(rng() * kinds.length)];
    if (kind === 'direction') return directionQuestion(target, spec, difficulty, rng, i);
    if (kind === 'family') {
      const q = familyQuestion(target, spec, pool, difficulty, rng, i, optionCount);
      if (q) return q;
    }
    return nameQuestion(target, spec, pool, difficulty, rng, i, optionCount);
  });
}
