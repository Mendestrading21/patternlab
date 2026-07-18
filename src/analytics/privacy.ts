/**
 * Confidentialité analytics — pur et testable.
 *
 * Règle (skill) : minimiser les données, **ne jamais envoyer d'informations financières
 * personnelles** ni de PII. Ce module assainit les propriétés d'un évènement AVANT tout
 * envoi : il retire les clés interdites, rédige les valeurs sensibles (e-mails), borne la
 * longueur des chaînes et le nombre de propriétés. Aucune I/O, aucune dépendance réseau.
 */
import type { AnalyticsProps } from './types';

/** Sous-chaînes de clé interdites (PII / finances personnelles). Comparaison en minuscules. */
export const FORBIDDEN_KEY_PATTERNS = [
  'email',
  'mail',
  'name',
  'nom',
  'prenom',
  'prénom',
  'firstname',
  'lastname',
  'password',
  'passwd',
  'secret',
  'token',
  'apikey',
  'phone',
  'address',
  'adresse',
  'iban',
  'card',
  'carte',
  'cvv',
  'stripe',
  'payment',
  'paiement',
  'account',
  'compte',
  'balance',
  'solde',
  'amount',
  'montant',
  'portfolio',
  'portefeuille',
  'holding',
  'position',
  'broker',
  'wallet',
  'ssn',
  'birth',
  'naissance',
];

export const MAX_PROPS = 24;
export const MAX_STRING_LENGTH = 120;

const EMAIL_RE = /[^\s@]+@[^\s@]+\.[^\s@]+/;

export function isForbiddenKey(key: string): boolean {
  const k = key.toLowerCase();
  return FORBIDDEN_KEY_PATTERNS.some((p) => k.includes(p));
}

/** Assainit une valeur : garde booléens/nombres finis, rédige e-mails, borne les chaînes. */
export function sanitizeValue(v: unknown): string | number | boolean | undefined {
  if (typeof v === 'boolean') return v;
  if (typeof v === 'number') return Number.isFinite(v) ? v : undefined;
  if (typeof v === 'string') {
    if (EMAIL_RE.test(v)) return '[redacted]';
    return v.length > MAX_STRING_LENGTH ? v.slice(0, MAX_STRING_LENGTH) : v;
  }
  return undefined;
}

/**
 * Assainit un jeu de propriétés : retire les clés interdites et les valeurs non
 * sérialisables, borne le nombre de propriétés. Retourne un objet neuf (jamais mutant).
 */
export function sanitizeProps(props?: AnalyticsProps): AnalyticsProps {
  if (!props) return {};
  const out: AnalyticsProps = {};
  let count = 0;
  for (const [key, value] of Object.entries(props)) {
    if (count >= MAX_PROPS) break;
    if (isForbiddenKey(key)) continue;
    const clean = sanitizeValue(value);
    if (clean === undefined) continue;
    out[key] = clean;
    count += 1;
  }
  return out;
}
