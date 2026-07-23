# ADR-089 — Enrichissement éditorial · Batch 2 (monde des chandeliers)

## Statut

Accepté — 2026-07-23. Branche `feat/trademy-enrichissement-batch-2`.
Poursuit **ADR-086** (schéma) et **ADR-088** (Batch 1). Voix : `docs/product/TOTO_BOBO_CANON.md`.

## Contexte

Après le Batch 1 (premier parcours débutant enrichi 16/16), le corpus comptait 30/67 concepts
enrichis. Le **monde des chandeliers** (`world.candles`, 14 concepts) — cœur de l'apprentissage
visuel et le plus gros monde — restait sans durée ni interventions Toto/Bobo.

## Décision

- **Enrichir les 14 concepts de `world.candles`** (durée + dialogue Toto/Bobo) : `marteau`, `doji`,
  `etoile-filante`, `avalement-haussier`, `marubozu`, `pendu`, `marteau-inverse`, `avalement-baissier`,
  `harami`, `etoile-du-matin`, `etoile-du-soir`, `trois-soldats`, `trois-corbeaux`, `pincettes`.
- **Source unique** : deux champs ajoutés sur l'objet concept (`learningContent.ts`,
  `learningContentBatch.ts`), sans seconde source. `status: 'needsReview'` conservé.
- **Voix canonique** : Toto (vert) formule une condition / un setup à confirmer ; Bobo (rouge) pointe
  la preuve manquante, l'invalidation ou la misconception (ex. marteau vs pendu, étoile filante vs
  marteau inversé, « une bougie ne fait pas une tendance », « attends la confirmation »).
- **Aucun changement structurel** ; corpus toujours à **67 concepts**.

## Conséquences

- Le monde des chandeliers est enrichi de bout en bout : chaque fiche affiche puce durée + bloc
  Toto/Bobo (rendus câblés au Lot 11) — **aucune UI ajoutée**.
- `conceptEnrichment.test.ts` gagne un verrou `BATCH_2` (14 slugs enrichis et bien formés).
- Corpus enrichi : 16/67 → **30/67**. Paquets suivants : figures (`world.patterns`, 13), puis SMC,
  indicateurs, volume, etc.
- Gate exécutée (lint · typecheck · tests · validate:content · release:check · build:web) ; résultat
  exact au rapport de PR.
