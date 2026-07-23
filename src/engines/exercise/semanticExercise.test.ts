import { describe, it, expect } from '@jest/globals';
import { buildDirectionExercise } from './semanticExercise';
import { generateCandles } from '../pattern/demoChart';
import { candleTrend } from '../pattern/chartA11y';

// Seeds à direction connue (vérifiés par le générateur déterministe).
const UP_SEED = 7; // structure globalement haussière
const DOWN_SEED = 2024; // structure globalement baissière

describe('buildDirectionExercise — source sémantique unique', () => {
  it('les seeds de test ont bien la direction attendue (préalable)', () => {
    expect(candleTrend(generateCandles(UP_SEED, 30))).toBe('haussière');
    expect(candleTrend(generateCandles(DOWN_SEED, 30))).toBe('baissière');
  });

  const spec = (chartSeed: number) => ({
    id: 'ex.test.dir',
    skillId: 'skill.test',
    target: { conceptId: 'concept.test', objectiveId: 'concept.test::recognize' },
    chartSeed,
    prompt: 'Quelle direction ?',
    options: ['Hausse', 'Baisse', 'Latéral'] as [string, string, string],
  });

  it('la réponse correcte est CALCULÉE depuis le graphique (hausse → index 0)', () => {
    const ex = buildDirectionExercise(spec(UP_SEED));
    expect(ex.validation.correctIndex).toBe(0);
    expect(ex.options[ex.validation.correctIndex]).toBe('Hausse');
  });

  it('la réponse correcte suit un graphique baissier (baisse → index 1)', () => {
    const ex = buildDirectionExercise(spec(DOWN_SEED));
    expect(ex.validation.correctIndex).toBe(1);
    expect(ex.options[ex.validation.correctIndex]).toBe('Baisse');
  });

  it('le feedback annonce la vraie direction et jamais son opposé', () => {
    const up = buildDirectionExercise(spec(UP_SEED));
    expect(up.feedback.correct.toLowerCase()).toContain('hauss');
    expect(up.feedback.correct.toLowerCase()).not.toContain('baiss');

    const down = buildDirectionExercise(spec(DOWN_SEED));
    expect(down.feedback.correct.toLowerCase()).toContain('baiss');
    expect(down.feedback.correct.toLowerCase()).not.toContain('hauss');
  });

  it('le feedback embarque le résumé accessible (même vérité que le graphique)', () => {
    const ex = buildDirectionExercise(spec(UP_SEED));
    expect(ex.feedback.correct).toContain('Graphique en chandeliers');
  });

  it('porte la cible pédagogique et reste un identify_pattern valide', () => {
    const ex = buildDirectionExercise(spec(UP_SEED));
    expect(ex.type).toBe('identify_pattern');
    expect(ex.target).toEqual({ conceptId: 'concept.test', objectiveId: 'concept.test::recognize' });
    expect(ex.chartSeed).toBe(UP_SEED);
    expect(ex.options).toHaveLength(3);
  });

  it('deux appels avec le même seed produisent un exercice identique (déterministe)', () => {
    expect(buildDirectionExercise(spec(UP_SEED))).toEqual(buildDirectionExercise(spec(UP_SEED)));
  });
});
