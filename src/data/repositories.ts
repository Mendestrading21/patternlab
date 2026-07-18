/**
 * Persistance locale abstraite (repository interfaces).
 * P0.1 : AsyncStorage. Migration possible vers Expo SQLite plus tard sans changer les appelants (ADR-003).
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initialReview, levelForXp, type SkillProgress } from '../engines/learning';
import { migrateOnboardingProfile, type OnboardingProfile } from './onboardingProfile';

/** Registre d'activité du jour (base des quêtes ; remis à zéro chaque jour). */
export interface DailyActivity {
  /** Jour du registre (YYYY-MM-DD) ; '' = jamais actif. */
  date: string;
  sessions: number;
  correct: number;
  xp: number;
}

export interface ProgressState {
  onboarded: boolean;
  level: number;
  totalXp: number;
  streakDays: number;
  coins: number;
  /** Dernier jour d'activité (YYYY-MM-DD) pour le calcul de la série. */
  lastActiveDate?: string;
  /** Compétences terminées (au moins une session validée), pour débloquer le parcours. */
  completedSkills: string[];
  skills: Record<string, SkillProgress>;
  /** Activité du jour (schéma v4) — alimente les quêtes quotidiennes. */
  daily: DailyActivity;
  /** Ids de quêtes du jour déjà récompensées (schéma v4 ; réinitialisé chaque jour). */
  claimedQuestIds: string[];
  /** Jalons de série déjà récompensés (schéma v4 ; jamais deux fois). */
  claimedStreakMilestones: number[];
  schemaVersion: number;
}

export const PROGRESS_SCHEMA_VERSION = 4;

export interface ProgressRepository {
  load(): Promise<ProgressState | null>;
  save(state: ProgressState): Promise<void>;
  reset(): Promise<void>;
}

const STORAGE_KEY = 'patternlab.progress.v1';

function migrateSkills(raw: unknown, now: number): Record<string, SkillProgress> {
  if (!raw || typeof raw !== 'object') return {};
  const out: Record<string, SkillProgress> = {};
  for (const [id, value] of Object.entries(raw as Record<string, unknown>)) {
    const s = (value ?? {}) as Partial<SkillProgress>;
    const review = s.review;
    // errorTags (schéma v3) : ne garder que les entrées {string: number ≥ 0}.
    const rawTags = s.errorTags;
    const errorTags: Record<string, number> = {};
    if (rawTags && typeof rawTags === 'object') {
      for (const [tag, n] of Object.entries(rawTags as Record<string, unknown>)) {
        if (typeof n === 'number' && Number.isFinite(n) && n > 0) errorTags[tag] = n;
      }
    }
    out[id] = {
      skillId: typeof s.skillId === 'string' ? s.skillId : id,
      xp: typeof s.xp === 'number' && s.xp >= 0 ? s.xp : 0,
      mastery: typeof s.mastery === 'number' ? Math.max(0, Math.min(1, s.mastery)) : 0,
      confidence: typeof s.confidence === 'number' ? Math.max(0, Math.min(1, s.confidence)) : 0,
      review:
        review && typeof review.dueAt === 'number' && typeof review.easiness === 'number'
          ? review
          : initialReview(now),
      errorTags,
    };
  }
  return out;
}

/**
 * Migre un état persistant vers le schéma courant SANS perte de progression.
 * - complète les champs manquants (anciens schémas / données partielles) ;
 * - recalcule toujours le niveau depuis l'XP total (cohérence garantie) ;
 * - renvoie `null` seulement si les données sont irrécupérables ou proviennent
 *   d'un schéma FUTUR inconnu (on ne sait pas rétro-migrer en toute sûreté).
 */
export function migrateProgress(raw: unknown, now: number): ProgressState | null {
  if (!raw || typeof raw !== 'object') return null;
  const p = raw as Partial<ProgressState> & { schemaVersion?: number };
  if (typeof p.schemaVersion === 'number' && p.schemaVersion > PROGRESS_SCHEMA_VERSION) {
    return null;
  }
  const totalXp = typeof p.totalXp === 'number' && p.totalXp >= 0 ? p.totalXp : 0;
  return {
    onboarded: Boolean(p.onboarded),
    totalXp,
    level: levelForXp(totalXp),
    streakDays: typeof p.streakDays === 'number' && p.streakDays >= 0 ? p.streakDays : 0,
    coins: typeof p.coins === 'number' && p.coins >= 0 ? p.coins : 0,
    lastActiveDate: typeof p.lastActiveDate === 'string' ? p.lastActiveDate : undefined,
    completedSkills: Array.isArray(p.completedSkills)
      ? p.completedSkills.filter((x): x is string => typeof x === 'string')
      : [],
    skills: migrateSkills(p.skills, now),
    daily: migrateDaily(p.daily),
    claimedQuestIds: Array.isArray(p.claimedQuestIds)
      ? p.claimedQuestIds.filter((x): x is string => typeof x === 'string')
      : [],
    claimedStreakMilestones: Array.isArray(p.claimedStreakMilestones)
      ? p.claimedStreakMilestones.filter((x): x is number => typeof x === 'number' && Number.isFinite(x))
      : [],
    schemaVersion: PROGRESS_SCHEMA_VERSION,
  };
}

/** Assainit le registre du jour (schéma v4) ; défaut vide si absent/corrompu. */
function migrateDaily(raw: unknown): DailyActivity {
  const empty: DailyActivity = { date: '', sessions: 0, correct: 0, xp: 0 };
  if (!raw || typeof raw !== 'object') return empty;
  const d = raw as Partial<DailyActivity>;
  const num = (n: unknown) => (typeof n === 'number' && Number.isFinite(n) && n >= 0 ? n : 0);
  return {
    date: typeof d.date === 'string' ? d.date : '',
    sessions: num(d.sessions),
    correct: num(d.correct),
    xp: num(d.xp),
  };
}

export class AsyncStorageProgressRepository implements ProgressRepository {
  async load(): Promise<ProgressState | null> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return migrateProgress(JSON.parse(raw), Date.now());
    } catch {
      return null;
    }
  }

  async save(state: ProgressState): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  async reset(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEY);
  }
}

// ─── Profil d'onboarding (modèle versionné séparé) ───────────────────
const ONBOARDING_KEY = 'patternlab.onboarding.v1';

export interface OnboardingRepository {
  load(): Promise<OnboardingProfile | null>;
  save(profile: OnboardingProfile): Promise<void>;
  reset(): Promise<void>;
}

export class AsyncStorageOnboardingRepository implements OnboardingRepository {
  async load(): Promise<OnboardingProfile | null> {
    try {
      const raw = await AsyncStorage.getItem(ONBOARDING_KEY);
      if (!raw) return null;
      return migrateOnboardingProfile(JSON.parse(raw));
    } catch {
      return null;
    }
  }

  async save(profile: OnboardingProfile): Promise<void> {
    await AsyncStorage.setItem(ONBOARDING_KEY, JSON.stringify(profile));
  }

  async reset(): Promise<void> {
    await AsyncStorage.removeItem(ONBOARDING_KEY);
  }
}

export const onboardingRepository: OnboardingRepository = new AsyncStorageOnboardingRepository();

/** Implémentation mémoire (tests / fallback). */
export class InMemoryProgressRepository implements ProgressRepository {
  private state: ProgressState | null = null;
  async load(): Promise<ProgressState | null> {
    return this.state;
  }
  async save(state: ProgressState): Promise<void> {
    this.state = state;
  }
  async reset(): Promise<void> {
    this.state = null;
  }
}

export const progressRepository: ProgressRepository = new AsyncStorageProgressRepository();
