#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFileSync(join(root, path), 'utf8');
const readJson = (path) => JSON.parse(read(path));
const deployment = readJson('config/deployment.json');
const manifest = readJson('public/manifest.json');
const appJson = readJson('app.json');
const basePath = deployment.webBasePath;

const failures = [];
const expect = (condition, message) => {
  if (!condition) failures.push(message);
};

expect(/^\/[A-Za-z0-9._~-]+$/.test(basePath), 'webBasePath doit être un chemin absolu simple, sans slash final.');
expect(deployment.publicUrl.endsWith(`${basePath}/`), 'publicUrl doit se terminer par webBasePath/.');
expect(!('baseUrl' in (appJson.expo?.experiments ?? {})), 'app.json ne doit pas dupliquer experiments.baseUrl.');
expect(manifest.id === `${basePath}/`, 'manifest.id ne correspond pas à webBasePath.');
expect(manifest.start_url === `${basePath}/`, 'manifest.start_url ne correspond pas à webBasePath.');
expect(manifest.scope === `${basePath}/`, 'manifest.scope ne correspond pas à webBasePath.');
expect(manifest.icons.every((icon) => icon.src.startsWith(`${basePath}/`)), 'Les icônes du manifest doivent utiliser webBasePath.');

for (const path of ['app.json', 'src/app/+html.tsx', 'public/manifest.json', 'docs/BUILD.md']) {
  expect(!read(path).includes('/patternlab/'), `${path} contient encore l'ancien chemin /patternlab/.`);
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`✗ ${failure}`);
  process.exit(1);
}

console.log(`✓ Configuration de déploiement alignée sur ${basePath}/`);
