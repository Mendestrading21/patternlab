# ADR-074 — Contenu des 15 mondes : incrément 1 (Learning-Master Lot 10)

## Statut

Accepté — 2026-07-21. Programme `patternlab-learning-master`, Lot 10 (incrément 1 / itératif).

## Contexte

L'audit de couverture montre un déséquilibre entre mondes : chandeliers (14) et figures (13) sont
riches, mais plusieurs mondes restent **très minces** — anatomie (1), price-action (1), wyckoff (1),
faux-signaux (1), supports/résistances (2). Le Lot 10 vise 75 puis 150 concepts jouables ; le skill
insiste sur la **qualité et la provenance**, jamais le gonflage du compteur.

## Décision

Premier incrément **équilibrant les mondes minces** : **+7 concepts riches `needsReview`**
(`learningContentBatch.ts`), chacun sur un **dataset déterministe existant** (visuel rendable) et une
catégorie valide :

- **Anatomie** : Unité de temps (`candle.anatomy.v1`), Échelle des prix (`structure.uptrend.v1`).
- **Price action** : Mèche de rejet (`candle.hammer.v1`), Impulsion et correction (`structure.uptrend.v1`).
- **Supports/résistances** : Retest de niveau (`structure.break-retest.v1`).
- **Wyckoff** : Distribution (`structure.support-resistance.v1`).
- **Faux signaux** : Faux breakout / fakeout (`structure.fakeout.v1`).

`V5_CONCEPTS` **60 → 67** (vers 75). Chaque concept : id/slug uniques, monde/catégorie valides,
`needsReview`, vocabulaire conforme, relations vides (aucune référence cassée), objectif + définition
+ reconnaissance + limites + faux signaux + checklist + flashcard + mini-quiz + visuel accessible.

## Conséquences

- Les mondes autrefois quasi vides ont désormais des **fiches jouables** (surface automatique :
  glossaire, `/concept/[slug]`, deck de révision, entraîneur, statut de maîtrise du Lot 8).
- Intégrité garantie par le **portail `contentFactory`** (unicité, intégrité, vocabulaire, visuels
  rendables) — un ajout invalide casse la CI.
- **Lot 10 reste itératif** : viser 75 puis 150 se fait par incréments éditoriaux successifs (avec
  revue humaine), sans gonfler artificiellement. Prochains incréments : psychologie, options,
  volume/order-flow, price-action avancé.
- Gate verte : lint · typecheck · **474 tests** · validate:content 31/31 · release:check 14/14 ·
  build:web. Vérifié en pilotant Chromium (390×844) : fiches `faux-breakout`, `meche-de-rejet`,
  `distribution-wyckoff`, `unite-de-temps` rendues (titre + visuel SVG + puce de statut). Publication
  sur accord.
