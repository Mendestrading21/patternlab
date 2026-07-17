import { describe, it, expect } from '@jest/globals';
import { exercisesForMinutes, limitCount } from './sessionPlan';

describe('exercisesForMinutes', () => {
  it('module la longueur selon le temps quotidien', () => {
    expect(exercisesForMinutes(3)).toBe(3);
    expect(exercisesForMinutes(5)).toBe(5);
    expect(exercisesForMinutes(10)).toBe(8);
  });
});

describe('limitCount', () => {
  it('borne la cible à [1, disponible]', () => {
    expect(limitCount(5, 3)).toBe(3);
    expect(limitCount(5, 8)).toBe(5); // pas plus que disponible
    expect(limitCount(5, 0)).toBe(1); // au moins 1
  });
  it('sans cible → tout le disponible', () => {
    expect(limitCount(5, null)).toBe(5);
    expect(limitCount(5, NaN)).toBe(5);
  });
  it('liste vide → 0', () => {
    expect(limitCount(0, 3)).toBe(0);
  });
});
