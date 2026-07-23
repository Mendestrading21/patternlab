import { describe, it, expect } from '@jest/globals';
import { rotateExercises, roundsToCover, buildCheckpoint } from './exerciseRotation';

const POOL = ['a', 'b', 'c', 'd', 'e'];

describe('rotateExercises — sélection déterministe et tournante', () => {
  it('round 0 = premiers N (compat comportement historique)', () => {
    expect(rotateExercises(POOL, 3, 0)).toEqual(['a', 'b', 'c']);
  });

  it('round 1 = page suivante, non chevauchante', () => {
    expect(rotateExercises(POOL, 3, 1)).toEqual(['d', 'e', 'a']);
  });

  it('boucle sur le pool (wrap-around)', () => {
    // round 4, count 3 → start = (4*3) % 5 = 2
    expect(rotateExercises(POOL, 3, 4)).toEqual(['c', 'd', 'e']);
  });

  it('est déterministe : même (pool, count, round) → même résultat', () => {
    expect(rotateExercises(POOL, 3, 2)).toEqual(rotateExercises(POOL, 3, 2));
  });

  it('cinq réponses ne sont pas cinq fois le même premier exercice : les rounds couvrent tout le pool', () => {
    const seen = new Set<string>();
    for (let r = 0; r < roundsToCover(POOL.length, 2); r += 1) {
      for (const x of rotateExercises(POOL, 2, r)) seen.add(x);
    }
    expect(seen.size).toBe(POOL.length); // couverture complète
  });

  it('count ≥ pool → tout le pool, sans doublon', () => {
    expect(rotateExercises(POOL, 10, 3)).toHaveLength(POOL.length);
    expect(new Set(rotateExercises(POOL, 10, 3)).size).toBe(POOL.length);
  });

  it('round négatif reste borné (pas de crash, décalage positif)', () => {
    // start = ((-1*2) % 5 + 5) % 5 = 3
    expect(rotateExercises(POOL, 2, -1)).toEqual(['d', 'e']);
  });

  it('cas limites : pool vide ou count nul → []', () => {
    expect(rotateExercises([], 3, 0)).toEqual([]);
    expect(rotateExercises(POOL, 0, 0)).toEqual([]);
  });

  it('roundsToCover : nombre de rounds pour tout couvrir', () => {
    expect(roundsToCover(5, 2)).toBe(3);
    expect(roundsToCover(4, 2)).toBe(2);
    expect(roundsToCover(0, 2)).toBe(0);
  });
});

describe('buildCheckpoint — questions non figées, plusieurs objectifs', () => {
  const pools = [
    ['a1', 'a2', 'a3'],
    ['b1', 'b2', 'b3'],
    ['c1', 'c2'],
  ];

  it('prend `perSkill` par compétence (couvre plusieurs compétences)', () => {
    const cp = buildCheckpoint(pools, 2, 0);
    expect(cp).toEqual(['a1', 'a2', 'b1', 'b2', 'c1', 'c2']);
  });

  it('un checkpoint suivant n’est pas identique (rotation par round)', () => {
    const first = buildCheckpoint(pools, 2, 0);
    const second = buildCheckpoint(pools, 2, 1);
    expect(second).not.toEqual(first);
    // pools de 3 → page suivante [a3,a1] ; pool de 2 → revient à [c1,c2]
    expect(second).toEqual(['a3', 'a1', 'b3', 'b1', 'c1', 'c2']);
  });

  it('reste déterministe pour un round donné', () => {
    expect(buildCheckpoint(pools, 2, 2)).toEqual(buildCheckpoint(pools, 2, 2));
  });
});
