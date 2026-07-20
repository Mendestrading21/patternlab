# ADR-041 — Release readiness V5 (dernier lot)

## Statut
Accepté (V5 Lot 16 — Release readiness, skill `patternlab-v5-master`). **Dernier lot de la feuille
de route V5** (Lots 0 → 16).

## Contexte
La vérification de publication v1 (`release:check`, 13 invariants purs + testés) couvrait config, assets
et légal. La montée en gamme V5 a ajouté beaucoup de contenu et de surfaces ; le lot final devait
**garantir au niveau publication** que rien de dangereux ne sort (contenu auto-publié, promesses), et
**consolider** l'état de préparation.

## Décision
1. **Nouvel invariant de publication** : `runReleaseChecks` gagne `contentDraftCount` +
   `contentAllInReview` → check **« contenu V5 en revue (aucun brouillon auto-publié) »** (échec si un
   brouillon `content/drafts/concepts-v5/` est `approved`/`published`). Le runner `release-check.mjs`
   calcule l'entrée en lisant les brouillons JSON. `release:check` passe de 13 à **14 vérifications**.
2. **Checklist finale** `docs/RELEASE_READINESS.md` : sépare les portes **automatisées et vertes**
   (lint, typecheck, 342 tests, validate:content 31, release:check 14, build:web) et les invariants
   produit garantis par test (vocabulaire, non-auto-publication, intégrité, visuels rendables, a11y,
   offline, analytics, monétisation démo), des **étapes manuelles** de soumission store (EAS, fiches,
   politique de confidentialité hébergée, revue humaine, bêta).
3. **Feuille de route V5 complète** : `PROJECT_STATUS` marque les Lots 0 → 16 terminés.

## Conséquences
- Le pipeline de publication ne peut plus laisser passer du contenu accidentellement publié ; la
  conformité, l'accessibilité, l'offline et la non-publication automatique sont toutes garanties par test.
- « Go » côté ingénierie ; la publication effective reste conditionnée aux étapes manuelles (build signé,
  fiches store, revue humaine) et à **l'accord explicite** — aucun push ni publication sans accord.
- Reste hors périmètre (post-V5) : montée du contenu vers 150/500 par lots éditoriaux revus, tests
  lecteur d'écran natifs sur appareil, et la soumission store elle-même.
