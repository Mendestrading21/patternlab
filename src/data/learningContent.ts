/**
 * Contenu V5 amorce — quelques `LearningConcept` pleinement rédigés pour valider le modèle
 * (Lot 1). Statut `needsReview` : jamais publié automatiquement. Le remplissage massif
 * (150 puis 500+) relève des Lots 9–10 via la fabrique de contenu.
 *
 * Conformité : éducatif, conditionnel, sans BUY/SELL ni promesse (garanti par test).
 */
import { DEFAULT_DISCLAIMER, type LearningConcept } from './learningConcept';

export const V5_CONCEPTS: LearningConcept[] = [
  {
    id: 'concept.hammer',
    slug: 'marteau',
    title: 'Marteau',
    shortTitle: 'Marteau',
    aliases: ['Hammer'],
    categoryId: 'cat.candles',
    worldId: 'world.candles',
    skillId: 'skill.candles',
    difficulty: 2,
    prerequisites: [],
    tags: ['chandelier', 'retournement', 'mèche'],
    learningObjective: 'Reconnaître un marteau et comprendre les conditions qui lui donnent du sens.',
    definitionShort: 'Une bougie à petit corps en haut et longue mèche basse, après une baisse.',
    definitionDetailed:
      'Le marteau a un petit corps situé dans le haut de la bougie et une mèche inférieure au moins deux fois plus longue que le corps, avec peu ou pas de mèche haute. Il traduit un rejet des prix bas pendant la séance : les vendeurs ont poussé, puis les acheteurs ont repris le contrôle avant la clôture.',
    howToRecognize: [
      'Petit corps dans le tiers haut de la bougie.',
      'Mèche basse ≥ 2× la hauteur du corps.',
      'Mèche haute quasi absente.',
      'Apparaît après une phase de baisse.',
    ],
    contextRequired: [
      'Une tendance baissière ou un pullback préalable.',
      'De préférence près d’un support connu.',
    ],
    interpretationLimits: [
      'Isolé, un marteau ne dit rien : le contexte fait le signal.',
      'En plein range, sa portée est faible.',
    ],
    bullishScenario: {
      conditions: [
        'Marteau sur un support testé.',
        'Bougie suivante qui confirme au-dessus du plus haut du marteau.',
      ],
      invalidation: 'Clôture nette sous le plus bas de la mèche du marteau.',
    },
    confirmationZone: 'Au-dessus du plus haut du marteau, sur la ou les bougies suivantes.',
    invalidation: 'Cassure et clôture sous le plus bas de la mèche.',
    falseSignals: [
      'Marteau sans support à proximité.',
      'Volume très faible qui n’appuie pas le rejet.',
    ],
    commonMistakes: [
      'Entrer avant toute confirmation.',
      'Confondre marteau et pendu (même forme, contexte opposé).',
    ],
    checklist: [
      'Tendance/contexte de baisse ?',
      'Mèche basse ≥ 2× le corps ?',
      'Support à proximité ?',
      'Confirmation attendue ?',
    ],
    visualSpec: {
      type: 'candlestick-pattern',
      variant: 'hammer',
      direction: 'bullish',
      labels: [
        { text: 'petit corps', at: 'body' },
        { text: 'longue mèche basse', at: 'lower-wick' },
      ],
      annotations: [
        { kind: 'zone', text: 'rejet des prix bas', direction: 'bullish' },
        { kind: 'note', text: 'contexte : après une baisse, près d’un support' },
      ],
      datasetKey: 'candle.hammer.v1',
      accessibilitySummary:
        'Bougie à petit corps en haut et longue mèche vers le bas, illustrant un rejet des prix bas après une baisse.',
    },
    chartExamples: [{ datasetKey: 'chart.hammer.support.v1', caption: 'Marteau formé sur un support, avec confirmation le lendemain.', direction: 'bullish' }],
    interactiveTemplates: ['select_chart_zone', 'identify_false_signal'],
    flashcards: [
      { front: 'Qu’indique un marteau ?', back: 'Un rejet des prix bas ; un possible retournement haussier s’il est confirmé et bien situé.' },
      { front: 'Marteau vs pendu ?', back: 'Même forme ; le marteau apparaît après une baisse, le pendu après une hausse.' },
    ],
    miniQuizzes: [
      {
        question: 'Quel élément valide le plus un marteau ?',
        options: ['Sa couleur', 'Un support à proximité', 'Sa taille absolue', 'L’heure de la séance'],
        correctIndex: 1,
        explanation: 'Le contexte prime : un marteau sur un support testé a bien plus de sens qu’isolé.',
      },
    ],
    relatedConceptIds: ['concept.support-resistance', 'concept.double-bottom'],
    sources: [{ label: 'Voix pédagogique PatternLab', kind: 'editorial' }],
    version: 1,
    status: 'needsReview',
    locale: 'fr-CH',
    disclaimer: DEFAULT_DISCLAIMER,
  },
  {
    id: 'concept.double-bottom',
    slug: 'double-creux',
    title: 'Double creux',
    shortTitle: 'Double creux',
    aliases: ['Double Bottom', 'W'],
    categoryId: 'cat.patterns',
    worldId: 'world.patterns',
    skillId: 'skill.patterns',
    difficulty: 3,
    prerequisites: ['concept.support-resistance'],
    tags: ['figure', 'retournement', 'W'],
    learningObjective: 'Repérer un double creux et sa zone de confirmation.',
    definitionShort: 'Deux creux à un niveau proche séparés par un rebond, formant un « W ».',
    definitionDetailed:
      'Le double creux se forme quand le prix teste deux fois un même plancher sans le casser, séparé par un sommet intermédiaire (ligne de cou). Une clôture au-dessus de la ligne de cou marque la confirmation de la figure.',
    howToRecognize: [
      'Deux creux à un niveau similaire.',
      'Un sommet intermédiaire qui définit la ligne de cou.',
      'Volume souvent plus faible au second creux.',
    ],
    contextRequired: ['Une baisse préalable qui donne un sens au retournement.'],
    interpretationLimits: ['Tant que la ligne de cou n’est pas franchie, la figure n’est pas confirmée.'],
    bullishScenario: {
      conditions: ['Second creux qui tient le niveau du premier.', 'Clôture au-dessus de la ligne de cou.'],
      invalidation: 'Clôture nette sous le niveau des deux creux.',
    },
    confirmationZone: 'Au-dessus de la ligne de cou (sommet intermédiaire).',
    invalidation: 'Le prix casse nettement sous le second creux.',
    falseSignals: ['Franchissement de la ligne de cou sans participation, suivi d’un retour sous celle-ci.'],
    commonMistakes: ['Anticiper avant le franchissement de la ligne de cou.'],
    checklist: ['Deux creux alignés ?', 'Ligne de cou identifiée ?', 'Franchissement confirmé ?'],
    visualSpec: {
      type: 'chart-pattern',
      variant: 'double-bottom',
      direction: 'bullish',
      labels: [
        { text: 'creux 1', at: 'low-1' },
        { text: 'creux 2', at: 'low-2' },
        { text: 'ligne de cou', at: 'neckline' },
      ],
      annotations: [{ kind: 'line', text: 'confirmation au-dessus de la ligne de cou', direction: 'bullish' }],
      datasetKey: 'pattern.double-bottom.v1',
      accessibilitySummary:
        'Deux creux à un niveau proche séparés par un sommet ; le franchissement du sommet confirme la figure.',
    },
    chartExamples: [{ datasetKey: 'chart.double-bottom.v1', caption: 'Double creux confirmé par une clôture au-dessus de la ligne de cou.', direction: 'bullish' }],
    interactiveTemplates: ['draw_level', 'place_invalidation'],
    flashcards: [{ front: 'Qu’est-ce qui confirme un double creux ?', back: 'Une clôture au-dessus de la ligne de cou (le sommet intermédiaire).' }],
    miniQuizzes: [
      {
        question: 'Quand la figure est-elle confirmée ?',
        options: ['Au second creux', 'Au franchissement de la ligne de cou', 'Dès le premier creux', 'Jamais'],
        correctIndex: 1,
        explanation: 'Sans franchissement de la ligne de cou, le double creux reste hypothétique.',
      },
    ],
    relatedConceptIds: ['concept.support-resistance', 'concept.hammer'],
    sources: [{ label: 'Voix pédagogique PatternLab', kind: 'editorial' }],
    version: 1,
    status: 'needsReview',
    locale: 'fr-CH',
    disclaimer: DEFAULT_DISCLAIMER,
  },
  {
    id: 'concept.support-resistance',
    slug: 'support-resistance',
    title: 'Support et résistance',
    shortTitle: 'Support / résistance',
    aliases: ['Support & Resistance'],
    categoryId: 'cat.structure',
    worldId: 'world.support-resistance',
    skillId: 'skill.trend',
    difficulty: 1,
    prerequisites: [],
    tags: ['structure', 'niveau', 'zone'],
    learningObjective: 'Identifier une zone de support ou de résistance et son rôle.',
    definitionShort: 'Niveaux où le prix bute : plancher (support) et plafond (résistance).',
    definitionDetailed:
      'Le support est une zone où les acheteurs reviennent ; la résistance une zone où les vendeurs reprennent la main. Ce sont des zones de mémoire du marché, pas des lignes exactes : mieux vaut raisonner en zones.',
    howToRecognize: [
      'Plusieurs touches au même niveau.',
      'Réactions visibles du prix (rejets, pauses).',
      'Un niveau cassé peut changer de rôle (flip).',
    ],
    contextRequired: ['Un historique de prix suffisant pour repérer les touches.'],
    interpretationLimits: ['Un niveau n’est jamais garanti ; il peut être franchi.'],
    neutralScenario: { conditions: ['Le prix évolue entre support et résistance (range).'], invalidation: 'Sortie franche et confirmée de la zone.' },
    confirmationZone: 'Réaction du prix à l’approche de la zone (rejet ou franchissement confirmé).',
    invalidation: 'Clôture nette au-delà de la zone, sans retour immédiat.',
    falseSignals: ['Mèche qui dépasse la zone sans clôture au-delà.'],
    commonMistakes: ['Tracer des lignes trop précises au lieu de zones.'],
    checklist: ['Plusieurs touches ?', 'Zone plutôt que ligne ?', 'Réaction du prix observée ?'],
    visualSpec: {
      type: 'market-structure',
      variant: 'support-resistance',
      direction: 'neutral',
      labels: [
        { text: 'résistance', at: 'upper-zone' },
        { text: 'support', at: 'lower-zone' },
      ],
      annotations: [{ kind: 'zone', text: 'zones de mémoire du marché' }],
      datasetKey: 'structure.support-resistance.v1',
      accessibilitySummary: 'Deux zones horizontales encadrant le prix : un plancher (support) et un plafond (résistance).',
    },
    chartExamples: [{ datasetKey: 'chart.support-resistance.v1', caption: 'Prix évoluant entre une zone de support et une zone de résistance.' }],
    interactiveTemplates: ['draw_level', 'select_chart_zone'],
    flashcards: [{ front: 'Support ou résistance : ligne ou zone ?', back: 'Une zone : le marché raisonne rarement au pixel près.' }],
    miniQuizzes: [
      {
        question: 'Qu’est-ce qu’un « flip » ?',
        options: ['Un indicateur', 'Un support cassé devenant résistance (ou l’inverse)', 'Une bougie', 'Un ordre'],
        correctIndex: 1,
        explanation: 'Un niveau franchi peut changer de rôle : support devient résistance, et réciproquement.',
      },
    ],
    relatedConceptIds: ['concept.hammer', 'concept.double-bottom'],
    sources: [{ label: 'Voix pédagogique PatternLab', kind: 'editorial' }],
    version: 1,
    status: 'needsReview',
    locale: 'fr-CH',
    disclaimer: DEFAULT_DISCLAIMER,
  },
];
