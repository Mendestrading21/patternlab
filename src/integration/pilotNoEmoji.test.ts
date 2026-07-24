import { describe, it, expect } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { characterLine, type DialogueContext } from '@/characters/dialogue';

/**
 * Garde-fou LOT 4-A : AUCUN emoji système dans le parcours pilote. On contrôle le CONTENU RÉELLEMENT
 * RENDU, pas seulement les fichiers d'écran :
 *   1. source des écrans session + monde ;
 *   2. source des modules de contenu consommés par la session (dialogues, misconceptions) ;
 *   3. sortie RUNTIME de toutes les variantes de `characterLine` (répliques Toto/Bobo rendues).
 *
 * Portée : pictogrammes/emoji (plages emoji + dingbats + symboles). Les flèches TYPOGRAPHIQUES
 * (→, ↔, ◀, ▶) et les formes géométriques restent autorisées comme texte.
 */
// Emoji (1F000–1FAFF), symboles divers & dingbats (2600–27BF, inclut ✓ ✔ ✅ 🎉…),
// symboles/étoiles (2B00–2BFF) et sélecteur de variation emoji (FE0F).
// EXCLUS volontairement : flèches (2190–21FF) et formes géométriques (25xx).
const EMOJI = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}️]/u;

const SCREENS = [
  join(process.cwd(), 'src', 'app', 'session', '[skillId].tsx'),
  join(process.cwd(), 'src', 'app', 'monde', '[id].tsx'),
];
// Modules de contenu PURS consommés par la session pilote (répliques + misconceptions rendues).
const CONTENT = [
  join(process.cwd(), 'src', 'characters', 'dialogue.ts'),
  join(process.cwd(), 'src', 'data', 'mascotMoment.ts'),
  join(process.cwd(), 'src', 'data', 'misconceptions.ts'),
];

function scan(file: string): string[] {
  const offenders: string[] = [];
  readFileSync(file, 'utf8')
    .split('\n')
    .forEach((line, i) => {
      const m = line.match(new RegExp(EMOJI, 'gu'));
      if (m) offenders.push(`${file.replace(process.cwd(), '.')}:${i + 1} → ${m.join(' ')}`);
    });
  return offenders;
}

describe('LOT 4-A — aucun emoji système dans le parcours pilote', () => {
  it.each(SCREENS)('écran %s sans pictogramme emoji', (file) => {
    expect(scan(file)).toEqual([]);
  });

  it.each(CONTENT)('contenu %s (rendu par la session) sans pictogramme emoji', (file) => {
    expect(scan(file)).toEqual([]);
  });

  it('toutes les variantes RENDUES de characterLine sont sans emoji', () => {
    const ctxs: DialogueContext[] = [];
    for (const correct of [true, false]) {
      for (const streak of [0, 3, 5]) {
        ctxs.push({ kind: 'answer', correct, streak });
        ctxs.push({ kind: 'recognition', correct, streak });
      }
    }
    for (const tier of ['perfect', 'pass', 'retry'] as const) ctxs.push({ kind: 'result', tier });
    ctxs.push({ kind: 'mission' });
    for (const direction of ['bullish', 'bearish', 'neutral'] as const) ctxs.push({ kind: 'concept', direction });

    const offenders: string[] = [];
    for (const ctx of ctxs) {
      // seeds 0..7 : couvrent toutes les entrées de chaque banque (≤ 4 variantes, cycle par modulo).
      for (let seed = 0; seed < 8; seed++) {
        const { text } = characterLine(ctx, seed);
        if (EMOJI.test(text)) offenders.push(`${JSON.stringify(ctx)}#${seed} → ${text}`);
      }
    }
    expect(offenders).toEqual([]);
  });
});
