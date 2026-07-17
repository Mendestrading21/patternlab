# État du projet

## Date
2026-07-17 — **LOT 0 — Fiabilité** (skill `patternlab-product-growth`) terminé, sur la
base des lots P0/P1 précédents.

## Branche / commit
Branche de travail `claude/connexion-application-1n30su`. Dépôt distant `origin`
existant (`Mendestrading21/patternlab`) ; aucune poussée ni PR sans accord explicite.

## Fonctionnel
- App Expo SDK 57 (iOS/Android/web) qui démarre sur **web** (vérifiée en pilotant Chromium).
- Navigation Expo Router : Splash → Onboarding → Tabs (Accueil, Parcours, Leçons, Quiz, Profil) + routes Leçon, Session, Glossaire, Réussites.
- Design system sombre premium : tokens sémantiques + primitives (Text, Button, Card, ProgressBar, Chip, AnswerOption, FeedbackPanel, Screen, EmptyState).
- Personnages Toto (taureau vert) & Bobo (ours rouge) : figures 3D HD détourées + avatars vectoriels, via `CharacterAnimationController` (respecte « réduire les animations »).
- Moteurs découplés : apprentissage (répétition espacée SM-2 testée), exercices (registry, 7 formats), patterns (chart SVG reproductible).
- Tranche verticale jouable : onboarding → leçon → session de 5-6 exercices → feedback → XP/pièces → série → écran résultats → retour accueil.
- Parcours débloquable, module pilote « Lire un graphique » (4 compétences), révisions surfacées sur l'accueil, glossaire (24 termes), réussites (8 badges).
- Persistance locale (AsyncStorage) : niveau, XP, pièces, série, maîtrise ; réinitialisation.
- Validation de contenu contre les schémas JSON ; CI (lint/typecheck/test/contenu/build web) ; ADRs ; aucun secret ; aucune donnée personnelle WMB.

## LOT 0 — Fiabilité (ce lot)
Corrigé, sans régression, toutes validations vertes :
- **XP — source unique de vérité.** Le barème (`xpForGrade`/`coinsForGrade`/`levelForXp`) vit désormais dans le moteur. L'XP total progresse exactement du delta d'XP renvoyé par le moteur : plus aucune divergence possible entre l'XP par compétence (enregistré) et l'XP total (affiché). Le niveau est toujours recalculé depuis l'XP total.
- **Double attribution / déblocage.** Extraction d'une logique de progression **pure** (`src/data/progressLogic.ts`). Une compétence n'est débloquée que si la session est **réussie** (≥ 70 %) : impossible de gravir le parcours en échouant. Transitions idempotentes sur une journée (série non double-comptée, compétence jamais dupliquée).
- **Migrations de progression non destructives.** `migrateProgress` complète les champs manquants d'un ancien état au lieu de tout jeter à chaque changement de schéma ; niveau recalculé ; rejet des seuls schémas futurs inconnus ou données irrécupérables.
- **Documentation** remise à jour (ce fichier ; ADR-006).
- **Assets** inutiles/dupliqués supprimés (boilerplate Expo, figures non référencées, icônes d'onglets inutilisées) ; art source préservé.
- **Tests** ajoutés : `progressLogic`, `migration`, barème de récompense (42 tests au total, dont +17). Mock Jest AsyncStorage ajouté pour tester la couche données.
- **CI verte** rétablie : lint échouait sur l'outillage art local (`scripts/prepare-characters/*` important `playwright-core`, hors CI) — désormais exclu du lint applicatif.

## Partiel
- Lottie : dépendance + point d'intégration prêts ; rendu figures/SVG en attendant (ADR-005).
- Exercices : 7 formats sur 12 branchés (restent : drag_drop, select_chart_zone, draw_level, scenario, timed).
- Contenu : ~8 leçons / ~20 exercices — à étoffer vers 30-40 leçons / 100-150 exercices.
- `bobo-warning` : figure enregistrée dans `IMAGES` mais pas encore affichée (conservée volontairement).

## Cassé
- Aucun connu (voir sorties lint / typecheck / test / validate:content / build web).

## Absent (par design, lots suivants)
- Design System V2, navigation Laboratoire, onboarding personnalisé, leçons V2, exercices avancés, laboratoire graphique interactif, maîtrise adaptative, import APP pilote, monétisation, analytics étendus, offline complet (lots 1→19 du skill `patternlab-product-growth`).
- Builds device iOS/Android (EAS + comptes Apple/Google).

## Prochaine priorité
**Lot 1 — Design System V2** (palette « Instrument Glass », tokens, composants, états loading/empty/error/offline/locked/disabled, accessibilité AA), puis Lot 2 — Navigation.

## Risques
- Conteneur éphémère : commit local présent ; pousser après accord pour ne rien perdre.
- Art Lottie à fournir. Builds device non réalisables dans cet environnement.
