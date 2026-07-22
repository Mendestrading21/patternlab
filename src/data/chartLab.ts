/**
 * Scénarios de « lecture de graphique » du Laboratoire — PURS, réutilisables, testables.
 * Chaque scénario s'appuie sur un dataset déterministe existant et propose des annotations
 * pédagogiques (affichables/masquables) + une hypothèse de Toto et une mise en garde de Bobo.
 * Strictement éducatif : jamais un signal en temps réel. Vocabulaire conforme (setup haussier,
 * zone de confirmation, invalidation, faux signal, scénario éducatif).
 */
export interface ChartAnnotation {
  label: string;
  detail: string;
}

export interface ChartScenario {
  id: string;
  title: string;
  /** Clé de dataset déterministe (résolue par `datasetByKey`). */
  datasetKey: string;
  /** Question de lecture posée à l'apprenant. */
  question: string;
  /** Annotations progressives (affichables / masquables). */
  annotations: ChartAnnotation[];
  /** Hypothèse de Toto (enthousiaste). */
  toto: string;
  /** Mise en garde de Bobo (prudence, invalidation, faux signal). */
  bobo: string;
}

export const CHART_SCENARIOS: ChartScenario[] = [
  {
    id: 'trend',
    title: 'Tendance haussière',
    datasetKey: 'structure.uptrend.v1',
    question: 'Où se lit la structure haussière ?',
    annotations: [
      { label: 'Creux de plus en plus hauts', detail: 'Chaque creux se forme au-dessus du précédent : la demande garde la main.' },
      { label: 'Zone de confirmation', detail: 'Un nouveau plus-haut franchi confirme la poursuite du setup haussier.' },
      { label: 'Invalidation', detail: 'Un creux qui passe sous le précédent casse la structure.' },
    ],
    toto: 'Tant que les creux montent, le scénario haussier tient.',
    bobo: 'Un seul creux plus bas, et la tendance est remise en cause.',
  },
  {
    id: 'break-retest',
    title: 'Cassure et retest',
    datasetKey: 'structure.break-retest.v1',
    question: 'Qu’est-ce qui rend une cassure crédible ?',
    annotations: [
      { label: 'Résistance', detail: 'Un plafond testé plusieurs fois sans être franchi.' },
      { label: 'Cassure', detail: 'Le prix clôture au-dessus : le plafond peut devenir plancher.' },
      { label: 'Retest', detail: 'Le prix revient tester l’ancien plafond — c’est la zone de confirmation.' },
      { label: 'Invalidation', detail: 'Un retour franc sous le niveau : la cassure était un faux signal.' },
    ],
    toto: 'Une cassure qui tient son retest est un scénario haussier plus solide.',
    bobo: 'Sans retest tenu, méfie-toi d’un faux breakout.',
  },
  {
    id: 'fakeout',
    title: 'Faux breakout',
    datasetKey: 'structure.fakeout.v1',
    question: 'Repère le piège.',
    annotations: [
      { label: 'Fausse cassure', detail: 'Le prix dépasse le niveau puis y rentre aussitôt.' },
      { label: 'Rejet', detail: 'La mèche montre le rejet — aucun suivi acheteur.' },
      { label: 'Faux signal', detail: 'Le mouvement piège ceux qui suivent la cassure sans confirmation.' },
    ],
    toto: 'Ça ressemblait à une cassure haussière…',
    bobo: '…mais le rejet immédiat invalide le scénario. Faux signal typique.',
  },
  {
    id: 'liquidity',
    title: 'Balayage de liquidité',
    datasetKey: 'structure.liquidity-sweep.v1',
    question: 'Où la liquidité est-elle prise ?',
    annotations: [
      { label: 'Creux évident', detail: 'Beaucoup placent leur invalidation juste sous ce creux.' },
      { label: 'Balayage', detail: 'Le prix pique sous le creux pour déclencher ces sorties.' },
      { label: 'Reprise', detail: 'Puis il repart : la liquidité a été absorbée.' },
    ],
    toto: 'Le pic sous le creux n’est pas forcément la fin du mouvement.',
    bobo: 'Reste éducatif : c’est un scénario possible, jamais une certitude.',
  },
];

export function chartScenarioById(id: string): ChartScenario | undefined {
  return CHART_SCENARIOS.find((s) => s.id === id);
}
