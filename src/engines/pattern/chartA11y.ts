/**
 * Descriptions accessibles de graphiques — pures et testables.
 * Transforme une série de bougies en un résumé textuel pour lecteurs d'écran :
 * structure globale (haussière / baissière / latérale) + amplitude. Aucune information
 * n'est ainsi portée par la seule couleur du graphique.
 */
import type { Candle } from './types';

/** Tendance dominante d'une série de bougies. Source UNIQUE de vérité de la direction. */
export type CandleTrend = 'haussière' | 'baissière' | 'latérale';

/**
 * Direction dominante d'une série — dérivée de la première vs dernière clôture,
 * relativisée à l'amplitude (seuil 10 %). Utilisée par le résumé accessible ET par
 * la génération d'exercices directionnels : graphique, réponse et a11y partagent
 * ainsi une seule vérité.
 */
export function candleTrend(candles: Candle[]): CandleTrend {
  if (!candles.length) return 'latérale';
  const first = candles[0].c;
  const last = candles[candles.length - 1].c;
  const hi = Math.max(...candles.map((c) => c.h));
  const lo = Math.min(...candles.map((c) => c.l));
  const span = hi - lo || 1;
  const change = last - first;
  if (Math.abs(change) < span * 0.1) return 'latérale';
  return change > 0 ? 'haussière' : 'baissière';
}

/** Résumé accessible d'une série de bougies (direction dominante + extrêmes). */
export function describeCandles(candles: Candle[]): string {
  if (!candles.length) return 'Graphique en chandeliers, aucune donnée.';
  const hi = Math.max(...candles.map((c) => c.h));
  const lo = Math.min(...candles.map((c) => c.l));
  const dir = `globalement ${candleTrend(candles)}`;
  return `Graphique en chandeliers, ${candles.length} bougie${candles.length > 1 ? 's' : ''}, structure ${dir} ; du plus bas ${lo.toFixed(0)} au plus haut ${hi.toFixed(0)}.`;
}
