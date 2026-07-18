import { describe, it, expect } from '@jest/globals';
import { sanitizeProps, sanitizeValue, isForbiddenKey, MAX_PROPS, MAX_STRING_LENGTH } from './privacy';

describe('isForbiddenKey', () => {
  it('repère les clés PII / financières (insensible à la casse)', () => {
    for (const k of ['email', 'userEmail', 'password', 'IBAN', 'cardNumber', 'balance', 'montant', 'accountId', 'brokerId']) {
      expect(isForbiddenKey(k)).toBe(true);
    }
  });
  it('laisse passer les métriques produit', () => {
    for (const k of ['skillId', 'grade', 'streakDays', 'plan', 'reward', 'level', 'score', 'category']) {
      expect(isForbiddenKey(k)).toBe(false);
    }
  });
});

describe('sanitizeValue', () => {
  it('garde booléens et nombres finis, rejette NaN/Infinity', () => {
    expect(sanitizeValue(true)).toBe(true);
    expect(sanitizeValue(42)).toBe(42);
    expect(sanitizeValue(NaN)).toBeUndefined();
    expect(sanitizeValue(Infinity)).toBeUndefined();
  });
  it('rédige une valeur qui ressemble à un e-mail', () => {
    expect(sanitizeValue('elio@example.com')).toBe('[redacted]');
  });
  it('borne la longueur des chaînes', () => {
    const long = 'x'.repeat(MAX_STRING_LENGTH + 50);
    expect((sanitizeValue(long) as string).length).toBe(MAX_STRING_LENGTH);
  });
  it('rejette les types non sérialisables', () => {
    expect(sanitizeValue({} as unknown)).toBeUndefined();
    expect(sanitizeValue(undefined)).toBeUndefined();
  });
});

describe('sanitizeProps', () => {
  it('retire les clés interdites et les valeurs invalides', () => {
    const out = sanitizeProps({ skillId: 'a', email: 'x@y.z', balance: 1000, grade: 3, note: undefined });
    expect(out).toEqual({ skillId: 'a', grade: 3 });
  });
  it('rédige un e-mail présent dans une valeur autorisée', () => {
    expect(sanitizeProps({ note: 'contact elio@example.com' }).note).toBe('[redacted]');
  });
  it('borne le nombre de propriétés', () => {
    const big: Record<string, number> = {};
    for (let i = 0; i < MAX_PROPS + 10; i++) big[`k${i}`] = i;
    expect(Object.keys(sanitizeProps(big)).length).toBe(MAX_PROPS);
  });
  it('props absentes → objet vide', () => {
    expect(sanitizeProps()).toEqual({});
  });
});
