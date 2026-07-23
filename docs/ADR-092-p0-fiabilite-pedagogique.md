# ADR-092 — Fiabilité pédagogique P0 (ne jamais enseigner une réponse fausse)

## Statut

Accepté — 2026-07-23. Branche `fix/trademy-p0-pedagogical-truth`.
Lot correctif ciblé (P0) ; ne modifie ni le corpus, ni la navigation, ni le design.

## Contexte

Audit de fiabilité pédagogique : la priorité absolue est que Trademy n'enseigne jamais une
réponse fausse et que la progression reflète un apprentissage réel. Cinq défauts P0 ont été
confirmés dans le code courant (pas seulement dans un audit ancien) :

1. **Contradiction graphique ↔ réponse.** Des exercices `identify_pattern` directionnels
   utilisaient `chartSeed: 2024`, dont le rendu réel (fonctions `generateCandles`/`describeCandles`)
   est **baissier**, alors que la bonne réponse attendue était « haussière ». L'apprenant voyait un
   graphique en désaccord avec la correction. Aucun test ne croisait la réponse et le graphique.
2. **Révision espacée gonflée.** La planification SM-2 était appelée **par réponse** sur la revue
   partagée de la compétence : une même cible était comptée plusieurs fois par session, et la
   dernière réponse écrasait la programmation (une session ratée pouvait planifier une révision
   lointaine).
3. **Reprise = double comptage.** La note était validée à `validate()` mais l'index avançait à
   `next()` ; une reprise après fermeture pouvait recompter une réponse.
4. **Statut éditorial invisible.** Les 67 fiches sont `needsReview`, mais rien ne le signalait :
   elles pouvaient passer pour des contenus entièrement validés.
5. **Portes de qualité.** Le déploiement Pages ne rejouait que `build:web`, découplé de la gate.
   Le zoom web était désactivé (`user-scalable=no`, `maximum-scale=1`).

Refutés après vérification (déjà corrects, laissés tels quels) : le gating de maîtrise
(`isMastered` exige `repetitions ≥ 3` **et** `mastery ≥ 0.8` ; une visite = `explored`, pas
`mastered`), le déterminisme SM-2, la migration versionnée, les alt-texts, couleur+icône et
`reduced-motion`.

## Décision

- **Cohérence graphique ↔ réponse.** Corriger les graines contradictoires dans `seed.ts`
  (`chart-direction` 2024→7, `trend.identify` 2024→11, `patterns.sequence` 2024→12) et **ajouter
  un garde-fou** : `exerciseChartCoherence.test.ts` recalcule la direction réelle de chaque
  exercice directionnel via les fonctions de rendu et la compare à la bonne réponse.
- **Révision par session, pas par réponse.** Séparer les responsabilités :
  `recordAnswer` ne gère plus que l'activité (XP, pièces, errorTags) ; la maîtrise et la
  planification SM-2 passent par `recordSessionReview` (une note agrégée `gradeForSession`
  appliquée **une seule fois** en fin de session). Une session à 60 % programme une révision
  **proche** (1 jour) ; une session ratée, **immédiate**. `applyGrade` conserve son comportement
  historique (`= applySessionGrade + XP`) — aucun test existant cassé.
- **Reprise idempotente.** La note et l'avance d'index sont committées ensemble à `next()` ;
  refs en mémoire (`answeredRef`, `sessionScoredRef`) empêchent tout double comptage.
- **Statut éditorial honnête.** Schéma enrichi (`reviewedBy?`, `reviewDate?`, absents tant que
  `needsReview`) ; helper `needsEditorialReview()` + bandeau « À relire » sur chaque fiche non
  validée (texte + couleur, jamais la couleur seule).
- **Portes de qualité.** `deploy.yml` rejoue désormais **`npm run check`** complet avant publication ;
  viewport web rétabli (`initial-scale=1`, sans `user-scalable=no`). Verrous d'infra dans
  `infraGuards.test.ts`.

## Conséquences

- Trademy ne présente plus de graphique en contradiction avec sa correction ; un test bloque toute
  régression future sur n'importe quel nouvel exercice directionnel.
- La progression reflète l'apprentissage réel : une cible n'est comptée qu'une fois par session,
  une session faible rapproche la révision, une session ratée la rend immédiate.
- L'utilisateur voit clairement qu'un contenu est en relecture ; aucune source externe fabriquée
  (toutes les sources sont internes et traçables).
- Le déploiement ne peut plus publier un build qui échoue lint/typecheck/tests/contenu/release.
- **Aucune migration destructive** : les clés `patternlab.*` et `PROGRESS_SCHEMA_VERSION` sont
  inchangées ; les nouveaux champs de schéma sont optionnels.

## Rollback

Chaque correctif est un commit isolé et réversible (`git revert`) sans migration de données :
graines de `seed.ts`, séparation `recordAnswer`/`recordSessionReview`, bandeau éditorial,
`deploy.yml` + viewport. Aucun état persistant n'est modifié ; revenir en arrière n'affecte pas
les données utilisateur.
