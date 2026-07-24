# ADR-096 — Source de scénario canonique + unité pilote « Comprendre un chandelier » (LOT 3)

## Statut

Accepté — 2026-07-24. Branche `feat/trademy-lot3-pilot-learning-world` (base : `main` avec LOT 2
fusionné, `12df68f`). Additif ; aucune dépendance ajoutée ; moteur P0 (progression par cible,
ADR-094) et LOT 2 (mascottes) inchangés. Sources : `docs/product/LEARNING_CONTENT_ARCHITECTURE.md`,
`docs/design/TRADEMY_LEARNING_GLASS.md`, ADR-066/067/069/071/094/095.

## Contexte

Le parcours pilote guidé existe déjà et fonctionne de bout en bout : Monde 1 « Fondations » →
module « Lire un graphique » (4 compétences + checkpoint) → session (leçon pas-à-pas, pratique,
reprise, maîtrise par couverture) → révision, avec 13 formats d'exercice branchés et Toto/Bobo (LOT 2).

L'audit a montré **une seule lacune structurante** : il n'existait **pas de source de scénario
canonique typée**. Le graphique (`visualDatasets`/`demoChart`), les fiches (`learningContent`) et les
exercices notés (`seed`) étaient **trois sources jointes par `datasetKey`/`chartSeed` + cible**. Seul
`buildDirectionExercise` (`semanticExercise.ts`) garantissait, par construction, que graphique =
réponse = feedback = a11y — pour 3 exercices directionnels seulement. De plus, l'unité candlestick
(`skill.candles`) reposait sur **5 exercices tous à choix multiple** : aucune interaction réellement
différente.

## Décision

1. **Source de scénario canonique** (`src/engines/exercise/scenario.ts`, pure) — `LearningScenario`
   est l'unique vérité d'un item ; `buildScenarioExercise` DÉRIVE le graphique, la bonne réponse, le
   feedback et le résumé accessible d'une seule vérité (généralise `semanticExercise`). Cinq
   interactions réellement différentes : lecture de direction (`identify_pattern`), tiers du plus
   haut au doigt (`select_chart_zone`), élément marqué (`label_chart`), ordre de lecture (`order`),
   faux signal (`find_error`). Les cibles graphiques (direction, tiers du plus haut, index du
   repère) sont **calculées depuis la série réellement rendue** (`generateCandles`) — un graphique
   ne peut donc pas contredire la question, le feedback ou le lecteur d'écran.
2. **Unité pilote re-dérivée** (`src/data/pilotScenarios.ts`) — `skill.candles` /
   `concept.candle-anatomy` : 5 scénarios couvrant **3 objectifs atomiques RÉELS** du concept
   (recognize / interpret / avoid-false-signal), avec **variantes** sur recognize et interpret pour
   la remédiation. `seed.ts` : `skill.candles` = exercices dérivés (remplace les 5 QCM ad-hoc). Les
   cibles, la rotation, les variantes et la couverture/maîtrise du P0 restent inchangées.
3. **Réutilisation intégrale des moteurs** — session, progression par cible (v8), répétition espacée
   (une transition par cible et par session ; cible échouée due immédiatement), checkpoint
   indépendant, reprise fidèle et Toto/Bobo (LOT 2, aucun second orchestrateur). Le graphique porte
   déjà son résumé accessible (`describeCandles`) — même vérité que le scénario.

## Conséquences

- L'unité candlestick offre désormais **5 interactions réellement différentes** (dont zone au doigt,
  repère sur le graphe et ordre à reconstituer), toutes **cohérentes par construction**.
- Le modèle est **industrialisable** : une nouvelle unité = un tableau de `LearningScenario`, sans
  toucher aux moteurs, aux écrans ni au P0.
- **Aucune dépendance ajoutée** ; **aucun vocabulaire BUY/SELL** (tests dédiés) ; P0 et LOT 2 intacts
  (90 suites / 717 tests, +3 suites / +28 tests). Test d'intégration réel du parcours
  (accueil → monde → leçon → erreur → retry → réussite → checkpoint → progression).
- Hors périmètre (assumé) : les 14 autres unités guidées, les 500+ concepts, le premium — le pilote
  est le gabarit à répliquer.

