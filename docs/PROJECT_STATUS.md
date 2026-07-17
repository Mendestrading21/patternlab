# État du projet

## Date
Lot P1 (en cours) — Glossaire, Réussites, Défis (sur P0.1 → P0.3).

## Branche / commit
`feature/p0-bootstrap` (base `main`). Dépôt local ; distant non créé (en attente de
décision : nom / owner / visibilité / licence).

## Fonctionnel
- App Expo SDK 57 (iOS/Android/web) qui démarre sur **web**.
- Navigation Expo Router : Splash → Onboarding → Tabs (Accueil, Parcours, Leçons, Quiz, Profil) + route Leçon.
- Design system sombre premium : tokens sémantiques + primitives (Text, Button, Card, ProgressBar, Chip, AnswerOption, FeedbackPanel, Screen, EmptyState).
- Personnages Toto (taureau vert) & Bobo (ours rouge) en avatars SVG expressifs, via `CharacterAnimationController` (respecte « réduire les animations »).
- Moteurs découplés : apprentissage (répétition espacée SM-2 testée), exercices (registry, `mcq` + `true_false`), patterns (chart SVG reproductible).
- **Tranche verticale (P0.2)** : onboarding → leçon → session de 6 exercices → feedback → XP → série → écran résultats → retour accueil, jouable de bout en bout sur web.
- **7 formats d'exercices** branchés et testés : QCM, vrai/faux, numérique, mise en ordre, association, trouve-l'erreur, **identify_pattern** (reconnaissance sur graphique en chandeliers).
- **Module pilote « Lire un graphique » (P0.3)** : 4 compétences ordonnées, ~8 leçons, ~20 exercices.
- **Parcours débloquable** : nœuds done/current/locked pilotés par la progression réelle (compétence terminée → déblocage de la suivante).
- **Révisions (répétition espacée)** surfacées sur l'accueil : compétences « à réviser » quand dues ; « Continuer » vise la compétence courante.
- **Glossaire (P1)** : 24 termes WMB réels, recherche + filtres par catégorie + fiches détaillées (définition / exemple).
- **Réussites (P1)** : 8 badges dérivés de la progression (obtenus / verrouillés) avec écran dédié.
- **Défis du jour (P1)** sur l'accueil + section « Explorer » (accès Glossaire / Réussites) — aucun bouton mort.
- Série (streak) calculée par jour + persistée ; résultats avec XP gagné et célébration Toto/Bobo.
- Persistance locale (AsyncStorage) : niveau, XP, pièces, série, maîtrise ; réinitialisation.
- Analytics (logger abstrait) + garde-fou d'erreurs global.
- Validation de contenu contre les schémas JSON (lessons / exercises / patterns).
- CI, ADRs (001, 002, 003, 005), aucun secret, aucune donnée personnelle WMB.

## Partiel
- Lottie : dépendance + point d'intégration prêts ; art des personnages à produire (rendu SVG en attendant — ADR-005).
- Parcours : nœuds affichés, une étape ouvrable ; les autres verrouillées.
- Exercices : 7 formats sur 12 branchés (restent : drag_drop, select_chart_zone, draw_level, scenario, timed).
- Contenu : ~8 leçons / ~20 exercices (départ solide) — à étoffer vers 30-40 leçons / 100-150 exercices.

## Cassé
- Aucun connu à la clôture du lot (voir sortie lint / typecheck / test / build web).

## Absent (par design, lots suivants)
- Tranche verticale complète (P0.2), parcours pilote 30-40 leçons (P0.3).
- 12 formats d'exercices, défis, badges, glossaire, laboratoire interactif, admin, offline complet (P1).
- Import WMB réel (P1). Compte, sync, abonnements, paywall, TestFlight/Play (P2).
- Builds device iOS/Android (EAS + comptes Apple/Google — P2).

## Prochain lot
Étoffer le contenu du pilote (vers 30-40 leçons / 100-150 exercices, 20-30 patterns) et/ou **P1** : laboratoire de patterns interactif (tracer, invalidation), défis, badges, glossaire, import WMB, builds internes.

## Risques
- Conteneur éphémère : pousser rapidement (dépôt dédié ou sauvegarde temporaire) pour ne rien perdre.
- Art Lottie à fournir. Builds device non réalisables dans cet environnement.
