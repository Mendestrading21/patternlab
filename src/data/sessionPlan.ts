/**
 * Planification de session — pure et testable.
 * Le temps quotidien choisi à l'onboarding module la longueur d'une session
 * (mission du jour). Aucune donnée personnelle : une simple préférence locale.
 */
import type { DailyMinutes } from './onboardingProfile';

/** Nombre d'exercices visé pour une session selon le temps quotidien. */
export function exercisesForMinutes(minutes: DailyMinutes): number {
  switch (minutes) {
    case 3:
      return 3;
    case 10:
      return 8;
    default:
      return 5; // 5 min — recommandé
  }
}

/** Applique une longueur cible à une liste d'exercices (bornée à [1, longueur réelle]). */
export function limitCount(available: number, target: number | null): number {
  if (available <= 0) return 0;
  if (target == null || !Number.isFinite(target)) return available;
  return Math.max(1, Math.min(available, Math.floor(target)));
}
