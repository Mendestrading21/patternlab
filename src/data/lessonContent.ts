/**
 * Helpers de contenu de leçon — purs. Notamment : collecte des flashcards issues
 * des steps de type 'flashcard', réutilisable par les révisions (lots ultérieurs).
 */
import type { Flashcard, Lesson } from '../engines/learning';
import { SKILLS, getLessons } from './seed';

export function flashcardsForLesson(lesson: Lesson): Flashcard[] {
  return lesson.steps
    .filter((s) => s.kind === 'flashcard' && s.flashcard != null)
    .map((s) => s.flashcard as Flashcard);
}

export function flashcardsForSkill(skillId: string): Flashcard[] {
  return getLessons(skillId).flatMap(flashcardsForLesson);
}

export function allFlashcards(): Flashcard[] {
  return SKILLS.flatMap((s) => flashcardsForSkill(s.id));
}
