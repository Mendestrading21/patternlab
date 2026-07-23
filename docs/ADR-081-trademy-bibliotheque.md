# ADR-081 — Bibliothèque : index de concepts cherchable (refonte Lot 6)

## Statut

Accepté — 2026-07-22. Refonte Trademy, Lot 6 (branche `feat/trademy-complete-redesign`).
Source : message produit (§ Bibliothèque) et `docs/product/LEARNING_CONTENT_ARCHITECTURE.md`.

## Contexte

L'espace « Bibliothèque » était un simple hub de liens. Le canon veut une **référence cherchable** :
recherche rapide, filtres par famille/difficulté/statut, favoris, historique, fiches, prête pour
500+ concepts.

## Décision

**Module pur `src/data/conceptLibrary.ts`** (testé) :
`searchConcepts` (titre/alias, insensible accents/casse via `normalizeSearch`), `filterConcepts`
(famille + difficulté), `browseConcepts` (combiné), `conceptFamilies` (familles présentes + compte),
`conceptDifficulties`, `difficultyLabel`.

**Écran `(tabs)/apprendre.tsx`** (espace « Bibliothèque ») — index de **tous** les concepts
(`V5_CONCEPTS`) :
- rangée d'outils de référence (Glossaire, Figures, Quiz visuel, Leçons, Quiz éclair) à icônes
  Trademy, toujours accessible ;
- **recherche** rapide ;
- **collections** Tous / Favoris / Récents (favoris + historique via `useProgress`) ;
- **filtre par famille** (chips défilants avec compte) ;
- **filtre par statut de maîtrise** (Tout / Nouveau / Découvert / Maîtrisé) via `conceptMasteryStatus` ;
- cartes concept → `/concept/[slug]` avec famille, difficulté, puce de statut et **favori**
  (`FavoriteButton`) ; compteur et état vide.

## Conséquences

- La Bibliothèque couvre le canon : recherche, filtres (famille + statut), favoris, récents, fiches,
  navigation conçue pour croître (liste filtrée). La difficulté est affichée par carte (filtrable via
  le module ; filtre UI dédié possible plus tard).
- `conceptLibrary.test.ts` (+6) : recherche (accents/casse), filtres famille/difficulté, familles
  présentes (compte exact = corpus), difficultés triées.
- Gate verte : lint · typecheck · **496 tests** (+6) · validate:content · release:check · build:web
  (34 pages /TradeMy/). Vérifié Chromium (390×940) : recherche + collections + filtres famille/statut,
  67 concepts, cartes à famille/difficulté/statut/favori. Voir ADR-081.
