# ADR-009 — Onboarding personnalisé

## Statut
Accepté (LOT 3 — Onboarding personnalisé, skill `patternlab-product-growth`).

## Contexte
L'onboarding V1 était un simple écran d'intro (promesse + présentation Toto/Bobo +
« Continuer »). Le skill demande un onboarding **personnalisé** : objectif, niveau,
temps quotidien (3/5/10 min), sujets, diagnostic facultatif, parcours recommandé et
**première interaction avant compte/paywall**, avec un **modèle de profil versionné**
stocké localement (objectif, niveau, temps, sujets, diagnostic, compétence de départ,
reprise, schemaVersion). Aucun compte, aucune donnée personnelle.

## Options
- Un long formulaire unique (peu engageant).
- **Un flux en étapes** avec un modèle de profil versionné persistant et une logique
  de recommandation pure.

## Décision
1. **Modèle versionné** `OnboardingProfile` (`onboardingProfile.ts`, `schemaVersion`)
   + `migrateOnboardingProfile` (normalisation/rejet sûrs) + repository AsyncStorage
   dédié (`onboardingRepository`), **séparé** de la progression.
2. **Logique de recommandation pure** `recommendStartSkill(level, topics, skills)` :
   le niveau fixe le départ ; un sujet peut ramener **plus tôt** (réviser un prérequis)
   mais **jamais** sauter un prérequis. Déterministe et testée.
3. **Flux en 7 étapes** (`onboarding.tsx`) : promesse + Toto/Bobo → objectif → niveau →
   temps → sujets → diagnostic éclair facultatif (3 questions, score) → récap avec
   compétence de départ recommandée. Indicateur d'étape, retour/continuer, sélections
   accessibles (`accessibilityState.selected`), un seul CTA par écran.
4. **Première interaction avant compte/paywall** : « Commencer ma première leçon » →
   `completeOnboarding(profile)` (persiste le profil + marque l'onboarding terminé) →
   route vers `/session/{startSkillId}`.
5. **Profil visible/éditable** dans l'onglet Profil (résumé + « Repersonnaliser »).
6. **Analytics** : `onboarding_started`, `goal_selected`, `diagnostic_completed`,
   `path_generated`, `onboarding_completed` (props minimisées, aucune donnée sensible).

## Conséquences
- Parcours adapté dès la première minute ; départ recommandé cohérent.
- Rétrocompatible : les utilisateurs déjà `onboarded` sans profil voient une invite
  de personnalisation (profil = null) — l'entrée de l'app reste pilotée par `onboarded`.
- Couverture de tests : `recommendStartSkill` + `migrateOnboardingProfile`.

## Rollback
Restaurer l'écran d'onboarding simple ; `onboardingProfile`/repository/recommendation
sont additifs et sans effet de bord sur la progression.
