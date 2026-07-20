# ADR-051 — Format d'exercice « identify_figure »

## Statut
Accepté. Nouveau format d'exercice graphique branché sur le moteur de visuels (bibliothèque de
72 figures), qui fait entrer la reconnaissance de figure dans les **sessions notées** (maîtrise, XP).

## Contexte
L'entraîneur « Reconnais la figure » (ADR-048) est une pratique libre. Les sessions de compétence, elles,
n'utilisaient que des graphiques `chartSeed`/`generateCandles` — pas les figures déterministes de la
bibliothèque. Il manquait un format qui présente une figure de la bibliothèque et la fasse **noter** dans
la progression réelle.

## Décision
1. **Nouveau format `identify_figure`** (union discriminée + `ALL_EXERCISE_TYPES`) : porte `datasetKey`,
   `variant`, `visualType`, `options`, `validation.correctIndex`. Grader pur enregistré (index correct).
2. **Rendu** (`ExercisePlayer`) : `IdentifyFigurePlayer` construit un `VisualSpec` et rend `VisualCard`
   en mode **énigme** (`blind`) — la réponse ne fuite pas —, puis révèle la figure annotée une fois la
   réponse donnée. Réutilise `ChoicePlayer`.
3. **Durcissement du mode énigme** : `VisualCard` en `blind` retire désormais aussi les **textes des
   overlays** (labels de tracés, repères « épaule »/« tête », labels de zones/S-R) — seule la géométrie
   reste. Cela sécurise à la fois le nouveau format ET l'entraîneur autonome (pas de fuite sur les figures
   à repères comme l'épaule-tête-épaule).
4. **3 exercices** ajoutés aux sessions : chandelier (skill.candles → étoile filante), figure chartiste
   (skill.patterns → épaule-tête-épaule), indicateur (skill.trend → RSI), avec feedback complet.

## Conséquences
- La reconnaissance de figure devient **notée** dans les sessions (met à jour la maîtrise réelle), en plus
  de la pratique libre de l'entraîneur. Le moteur d'exercices prouve encore son extensibilité (format
  ajouté sans toucher au reste).
- Le mode énigme est désormais **étanche** (aucune fuite textuelle via les overlays), bénéfice partagé
  avec l'entraîneur.
- Validations : lint · typecheck · tests **380** (+1) · validate:content 31 · release:check 14 · build:web.
  Vérifié en pilotant Chromium : session skill.candles parcourue jusqu'à l'exercice figure, figure rendue
  en énigme (aucune fuite), réponse notée avec feedback, 0 erreur console. Voir **ADR-051**.
