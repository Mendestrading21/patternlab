import { createContext, useContext, useEffect, useState, useCallback, useMemo, type ReactNode } from 'react';
import {
  progressRepository,
  onboardingRepository,
  premiumRepository,
  consentRepository,
  glossaryPrefsRepository,
  type GlossaryPrefs,
  type ProgressState,
} from './repositories';
import { defaultProgress } from './seed';
import type { OnboardingProfile } from './onboardingProfile';
import { toggleInSet, pushRecent } from './favorites';
import { addConceptExplored, addFalseSignalSpotted } from './learningStats';
import * as premium from './premium';
import { masteryStatus, type Grade } from '../engines/learning';
import * as progressLogic from './progressLogic';
import * as gamification from './gamification';
import { analytics } from '@/analytics';

/** Émet `achievement_unlocked` pour chaque badge nouvellement obtenu. */
function announceBadges(prev: ProgressState, next: ProgressState) {
  for (const badge of gamification.newlyEarnedBadges(prev, next)) {
    analytics.track('achievement_unlocked', { badgeId: badge.id });
  }
}

interface ProgressContextValue {
  state: ProgressState | null;
  ready: boolean;
  /** Profil d'onboarding personnalisé (null tant qu'il n'a pas été renseigné). */
  profile: OnboardingProfile | null;
  markOnboarded: () => void;
  /** Enregistre le profil personnalisé ET marque l'onboarding terminé. */
  completeOnboarding: (profile: OnboardingProfile) => void;
  recordAnswer: (skillId: string, grade: Grade, tag?: string) => void;
  /** `passed` : la session est-elle réussie ? Seule une réussite débloque la compétence. */
  completeSession: (skillId?: string, passed?: boolean) => void;
  /** Réclame la récompense d'une quête du jour terminée (idempotent). */
  claimQuest: (questId: string) => void;
  /** Entitlement Premium (démo locale ; jamais un achat réel). */
  premium: premium.PremiumState;
  /** Active l'accès Premium (simulation locale). */
  activatePremium: (plan: premium.PlanId) => void;
  /** Désactive l'accès Premium (démo). */
  deactivatePremium: () => void;
  /** Restaure un accès Premium déjà activé localement. */
  restorePremium: () => void;
  /** Consentement au suivi d'usage (opt-out ; true par défaut). */
  analyticsEnabled: boolean;
  setAnalyticsEnabled: (enabled: boolean) => void;
  /** Glossaire premium : favoris (slugs) et récemment vus. */
  favorites: ReadonlySet<string>;
  recentSlugs: string[];
  toggleFavorite: (slug: string) => void;
  markRecentlyViewed: (slug: string) => void;
  /** Réussites V5 « compréhension » : marque un concept (et son monde) exploré. */
  markConceptExplored: (slug: string, worldId?: string) => void;
  /** Réussites V5 : enregistre un faux signal / une invalidation correctement repérés. */
  recordFalseSignal: () => void;
  reset: () => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState | null>(null);
  const [profile, setProfile] = useState<OnboardingProfile | null>(null);
  const [premiumState, setPremiumState] = useState<premium.PremiumState>(premium.emptyPremium());
  const [analyticsEnabled, setAnalyticsEnabledState] = useState(true);
  const [glossaryPrefs, setGlossaryPrefs] = useState<GlossaryPrefs>({ favorites: [], recent: [] });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const [loaded, loadedProfile, loadedPremium, consent, prefs] = await Promise.all([
        progressRepository.load(),
        onboardingRepository.load(),
        premiumRepository.load(),
        consentRepository.load(),
        glossaryPrefsRepository.load(),
      ]);
      if (!mounted) return;
      const progress = loaded ?? defaultProgress(Date.now());
      // Applique le consentement AVANT toute émission d'évènement.
      analytics.setConsent(consent);
      setAnalyticsEnabledState(consent);
      setState(progress);
      setProfile(loadedProfile);
      setPremiumState(loadedPremium);
      setGlossaryPrefs(prefs);
      setReady(true);
      await progressRepository.save(progress);
      analytics.track('app_opened');
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const favorites = useMemo(() => new Set(glossaryPrefs.favorites), [glossaryPrefs.favorites]);

  const toggleFavorite = useCallback((slug: string) => {
    setGlossaryPrefs((prev) => {
      const favorites = [...toggleInSet(new Set(prev.favorites), slug)];
      const next = { ...prev, favorites };
      void glossaryPrefsRepository.save(next);
      analytics.track('favorite_added', { added: favorites.includes(slug) });
      return next;
    });
  }, []);

  const markRecentlyViewed = useCallback((slug: string) => {
    setGlossaryPrefs((prev) => {
      if (prev.recent[0] === slug) return prev;
      const next = { ...prev, recent: pushRecent(prev.recent, slug) };
      void glossaryPrefsRepository.save(next);
      return next;
    });
  }, []);

  const markConceptExplored = useCallback((slug: string, worldId?: string) => {
    setState((prev) => {
      if (!prev) return prev;
      const next = addConceptExplored(prev, slug, worldId);
      if (next === prev) return prev;
      void progressRepository.save(next);
      announceBadges(prev, next);
      return next;
    });
  }, []);

  const recordFalseSignal = useCallback(() => {
    setState((prev) => {
      if (!prev) return prev;
      const next = addFalseSignalSpotted(prev);
      void progressRepository.save(next);
      analytics.track('false_signal_identified', { total: next.learning?.falseSignalsSpotted ?? 0 });
      announceBadges(prev, next);
      return next;
    });
  }, []);

