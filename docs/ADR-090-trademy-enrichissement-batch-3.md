# ADR-090 — Enrichissement éditorial · Batch 3 (figures chartistes)

## Statut

Accepté — 2026-07-23. Branche `feat/trademy-enrichissement-batch-3`.
Poursuit ADR-086 (schéma), ADR-088 (Batch 1), ADR-089 (Batch 2). Voix : `docs/product/TOTO_BOBO_CANON.md`.

## Contexte

Après les Batches 1 (premier parcours, 16/16) et 2 (chandeliers, 14), 30/67 concepts portaient durée +
dialogue Toto/Bobo. Le monde des **figures chartistes** (`world.patterns`, 13 concepts) restait à enrichir.

## Décision

- **Enrichir les 13 concepts de `world.patterns`** (durée + dialogue Toto/Bobo) : `double-creux`,
  `double-sommet`, `triangle-ascendant`, `triangle-descendant`, `triangle-symetrique`,
  `epaule-tete-epaule`, `etei-inversee`, `drapeau-haussier`, `drapeau-baissier`, `biseau-ascendant`,
  `biseau-descendant`, `tasse-anse`, `triple-creux`.
- Source unique (`learningContent.ts` / `learningContentBatch.ts`) ; `status: 'needsReview'` conservé.
  Toto (vert) = condition / setup à confirmer ; Bobo (rouge) = preuve manquante, invalidation ou
  misconception (ligne de cou non franchie, biseau ≠ canal, drapeau = pause, « ne vois pas une ÉTÉ partout »…).
- Aucun changement structurel ; corpus toujours **67 concepts**.

## Conséquences

- Monde des figures enrichi de bout en bout : puce durée + bloc Toto/Bobo sur chaque fiche (rendus
  câblés au Lot 11) — aucune UI ajoutée.
- `conceptEnrichment.test.ts` gagne un verrou `BATCH_3` (13 slugs enrichis et bien formés).
- Cumul enrichi : 30/67 → **43/67**. Dernier paquet (Batch 4) : SMC, indicateurs, volume, risk, price
  action, psychologie, wyckoff, options (24) → 67/67.
- Gate exécutée (lint · typecheck · tests · validate:content · release:check · build:web).
