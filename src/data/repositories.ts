/**
 * Persistance locale abstraite (repository interfaces).
 * P0.1 : AsyncStorage. Migration possible vers Expo SQLite plus tard sans changer les appelants (ADR-003).
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initialReview, levelForXp, type SkillProgress } from '../engines/learning';
import { migrateOnboardingProfile, type OnboardingProfile } from './onboardingProfile';
import { emptyPremium, migratePremium, type PremiumState } from './premium';
import type { TargetProgress } from './targetProgress';

/** Registre d'activité du jour (base des quêtes ; remis à zéro chaque jour). */
export interface DailyActivity {
  /** Jour du registre (YYYY-MM-DD) ; '' = jamais actif. */
  date: string;
  sessions: number;
  correct: number;
  xp: number;
}

/** Instantané d'un jour d'activité archivé (base de l'historique des statistiques). */
export interface DailySnapshot {
  date: string;
  sessions: number;
  correct: number;
  xp: number;
}

/**
 * Statistiques d'apprentissage cumulatives (schéma v6) — base des réussites V5 « compréhension ».
 * Récompensent la compréhension, la diversité et le repérage des faux signaux (jamais des gains ni
 * de la vitesse). Aucune donnée personnelle : uniquement des compteurs de progression locale.
 */
export interface LearningStats {
  /** Slugs de concepts distincts consultés (cumulatif). */
  conceptsExplored: string[];
  /** Ids de mondes distincts explorés (cumulatif). */
  worldsExplored: string[];
  /** Faux signaux / invalidations correctement repérés (cumulatif). */
  falseSignalsSpotted: number;
  /** Figures correctement reconnues à l'entraîneur (cumulatif, schéma v7). */
  figuresRecognized: number;
  /** Meilleure série de reconnaissance atteinte (schéma v7). */
  bestRecognitionStreak: number;
}

export function emptyLearning(): LearningStats {
  return { conceptsExplored: [], worldsExplored: [], falseSignalsSpotted: 0, figuresRecognized: 0, bestRecognitionStreak: 0 };
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
  /** Historique des jours d'activité archivés (schéma v5) — base des statistiques. */
  history: DailySnapshot[];
  /** Compteurs d'apprentissage cumulatifs (schéma v6) — réussites « compréhension » V5. */
  learning?: LearningStats;
  /** Progression par cible pédagogique (schéma v8) : objectiveId → progression SM-2 propre. */
  targets?: Record<string, TargetProgress>;
  /** Compteur de rotation par compétence/checkpoint (schéma v8) : monotone, indépendant des
   * répétitions SM-2 (qu'un échec remet à zéro) → les variantes tournent même après un échec. */
  rotation?: Record<string, number>;
  schemaVersion: number;
}

export const PROGRESS_SCHEMA_VERSION = 8;

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
    history: migrateHistory(p.history),
    learning: migrateLearning(p.learning),
    targets: migrateTargets(p.targets, now),
    rotation: migrateRotation(p.rotation),
    schemaVersion: PROGRESS_SCHEMA_VERSION,
  };
}

/** Assainit la progression par cible (schéma v8) ; défaut {} ; nombres bornés, review valide. */
function migrateTargets(raw: unknown, now: number): Record<string, TargetProgress> {
  if (!raw || typeof raw !== 'object') return {};
  const out: Record<string, TargetProgress> = {};
  const nat = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) && v >= 0 ? Math.floor(v) : 0);
  for (const [id, value] of Object.entries(raw as Record<string, unknown>)) {
    const t = (value ?? {}) as Partial<TargetProgress>;
    const review = t.review;
    out[id] = {
      objectiveId: typeof t.objectiveId === 'string' ? t.objectiveId : id,
      conceptId: typeof t.conceptId === 'string' ? t.conceptId : '',
      attempts: nat(t.attempts),
      correct: nat(t.correct),
      sessions: nat(t.sessions),
      lastCorrect: Boolean(t.lastCorrect),
      review:
        review && typeof review.dueAt === 'number' && typeof review.easiness === 'number'
          ? review
          : initialReview(now),
    };
  }
  return out;
}

/** Assainit le compteur de rotation (schéma v8) ; défaut {} ; entiers ≥ 0. */
function migrateRotation(raw: unknown): Record<string, number> {
  if (!raw || typeof raw !== 'object') return {};
  const out: Record<string, number> = {};
  for (const [id, value] of Object.entries(raw as Record<string, unknown>)) {
    if (typeof value === 'number' && Number.isFinite(value) && value >= 0) out[id] = Math.floor(value);
  }
  return out;
}

/** Assainit les compteurs d'apprentissage (schéma v6) ; défaut vide, chaînes/nombres valides. */
function migrateLearning(raw: unknown): LearningStats {
  const empty = emptyLearning();
  if (!raw || typeof raw !== 'object') return empty;
  const l = raw as Partial<LearningStats>;
  const strings = (v: unknown) =>
    Array.isArray(v) ? [...new Set(v.filter((x): x is string => typeof x === 'string'))] : [];
  const count = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) && v >= 0 ? Math.floor(v) : 0);
  return {
    conceptsExplored: strings(l.conceptsExplored),
    worldsExplored: strings(l.worldsExplored),
    falseSignalsSpotted: count(l.falseSignalsSpotted),
    figuresRecognized: count(l.figuresRecognized),
    bestRecognitionStreak: count(l.bestRecognitionStreak),
  };
}

