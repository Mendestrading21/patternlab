import { describe, it, expect } from '@jest/globals';
import { CHARACTER_STATES, STATE_TO_EXPRESSION, mascotFor } from './states';

const EXPRESSIONS = ['happy', 'excited', 'thinking', 'concerned', 'sad', 'neutral'];
const CANONICAL = [
  'idle', 'welcome', 'explain', 'observe', 'think', 'debate', 'encourage', 'confused',
  'warning', 'wrong', 'false-signal', 'level-up', 'streak', 'review', 'rest', 'loading',
  'offline', 'premium', 'celebrate-small', 'celebrate-big',
] as const;

describe('registre d’états Toto/Bobo V2', () => {
  it('chaque état a une expression valide et une intensité', () => {
    for (const [state, spec] of Object.entries(CHARACTER_STATES)) {
      expect(EXPRESSIONS).toContain(spec.expression);
      expect(['still', 'subtle', 'lively']).toContain(spec.intensity);
      expect(spec.tone.length).toBeGreaterThan(0);
      // cohérence de la table dérivée
      expect(STATE_TO_EXPRESSION[state as keyof typeof STATE_TO_EXPRESSION]).toBe(spec.expression);
    }
  });

  it('couvre les états canoniques du skill', () => {
    for (const s of CANONICAL) {
      expect(CHARACTER_STATES[s]).toBeDefined();
    }
  });

  it('les états système ne s’animent pas (still)', () => {
    for (const s of ['idle', 'loading', 'offline', 'rest'] as const) {
      expect(CHARACTER_STATES[s].intensity).toBe('still');
    }
  });
});

describe('mascotFor', () => {
  it('le personnage explicite prime sur le défaut', () => {
    expect(mascotFor('warning', 'toto').character).toBe('toto');
  });
  it('utilise le personnage par défaut du registre', () => {
    expect(mascotFor('warning').character).toBe('bobo'); // prudence → Bobo
    expect(mascotFor('welcome').character).toBe('toto'); // accueil → Toto
  });
  it('retombe sur Toto quand aucun défaut', () => {
    expect(mascotFor('idle').character).toBe('toto');
  });
});
