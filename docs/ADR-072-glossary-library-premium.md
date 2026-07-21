# ADR-072 — Glossaire & bibliothèque premium : recherche + statut d'apprentissage (Learning-Master Lot 8)

## Statut

Accepté — 2026-07-21. Programme `patternlab-learning-master`, Lot 8.

## Contexte

Le glossaire disposait déjà d'une recherche tolérante, de favoris et de récents, mais deux manques de
l'audit subsistaient : la **bibliothèque visuelle n'était pas cherchable** (seulement filtrable par
direction), et les fiches n'affichaient **aucun statut d'apprentissage** — impossible de distinguer
une fiche simplement *vue* d'une notion *maîtrisée* (P1 « progression gonflable : voir = exploré »).

## Décision

- **`src/data/conceptMastery.ts`** (pur, testé) — `conceptMasteryStatus(concept, { exploredSlugs,
  skills })` renvoie un statut honnête : **Maîtrisé** si la compétence liée est solide/maîtrisée,
  sinon **Découvert** si la fiche est consultée, sinon **Nouveau**. Voir ≠ maîtriser. Surfacé par une
  **puce de statut** en tête de la fiche concept (`/concept/[slug]`), couleur selon le niveau.
- **`searchFigures(query, list)`** (dans `patternLibrary.ts`, pur, testé) — recherche des figures
  **insensible aux accents/casse** sur le titre, l'alias anglais et la famille, réutilisant
  `normalizeSearch` du glossaire (source unique). La **bibliothèque visuelle** gagne un champ de
  recherche (combiné au filtre de direction) + un compteur / message « aucun résultat ».

## Conséquences

- La bibliothèque visuelle est **cherchable** (« marteau », « hammer », « triangle », « indicateur »…)
  en plus du filtre par direction — la recherche est désormais cohérente entre glossaire et figures.
- Les fiches affichent un **statut d'apprentissage** exact, qui ne confond pas consultation et
  maîtrise — appui direct pour une future « bibliothèque premium » (collections, tri par statut).
- Favoris/récents (glossaire) restent en place ; la **comparaison visuelle** côte à côte et les
  **collections** thématiques pourront s'ajouter (le type `comparison` existe déjà).
- Gate verte : lint · typecheck · **470 tests** (+9) · validate:content 31/31 · release:check 14/14 ·
  build:web. Vérifié en pilotant Chromium (390×844) : recherche « marteau » réduit la galerie
  (85 → 15 SVG), message « aucun résultat » sur requête vide de sens, puce de statut présente sur la
  fiche. Aucune publication sans accord.
