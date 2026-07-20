import { describe, it, expect } from '@jest/globals';
import { characterLine, type DialogueContext } from './dialogue';
import { CHARACTER_STATES } from './states';

describe('characterLine', () => {
  it('bonne réponse → Toto encourage ; mauvaise → Bobo rassure', () => {
    expect(characterLine({ kind: 'answer', correct: true }).character).toBe('toto');
    expect(characterLine({ kind: 'answer', correct: false }).character).toBe('bobo');
    expect(characterLine({ kind: 'answer', correct: false }).state).toBe('wrong');
  });

  it('série ≥ 3 → réplique de série', () => {
    expect(characterLine({ kind: 'answer', correct: true, streak: 4 }).state).toBe('streak');
    expect(characterLine({ kind: 'answer', correct: true, streak: 1 }).state).toBe('celebrate-small');
  });

  it('résultat : perfect/pass/retry → Toto avec l’état adéquat', () => {
    expect(characterLine({ kind: 'result', tier: 'perfect' }).state).toBe('celebrate-big');
    expect(characterLine({ kind: 'result', tier: 'pass' }).state).toBe('celebrate-small');
    expect(characterLine({ kind: 'result', tier: 'retry' }).state).toBe('encourage');
  });

  it('concept : sens → personnage cohérent', () => {
    expect(characterLine({ kind: 'concept', direction: 'bullish' }).character).toBe('toto');
    expect(characterLine({ kind: 'concept', direction: 'bearish' }).character).toBe('bobo');
    expect(characterLine({ kind: 'concept', direction: 'neutral' }).character).toBe('bobo');
  });

  it('varie avec la graine mais reste déterministe et non vide', () => {
    const ctx: DialogueContext = { kind: 'answer', correct: true };
    const texts = [0, 1, 2, 3].map((s) => characterLine(ctx, s).text);
    expect(new Set(texts).size).toBeGreaterThan(1); // au moins deux variantes
    expect(characterLine(ctx, 2).text).toBe(characterLine(ctx, 2).text); // reproductible
    for (const s of [0, 1, 2, 3, 4, 5]) expect(characterLine(ctx, s).text.trim().length).toBeGreaterThan(0);
  });

  it('chaque état renvoyé existe dans le registre', () => {
    const ctxs: DialogueContext[] = [
      { kind: 'answer', correct: true },
      { kind: 'answer', correct: true, streak: 5 },
      { kind: 'answer', correct: false },
      { kind: 'result', tier: 'perfect' },
      { kind: 'result', tier: 'pass' },
      { kind: 'result', tier: 'retry' },
      { kind: 'mission' },
      { kind: 'concept', direction: 'bullish' },
      { kind: 'concept', direction: 'bearish' },
      { kind: 'concept', direction: 'neutral' },
    ];
    for (const c of ctxs) expect(CHARACTER_STATES[characterLine(c).state]).toBeDefined();
  });
});
