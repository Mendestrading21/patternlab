# ADR-066 — Hiérarchie pédagogique unique : Monde → Module → Compétence (Learning-Master Lot 2)

## Statut

Accepté — 2026-07-21. Programme `patternlab-learning-master`, Lot 2.

## Contexte

Deux P0 de l'audit convergent ici :

- **Deux parcours concurrents** : `(tabs)/parcours.tsx` affichait à la fois le **trail pilote de 4
  compétences** (`buildWorldMap`) et la **carte des 15 mondes** (`buildWorldPath`) — deux modèles de
  progression sur une même page.
- **15 mondes = catalogue, pas parcours** : `buildWorldPath` débloquait le monde suivant dès qu'un
  concept du précédent était **ouvert**, et « terminait » un monde quand toutes ses fiches étaient
  **vues**. La progression mesurait la navigation, pas l'apprentissage.

La cible du skill : une seule hiérarchie **Monde → Module → Compétence**, avec déblocage fondé sur la
**maîtrise** (checkpoint), et une **migration de progression non destructive**.

## Décision

- **`src/data/learningMap.ts`** (nouveau, pur) — source unique de la hiérarchie :
  - `GUIDED_MODULES` : le **monde 1 (Fondations)** accueille le module **« Lire un graphique »** =
    les 4 compétences pilotes (`skill.actions/trend/candles/patterns`) + le **checkpoint** existant.
    Migrer d'autres compétences = ajouter une entrée ici.
  - `buildLearningPath(worlds, concepts, { completedSkills, exploredSlugs })` → un **chemin unique** :
    monde 1 ouvert ; **monde N ouvert seulement si le monde N-1 est terminé**. Un monde guidé se
    termine par son **checkpoint** ; un monde de contenu, quand toutes ses fiches sont consultées.
    Statuts done/current/unlocked/locked + `lockReason`. Testé (`learningMap.test.ts`).
- **`src/app/monde/[id].tsx`** (nouvelle route) — détail d'un monde : monde guidé → le **trail** du
  module (compétences + checkpoint, via `buildWorldMap`) ; monde de contenu → liste de **fiches
  concept** illustrées ; états explicites **« Monde introuvable »** et **« verrouillé »** (raison
  affichée) — aucun repli silencieux (cohérent avec le Lot 0).
- **`src/app/(tabs)/parcours.tsx`** — réécrit en **un seul** chemin vertical des 15 mondes (via
  `buildLearningPath`) ; chaque monde ouvre `/monde/[id]`. Le trail 4-compétences et la carte
  « on-view » quittent cette page (le trail vit désormais dans `/monde/world.foundations`).
- **Migration : aucune.** Le chemin et les déblocages sont **dérivés de l'état déjà persisté**
  (`completedSkills`, qui contient l'id du checkpoint, et `learning.conceptsExplored`). `ProgressState`
  et `migrateProgress` sont inchangés → progression préservée par construction.

## Conséquences

- Une seule trajectoire lisible ; le déblocage récompense la **maîtrise** (checkpoint du monde 1),
  plus la simple visite. Au démarrage, seul le monde 1 est ouvert — les 58 concepts restent
  **librement explorables** via l'onglet **Apprendre** (bibliothèque, glossaire, quiz), c'est voulu :
  Parcours = chemin guidé ; Apprendre = catalogue libre.
- `worldPath.ts` (Exp-Max Lot 6) et `worldMap.ts` restent en place (toujours testés ; `worldMap`
  réutilisé par le détail de monde). `worldPath` n'est plus câblé à un écran ; suppression possible
  dans un lot de nettoyage ultérieur.
- Les **checkpoints des mondes de contenu** (2–15) et des modules supplémentaires arriveront avec le
  contenu guidé (Lots 4/10) ; d'ici là, ces mondes se « terminent » à la consultation, clairement
  libellé « fiches consultées », jamais « maîtrisé ».
- Gate verte : lint · typecheck · **428 tests** (+5) · validate:content 31/31 · release:check 14/14 ·
  build:web (route `/monde/[id]` exportée). Vérifié en pilotant Chromium (390×844) : Parcours en
  chemin unique (world 1 « en cours », mondes suivants verrouillés avec raison, ancien trail retiré),
  `/monde/world.foundations` rend le module guidé, monde verrouillé et « Monde introuvable » explicites.
  Aucune publication sans accord.
