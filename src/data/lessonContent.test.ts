import { describe, it, expect } from '@jest/globals';
import { flashcardsForSkill, allFlashcards } from './lessonContent';

describe('lessonContent — flashcards', () => {
  it('collecte les flashcards des leçons enrichies (chandeliers)', () => {
    const cards = flashcardsForSkill('skill.candles');
    expect(cards.length).toBeGreaterThanOrEqual(1);
    for (const c of cards) {
      expect(typeof c.front).toBe('string');
      expect(c.front.length).toBeGreaterThan(0);
      expect(c.back.length).toBeGreaterThan(0);
    }
  });

  it('expose des flashcards sur plusieurs compétences', () => {
    expect(flashcardsForSkill('skill.actions').length).toBeGreaterThanOrEqual(1);
    expect(flashcardsForSkill('skill.patterns').length).toBeGreaterThanOrEqual(1);
  });

  it('agrège toutes les flashcards du module', () => {
    expect(allFlashcards().length).toBeGreaterThanOrEqual(3);
  });

  it('renvoie une liste vide pour une compétence sans flashcard connue', () => {
    expect(flashcardsForSkill('skill.inconnue')).toEqual([]);
  });
});
