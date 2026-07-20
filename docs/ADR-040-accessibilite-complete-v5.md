# ADR-040 — Accessibilité complète V5

## Statut
Accepté (V5 Lot 15 — Accessibilité complète, skill `patternlab-v5-master`).

## Contexte
La base a11y v1 est solide (contraste AA testé, cibles tactiles 44, type dynamique via `Text`, en-têtes
`h1`, `useReducedMotion`, `decorative`). Les lots V5 ont ajouté beaucoup de surfaces (visuels SVG,
graphiques, glossaire premium, fiches concept, carte des mondes, journal, deck). Il fallait **compléter
et vérifier** l'accessibilité de tout, en réutilisant la base.

## Décision
1. **Alternatives textuelles des graphiques** (le plus gros angle mort d'une app de graphiques) :
   `describeCandles(candles)` (pur, testé) → résumé « structure haussière/baissière/latérale + extrêmes ».
   Appliqué à `PatternChart` (désormais `accessible` + role `image` + label descriptif au lieu d'un texte
   générique) et intégré au label de `InteractiveChart`. `MarketReplayChart` / `VisualCard` avaient déjà
   des résumés.
2. **Audit de complétude** confirmé : réduction d'animation honorée par tous les composants animés
   (les surfaces V5 sont statiques) ; mascottes décoratives masquées ou images labellisées ; rôles/états
   présents sur les éléments interactifs V5 (segments, favoris, cartes de mondes) ; contraste AA couvrant
   les jetons V5.
3. **Documentation** : `docs/ACCESSIBILITY.md` récapitule la posture complète (contraste, cibles, type
   dynamique, en-têtes, réduction d'animation, alternatives graphiques, alternatives aux gestes, rôles),
   où c'est implémenté et comment c'est vérifié.

## Conséquences
- Les graphiques — cœur de l'app — sont désormais décrits aux lecteurs d'écran, structure comprise, sans
  dépendre de la couleur ; garantie par test (`describeCandles`) et vérifiée dans le DOM web.
- La posture a11y est documentée et vérifiable, prête pour la revue de publication (Lot 16).
- Reste à faire : tests lecteur d'écran natifs (VoiceOver/TalkBack) sur appareil, audit clavier web
  exhaustif au fil des écrans.
