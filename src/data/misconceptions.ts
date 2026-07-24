/**
 * Misconceptions typées (Learning-Master Lot 7) — pur, testable.
 *
 * Une erreur n'est pas qu'un exercice raté : elle traduit souvent une idée fausse récurrente. Ce
 * module classe les `errorTags` (id d'exercice → nombre d'échecs) en **misconceptions** nommées,
 * chacune avec un conseil, pour que la révision cible la compréhension plutôt qu'un id opaque.
 */
export interface Misconception {
  id: string;
  label: string;
  hint: string;
}

export const MISCONCEPTIONS: Misconception[] = [
  { id: 'couleur-seule', label: 'Lire la couleur seule', hint: 'La couleur d’une bougie = sens ouverture → clôture, pas une règle magique.' },
  { id: 'corps-meche', label: 'Confondre corps et mèches', hint: 'Le corps donne le sens (ouverture ↔ clôture) ; les mèches montrent les extrêmes atteints, pas le sens.' },
  { id: 'tendance-une-bougie', label: 'Conclure sur une seule bougie', hint: 'La tendance se lit sur la structure d’ensemble, pas sur une bougie isolée.' },
  { id: 'niveau-certitude', label: 'Prendre un niveau pour une certitude', hint: 'Un support/résistance est un repère, jamais une garantie.' },
  { id: 'figure-anticipee', label: 'Anticiper une figure', hint: 'Attends la cassure ou la confirmation avant de conclure.' },
  { id: 'indicateur-signal', label: 'Prendre un indicateur pour un signal', hint: 'Un indicateur éclaire le contexte ; il ne décide pas à ta place.' },
  { id: 'valorisation', label: 'Confondre prix et valeur', hint: 'Le dividende ajuste le cours au détachement ; le PER se compare à secteur égal.' },
  { id: 'a-revoir', label: 'Notion à retravailler', hint: 'Revois la fiche liée, puis réessaie l’exercice.' },
];

const BY_ID = new Map(MISCONCEPTIONS.map((m) => [m.id, m]));

/** Rattachement précis d'un exercice à une misconception (prioritaire). */
export const MISCONCEPTION_BY_EXERCISE: Record<string, string> = {
  'ex.actions.chart-direction': 'tendance-une-bougie',
  'ex.actions.green-candle': 'couleur-seule',
  'ex.actions.dividende': 'valorisation',
  'ex.actions.per': 'valorisation',
  // Unité pilote « Comprendre un chandelier » : chaque erreur pointe l'idée fausse RÉELLE
  // (pas le repli générique de compétence). Bobo pointe donc la bonne confusion à la remédiation.
  'ex.candles.direction': 'tendance-une-bougie', // lire le sens sur une seule bougie, pas la structure
  'ex.candles.label-high': 'corps-meche', // ce que marque une mèche (l'extrême atteint)
  'ex.candles.zone-high': 'corps-meche', // où le plus haut a été atteint (mèche haute)
  'ex.candles.read-order': 'couleur-seule', // lire la couleur avant le corps et les mèches
  'ex.candles.false-signal': 'couleur-seule', // « la couleur prédit la suivante »
};

/** Défaut par compétence (extrait du préfixe « ex.<skill>.… » de l'id d'exercice). */
const MISCONCEPTION_BY_SKILL: Record<string, string> = {
  actions: 'couleur-seule',
  trend: 'niveau-certitude',
  candles: 'couleur-seule',
  patterns: 'figure-anticipee',
};

export function misconceptionIdForExercise(exerciseId: string): string {
  if (MISCONCEPTION_BY_EXERCISE[exerciseId]) return MISCONCEPTION_BY_EXERCISE[exerciseId];
  const skill = exerciseId.split('.')[1];
  return (skill && MISCONCEPTION_BY_SKILL[skill]) || 'a-revoir';
}

/** Remédiation d'une erreur : l'objectif précis à retravailler + le conseil misconception. */
export interface Remediation {
  /** Objectif ciblé par l'exercice (libellé), si l'exercice porte une cible ; sinon null. */
  objectiveLabel: string | null;
  /** Slug du concept concerné (pour router vers la fiche), si connu. */
  conceptSlug: string | null;
  /** Conseil issu de la misconception (toujours présent). */
  misconception: Misconception;
}

/**
 * Relie une erreur à la remédiation du BON objectif. Quand l'exercice porte une
 * cible (conceptId + objectiveId), la remédiation pointe l'objectif réel du
 * concept plutôt qu'un conseil générique ; sinon on retombe sur la misconception.
 */
export function remediationForExercise(
  exercise: { id: string; target?: { objectiveId: string } },
  objectiveLabelOf: (objectiveId: string) => { label: string; conceptSlug: string } | undefined,
): Remediation {
  const misconception = BY_ID.get(misconceptionIdForExercise(exercise.id)) ?? MISCONCEPTIONS[MISCONCEPTIONS.length - 1];
  if (exercise.target) {
    const obj = objectiveLabelOf(exercise.target.objectiveId);
    if (obj) return { objectiveLabel: obj.label, conceptSlug: obj.conceptSlug, misconception };
  }
  return { objectiveLabel: null, conceptSlug: null, misconception };
}

export interface MisconceptionSummary {
  misconception: Misconception;
  count: number;
}

/** Agrège les `errorTags` (exerciseId → échecs) en misconceptions, triées par fréquence décroissante. */
export function summarizeMisconceptions(errorTags: Record<string, number>): MisconceptionSummary[] {
  const counts = new Map<string, number>();
  for (const [exId, n] of Object.entries(errorTags)) {
    if (typeof n !== 'number' || n <= 0) continue;
    const id = misconceptionIdForExercise(exId);
    counts.set(id, (counts.get(id) ?? 0) + n);
  }
  return [...counts.entries()]
    .map(([id, count]) => ({ misconception: BY_ID.get(id), count }))
    .filter((s): s is MisconceptionSummary => Boolean(s.misconception))
    .sort((a, b) => b.count - a.count);
}
