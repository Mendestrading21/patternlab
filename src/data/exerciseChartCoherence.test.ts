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

function summaryOfChart(seed: number): string {
  return describeCandles(generateCandles(seed, 30));
}

function directionOfChart(seed: number): Dir {
  const summary = summaryOfChart(seed);
  if (summary.includes('haussière')) return 'haussière';
  if (summary.includes('baissière')) return 'baissière';
  return 'latérale';
}

const OPPOSITE: Record<Dir, Dir | null> = { haussière: 'baissière', baissière: 'haussière', latérale: null };

/** Le texte mentionne-t-il explicitement telle direction ? (racines hauss-/baiss-/latéral) */
function mentionsDir(text: string, dir: Dir): boolean {
  const t = text.toLowerCase();
  if (dir === 'haussière') return t.includes('hauss');
  if (dir === 'baissière') return t.includes('baiss');
  return t.includes('latéral') || t.includes('range');
}

type DirectionExercise = Extract<Exercise, { type: 'identify_pattern' }>;

describe('P0 — cohérence exercice ↔ graphique ↔ feedback ↔ résumé accessible (direction)', () => {
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

    describe(`${ex.id} (seed ${ex.chartSeed})`, () => {
      it(`la réponse « ${correct} » suit la structure du graphique`, () => {
        expect(directionOfChart(ex.chartSeed as number)).toBe(answerDir);
      });

      it('le résumé accessible annonce la même direction que la réponse', () => {
        // Le lecteur d'écran entend la structure réelle : elle doit coïncider avec la réponse notée.
        expect(mentionsDir(summaryOfChart(ex.chartSeed as number), answerDir)).toBe(true);
      });

      it('le feedback ne contredit jamais la direction du graphique', () => {
        const opposite = OPPOSITE[answerDir];
        if (!opposite) return; // latéral : pas d'opposé strict
        expect(mentionsDir(ex.feedback.correct, opposite)).toBe(false);
        expect(mentionsDir(ex.feedback.incorrect, opposite)).toBe(false);
      });
    });
  }
});
