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

## Rollback

Lot purement additif. `skill.candles` peut revenir à ses exercices précédents en réinsérant l'ancien
bloc de `RAW_EXERCISES` et en restaurant les clés `EXERCISE_OBJECTIVE` correspondantes ; la source de
scénario et les scénarios pilotes sont indépendants du reste et supprimables sans effet de bord. Aucun
schéma persistant modifié.
