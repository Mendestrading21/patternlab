/**
 * Bibliothèque de concepts — recherche & filtres PURS et testables sur `V5_CONCEPTS`.
 * Alimente l'espace « Bibliothèque » (navigation prévue pour 500+ concepts). Réutilise
 * `normalizeSearch` (insensible aux accents/casse), cohérent avec le glossaire.
 */
import { normalizeSearch } from './glossarySearch';
import type { LearningConcept, Category, Difficulty } from './learningConcept';

export interface ConceptFilter {
  query?: string;
  /** Famille (catégorie) ; absent/null = toutes. */
  categoryId?: string | null;
  /** Difficulté 1–5 ; absent/null = toutes. */
  difficulty?: Difficulty | null;
}

/** Recherche par titre, titre court et alias (insensible accents/casse). */
export function searchConcepts(query: string, concepts: LearningConcept[]): LearningConcept[] {
  const q = normalizeSearch(query);
  if (!q) return concepts;
  return concepts.filter((c) => {
    const hay = normalizeSearch([c.title, c.shortTitle, ...c.aliases].join(' '));
    return hay.includes(q);
  });
}

/** Filtre par famille et/ou difficulté. */
export function filterConcepts(concepts: LearningConcept[], filter: ConceptFilter): LearningConcept[] {
  return concepts.filter((c) => {
    if (filter.categoryId && c.categoryId !== filter.categoryId) return false;
    if (filter.difficulty && c.difficulty !== filter.difficulty) return false;
    return true;
  });
}

/** Recherche + filtres combinés. */
export function browseConcepts(concepts: LearningConcept[], filter: ConceptFilter): LearningConcept[] {
  const searched = filter.query ? searchConcepts(filter.query, concepts) : concepts;
  return filterConcepts(searched, filter);
}

export interface ConceptFamily {
  id: string;
  label: string;
  count: number;
}

/** Familles réellement présentes dans le corpus (dans l'ordre des catégories), avec compte. */
export function conceptFamilies(concepts: LearningConcept[], categories: Category[]): ConceptFamily[] {
  const counts = new Map<string, number>();
  for (const c of concepts) counts.set(c.categoryId, (counts.get(c.categoryId) ?? 0) + 1);
  return categories
    .filter((cat) => counts.has(cat.id))
    .map((cat) => ({ id: cat.id, label: cat.label, count: counts.get(cat.id) ?? 0 }));
}

/** Difficultés présentes (triées croissant). */
export function conceptDifficulties(concepts: LearningConcept[]): Difficulty[] {
  const set = new Set<Difficulty>();
  for (const c of concepts) set.add(c.difficulty);
  return [...set].sort((a, b) => a - b);
}

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  1: 'Découverte',
  2: 'Facile',
  3: 'Intermédiaire',
  4: 'Avancé',
  5: 'Expert',
};

export function difficultyLabel(d: Difficulty): string {
  return DIFFICULTY_LABELS[d];
}
