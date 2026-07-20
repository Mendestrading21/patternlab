import { describe, it, expect } from '@jest/globals';
import {
  recommendStartSkill,
  migrateOnboardingProfile,
  ONBOARDING_SCHEMA_VERSION,
} from './onboardingProfile';
import type { Skill } from '../engines/learning';

const SKILLS: Skill[] = [
  { id: 'skill.actions', name: 'Actions' },
  { id: 'skill.trend', name: 'Tendance' },
  { id: 'skill.candles', name: 'Chandeliers' },
  { id: 'skill.patterns', name: 'Figures' },
];

describe('recommendStartSkill', () => {
  it('part du début pour un débutant', () => {
    expect(recommendStartSkill('debutant', [], SKILLS)).toBe('skill.actions');
  });
  it('avance selon le niveau déclaré', () => {
    expect(recommendStartSkill('initie', [], SKILLS)).toBe('skill.trend');
    expect(recommendStartSkill('intermediaire', [], SKILLS)).toBe('skill.candles');
  });
  it('un sujet peut ramener PLUS TÔT (réviser un prérequis)', () => {
    expect(recommendStartSkill('intermediaire', ['actions'], SKILLS)).toBe('skill.actions');
  });
  it('un sujet ne fait jamais sauter un prérequis (ne dépasse pas le niveau)', () => {
    // initié (base = trend) + sujet figures (plus loin) → reste à trend
    expect(recommendStartSkill('initie', ['figures'], SKILLS)).toBe('skill.trend');
  });
  it('renvoie une chaîne vide sans compétences', () => {
    expect(recommendStartSkill('debutant', [], [])).toBe('');
  });
});

describe('migrateOnboardingProfile', () => {
  it('rejette un non-objet ou un profil sans compétence de départ', () => {
    expect(migrateOnboardingProfile(null)).toBeNull();
    expect(migrateOnboardingProfile({ objective: 'debuter' })).toBeNull();
  });

  it('rejette un schéma futur inconnu', () => {
    expect(
      migrateOnboardingProfile({ schemaVersion: ONBOARDING_SCHEMA_VERSION + 1, startSkillId: 'skill.actions' }),
    ).toBeNull();
  });

  it('normalise un profil valide', () => {
    const m = migrateOnboardingProfile({
      objective: 'reviser',
      level: 'initie',
      dailyMinutes: 10,
      topics: ['actions', 'figures'],
      diagnosticDone: true,
      diagnosticScore: 0.66,
      startSkillId: 'skill.trend',
      completedAt: '2026-07-17T00:00:00.000Z',
    })!;
    expect(m.schemaVersion).toBe(ONBOARDING_SCHEMA_VERSION);
    expect(m.objective).toBe('reviser');
    expect(m.dailyMinutes).toBe(10);
    expect(m.topics).toEqual(['actions', 'figures']);
    expect(m.startSkillId).toBe('skill.trend');
  });

  it('coerce les valeurs invalides vers des défauts sûrs et filtre les sujets', () => {
    const m = migrateOnboardingProfile({
      objective: 'n’importe quoi',
      level: 'expert',
      dailyMinutes: 42,
      topics: ['actions', 'inconnu', 3],
      startSkillId: 'skill.actions',
    })!;
    expect(m.objective).toBe('debuter');
    expect(m.level).toBe('debutant');
    expect(m.dailyMinutes).toBe(5);
    expect(m.topics).toEqual(['actions']);
    expect(m.diagnosticScore).toBeNull();
  });
});
