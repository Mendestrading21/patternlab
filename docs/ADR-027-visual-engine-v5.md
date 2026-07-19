# ADR-027 — Moteur de visuels statiques V5

## Statut
Accepté (V5 Lot 3 — Moteur de visuels, skill `patternlab-v5-master`).

## Contexte
La vision V5 est **visuelle-first** : chaque concept doit montrer, pas seulement définir. Créer
des centaines d'images manuelles serait incohérent, lourd et non maintenable. Le skill impose des
générateurs **paramétriques, déterministes et accessibles** (SVG), jamais une copie des images de
référence, jamais de BUY/SELL. Le modèle Lot 1 porte déjà `VisualSpec` (type/variant/datasetKey/
résumé accessible) ; il fallait le moteur qui le rend.

## Décision
1. **Géométrie pure** `src/engines/visual/candleGeometry.ts` : `candleLayout` (corps + mèches d'une
   série) et `candleAnatomyParts` (une bougie labellisée : corps, mèches, O/H/L/C). Réutilise
   `priceScale` (`engines/pattern/interactive.ts`) — **même échelle** que les graphiques existants.
   Sans rendu, testable.
2. **Datasets déterministes** `src/engines/visual/visualDatasets.ts` : OHLC indexés par `datasetKey`
   (anatomie, marteau, doji, étoile filante, avalement, double creux, support/résistance). Séries
   construites via `seriesFromTargets` (lisible, reproductible) ; micro-patterns codés en dur.
   Aucun hasard, aucune donnée temps réel.
3. **Composants SVG** (`react-native-svg`, responsive via `viewBox` + `width="100%"`) :
   `CandlestickGlyphs` (bougies + niveaux/zones optionnels), `CandleAnatomy` (bougie annotée).
   `VisualCard` **dispatche par `VisualSpec.type`** (candle-anatomy / candlestick-pattern /
   chart-pattern / market-structure) et affiche le **résumé accessible** en texte visible **et** en
   `accessibilityLabel` (information jamais transmise par la seule couleur). Types non couverts →
   repli lisible. Réutilise le rendu de `PatternChart` (tokens, corps/mèches).
4. **Écran** `src/app/concept/[slug].tsx` : fiche concept V5 (visuel + définition + reconnaissance +
   scénarios conditionnels + faux signaux + flashcard + concepts liés navigables). Accessible depuis
   une section **« Visuels V5 (aperçu) »** du Laboratoire (anatomie inline + liens vers les 3 fiches
   amorce). Analytics `concept_viewed`.
5. **Tests** : pureté de la géométrie (corps/mèches dans la boîte, haut au-dessus du corps),
   déterminisme des datasets, **intégrité registre ↔ concepts amorce** (chaque `VisualSpec` a un type
   supporté, un dataset présent et un résumé accessible).

## Conséquences
- Visuels originaux, légers, cohérents et accessibles, générés en code — extensibles aux familles
  restantes (figures, volume, indicateurs, comparaison, cheat-sheet) sans multiplier les PNG.
- Base prête pour les leçons V5 (Lot 7) et le glossaire premium (Lot 4) qui consommeront `VisualCard`.
- Statique par nature (aucune animation) → compatible reduced motion.

## Rollback
Le moteur (`src/engines/visual/`), la fiche `/concept/[slug]` et la section Laboratoire sont additifs ;
les retirer laisse la v1 intacte. Aucune donnée utilisateur concernée.
