/**
 * Descriptions accessibles de graphiques — pures et testables.
 * Transforme une série de bougies en un résumé textuel pour lecteurs d'écran :
 * structure globale (haussière / baissière / latérale) + amplitude. Aucune information
 * n'est ainsi portée par la seule couleur du graphique.
 */
import type { Candle } from './types';

/** Résumé accessible d'une série de bougies (direction dominante + extrêmes). */
export function describeCandles(candles: Candle[]): string {
  if (!candles.length) return 'Graphique en chandeliers, aucune donnée.';
  const first = candles[0].c;
  const last = candles[candles.length - 1].c;
  const hi = Math.max(...candles.map((c) => c.h));
  const lo = Math.min(...candles.map((c) => c.l));
  const span = hi - lo || 1;
  const change = last - first;
  const dir =
    Math.abs(change) < span * 0.1 ? 'globalement latérale' : change > 0 ? 'globalement haussière' : 'globalement baissière';
  return `Graphique en chandeliers, ${candles.length} bougie${candles.length > 1 ? 's' : ''}, structure ${dir} ; du plus bas ${lo.toFixed(0)} au plus haut ${hi.toFixed(0)}.`;
}
