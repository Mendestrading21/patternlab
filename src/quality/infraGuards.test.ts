import { describe, it, expect } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Garde-fous P0 — infrastructure (LOT 1 « Fiabilité pédagogique »).
 *
 * Deux invariants qui ne peuvent pas se tester par le code applicatif :
 *  - le déploiement ne doit jamais contourner la gate complète ;
 *  - le web ne doit jamais bloquer le zoom (accessibilité WCAG 1.4.4 / 1.4.10).
 */
const ROOT = process.cwd();

describe('P0 — gate de déploiement', () => {
  it('deploy.yml exécute la gate complète (npm run check) avant de publier', () => {
    const yml = readFileSync(join(ROOT, '.github', 'workflows', 'deploy.yml'), 'utf8');
    // `npm run check` = lint · typecheck · tests · validate:content · release:check · build:web.
    expect(yml).toMatch(/run:\s*npm run check/);
  });
});

describe('P0 — accessibilité web : zoom (WCAG 1.4.4)', () => {
  it('le meta viewport ne bloque pas le zoom (ni user-scalable=no ni maximum-scale)', () => {
    const html = readFileSync(join(ROOT, 'src', 'app', '+html.tsx'), 'utf8');
    const match = html.match(/name="viewport"[^>]*content="([^"]+)"/);
    expect(match).not.toBeNull();
    const content = match![1];
    expect(content).not.toMatch(/user-scalable\s*=\s*no/i);
    expect(content).not.toMatch(/maximum-scale/i);
  });
});
