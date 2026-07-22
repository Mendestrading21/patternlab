#!/usr/bin/env node

import { copyFileSync, existsSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const index = join(dist, 'index.html');

if (!existsSync(index)) {
  console.error('✗ dist/index.html absent. Finaliser uniquement après l’export Expo.');
  process.exit(1);
}

// GitHub Pages renvoie 404.html pour un accès direct à une route client. Copier l’entrée Expo
// permet au routeur de reprendre l’URL courante, notamment pour les routes dynamiques.
copyFileSync(index, join(dist, '404.html'));

// Garde-fou pour tout mode Pages qui passerait encore par Jekyll : `_expo/` doit être servi.
writeFileSync(join(dist, '.nojekyll'), '');

console.log('✓ Fallback GitHub Pages et .nojekyll ajoutés');
