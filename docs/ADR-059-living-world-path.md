# ADR-059 — Parcours vertical vivant des 15 mondes (Exp-Max Lot 6)

## Statut

Accepté — 2026-07-20. Programme `patternlab-experience-max`, Lot 6.

## Contexte

La « carte des mondes » était une **liste plate** : 15 cartes cliquables, sans progression ni
déblocage, sans signal visuel par monde. Objectif : un **parcours vertical vivant** façon Duolingo —
progression par monde, déblocage séquentiel, jalons, et un signal visuel partout.

## Options

1. Garder la liste plate (statu quo, peu engageant).
2. Un **chemin vertical** piloté par un module pur, avec statut/déblocage/progression et un visuel
   par monde. *(retenu)*
3. Verrouiller durement les mondes (contraire à la promesse « bibliothèque pour tous »).

## Décision

Option 2, avec un déblocage **doux**.
- Module pur `src/data/worldPath.ts` : `buildWorldPath(worlds, concepts, exploredSlugs)` → nœuds
  `{ world, conceptCount, exploredCount, progress, firstConceptSlug, sampleSpec, status }`. Statut :
  `done` (tous les concepts explorés), `current` (premier débloqué non terminé), `unlocked`,
  `locked`. **Déblocage séquentiel** : les `FREE_WORLDS = 3` premiers mondes sont ouverts d'emblée,
  puis un monde se débloque dès que le précédent est **entamé** (≥ 1 concept exploré) — faible
  friction. La progression se nourrit de `state.learning.conceptsExplored` (déjà persisté, alimenté
  en consultant les fiches). Le catalogue libre reste accessible via Glossaire / Bibliothèque.
- `parcours.tsx` : la liste plate devient un **chemin vertical** (rail + badges + connecteurs, comme
  le trail pilote). Chaque nœud : badge (numéro / ✓ / 🔒), titre + sous-titre, **MiniVisual** du
  premier concept (signal visuel), **barre de progression** `exploredCount/conceptCount`, puce de
  statut (« à explorer » / « terminé ✓ » / 🔒). **Jalons** (« paliers ») affichés aux mondes 3, 7,
  11, 15. Mondes verrouillés désactivés avec indice de déblocage (zéro bouton mort).

## Conséquences

- Le Parcours devient un vrai parcours progressif et visuel : 3 mondes ouverts au départ, les autres
  se débloquent en explorant. Chaque monde porte un signal visuel et sa progression.
- Gate verte : lint · typecheck · **404 tests** (+5, `worldPath.test`) · validate:content 31 ·
  release:check 14 · build:web. Vérifié en pilotant Chromium (390×844) : « 3/15 mondes débloqués »,
  mondes 1–3 avec visuel + « à explorer », jalon « Palier — Fondations posées », mondes 4–15
  verrouillés (🔒), **0 erreur console**.

## Rollback

Réversible : restaurer la liste plate (`worldOverview` est conservé) et retirer `worldPath.ts`.
Aucun changement de schéma ni de persistance (lecture seule de `conceptsExplored`).
