import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { progressRepository, onboardingRepository, premiumRepository, type ProgressState } from './repositories';
import { defaultProgress } from './seed';
import type { OnboardingProfile } from './onboardingProfile';
import * as premium from './premium';
import type { Grade } from '../engines/learning';
import * as progressLogic from './progressLogic';
import * as gamification from './gamification';
import { analytics } from '../analytics';

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
  reset: () => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState | null>(null);
  const [profile, setProfile] = useState<OnboardingProfile | null>(null);
  const [premiumState, setPremiumState] = useState<premium.PremiumState>(premium.emptyPremium());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const [loaded, loadedProfile, loadedPremium] = await Promise.all([
        progressRepository.load(),
        onboardingRepository.load(),
        premiumRepository.load(),
      ]);
      if (!mounted) return;
      const progress = loaded ?? defaultProgress(Date.now());
      setState(progress);
      setProfile(loadedProfile);
      setPremiumState(loadedPremium);
      setReady(true);
      await progressRepository.save(progress);
    })();
    return () => {
      mounted = false;
    };
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

  const reset = useCallback(() => {
    const fresh = defaultProgress(Date.now());
    void progressRepository.reset().then(() => progressRepository.save(fresh));
    void onboardingRepository.reset();
    void premiumRepository.reset();
    setState(fresh);
    setProfile(null);
    setPremiumState(premium.emptyPremium());
  }, []);

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
