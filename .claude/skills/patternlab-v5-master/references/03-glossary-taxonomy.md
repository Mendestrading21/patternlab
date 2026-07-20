# 03 — Glossaire, taxonomie et modèle de contenu

## Objectif

Transformer le glossaire en bibliothèque visuelle connectée aux parcours, leçons, flashcards, quiz, révisions et laboratoire.

## Sources

Le dépôt APP contient notamment plus de 1 000 termes, des indicateurs, figures et guides. Les inventorier avant de créer des doublons.

## Taxonomie cible et volume minimal

| Famille | Cible |
|---|---:|
| Fondations et marchés | 45 |
| Anatomie du graphique | 35 |
| Chandeliers japonais | 75 |
| Figures chartistes et harmoniques | 90 |
| Structure / price action | 80 |
| Volume / profile / order flow | 65 |
| Indicateurs | 90 |
| Smart Money Concepts | 50 |
| Wyckoff | 50 |
| Risk management | 55 |
| Psychologie et processus | 55 |
| Options et volatilité | 65 |
| Macro et intermarket | 50 |

La taxonomie dépasse 800 emplacements possibles. Ne pas tout publier simultanément. Produire des lots de qualité avec revue humaine.

## Termes prioritaires

### Chandeliers

Doji, Dragonfly Doji, Gravestone Doji, Long-Legged Doji, Spinning Top, Marubozu, Hammer, Inverted Hammer, Hanging Man, Shooting Star, Bullish/Bearish Engulfing, Harami, Harami Cross, Piercing Line, Dark Cloud Cover, Tweezers, Kicker, Morning Star, Evening Star, Three White Soldiers, Three Black Crows, Three Inside/Outside, Rising/Falling Three Methods, Tasuki Gap, Abandoned Baby, Belt Hold, Advance Block, Deliberation, Mat Hold.

### Figures

Double/Triple Top et Bottom, Head and Shoulders, Inverse H&S, triangles, flags, pennants, rectangles, channels, wedges, Cup and Handle, rounding patterns, broadening formation, diamond, island reversal, V top/bottom, flat base, high tight flag, saucer base, Quasimodo, ABCD, Gartley, Bat, Butterfly, Crab, Shark, Cypher, Wolfe Wave et Three Drives.

### Structure et price action

HH/HL/LH/LL, impulsion, retracement, range, compression, expansion, breakout, breakdown, retest, pullback, throwback, fakeout, rejection, absorption, exhaustion, support/résistance, flip, neckline, trendline, inside/outside bar, pin bar, opening range, mean reversion, BOS, CHOCH, market structure shift et liquidity sweep.

### Volume

Relative volume, spike, dry-up, climax, stopping volume, effort vs result, no demand/no supply, OBV, CMF, MFI, VWAP, anchored VWAP, volume profile, POC, VAH, VAL, HVN, LVN, delta, cumulative delta, footprint, imbalance, open interest et breadth.

### SMC / Wyckoff / risque / psychologie

Liquidity, equal highs/lows, inducement, FVG, order block, breaker, mitigation, displacement, premium/discount, power of three, kill zones ; accumulation, distribution, spring, upthrust, SOS, SOW, LPS/LPSY ; position sizing, drawdown, expectancy, risk of ruin, Kelly ; FOMO, revenge trading, overtrading, confirmation bias, loss aversion, discipline et probabilistic thinking.

## Modèle cible

```ts
interface LearningConcept {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  aliases: string[];
  categoryId: string;
  subcategoryId: string;
  worldId: string;
  moduleId?: string;
  skillId?: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  prerequisites: string[];
  tags: string[];
  learningObjective: string;
  definitionShort: string;
  definitionDetailed: string;
  howToRecognize: string[];
  contextRequired: string[];
  interpretationLimits: string[];
  bullishScenario?: EducationalScenario;
  bearishScenario?: EducationalScenario;
  neutralScenario?: EducationalScenario;
  confirmationZone?: string;
  invalidation?: string;
  falseSignals: string[];
  commonMistakes: string[];
  checklist: string[];
  visualSpec?: VisualSpec;
  chartExamples: ChartExample[];
  interactiveTemplates: string[];
  flashcards: Flashcard[];
  miniQuizzes: MiniQuiz[];
  relatedConceptIds: string[];
  sources: ContentSource[];
  sourcePath?: string;
  sourceHash?: string;
  version: number;
  status: "imported" | "draft" | "needsReview" | "approved" | "published" | "archived";
  locale: "fr-CH" | "fr-FR";
  disclaimer: string;
}
```

Adapter au modèle réel du dépôt au lieu de forcer une duplication.

## Fiche concept

1. définition simple ;
2. objectif pédagogique ;
3. visuel principal ;
4. comment reconnaître ;
5. contexte requis ;
6. scénarios conditionnels ;
7. zone de confirmation ;
8. invalidation ;
9. faux signaux ;
10. erreurs fréquentes ;
11. exemple annoté ;
12. interaction ;
13. flashcard ;
14. mini-quiz ;
15. concepts liés ;
16. sources ;
17. disclaimer.

## Recherche

Recherche plein texte et alias FR/EN, catégories, difficultés, favoris, récemment vus, maîtrise, révision due et navigation contextuelle.

## Validation

IDs/slugs uniques, relations valides, sources présentes, statut valide, disclaimer, vocabulaire conforme, VisualSpec valide, datasets déterministes, version et locale. Aucun contenu généré automatiquement ne devient `published`.
