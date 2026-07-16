# État du projet

## Date
Lot P0.1 — Bootstrap.

## Branche / commit
`feature/p0-bootstrap` (base `main`). Dépôt local ; distant non créé (en attente de
décision : nom / owner / visibilité / licence).

## Fonctionnel
- App Expo SDK 57 (iOS/Android/web) qui démarre sur **web**.
- Navigation Expo Router : Splash → Onboarding → Tabs (Accueil, Parcours, Leçons, Quiz, Profil) + route Leçon.
- Design system sombre premium : tokens sémantiques + primitives (Text, Button, Card, ProgressBar, Chip, AnswerOption, FeedbackPanel, Screen, EmptyState).
- Personnages Toto (taureau vert) & Bobo (ours rouge) en avatars SVG expressifs, via `CharacterAnimationController` (respecte « réduire les animations »).
- Moteurs découplés : apprentissage (répétition espacée SM-2 testée), exercices (registry, `mcq` + `true_false`), patterns (chart SVG reproductible).
- Quiz réellement jouable (2 questions corrigées + feedback + réaction des mascottes).
- Persistance locale (AsyncStorage) : niveau, XP, pièces, maîtrise ; réinitialisation.
- Analytics (logger abstrait) + garde-fou d'erreurs global.
- Validation de contenu contre les schémas JSON (lessons / exercises / patterns).
- CI, ADRs (001, 002, 003, 005), aucun secret, aucune donnée personnelle WMB.

## Partiel
- Lottie : dépendance + point d'intégration prêts ; art des personnages à produire (rendu SVG en attendant — ADR-005).
- Parcours : nœuds affichés, une étape ouvrable ; les autres verrouillées.
- Exercices : 2 formats sur 12 branchés.

## Cassé
- Aucun connu à la clôture du lot (voir sortie lint / typecheck / test / build web).

## Absent (par design, lots suivants)
- Tranche verticale complète (P0.2), parcours pilote 30-40 leçons (P0.3).
- 12 formats d'exercices, défis, badges, glossaire, laboratoire interactif, admin, offline complet (P1).
- Import WMB réel (P1). Compte, sync, abonnements, paywall, TestFlight/Play (P2).
- Builds device iOS/Android (EAS + comptes Apple/Google — P2).

## Prochain lot
**P0.2 — Tranche verticale** : onboarding → leçon → 6 exercices → feedback → XP → progression, testée sur web.

## Risques
- Conteneur éphémère : pousser rapidement (dépôt dédié ou sauvegarde temporaire) pour ne rien perdre.
- Art Lottie à fournir. Builds device non réalisables dans cet environnement.
