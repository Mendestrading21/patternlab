# ADR-042 — Bibliothèque visuelle de figures (post-V5, lot 1)

## Statut
Accepté. Premier lot de l'initiative **« un signal visuel partout »** (post-feuille-de-route V5),
déclenchée par l'ajout d'un dossier de 66 images de référence de figures de trading dans le dépôt.

## Contexte
L'utilisateur a ajouté un dossier `Patern Images REF/` (66 `.jpg` : cheat-sheets de chandeliers,
figures chartistes, structure/SMC, indicateurs, diagrammes de concepts). **Intention explicite** :
ces images sont une **source d'inspiration**, pas un contenu à embarquer — l'app doit **coder ses
propres schémas** pour que chaque question / carte / concept porte toujours un signal visuel du modèle
concerné, avec beaucoup d'illustrations.

Analyse des 66 images (6 agents de lecture, taxonomie dédupliquée) : ~30 figures de chandeliers,
~25 figures chartistes, structure/SMC, indicateurs (RSI, MACD, moyennes, Bollinger, volume,
divergences), Fibonacci, et des diagrammes de concepts (R:R, sessions, psychologie).

Le moteur de visuels (ADR-027) rendait déjà 4 types (`candle-anatomy`, `candlestick-pattern`,
`chart-pattern`, `market-structure`) mais seulement **10 datasets** et **12 concepts** portaient un
visuel. Le gros du vocabulaire de chandeliers n'avait aucune illustration.

## Décision
Livrer d'abord la **plus grande brique à moindre risque** : une **bibliothèque de chandeliers** qui
réutilise le renderer existant (aucune modification du moteur de rendu), plus une galerie parcourable.

1. **~20 nouveaux datasets OHLC déterministes** dans `visualDatasets.ts` (chandeliers simples :
   pendu, marteau inversé, dojis libellule/pierre tombale, toupie, marubozu ×2 ; doubles : avalement
   baissier, harami ×2, ligne de perce, couverture en nuage, pincettes ×2 ; triples : étoile du
   matin/soir, trois soldats/corbeaux) + `structure.downtrend.v1`. Micro-patterns codés en dur,
   valeurs choisies pour la lisibilité pédagogique — **jamais** une donnée réelle, aucun hasard.
2. **Catalogue `src/data/patternLibrary.ts`** (nouveau, pur) : type `PatternGlyph`, `PATTERN_LIBRARY`
   (**29 glyphes** groupés en 4 familles), `glyphToVisualSpec` (produit un `VisualSpec` rendable par
   `VisualCard`), helpers (`glyphById`, `glyphsByFamily`) + gardes testées `patternLibraryIntegrity`
   (ids uniques, familles connues, résumé/dataset présents) et `patternLibraryVocabularyIssues`.
3. **Source unique de vérité vocabulaire** : extraction de `vocabularyIssuesIn(texts)` dans
   `learningConcept.ts`, réutilisée par les concepts **et** la bibliothèque (aucun BUY/SELL ni promesse).
4. **Écran galerie** `/bibliotheque-visuelle` : les 29 figures rendues en `VisualCard`, groupées par
   famille, **filtrables par direction** (haussière / baissière / neutre), chaque carte portant son
   **résumé accessible**. Entrée depuis le Laboratoire.

## Conséquences
- Le vocabulaire de chandeliers dispose enfin d'un signal visuel systématique (29 figures illustrées),
  entièrement **généré en code** — aucune image de référence n'est copiée, embarquée ou distribuée.
- Réutilisation du renderer existant → risque minimal ; l'intégrité registre↔bibliothèque est **garantie
  par test** (chaque glyphe pointe vers un type supporté et un dataset non vide).
- Les images de référence restent **hors du périmètre de commit** de cette branche (déjà sur `main`,
  jamais nécessaires au runtime).
- **Reste à faire** (lots suivants de l'initiative) : figures chartistes riches (necklines/trendlines/
  projections dans le moteur), structure & SMC (CHoCH, supply/demand, FVG, sweep, fakeout), indicateurs
  (sous-graphe RSI/MACD/volume, bandes, Fibonacci), puis **câblage** d'un signal visuel sur chaque carte
  de quiz / exercice / révision. Aucun push ni publication sans accord explicite.

## Mise à jour opérationnelle — 2026-07-22

Les 66 images brutes ont rempli leur rôle d’inspiration et ont été retirées de l’arbre courant. La
bibliothèque codée, ses datasets et ses tests restent la seule implémentation distribuée. La direction
synthétisée est documentée dans `docs/design/VISUAL_DIRECTION.md`.
