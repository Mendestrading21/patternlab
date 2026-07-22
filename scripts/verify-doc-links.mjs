#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const entries = ['README.md', 'CLAUDE.md', 'docs', '.claude', 'content/README.md', 'assets'];

const walkMarkdown = (path) => {
  if (!existsSync(path)) return [];
  if (statSync(path).isFile()) return path.endsWith('.md') ? [path] : [];
  return readdirSync(path).flatMap((entry) => walkMarkdown(join(path, entry)));
};

const markdownFiles = entries.flatMap((entry) => walkMarkdown(join(root, entry)));
const failures = [];
let localLinks = 0;

for (const sourcePath of markdownFiles) {
  const markdown = readFileSync(sourcePath, 'utf8');
  for (const match of markdown.matchAll(/!?\[[^\]]*\]\(([^)]+)\)/g)) {
    let target = match[1].trim().split(/\s+["']/, 1)[0].replace(/^<|>$/g, '');
    if (/^(?:https?:|mailto:|tel:|data:|sandbox:)/.test(target) || target.startsWith('/')) continue;
    target = target.split('#', 1)[0];
    if (target === '') continue;

    localLinks += 1;
    const destination = resolve(dirname(sourcePath), decodeURIComponent(target));
    if (!existsSync(destination)) {
      failures.push(`${relative(root, sourcePath)} → ${target}`);
    }
  }
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`✗ Lien local cassé : ${failure}`);
  process.exit(1);
}

console.log(`✓ ${localLinks} liens locaux vérifiés dans ${markdownFiles.length} fichiers Markdown`);
