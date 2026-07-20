#!/usr/bin/env node
/**
 * Vérification de préparation à la publication.
 * Réutilise la logique PURE et testée (src/release/releaseCheck.ts) via l'exécution
 * TypeScript native de Node 22. Lit app.json / package.json, vérifie l'existence des
 * assets et la présence de l'écran « À propos », puis imprime un rapport.
 *
 * Usage : npm run release:check
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runReleaseChecks } from '../src/release/releaseCheck.ts';
import { APP_INFO, PRIVACY_SUMMARY } from '../src/lib/appInfo.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const readJson = (p) => JSON.parse(readFileSync(join(root, p), 'utf8'));

const appJson = readJson('app.json');
const pkg = readJson('package.json');
const config = appJson.expo ?? {};

// Contenu V5 (voie éditoriale) : aucun brouillon ne doit être `approved`/`published` (revue humaine).
const PUBLISHED = new Set(['approved', 'published']);
const v5Dir = join(root, 'content', 'drafts', 'concepts-v5');
const v5Drafts = existsSync(v5Dir)
  ? readdirSync(v5Dir)
      .filter((f) => f.endsWith('.json'))
      .map((f) => readJson(`content/drafts/concepts-v5/${f}`))
  : [];

const { checks, ok } = runReleaseChecks({
  config,
  packageVersion: pkg.version,
  appInfoVersion: APP_INFO.version,
  assetExists: (rel) => existsSync(join(root, rel)),
  disclaimer: APP_INFO.disclaimer,
  privacySummary: PRIVACY_SUMMARY,
  hasAboutScreen: existsSync(join(root, 'src/app/a-propos.tsx')),
  contentDraftCount: v5Drafts.length,
  contentAllInReview: v5Drafts.every((d) => !PUBLISHED.has(d.status)),
});

for (const c of checks) {
  console.log(`${c.ok ? '✓' : '✗'} ${c.name}${c.detail ? ` — ${c.detail}` : ''}`);
}
const passed = checks.filter((c) => c.ok).length;
console.log(`\n${passed}/${checks.length} vérifications de publication OK.`);
if (!ok) {
  console.error('\nPréparation à la publication INCOMPLÈTE — voir les points ✗ ci-dessus.');
  process.exit(1);
}
