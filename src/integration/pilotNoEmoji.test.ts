import { describe, it, expect } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Garde-fou LOT 4-A : les écrans premium du pilote n'utilisent AUCUN emoji système en substitut
 * d'icône. La famille `TrademyIcon` (ou du texte, ou les mascottes) porte tout signe visuel.
 *
 * Portée : pictogrammes/emoji uniquement (plages emoji + dingbats + symboles). Les flèches
 * TYPOGRAPHIQUES (→, ↔, ◀, ▶) et les formes géométriques restent autorisées comme texte.
 */
const SCREENS = [
  join(process.cwd(), 'src', 'app', 'session', '[skillId].tsx'),
  join(process.cwd(), 'src', 'app', 'monde', '[id].tsx'),
];

// Emoji (1F000–1FAFF), symboles divers & dingbats (2600–27BF, inclut ✓ ✔ ✅ 🎉…),
// symboles/étoiles (2B00–2BFF) et sélecteur de variation emoji (FE0F).
// EXCLUS volontairement : flèches (2190–21FF) et formes géométriques (25xx).
const EMOJI = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}️]/u;

describe('LOT 4-A — aucun emoji système sur les écrans pilote modifiés', () => {
  it.each(SCREENS)('%s ne contient aucun pictogramme emoji', (file) => {
    const offenders: string[] = [];
    readFileSync(file, 'utf8')
      .split('\n')
      .forEach((line, i) => {
        const m = line.match(new RegExp(EMOJI, 'gu'));
        if (m) offenders.push(`${file.replace(process.cwd(), '.')}:${i + 1} → ${m.join(' ')}`);
      });
    expect(offenders).toEqual([]);
  });
});
