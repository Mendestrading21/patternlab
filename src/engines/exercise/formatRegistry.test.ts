import { describe, it, expect } from '@jest/globals';
import { EXERCISE_FORMAT_REGISTRY, exerciseFormatLabel } from './formatRegistry';
import { ALL_EXERCISE_TYPES } from './types';
import { supportedTypes } from './registry';

describe('EXERCISE_FORMAT_REGISTRY — source unique des formats', () => {
  it('décrit exactement les formats déclarés = branchés (13/13, aucun orphelin)', () => {
    const registryKeys = Object.keys(EXERCISE_FORMAT_REGISTRY).sort();
    const declared = [...ALL_EXERCISE_TYPES].sort();
    const implemented = [...supportedTypes()].sort();
    expect(registryKeys).toEqual(declared);
    expect(registryKeys).toEqual(implemented);
    expect(registryKeys).toHaveLength(13);
  });

  it('chaque format a un libellé, une alternative accessible et le statut live', () => {
    for (const [type, m] of Object.entries(EXERCISE_FORMAT_REGISTRY)) {
      expect(m.type).toBe(type);
      expect(m.label.trim().length).toBeGreaterThan(0);
      expect(m.a11y.trim().length).toBeGreaterThan(0);
      expect(m.status).toBe('live');
    }
  });

  it('exerciseFormatLabel renvoie le libellé du registre', () => {
    expect(exerciseFormatLabel('mcq')).toBe('Choix multiple');
    expect(exerciseFormatLabel('identify_figure')).toBe('Reconnais la figure');
  });

  it('les formats interactifs sont bien ceux à graphique/geste', () => {
    const interactive = Object.values(EXERCISE_FORMAT_REGISTRY).filter((m) => m.interactive).map((m) => m.type).sort();
    expect(interactive).toEqual(['label_chart', 'place_invalidation', 'select_chart_zone']);
  });
});
