import { describe, it, expect } from '@jest/globals';
import { CHARACTER_STATES, STATE_TO_EXPRESSION, STATE_TO_DURATION, mascotFor, statePriority } from './states';
import { motion } from '../design-system/tokens';

const EXPRESSIONS = ['happy', 'excited', 'thinking', 'concerned', 'sad', 'neutral'];
const CANONICAL = [
  'idle', 'welcome', 'explain', 'observe', 'think', 'point', 'debate', 'encourage', 'confused',
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

describe('métadonnées d’orchestration (LOT 2)', () => {
  it('chaque état porte trigger, priorité, durée-token, interruptible, retour-idle et texte accessible', () => {
    for (const [state, spec] of Object.entries(CHARACTER_STATES)) {
      expect(spec.trigger.length).toBeGreaterThan(0);
      expect(typeof spec.priority).toBe('number');
      expect(spec.priority).toBeGreaterThanOrEqual(0);
      expect(Object.keys(motion)).toContain(spec.duration); // durée = token motion réel
      expect(typeof spec.interruptible).toBe('boolean');
      expect(typeof spec.returnsToIdle).toBe('boolean');
      expect(spec.accessibleText.length).toBeGreaterThan(0);
      // texte accessible : jamais « image de » (règle canon)
      expect(spec.accessibleText.toLowerCase()).not.toContain('image de');
      // audio toujours absent par défaut (jamais de voix automatique)
      expect(spec.audio).toBeUndefined();
      expect(state in STATE_TO_DURATION).toBe(true);
    }
  });

  it('offline est prioritaire sur tout et non interruptible (système critique)', () => {
    const others = Object.entries(CHARACTER_STATES).filter(([s]) => s !== 'offline');
    for (const [, spec] of others) expect(CHARACTER_STATES.offline.priority).toBeGreaterThan(spec.priority);
    expect(CHARACTER_STATES.offline.interruptible).toBe(false);
  });

  it('les grandes célébrations se jouent jusqu’au bout (non interruptibles)', () => {
    for (const s of ['celebrate-big', 'streak', 'level-up'] as const) {
      expect(CHARACTER_STATES[s].interruptible).toBe(false);
      expect(CHARACTER_STATES[s].duration).toBe('celebration');
    }
  });

  it('la célébration forte est plus prioritaire que la petite (proportionnalité)', () => {
    expect(statePriority('celebrate-big')).toBeGreaterThan(statePriority('celebrate-small'));
    expect(statePriority('level-up')).toBeGreaterThan(statePriority('streak'));
  });

  it('les réactions ponctuelles reviennent à idle ; les contextes maintenus non', () => {
    expect(CHARACTER_STATES['celebrate-small'].returnsToIdle).toBe(true);
    expect(CHARACTER_STATES.wrong.returnsToIdle).toBe(true);
    expect(CHARACTER_STATES.explain.returnsToIdle).toBe(false); // contexte maintenu
    expect(CHARACTER_STATES.review.returnsToIdle).toBe(false);
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
