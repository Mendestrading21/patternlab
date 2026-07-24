/**
 * Unité pilote « Comprendre un chandelier » — scénarios CANONIQUES (modèle officiel).
 *
 * Chaque item de l'unité pilote (compétence `skill.candles`, concept `concept.candle-anatomy`) est
 * défini ici comme un `LearningScenario` : une seule vérité d'où dérivent le graphique, la question,
 * la réponse, le feedback et le résumé accessible (cf. `engines/exercise/scenario.ts`). C'est le
 * gabarit à industrialiser pour les autres unités — quantité minimale, qualité maximale.
 *
 * Couverture : 3 objectifs atomiques réels du concept (recognize / interpret / avoid-false-signal),
 * 5 interactions RÉELLEMENT différentes (lecture de direction, tiers du plus haut au doigt, élément
 * marqué, ordre de lecture, faux signal), avec variantes sur `recognize` et `interpret` pour la
 * remédiation. Aucun vocabulaire BUY/SELL, aucune promesse de gain.
 */
import { buildScenarioExercises, type LearningScenario } from '../engines/exercise';
import { objectiveId } from './learningTarget';

/** Concept représentatif de l'unité pilote (source : CONCEPT_BY_SKILL / SKILL_CONCEPT_ID). */
export const PILOT_CANDLE_CONCEPT_ID = 'concept.candle-anatomy';
const C = PILOT_CANDLE_CONCEPT_ID;

/** Cible pédagogique (conceptId + objectiveId) pour un `kind` d'objectif du concept pilote. */
function target(kind: 'recognize' | 'interpret' | 'avoid-false-signal') {
  return { conceptId: C, objectiveId: objectiveId(C, kind) };
}

export const CANDLE_PILOT_SCENARIOS: LearningScenario[] = [
  // ── recognize : lire la structure d'ensemble (graphique, cohérent par construction) ──
  {
    id: 'ex.candles.direction',
    skillId: 'skill.candles',
    target: target('recognize'),
    interaction: 'read-direction',
    chartSeed: 7, // structure clairement haussière (dérivée, vérifiée par le test de cohérence)
    prompt: 'Voici une période en bougies. Quel est le sens dominant ?',
    options: ['Plutôt à la hausse', 'Plutôt à la baisse', 'Sans direction nette'],
    difficulty: 'easy',
    rule: 'Le sens se lit sur la structure d’ensemble (l’enchaînement des bougies), pas sur une seule.',
    whenItFails: 'Une seule grande bougie ne fait pas la tendance : c’est l’ensemble qui compte.',
  },
  // ── recognize (variante) : reconnaître l'élément marqué = le plus haut (graphique) ──
  {
    id: 'ex.candles.label-high',
    skillId: 'skill.candles',
    target: target('recognize'),
    interaction: 'label-extreme',
    chartSeed: 11, // le plus haut est atteint sur la dernière bougie (repère net)
    prompt: 'Le repère (▲) pointe un élément de la bougie. Que marque-t-il ?',
    options: ['Le plus haut atteint (mèche haute)', 'Le plancher (mèche basse)', 'Le volume échangé'],
    correctIndex: 0,
    difficulty: 'medium',
  },
  // ── interpret : toucher le tiers où le prix a atteint son plus haut (graphique, tactile) ──
  {
    id: 'ex.candles.zone-high',
    skillId: 'skill.candles',
    target: target('interpret'),
    interaction: 'touch-extreme-zone',
    chartSeed: 2024, // le plus haut tombe dans le tiers médian (zone claire, non au bord)
    prompt: 'Touche le tiers du graphique où le prix a atteint son plus haut.',
    difficulty: 'medium',
  },
  // ── interpret (variante) : ordonner la lecture d'une bougie (interaction d'ordre, non-QCM) ──
  {
    id: 'ex.candles.read-order',
    skillId: 'skill.candles',
    target: target('interpret'),
    interaction: 'read-order',
    prompt: 'Remets dans l’ordre les étapes pour lire une bougie.',
    steps: [
      'Repère le corps (ouverture ↔ clôture)',
      'Lis la couleur (le sens de la période)',
      'Mesure les mèches (les extrêmes atteints)',
      'Confronte au contexte (les bougies voisines)',
    ],
    correctOrder: [0, 1, 2, 3],
    difficulty: 'medium',
  },
  // ── avoid-false-signal : repérer l'affirmation fausse (faux signal du concept) ──
  {
    id: 'ex.candles.false-signal',
    skillId: 'skill.candles',
    target: target('avoid-false-signal'),
    interaction: 'spot-false-signal',
    prompt: 'Repère l’affirmation FAUSSE sur les bougies.',
    statements: [
      'Le corps relie l’ouverture et la clôture.',
      'Une longue mèche peut traduire un rejet de prix, à confirmer avec le contexte et les bougies voisines.',
      'La couleur d’une bougie prédit la bougie suivante.',
    ],
    errorIndex: 2,
    difficulty: 'medium',
  },
];

/** Exercices notés de l'unité pilote, DÉRIVÉS des scénarios (une seule vérité par item). */
export const CANDLE_PILOT_EXERCISES = buildScenarioExercises(CANDLE_PILOT_SCENARIOS);
