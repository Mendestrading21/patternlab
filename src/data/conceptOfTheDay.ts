/**
 * « Concept du jour » — sélection PURE et déterministe (aucune I/O, `now` injecté).
 * Fait tourner le corpus de concepts (ceux qui portent un visuel) : un concept par jour,
 * identique pour tout le monde le même jour, différent le lendemain. Hook de rétention +
 * signal visuel sur l'accueil. Aucune donnée personnelle ; purement éducatif.
 */
import type { LearningConcept } from './learningConcept';

/** Numéro de jour (UTC) déterministe à partir d'un timestamp en millisecondes. */
export function dayNumber(now: number): number {
  return Math.floor((Number.isFinite(now) ? now : 0) / 86_400_000);
}

/** Concept mis en avant aujourd'hui (rotation déterministe), ou null si aucun visuel. */
export function conceptOfTheDay(concepts: LearningConcept[], now: number): LearningConcept | null {
  const pool = concepts.filter((c) => c.visualSpec);
  if (!pool.length) return null;
  const i = ((dayNumber(now) % pool.length) + pool.length) % pool.length;
  return pool[i];
}
