# 04 — Moteur de visuels pédagogiques

## Objectif

Créer des illustrations originales, légères et paramétriques plutôt que des centaines d’images manuelles incohérentes.

## Familles de visuels

1. Anatomie d’une bougie : OHLC, corps et mèches.
2. Patterns de chandeliers : une à cinq bougies, contexte, confirmation, invalidation et faux signal.
3. Figures chartistes : structure, neckline, zones et scénario alternatif.
4. Structure de marché : HH/HL/LH/LL, impulsion, retracement, BOS/CHOCH.
5. Volume/profile : POC, VAH, VAL, HVN/LVN et participation.
6. Indicateurs : formule simplifiée, lecture, limites et divergence.
7. Comparaisons : formes proches et contextes différents.
8. Mini-cheat-sheets : panneaux originaux découpés en cartes lisibles sur mobile.

## Technologie

Priorité :

- `react-native-svg` ;
- composants paramétriques ;
- datasets déterministes ;
- tokens du design system ;
- résumés accessibles.

Raster seulement pour les personnages, textures ou exports validés.

## VisualSpec

```ts
interface VisualSpec {
  type: "candle-anatomy" | "candlestick-pattern" | "chart-pattern" |
        "market-structure" | "indicator" | "volume-profile" |
        "comparison" | "cheat-sheet";
  variant: string;
  direction?: "bullish" | "bearish" | "neutral";
  labels: VisualLabel[];
  annotations: VisualAnnotation[];
  datasetKey?: string;
  accessibilitySummary: string;
}
```

## Pipeline

1. choisir une famille ;
2. définir sa grammaire visuelle ;
3. créer un générateur SVG ;
4. produire les variantes depuis les données ;
5. tester en 320, 375 et 430 px ;
6. ajouter l’alternative textuelle ;
7. ajouter tests/snapshots déterministes ;
8. intégrer à une fiche, une leçon et un exercice.

## Interdictions

Ne pas reproduire les références image par image. Ne pas reprendre les textes, slogans, BUY/SELL, objectifs garantis, TP/SL prescriptifs ou esthétique casino.
