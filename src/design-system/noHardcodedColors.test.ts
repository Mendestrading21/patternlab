import { describe, it, expect } from '@jest/globals';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Garde-fou de finition (Lot 12) : les écrans (`src/app`) ne définissent AUCUNE couleur en dur.
 * La couleur vient toujours du design system (`theme.colors.*`). Empêche la dérive « couleur posée
 * arbitrairement dans un écran » interdite par le canon Trademy Learning Glass.
 *
 * Exception : `+html.tsx` (feuille CSS web statique injectée au build) — hors design system RN.
 */
const HEX = /#[0-9A-Fa-f]{6}\b/;
const APP_DIR = join(process.cwd(), 'src', 'app');
const ALLOWLIST = new Set(['+html.tsx']);

function collectTsx(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      out.push(...collectTsx(full));
    } else if (entry.endsWith('.tsx') && !entry.endsWith('.test.tsx') && !ALLOWLIST.has(entry)) {
      out.push(full);
    }
  }
  return out;
}

describe('finition — aucune couleur en dur dans les écrans', () => {
  it('src/app/**.tsx n’utilise que les tokens du design system', () => {
    const offenders: string[] = [];
    for (const file of collectTsx(APP_DIR)) {
      const content = readFileSync(file, 'utf8');
      content.split('\n').forEach((line, i) => {
        if (HEX.test(line)) offenders.push(`${file.replace(process.cwd(), '.')}:${i + 1} → ${line.trim()}`);
      });
    }
    expect(offenders).toEqual([]);
  });
});
