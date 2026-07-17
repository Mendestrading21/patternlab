# ADR-006 — Fiabilité de la progression (XP, déblocage, migration)

## Statut
Accepté (LOT 0 — Fiabilité). Affine ADR-003 sur la stratégie de migration.

## Contexte
La progression souffrait de fragilités de fiabilité :
- l'XP total et l'XP par compétence étaient calculés par **deux barèmes recopiés**
  (dans le moteur et dans le contexte React), risquant une divergence entre l'XP
  affiché et l'XP enregistré ;
- une session **échouée** débloquait quand même la compétence suivante (le parcours
  pouvait être gravi sans rien réussir) ;
- un changement de `schemaVersion` **effaçait** toute la progression persistée
  (ADR-003 : « rejet des états d'une version antérieure »).

## Options
- Garder deux barèmes et ajouter des tests de cohérence.
- **Centraliser** le barème et dériver l'XP total du delta moteur.
- Migration destructive (reset) vs migration **champ par champ**.

## Décision
1. **Source unique de vérité** du barème dans le moteur d'apprentissage :
   `xpForGrade`, `coinsForGrade`, `levelForXp`. `applyGrade` s'en sert ; l'XP total
   progresse exactement du **delta d'XP** renvoyé par le moteur. Cohérence garantie
   par construction.
2. **Logique de progression pure** isolée dans `src/data/progressLogic.ts`
   (`recordAnswer`, `completeSession`), testable sans React. Le déblocage d'une
   compétence exige une session **réussie** (seuil `PASS_RATIO = 0.7`). Transitions
   idempotentes sur une journée (série et `completedSkills` non dupliqués).
3. **Migration non destructive** : `migrateProgress` complète les champs manquants
   d'un état ancien/partiel, recalcule le niveau, et ne renvoie `null` que pour un
   schéma **futur** inconnu ou des données irrécupérables.

## Conséquences
- Impossible de faire diverger XP affiché / enregistré, ou de débloquer en échouant.
- La progression survit aux évolutions de schéma (préservation du travail utilisateur).
- Couverture de tests : `progressLogic`, `migration`, barème (moteur). Mock Jest
  AsyncStorage pour tester la couche données.

## Rollback
Logique pure et fonctions de barème isolées : revenir à l'ancien comportement =
restaurer les calculs inline dans `progressContext` et le rejet dans `repositories.load`.
Aucune donnée n'est perdue par la migration (opération additive).
