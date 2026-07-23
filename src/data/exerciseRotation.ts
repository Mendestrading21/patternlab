// ─── Rotation déterministe des exercices ────────────────────────────────
// Remplace la sélection figée « premiers N » par une fenêtre glissante
// déterministe : à chaque session, `round` avance et la fenêtre tourne, si
// bien que l'apprenant finit par voir tout le pool au lieu de répéter les
// mêmes premiers exercices. Pur et testable ; aucune source d'aléa.

/**
 * Page déterministe de `count` éléments dans `all` : round 0 → première page,
 * round 1 → page suivante (non chevauchante), etc. La fenêtre avance de `count`
 * crans par round, si bien que quelques rounds couvrent tout le pool sans
 * répéter la même première page.
 */
export function rotateExercises<T>(all: readonly T[], count: number, round: number): T[] {
  const n = all.length;
  if (n === 0 || count <= 0) return [];
  const take = Math.min(count, n);
  const start = ((Math.trunc(round) * take) % n + n) % n; // début de page borné [0, n)
  const out: T[] = [];
  for (let i = 0; i < take; i += 1) out.push(all[(start + i) % n]);
  return out;
}

/** Nombre de rounds nécessaires pour couvrir tout le pool avec une fenêtre de `count`. */
export function roundsToCover(poolSize: number, count: number): number {
  if (poolSize <= 0 || count <= 0) return 0;
  return Math.ceil(poolSize / Math.min(count, poolSize));
}

/**
 * Construit un checkpoint tournant : `perSkill` exercices par compétence, la
 * fenêtre tournant avec `round`. Les questions ne sont donc jamais figées d'un
 * checkpoint à l'autre, et plusieurs compétences (donc plusieurs objectifs)
 * sont couvertes à chaque passage.
 */
export function buildCheckpoint<T>(pools: readonly (readonly T[])[], perSkill: number, round: number): T[] {
  return pools.flatMap((pool) => rotateExercises(pool, perSkill, round));
}
