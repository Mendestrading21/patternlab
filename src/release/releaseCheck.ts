/**
 * Vérification de préparation à la publication — pure et testable (aucune I/O).
 *
 * Le runner `scripts/release-check.mjs` fournit les entrées (config app.json lue, existence
 * des assets, métadonnées, présence de l'écran « À propos ») ; ce module décide. Chaque
 * invariant qui échoue bloque la publication (et fait rougir la CI si branché au gate).
 */

export interface ExpoConfig {
  name?: string;
  slug?: string;
  version?: string;
  orientation?: string;
  icon?: string;
  userInterfaceStyle?: string;
  ios?: { bundleIdentifier?: string };
  android?: { package?: string };
  web?: { favicon?: string };
  plugins?: unknown;
}

export interface ReleaseInputs {
  config: ExpoConfig;
  /** Version déclarée dans package.json. */
  packageVersion: string;
  /** Version déclarée dans les métadonnées applicatives (APP_INFO.version). */
  appInfoVersion: string;
  /** Prédicat d'existence d'un asset (chemin relatif au projet). */
  assetExists: (path: string) => boolean;
  disclaimer: string;
  privacySummary: string[];
  /** L'écran « À propos / mentions » est-il présent (route) ? */
  hasAboutScreen: boolean;
  /** Nombre de brouillons de contenu V5 (voie éditoriale). */
  contentDraftCount: number;
  /** Tous les brouillons V5 sont-ils encore en revue (aucun `approved`/`published` accidentel) ? */
  contentAllInReview: boolean;
}

export interface CheckResult {
  name: string;
  ok: boolean;
  detail: string;
}

const SEMVER = /^\d+\.\d+\.\d+$/;
const REVERSE_DNS = /^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/;

export function runReleaseChecks(input: ReleaseInputs): { checks: CheckResult[]; ok: boolean } {
  const c = input.config;
  const checks: CheckResult[] = [];
  const add = (name: string, ok: boolean, detail: string) => checks.push({ name, ok, detail });

  // Identité
  add('name renseigné', Boolean(c.name && c.name.trim().length > 0), c.name ?? '(vide)');
  add('slug renseigné', Boolean(c.slug && c.slug.trim().length > 0), c.slug ?? '(vide)');
  add('orientation définie', Boolean(c.orientation), c.orientation ?? '(absente)');
  add(
    'thème sombre cohérent (userInterfaceStyle ≠ light)',
    c.userInterfaceStyle === 'dark' || c.userInterfaceStyle === 'automatic',
    c.userInterfaceStyle ?? '(absent)',
  );

  // Versions cohérentes (source unique)
  const vOk =
    SEMVER.test(c.version ?? '') &&
    c.version === input.packageVersion &&
    c.version === input.appInfoVersion;
  add(
    'versions synchronisées (app.json = package.json = APP_INFO)',
    vOk,
    `app.json=${c.version} · package=${input.packageVersion} · appInfo=${input.appInfoVersion}`,
  );

  // Identifiants de store
  add(
    'iOS bundleIdentifier (reverse-DNS)',
    REVERSE_DNS.test(c.ios?.bundleIdentifier ?? ''),
    c.ios?.bundleIdentifier ?? '(absent)',
  );
  add(
    'Android package (reverse-DNS)',
    REVERSE_DNS.test(c.android?.package ?? ''),
    c.android?.package ?? '(absent)',
  );

  // Assets requis présents
  const iconOk = Boolean(c.icon) && input.assetExists(c.icon as string);
  add('icône présente', iconOk, c.icon ?? '(absente)');
  const favicon = c.web?.favicon;
  add('favicon web présent', Boolean(favicon) && input.assetExists(favicon as string), favicon ?? '(absent)');

  // expo-router configuré
  const plugins = Array.isArray(c.plugins) ? (c.plugins as unknown[]) : [];
  add('expo-router activé', plugins.some((p) => p === 'expo-router' || (Array.isArray(p) && p[0] === 'expo-router')), '');

  // Légal / confidentialité
  add('disclaimer éducatif présent', input.disclaimer.trim().length > 0, input.disclaimer ? 'ok' : '(vide)');
  add('résumé de confidentialité (≥ 3 points)', input.privacySummary.length >= 3, `${input.privacySummary.length} point(s)`);
  add('écran « À propos / mentions » présent', input.hasAboutScreen, input.hasAboutScreen ? 'a-propos' : '(absent)');

  // Contenu V5 : rien d'auto-publié (revue humaine obligatoire avant publication)
  add(
    'contenu V5 en revue (aucun brouillon auto-publié)',
    input.contentAllInReview,
    `${input.contentDraftCount} brouillon(s)`,
  );

  return { checks, ok: checks.every((x) => x.ok) };
}
