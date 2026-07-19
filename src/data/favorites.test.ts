import { describe, it, expect } from '@jest/globals';
import { toggleInSet, pushRecent, RECENT_MAX } from './favorites';

describe('toggleInSet', () => {
  it('ajoute une clé absente', () => {
    const next = toggleInSet(new Set(['a']), 'b');
    expect([...next].sort()).toEqual(['a', 'b']);
  });

  it('retire une clé présente', () => {
    const next = toggleInSet(new Set(['a', 'b']), 'b');
    expect([...next]).toEqual(['a']);
  });

  it('ne mute pas l’ensemble source (pur)', () => {
    const src = new Set(['a']);
    const next = toggleInSet(src, 'b');
    expect([...src]).toEqual(['a']);
    expect(next).not.toBe(src);
  });
});

describe('pushRecent', () => {
  it('place le slug en tête', () => {
    expect(pushRecent(['a', 'b'], 'c')).toEqual(['c', 'a', 'b']);
  });

  it('déduplique en remontant en tête', () => {
    expect(pushRecent(['a', 'b', 'c'], 'c')).toEqual(['c', 'a', 'b']);
  });

  it('borne la liste à `max` (défaut RECENT_MAX)', () => {
    const long = Array.from({ length: RECENT_MAX }, (_, i) => `s${i}`);
    const next = pushRecent(long, 'new');
    expect(next).toHaveLength(RECENT_MAX);
    expect(next[0]).toBe('new');
    expect(next).not.toContain(`s${RECENT_MAX - 1}`);
  });

  it('respecte un `max` explicite', () => {
    expect(pushRecent(['a', 'b', 'c'], 'd', 2)).toEqual(['d', 'a']);
  });

  it('ne mute pas la liste source (pur)', () => {
    const src = ['a', 'b'];
    const next = pushRecent(src, 'c');
    expect(src).toEqual(['a', 'b']);
    expect(next).not.toBe(src);
  });
});
