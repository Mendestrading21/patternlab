import { describe, it, expect } from '@jest/globals';
import { summarizeMisconceptions, misconceptionIdForExercise, MISCONCEPTIONS, remediationForExercise } from './misconceptions';
import { V5_CONCEPTS } from './learningContent';
import { objectiveByIdIn } from './learningTarget';

describe('misconceptions — erreurs typées', () => {
  it('rattache un exercice précis à sa misconception (override)', () => {
    expect(misconceptionIdForExercise('ex.actions.dividende')).toBe('valorisation');
    expect(misconceptionIdForExercise('ex.actions.green-candle')).toBe('couleur-seule');
  });

  it('retombe sur la misconception de la compétence, sinon « à revoir »', () => {
    expect(misconceptionIdForExercise('ex.trend.mcq')).toBe('niveau-certitude');
    expect(misconceptionIdForExercise('ex.patterns.something')).toBe('figure-anticipee');
    expect(misconceptionIdForExercise('ex.inconnu.x')).toBe('a-revoir');
  });

  it('agrège les errorTags par misconception, triés par fréquence', () => {
    const summary = summarizeMisconceptions({
      'ex.actions.dividende': 2,
      'ex.actions.per': 1, // même misconception « valorisation » → 3 au total
      'ex.trend.mcq': 1,
    });
    expect(summary[0].misconception.id).toBe('valorisation');
    expect(summary[0].count).toBe(3);
    expect(summary[1].misconception.id).toBe('niveau-certitude');
    expect(summary.every((s) => s.misconception.hint.length > 0)).toBe(true);
  });

  it('ignore les compteurs nuls/invalides', () => {
    expect(summarizeMisconceptions({ 'ex.actions.per': 0 })).toEqual([]);
    expect(summarizeMisconceptions({})).toEqual([]);
  });

  it('chaque misconception a un id, un label et un conseil', () => {
    for (const m of MISCONCEPTIONS) {
      expect(m.id.length).toBeGreaterThan(0);
      expect(m.label.length).toBeGreaterThan(0);
      expect(m.hint.length).toBeGreaterThan(0);
    }
  });
});

describe('remédiation liée au bon objectif', () => {
  const resolve = (objectiveId: string) => {
    const o = objectiveByIdIn(V5_CONCEPTS, objectiveId);
    return o ? { label: o.label, conceptSlug: o.conceptSlug } : undefined;
  };

  it('un exercice ciblé pointe l’objectif réel du concept (pas un conseil générique)', () => {
    const rem = remediationForExercise(
      { id: 'ex.trend.identify', target: { objectiveId: 'concept.uptrend::recognize' } },
      resolve,
    );
    expect(rem.objectiveLabel).toBeTruthy();
    expect(rem.conceptSlug).toBe('tendance-haussiere');
    // le conseil misconception reste présent (double filet)
    expect(rem.misconception.hint.length).toBeGreaterThan(0);
  });

  it('un exercice sans cible retombe proprement sur la misconception', () => {
    const rem = remediationForExercise({ id: 'ex.trend.mcq' }, resolve);
    expect(rem.objectiveLabel).toBeNull();
    expect(rem.conceptSlug).toBeNull();
    expect(rem.misconception.id).toBe('niveau-certitude');
  });

  it('une cible orpheline ne casse pas la remédiation (fallback misconception)', () => {
    const rem = remediationForExercise(
      { id: 'ex.actions.green-candle', target: { objectiveId: 'concept.fantome::recognize' } },
      resolve,
    );
    expect(rem.objectiveLabel).toBeNull();
    expect(rem.misconception.id).toBe('couleur-seule');
  });
});
