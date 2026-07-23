# ADR-091 — Enrichissement éditorial · Batch 4 (reste du corpus — 67/67)

## Statut

Accepté — 2026-07-23. Branche `feat/trademy-enrichissement-batch-3`.
Clôt le programme d'enrichissement (ADR-086, 088, 089, 090).

## Contexte

Après les Batches 1–3 (43/67), restaient 24 concepts non enrichis répartis dans 8 mondes : SMC (5),
indicateurs (4), volume (3), risk (3), price action (3), psychologie (2), wyckoff (2), options (2).

## Décision

- **Enrichir les 24 derniers concepts** (durée + dialogue Toto/Bobo), portés par le concept, sans
  seconde source ; `status: 'needsReview'` conservé. Voix canonique (Toto = condition/setup ; Bobo =
  preuve manquante, invalidation, misconception). Le risque et les options soulignent la **perte
  bornée** ; aucun ordre, aucune promesse de gain.
- **Aucun changement structurel** ; corpus toujours **67 concepts**.

## Conséquences

- **Enrichissement complet : 67/67**. Chaque fiche du corpus affiche une puce durée et un échange
  Toto/Bobo (rendus câblés au Lot 11) — aucune UI ajoutée.
- `conceptEnrichment.test.ts` gagne le verrou `BATCH_4` **et** une assertion « les 67 concepts sont
  enrichis » (garde-fou d'exhaustivité).
- Gate exécutée (lint · typecheck · tests · validate:content · release:check · build:web).
