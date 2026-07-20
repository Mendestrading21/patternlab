/**
 * Chemin des mondes — vue « parcours vertical vivant » (pure, testable).
 * Transforme les 15 `WORLDS` + le contenu réel + l'exploration de l'utilisateur en un chemin
 * façon Duolingo : chaque monde a une progression (concepts explorés / disponibles), un signal
 * visuel, et un statut (terminé / en cours / débloqué / verrouillé) avec **déblocage séquentiel**.
 * Non destructif : le trail runtime (`worldMap.ts`) et la vue catalogue (`worldOverview.ts`) restent.
 */
import { conceptsByWorld, type World, type LearningConcept, type VisualSpec } from './learningConcept';

export type WorldNodeStatus = 'done' | 'current' | 'unlocked' | 'locked';

export interface WorldPathNode {
  world: World;
  /** Concepts disponibles dans ce monde. */
  conceptCount: number;
  /** Concepts déjà explorés (slug présent dans l'exploration de l'utilisateur). */
  exploredCount: number;
  /** Progression 0–1 (0 si le monde est vide). */
  progress: number;
  /** Slug du premier concept (navigation), ou null. */
  firstConceptSlug: string | null;
  /** Un visuel représentatif du monde (signal visuel du nœud). */
  sampleSpec?: VisualSpec;
  status: WorldNodeStatus;
}

/** Nombre de mondes ouverts d'emblée (les fondations restent librement accessibles). */
export const FREE_WORLDS = 3;

/**
 * Construit le chemin. `exploredSlugs` = concepts explorés par l'utilisateur.
 * Déblocage : parmi les `FREE_WORLDS` premiers, ou dès que le monde précédent est **entamé**
 * (au moins un concept exploré). Le premier monde débloqué non terminé est « en cours ».
 */
export function buildWorldPath(
  worlds: World[],
  concepts: LearningConcept[],
  exploredSlugs: string[],
): WorldPathNode[] {
  const explored = new Set(exploredSlugs);
  const sorted = [...worlds].sort((a, b) => a.order - b.order);
  const nodes: WorldPathNode[] = [];
  let currentAssigned = false;

  for (let i = 0; i < sorted.length; i++) {
    const world = sorted[i];
    const cs = conceptsByWorld(concepts, world.id);
    const conceptCount = cs.length;
    const exploredCount = cs.filter((c) => explored.has(c.slug)).length;
    const prev = nodes[i - 1];
    const unlocked = i < FREE_WORLDS || (prev ? prev.exploredCount > 0 : true);

    let status: WorldNodeStatus;
    if (!unlocked) status = 'locked';
    else if (conceptCount > 0 && exploredCount >= conceptCount) status = 'done';
    else if (!currentAssigned) {
      status = 'current';
      currentAssigned = true;
    } else status = 'unlocked';

    nodes.push({
      world,
      conceptCount,
      exploredCount,
      progress: conceptCount > 0 ? exploredCount / conceptCount : 0,
      firstConceptSlug: cs[0]?.slug ?? null,
      sampleSpec: cs.find((c) => c.visualSpec)?.visualSpec,
      status,
    });
  }
  return nodes;
}

/** Nombre de mondes terminés (tous les concepts explorés). */
export function worldsCompleted(nodes: WorldPathNode[]): number {
  return nodes.filter((n) => n.status === 'done').length;
}

/** Nombre de mondes débloqués (non verrouillés). */
export function worldsUnlocked(nodes: WorldPathNode[]): number {
  return nodes.filter((n) => n.status !== 'locked').length;
}
