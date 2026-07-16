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

console.log(`\n${total - failed}/${total} fichier(s) de contenu valides.`);
if (failed > 0) process.exit(1);
if (total === 0) console.log('Aucun contenu à valider (acceptable en P0.1).');
