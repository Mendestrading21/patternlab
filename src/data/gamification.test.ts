import { describe, it, expect } from '@jest/globals';
import {
  dayKey,
  todayActivity,
  recordActivity,
  recordSessionActivity,
  buildDailyQuests,
  claimQuest,
  streakInfo,
  applyStreakMilestones,
  newlyEarnedBadges,
  DAILY_QUESTS,
  STREAK_MILESTONES,
  STREAK_MILESTONE_REWARD,
} from './gamification';
import { defaultProgress } from './seed';
import type { ProgressState } from './repositories';

const T0 = 1_700_000_000_000; // jour "aujourd'hui" de référence
const DAY = 24 * 60 * 60 * 1000;

function fresh(overrides: Partial<ProgressState> = {}): ProgressState {
  return { ...defaultProgress(T0), ...overrides };
}

describe('registre du jour', () => {
  it('todayActivity repart de zéro si le registre date d’un autre jour', () => {
    const s = fresh({ daily: { date: dayKey(T0 - DAY), sessions: 5, correct: 9, xp: 99 } });
    const d = todayActivity(s, T0);
    expect(d).toEqual({ date: dayKey(T0), sessions: 0, correct: 0, xp: 0 });
  });

  it('recordActivity cumule XP et bonnes réponses du jour', () => {
    let s = fresh();
    s = recordActivity(s, { xpGained: 12, correct: true }, T0);
    s = recordActivity(s, { xpGained: 8, correct: false }, T0);
    expect(s.daily).toEqual({ date: dayKey(T0), sessions: 0, correct: 1, xp: 20 });
  });

  it('recordActivity ignore un gain d’XP négatif et bascule le jour', () => {
    const stale = fresh({ daily: { date: dayKey(T0 - DAY), sessions: 3, correct: 3, xp: 30 }, claimedQuestIds: ['quest.session'] });
    const s = recordActivity(stale, { xpGained: -5, correct: true }, T0);
    expect(s.daily).toEqual({ date: dayKey(T0), sessions: 0, correct: 1, xp: 0 });
    expect(s.claimedQuestIds).toEqual([]); // quêtes réclamées remises à zéro au nouveau jour
  });

  it('recordSessionActivity incrémente les sessions du jour', () => {
    const s = recordSessionActivity(fresh(), T0);
    expect(s.daily.sessions).toBe(1);
  });
});

describe('quêtes du jour', () => {
  it('état neuf : aucune quête terminée ni réclamable', () => {
    const quests = buildDailyQuests(fresh(), T0);
    expect(quests).toHaveLength(DAILY_QUESTS.length);
    expect(quests.every((q) => !q.done && !q.claimable && !q.claimed)).toBe(true);
  });

  it('devient terminée puis réclamable quand la cible est atteinte', () => {
    let s = recordSessionActivity(fresh(), T0); // sessions=1 → quest.session done
    const q = buildDailyQuests(s, T0).find((x) => x.id === 'quest.session')!;
    expect(q.done).toBe(true);
    expect(q.claimable).toBe(true);
    // réclamation → crédite la récompense et n’est plus réclamable
    const claim = claimQuest(s, 'quest.session', T0);
    expect(claim.claimed).toBe(true);
    expect(claim.reward).toBe(5);
    expect(claim.state.coins).toBe(s.coins + 5);
    s = claim.state;
    const after = buildDailyQuests(s, T0).find((x) => x.id === 'quest.session')!;
    expect(after.claimed).toBe(true);
    expect(after.claimable).toBe(false);
  });

  it('la réclamation est idempotente (jamais deux fois par jour)', () => {
    const s = recordSessionActivity(fresh(), T0);
    const first = claimQuest(s, 'quest.session', T0);
    const second = claimQuest(first.state, 'quest.session', T0);
    expect(second.claimed).toBe(false);
    expect(second.reward).toBe(0);
    expect(second.state.coins).toBe(first.state.coins);
  });

  it('ne réclame pas une quête non terminée ni un id inconnu', () => {
    const s = fresh();
    expect(claimQuest(s, 'quest.xp30', T0).claimed).toBe(false);
    expect(claimQuest(s, 'quest.inconnue', T0).claimed).toBe(false);
    expect(claimQuest(s, 'quest.inconnue', T0).state.coins).toBe(s.coins);
  });

  it('la progression est bornée à la cible', () => {
    const s = recordActivity(fresh(), { xpGained: 200, correct: true }, T0);
    const q = buildDailyQuests(s, T0).find((x) => x.id === 'quest.xp30')!;
    expect(q.progress).toBe(q.target);
    expect(q.done).toBe(true);
  });
});

describe('jalons de série', () => {
  it('streakInfo donne le prochain jalon et le reste à parcourir', () => {
    const info = streakInfo(4);
    expect(info.next).toBe(7);
    expect(info.toGo).toBe(3);
    expect(info.reachedMilestones).toEqual([3]);
  });

  it('streakInfo signale l’épuisement des jalons', () => {
    const info = streakInfo(200);
    expect(info.next).toBeNull();
    expect(info.toGo).toBe(0);
    expect(info.reachedMilestones).toEqual([...STREAK_MILESTONES]);
  });

  it('récompense chaque jalon franchi une seule fois', () => {
    const s = fresh({ streakDays: 3 });
    const first = applyStreakMilestones(s);
    expect(first.crossed).toEqual([3]);
    expect(first.reward).toBe(STREAK_MILESTONE_REWARD);
    expect(first.state.coins).toBe(s.coins + STREAK_MILESTONE_REWARD);
    // re-appliquer au même palier ne recrédite rien
    const again = applyStreakMilestones(first.state);
    expect(again.crossed).toEqual([]);
    expect(again.state.coins).toBe(first.state.coins);
  });

  it('un saut de série franchit tous les jalons non récompensés', () => {
    const s = fresh({ streakDays: 8 }); // franchit 3 et 7 d’un coup
    const r = applyStreakMilestones(s);
    expect(r.crossed).toEqual([3, 7]);
    expect(r.reward).toBe(2 * STREAK_MILESTONE_REWARD);
  });
});

describe('réussites nouvellement obtenues', () => {
  it('détecte un badge franchi entre deux états', () => {
    const before = fresh({ onboarded: false });
    const after = fresh({ onboarded: true });
    const gained = newlyEarnedBadges(before, after);
    expect(gained.map((b) => b.id)).toContain('first-step');
  });

  it('aucune régression ni doublon quand rien ne change', () => {
    const s = fresh({ onboarded: true });
    expect(newlyEarnedBadges(s, s)).toEqual([]);
    expect(newlyEarnedBadges(null, null)).toEqual([]);
  });
});
