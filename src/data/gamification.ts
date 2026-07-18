/**
 * Gamification — pur, déterministe et testable (aucune I/O, `now` injecté).
 *
 * Trois piliers, sans schéma manipulateur (pas de vies punitives, pas de casino,
 * pas de classement par profits, pas de fausse urgence) :
 * - **Quêtes du jour** : mesurent l'activité RÉELLE d'aujourd'hui (registre remis à
 *   zéro chaque jour) et offrent une récompense en pièces internes, réclamée
 *   explicitement (idempotent, une fois par jour).
 * - **Jalons de série** : récompensent la régularité à des paliers, une seule fois.
 * - **Réussites** : détection des badges nouvellement obtenus (célébration + analytics).
 *
 * Séparation stricte (cf. skill) : XP = activité, coins = récompenses internes,
 * streak = régularité. La gamification ne touche jamais à la maîtrise.
 */
import { BADGES, earnedBadges, type Badge } from './badges';
import type { DailyActivity, ProgressState } from './repositories';

/** Nombre maximal de jours d'activité conservés dans l'historique. */
export const HISTORY_LIMIT = 60;

/** Clé de jour locale AAAA-MM-JJ (base du registre quotidien). */
export function dayKey(ts: number): string {
  return new Date(ts).toISOString().slice(0, 10);
}

export function emptyDaily(): DailyActivity {
  return { date: '', sessions: 0, correct: 0, xp: 0 };
}

/** Registre d'aujourd'hui (tout à zéro si le registre stocké date d'un autre jour). */
export function todayActivity(state: ProgressState, now: number): DailyActivity {
  const today = dayKey(now);
  const d = state.daily;
  return d && d.date === today ? d : { date: today, sessions: 0, correct: 0, xp: 0 };
}

/**
 * Bascule le registre (et les quêtes réclamées) sur le jour courant si nécessaire,
 * en **archivant** le jour précédent dans l'historique (base des statistiques). Pur.
 */
function rolled(state: ProgressState, now: number): ProgressState {
  const today = dayKey(now);
  if (state.daily && state.daily.date === today) return state;
  const prev = state.daily;
  let history = state.history ?? [];
  // Archive le jour écoulé s'il a une date réelle et une activité (évite les jours vides).
  if (prev && prev.date && (prev.xp > 0 || prev.sessions > 0 || prev.correct > 0)) {
    history = [
      ...history.filter((h) => h.date !== prev.date),
      { date: prev.date, sessions: prev.sessions, correct: prev.correct, xp: prev.xp },
    ].slice(-HISTORY_LIMIT);
  }
  return {
    ...state,
    history,
    daily: { date: today, sessions: 0, correct: 0, xp: 0 },
    claimedQuestIds: [],
  };
}

/** Ajoute l'activité d'une réponse (XP gagné aujourd'hui, réponse juste). Pur. */
export function recordActivity(
  state: ProgressState,
  { xpGained, correct }: { xpGained: number; correct: boolean },
  now: number,
): ProgressState {
  const s = rolled(state, now);
  return {
    ...s,
    daily: {
      ...s.daily,
      xp: s.daily.xp + Math.max(0, xpGained),
      correct: s.daily.correct + (correct ? 1 : 0),
    },
  };
}

/** Compte une session terminée aujourd'hui. Pur. */
export function recordSessionActivity(state: ProgressState, now: number): ProgressState {
  const s = rolled(state, now);
  return { ...s, daily: { ...s.daily, sessions: s.daily.sessions + 1 } };
}

// ─── Quêtes du jour ──────────────────────────────────────────────────
export interface QuestDef {
  id: string;
  label: string;
  icon: string;
  target: number;
  /** Récompense en pièces internes. */
  reward: number;
  progress: (d: DailyActivity) => number;
}

/** Trois quêtes stables, adossées au registre du jour (progrès réel, jamais simulé). */
export const DAILY_QUESTS: QuestDef[] = [
  { id: 'quest.session', label: 'Termine une session', icon: '🎯', target: 1, reward: 5, progress: (d) => d.sessions },
  { id: 'quest.correct5', label: 'Réussis 5 exercices', icon: '✅', target: 5, reward: 10, progress: (d) => d.correct },
  { id: 'quest.xp30', label: 'Gagne 30 XP aujourd’hui', icon: '⚡', target: 30, reward: 10, progress: (d) => d.xp },
];

