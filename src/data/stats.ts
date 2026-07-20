/**
 * Statistiques — pures, déterministes et testables (aucune I/O, `now` injecté).
 *
 * Agrège l'état de progression en un tableau de bord : vue d'ensemble, maîtrise par
 * compétence + répartition des statuts, erreurs récurrentes à retravailler, et série
 * d'activité des N derniers jours (historique archivé + jour courant).
 *
 * Ne produit aucune donnée inventée : tout est dérivé de `ProgressState`. Une compétence
 * jamais commencée est `new` avec 0 %, jamais extrapolée.
 */
import { masteryStatus, errorCount, type MasteryStatus, type Skill } from '../engines/learning';
import type { ProgressState } from './repositories';
import { dayKey, todayActivity } from './gamification';
import { learningOf } from './learningStats';

const DAY_MS = 24 * 60 * 60 * 1000;

export const MASTERY_ORDER: MasteryStatus[] = ['new', 'learning', 'fragile', 'reviewing', 'strong', 'mastered'];

export interface SkillStat {
  id: string;
  name: string;
  mastery: number; // 0..1
  confidence: number; // 0..1
  status: MasteryStatus;
  xp: number;
  errors: number;
  started: boolean;
}

export interface RecurringError {
  tag: string;
  count: number;
  skillId: string;
  skillName: string;
}

export interface ActivityPoint {
  date: string; // YYYY-MM-DD
  xp: number;
  sessions: number;
  correct: number;
  isToday: boolean;
}

export interface Stats {
  level: number;
  totalXp: number;
  xpInLevel: number;
  coins: number;
  streakDays: number;
  completedCount: number;
  totalSkills: number;
  masteryDistribution: Record<MasteryStatus, number>;
  skills: SkillStat[];
  recurringErrors: RecurringError[];
  activity: ActivityPoint[];
  activeDays: number;
  windowXp: number;
  peakXp: number;
  /** Exploration cumulative (réussites « compréhension » V5). */
  exploration: { conceptsExplored: number; worldsExplored: number; falseSignalsSpotted: number; figuresRecognized: number };
}

export function computeStats(
  state: ProgressState,
  skills: Skill[],
  now: number,
  windowDays = 7,
): Stats {
  // ── Maîtrise par compétence + répartition ──────────────────────────
  const distribution: Record<MasteryStatus, number> = {
    new: 0,
    learning: 0,
    fragile: 0,
    reviewing: 0,
    strong: 0,
    mastered: 0,
  };
  const skillStats: SkillStat[] = skills.map((s) => {
    const sp = state.skills[s.id];
    const status = sp ? masteryStatus(sp) : 'new';
    distribution[status] += 1;
    const errors = sp ? errorCount(sp) : 0;
    return {
      id: s.id,
      name: s.name,
      mastery: sp?.mastery ?? 0,
      confidence: sp?.confidence ?? 0,
      status,
      xp: sp?.xp ?? 0,
      errors,
      started: Boolean(sp && (sp.xp > 0 || sp.mastery > 0 || errors > 0 || sp.review.repetitions > 0)),
    };
  });

  // ── Erreurs récurrentes (top, tous skills confondus) ───────────────
  const nameById = new Map(skills.map((s) => [s.id, s.name]));
  const recurringErrors: RecurringError[] = [];
  for (const [skillId, sp] of Object.entries(state.skills)) {
    for (const [tag, count] of Object.entries(sp.errorTags ?? {})) {
      if (count > 0) {
        recurringErrors.push({ tag, count, skillId, skillName: nameById.get(skillId) ?? skillId });
      }
    }
  }
  recurringErrors.sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));

  // ── Série d'activité des N derniers jours (historique + jour courant) ──
  const byDate = new Map<string, { xp: number; sessions: number; correct: number }>();
  for (const h of state.history) byDate.set(h.date, h);
  // Le jour non encore archivé (registre courant) prime sur l'historique.
  if (state.daily && state.daily.date) byDate.set(state.daily.date, state.daily);
  const today = dayKey(now);
  // Reflète le registre d'aujourd'hui même s'il est encore vide/stale.
  const liveToday = todayActivity(state, now);
  byDate.set(today, liveToday);

  const activity: ActivityPoint[] = [];
  for (let i = windowDays - 1; i >= 0; i--) {
    const date = dayKey(now - i * DAY_MS);
    const a = byDate.get(date);
    activity.push({
      date,
      xp: a?.xp ?? 0,
      sessions: a?.sessions ?? 0,
      correct: a?.correct ?? 0,
      isToday: date === today,
    });
  }

  const windowXp = activity.reduce((sum, a) => sum + a.xp, 0);
  const activeDays = activity.filter((a) => a.xp > 0 || a.sessions > 0).length;
  const peakXp = activity.reduce((max, a) => Math.max(max, a.xp), 0);

  const l = learningOf(state);
  const exploration = {
    conceptsExplored: l.conceptsExplored.length,
    worldsExplored: l.worldsExplored.length,
    falseSignalsSpotted: l.falseSignalsSpotted,
    figuresRecognized: l.figuresRecognized,
  };

  return {
    level: state.level,
    totalXp: state.totalXp,
    xpInLevel: state.totalXp % 100,
    coins: state.coins,
    streakDays: state.streakDays,
    completedCount: state.completedSkills.length,
    totalSkills: skills.length,
    masteryDistribution: distribution,
    skills: skillStats,
    recurringErrors,
    activity,
    activeDays,
    windowXp,
    peakXp,
    exploration,
  };
}
