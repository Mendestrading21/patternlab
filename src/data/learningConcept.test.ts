import { describe, it, expect } from '@jest/globals';
import {
  WORLDS,
  CATEGORIES,
  conceptById,
  conceptBySlug,
  conceptsByWorld,
  conceptsByCategory,
  relatedConcepts,
  conceptVocabularyIssues,
  checkConceptsIntegrity,
  glossaryFromConcepts,
  DEFAULT_DISCLAIMER,
  type LearningConcept,
} from './learningConcept';
import { V5_CONCEPTS } from './learningContent';
import { SKILLS } from './seed';

const skillIds = new Set(SKILLS.map((s) => s.id));

describe('registres mondes / catégories', () => {
  it('15 mondes ordonnés et uniques', () => {
    expect(WORLDS).toHaveLength(15);
    expect(new Set(WORLDS.map((w) => w.id)).size).toBe(15);
    expect(WORLDS.map((w) => w.order)).toEqual([...Array(15)].map((_, i) => i + 1));
  });
  it('13 catégories uniques, chacune reliée à un monde réel', () => {
    expect(CATEGORIES).toHaveLength(13);
    expect(new Set(CATEGORIES.map((c) => c.id)).size).toBe(13);
    const worldIds = new Set(WORLDS.map((w) => w.id));
    for (const c of CATEGORIES) expect(worldIds.has(c.worldId)).toBe(true);
  });
});

describe('helpers', () => {
  it('retrouve un concept par id et par slug', () => {
    expect(conceptById(V5_CONCEPTS, 'concept.hammer')?.slug).toBe('marteau');
    expect(conceptBySlug(V5_CONCEPTS, 'double-creux')?.id).toBe('concept.double-bottom');
  });
  it('filtre par monde et catégorie', () => {
    expect(conceptsByWorld(V5_CONCEPTS, 'world.candles').map((c) => c.id)).toContain('concept.hammer');
    expect(conceptsByCategory(V5_CONCEPTS, 'cat.patterns').map((c) => c.id)).toContain('concept.double-bottom');
  });
  it('résout les concepts liés', () => {
    const hammer = conceptById(V5_CONCEPTS, 'concept.hammer')!;
    const rel = relatedConcepts(V5_CONCEPTS, hammer).map((c) => c.id);
    expect(rel).toContain('concept.support-resistance');
    expect(rel).toContain('concept.double-bottom');
  });
});

describe('intégrité du corpus amorce', () => {
  it('le contenu V5 amorce ne présente aucune anomalie', () => {
    const issues = checkConceptsIntegrity(V5_CONCEPTS, { skillIds });
    expect(issues).toEqual([]);
  });
  it('tous les concepts amorce sont needsReview (jamais auto-publiés)', () => {
    expect(V5_CONCEPTS.every((c) => c.status === 'needsReview')).toBe(true);
    expect(V5_CONCEPTS.every((c) => c.disclaimer.trim().length > 0)).toBe(true);
    expect(V5_CONCEPTS.every((c) => !c.visualSpec || c.visualSpec.accessibilitySummary.trim().length > 0)).toBe(true);
  });
  it('détecte relations cassées, mondes/catégories inconnus', () => {
    const bad: LearningConcept = { ...V5_CONCEPTS[0], id: 'concept.bad', slug: 'bad', worldId: 'world.nope', categoryId: 'cat.nope', relatedConceptIds: ['concept.ghost'], prerequisites: [] };
    const issues = checkConceptsIntegrity([bad], { skillIds });
    const problems = issues.map((i) => i.problem).join(' | ');
    expect(problems).toMatch(/world inconnu/);
    expect(problems).toMatch(/catégorie inconnue/);
    expect(problems).toMatch(/relation cassée/);
  });
});

describe('garde de vocabulaire (conformité éducative)', () => {
  it('le contenu amorce est conforme (aucun BUY/SELL/promesse)', () => {
    for (const c of V5_CONCEPTS) expect(conceptVocabularyIssues(c)).toEqual([]);
  });
  it('signale BUY/SELL et les promesses de gain', () => {
    const bad: LearningConcept = { ...V5_CONCEPTS[0], definitionShort: 'Signal BUY à profit garanti.' };
    const issues = conceptVocabularyIssues(bad);
    expect(issues.join(' ')).toMatch(/BUY/);
    expect(issues.join(' ')).toMatch(/profit garanti/);
  });
});

describe('pont glossaire (vue dérivée non destructive)', () => {
  it('produit des GlossaryTerm valides avec relations résolues', () => {
    const terms = glossaryFromConcepts(V5_CONCEPTS);
    expect(terms).toHaveLength(V5_CONCEPTS.length);
    const hammer = terms.find((t) => t.slug === 'marteau')!;
    expect(hammer.term).toBe('Marteau');
    expect(hammer.english).toBe('Hammer');
    expect(hammer.category).toBe('analyse');
    expect(hammer.related).toEqual(expect.arrayContaining(['support-resistance', 'double-creux']));
    expect(DEFAULT_DISCLAIMER.length).toBeGreaterThan(0);
  });
});
