/**
 * Registre unique des formats d'exercice (Learning-Master Lot 7).
 *
 * Source de vérité décrivant CHAQUE format branché : libellé, caractère interactif, alternative
 * accessible, statut. Le type `Record<ExerciseType, …>` garantit à la compilation que **tout** format
 * de l'union est décrit ici (exhaustivité). La session et les stats en dérivent leurs libellés.
 */
import type { ExerciseType } from './types';

export interface ExerciseFormatMeta {
  type: ExerciseType;
  /** Libellé affiché (session, stats). */
  label: string;
  /** Utilise un graphique ou un geste → alternative accessible obligatoire. */
  interactive: boolean;
  /** Comment le format reste accessible (clavier / boutons / description). */
  a11y: string;
  /** `live` : grader + renderer présents (le seul statut désormais). */
  status: 'live';
}

const meta = (
  type: ExerciseType,
  label: string,
  interactive: boolean,
  a11y: string,
): ExerciseFormatMeta => ({ type, label, interactive, a11y, status: 'live' });

export const EXERCISE_FORMAT_REGISTRY: Record<ExerciseType, ExerciseFormatMeta> = {
  mcq: meta('mcq', 'Choix multiple', false, 'Options en gros boutons.'),
  true_false: meta('true_false', 'Vrai ou faux', false, 'Deux boutons Vrai / Faux.'),
  match: meta('match', 'Associe', false, 'Association par sélections au clavier.'),
  order: meta('order', 'Mets dans l’ordre', false, 'Réordonnancement par boutons monter/descendre.'),
  select_chart_zone: meta('select_chart_zone', 'Zone du graphique', true, 'Zones sélectionnables via des boutons labellisés.'),
  identify_pattern: meta('identify_pattern', 'Reconnais la figure', false, 'Graphique décrit par un résumé + options.'),
  find_error: meta('find_error', 'Trouve l’erreur', false, 'Affirmations sélectionnables une à une.'),
  scenario: meta('scenario', 'Scénario', false, 'Contexte SI/ALORS + options en boutons.'),
  numeric: meta('numeric', 'Réponse numérique', false, 'Champ numérique avec unité.'),
  place_invalidation: meta('place_invalidation', 'Place l’invalidation', true, 'Niveau réglable au tap ou aux flèches ↑/↓.'),
  label_chart: meta('label_chart', 'Étiquette le graphique', true, 'Bougie marquée par un repère + options.'),
  sequence_market_structure: meta('sequence_market_structure', 'Ordonne la structure', false, 'Étapes réordonnables par boutons.'),
  identify_figure: meta('identify_figure', 'Reconnais la figure', false, 'Figure en énigme (sans fuite) + options.'),
};

export function exerciseFormatMeta(type: ExerciseType): ExerciseFormatMeta | undefined {
  return EXERCISE_FORMAT_REGISTRY[type];
}

export function exerciseFormatLabel(type: ExerciseType): string {
  return EXERCISE_FORMAT_REGISTRY[type]?.label ?? 'Exercice';
}
