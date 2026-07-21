import { describe, it, expect } from '@jest/globals';
import { buildLearnSteps, sanitizeResume, isResumable } from './sessionFlow';
import type { LessonStep } from '../engines/learning';

const step = (id: string, kind: LessonStep['kind']): LessonStep => ({ id, kind, body: id });

describe('buildLearnSteps — contre-exemple obligatoire', () => {
  it('n’ajoute rien si un faux signal est déjà présent', () => {
    const steps = [step('a', 'intro'), step('b', 'falseSignal'), step('c', 'summary')];
    expect(buildLearnSteps(steps)).toBe(steps);
  });

  it('insère un contre-exemple avant le résumé s’il en manque', () => {
    const steps = [step('a', 'intro'), step('b', 'explain'), step('c', 'summary')];
    const out = buildLearnSteps(steps);
    expect(out).toHaveLength(4);
    const kinds = out.map((s) => s.kind);
    expect(kinds).toEqual(['intro', 'explain', 'falseSignal', 'summary']);
  });

  it('ajoute le contre-exemple à la fin s’il n’y a pas de résumé', () => {
    const steps = [step('a', 'intro'), step('b', 'explain')];
    const out = buildLearnSteps(steps, 'Le piège classique.');
    expect(out.at(-1)?.kind).toBe('falseSignal');
    expect(out.at(-1)?.body).toBe('Le piège classique.');
  });
});

describe('sanitizeResume — reprise exacte, jamais une autre session', () => {
  const OK = { skillId: 'skill.actions', phase: 'practice', learnStep: 2, index: 3, correct: 2, streak: 1, count: 5 };

  it('rejette un skillId qui ne correspond pas', () => {
    expect(sanitizeResume(OK, { skillId: 'skill.trend' })).toBeNull();
  });

  it('rejette un objet invalide ou une phase inconnue', () => {
    expect(sanitizeResume(null, { skillId: 'skill.actions' })).toBeNull();
    expect(sanitizeResume({ skillId: 'skill.actions', phase: 'nope' }, { skillId: 'skill.actions' })).toBeNull();
  });

  it('assainit les nombres (négatifs/NaN → 0) et le count', () => {
    const r = sanitizeResume(
      { skillId: 'skill.actions', phase: 'learn', learnStep: -3, index: NaN, correct: 2.9, streak: 1, count: 0 },
      { skillId: 'skill.actions' },
    )!;
    expect(r.learnStep).toBe(0);
    expect(r.index).toBe(0);
    expect(r.correct).toBe(2);
    expect(r.count).toBeNull();
  });

  it('accepte une reprise valide', () => {
    const r = sanitizeResume(OK, { skillId: 'skill.actions' })!;
    expect(r).toEqual({ skillId: 'skill.actions', phase: 'practice', learnStep: 2, index: 3, correct: 2, streak: 1, count: 5 });
  });
});

describe('isResumable', () => {
  it('faux au tout début, vrai dès qu’on a avancé', () => {
    expect(isResumable(null)).toBe(false);
    expect(isResumable({ skillId: 's', phase: 'learn', learnStep: 0, index: 0, correct: 0, streak: 0, count: null })).toBe(false);
    expect(isResumable({ skillId: 's', phase: 'learn', learnStep: 1, index: 0, correct: 0, streak: 0, count: null })).toBe(true);
    expect(isResumable({ skillId: 's', phase: 'practice', learnStep: 0, index: 0, correct: 0, streak: 0, count: null })).toBe(true);
  });
});
