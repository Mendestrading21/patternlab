/**
 * Favoris & « récemment vus » — logique pure et testable (aucune I/O).
 * Persistée par `glossaryPrefsRepository` ; exposée par le contexte de progression.
 */
export function toggleInSet(set: ReadonlySet<string>, key: string): Set<string> {
  const next = new Set(set);
  if (next.has(key)) next.delete(key);
  else next.add(key);
  return next;
}

export const RECENT_MAX = 12;

/** Ajoute `slug` en tête, dédupliqué, borné à `max` (le plus récent d'abord). */
export function pushRecent(list: readonly string[], slug: string, max = RECENT_MAX): string[] {
  return [slug, ...list.filter((s) => s !== slug)].slice(0, max);
}
