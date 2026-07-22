import { describe, it, expect } from '@jest/globals';
import { CHART_SCENARIOS, chartScenarioById } from './chartLab';
import { datasetByKey } from '../engines/visual/visualDatasets';

const FORBIDDEN = /\b(buy|sell|profit garanti|signal sûr|trade gagnant|liberté financière garantie)\b/i;

describe('chartLab — scénarios de lecture de graphique', () => {
  it('des ids uniques et un dataset déterministe résolu par scénario', () => {
    const ids = CHART_SCENARIOS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const s of CHART_SCENARIOS) {
      expect(datasetByKey(s.datasetKey).length).toBeGreaterThan(0);
    }
  });

  it('chaque scénario a des annotations, une hypothèse de Toto et une garde de Bobo', () => {
    for (const s of CHART_SCENARIOS) {
      expect(s.annotations.length).toBeGreaterThan(0);
      expect(s.toto.trim().length).toBeGreaterThan(0);
      expect(s.bobo.trim().length).toBeGreaterThan(0);
    }
  });

  it('n’emploie aucun vocabulaire interdit (posture éducative)', () => {
    for (const s of CHART_SCENARIOS) {
      const blob = [s.title, s.question, s.toto, s.bobo, ...s.annotations.flatMap((a) => [a.label, a.detail])].join(' ');
      expect(FORBIDDEN.test(blob)).toBe(false);
    }
  });

  it('chartScenarioById retrouve un scénario', () => {
    expect(chartScenarioById(CHART_SCENARIOS[0].id)?.title).toBe(CHART_SCENARIOS[0].title);
    expect(chartScenarioById('inexistant')).toBeUndefined();
  });
});
