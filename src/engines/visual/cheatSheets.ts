/**
 * Registre des aide-mémoire (type visuel `cheat-sheet`) — une grille de mini-schémas
 * légendés, chacun renvoyant à un dataset OHLC déterministe. Repère synthétique, jamais réel.
 */
export interface CheatItem {
  datasetKey: string;
  label: string;
}

export const CHEAT_SHEETS: Record<string, CheatItem[]> = {
  candles: [
    { datasetKey: 'candle.bullish-marubozu.v1', label: 'Verte : clôture > ouverture' },
    { datasetKey: 'candle.bearish-marubozu.v1', label: 'Rouge : clôture < ouverture' },
    { datasetKey: 'candle.doji.v1', label: 'Doji : indécision' },
    { datasetKey: 'candle.hammer.v1', label: 'Marteau : rejet du bas' },
  ],
  reversals: [
    { datasetKey: 'candle.hammer.v1', label: 'Marteau' },
    { datasetKey: 'candle.shooting-star.v1', label: 'Étoile filante' },
    { datasetKey: 'candle.bullish-engulfing.v1', label: 'Avalement haussier' },
    { datasetKey: 'candle.evening-star.v1', label: 'Étoile du soir' },
  ],
};

export function cheatSheet(variant: string): CheatItem[] | undefined {
  return CHEAT_SHEETS[variant];
}
