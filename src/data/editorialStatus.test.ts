import { describe, it, expect } from '@jest/globals';
import { V5_CONCEPTS } from './learningContent';
import { needsEditorialReview, EDITORIAL_REVIEW_NOTICE } from './learningConcept';

describe('statut éditorial (P0 — honnêteté du contenu)', () => {
  it('needsEditorialReview : vrai tant que le statut n’est ni approved ni published', () => {
    expect(needsEditorialReview({ status: 'imported' })).toBe(true);
    expect(needsEditorialReview({ status: 'draft' })).toBe(true);
    expect(needsEditorialReview({ status: 'needsReview' })).toBe(true);
    expect(needsEditorialReview({ status: 'approved' })).toBe(false);
    expect(needsEditorialReview({ status: 'published' })).toBe(false);
  });

  it('le bandeau annonce clairement une relecture en cours, sans prétendre à une validation', () => {
    const notice = EDITORIAL_REVIEW_NOTICE.toLowerCase();
    expect(notice).toContain('relecture');
    // négation explicite : le contenu n’est PAS encore validé par un humain
    expect(notice).toContain('pas encore validé');
  });

  it('état courant du corpus : les 67 fiches sont en relecture, donc jamais présentées comme validées', () => {
    expect(V5_CONCEPTS.length).toBeGreaterThan(0);
    for (const c of V5_CONCEPTS) {
      // aucune fiche n’est encore approuvée : le bandeau « À relire » doit s’afficher partout
      expect(needsEditorialReview(c)).toBe(true);
    }
  });

  it('honnêteté du schéma : une fiche non validée ne porte ni relecteur ni date de revue', () => {
    for (const c of V5_CONCEPTS) {
      if (needsEditorialReview(c)) {
        expect(c.reviewedBy).toBeUndefined();
        expect(c.reviewDate).toBeUndefined();
      }
    }
  });

  it('aucune source externe fabriquée : chaque fiche cite une source interne traçable', () => {
    for (const c of V5_CONCEPTS) {
      expect(c.sources.length).toBeGreaterThan(0);
      for (const s of c.sources) {
        // seules les origines internes/traçables sont autorisées, jamais une référence externe inventée
        expect(['app', 'wmb', 'editorial']).toContain(s.kind);
        expect(s.label.trim().length).toBeGreaterThan(0);
      }
    }
  });
});
