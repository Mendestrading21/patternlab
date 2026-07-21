/**
 * Modes canoniques du graphique (Learning-Master Lot 5) — vocabulaire UNIQUE.
 *
 * Les quatre modes décrivent COMMENT un même graphique est présenté selon l'intention pédagogique :
 * - `static`      : lecture simple (axes + libellés, aucun overlay directif).
 * - `guided`      : lecture accompagnée (axes + libellés + overlays : tracés, zones, repères).
 * - `interactive` : l'apprenant manipule (tracer un niveau, révéler bougie par bougie).
 * - `blind`       : énigme (rien ne révèle la réponse, y compris au lecteur d'écran).
 *
 * `chartModeOptions` est la source unique qui dit, pour un mode, ce qui est montré. Les composants
 * (VisualCard, InteractiveChart, MarketReplayChart) réalisent ces modes ; ce module évite que chaque
 * écran réinvente « ce mode montre-t-il les libellés ? ».
 */
export type ChartMode = 'static' | 'guided' | 'interactive' | 'blind';

export const CHART_MODES: ChartMode[] = ['static', 'guided', 'interactive', 'blind'];

export interface ChartModeOptions {
  /** Afficher l'axe des prix (repères max/milieu/min). */
  showAxis: boolean;
  /** Afficher les overlays directifs (tracés, zones, repères). */
  showOverlays: boolean;
  /** Afficher les libellés/légendes (masqués en énigme). */
  showLabels: boolean;
  /** Mode énigme : aucune fuite de la réponse. */
  blind: boolean;
  /** L'apprenant peut manipuler le graphique. */
  interactive: boolean;
}

export function chartModeOptions(mode: ChartMode): ChartModeOptions {
  switch (mode) {
    case 'guided':
      return { showAxis: true, showOverlays: true, showLabels: true, blind: false, interactive: false };
    case 'interactive':
      return { showAxis: true, showOverlays: true, showLabels: true, blind: false, interactive: true };
    case 'blind':
      return { showAxis: false, showOverlays: false, showLabels: false, blind: true, interactive: false };
    case 'static':
    default:
      return { showAxis: true, showOverlays: false, showLabels: true, blind: false, interactive: false };
  }
}
