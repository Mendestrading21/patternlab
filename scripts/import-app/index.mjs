#!/usr/bin/env node
/**
 * Migration APP/WMB pilote → brouillons de concepts (needsReview).
 * Réutilise le pipeline PUR et testé (src/content/importPipeline.ts) via l'exécution
 * TypeScript native de Node 22. Idempotent : un contenu inchangé n'est pas réécrit.
 * AUCUNE donnée personnelle n'est importée (garde hasPersonalData).
 *
 * Usage : npm run import:app
 * Source pilote : scripts/import-app/source/*.json (curatée, voix éducative WMB).
 * Pointer sur l'export réel de Mendestrading21/APP = changer le dossier source.
 */
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { toDraftConcept, dedupe, hasPersonalData } from '../../src/content/importPipeline.ts';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..', '..');
const sourceDir = join(here, 'source');
const outDir = join(root, 'content', 'drafts', 'concepts');
mkdirSync(outDir, { recursive: true });

const now = new Date().toISOString();
const sourceFiles = readdirSync(sourceDir).filter((f) => f.endsWith('.json'));

let rejected = 0;
const drafts = [];
for (const file of sourceFiles) {
  const sourcePath = `scripts/import-app/source/${file}`;
  const raws = JSON.parse(readFileSync(join(sourceDir, file), 'utf8'));
  for (const raw of raws) {
    if (hasPersonalData(raw)) {
      console.warn(`  ⨯ ignoré (champ personnel) : ${raw.title ?? '?'}`);
      rejected++;
      continue;
    }
    drafts.push(toDraftConcept(raw, sourcePath, now));
  }
}

const unique = dedupe(drafts);

let created = 0;
let updated = 0;
let unchanged = 0;
for (const d of unique) {
  const target = join(outDir, `${d.slug}.json`);
  if (existsSync(target)) {
    const existing = JSON.parse(readFileSync(target, 'utf8'));
    if (existing.origin?.sourceHash === d.origin.sourceHash) {
      unchanged++; // idempotent : contenu identique → on ne réécrit pas (importedAt conservé)
      continue;
    }
    writeFileSync(target, `${JSON.stringify(d, null, 2)}\n`);
    updated++;
  } else {
    writeFileSync(target, `${JSON.stringify(d, null, 2)}\n`);
    created++;
  }
}

console.log('\nImport APP pilote → content/drafts/concepts/');
console.log(`  sources           : ${sourceFiles.length} fichier(s)`);
console.log(`  concepts uniques  : ${unique.length} (dédupliqués depuis ${drafts.length})`);
console.log(`  rejetés (perso)   : ${rejected}`);
console.log(`  créés : ${created} · mis à jour : ${updated} · inchangés : ${unchanged}`);
console.log('  statut : needsReview — revue humaine requise avant publication.');
