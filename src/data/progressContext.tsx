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
  completeSession: (skillId?: string) => void;
  reset: () => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

function deriveLevel(totalXp: number): number {
  return Math.floor(totalXp / 100) + 1;
}

const DAY_MS = 24 * 60 * 60 * 1000;

/** Clé de jour locale AAAA-MM-JJ. */
function dateKey(ts: number): string {
  return new Date(ts).toISOString().slice(0, 10);
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

  const completeSession = useCallback((skillId?: string) => {
    setState((prev) => {
      if (!prev) return prev;
      const now = Date.now();
      const today = dateKey(now);
      let streakDays = prev.streakDays;
      if (prev.lastActiveDate !== today) {
        const yesterday = dateKey(now - DAY_MS);
        streakDays = prev.lastActiveDate === yesterday ? prev.streakDays + 1 : 1;
      }
      const completedSkills =
        skillId && !prev.completedSkills.includes(skillId)
          ? [...prev.completedSkills, skillId]
          : prev.completedSkills;
      const next: ProgressState = { ...prev, streakDays, lastActiveDate: today, completedSkills };
      void progressRepository.save(next);
      analytics.track('streak_updated', { streakDays });
      if (skillId && completedSkills !== prev.completedSkills) {
        analytics.track('path_node_unlocked', { skillId });
      }
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    const fresh = defaultProgress(Date.now());
    void progressRepository.reset().then(() => progressRepository.save(fresh));
    setState(fresh);
  }, []);

  return (
    <ProgressContext.Provider value={{ state, ready, markOnboarded, recordAnswer, completeSession, reset }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress doit être utilisé dans <ProgressProvider>.');
  return ctx;
}
