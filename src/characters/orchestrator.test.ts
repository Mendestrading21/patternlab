import { describe, it, expect } from '@jest/globals';
import { resolveMascotState, pickReaction, isCelebration, type MascotEvent, type MascotReaction } from './orchestrator';
import { CHARACTER_STATES } from './states';

describe('resolveMascotState — événement → état', () => {
  const cases: [MascotEvent, string][] = [
    [{ type: 'lesson_started' }, 'welcome'],
    [{ type: 'concept_introduced' }, 'explain'],
    [{ type: 'chart_revealed' }, 'observe'],
    [{ type: 'answer_selected' }, 'think'],
    [{ type: 'answer_correct' }, 'celebrate-small'],
    [{ type: 'answer_incorrect' }, 'wrong'],
    [{ type: 'misconception_detected' }, 'false-signal'],
    [{ type: 'hint_requested' }, 'confused'],
    [{ type: 'retry_started' }, 'encourage'],
    [{ type: 'checkpoint_started' }, 'review'],
    [{ type: 'streak_earned' }, 'streak'],
    [{ type: 'level_completed' }, 'level-up'],
    [{ type: 'offline_detected' }, 'offline'],
  ];

  it('chaque événement produit l’état attendu', () => {
    for (const [event, state] of cases) {
      expect(resolveMascotState(event).state).toBe(state);
    }
  });

  it('une erreur / misconception déclenche Bobo (personnage prudent)', () => {
    expect(resolveMascotState({ type: 'answer_incorrect' }).character).toBe('bobo');
    expect(resolveMascotState({ type: 'misconception_detected' }).character).toBe('bobo');
    expect(resolveMascotState({ type: 'misconception_detected' }).state).toBe('false-signal');
  });

  it('une bonne réponse en série (≥ 3) devient « série »', () => {
    expect(resolveMascotState({ type: 'answer_correct', streak: 1 }).state).toBe('celebrate-small');
    expect(resolveMascotState({ type: 'answer_correct', streak: 3 }).state).toBe('streak');
  });

  it('la célébration est proportionnelle à l’événement', () => {
    const small = resolveMascotState({ type: 'answer_correct' });
    const big = resolveMascotState({ type: 'checkpoint_completed', passed: true });
    const level = resolveMascotState({ type: 'level_completed' });
    expect(big.priority).toBeGreaterThan(small.priority);
    expect(level.priority).toBeGreaterThanOrEqual(big.priority);
    expect(big.state).toBe('celebrate-big');
  });

  it('un checkpoint ÉCHOUÉ n’est jamais célébré (encouragement à la place)', () => {
    const failed = resolveMascotState({ type: 'checkpoint_completed', passed: false });
    expect(failed.state).toBe('encourage');
    expect(isCelebration(failed)).toBe(false);
  });

  it('la reprise de session ne rejoue PAS une célébration', () => {
    const resumed = resolveMascotState({ type: 'session_resumed' });
    expect(isCelebration(resumed)).toBe(false);
    expect(resumed.state).toBe('welcome');
  });

  it('aucune réaction ne produit BUY/SELL ou une promesse', () => {
    const allEvents: MascotEvent[] = [
      { type: 'lesson_started' }, { type: 'concept_introduced' }, { type: 'chart_revealed' },
      { type: 'answer_selected' }, { type: 'answer_correct', streak: 5 }, { type: 'answer_incorrect' },
      { type: 'misconception_detected' }, { type: 'hint_requested' }, { type: 'retry_started' },
      { type: 'checkpoint_started' }, { type: 'checkpoint_completed', passed: true }, { type: 'checkpoint_completed', passed: false },
      { type: 'streak_earned' }, { type: 'level_completed' }, { type: 'session_resumed' },
      { type: 'offline_detected' }, { type: 'online_restored' },
    ];
    const forbidden = /\b(buy|sell|achet|vend|profit garanti|gain garanti)\b/i;
    for (const e of allEvents) {
      const r = resolveMascotState(e);
      expect(r.accessibleText).not.toMatch(forbidden);
      expect(CHARACTER_STATES[r.state].tone).not.toMatch(forbidden);
    }
  });

  it('hors-ligne fonctionne sans réseau : état système « still » (avatar vectoriel inline)', () => {
    const off = resolveMascotState({ type: 'offline_detected' });
    expect(off.state).toBe('offline');
    expect(CHARACTER_STATES.offline.intensity).toBe('still');
    // Bobo (prudence / système) porte l'état hors-ligne, pas Toto.
    expect(off.character).toBe('bobo');
    expect(off.interruptible).toBe(false);
  });
});

describe('pickReaction — priorités empêchent deux réactions concurrentes', () => {
  const react = (event: MascotEvent): MascotReaction => resolveMascotState(event);

  it('une réaction non interruptible reste face à un événement moins prioritaire', () => {
    const big = react({ type: 'checkpoint_completed', passed: true }); // celebrate-big, non interruptible
    const small = react({ type: 'answer_correct' }); // celebrate-small, moindre priorité
    expect(pickReaction(big, small).state).toBe('celebrate-big');
  });

  it('un événement système critique (hors-ligne) écrase même une célébration', () => {
    const big = react({ type: 'checkpoint_completed', passed: true });
    const off = react({ type: 'offline_detected' });
    expect(pickReaction(big, off).state).toBe('offline');
  });

  it('sans réaction en cours, la nouvelle s’applique', () => {
    expect(pickReaction(null, react({ type: 'answer_incorrect' })).state).toBe('wrong');
  });

  it('une réaction interruptible cède à une priorité supérieure', () => {
    const explain = react({ type: 'concept_introduced' }); // priorité faible, interruptible
    const wrong = react({ type: 'answer_incorrect' }); // priorité supérieure
    expect(pickReaction(explain, wrong).state).toBe('wrong');
  });
});
