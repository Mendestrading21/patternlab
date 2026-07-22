// Exemple indicatif — adapter au modèle réel.
export const hammerConcept = {
  id: "candlestick-hammer",
  slug: "marteau-hammer",
  title: "Marteau (Hammer)",
  shortTitle: "Marteau",
  aliases: ["Hammer"],
  categoryId: "candlesticks",
  subcategoryId: "single-candle",
  difficulty: 1,
  prerequisites: ["candle-anatomy"],
  learningObjective: "Reconnaître la forme et comprendre pourquoi le contexte est indispensable.",
  definitionShort: "Petite bougie avec longue mèche basse illustrant un rejet des prix bas.",
  howToRecognize: [
    "petit corps proche du haut",
    "mèche basse nettement plus longue que le corps",
    "mèche haute faible ou absente"
  ],
  contextRequired: ["après une baisse ou près d’une zone importante"],
  interpretationLimits: ["la forme seule ne confirme aucun retournement"],
  falseSignals: ["apparition au milieu d’un range sans confirmation"],
  commonMistakes: ["confondre forme et setup complet"],
  visualSpec: {
    type: "candlestick-pattern",
    variant: "hammer",
    direction: "bullish",
    accessibilitySummary: "Petite bougie avec longue mèche inférieure."
  },
  relatedConceptIds: ["hanging-man", "inverted-hammer", "shooting-star"],
  status: "needsReview",
  version: 1,
  locale: "fr-CH",
  disclaimer: "Application éducative. Aucun contenu ne constitue un conseil financier. Le trading comporte un risque de perte."
};
