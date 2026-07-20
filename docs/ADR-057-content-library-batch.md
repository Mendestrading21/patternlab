# ADR-057 — Lot éditorial « bibliothèque » +20 concepts (Exp-Max Lot 4)

## Statut

Accepté — 2026-07-20. Programme `patternlab-experience-max`, Lot 4.

## Contexte

Objectif : faire monter la **bibliothèque de concepts** (38 → 150 → 500+). Plusieurs mondes étaient
minces (anatomie, fondations, price-action, wyckoff, faux-signaux à 1 concept), et de nombreuses
figures de `PATTERN_LIBRARY` n'avaient pas de fiche riche `LearningConcept`.

## Options

1. Générer des fiches minimales en masse (faible valeur, risque qualité).
2. Ajouter un **lot éditorial de ~20 concepts pleinement rédigés**, réutilisant les datasets
   déterministes existants (visuel garanti rendable), isolé dans un module dédié. *(retenu)*
3. Tout écrire dans un unique fichier géant (risque de conflit et de casse).

## Décision

Option 2. Nouveau module `src/data/learningContentBatch.ts` exportant `BATCH_CONCEPTS` (20 concepts
complets : 10 chandeliers — marubozu, pendu, marteau inversé, avalement baissier, harami, étoiles du
matin/soir, trois soldats, trois corbeaux, pincettes ; 5 figures — biseau ascendant, drapeau
baissier, tasse-anse, triple creux, ÉTÉ inversée ; 2 structure — tendance baissière, cassure-retest ;
2 SMC — zones de demande/offre ; 1 volume — profil de volume). `learningContent.ts` compose
`V5_CONCEPTS = [...CORE, ...BATCH]`. Chaque concept : id/slug uniques, monde/catégorie valides,
`status: 'needsReview'`, `visualSpec` sur un `datasetKey` existant (type supporté), relations
résolues, disclaimer, aucun vocabulaire interdit. **Surface automatique** (aucun câblage
supplémentaire) : glossaire unifié, carte des mondes, fiches `/concept/[slug]`, compteur de contenu.

## Conséquences

- Corpus V5 : **38 → 58 concepts** ; carte des mondes **15/15 ouverts** ; progression de contenu
  **58/150** ; glossaire enrichi d'autant de fiches visuelles.
- Le module isolé garde `CORE_V5_CONCEPTS` intact et facilite les prochains lots éditoriaux.
- Gate verte : lint · typecheck · **399 tests** (portail `contentFactory` : intégrité + vocabulaire
  propres sur tout le corpus) · validate:content 31 · release:check 14 · build:web. Vérifié en
  pilotant Chromium (390×844) : fiches Étoile du matin / Profil de volume / Tendance baissière / Zone
  de demande rendues avec visuel, progression 58/150, 15/15 mondes, **0 erreur console**.

## Rollback

Réversible : retirer l'import/spread de `BATCH_CONCEPTS` dans `learningContent.ts` (retour à 38
concepts) et supprimer `learningContentBatch.ts`. Aucun changement de schéma ni de persistance.
