import { describe, it, expect } from '@jest/globals';
import { offlineCapabilities } from './offline';
import { SKILLS } from './seed';
import { GLOSSARY_TERMS } from './glossary';
import { BADGES } from './badges';

describe('offlineCapabilities', () => {
  const cap = offlineCapabilities();

  it('reflète le contenu réellement embarqué', () => {
    expect(cap.skills).toBe(SKILLS.length);
    expect(cap.glossaryTerms).toBe(GLOSSARY_TERMS.length);
    expect(cap.badges).toBe(BADGES.length);
  });

  it('garantit que le parcours est disponible hors-ligne', () => {
    expect(cap.lessons).toBeGreaterThan(0);
    expect(cap.exercises).toBeGreaterThan(0);
    expect(cap.contentReady).toBe(true);
    expect(cap.progressLocal).toBe(true);
  });
});
