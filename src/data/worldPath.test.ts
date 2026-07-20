import { describe, it, expect } from '@jest/globals';
import { buildWorldPath, worldsUnlocked, worldsCompleted, FREE_WORLDS } from './worldPath';
import { WORLDS } from './learningConcept';
import { V5_CONCEPTS } from './learningContent';

describe('buildWorldPath', () => {
  it('renvoie les 15 mondes triés par ordre', () => {
    const path = buildWorldPath(WORLDS, V5_CONCEPTS, []);
    expect(path).toHaveLength(WORLDS.length);
    for (let i = 1; i < path.length; i++) {
      expect(path[i].world.order).toBeGreaterThan(path[i - 1].world.order);
    }
  });

  it('sans exploration : les 3 premiers mondes sont débloqués, la suite verrouillée', () => {
    const path = buildWorldPath(WORLDS, V5_CONCEPTS, []);
    for (let i = 0; i < FREE_WORLDS; i++) expect(path[i].status).not.toBe('locked');
    expect(path[FREE_WORLDS].status).toBe('locked');
    // exactement un « en cours »
    expect(path.filter((n) => n.status === 'current')).toHaveLength(1);
  });

  it('explorer un concept du monde précédent débloque le suivant', () => {
    const path0 = buildWorldPath(WORLDS, V5_CONCEPTS, []);
    const gateWorld = path0[FREE_WORLDS - 1].world; // dernier monde libre
    const conceptInGate = V5_CONCEPTS.find((c) => c.worldId === gateWorld.id);
    expect(conceptInGate).toBeDefined();
    const path1 = buildWorldPath(WORLDS, V5_CONCEPTS, [conceptInGate!.slug]);
    expect(path1[FREE_WORLDS].status).not.toBe('locked');
    expect(worldsUnlocked(path1)).toBeGreaterThan(worldsUnlocked(path0));
  });

  it('compte les concepts explorés et calcule la progression', () => {
    const w = WORLDS.find((x) => V5_CONCEPTS.some((c) => c.worldId === x.id))!;
    const slugs = V5_CONCEPTS.filter((c) => c.worldId === w.id).map((c) => c.slug);
    const path = buildWorldPath(WORLDS, V5_CONCEPTS, slugs);
    const node = path.find((n) => n.world.id === w.id)!;
    expect(node.exploredCount).toBe(node.conceptCount);
    expect(node.progress).toBe(1);
    expect(node.status).toBe('done');
  });

  it('un monde entièrement exploré compte comme terminé', () => {
    const allSlugs = V5_CONCEPTS.map((c) => c.slug);
    const path = buildWorldPath(WORLDS, V5_CONCEPTS, allSlugs);
    // tous les mondes ayant du contenu sont terminés → au moins 1
    expect(worldsCompleted(path)).toBeGreaterThanOrEqual(1);
    expect(path.every((n) => n.status !== 'locked')).toBe(true);
  });
});
