import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { progressRepository, onboardingRepository, type ProgressState } from './repositories';
import { defaultProgress } from './seed';
import type { OnboardingProfile } from './onboardingProfile';
import type { Grade } from '../engines/learning';
import * as progressLogic from './progressLogic';
import { analytics } from '../analytics';

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
  reset: () => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState | null>(null);
  const [profile, setProfile] = useState<OnboardingProfile | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const [loaded, loadedProfile] = await Promise.all([
        progressRepository.load(),
        onboardingRepository.load(),
      ]);
      if (!mounted) return;
      const progress = loaded ?? defaultProgress(Date.now());
      setState(progress);
      setProfile(loadedProfile);
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
      const next = progressLogic.recordAnswer(prev, skillId, grade, Date.now(), tag);
      void progressRepository.save(next);
      analytics.track('exercise_answered', { skillId, grade });
      return next;
    });
  }, []);

  const completeSession = useCallback((skillId?: string, passed = true) => {
    setState((prev) => {
      if (!prev) return prev;
      const { state: next, unlockedSkillId } = progressLogic.completeSession(prev, skillId, passed, Date.now());
      void progressRepository.save(next);
      analytics.track('streak_updated', { streakDays: next.streakDays });
      if (unlockedSkillId) {
        analytics.track('path_node_unlocked', { skillId: unlockedSkillId });
      }
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    const fresh = defaultProgress(Date.now());
    void progressRepository.reset().then(() => progressRepository.save(fresh));
    void onboardingRepository.reset();
    setState(fresh);
    setProfile(null);
  }, []);

  return (
    <ProgressContext.Provider
      value={{ state, ready, profile, markOnboarded, completeOnboarding, recordAnswer, completeSession, reset }}
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
