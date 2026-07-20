import { describe, it, expect } from '@jest/globals';
import { buildVisualQuiz, QUIZ_DIFFICULTIES, type QuizDifficulty } from './visualQuiz';

const DIFFS: QuizDifficulty[] = ['facile', 'moyen', 'expert'];

describe('buildVisualQuiz', () => {
  it('est déterministe (même graine → même session)', () => {
    expect(buildVisualQuiz(2024, { count: 8, difficulty: 'moyen' })).toEqual(
      buildVisualQuiz(2024, { count: 8, difficulty: 'moyen' }),
    );
  });

  it('produit le nombre de questions demandé', () => {
    expect(buildVisualQuiz(1, { count: 6, difficulty: 'moyen' })).toHaveLength(6);
  });

  it('chaque question est bien formée (index correct valide, options distinctes, explication)', () => {
    for (const difficulty of DIFFS) {
      const session = buildVisualQuiz(7, { count: 10, difficulty });
      for (const q of session) {
        expect(q.options.length).toBeGreaterThanOrEqual(2);
        expect(q.correctIndex).toBeGreaterThanOrEqual(0);
        expect(q.correctIndex).toBeLessThan(q.options.length);
        expect(new Set(q.options).size).toBe(q.options.length); // pas de doublon
        expect(q.explanation.trim().length).toBeGreaterThan(0);
        expect(q.spec.accessibilitySummary.trim().length).toBeGreaterThan(0);
        expect(q.difficulty).toBe(difficulty);
      }
    }
  });

  it('« facile » ne pose que des questions de sens ; « expert » ne pose que nom/famille', () => {
    const facile = buildVisualQuiz(3, { count: 8, difficulty: 'facile' });
    expect(facile.every((q) => q.kind === 'direction')).toBe(true);
    expect(facile.every((q) => q.options.length === 3)).toBe(true);

    const expert = buildVisualQuiz(3, { count: 8, difficulty: 'expert' });
    expect(expert.every((q) => q.kind === 'name' || q.kind === 'family')).toBe(true);
  });

  it('respecte le groupe (thème) et un compteur cohérent de difficultés', () => {
    const chand = buildVisualQuiz(5, { count: 6, difficulty: 'moyen', group: 'chandeliers' });
    expect(chand.length).toBeGreaterThan(0);
    expect(QUIZ_DIFFICULTIES.map((d) => d.id)).toEqual(['facile', 'moyen', 'expert']);
  });
});
