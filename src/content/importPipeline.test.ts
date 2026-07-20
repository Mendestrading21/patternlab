import { describe, it, expect } from '@jest/globals';
import {
  contentHash,
  slugify,
  normalizeText,
  hasPersonalData,
  classifyCategory,
  skillForCategory,
  toDraftConcept,
  dedupe,
  type RawConcept,
  type DraftConcept,
} from './importPipeline';

describe('contentHash', () => {
  it('est déterministe et discrimine le contenu', () => {
    expect(contentHash('abc')).toBe(contentHash('abc'));
    expect(contentHash('abc')).not.toBe(contentHash('abd'));
    expect(contentHash('x')).toMatch(/^[0-9a-f]{8}$/);
  });
});

describe('slugify / normalizeText', () => {
  it('slugifie sans accents, en minuscules', () => {
    expect(slugify('La bougie « Marteau » !')).toBe('la-bougie-marteau');
    expect(slugify('Tête-épaules')).toBe('tete-epaules');
  });
  it('normalise les espaces', () => {
    expect(normalizeText('  a   b\n c ')).toBe('a b c');
  });
});

describe('hasPersonalData (garde)', () => {
  it('détecte des clés interdites', () => {
    expect(hasPersonalData({ title: 'x', email: 'a@b.c' })).toBe(true);
    expect(hasPersonalData({ title: 'x', stripeId: 'y' } as Record<string, unknown>)).toBe(false); // clé non exacte
    expect(hasPersonalData({ title: 'x', stripe: 'y' })).toBe(true);
    expect(hasPersonalData({ title: 'x', definition: 'ne partage jamais ton mot de passe' })).toBe(false); // simple mention textuelle
  });
});

describe('classification', () => {
  it('respecte une catégorie explicite valide', () => {
    expect(classifyCategory({ title: 't', definition: 'd', category: 'figures' })).toBe('figures');
  });
  it('classe par mots-clés sinon', () => {
    expect(classifyCategory({ title: 'Le marteau', definition: 'une bougie de retournement' })).toBe('chandeliers');
    expect(classifyCategory({ title: 'FOMO', definition: 'un biais émotionnel' })).toBe('psychologie');
    expect(classifyCategory({ title: 'Le stop', definition: 'limiter la perte maximale' })).toBe('risk');
    expect(classifyCategory({ title: 'Support', definition: 'un plancher de prix' })).toBe('tendance');
  });
  it('mappe la catégorie vers une compétence (ou null)', () => {
    expect(skillForCategory('chandeliers')).toBe('skill.candles');
    expect(skillForCategory('risk')).toBeNull();
  });
});

describe('toDraftConcept', () => {
  const raw: RawConcept = { title: 'Le Doji', definition: 'Bougie d’indécision.', sources: ['WMB'] };
  const d = toDraftConcept(raw, 'scripts/import-app/source/x.json', '2026-07-17T00:00:00.000Z');

  it('produit un brouillon needsReview avec origine + hash', () => {
    expect(d.status).toBe('needsReview');
    expect(d.id).toBe('concept.le-doji');
    expect(d.slug).toBe('le-doji');
    expect(d.category).toBe('chandeliers');
    expect(d.skillId).toBe('skill.candles');
    expect(d.origin.sourcePath).toContain('x.json');
    expect(d.origin.sourceHash).toMatch(/^[0-9a-f]{8}$/);
    expect(d.origin.migrationVersion).toBe(1);
    expect(d.locale).toBe('fr');
    expect(d.disclaimer).toContain('Aucun conseil');
  });

  it('n’expose aucun champ personnel', () => {
    for (const k of Object.keys(d)) expect(k.toLowerCase()).not.toMatch(/email|password|stripe|token|iban/);
  });
});

describe('dedupe (idempotence)', () => {
  it('supprime les doublons de contenu', () => {
    const a = toDraftConcept({ title: 'X', definition: 'même' }, 'p', 't');
    const b = toDraftConcept({ title: 'X', definition: 'même' }, 'p', 't2');
    const c = toDraftConcept({ title: 'Y', definition: 'autre' }, 'p', 't');
    const out: DraftConcept[] = dedupe([a, b, c]);
    expect(out).toHaveLength(2);
    expect(out.map((d) => d.slug)).toEqual(['x', 'y']);
  });
});
