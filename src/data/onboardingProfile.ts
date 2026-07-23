/**
 * Profil d'onboarding — modèle versionné, pur et testable.
 * Stocke : objectif, niveau déclaré, temps quotidien, sujets, diagnostic,
 * compétence de départ (reprise) et schemaVersion (règle skill « modèle versionné »).
 * Aucune donnée personnelle, aucun compte : uniquement des préférences d'apprentissage locales.
 */
import type { Skill } from '../engines/learning';

export const ONBOARDING_SCHEMA_VERSION = 1;

export type Objective = 'debuter' | 'comprendre_graphiques' | 'reviser' | 'gerer_risque';
export type DeclaredLevel = 'debutant' | 'initie' | 'intermediaire';
export type DailyMinutes = 3 | 5 | 10;
export type Topic = 'actions' | 'tendance' | 'chandeliers' | 'figures';

export interface OnboardingProfile {
  schemaVersion: number;
  objective: Objective;
  level: DeclaredLevel;
  dailyMinutes: DailyMinutes;
  topics: Topic[];
  diagnosticDone: boolean;
  /** Score 0→1 si le diagnostic a été réalisé, sinon null. */
  diagnosticScore: number | null;
  /** Compétence de départ recommandée (point de reprise). */
  startSkillId: string;
  /** Guide préféré choisi à l'onboarding (Toto/Bobo) — optionnel, non destructif. */
  guide?: 'toto' | 'bobo';
  completedAt: string | null;
}

// ─── Métadonnées d'options (contenu centralisé, réutilisé par l'UI) ───
export const OBJECTIVES: { value: Objective; label: string; emoji: string }[] = [
  { value: 'debuter', label: 'Débuter de zéro', emoji: '🌱' },
  { value: 'comprendre_graphiques', label: 'Lire les graphiques', emoji: '📈' },
  { value: 'reviser', label: 'Réviser mes bases', emoji: '🔁' },
  { value: 'gerer_risque', label: 'Mieux cerner le risque', emoji: '🛡️' },
];

export const LEVELS: { value: DeclaredLevel; label: string; emoji: string; hint: string }[] = [
  { value: 'debutant', label: 'Débutant', emoji: '🐣', hint: 'Je pars de zéro.' },
  { value: 'initie', label: 'Initié', emoji: '📗', hint: 'Je connais quelques bases.' },
  { value: 'intermediaire', label: 'Intermédiaire', emoji: '📘', hint: 'Je veux consolider et aller plus loin.' },
];

export const DAILY_OPTIONS: { value: DailyMinutes; label: string; hint: string }[] = [
  { value: 3, label: '3 minutes', hint: 'Express' },
  { value: 5, label: '5 minutes', hint: 'Recommandé' },
  { value: 10, label: '10 minutes', hint: 'Intensif' },
];

export const TOPICS: { value: Topic; label: string; emoji: string; skillId: string }[] = [
  { value: 'actions', label: 'Comprendre une action', emoji: '🏢', skillId: 'skill.actions' },
  { value: 'tendance', label: 'Tendance & niveaux', emoji: '📊', skillId: 'skill.trend' },
  { value: 'chandeliers', label: 'Chandeliers japonais', emoji: '🕯️', skillId: 'skill.candles' },
  { value: 'figures', label: 'Figures chartistes', emoji: '🔺', skillId: 'skill.patterns' },
];

const LEVEL_BASE: Record<DeclaredLevel, number> = { debutant: 0, initie: 1, intermediaire: 2 };

/**
 * Recommande la compétence de départ.
 * Le niveau déclaré fixe un point de départ ; les sujets choisis peuvent le ramener
 * PLUS TÔT (réviser un prérequis) mais jamais sauter un prérequis (on ne dépasse pas
 * le point du niveau). Déterministe.
 */
export function recommendStartSkill(level: DeclaredLevel, topics: Topic[], skills: Skill[]): string {
  if (skills.length === 0) return '';
  const base = LEVEL_BASE[level] ?? 0;
  const topicIndices = topics
    .map((t) => skills.findIndex((s) => s.id === TOPICS.find((x) => x.value === t)?.skillId))
    .filter((i) => i >= 0);
  const earliest = topicIndices.length ? Math.min(...topicIndices) : base;
  const idx = Math.max(0, Math.min(skills.length - 1, Math.min(base, earliest)));
  return skills[idx].id;
}

/** Migre/normalise un profil persistant vers le schéma courant, ou null si irrécupérable. */
export function migrateOnboardingProfile(raw: unknown): OnboardingProfile | null {
  if (!raw || typeof raw !== 'object') return null;
  const p = raw as Partial<OnboardingProfile> & { schemaVersion?: number };
  if (typeof p.schemaVersion === 'number' && p.schemaVersion > ONBOARDING_SCHEMA_VERSION) return null;
  if (typeof p.startSkillId !== 'string' || p.startSkillId.length === 0) return null;

  const objectiveOk = OBJECTIVES.some((o) => o.value === p.objective);
  const levelOk = LEVELS.some((l) => l.value === p.level);
  const minutesOk = DAILY_OPTIONS.some((d) => d.value === p.dailyMinutes);
  const validTopics = new Set(TOPICS.map((t) => t.value));

  return {
    schemaVersion: ONBOARDING_SCHEMA_VERSION,
    objective: objectiveOk ? (p.objective as Objective) : 'debuter',
    level: levelOk ? (p.level as DeclaredLevel) : 'debutant',
    dailyMinutes: minutesOk ? (p.dailyMinutes as DailyMinutes) : 5,
    topics: Array.isArray(p.topics)
      ? p.topics.filter((t): t is Topic => validTopics.has(t as Topic))
      : [],
    diagnosticDone: Boolean(p.diagnosticDone),
    diagnosticScore: typeof p.diagnosticScore === 'number' ? p.diagnosticScore : null,
    startSkillId: p.startSkillId,
    guide: p.guide === 'toto' || p.guide === 'bobo' ? p.guide : undefined,
    completedAt: typeof p.completedAt === 'string' ? p.completedAt : null,
  };
}