## Corrections de revue (PR #10) — parcours réellement rendu, manipulé, démontré

La revue a demandé de prouver le parcours par le RENDU et la MANIPULATION, pas seulement par des
fonctions pures. Corrections apportées (uniquement les lacunes démontrées ; aucune reconstruction de
ce qui fonctionnait) :

1. **Exercice d'ordre jamais pré-résolu** — `ReorderList` partait de l'ordre identité `[0,1,2,3]`
   alors que `correctOrder` valait aussi `[0,1,2,3]` : on validait sans rien reconstituer.
   `scrambledDisplayOrder` (`engines/exercise/reorder.ts`, pure, **déterministe**, garantie
   `≠ solution` — miroir de la solution) fournit l'ordre d'affichage initial de tout exercice `order`
   / `sequence_market_structure`. Flèches accessibles (libellé « Monter/Descendre « <étape> »
   (position X sur N) », état désactivé annoncé), cibles tactiles **44 px**.
2. **Résumé accessible canonique porté et consommé** — `BaseExercise.accessibilitySummary` est dérivé
   par `buildScenarioExercise` (= `scenarioA11ySummary`) et AFFICHÉ par les players : `PatternChart`
   (accepte un `accessibilityLabel` — une seule annonce), donc `identify_pattern`, `select_chart_zone`
   et `sequence` ; `label_chart` annonce la série + la **présence/position** du repère **sans révéler
   la réponse**. Graphique = réponse = feedback = lecteur d'écran : une seule vérité, affichée.
3. **Test d'intégration RENDU** (`data/pilotJourneyUI.test.tsx`, react-test-renderer fourni par
   jest-expo — **aucune dépendance ajoutée**) : monte `ExercisePlayer`, CLIQUE les contrôles réels →
   exercice affiché → mauvaise réponse → feedback contextualisé + **Bobo (misconception réelle)** →
   continuer → **variante (même cible, présentation différente)** → bonne réponse → checkpoint →
   progression affichée. Aucun bouton mort (un clic sans `onPress` échoue le test).
4. **Remédiation par variante vérifiée** — la variante partage `target.objectiveId` (la cible EST le
   groupe de variantes — pas de seconde source de vérité), avec une présentation réellement différente
   (type d'interaction distinct). Les misconceptions pilotes deviennent **précises** (`misconceptions.ts`):
   `direction → tendance-une-bougie`, `label-high`/`zone-high → corps-meche` (misconception ajoutée),
   `read-order`/`false-signal → couleur-seule`. Bobo pointe donc la vraie confusion.
5. **Vérité pédagogique** — « Une longue mèche indique un rejet de prix. » → « … **peut traduire** un
   rejet de prix, à confirmer avec le contexte et les bougies voisines. » (idem `lesson.candle-anatomy`).
   Audit des textes pilotes : les « garantit/prédit » restants sont les affirmations FAUSSES à repérer.

**Vérifications** : `npm run check` verte (lint, typecheck strict, 92 suites / 727 tests `--runInBand`,
validate:content, release:check, build:web) ; `git diff --check` propre. Captures Chromium du parcours
pilote à 320 / 390 / 430 / 1280 px + reduced-motion + hors-ligne : **aucun débordement horizontal**
(0 px partout), l'ordre est visiblement mélangé. **Limite connue** (pré-existante, non introduite) : les
routes dynamiques du build statique expo-router (`/session/[skillId]`, `/lesson/[id]` — y compris les
compétences non touchées) émettent au boot un avertissement d'hydratation React #418 ; la page se rend
correctement (récupération côté client). Le sprite animé de la mascotte et la coquille expo-router ne
sont pas montés sous jest (worklets Reanimated 4 absents) : la navigation accueil→monde→unité reste
couverte par `pilotJourney.test.ts` (buildLearningPath).

## Rollback

Lot purement additif. `skill.candles` peut revenir à ses exercices précédents en réinsérant l'ancien
bloc de `RAW_EXERCISES` et en restaurant les clés `EXERCISE_OBJECTIVE` correspondantes ; la source de
scénario et les scénarios pilotes sont indépendants du reste et supprimables sans effet de bord. Aucun
schéma persistant modifié.
