# ADR-043 — Figures chartistes + moteur d'overlays (initiative visuelle, lot 2)

## Statut
Accepté. Lot 2 de l'initiative « un signal visuel partout ». S'appuie sur la bibliothèque de
chandeliers (ADR-042).

## Contexte
La bibliothèque couvrait les chandeliers mais pas les **figures chartistes** (triangles, biseaux,
drapeaux, épaule-tête-épaule…), très présentes dans les 66 images de référence. Le renderer ne savait
tracer que des bougies, des zones et des niveaux horizontaux — insuffisant pour montrer une **ligne de
cou**, une **ligne de tendance** ou les **bornes d'un canal**, qui sont l'essence de ces figures.

## Décision
1. **Moteur d'overlays réutilisable** dans `CandlestickGlyphs` : deux nouvelles props **`guides`**
   (tracés libres entre deux ancrages `{i, price}` — ligne de cou, tendance, canal ; pointillé + label
   optionnels) et **`markers`** (repères textuels positionnés : « épaule », « tête »…). Les ancrages
   sont exprimés dans l'espace (index de bougie, prix) et projetés par la même échelle que les bougies.
2. **Registre `figureOverlays.ts`** (pur) indexé par `variant` : pour chaque figure, ses guides/markers
   déterministes (lignes de cou dashed cyan, lignes de tendance violettes, bornes de canaux/rectangles).
   `VisualCard` lit `figureOverlay(spec.variant)` pour les specs `chart-pattern` et passe les overlays.
3. **20 nouvelles figures** (datasets OHLC déterministes + entrées `PATTERN_LIBRARY`, famille
   **`figure-chartiste`**) : triple creux/sommet, épaule-tête-épaule ±inversé, triangles
   ascendant/descendant/symétrique, biseaux ascendant/descendant, drapeaux haussier/baissier, fanions,
   rectangles haussier/baissier, canaux ascendant/descendant, tasse avec anse, fonds/sommets arrondis.
   Les doubles creux/sommet existants gagnent leur ligne de cou via le même registre.

## Conséquences
- Les figures chartistes ont enfin un schéma **lisible et étiqueté** (la ligne de cou/les trendlines
  sont dessinées, pas seulement décrites) — toujours généré en code, aucune image copiée.
- Le moteur d'overlays est **générique** : le Lot 3 (structure & SMC : supply/demand, FVG, sweep…)
  réutilisera `guides`/`zones`/`markers` sans nouveau code de rendu.
- Intégrité garantie par test : aucun overlay orphelin, coordonnées finies, index de bougie dans la
  série ; chaque figure a un type supporté + un dataset non vide + un résumé accessible + vocabulaire
  conforme. La galerie compte **49 figures**.
- Reste (lots suivants) : structure & SMC (3), indicateurs avec sous-panneau (4), câblage d'un signal
  visuel sur chaque carte quiz/exercice/révision (5). Aucun push sans accord explicite.
