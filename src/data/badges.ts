/** Réussites (badges) — dérivées de la progression réelle. */
import type { ProgressState } from './repositories';

export interface Badge {
  id: string;
  name: string;
  emoji: string;
  description: string;
  earned: (s: ProgressState) => boolean;
}

export const BADGES: Badge[] = [
  { id: 'first-step', name: 'Premier pas', emoji: '👣', description: 'Tu as démarré PatternLab.', earned: (s) => s.onboarded },
  { id: 'first-skill', name: 'Première compétence', emoji: '🎓', description: 'Termine ta première compétence.', earned: (s) => s.completedSkills.length >= 1 },
  { id: 'streak-3', name: 'Série de 3', emoji: '🔥', description: 'Reviens 3 jours d’affilée.', earned: (s) => s.streakDays >= 3 },
  { id: 'explorer', name: 'Explorateur', emoji: '🧭', description: 'Atteins le niveau 2.', earned: (s) => s.level >= 2 },
  { id: 'collector', name: 'Collectionneur', emoji: '🪙', description: 'Amasse 50 pièces.', earned: (s) => s.coins >= 50 },
  { id: 'studious', name: 'Studieux', emoji: '📚', description: 'Gagne 100 XP au total.', earned: (s) => s.totalXp >= 100 },
  { id: 'mastery', name: 'Maîtrise', emoji: '🧠', description: 'Atteins 80 % de maîtrise sur une compétence.', earned: (s) => Object.values(s.skills).some((sk) => sk.mastery >= 0.8) },
  { id: 'module-done', name: 'Module bouclé', emoji: '🏔️', description: 'Termine les 4 compétences du module.', earned: (s) => s.completedSkills.length >= 4 },
];

export function earnedBadges(state: ProgressState | null): Set<string> {
  if (!state) return new Set();
  return new Set(BADGES.filter((b) => b.earned(state)).map((b) => b.id));
}
