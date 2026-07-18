/** Recherche de glossaire — pure, insensible aux accents et à la casse, classée. */
import type { GlossaryTerm, GlossaryCategory } from './glossary';

export function normalizeSearch(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/**
 * Filtre par catégorie puis, si `query` non vide, classe par pertinence :
 * début du terme (4) > terme (3) > anglais (2) > résumé (1). Départage alphabétique.
 */
export function searchGlossary(
  terms: GlossaryTerm[],
  query: string,
  category: GlossaryCategory | 'all',
): GlossaryTerm[] {
  const inCat = (t: GlossaryTerm) => category === 'all' || t.category === category;
  const q = normalizeSearch(query);
  if (!q) return terms.filter(inCat);

  const scored: { t: GlossaryTerm; score: number }[] = [];
  for (const t of terms) {
    if (!inCat(t)) continue;
    const term = normalizeSearch(t.term);
    const eng = normalizeSearch(t.english);
    const sum = normalizeSearch(t.summary);
    let score = 0;
    if (term.startsWith(q)) score = 4;
    else if (term.includes(q)) score = 3;
    else if (eng.includes(q)) score = 2;
    else if (sum.includes(q)) score = 1;
    if (score > 0) scored.push({ t, score });
  }
  scored.sort((a, b) => b.score - a.score || a.t.term.localeCompare(b.t.term));
  return scored.map((s) => s.t);
}
