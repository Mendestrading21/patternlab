# ADR-036 — Gamification & stats V5 (réussites « compréhension »)

## Statut
Accepté (V5 Lot 11 — Gamification & stats, skill `patternlab-v5-master`).

## Contexte
La gamification v1 (quêtes du jour, jalons de série, badges) est **responsable** (pas de vies
punitives, pas de casino, pas de classement par profits). La vision V5 demande de récompenser la
**compréhension, la révision, le repérage des faux signaux, la maîtrise, la régularité et la
diversité** — jamais des gains fictifs, du rendement ni la vitesse. Il fallait donc **étendre** (et
non refondre) la gamification et les stats avec des signaux d'apprentissage réels.

## Décision
1. **Compteurs d'apprentissage cumulatifs** (schéma persistant **v6**) : `ProgressState.learning`
   (`conceptsExplored: string[]`, `worldsExplored: string[]`, `falseSignalsSpotted: number`), champ
   **optionnel** (migration + défaut le remplissent ; lectures défensives via `learningOf`) pour ne
   casser aucun état existant. `migrateLearning` assainit (chaînes dédupliquées, compteur borné).
2. **Logique pure** `src/data/learningStats.ts` (testée) : `addConceptExplored` (dédupliqué,
   idempotent), `addFalseSignalSpotted`, `learningOf`, `FALSE_SIGNAL_EXERCISE_TYPES` /
   `isFalseSignalExercise` (`find_error`, `place_invalidation`).
3. **Réussites V5 « compréhension »** (`badges.ts`, famille `understanding`) : Anatomiste des bougies /
   Cartographe des tendances / Lecteur de figures (maîtrise ≥ 50 % de la compétence), Détecteur de
   faux signaux (3 repérages), Curieux (5 concepts explorés), Cartographe des mondes (3 mondes). Toutes
   **atteignables** in-app (aucun badge mort) et adossées à des signaux réels.
4. **Câblage** (via le contexte, avec annonce de badge) : `markConceptExplored` sur les fiches
   `/concept/[slug]` (concept + monde) et `/glossaire/[slug]` (terme) ; `recordFalseSignal` en session
   quand un exercice faux-signal/invalidation est réussi (+ analytics `false_signal_identified`). Le
   marquage est **gated sur `ready`** : la progression se charge de façon asynchrone, on n'enregistre
   qu'une fois l'état chargé (corrige une perte de marquage au deep-link).
5. **Stats** : `computeStats` expose `exploration` (concepts / mondes / faux signaux) ; carte
   **« Exploration »** sur l'écran Statistiques (visible pour tous, pas premium). L'écran Réussites
   regroupe les badges en **Progression** et **Compréhension**.

## Conséquences
- Gamification enrichie et **responsable** : les nouvelles récompenses valorisent le savoir et la
  diversité, jamais des gains ni la vitesse ; réutilise entièrement le moteur v1 (quêtes, séries, XP).
- Signaux réels et persistés (schéma versionné, migration sûre) ; badges atteignables et testés.
- Le fix « gated on ready » rend le suivi d'exploration fiable même en navigation directe (deep-link).
- Reste à faire : badges Wyckoff / volume quand ces mondes auront du contenu rendu en app (Lot 9/10),
  et un badge « Maître des révisions » quand un flux de révision dédié exposera un compteur.
