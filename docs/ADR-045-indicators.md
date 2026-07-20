# ADR-045 — Indicateurs techniques (initiative visuelle, lot 4)

## Statut
Accepté. Lot 4 de l'initiative « un signal visuel partout ». Ajoute un **nouveau type de rendu**
(`indicator`), le premier qui n'est pas une simple bougie annotée.

## Contexte
Les images de référence couvrent largement les **indicateurs** (moyennes mobiles, RSI, MACD, Bollinger,
volume, Fibonacci, divergences). Le type `indicator` de `VisualSpec` existait mais retombait sur un texte
de repli — aucun indicateur n'était dessiné. Ces indicateurs demandent des primitives nouvelles :
courbes lissées (polylignes), un **sous-panneau** à échelle propre (oscillateur 0–100, histogramme
centré sur zéro), des barres de volume, des niveaux horizontaux.

## Décision
1. **Calculs purs et testés** `indicatorMath.ts` : `sma`, `ema`, `rsi` (Wilder), `macdSeries`
   (macd/signal/histogramme), `bollinger` (SMA ± k·σ), `fibLevels`, `volumeBars`. Déterministes,
   sans donnée réelle — 8 tests dédiés (bornes RSI, hist = macd − signal, upper ≥ mid ≥ lower…).
2. **Renderer `IndicatorPanel`** : panneau prix (bougies) + superpositions (moyennes, bandes, niveaux
   Fibonacci, guide de divergence) et, selon l'indicateur, un **sous-panneau** à échelle propre : RSI
   (zones suracheté/survendu + lignes 70/30), MACD (zéro + histogramme + lignes), volume (barres),
   oscillateur de divergence (sommets décroissants tandis que le prix monte).
3. **Registre `indicatorConfigs.ts`** indexé par variant (kind + paramètres). `VisualCard` rend
   `IndicatorPanel` pour les specs `indicator` ; `SUPPORTED_VISUAL_TYPES` gagne `indicator`.
4. **7 indicateurs** (datasets dédiés + `PATTERN_LIBRARY`, famille **`indicateur`**) : moyennes mobiles
   (croisement), Bollinger (compression→expansion), RSI (OB/OS), MACD, volume, Fibonacci, divergence.

## Conséquences
- Les indicateurs, cœur de beaucoup de références, ont enfin un schéma **calculé en code** et lisible
  (courbes, sous-panneaux, niveaux), cadré comme éducatif (« à lire avec le contexte », « jamais garanti »).
- Le socle mathématique pur est réutilisable (leçons, exercices futurs) et **entièrement testé**.
- Galerie : **64 figures** sur **7 familles**. Intégrité garantie par test : configs non orphelines,
  datasets présents, divergence cohérente (oscillateur aligné, sommets décroissants, prix croissant).
- Reste : **Lot 5** — câbler un signal visuel sur chaque carte de quiz / exercice / révision, pour que
  l'objectif « toujours un signal de ce que c'est comme modèle » soit tenu partout. Aucun push sans accord.
