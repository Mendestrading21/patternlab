#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const deployment = JSON.parse(readFileSync(join(root, 'config/deployment.json'), 'utf8'));
const basePath = deployment.webBasePath;

if (!existsSync(join(dist, 'index.html'))) {
  console.error('✗ dist/index.html absent. Exécuter le contrôle après le build web.');
  process.exit(1);
}

for (const required of ['404.html', '.nojekyll', 'manifest.json']) {
  if (!existsSync(join(dist, required))) {
    console.error(`✗ Fichier GitHub Pages absent : dist/${required}`);
    process.exit(1);
  }
}

const walk = (directory) =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });

const htmlFiles = walk(dist).filter((path) => path.endsWith('.html'));
const missing = new Set();
const stale = [];
let checkedReferences = 0;

const referenceExists = (relativePath) => {
  const candidates = [
    join(dist, relativePath),
    join(dist, `${relativePath}.html`),
    join(dist, relativePath, 'index.html'),
  ];
  return candidates.some(existsSync);
};

for (const htmlPath of htmlFiles) {
  const html = readFileSync(htmlPath, 'utf8');
  if (html.includes('/patternlab/')) stale.push(relative(dist, htmlPath));

  for (const match of html.matchAll(/(?:src|href)=["']([^"']+)["']/g)) {
    const reference = match[1].split(/[?#]/, 1)[0];
    if (!reference.startsWith(`${basePath}/`)) continue;

    checkedReferences += 1;
    const relativeAsset = reference.slice(basePath.length + 1);
    if (relativeAsset === '') continue;
    if (!referenceExists(relativeAsset)) missing.add(`${relative(dist, htmlPath)} → ${reference}`);
  }
}

if (stale.length > 0 || missing.size > 0 || checkedReferences === 0) {
  for (const path of stale) console.error(`✗ Ancien chemin /patternlab/ dans ${path}`);
  for (const reference of missing) console.error(`✗ Ressource de build absente : ${reference}`);
  if (checkedReferences === 0) console.error(`✗ Aucune ressource HTML n'utilise ${basePath}/.`);
  process.exit(1);
}

console.log(`✓ ${htmlFiles.length} pages HTML et ${checkedReferences} références vérifiées sous ${basePath}/`);
