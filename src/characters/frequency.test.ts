import { describe, it, expect } from '@jest/globals';
import { mascotPresence, shouldShowMascot } from './frequency';

describe('gouverneur de fréquence des mascottes', () => {
  it('masque les mascottes dans les contextes exigeants', () => {
    for (const c of ['denseList', 'settings', 'chartPrecise'] as const) {
      expect(mascotPresence(c)).toBe('hidden');
      expect(shouldShowMascot(c)).toBe(false);
    }
  });

  it('présence compacte sur l’accueil et les révisions', () => {
    expect(mascotPresence('home')).toBe('compact');
    expect(mascotPresence('review')).toBe('compact');
  });

  it('présence pleine là où les mascottes sont utiles', () => {
    for (const c of ['onboarding', 'lessonStep', 'feedback', 'debate', 'result'] as const) {
      expect(mascotPresence(c)).toBe('full');
      expect(shouldShowMascot(c)).toBe(true);
    }
  });
});
