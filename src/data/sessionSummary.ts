/**
 * Résumé de fin de session — logique pure et testable (aucun rendu).
 * Alimente l'écran de résultat « façon Duolingo » : précision, palier, message.
 * Ne récompense jamais la vitesse ni un gain ; seulement la compréhension (réponses justes).
 */
export type SessionTier = 'perfect' | 'pass' | 'retry';

export interface SessionSummary {
  correct: number;
  total: number;
  /** Précision 0–1. */
  accuracy: number;
  /** Précision arrondie en pourcentage. */
  accuracyPct: number;
  tier: SessionTier;
  passed: boolean;
  emoji: string;
  headline: string;
}

/** Construit le résumé. `passRatio` = seuil de réussite (défaut 0.7, aligné sur la session). */
export function buildSessionSummary(correct: number, total: number, passRatio = 0.7): SessionSummary {
  const t = Math.max(0, Math.floor(Number.isFinite(total) ? total : 0));
  const c = Math.max(0, Math.min(t, Math.floor(Number.isFinite(correct) ? correct : 0)));
  const accuracy = t ? c / t : 0;
  const passed = t > 0 && c >= Math.ceil(t * passRatio);
  const tier: SessionTier = t > 0 && c === t ? 'perfect' : passed ? 'pass' : 'retry';
  const emoji = tier === 'perfect' ? '🏆' : tier === 'pass' ? '🎉' : '💪';
  const headline =
    tier === 'perfect'
      ? 'Sans faute — parfait !'
      : tier === 'pass'
        ? 'Session réussie, bravo !'
        : 'Bien essayé — révise et retente !';
  return { correct: c, total: t, accuracy, accuracyPct: Math.round(accuracy * 100), tier, passed, emoji, headline };
}
