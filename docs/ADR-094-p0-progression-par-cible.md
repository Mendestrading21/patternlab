# ADR-094 — Progression par cible pédagogique (persistée) + preuve CI

## Statut

Accepté — 2026-07-23. Branche `fix/trademy-p0-pedagogical-truth` (achève ADR-093
après revue de la PR #8). Change le modèle PERSISTÉ → migration non destructive (schéma v8).

## Contexte

Revue de PR : le modèle de cible (`conceptId + objectiveId`) existait, mais la progression
et la répétition espacée restaient appliquées principalement par `skillId`. Deux objectifs d'une
même compétence — et deux concepts partageant un skillId — partageaient donc leur avancement. La
« couverture approximée au niveau compétence » n'était pas acceptable pour ce lot P0. Trois écarts
restaient : progression non portée par la cible, reprise de checkpoint incomplète (`answeredRef` non
persisté), rotation dépendante de `review.repetitions` (qu'un échec remet à zéro).

## Décision

1. **Progression par cible (persistée, schéma v8)** — `ProgressState.targets` :
   `objectiveId → TargetProgress` (SM-2 propre). Au plus **une transition par cible et par session**
   (`applyTargetSessionResults`). Deux objectifs d'une compétence avancent indépendamment.
2. **Chaque exercice porte une cible** vers un objectif RÉEL de son concept représentatif ; la
   **maîtrise par couverture** exige que TOUS les objectifs exerçables du concept soient prouvés
   (entraînés + retenus) + checkpoint. Fin de l'approximation au niveau compétence et de la maîtrise
   partagée entre concepts d'un même skillId.
3. **Reprise de checkpoint fidèle** — les réponses validées (exerciseId, skillId, conceptId,
   objectiveId, correct) sont persistées avec la reprise (`SessionResume.answered`) et restaurées ;
   `aggregateAnswered` (pur, partagé) garantit qu'une session reprise produit **exactement** le même
   état qu'une session continue, sans double comptage.
4. **Compteur de rotation persistant** — `ProgressState.rotation` : avance à chaque session terminée,
   réussie OU non (indépendant de SM-2). Une session échouée ne re-présente plus la même série ; la
   remédiation propose une variante différente (`pickVariant`).
5. **Preuve CI avant fusion** — `ci.yml` sur `pull_request → main` : `npm ci`, `git diff --check`
   sur le diff de la PR, `npm run check`. Le déploiement reste réservé à `main`.

## Conséquences

- Progression et maîtrise reflètent les objectifs RÉELLEMENT entraînés, cible par cible.
- Un checkpoint interrompu puis repris est fidèle au bit près.
- Les variantes tournent même après un échec.
- La gate est prouvée sur chaque PR avant fusion.
- **Migration non destructive** : `targets` et `rotation` par défaut `{}` ; anciennes sauvegardes
  lues sans perte et relues plus honnêtement (une compétence « solide » sans cibles entraînées n'est
  plus « maîtrisée »). Clés `patternlab.*` inchangées.

## Rollback

Commits isolés et réversibles (`git revert`). Le schéma v8 est purement additif : revenir en arrière
laisse les champs `targets`/`rotation` ignorés, sans perte des autres données.
