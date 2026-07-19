#!/usr/bin/env node
/**
 * Valide le contenu pédagogique (content/published/**.json) contre les schémas JSON.
 * Utilisé par la CI (npm run validate:content). Extensible : ajouter un dossier + un schéma.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv2020 from 'ajv/dist/2020.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const ajv = new Ajv2020({ allErrors: true, strict: false });

const SCHEMA_BY_DIR = {
  lessons: 'lesson.schema.json',
  exercises: 'exercise.schema.json',
  patterns: 'pattern.schema.json',
};

const validators = Object.fromEntries(
  Object.entries(SCHEMA_BY_DIR).map(([dir, file]) => {
    const schema = JSON.parse(readFileSync(join(root, 'schemas', file), 'utf8'));
    return [dir, ajv.compile(schema)];
  }),
);

const validateConcept = ajv.compile(
  JSON.parse(readFileSync(join(root, 'schemas', 'concept.schema.json'), 'utf8')),
);

const validateLearningConcept = ajv.compile(
  JSON.parse(readFileSync(join(root, 'schemas', 'learning-concept.schema.json'), 'utf8')),
);

const base = join(root, 'content', 'published');
let total = 0;
let failed = 0;

for (const [dir, validate] of Object.entries(validators)) {
  const dirPath = join(base, dir);
  if (!existsSync(dirPath)) continue;
  for (const file of readdirSync(dirPath).filter((f) => f.endsWith('.json'))) {
    total += 1;
    const data = JSON.parse(readFileSync(join(dirPath, file), 'utf8'));
    if (validate(data)) {
      console.log(`✓ ${dir}/${file}`);
    } else {
      failed += 1;
      console.error(`✗ ${dir}/${file}`);
      console.error(validate.errors);
    }
  }
}

// Brouillons de concepts importés (APP/WMB) — statut needsReview.
const draftsDir = join(root, 'content', 'drafts', 'concepts');
if (existsSync(draftsDir)) {
  for (const file of readdirSync(draftsDir).filter((f) => f.endsWith('.json'))) {
    total += 1;
    const data = JSON.parse(readFileSync(join(draftsDir, file), 'utf8'));
    if (validateConcept(data)) {
      console.log(`✓ drafts/concepts/${file}`);
    } else {
      failed += 1;
      console.error(`✗ drafts/concepts/${file}`);
      console.error(validateConcept.errors);
    }
  }
}

// Concepts V5 (LearningConcept) — brouillons needsReview.
const draftsV5Dir = join(root, 'content', 'drafts', 'concepts-v5');
const v5Drafts = [];
if (existsSync(draftsV5Dir)) {
  for (const file of readdirSync(draftsV5Dir).filter((f) => f.endsWith('.json'))) {
    total += 1;
    const data = JSON.parse(readFileSync(join(draftsV5Dir, file), 'utf8'));
    if (validateLearningConcept(data)) {
      console.log(`✓ drafts/concepts-v5/${file}`);
      v5Drafts.push({ file, data });
    } else {
      failed += 1;
      console.error(`✗ drafts/concepts-v5/${file}`);
      console.error(validateLearningConcept.errors);
    }
  }
}

// ── Portail éditorial V5 : idempotence + vocabulaire + couverture ──────
// (voie éditoriale vers 500+ ; les conflits font échouer la validation.)
const FORBIDDEN_UPPER = ['BUY', 'SELL'];
const FORBIDDEN_PHRASES = ['profit garanti', 'gain garanti', 'rendement garanti', 'signal sûr', 'trade gagnant', 'liberté financière garantie'];
function draftText(c) {
  const quiz = (c.miniQuizzes ?? []).flatMap((q) => [q.question, ...(q.options ?? []), q.explanation]);
  return [c.title, c.learningObjective, c.definitionShort, c.definitionDetailed,
    ...(c.howToRecognize ?? []), ...(c.falseSignals ?? []), ...(c.commonMistakes ?? []), ...(c.checklist ?? []), ...quiz]
    .filter(Boolean);
}
if (v5Drafts.length) {
  // Idempotence : aucun id/slug dupliqué entre brouillons.
  const seenId = new Map();
  const seenSlug = new Map();
  for (const { file, data } of v5Drafts) {
    if (seenId.has(data.id)) { failed += 1; console.error(`✗ idempotence : id « ${data.id} » dupliqué (${file} & ${seenId.get(data.id)})`); }
    else seenId.set(data.id, file);
    if (seenSlug.has(data.slug)) { failed += 1; console.error(`✗ idempotence : slug « ${data.slug} » dupliqué (${file} & ${seenSlug.get(data.slug)})`); }
    else seenSlug.set(data.slug, file);
  }
  // Vocabulaire : aucun BUY/SELL ni promesse dans les brouillons.
  for (const { file, data } of v5Drafts) {
    for (const t of draftText(data)) {
      for (const up of FORBIDDEN_UPPER) if (new RegExp(`\\b${up}\\b`).test(t)) { failed += 1; console.error(`✗ vocabulaire : « ${up} » dans ${file}`); }
      const low = String(t).toLowerCase();
      for (const p of FORBIDDEN_PHRASES) if (low.includes(p)) { failed += 1; console.error(`✗ vocabulaire : « ${p} » dans ${file}`); }
    }
  }
  // Couverture éditoriale par monde.
  const byWorld = {};
  for (const { data } of v5Drafts) byWorld[data.worldId] = (byWorld[data.worldId] ?? 0) + 1;
  const worldsCovered = Object.keys(byWorld).length;
  const allNeedsReview = v5Drafts.every((d) => d.data.status === 'needsReview');
  console.log(`\nBrouillons V5 : ${v5Drafts.length} concept(s) éditoriaux · ${worldsCovered} monde(s) couvert(s) · needsReview=${allNeedsReview ? 'oui' : 'NON'}`);
  console.log(`Couverture par monde : ${Object.entries(byWorld).map(([w, n]) => `${w.replace('world.', '')}=${n}`).join(', ')}`);
  console.log(`Jalon éditorial : ${v5Drafts.length}/150 (${Math.round((v5Drafts.length / 150) * 100)} %) vers l’objectif 150, puis 500+.`);
  if (!allNeedsReview) { failed += 1; console.error('✗ certains brouillons V5 ne sont pas needsReview (jamais auto-publiés).'); }
}

console.log(`\n${total - failed}/${total} fichier(s) de contenu valides.`);
if (failed > 0) process.exit(1);
if (total === 0) console.log('Aucun contenu à valider (acceptable en P0.1).');
