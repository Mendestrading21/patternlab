#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const readJson = (path) => JSON.parse(readFileSync(join(root, path), 'utf8'));
const deployment = readJson('config/deployment.json');
const manifestBase = readJson('config/web-manifest.json');
const basePath = deployment.webBasePath.replace(/\/$/, '');

if (!basePath.startsWith('/') || basePath === '') {
  throw new Error('config/deployment.json: webBasePath doit commencer par « / ».');
}

const manifest = {
  ...manifestBase,
  id: `${basePath}/`,
  start_url: `${basePath}/`,
  scope: `${basePath}/`,
  icons: [
    { src: `${basePath}/icon-192.png`, sizes: '192x192', type: 'image/png', purpose: 'any' },
    { src: `${basePath}/icon-512.png`, sizes: '512x512', type: 'image/png', purpose: 'any' },
  ],
};

writeFileSync(join(root, 'public/manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`✓ Manifest PWA généré pour ${basePath}/`);
