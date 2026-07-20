# ADR-056 — Quiz visuels enrichis (Exp-Max Lot 3)

## Statut

Accepté — 2026-07-20. Programme `patternlab-experience-max`, Lot 3.

## Contexte

L'entraîneur « Reconnais la figure » (`buildRecognitionSession`) ne posait qu'un seul type de
question : « quelle figure ? ». Objectif du lot : des **quiz visuels plus riches et plus
intéressants** — questions variées basées sur l'image, niveaux de difficulté, feedback illustré —
en réutilisant le moteur de visuels et la logique de reconnaissance existante.

## Options

1. Ajouter des exercices graphiques un par un dans `seed.ts` (dispersé, non réutilisable).
2. Généraliser le générateur de reconnaissance en **générateur de quiz visuel** paramétrable
   (types de question × difficulté) + enrichir l'écran existant. *(retenu)*
3. Nouvel écran de quiz séparé (duplication du flux score/streak/persistance).

## Décision

Option 2.
- **Générateur pur `visualQuiz.ts`** : `buildVisualQuiz(seed, { count, difficulty, group })` →
  questions déterministes mixant 3 types — `name` (« quelle figure ? »), `direction` (« quelle
  lecture suggère-t-elle ? ») et `family` (« à quelle famille appartient-elle ? »). La difficulté
  choisit le mélange de types, le nombre d'options et la dureté des distracteurs :
  `facile` = sens uniquement (3 options) ; `moyen` = nom/sens/famille (4) ; `expert` = nom/famille,
  distracteurs de même famille d'abord (4). Chaque question porte une **explication illustrée**.
  Réutilise `mulberry32`/`shuffle`/`poolForGroup` (exportés de `recognitionTrainer`) — déterminisme
  conservé, `buildRecognitionSession` laissé intact.
- **Écran `reconnaissance.tsx` enrichi** : « Quiz visuel » avec **sélecteur de difficulté**
  (Facile/Moyen/Expert) en plus du sélecteur de thème ; rendu du `prompt` et de l'`explanation`
  spécifiques à la question ; figure révélée après réponse (mode énigme préservé) ; score, série,
  persistance (`recordRecognition`) et feedback Toto/Bobo inchangés.
- Entrée « Quiz visuel » depuis l'onglet Quiz.

## Conséquences

- Le quiz visuel propose désormais 3 types de questions × 3 difficultés, tous basés sur des schémas
  dessinés en code, avec explication après chaque réponse. Plus varié, plus progressif.
- Gate verte : lint · typecheck · **399 tests** (+5) · validate:content 31 · release:check 14 ·
  build:web. Vérifié en pilotant Chromium (390×844) : sélecteurs difficulté/thème, question à
  graphique, feedback illustré (« Réponse : … · Figure : … »), 0 erreur console.

## Rollback

Réversible : re-brancher `reconnaissance.tsx` sur `buildRecognitionSession` (toujours présent et
testé) et retirer `visualQuiz.ts` + le sélecteur de difficulté. Aucun changement de schéma de
données ni de persistance.
