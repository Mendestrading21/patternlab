# État du projet

## Date
2026-07-17 — **LOT 3 — Onboarding personnalisé** terminé (après LOT 0 — Fiabilité,
LOT 1 — Design System V2, LOT 2 — Navigation), skill `patternlab-product-growth`,
sur la base des lots P0/P1 précédents.

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

## LOT 1 — Design System V2 (ce lot)
Identité **« Instrument Glass »**, sans régression, toutes validations vertes :
- **Palette** migrée vers graphite/bleu nuit (`background #0B1119`, surfaces élevées, accents `bullish #26C281` / `bearish #F05A67` / `technical #42B7E8`) ; clés sémantiques conservées → aucun écran réécrit ; `bullish/bearish` toujours distincts de `feedbackCorrect/incorrect`.
- **Accessibilité AA vérifiée par test** (`contrast.ts` + `contrast.test.ts`) : toutes les paires texte/surface ≥ 4.5 ; `textMuted` éclairci (`#8B99AB`).
- **Élévation** (`theme.elevation`) : profondeur « verre » discrète sur les cartes.
- **Primitives d'états** : `StateView` (loading/empty/error/offline/locked, un seul CTA), `Skeleton` (respecte reduced motion), `OfflineBanner` + hook `useIsOnline`. Intégrées réellement : chargement de l'accueil, garde-fou d'erreurs, bannière hors-ligne globale ; `EmptyState` délègue à `StateView`.
- **Couleurs web** alignées (HTML `theme-color`, `global.css`, manifest PWA).
- `useReducedMotion` centralisé dans le design system (source unique ; `@/characters` ré-exporte).
- Voir **ADR-007**.

## LOT 2 — Navigation (ce lot)
IA cible du skill, sans régression, toutes validations vertes :
- **Barre à 5 onglets** : Accueil · Parcours · **Laboratoire** · **Révisions** · Profil. Leçons/Quiz conservés comme routes hors barre (`href: null`), accessibles depuis l'accueil (Explorer) et les Leçons — aucun bouton mort.
- **Laboratoire** (nouvel écran) : chandeliers déterministes, figure Double Creux avec zone de confirmation et invalidation / faux signal, débat Toto/Bobo ; tracé interactif daté du Lot 8 (bouton désactivé + raison).
- **Révisions** (nouvel écran) : compétences dues (CTA), vue d'ensemble (maîtrise, prochaine échéance), état vide.
- **Accueil recentré** sur une **seule action principale** (`buildDailyMission` : révision due > apprentissage > terminé) ; progression compacte ; les révisions pointent vers l'onglet dédié.
- Dédoublonnage : l'aperçu Laboratoire quitte l'écran Leçons.
- Tests purs `dailyMission` ; routes typées régénérées ; PWA inchangée. Voir **ADR-008**.

## LOT 3 — Onboarding personnalisé (ce lot)
Flux personnalisé + modèle versionné, sans régression, toutes validations vertes :
- **Profil versionné** `OnboardingProfile` (objectif, niveau, temps 3/5/10 min, sujets, diagnostic, compétence de départ, `schemaVersion`) + migration + repository AsyncStorage **séparé** de la progression.
- **Flux en 7 étapes** : promesse + Toto/Bobo → objectif → niveau → temps → sujets → diagnostic éclair facultatif (3 questions, score) → récap avec **compétence de départ recommandée** ; indicateur d'étape, retour/continuer, sélections accessibles, un seul CTA par écran.
- **Recommandation pure** `recommendStartSkill` (le niveau fixe le départ ; un sujet peut ramener plus tôt mais jamais sauter un prérequis) — testée.
- **Première interaction avant compte/paywall** : « Commencer ma première leçon » → persiste le profil + marque l'onboarding + route vers `/session/{startSkillId}` (vérifié : `/session/skill.actions`).
- **Profil** (onglet) affiche le résumé + « Repersonnaliser ».
- **Analytics** : `onboarding_started`, `goal_selected`, `diagnostic_completed`, `path_generated`, `onboarding_completed`.
- Rétrocompatible (utilisateurs déjà onboarded sans profil → invite de personnalisation). Voir **ADR-009**.

## Partiel
- Lottie : dépendance + point d'intégration prêts ; rendu figures/SVG en attendant (ADR-005).
- Détection hors-ligne native (iOS/Android) différée (web opérationnel) — `@react-native-community/netinfo` dans un lot ultérieur.
- Laboratoire : aperçu lisible ; tracé/comparaison/replay interactifs au Lot 8.
- Exercices : 7 formats sur 12 branchés (restent : drag_drop, select_chart_zone, draw_level, scenario, timed).
- Contenu : ~8 leçons / ~20 exercices — à étoffer vers 30-40 leçons / 100-150 exercices.
- `bobo-warning` : figure enregistrée dans `IMAGES` mais pas encore affichée (conservée volontairement).

## Cassé
- Aucun connu (voir sorties lint / typecheck / test / validate:content / build web).

## Absent (par design, lots suivants)
- Leçons V2, exercices avancés, laboratoire graphique interactif (tracé/replay), maîtrise adaptative, import APP pilote, monétisation, analytics étendus, offline complet (lots 4→19 du skill `patternlab-product-growth`).
- Builds device iOS/Android (EAS + comptes Apple/Google).

## Prochaine priorité
**Lot 4 — Accueil mission du jour** (composition complète : CTA principal exploitant le
profil — objectif/temps —, révision due, progression compacte), puis Lot 5 — Parcours immersif.

## Risques
- Conteneur éphémère : commit local présent ; pousser après accord pour ne rien perdre.
- Art Lottie à fournir. Builds device non réalisables dans cet environnement.
