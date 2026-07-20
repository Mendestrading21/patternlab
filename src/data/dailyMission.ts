/**
 * Mission du jour & sélection de révisions — logique pure et testable.
 * L'accueil ne présente qu'UNE action principale : cette mission.
 * Priorité : réviser une compétence due > apprendre la compétence courante > module terminé.
 */
import type { ProgressState } from './repositories';
import type { Skill } from '../engines/learning';
import { isDue } from '../engines/learning';

export type MissionKind = 'review' | 'learn' | 'done';

export interface DailyMission {
  kind: MissionKind;
  skillId: string | null;
  skillName: string;
  ctaLabel: string;
  subtitle: string;
}

/** Compétence courante = première non terminée (null si tout est terminé). */
export function selectCurrentSkill(state: ProgressState, skills: Skill[]): Skill | null {
  return skills.find((s) => !state.completedSkills.includes(s.id)) ?? null;
}

/** Compétences terminées dont la révision est due maintenant. */
export function selectDueReviews(state: ProgressState, skills: Skill[], now: number): Skill[] {
  return skills.filter(
    (s) =>
      state.completedSkills.includes(s.id) &&
      state.skills[s.id] != null &&
      isDue(state.skills[s.id].review, now),
  );
}

/** Construit l'unique action principale de l'accueil. */
export function buildDailyMission(state: ProgressState, skills: Skill[], now: number): DailyMission {
  const due = selectDueReviews(state, skills, now);
  if (due.length > 0) {
    const s = due[0];
    return {
      kind: 'review',
      skillId: s.id,
      skillName: s.name,
      ctaLabel: `Réviser — ${s.name}`,
      subtitle:
        due.length > 1
          ? `${due.length} compétences à consolider aujourd’hui.`
          : 'Une révision t’attend pour ancrer ta mémoire.',
    };
  }

  const current = selectCurrentSkill(state, skills);
  if (current) {
    return {
      kind: 'learn',
      skillId: current.id,
      skillName: current.name,
      ctaLabel: `Continuer — ${current.name}`,
      subtitle: 'Ta prochaine compétence du parcours « Lire un graphique ».',
    };
  }

  return {
    kind: 'done',
    skillId: null,
    skillName: '',
    ctaLabel: 'Revoir le parcours',
    subtitle: 'Tu as bouclé le module pilote. Tes révisions reviendront au bon moment.',
  };
}
