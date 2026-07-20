import { describe, it, expect } from '@jest/globals';
import { allLessons } from './seed';
import { V5_CONCEPTS } from './learningContent';
import { conceptBySlug } from './learningConcept';

const lessons = allLessons();
const V5_LESSON_IDS = ['lesson.hammer-v5', 'lesson.support-resistance-v5', 'lesson.double-bottom-v5'];

describe('Leçons V5 (visual-first)', () => {
  it('les 3 leçons visual-first existent', () => {
    for (const id of V5_LESSON_IDS) {
      expect(lessons.find((l) => l.id === id)).toBeDefined();
    }
  });

  it('chaque leçon V5 contient un step "visual" et un step "hypothesis"', () => {
    for (const id of V5_LESSON_IDS) {
      const lesson = lessons.find((l) => l.id === id)!;
      const kinds = lesson.steps.map((s) => s.kind);
      expect(kinds).toContain('visual');
      expect(kinds).toContain('hypothesis');
    }
  });

  it('tout conceptRef d’une leçon résout vers un concept V5 (intégrité)', () => {
    for (const lesson of lessons) {
      for (const step of lesson.steps) {
        if (step.conceptRef) {
          const concept = conceptBySlug(V5_CONCEPTS, step.conceptRef);
          expect(concept).toBeDefined();
        }
      }
    }
  });

  it('le concept référencé porte le même skillId que la leçon (cohérence)', () => {
    for (const id of V5_LESSON_IDS) {
      const lesson = lessons.find((l) => l.id === id)!;
      const ref = lesson.steps.find((s) => s.conceptRef)?.conceptRef;
      const concept = ref ? conceptBySlug(V5_CONCEPTS, ref) : undefined;
      expect(concept?.skillId).toBe(lesson.skillId);
    }
  });

  it('un step "visual" référence un concept doté d’un visualSpec', () => {
    for (const id of V5_LESSON_IDS) {
      const lesson = lessons.find((l) => l.id === id)!;
      const visual = lesson.steps.find((s) => s.kind === 'visual');
      const concept = visual?.conceptRef ? conceptBySlug(V5_CONCEPTS, visual.conceptRef) : undefined;
      expect(concept?.visualSpec).toBeDefined();
    }
  });
});
