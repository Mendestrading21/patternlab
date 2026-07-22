#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(readFileSync(join(root, 'assets/brand/asset-manifest.json'), 'utf8'));
const failures = [];

const pngSize = (buffer) => {
  const signature = buffer.subarray(0, 8).toString('hex');
  if (signature !== '89504e470d0a1a0a') return null;
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
};

const sourcePath = join(root, manifest.canonicalSource);
if (!existsSync(sourcePath)) {
  failures.push(`Source canonique absente : ${manifest.canonicalSource}`);
} else {
  const sourceDigest = createHash('sha256').update(readFileSync(sourcePath)).digest('hex');
  if (sourceDigest !== manifest.canonicalSourceSha256) {
    failures.push(`Source canonique différente du manifeste : ${manifest.canonicalSource}`);
  }
}

for (const asset of manifest.assets) {
  const path = join(root, asset.path);
  if (!existsSync(path)) {
    failures.push(`Asset absent : ${asset.path}`);
    continue;
  }

  const buffer = readFileSync(path);
  const size = pngSize(buffer);
  const digest = createHash('sha256').update(buffer).digest('hex');
  if (!size || size.width !== asset.width || size.height !== asset.height) {
    failures.push(`${asset.path} : dimension attendue ${asset.width}x${asset.height}.`);
  }
  if (digest !== asset.sha256) failures.push(`${asset.path} : empreinte différente du manifeste.`);
}

if (failures.length > 0) {
  for (const failure of failures) console.error(`✗ ${failure}`);
  process.exit(1);
}

console.log(`✓ ${manifest.assets.length} exports de marque PatternLab vérifiés`);
