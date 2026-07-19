import { describe, it, expect } from '@jest/globals';
import { UNIFIED_GLOSSARY, CONCEPT_SLUGS, hasConceptFiche } from './glossaryUnified';
import { GLOSSARY_TERMS } from './glossary';
import { V5_CONCEPTS } from './learningContent';

describe('UNIFIED_GLOSSARY', () => {
  it('n’a aucun slug dupliqué', () => {
    const slugs = UNIFIED_GLOSSARY.map((t) => t.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('contient tous les termes v1 (au moins par slug)', () => {
    const unified = new Set(UNIFIED_GLOSSARY.map((t) => t.slug));
    for (const t of GLOSSARY_TERMS) {
      expect(unified.has(t.slug)).toBe(true);
    }
  });

  it('expose chaque concept V5 par son slug', () => {
    const unified = new Set(UNIFIED_GLOSSARY.map((t) => t.slug));
    for (const c of V5_CONCEPTS) {
      expect(unified.has(c.slug)).toBe(true);
    }
  });

  it('priorise la version concept (riche) pour un slug partagé', () => {
    // Pour tout slug ayant une fiche concept, l'entrée unifiée doit être celle du concept.
    const conceptBySlug = new Map(V5_CONCEPTS.map((c) => [c.slug, c]));
    for (const t of UNIFIED_GLOSSARY) {
      if (CONCEPT_SLUGS.has(t.slug) && conceptBySlug.has(t.slug)) {
        expect(t.term).toBe(conceptBySlug.get(t.slug)!.title);
      }
    }
  });
});

describe('CONCEPT_SLUGS / hasConceptFiche', () => {
  it('couvre exactement les slugs des concepts V5', () => {
    expect(CONCEPT_SLUGS.size).toBe(new Set(V5_CONCEPTS.map((c) => c.slug)).size);
  });

  it('hasConceptFiche est vrai pour un concept, faux pour un terme v1 pur', () => {
    for (const c of V5_CONCEPTS) {
      expect(hasConceptFiche(c.slug)).toBe(true);
    }
    const pureV1 = GLOSSARY_TERMS.find((t) => !CONCEPT_SLUGS.has(t.slug));
    if (pureV1) expect(hasConceptFiche(pureV1.slug)).toBe(false);
  });
});
