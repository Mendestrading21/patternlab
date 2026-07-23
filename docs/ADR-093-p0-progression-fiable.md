# ADR-093 — Progression fiable P0 (cible canonique, source sémantique, maîtrise prouvée)

## Statut

Accepté — 2026-07-23. Branche `fix/trademy-p0-pedagogical-truth` (suite d'ADR-092).
Lot correctif P0 ; additif et non destructif (aucun champ persistant ajouté).

## Contexte

Deux explorations approfondies (exercices ; répétition & maîtrise) ont confirmé des défauts P0
au-delà de ceux d'ADR-092 :

- **A — Exercices** : 30 exercices pour 67 concepts ; sessions toujours construites avec les
  premiers exercices ; checkpoint = 8 questions fixes ; aucune rotation adaptative ; feedback de
  remédiation parfois hors sujet ; contradiction possible graphique/réponse/explication/accessible.
- **B — Répétition & maîtrise** : `strong` présenté comme `mastered` ; un concept jamais entraîné
  peut hériter de la maîtrise d'une compétence (17 concepts partagent `skill.candles`) ; mondes
  terminables par simple consultation ; checkpoints ne prouvant ni couverture ni rétention.

## Décision

1. **Cible pédagogique canonique** `conceptId + objectiveId` (`learningTarget.ts`). Les objectifs
   sont **dérivés** des champs réels du concept (jamais inventés) ; `recognize` toujours présent.
2. **Source sémantique unique** pour les exercices directionnels (`semanticExercise.ts`) : la
   direction est calculée une fois sur la série affichée (`candleTrend`), puis la réponse correcte,
   le feedback et le résumé accessible en dérivent — cohérence **par construction**. Les 3 exercices
   directionnels sont générés par le builder et portent une cible.
3. **Remédiation liée au bon objectif** (`remediationForExercise`) : une erreur sur un exercice
   ciblé pointe l'objectif réel du concept ; sinon repli sur la misconception.
4. **Rotation déterministe** (`exerciseRotation.ts`) : page glissante par `round` (dérivé des
   répétitions persistées) au lieu des premiers N figés ; checkpoint tournant (8 questions non
   figées, plusieurs objectifs). `round 0` = comportement historique.
5. **Machine d'états stricte** (`conceptMasteryState.ts`) : `new → explored → completed → strong →
   mastered`. La maîtrise exige un **faisceau de preuves** (représentativité + solidité SM-2 +
   rétention différée + checkpoint indépendant réussi + exploration). `strong` n'est plus présenté
   comme `mastered`. Un concept non représentatif (partage de skillId) est plafonné à `exploré` :
   fin de la maîtrise partagée artificiellement.
6. **Verrou de complétion des mondes** (`learningMap.ts`) : un monde de contenu (2 à 15) n'est
   jamais `terminé` par la seule consultation ; la lecture le marque `exploré` (assez pour ouvrir le
   monde suivant — pas d'impasse), `terminé` exige un checkpoint.

## Conséquences

- Le graphique, la réponse, le feedback, le texte accessible **et** la remédiation d'une erreur
  convergent vers une même vérité ; un garde-fou de cohérence bloque toute régression.
- La progression reflète l'apprentissage réel : sélection tournante (couverture au lieu de
  répétition), maîtrise prouvée dans le temps et au checkpoint, pas de maîtrise héritée ni de monde
  « terminé » par la lecture.
- **Aucune migration destructive** : tout dérive de l'état déjà persisté (`skills`,
  `completedSkills`, `learning.conceptsExplored`). `PROGRESS_SCHEMA_VERSION` et clés `patternlab.*`
  inchangés. Les anciennes données sont relues plus honnêtement (une compétence « très solide » sans
  checkpoint n'est plus sur-notée), sans perte.

## Rollback

Sept commits isolés et réversibles (`git revert`), aucun état persistant modifié : cible canonique,
source sémantique, remédiation, rotation, machine d'états, verrou de mondes, tests de compatibilité.
