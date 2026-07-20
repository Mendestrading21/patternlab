/**
 * Carte des mondes V5 — vue de catalogue (pure, testable), distincte du parcours runtime.
 * Réconcilie le registre statique des 15 `WORLDS` (Lot 1) avec le contenu réellement présent
 * (concepts V5), sans dupliquer ni modifier le trail de progression (`worldMap.ts`).
 * Non destructif : additif ; les mondes sans contenu sont annoncés « à venir » (jamais masqués).
 */
import { conceptsByWorld, type World, type LearningConcept } from './learningConcept';

export interface WorldSummary {
  world: World;
  /** Nombre de concepts V5 rattachés à ce monde. */
  conceptCount: number;
  /** Slug du premier concept (pour naviguer vers sa fiche), ou null si vide. */
  firstConceptSlug: string | null;
  /** Le monde a-t-il au moins un concept ? */
  hasContent: boolean;
}

/** Résumé de chaque monde, trié par `order` croissant. */
export function buildWorldOverview(worlds: World[], concepts: LearningConcept[]): WorldSummary[] {
  return [...worlds]
    .sort((a, b) => a.order - b.order)
    .map((world) => {
      const cs = conceptsByWorld(concepts, world.id);
      return {
        world,
        conceptCount: cs.length,
        firstConceptSlug: cs[0]?.slug ?? null,
        hasContent: cs.length > 0,
      };
    });
}

/** Nombre de mondes disposant d'au moins un concept. */
export function worldsWithContent(summaries: WorldSummary[]): number {
  return summaries.filter((s) => s.hasContent).length;
}
