import { describe, it, expect } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Garde-fou LOT 4-B : l'écran d'Accueil (`(tabs)/index.tsx`) n'utilise AUCUN emoji système en
 * substitut d'icône. La famille `TrademyIcon` (ou du texte) porte tout signe visuel. Portée :
 * pictogrammes/emoji uniquement ; les flèches typographiques (→, ›) restent autorisées.
 */
const EMOJI = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}️]/u;
const ACCUEIL = join(process.cwd(), 'src', 'app', '(tabs)', 'index.tsx');

describe('LOT 4-B — Accueil sans emoji système', () => {
  it('src/app/(tabs)/index.tsx ne contient aucun pictogramme emoji', () => {
    const offenders: string[] = [];
    readFileSync(ACCUEIL, 'utf8')
      .split('\n')
      .forEach((line, i) => {
        const m = line.match(new RegExp(EMOJI, 'gu'));
        if (m) offenders.push(`${i + 1} → ${m.join(' ')}`);
      });
    expect(offenders).toEqual([]);
  });
});