/** Assainit l'historique (schéma v5) ; ne garde que des instantanés datés valides. */
function migrateHistory(raw: unknown): DailySnapshot[] {
  if (!Array.isArray(raw)) return [];
  const num = (n: unknown) => (typeof n === 'number' && Number.isFinite(n) && n >= 0 ? n : 0);
  return raw
    .filter((h): h is Record<string, unknown> => Boolean(h) && typeof h === 'object')
    .filter((h) => typeof h.date === 'string' && (h.date as string).length > 0)
    .map((h) => ({
      date: h.date as string,
      sessions: num(h.sessions),
      correct: num(h.correct),
      xp: num(h.xp),
    }));
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

// ─── Entitlement Premium (démo locale, aucun achat réel) ─────────────
const PREMIUM_KEY = 'patternlab.premium.v1';

export interface PremiumRepository {
  load(): Promise<PremiumState>;
  save(state: PremiumState): Promise<void>;
  reset(): Promise<void>;
}

export class AsyncStoragePremiumRepository implements PremiumRepository {
  async load(): Promise<PremiumState> {
    try {
      const raw = await AsyncStorage.getItem(PREMIUM_KEY);
      if (!raw) return emptyPremium();
      return migratePremium(JSON.parse(raw));
    } catch {
      return emptyPremium();
    }
  }

  async save(state: PremiumState): Promise<void> {
    await AsyncStorage.setItem(PREMIUM_KEY, JSON.stringify(state));
  }

  async reset(): Promise<void> {
    await AsyncStorage.removeItem(PREMIUM_KEY);
  }
}

export const premiumRepository: PremiumRepository = new AsyncStoragePremiumRepository();

// ─── Consentement analytics (opt-out, respect de la vie privée) ──────
const CONSENT_KEY = 'patternlab.consent.v1';

export interface ConsentRepository {
  /** Consentement au suivi d'usage (true par défaut ; opt-out). */
  load(): Promise<boolean>;
  save(enabled: boolean): Promise<void>;
  reset(): Promise<void>;
}

export class AsyncStorageConsentRepository implements ConsentRepository {
  async load(): Promise<boolean> {
    try {
      const raw = await AsyncStorage.getItem(CONSENT_KEY);
      if (!raw) return true;
      const parsed = JSON.parse(raw) as { analytics?: unknown };
      return typeof parsed?.analytics === 'boolean' ? parsed.analytics : true;
    } catch {
      return true;
    }
  }

  async save(enabled: boolean): Promise<void> {
    await AsyncStorage.setItem(CONSENT_KEY, JSON.stringify({ analytics: enabled }));
  }

  async reset(): Promise<void> {
    await AsyncStorage.removeItem(CONSENT_KEY);
  }
}

export const consentRepository: ConsentRepository = new AsyncStorageConsentRepository();

// ─── Préférences du glossaire (favoris, récemment vus) ───────────────
const GLOSSARY_PREFS_KEY = 'patternlab.glossaryprefs.v1';

export interface GlossaryPrefs {
  favorites: string[];
  recent: string[];
}

export interface GlossaryPrefsRepository {
  load(): Promise<GlossaryPrefs>;
  save(prefs: GlossaryPrefs): Promise<void>;
  reset(): Promise<void>;
}

export class AsyncStorageGlossaryPrefsRepository implements GlossaryPrefsRepository {
  async load(): Promise<GlossaryPrefs> {
    const empty: GlossaryPrefs = { favorites: [], recent: [] };
    try {
      const raw = await AsyncStorage.getItem(GLOSSARY_PREFS_KEY);
      if (!raw) return empty;
      const p = JSON.parse(raw) as Partial<GlossaryPrefs>;
      const strings = (v: unknown) =>
        Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [];
      return { favorites: strings(p.favorites), recent: strings(p.recent) };
    } catch {
      return empty;
    }
  }

  async save(prefs: GlossaryPrefs): Promise<void> {
    await AsyncStorage.setItem(GLOSSARY_PREFS_KEY, JSON.stringify(prefs));
  }

  async reset(): Promise<void> {
    await AsyncStorage.removeItem(GLOSSARY_PREFS_KEY);
  }
}

export const glossaryPrefsRepository: GlossaryPrefsRepository = new AsyncStorageGlossaryPrefsRepository();

// ─── Reprise de session (position exacte, effacée en fin de session) ─
const SESSION_RESUME_KEY = 'patternlab.session.v1';

export interface SessionResumeRepository {
  /** Renvoie l'objet brut persisté (assaini/validé par `sanitizeResume` côté appelant). */
  load(): Promise<unknown | null>;
  save(state: unknown): Promise<void>;
  clear(): Promise<void>;
}

export class AsyncStorageSessionResumeRepository implements SessionResumeRepository {
  async load(): Promise<unknown | null> {
    try {
      const raw = await AsyncStorage.getItem(SESSION_RESUME_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  async save(state: unknown): Promise<void> {
    try {
      await AsyncStorage.setItem(SESSION_RESUME_KEY, JSON.stringify(state));
    } catch {
      // best-effort : une reprise non sauvegardée ne bloque jamais la session.
    }
  }

  async clear(): Promise<void> {
    await AsyncStorage.removeItem(SESSION_RESUME_KEY);
  }
}

export const sessionResumeRepository: SessionResumeRepository = new AsyncStorageSessionResumeRepository();

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
