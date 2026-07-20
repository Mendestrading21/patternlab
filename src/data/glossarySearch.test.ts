import { describe, it, expect } from '@jest/globals';
import { searchGlossary, normalizeSearch } from './glossarySearch';
import { GLOSSARY_TERMS } from './glossary';
import { SKILLS } from './seed';

describe('normalizeSearch', () => {
  it('retire accents et casse', () => {
    expect(normalizeSearch('Volatilité')).toBe('volatilite');
    expect(normalizeSearch('  RSI ')).toBe('rsi');
  });
});

describe('searchGlossary', () => {
  it('recherche insensible aux accents', () => {
    const r = searchGlossary(GLOSSARY_TERMS, 'volatilite', 'all');
    expect(r.some((t) => t.slug === 'volatilite')).toBe(true);
  });

  it('classe le préfixe du terme en tête', () => {
    const r = searchGlossary(GLOSSARY_TERMS, 'tend', 'all');
    expect(r[0].slug).toBe('tendance');
  });

  it('trouve par libellé anglais', () => {
    const r = searchGlossary(GLOSSARY_TERMS, 'leverage', 'all');
    expect(r.some((t) => t.slug === 'levier')).toBe(true);
  });

  it('filtre par catégorie', () => {
    const r = searchGlossary(GLOSSARY_TERMS, '', 'risque');
    expect(r.length).toBeGreaterThan(0);
    expect(r.every((t) => t.category === 'risque')).toBe(true);
  });

  it('requête vide → tous les termes de la catégorie', () => {
    expect(searchGlossary(GLOSSARY_TERMS, '', 'all')).toHaveLength(GLOSSARY_TERMS.length);
  });
});

describe('intégrité des liens du glossaire', () => {
  const slugs = new Set(GLOSSARY_TERMS.map((t) => t.slug));
  const skillIds = new Set(SKILLS.map((s) => s.id));

  it('chaque terme relié existe et n’est pas lui-même', () => {
    for (const t of GLOSSARY_TERMS) {
      for (const rel of t.related ?? []) {
        expect(slugs.has(rel)).toBe(true);
        expect(rel).not.toBe(t.slug);
      }
    }
  });

  it('chaque relatedSkillId pointe vers une compétence réelle', () => {
    for (const t of GLOSSARY_TERMS) {
      if (t.relatedSkillId) expect(skillIds.has(t.relatedSkillId)).toBe(true);
    }
  });
});
