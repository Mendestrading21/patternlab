import { describe, it, expect } from '@jest/globals';
import { greetingFor } from './greeting';

describe('greetingFor', () => {
  it('choisit la salutation selon la tranche horaire', () => {
    expect(greetingFor(2)).toBe('Bonne nuit');
    expect(greetingFor(8)).toBe('Bonjour');
    expect(greetingFor(11)).toBe('Bonjour');
    expect(greetingFor(14)).toBe('Bon après-midi');
    expect(greetingFor(18)).toBe('Bonsoir');
    expect(greetingFor(23)).toBe('Bonsoir');
  });

  it('borne/assainit les heures invalides', () => {
    expect(greetingFor(26)).toBe(greetingFor(2)); // modulo 24
    expect(greetingFor(-1)).toBe(greetingFor(23));
    expect(greetingFor(Number.NaN)).toBe('Bon après-midi'); // défaut 12
  });
});