export interface Quest {
  id: string;
  label: string;
  icon: string;
  progress: number;
  target: number;
  reward: number;
  done: boolean;
  claimed: boolean;
  claimable: boolean;
}

export function buildDailyQuests(state: ProgressState, now: number): Quest[] {
  const d = todayActivity(state, now);
  const isToday = state.daily && state.daily.date === dayKey(now);
  const claimed = new Set(isToday ? state.claimedQuestIds : []);
  return DAILY_QUESTS.map((q) => {
    const raw = q.progress(d);
    const done = raw >= q.target;
    const isClaimed = claimed.has(q.id);
    return {
      id: q.id,
      label: q.label,
      icon: q.icon,
      progress: Math.min(raw, q.target),
      target: q.target,
      reward: q.reward,
      done,
      claimed: isClaimed,
      claimable: done && !isClaimed,
    };
  });
}

export interface QuestClaim {
  state: ProgressState;
  claimed: boolean;
  reward: number;
}

/**
 * Réclame la récompense d'une quête terminée aujourd'hui.
 * Idempotent : une quête déjà réclamée (ou non terminée) ne crédite rien.
 */
export function claimQuest(state: ProgressState, questId: string, now: number): QuestClaim {
  const s = rolled(state, now);
  const def = DAILY_QUESTS.find((q) => q.id === questId);
  if (!def) return { state: s, claimed: false, reward: 0 };
  const done = def.progress(s.daily) >= def.target;
  const already = s.claimedQuestIds.includes(questId);
  if (!done || already) return { state: s, claimed: false, reward: 0 };
  return {
    state: { ...s, coins: s.coins + def.reward, claimedQuestIds: [...s.claimedQuestIds, questId] },
    claimed: true,
    reward: def.reward,
  };
}

// ─── Jalons de série ─────────────────────────────────────────────────
export const STREAK_MILESTONES = [3, 7, 14, 30, 60, 100] as const;
/** Pièces créditées par jalon de série franchi. */
export const STREAK_MILESTONE_REWARD = 15;

export interface StreakInfo {
  current: number;
  /** Prochain jalon (null si tous atteints). */
  next: number | null;
  /** Jours restants avant le prochain jalon (0 si aucun). */
  toGo: number;
  reachedMilestones: number[];
}

export function streakInfo(streakDays: number): StreakInfo {
  const next = STREAK_MILESTONES.find((m) => m > streakDays) ?? null;
  const reached = STREAK_MILESTONES.filter((m) => streakDays >= m);
  return { current: streakDays, next, toGo: next ? next - streakDays : 0, reachedMilestones: [...reached] };
}

export interface StreakReward {
  state: ProgressState;
  /** Jalons franchis à cet instant (nouvellement récompensés). */
  crossed: number[];
  reward: number;
}

/**
 * Crédite les jalons de série nouvellement franchis (idempotent via
 * `claimedStreakMilestones`). À appeler après mise à jour de `streakDays`. Pur.
 */
export function applyStreakMilestones(state: ProgressState): StreakReward {
  const claimed = new Set(state.claimedStreakMilestones);
  const newly = STREAK_MILESTONES.filter((m) => state.streakDays >= m && !claimed.has(m));
  if (newly.length === 0) return { state, crossed: [], reward: 0 };
  const reward = newly.length * STREAK_MILESTONE_REWARD;
  return {
    state: {
      ...state,
      coins: state.coins + reward,
      claimedStreakMilestones: [...state.claimedStreakMilestones, ...newly],
    },
    crossed: [...newly],
    reward,
  };
}

// ─── Réussites (badges) ──────────────────────────────────────────────
/** Badges nouvellement obtenus entre deux états (célébration + analytics). */
export function newlyEarnedBadges(prev: ProgressState | null, next: ProgressState | null): Badge[] {
  const before = earnedBadges(prev);
  const after = earnedBadges(next);
  return BADGES.filter((b) => after.has(b.id) && !before.has(b.id));
}
