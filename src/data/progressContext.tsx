import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { progressRepository, type ProgressState } from './repositories';
import { defaultProgress } from './seed';
import { applyGrade, type Grade, type SkillProgress } from '../engines/learning';
import { analytics } from '../analytics';

interface ProgressContextValue {
  state: ProgressState | null;
  ready: boolean;
  markOnboarded: () => void;
  recordAnswer: (skillId: string, grade: Grade) => void;
  reset: () => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

function deriveLevel(totalXp: number): number {
  return Math.floor(totalXp / 100) + 1;
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const loaded = (await progressRepository.load()) ?? defaultProgress(Date.now());
      if (!mounted) return;
      setState(loaded);
      setReady(true);
      await progressRepository.save(loaded);
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

  const recordAnswer = useCallback(
    (skillId: string, grade: Grade) => {
      setState((prev) => {
        if (!prev) return prev;
        const now = Date.now();
        const current: SkillProgress =
          prev.skills[skillId] ?? { skillId, xp: 0, mastery: 0, confidence: 0, review: { repetitions: 0, easiness: 2.5, intervalDays: 0, dueAt: now } };
        const updated = applyGrade(current, grade, now);
        const totalXp = prev.totalXp + (grade >= 3 ? 10 : 2);
        const next: ProgressState = {
          ...prev,
          totalXp,
          level: deriveLevel(totalXp),
          coins: prev.coins + (grade >= 3 ? 5 : 0),
          skills: { ...prev.skills, [skillId]: updated },
        };
        void progressRepository.save(next);
        analytics.track('exercise_answered', { skillId, grade });
        return next;
      });
    },
    [],
  );

  const reset = useCallback(() => {
    const fresh = defaultProgress(Date.now());
    void progressRepository.reset().then(() => progressRepository.save(fresh));
    setState(fresh);
  }, []);

  return (
    <ProgressContext.Provider value={{ state, ready, markOnboarded, recordAnswer, reset }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress doit être utilisé dans <ProgressProvider>.');
  return ctx;
}
