import { describe, it, expect } from '@jest/globals';
import { learningOf, isFalseSignalExercise, addConceptExplored, addFalseSignalSpotted, addRecognitionResult } from './learningStats';
import { earnedBadges } from './badges';
import { defaultProgress } from './seed';

const T0 = 1_700_000_000_000;
const base = defaultProgress(T0);

describe('learningOf', () => {
  it('renvoie un défaut vide si absent', () => {
    const l = learningOf({ ...base, learning: undefined });
    expect(l).toEqual({ conceptsExplored: [], worldsExplored: [], falseSignalsSpotted: 0, figuresRecognized: 0, bestRecognitionStreak: 0 });
  });
});

describe('addRecognitionResult', () => {
  it('cumule les figures reconnues et relève la meilleure série', () => {
    let s = addRecognitionResult(base, 5, 3);
    expect(learningOf(s).figuresRecognized).toBe(5);
    expect(learningOf(s).bestRecognitionStreak).toBe(3);
    s = addRecognitionResult(s, 4, 2); // meilleure série moindre → conservée à 3
    expect(learningOf(s).figuresRecognized).toBe(9);
    expect(learningOf(s).bestRecognitionStreak).toBe(3);
    s = addRecognitionResult(s, 0, 6); // 0 figure mais meilleure série relevée
    expect(learningOf(s).figuresRecognized).toBe(9);
    expect(learningOf(s).bestRecognitionStreak).toBe(6);
  });
  it('ignore les valeurs invalides et ne change rien si sans effet', () => {
    const s = addRecognitionResult(base, -2, Number.NaN);
    expect(s).toBe(base); // aucun changement → même référence
  });
});

describe('isFalseSignalExercise', () => {
  it('reconnaît les formats faux-signal / invalidation', () => {
    expect(isFalseSignalExercise('find_error')).toBe(true);
    expect(isFalseSignalExercise('place_invalidation')).toBe(true);
    expect(isFalseSignalExercise('mcq')).toBe(false);
  });
});

describe('addConceptExplored', () => {
  it('ajoute concept + monde, dédupliqué (idempotent)', () => {
    let s = addConceptExplored(base, 'marteau', 'world.candles');
    expect(learningOf(s).conceptsExplored).toEqual(['marteau']);
    expect(learningOf(s).worldsExplored).toEqual(['world.candles']);
    const same = addConceptExplored(s, 'marteau', 'world.candles');
    expect(same).toBe(s); // aucun changement → même référence
    s = addConceptExplored(s, 'doji', 'world.candles'); // nouveau concept, monde déjà vu
    expect(learningOf(s).conceptsExplored).toEqual(['marteau', 'doji']);
    expect(learningOf(s).worldsExplored).toEqual(['world.candles']);
    s = addConceptExplored(s, 'range', 'world.structure');
    expect(learningOf(s).worldsExplored).toEqual(['world.candles', 'world.structure']);
  });
  it('accepte un concept sans monde (terme v1)', () => {
    const s = addConceptExplored(base, 'levier');
    expect(learningOf(s).conceptsExplored).toEqual(['levier']);
    expect(learningOf(s).worldsExplored).toEqual([]);
  });
});

describe('addFalseSignalSpotted', () => {
  it('incrémente le compteur', () => {
    const s = addFalseSignalSpotted(addFalseSignalSpotted(base));
    expect(learningOf(s).falseSignalsSpotted).toBe(2);
  });
});

describe('réussites « compréhension » V5', () => {
  it('badge anatomiste des bougies à 50 % de maîtrise chandeliers', () => {
    const s = { ...base, skills: { ...base.skills, 'skill.candles': { ...base.skills['skill.candles'], mastery: 0.6 } } };
    expect(earnedBadges(s).has('candle-anatomist')).toBe(true);
    expect(earnedBadges(base).has('candle-anatomist')).toBe(false);
  });
  it('badge détecteur de faux signaux à 3 repérages', () => {
    let s = base;
    for (let i = 0; i < 3; i++) s = addFalseSignalSpotted(s);
    expect(earnedBadges(s).has('false-signal-spotter')).toBe(true);
  });
  it('badge curieux à 5 concepts, cartographe des mondes à 3 mondes', () => {
    let s = base;
    const worlds = ['world.candles', 'world.patterns', 'world.structure', 'world.support-resistance', 'world.anatomy'];
    ['a', 'b', 'c', 'd', 'e'].forEach((c, i) => (s = addConceptExplored(s, c, worlds[i])));
    expect(earnedBadges(s).has('curious')).toBe(true);
    expect(earnedBadges(s).has('world-cartographer')).toBe(true);
  });
  it('badge œil de lecteur à 15 figures reconnues', () => {
    expect(earnedBadges(addRecognitionResult(base, 14, 4)).has('reader-eye')).toBe(false);
    expect(earnedBadges(addRecognitionResult(base, 15, 4)).has('reader-eye')).toBe(true);
  });
});
