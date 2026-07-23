# ADR-088 — Enrichissement éditorial · Batch 1 (premier parcours débutant)

## Statut

Accepté — 2026-07-23. Branche `feat/trademy-enrichissement-batch-1`.
Poursuit **ADR-086** (schéma canonique de concept). Source : `docs/product/LEARNING_CONTENT_ARCHITECTURE.md`
(unité canonique), `docs/product/TOTO_BOBO_CANON.md` (voix des mascottes), `docs/CONTENT_COVERAGE.md`
(fondations d'abord, chaque paquet réellement exploitable).

## Contexte

Le schéma est entièrement canonique depuis le Lot 11 (`estimatedMinutes` + `dialogue { toto; bobo }`,
optionnels, portés par le concept). Mais seuls **4 concepts sur 67** étaient enrichis (les phares du
parcours « Marché expliqué »). Le premier parcours du débutant restait donc majoritairement sans
durée ni interventions Toto/Bobo. La consigne courante (`docs/CURRENT_STATE.md`) : « un seul objectif
à la fois — enrichissement éditorial revu humainement », profondeur avant volume.

## Décision

- **Enrichir les 12 concepts restants du premier parcours** (durée + dialogue Toto/Bobo), pour que
  les cinq mondes d'entrée passent de **4/16 à 16/16 enrichis** :
  - **Fondations** : `dividende`, `per`
  - **Anatomie** : `anatomie-bougie`, `echelle-des-prix`, `unite-de-temps`
  - **Supports/Résistances** : `support-resistance`, `retest-de-niveau`, `polarite-flip`
  - **Structure** : `range`, `tendance-baissiere`, `cassure-de-structure`
  - **Faux signaux** : `faux-signal`
- **Source unique** : les deux champs sont ajoutés directement sur l'objet concept
  (`src/data/learningContent.ts`, `src/data/learningContentBatch.ts`), sans seconde source ni
  duplication. Aucun autre champ modifié ; `status: 'needsReview'` conservé (rien n'est auto-publié).
- **Voix canonique** : Toto (taureau vert) formule une condition / un setup haussier à confirmer ;
  Bobo (ours rouge) pointe la preuve manquante, l'invalidation ou la misconception. Chaque réplique
  enseigne une condition, une preuve, une invalidation ou une misconception — jamais un ordre, jamais
  de promesse de gain.
- **Aucun changement structurel** : 15 mondes / 13 catégories / 4 skills / 11 types visuels / 13
  formats d'exercice inchangés ; le corpus reste à **67 concepts** (compteur dérivé de
  `src/data/repoTruth.ts`).

## Conséquences

- Le premier parcours du débutant est enrichi de bout en bout : chaque fiche des cinq mondes d'entrée
  affiche une **puce durée** + un **bloc dialogue Toto/Bobo** (rendus déjà câblés au Lot 11 :
  `src/app/concept/[slug].tsx`, hub `src/app/(tabs)/apprendre.tsx`) — **aucune UI ajoutée**.
- `src/data/conceptEnrichment.test.ts` gagne un verrou `BATCH_1` (les 12 slugs doivent rester enrichis
  et bien formés, vocabulaire conforme).
- L'enrichissement se poursuit par paquets suivants (ordre canonique : `world.candles` (14), puis
  `world.patterns` (13), etc.), un paquet réellement exploitable à la fois, revu humainement.
- Gate exécutée localement (lint · typecheck · tests · validate:content · release:check · build:web) ;
  le résultat exact appartient au rapport de PR, jamais recopié ici.
