/**
 * Labs d'indicateurs paramétrables (Learning-Master Lot 6) — pur, testable.
 *
 * Chaque lab décrit un indicateur, un paramètre ajustable (période, écart-type…), ses valeurs
 * possibles et un **faux signal** éducatif. `configFor(value)` construit une `IndicatorConfig` que
 * `IndicatorPanel` sait déjà rendre — aucune modification du moteur : on branche le paramètre choisi
 * sur le calcul existant et l'apprenant voit l'indicateur se recomposer.
 */
import type { IndicatorConfig, IndicatorKind } from './indicatorConfigs';

export interface IndicatorLab {
  id: string;
  title: string;
  datasetKey: string;
  kind: IndicatorKind;
  /** Libellé du paramètre ajustable (ex. « Période »). */
  paramLabel: string;
  /** Valeurs proposées pour le paramètre. */
  paramValues: number[];
  /** Valeur par défaut (∈ paramValues). */
  defaultValue: number;
  /** Format lisible d'une valeur (ex. entier, ou une décimale). */
  formatValue: (v: number) => string;
  /** Piège classique : quand l'indicateur trompe (cadrage éducatif, jamais un signal). */
  falseSignal: string;
  /** Construit la config de rendu pour une valeur du paramètre. */
  configFor: (value: number) => IndicatorConfig;
}

export const INDICATOR_LABS: IndicatorLab[] = [
  {
    id: 'lab.rsi',
    title: 'RSI',
    datasetKey: 'indicator.rsi.v1',
    kind: 'rsi',
    paramLabel: 'Période',
    paramValues: [7, 14, 21],
    defaultValue: 14,
    formatValue: (v) => String(v),
    falseSignal:
      'Un RSI « suracheté » peut le rester longtemps en forte tendance : à lui seul, ce n’est pas un signal de retournement.',
    configFor: (value) => ({ datasetKey: 'indicator.rsi.v1', kind: 'rsi', period: value }),
  },
  {
    id: 'lab.ma',
    title: 'Moyenne mobile',
    datasetKey: 'indicator.ma.v1',
    kind: 'ma',
    paramLabel: 'Longueur (lente)',
    paramValues: [4, 6, 9],
    defaultValue: 6,
    formatValue: (v) => String(v),
    falseSignal:
      'Une moyenne trop courte multiplie les faux croisements ; trop longue, elle réagit tard. La longueur est un compromis.',
    configFor: (value) => ({ datasetKey: 'indicator.ma.v1', kind: 'ma', fast: 3, slow: value }),
  },
  {
    id: 'lab.bollinger',
    title: 'Bandes de Bollinger',
    datasetKey: 'indicator.bollinger.v1',
    kind: 'bollinger',
    paramLabel: 'Écart-type (k)',
    paramValues: [1.5, 2, 2.5],
    defaultValue: 2,
    formatValue: (v) => v.toFixed(1),
    falseSignal:
      'Toucher une bande n’est pas un signal : en tendance, le prix « marche » le long de la bande.',
    configFor: (value) => ({ datasetKey: 'indicator.bollinger.v1', kind: 'bollinger', period: 5, k: value }),
  },
];

export function indicatorLabById(id: string): IndicatorLab | undefined {
  return INDICATOR_LABS.find((l) => l.id === id);
}
