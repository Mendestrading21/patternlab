/**
 * Pipeline d'import de contenu (APP/WMB → PatternLab) — cœur PUR et testable.
 * Étapes : normalisation → classification → micro-concept → brouillon (needsReview)
 * avec origine + hash → déduplication. AUCUNE donnée personnelle n'est importée
 * (garde `hasPersonalData`). Le rendu app n'importe jamais ce module (build-time only).
 *
 * Node 22 exécute ce fichier TS nativement : le script `scripts/import-app/index.ts`
 * réutilise EXACTEMENT ces fonctions (source unique, aucune divergence).
 */

export const MIGRATION_VERSION = 1;

export const DISCLAIMER =
  'Contenu éducatif. Aucun conseil en investissement, aucun signal, aucune promesse de gain.';

export type ConceptCategory = 'chandeliers' | 'tendance' | 'figures' | 'risk' | 'psychologie';
export type ConceptStatus = 'imported' | 'draft' | 'needsReview' | 'approved' | 'published' | 'archived';

export const CONCEPT_CATEGORIES: ConceptCategory[] = ['chandeliers', 'tendance', 'figures', 'risk', 'psychologie'];

/** Champs interdits : aucune donnée personnelle/compte/paiement ne doit transiter. */
export const FORBIDDEN_FIELDS = [
  'email',
  'password',
  'motdepasse',
  'stripe',
  'secret',
  'token',
  'phone',
  'telephone',
  'iban',
  'card',
  'carte',
  'account',
  'compte',
  'abonnement',
  'subscription',
];

export interface RawConcept {
  title: string;
  definition: string;
  category?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  commonMistake?: string;
  sources?: string[];
}

export interface ConceptOrigin {
  sourcePath: string;
  sourceHash: string;
  importedAt: string;
  migrationVersion: number;
}

export interface DraftConcept {
  id: string;
  slug: string;
  title: string;
  category: ConceptCategory;
  skillId: string | null;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  definition: string;
  commonMistake: string | null;
  sources: string[];
  status: ConceptStatus;
  locale: 'fr';
  disclaimer: string;
  origin: ConceptOrigin;
}

/** Hash de contenu déterministe (FNV-1a 32 bits → 8 hex). Identité/idempotence, non cryptographique. */
export function contentHash(input: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, '0');
}

export function slugify(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

export function normalizeText(s: string): string {
  return s.replace(/\s+/g, ' ').trim();
}

/** Détecte des CLÉS de données personnelles/paiement (pas de simples mentions textuelles). */
export function hasPersonalData(raw: Record<string, unknown>): boolean {
  return Object.keys(raw).some((k) => FORBIDDEN_FIELDS.includes(k.toLowerCase()));
}

export function classifyCategory(raw: RawConcept): ConceptCategory {
  if (typeof raw.category === 'string' && (CONCEPT_CATEGORIES as string[]).includes(raw.category)) {
    return raw.category as ConceptCategory;
  }
  const text = `${raw.title} ${raw.definition}`.toLowerCase();
  if (/bougie|chandelier|doji|marteau|m[eè]che|ombre|avale/.test(text)) return 'chandeliers';
  if (/psycholog|[ée]motion|biais|discipline|peur|avidit[ée]|fomo/.test(text)) return 'psychologie';
  if (/risque|stop|money management|taille de position|perte maximale|capital/.test(text)) return 'risk';
  if (/figure|double creux|double sommet|t[eê]te.?[ée]paule|triangle|drapeau|biseau|canal/.test(text)) return 'figures';
  return 'tendance';
}

const SKILL_BY_CATEGORY: Record<ConceptCategory, string | null> = {
  chandeliers: 'skill.candles',
  tendance: 'skill.trend',
  figures: 'skill.patterns',
  risk: null, // compétence pilote à venir
  psychologie: null,
};

export function skillForCategory(category: ConceptCategory): string | null {
  return SKILL_BY_CATEGORY[category];
}

/**
 * Transforme un concept brut en BROUILLON `needsReview` (jamais publié automatiquement),
 * avec origine + hash. Ne lit que des champs éducatifs (aucune donnée personnelle).
 */
export function toDraftConcept(
  raw: RawConcept,
  sourcePath: string,
  importedAt: string,
  migrationVersion = MIGRATION_VERSION,
): DraftConcept {
  const title = normalizeText(raw.title);
  const definition = normalizeText(raw.definition);
  const category = classifyCategory(raw);
  const slug = slugify(title);
  const sourceHash = contentHash(`${title}\n${definition}`);
  return {
    id: `concept.${slug}`,
    slug,
    title,
    category,
    skillId: skillForCategory(category),
    difficulty: raw.difficulty ?? 'beginner',
    definition,
    commonMistake: raw.commonMistake ? normalizeText(raw.commonMistake) : null,
    sources: Array.isArray(raw.sources) ? raw.sources : [],
    status: 'needsReview',
    locale: 'fr',
    disclaimer: DISCLAIMER,
    origin: { sourcePath, sourceHash, importedAt, migrationVersion },
  };
}

/** Déduplique par hash de contenu (idempotence : contenu identique → un seul brouillon). */
export function dedupe(drafts: DraftConcept[]): DraftConcept[] {
  const seen = new Set<string>();
  const out: DraftConcept[] = [];
  for (const d of drafts) {
    if (seen.has(d.origin.sourceHash)) continue;
    seen.add(d.origin.sourceHash);
    out.push(d);
  }
  return out;
}
