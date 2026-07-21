# ADR-068 — Fondations interactives : Dividende, PER & visuel `mechanism` (Learning-Master Lot 4)

## Statut

Accepté — 2026-07-21. Programme `patternlab-learning-master`, Lot 4.

## Contexte

L'audit (P1) note que **Dividende** et **PER** n'existaient que comme termes de glossaire passifs,
alors que ce sont des notions de fondation. Le skill demande de les promouvoir en concepts riches
**illustrés par un visuel de mécanisme** (économie), pas par un graphique en bougies — les visuels
existants (`comparison`, `cheat-sheet`) sont bâtis sur des datasets de chandeliers et ne conviennent
pas à une notion de valorisation.

## Décision

- **Nouveau type visuel `mechanism`** — schéma en étapes fléchées (pas de dataset OHLC) :
  - `src/engines/visual/mechanisms.ts` (registre `dividende`, `per`) + `MechanismVisual.tsx`
    (rendu Views : boîtes d'étapes + flèches + note ; variante `compact` pour la vignette).
  - Câblé dans `VisualCard`, `MiniVisual`, `SUPPORTED_VISUAL_TYPES` (**10 → 11**), le barrel et
    l'union `VisualSpec.type`. Le mécanisme est le premier visuel **conceptuel** (non graphique).
- **2 concepts riches** `needsReview` (`learningContentBatch.ts`, `world.foundations` /
  `cat.foundations`) :
  - **Dividende** (variant `dividende`) : Entreprise → Dividende → Actionnaire, note « le cours
    s'ajuste à la date de détachement ».
  - **PER** (variant `per`) : Prix ÷ Bénéfice/action = PER, note comparaison PER élevé/bas.
  - `V5_CONCEPTS` **58 → 60** ; ils **supersèdent** les termes de glossaire (dédup rich-wins).
- **Monde 1** : un step `visual` (conceptRef `dividende`) dans la leçon de `skill.actions` + **2
  exercices** (`ex.actions.dividende`, `ex.actions.per`), donc pratiqués en session **et** agrégés
  au checkpoint. Exercices **28 → 30**.
- **Garde-fous** : `mechanisms.test.ts` ; le portail `contentFactory` valide unicité/intégrité/
  vocabulaire des 2 concepts ; `repoTruth.test` pin visualTypes **11** ; `revisionDeck.test`
  `noDatasetTypes` inclut `mechanism`.

## Conséquences

- Dividende et PER sont des fiches interactives illustrées, reliées au monde 1, pratiquées et
  révisées — plus de simples entrées de glossaire.
- Le moteur visuel sait désormais rendre un **mécanisme conceptuel** ; d'autres notions non
  graphiques (capitalisation, ordre au marché…) pourront réutiliser ce type.
- Le contenu reste `needsReview` (revue humaine avant publication).
- Gate verte : lint · typecheck · **439 tests** (+3) · validate:content 31/31 · release:check 14/14 ·
  build:web (route `/concept/[slug]`). Vérifié en pilotant Chromium (390×844) : `/concept/dividende`
  rend le mécanisme (Entreprise→Dividende→Actionnaire + note détachement), `/concept/per` rend la
  formule (Prix ÷ Bénéfice = PER 10). Aucune publication sans accord.
