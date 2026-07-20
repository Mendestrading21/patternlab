/**
 * Setups de gestion du risque (visuel `risk-reward`) — pur, sans rendu.
 * Décrit les niveaux d'entrée, de stop et de cible (prix absolus dans l'échelle du dataset) et le
 * ratio risque/rendement. `VisualCard` lit `riskSetup(variant)` et trace niveaux + zones risque/rendement.
 * Pédagogique : illustre le rapport risque/rendement, jamais un ordre ni une promesse de gain.
 */
export interface RiskSetup {
  entry: number;
  stop: number;
  target: number;
  /** Étiquette du ratio risque:rendement (ex. « 1:2 »). */
  ratio: string;
}

export const RISK_SETUPS: Record<string, RiskSetup> = {
  'risk-reward': { entry: 52, stop: 48, target: 60, ratio: '1:2' },
  'stop-loss': { entry: 52, stop: 48, target: 60, ratio: '1:2' },
  'position-sizing': { entry: 52, stop: 48, target: 60, ratio: '1:2' },
};

export function riskSetup(variant?: string): RiskSetup | undefined {
  return variant ? RISK_SETUPS[variant] : undefined;
}
