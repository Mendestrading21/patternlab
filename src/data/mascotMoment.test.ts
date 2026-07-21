import { describe, it, expect } from '@jest/globals';
import { mistakeMoment } from './mascotMoment';
import { MISCONCEPTIONS } from './misconceptions';

const hintOf = (id: string) => MISCONCEPTIONS.find((m) => m.id === id)!.hint;

describe('mistakeMoment — dialogue lié aux erreurs conceptuelles', () => {
  it('cible la misconception « valorisation » pour un exercice dividende', () => {
    const m = mistakeMoment('ex.actions.dividende');
    expect(m.character).toBe('bobo');
    expect(m.role).toBe('mistake');
    expect(m.misconceptionId).toBe('valorisation');
    expect(m.text).toContain(hintOf('valorisation'));
  });

  it('retombe sur la misconception de la compétence (trend → niveau-certitude)', () => {
    const m = mistakeMoment('ex.trend.mcq');
    expect(m.misconceptionId).toBe('niveau-certitude');
    expect(m.text).toContain(hintOf('niveau-certitude'));
  });

  it('un exercice inconnu donne un moment « à revoir » exploitable', () => {
    const m = mistakeMoment('ex.inconnu.x');
    expect(m.character).toBe('bobo');
    expect(m.text.length).toBeGreaterThan(0);
    expect(m.misconceptionId).toBe('a-revoir');
  });

  it('le texte n’est jamais prescriptif (pas de promesse ni d’ordre)', () => {
    for (const exId of ['ex.actions.green-candle', 'ex.patterns.x', 'ex.candles.y']) {
      const t = mistakeMoment(exId).text.toLowerCase();
      expect(t).not.toContain('profit garanti');
      expect(t).not.toMatch(/\bbuy\b|\bsell\b/);
    }
  });
});
