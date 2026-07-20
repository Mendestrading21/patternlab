/**
 * Deck de révision des concepts — logique pure, testable.
 * Réunit toutes les flashcards et mini-quiz des `LearningConcept` en un jeu de révision.
 * C'est une **commodité premium** : les flashcards/quiz restent gratuits sur chaque fiche/leçon ;
 * le deck consolidé (réviser d'un coup) est la valeur ajoutée. Aucune donnée personnelle.
 */
import { V5_CONCEPTS } from './learningContent';
import type { LearningConcept, VisualSpec } from './learningConcept';

export interface DeckFlashcard {
  conceptSlug: string;
  conceptTitle: string;
  front: string;
  back: string;
  /** Signal visuel du concept (Lot 5) — vignette sur la carte. */
  visualSpec?: VisualSpec;
}

export interface DeckQuiz {
  conceptSlug: string;
  conceptTitle: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  /** Signal visuel du concept (Lot 5) — vignette sur la carte. */
  visualSpec?: VisualSpec;
}

export interface RevisionDeck {
  flashcards: DeckFlashcard[];
  quizzes: DeckQuiz[];
  conceptCount: number;
}

/** Construit le deck depuis les concepts (ordre stable ; jamais de hasard). */
export function buildRevisionDeck(concepts: LearningConcept[] = V5_CONCEPTS): RevisionDeck {
  const flashcards: DeckFlashcard[] = [];
  const quizzes: DeckQuiz[] = [];
  for (const c of concepts) {
    for (const f of c.flashcards) {
      flashcards.push({ conceptSlug: c.slug, conceptTitle: c.title, front: f.front, back: f.back, visualSpec: c.visualSpec });
    }
    for (const q of c.miniQuizzes) {
      quizzes.push({
        conceptSlug: c.slug,
        conceptTitle: c.title,
        question: q.question,
        options: q.options,
        correctIndex: q.correctIndex,
        explanation: q.explanation,
        visualSpec: c.visualSpec,
      });
    }
  }
  return { flashcards, quizzes, conceptCount: concepts.length };
}
