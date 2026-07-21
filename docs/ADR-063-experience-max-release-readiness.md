# ADR-063 — Accessibilité, perf & finition release (Exp-Max Lot 10)

## Statut

Accepté — 2026-07-20. Programme `patternlab-experience-max`, Lot 10 (**dernier lot**).

## Contexte

Le programme Experience Max (Lots 1–9) a ajouté beaucoup de surfaces : parcours visuel-first,
graphiques et 3 nouveaux types de visuels, quiz enrichis, +20 concepts, leçons immersives avec
manipulation, parcours vertical des 15 mondes, mascottes vivantes, gamification, accueil enrichi.
Ce lot **finalise** l'accessibilité de ces écrans, confirme la posture perf, et met à jour la
documentation de préparation à la publication.

## Options

1. Clore sans audit (risque d'incohérences a11y sur les nouveaux écrans).
2. **Passe de finition** : corriger les points a11y résiduels, documenter perf et a11y, mettre à jour
   la checklist de release. *(retenu)*

## Décision

Option 2.
- **Accessibilité** : prop `decorative` sur `CandlestickGlyphs` (masque à l'a11y les schémas
  imbriqués dans `ComparisonVisual` / `CheatSheetVisual` → plus d'annonce d'image doublée, seul le
  résumé du parent est lu) ; tuiles de progression (accueil) et de résultat (session) exposées comme
  un **seul élément accessible** (« Mondes : 3/15 ») ; `ACCESSIBILITY.md` complété d'une section
  couvrant tous les écrans Experience Max (leçons immersives, replay statique, nouveaux visuels,
  quiz, parcours vertical, mascottes, accueil).
- **Performance** : les dérivations des écrans (mission, carte des mondes, badges, concept du jour)
  sont **pures, statiques et bon marché** (O(corpus ≈ 58)) et ne s'exécutent qu'au changement d'état ;
  les visuels sont des SVG sans animation mesurée. Aucune optimisation supplémentaire nécessaire ;
  posture documentée.
- **Release** : `RELEASE_READINESS.md` mis à jour (417 tests) ; programme marqué **complet** dans
  `PROJECT_STATUS.md`.

## Conséquences

- Programme Experience Max **complet (Lots 1 → 10)**, publié en live à chaque lot depuis `main`.
- Gate verte : lint · typecheck · **417 tests** · validate:content 31 · release:check 14 · build:web.
  Vérifié en pilotant Chromium : rôles/labels des nouveaux écrans présents, aucune régression, **0
  erreur console**.

## Rollback

Réversible : la prop `decorative` par défaut `false` ne change rien à l'existant ; les labels de
tuiles et la doc sont additifs. Aucun changement de schéma ni de persistance.
