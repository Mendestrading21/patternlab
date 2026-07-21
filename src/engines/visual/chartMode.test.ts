import { describe, it, expect } from '@jest/globals';
import { CHART_MODES, chartModeOptions, type ChartMode } from './chartMode';

describe('chartMode — modes canoniques', () => {
  it('déclare exactement les quatre modes', () => {
    expect(CHART_MODES).toEqual(['static', 'guided', 'interactive', 'blind']);
  });

  it('blind ne montre ni axe, ni overlay, ni libellé', () => {
    const o = chartModeOptions('blind');
    expect(o.blind).toBe(true);
    expect(o.showAxis).toBe(false);
    expect(o.showOverlays).toBe(false);
    expect(o.showLabels).toBe(false);
    expect(o.interactive).toBe(false);
  });

  it('static montre axe + libellés mais pas d’overlays directifs', () => {
    const o = chartModeOptions('static');
    expect(o.showAxis).toBe(true);
    expect(o.showLabels).toBe(true);
    expect(o.showOverlays).toBe(false);
    expect(o.blind).toBe(false);
  });

  it('guided ajoute les overlays ; interactive ajoute la manipulation', () => {
    expect(chartModeOptions('guided').showOverlays).toBe(true);
    expect(chartModeOptions('guided').interactive).toBe(false);
    expect(chartModeOptions('interactive').interactive).toBe(true);
    expect(chartModeOptions('interactive').showOverlays).toBe(true);
  });

  it('seul blind masque les libellés (les autres les montrent)', () => {
    for (const m of CHART_MODES) {
      const o = chartModeOptions(m as ChartMode);
      expect(o.showLabels).toBe(m !== 'blind');
      expect(o.blind).toBe(m === 'blind');
    }
  });
});
