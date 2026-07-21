import { describe, it, expect } from '@jest/globals';
import {
  GUIDED_MODULES,
  isGuidedWorld,
  guidedModulesForWorld,
  isWorldDone,
  buildLearningPath,
  worldsOpen,
  worldsDone,
  worldEntryById,
  type LearningProgressInput,
} from './learningMap';
import { WORLDS, conceptsByWorld } from './learningConcept';
import { V5_CONCEPTS } from './learningContent';
import { SKILLS, CHECKPOINT_ID } from './seed';

const EMPTY: LearningProgressInput = { completedSkills: [], exploredSlugs: [] };
const WORLD1_DONE: LearningProgressInput = {
  completedSkills: [...SKILLS.map((s) => s.id), CHECKPOINT_ID],
  exploredSlugs: [],
};

const foundations = WORLDS.find((w) => w.id === 'world.foundations')!;

describe('learningMap — hiérarchie unique', () => {
  it('un seul module guidé : monde 1 = 4 compétences + checkpoint', () => {
    expect(GUIDED_MODULES).toHaveLength(1);
    const m = GUIDED_MODULES[0];
    expect(m.worldId).toBe('world.foundations');
    expect(m.skillIds).toEqual(SKILLS.map((s) => s.id));
    expect(m.checkpointId).toBe(CHECKPOINT_ID);
    expect(isGuidedWorld('world.foundations')).toBe(true);
    expect(isGuidedWorld('world.candles')).toBe(false);
    expect(guidedModulesForWorld('world.foundations')).toHaveLength(1);
  });

  it('nouvel utilisateur : seul le monde 1 est ouvert (en cours), le reste verrouillé', () => {
    const path = buildLearningPath(WORLDS, V5_CONCEPTS, EMPTY);
    expect(path).toHaveLength(WORLDS.length);
    const first = worldEntryById(path, 'world.foundations')!;
    expect(first.status).toBe('current');
    expect(first.guided).toBe(true);
    expect(worldsOpen(path)).toBe(1);
    expect(worldsDone(path)).toBe(0);
    const others = path.filter((e) => e.world.id !== 'world.foundations');
    expect(others.every((e) => e.status === 'locked')).toBe(true);
    expect(others.every((e) => typeof e.lockReason === 'string')).toBe(true);
  });

  it('checkpoint du monde 1 validé → monde 1 terminé, monde 2 ouvert', () => {
    const path = buildLearningPath(WORLDS, V5_CONCEPTS, WORLD1_DONE);
    const first = worldEntryById(path, 'world.foundations')!;
    expect(first.status).toBe('done');
    expect(first.progress).toBe(1);
    expect(worldsOpen(path)).toBeGreaterThanOrEqual(2);
    const second = [...path].sort((a, b) => a.world.order - b.world.order)[1];
    expect(second.status === 'current' || second.status === 'unlocked').toBe(true);
  });

  it('monde de contenu : terminé seulement quand toutes ses fiches sont vues', () => {
    const content = WORLDS.find(
      (w) => !isGuidedWorld(w.id) && conceptsByWorld(V5_CONCEPTS, w.id).length > 0,
    )!;
    const slugs = conceptsByWorld(V5_CONCEPTS, content.id).map((c) => c.slug);
    expect(isWorldDone(content, V5_CONCEPTS, { completedSkills: [], exploredSlugs: [] })).toBe(false);
    expect(isWorldDone(content, V5_CONCEPTS, { completedSkills: [], exploredSlugs: slugs.slice(0, -1) })).toBe(false);
    expect(isWorldDone(content, V5_CONCEPTS, { completedSkills: [], exploredSlugs: slugs })).toBe(true);
  });

  it('la visite seule ne valide jamais le monde guidé (maîtrise ≠ visite)', () => {
    const slugs = conceptsByWorld(V5_CONCEPTS, 'world.foundations').map((c) => c.slug);
    // Explorer toutes les fiches du monde 1 ne suffit pas : il faut le checkpoint.
    expect(isWorldDone(foundations, V5_CONCEPTS, { completedSkills: [], exploredSlugs: slugs })).toBe(false);
  });
});
