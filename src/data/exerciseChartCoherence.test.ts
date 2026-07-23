import { describe, it, expect } from '@jest/globals';
import { allExercisesFlat } from './repoTruth';
import { generateCandles } from '../engines/pattern/demoChart';
import { describeCandles } from '../engines/pattern/chartA11y';
import type { Exercise } from '../engines/exercise/types';

/**
 * Source sémantique unique (P0 — fiabilité pédagogique).
 *
 * Pour tout exercice de DIRECTION construit sur un `chartSeed`, la réponse notée correcte,
 * l'explication ET le résumé accessible du graphique doivent dériver de la MÊME direction.
 * La direction dérivée du graphique (`describeCandles(generateCandles(seed))`) fait foi : un
 * `chartSeed` dont la structure contredit la réponse casse ce test.
 *
 * C'est précisément le défaut historique corrigé ici : `chartSeed: 2024` rend une structure
 * « globalement baissière » alors que la réponse notée était « haussière » — un lecteur d'écran
 * entendait l'inverse de la bonne réponse.
 */
type Dir = 'haussière' | 'baissière' | 'latérale';

function directionOfOption(text: string): Dir | null {
  const t = text.toLowerCase();
  if (t.includes('hauss')) return 'haussière';
  if (t.includes('baiss')) return 'baissière';
  if (t.includes('latéral') || t.includes('range') || t.includes('sans direction')) return 'latérale';
  return null;
}

function directionOfChart(seed: number): Dir {
  const summary = describeCandles(generateCandles(seed, 30));
  if (summary.includes('haussière')) return 'haussière';
  if (summary.includes('baissière')) return 'baissière';
  return 'latérale';
}

type DirectionExercise = Extract<Exercise, { type: 'identify_pattern' }>;

describe('P0 — cohérence exercice ↔ graphique ↔ résumé accessible (direction)', () => {
  const directionExercises = allExercisesFlat().filter(
    (e): e is DirectionExercise => e.type === 'identify_pattern' && typeof e.chartSeed === 'number',
  );

  it('des exercices de direction à graphique existent (le filtre n’est pas vide)', () => {
    expect(directionExercises.length).toBeGreaterThan(0);
  });

  for (const ex of directionExercises) {
    const correct = ex.options[ex.validation.correctIndex];
    const answerDir = directionOfOption(correct);
    if (!answerDir) continue; // options non directionnelles : hors de ce garde-fou
    it(`${ex.id} — réponse « ${correct} » cohérente avec le graphique (seed ${ex.chartSeed})`, () => {
      expect(directionOfChart(ex.chartSeed as number)).toBe(answerDir);
    });
  }
});