  const markOnboarded = useCallback(() => {
    setState((prev) => {
      if (!prev || prev.onboarded) return prev;
      const next = { ...prev, onboarded: true };
      void progressRepository.save(next);
      analytics.track('onboarding_completed');
      return next;
    });
  }, []);

  const completeOnboarding = useCallback((newProfile: OnboardingProfile) => {
    void onboardingRepository.save(newProfile);
    setProfile(newProfile);
    setState((prev) => {
      if (!prev) return prev;
      const next = { ...prev, onboarded: true };
      void progressRepository.save(next);
      return next;
    });
    analytics.track('onboarding_completed', {
      objective: newProfile.objective,
      level: newProfile.level,
      dailyMinutes: newProfile.dailyMinutes,
      diagnostic: newProfile.diagnosticDone,
    });
  }, []);

  const recordAnswer = useCallback((skillId: string, grade: Grade, tag?: string) => {
    setState((prev) => {
      if (!prev) return prev;
      const now = Date.now();
      const graded = progressLogic.recordAnswer(prev, skillId, grade, now, tag);
      // Registre du jour (quêtes) : XP réellement gagné + réponse juste.
      const next = gamification.recordActivity(
        graded,
        { xpGained: graded.totalXp - prev.totalXp, correct: grade >= 3 },
        now,
      );
      void progressRepository.save(next);
      analytics.track('exercise_answered', { skillId, grade });
      // mastery_changed : statut de maîtrise franchit un palier (jamais sur une seule réponse en soi).
      const before = prev.skills[skillId];
      const after = next.skills[skillId];
      if (after) {
        const prevStatus = before ? masteryStatus(before) : 'new';
        const nextStatus = masteryStatus(after);
        if (prevStatus !== nextStatus) {
          analytics.track('mastery_changed', { skillId, status: nextStatus });
        }
      }
      announceBadges(prev, next);
      return next;
    });
  }, []);

  const completeSession = useCallback((skillId?: string, passed = true) => {
    setState((prev) => {
      if (!prev) return prev;
      const now = Date.now();
      const { state: completed, unlockedSkillId } = progressLogic.completeSession(prev, skillId, passed, now);
      // Compte la session du jour (quêtes), puis récompense les jalons de série franchis.
      const withSession = gamification.recordSessionActivity(completed, now);
      const { state: next, crossed, reward } = gamification.applyStreakMilestones(withSession);
      void progressRepository.save(next);
      analytics.track('streak_updated', { streakDays: next.streakDays });
      if (unlockedSkillId) {
        analytics.track('path_node_unlocked', { skillId: unlockedSkillId });
      }
      for (const milestone of crossed) {
        analytics.track('achievement_unlocked', { streakMilestone: milestone, reward });
      }
      announceBadges(prev, next);
      return next;
    });
  }, []);

  const claimQuest = useCallback((questId: string) => {
    setState((prev) => {
      if (!prev) return prev;
      const { state: next, claimed, reward } = gamification.claimQuest(prev, questId, Date.now());
      if (!claimed) return prev;
      void progressRepository.save(next);
      analytics.track('quest_completed', { questId, reward });
      return next;
    });
  }, []);

  const activatePremium = useCallback((plan: premium.PlanId) => {
    // Simulation locale : aucun achat réel, aucune donnée de paiement.
    const next = premium.activate(plan, new Date().toISOString());
    void premiumRepository.save(next);
    setPremiumState(next);
    analytics.track('subscription_started', { plan, demo: true });
  }, []);

  const deactivatePremium = useCallback(() => {
    const next = premium.deactivate();
    void premiumRepository.save(next);
    setPremiumState(next);
  }, []);

  const restorePremium = useCallback(() => {
    void premiumRepository.load().then((loaded) => {
      setPremiumState(loaded);
      analytics.track('subscription_restored', { active: loaded.active, demo: true });
    });
  }, []);

  const setAnalyticsEnabled = useCallback((enabled: boolean) => {
    analytics.setConsent(enabled);
    setAnalyticsEnabledState(enabled);
    void consentRepository.save(enabled);
  }, []);

  const reset = useCallback(() => {
    const fresh = defaultProgress(Date.now());
    void progressRepository.reset().then(() => progressRepository.save(fresh));
    void onboardingRepository.reset();
    void premiumRepository.reset();
    void glossaryPrefsRepository.reset();
    setState(fresh);
    setProfile(null);
    setPremiumState(premium.emptyPremium());
    setGlossaryPrefs({ favorites: [], recent: [] });
  }, []);

  // Le consentement analytics n'est PAS réinitialisé par « Réinitialiser ma progression » :
  // c'est un choix de vie privée, distinct de la progression d'apprentissage.

  return (
    <ProgressContext.Provider
      value={{
        state,
        ready,
        profile,
        markOnboarded,
        completeOnboarding,
        recordAnswer,
        completeSession,
        claimQuest,
        premium: premiumState,
        activatePremium,
        deactivatePremium,
        restorePremium,
        analyticsEnabled,
        setAnalyticsEnabled,
        favorites,
        recentSlugs: glossaryPrefs.recent,
        toggleFavorite,
        markRecentlyViewed,
        markConceptExplored,
        recordFalseSignal,
        reset,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress doit être utilisé dans <ProgressProvider>.');
  return ctx;
}
