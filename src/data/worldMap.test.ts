import { describe, it, expect } from '@jest/globals';
import { buildWorldMap } from './worldMap';
import { CHECKPOINT_ID } from './seed';
import type { ProgressState } from './repositories';
import { PROGRESS_SCHEMA_VERSION } from './repositories';
import type { Skill } from '../engines/learning';

const T0 = 1_700_000_000_000;
const DAY_MS = 24 * 60 * 60 * 1000;
const SKILLS: Skill[] = [
  { id: 'a', name: 'A' },
  { id: 'b', name: 'B' },
  { id: 'c', name: 'C' },
];

function review(dueAt: number) {
  return { repetitions: 1, easiness: 2.5, intervalDays: 1, dueAt };
}
function base(overrides: Partial<ProgressState> = {}): ProgressState {
  return {
    onboarded: true, level: 1, totalXp: 0, streakDays: 0, coins: 0,
    completedSkills: [], skills: {}, schemaVersion: PROGRESS_SCHEMA_VERSION, ...overrides,
  };
}

describe('buildWorldMap', () => {
  it('état neuf : 1er nœud courant, suivants verrouillés, checkpoint verrouillé', () => {
    const m = buildWorldMap(base(), SKILLS, 'Lire un graphique', T0);
    expect(m.nodes.map((n) => n.status)).toEqual(['current', 'locked', 'locked', 'locked']);
    const cp = m.nodes[m.nodes.length - 1];
    expect(cp.kind).toBe('checkpoint');
    expect(cp.id).toBe(CHECKPOINT_ID);
    expect(cp.status).toBe('locked');
    expect(m.total).toBe(4);
    expect(m.completed).toBe(0);
  });

  it('progression : terminées done, prochaine current', () => {
    const m = buildWorldMap(base({ completedSkills: ['a'] }), SKILLS, 'M', T0);
    expect(m.nodes[0].status).toBe('done');
    expect(m.nodes[1].status).toBe('current');
    expect(m.nodes[2].status).toBe('locked');
  });

  it('une compétence terminée mais due est marquée « due »', () => {
    const state = base({
      completedSkills: ['a'],
      skills: { a: { skillId: 'a', xp: 10, mastery: 0.6, confidence: 0.5, review: review(T0 - DAY_MS) } },
    });
    expect(buildWorldMap(state, SKILLS, 'M', T0).nodes[0].status).toBe('due');
  });

  it('toutes les compétences terminées → checkpoint courant', () => {
    const m = buildWorldMap(base({ completedSkills: ['a', 'b', 'c'] }), SKILLS, 'M', T0);
    expect(m.nodes[m.nodes.length - 1].status).toBe('current');
  });

  it('checkpoint réalisé → checkpoint done', () => {
    const m = buildWorldMap(base({ completedSkills: ['a', 'b', 'c', CHECKPOINT_ID] }), SKILLS, 'M', T0);
    expect(m.nodes[m.nodes.length - 1].status).toBe('done');
  });
});
