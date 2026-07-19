/**
 * Glossaire unifié — vue combinée des termes v1 (`GLOSSARY_TERMS`) et des concepts V5
 * (dérivés via le pont). Non destructif : additif, dédupliqué par slug. Les slugs disposant
 * d'une fiche concept riche renvoient vers `/concept/[slug]` ; les autres vers `/glossaire/[slug]`.
 */
import { GLOSSARY_TERMS, type GlossaryTerm } from './glossary';
import { glossaryFromConcepts } from './learningConcept';
import { V5_CONCEPTS } from './learningContent';

const conceptTerms = glossaryFromConcepts(V5_CONCEPTS);

/** Slugs qui possèdent une fiche concept V5 (visuel + reconnaissance + scénarios…). */
export const CONCEPT_SLUGS = new Set(conceptTerms.map((t) => t.slug));

function dedupBySlug(terms: GlossaryTerm[]): GlossaryTerm[] {
  const seen = new Set<string>();
  const out: GlossaryTerm[] = [];
  for (const t of terms) {
    if (seen.has(t.slug)) continue;
    seen.add(t.slug);
    out.push(t);
  }
  return out;
}

/** Concepts d'abord (version riche prioritaire), puis termes v1 ; dédupliqué par slug. */
export const UNIFIED_GLOSSARY: GlossaryTerm[] = dedupBySlug([...conceptTerms, ...GLOSSARY_TERMS]);

export const hasConceptFiche = (slug: string): boolean => CONCEPT_SLUGS.has(slug);
