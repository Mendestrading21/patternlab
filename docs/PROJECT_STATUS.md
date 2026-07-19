# État du projet

## Date
2026-07-18 — **LOT 19 — Release readiness** terminé (après LOT 0 → LOT 18) —
**feuille de route `patternlab-product-growth` complète (Lots 0 → 19)**.

## Branche / commit
Branche de travail `claude/connexion-application-1n30su`. Dépôt distant `origin`
existant (`Mendestrading21/patternlab`) ; aucune poussée ni PR sans accord explicite.

## Fonctionnel
- App Expo SDK 57 (iOS/Android/web) qui démarre sur **web** (vérifiée en pilotant Chromium).
- Navigation Expo Router : Splash → Onboarding → Tabs (Accueil, Parcours, Laboratoire, Révisions, Profil) + routes Leçon, Session, Glossaire, Réussites, Statistiques, Premium, À propos.
- Design system sombre premium : tokens sémantiques + primitives (Text, Button, Card, ProgressBar, Chip, AnswerOption, FeedbackPanel, Screen, EmptyState).
- Personnages Toto (taureau vert) & Bobo (ours rouge) : figures 3D HD détourées + avatars vectoriels, via `CharacterAnimationController` (respecte « réduire les animations »).
- Moteurs découplés : apprentissage (répétition espacée SM-2 testée), exercices (registry, 9 formats), patterns (chart SVG reproductible).
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

## LOT 4 — Accueil mission du jour (ce lot)
Composition personnalisée, sans régression, toutes validations vertes :
- **Le temps quotidien pilote la longueur de session** : `exercisesForMinutes` (3→3, 5→5, 10→8) + `limitCount`, testées ; l'écran de session lit `count` (facultatif, rétrocompatible) et tronque la liste.
- **CTA principal personnalisé** : la mission route vers `/session/[skillId]?count=…` (depuis l'accueil ET la fin d'onboarding — vérifié : `?count=3` → « Exercice 1 / 3 »). Sous-titre d'accueil = objectif + temps du profil ; carte mission = `~N min` + `N exercices`.
- **Progression compacte** (niveau, série, pièces, XP) dans la carte mission.
- **Révision due** : pointeur compact vers l'onglet Révisions.
- **Allègement** : suppression de la section décorative « Les 4 piliers » ; conservation des Défis, de l'Explorer (Leçons/Quiz/Glossaire/Réussites) et des Conseils Toto/Bobo.
- Voir **ADR-010**.

## LOT 5 — Parcours immersif (ce lot)
Carte à nœuds + checkpoint, sans régression, toutes validations vertes :
- **Carte pure** `buildWorldMap` : nœuds (compétences + **checkpoint** de fin de module) avec statuts done / current / **due** / locked ; checkpoint verrouillé tant que les 4 compétences ne sont pas terminées. Testée.
- **Checkpoint = revue mixte** : `getExercises('checkpoint.read-chart')` agrège des exercices de chaque compétence (skillId réel conservé → maîtrise réelle mise à jour) ; `skillById` donne un titre dédié ; lecteur de session **inchangé** ; événement `checkpoint_completed`.
- **UI immersive** (`parcours.tsx`) : en-tête de monde (« Monde 1 · Fondations »), mascotte, barre de progression, **trail** relié par un connecteur vertical, badges statués, révisions dues surlignées, nœud checkpoint distinct ; accessibilité (rôles/états/hints) + état loading.
- Voir **ADR-011**.

## LOT 6 — Leçons V2 (ce lot)
Steps enrichis + flashcards, sans régression, toutes validations vertes :
- **Modèle de step étendu** (rétrocompatible) : `intro` (hook), `observe`, `chart`, `warning`, `falseSignal`, `flashcard` en plus des existants ; `body` optionnel ; `chartSeed` + `flashcard {front, back}`. Schéma JSON inchangé (permissif sur `kind`).
- **Contenu enrichi** : leçons pilotes (action, bougie, double creux) en V2 — hook → observation → **graphique** (PatternChart déterministe) → **faux signal** → résumé → **flashcard**.
- **Composant `Flashcard`** (design system) : réponse révélée au toucher, sans animation (reduced-motion safe), accessible.
- **Écran leçon** : rendu par kind (accents dédiés : faux signal bearish, résumé primaire, warning ambre) ; chips durée/difficulté.
- **Helper pur `lessonContent`** (`flashcardsForSkill` / `allFlashcards`), testé — brique réutilisable pour les révisions.
- Voir **ADR-012**.

## LOT 7 — Exercices avancés (ce lot)
Deux nouveaux formats branchés (grader pur + renderer + tests), sans régression :
- **`scenario`** (SI/ALORS) : contexte mis en avant + options ; `validation.correctIndex`.
- **`select_chart_zone`** : graphique en chandeliers avec **zones tappables superposées** (boutons accessibles), sélection/correction colorées, tap simple (fallback natif), sans animation.
- Contenu pilote : `select_chart_zone` (skill.trend), `scenario` (skill.patterns) ; libellés de format dans la session.
- **9 formats** branchés (les formats à tracé/replay relèvent du Lot 8). Voir **ADR-013**.

## LOT 8 — Laboratoire interactif (ce lot)
Prototype interactif + benchmark, sans régression, toutes validations vertes :
- **Benchmark moteur graphique** (react-native-svg / Skia / Canvas) → **ADR-014** : rester sur `react-native-svg` (aucune dépendance ajoutée) ; logique d'échelle **extraite en fonctions pures** → un futur Skia ne réécrira que le renderer.
- **Cœur interactif pur** `interactive.ts` : échelle prix↔Y, support/résistance cibles, tolérance — testés.
- **`InteractiveChart`** (SVG) : tracé d'un niveau horizontal au **tap** (souris/touch) **ou** aux flèches ↑/↓ (accessible / fallback gestes).
- **Premier scénario « trace le support »** : validation avec tolérance, **correction visuelle** (ligne cible + feedback Toto/Bobo), réinitialisation. Analytics `lab_started`/`lab_completed`.
- Voir **ADR-014**.

## LOT 9 — Maîtrise adaptative (ce lot)
Statuts + errorTags + migration v3, sans régression, toutes validations vertes :
- **Statut de maîtrise** pur `masteryStatus` : new → learning → fragile → reviewing → strong → mastered (dérivé de mastery/confidence/rappels, jamais d'une seule réponse). Testé.
- **errorTags** sur `SkillProgress` : sur mauvaise réponse, la session enregistre l'id de l'exercice (`recordAnswer(..., tag)`) ; `errorCount` agrège. La révision est déjà rapprochée par le moteur (échec → dueAt = now).
- **Migration v3** (`PROGRESS_SCHEMA_VERSION = 3`) : `errorTags = {}` par défaut (v2 → v3 sans perte), assainissement des entrées. Testée.
- **Surfaçage** : chip de statut + « X erreurs à retravailler » dans Révisions ; chip de statut dans Profil.
- Voir **ADR-015**.

## LOT 10 — Toto/Bobo V2 (ce lot)
Registre d'états + fréquence contrôlée, sans régression, toutes validations vertes :
- **Registre d'états canonique** `CHARACTER_STATES` (source unique : expression, personnage par défaut, catégorie, intensité, ton) ; `STATE_TO_EXPRESSION` **dérivé** (plus de duplication) ; `mascotFor()`. Couvre les états du skill (welcome, observe, false-signal, review, premium, debate, level-up, streak…).
- **Intensité d'animation** pilotée par le registre (still/subtle/lively), toujours désactivée si reduced motion.
- **Gouverneur de fréquence** `frequency.ts` (pur, testé) : `mascotPresence` → full/compact/hidden ; discret dans listes denses / réglages / interactions graphiques. Appliqué dans Révisions (mascotte compacte).
- Nouveaux états câblés : `welcome` (onboarding), `false-signal` (labo), `review` (Révisions).
- Voir **ADR-016**.

## LOT 11 — Migration APP pilote (ce lot)
Pipeline de contenu + schéma + brouillons, sans régression, toutes validations vertes :
- **Cœur pur et testé** `src/content/importPipeline.ts` : hash de contenu, normalisation, classification (5 catégories), garde `hasPersonalData`, brouillon `needsReview` (origine + hash), déduplication.
- **Runner** `scripts/import-app/index.mjs` (`npm run import:app`) : réutilise le pipeline via l'exécution TS native de Node 22 (une seule source), **idempotent** (contenu inchangé → non réécrit).
- **Schéma** `schemas/concept.schema.json` ; `validate:content` valide aussi `content/drafts/concepts/`.
- **Pilote** : 18 concepts (5 catégories) importés en `needsReview`, tracés (sourcePath/hash/importedAt), **zéro donnée personnelle** ; l'app n'importe jamais ce contenu (build-time only, APP reste une source).
- **Revue humaine** requise avant publication. Voir **ADR-017**.

## LOT 12 — Glossaire enrichi (ce lot)
Recherche tolérante + catégories + fiches reliées, sans régression, toutes validations vertes :
- **Recherche pure, testée, insensible aux accents/casse** `src/data/glossarySearch.ts` : `normalizeSearch` (NFD + retrait des diacritiques) et `searchGlossary` classant par pertinence (début du terme > terme > anglais > résumé, départage alphabétique) après filtre de catégorie. Vérifié en pilotant Chromium : « volatilite » (sans accent) → « Volatilité » en tête.
- **Liens du modèle** : `GlossaryTerm` gagne `relatedSkillId?` / `related?`, maintenus dans une table séparée `GLOSSARY_LINKS` fusionnée à l'export `GLOSSARY_TERMS` (définitions lisibles, liens centralisés).
- **Fiche reliée à la pratique** : bouton « S'entraîner — {compétence} » → `/session/{skillId}` et carte « Termes reliés » (puces navigables terme↔terme), affichés uniquement si le lien existe (zéro bouton mort), accessibles.
- **Légende honnête** : « N termes sur M · le vocabulaire essentiel des marchés » (fin du « 1 111+ » trompeur) ; l'écran liste consomme `searchGlossary`.
- **Intégrité par test** : chaque `related` existe et n'est pas auto-référent ; chaque `relatedSkillId` pointe vers une compétence réelle (un lien cassé casse la CI).
- Catégories recolorées « Instrument Glass ». Voir **ADR-018**.

## LOT 13 — Gamification (ce lot)
Quêtes du jour rémunérées + jalons de série + réussites, sans régression, toutes validations vertes :
- **Registre d'activité du jour** (schéma **v4**) : `daily {date, sessions, correct, xp}` remis à zéro chaque jour ; migration non destructive (défauts sûrs + assainissement), aucune perte de progression.
- **Moteur pur et testé** `src/data/gamification.ts` : `buildDailyQuests` (3 quêtes stables adossées au registre réel), `claimQuest` (récompense en pièces, **idempotent** par jour), `streakInfo`/`applyStreakMilestones` (paliers 3/7/14/30/60/100, +15 🪙 une seule fois), `newlyEarnedBadges` (détection de badge obtenu).
- **Câblage** (`progressContext`) : chaque réponse nourrit le registre (XP réel + bonne réponse) ; chaque session est comptée et crédite les jalons franchis ; `claimQuest` exposé. Analytics ajoutés : `quest_completed`, `achievement_unlocked`.
- **UI honnête, zéro bouton mort** : l'accueil remplace les faux « Défis » par les vraies quêtes (progression + bouton **Réclamer +N 🪙** actif seulement si terminé) ; l'écran Réussites gagne une carte **Série** (jalon suivant + récompense). Aucune mécanique manipulatrice (pas de vie punitive, pas de casino, pas de pari).
- Vérifié en pilotant Chromium : réclamation d'une quête → pièces 20 → 25 et « Réclamé ✓ » ; carte Série « encore 3 jours jusqu'au jalon 7 · +15 🪙 ». Voir **ADR-019**.

## LOT 14 — Statistiques (ce lot)
Historique d'activité + tableau de bord, sans régression, toutes validations vertes :
- **Historique d'activité** (schéma **v5**) : `history: DailySnapshot[]` ; le basculement de jour (`rolled`) archive le registre écoulé (dédupliqué par date, borné à 60 jours). Migration non destructive (défauts + assainissement), aucune perte de progression.
- **Moteur pur et testé** `src/data/stats.ts` : `computeStats` agrège vue d'ensemble, maîtrise par compétence + répartition des statuts, erreurs récurrentes (agrégées et rattachées à la compétence), et série d'activité N jours (historique + jour courant, avec `windowXp`/`activeDays`/`peakXp`). Aucune donnée inventée.
- **Écran** `/statistiques` : vue d'ensemble, **graphique d'activité 7 jours** (barres en Views pures, sans dépendance ni animation, étiquetées pour lecteurs d'écran, aujourd'hui mis en avant), maîtrise par compétence, erreurs à retravailler → bouton **Réviser**. Accessible depuis le Profil (« Voir le détail 📊 »). Analytics `stats_viewed`.
- Vérifié en pilotant Chromium : vue d'ensemble (niv. 2, 160 XP, 5 j, 1/4, 98 XP/7 j), barres 7 jours (aujourd'hui en vert), statuts Maîtrisé/Fragile/En cours/Nouveau, erreurs par compétence + bouton Réviser. Voir **ADR-020**.

## LOT 15 — Monétisation (ce lot)
Offre gratuit/premium + paywall + entitlement simulé, sans régression, toutes validations vertes :
- **Modèle pur et testé** `src/data/premium.ts` : `PRICING` (Pass Fondateur 14,99 · Annuel 44,99 · Mensuel 7,99 CHF — hypothèses configurables), `PREMIUM_FEATURES` / `FREE_FEATURES`, `PremiumState {active, plan, since, demo}` avec `isPremium`/`activate`/`deactivate`/`migratePremium`. **`demo` toujours vrai** : activation simulée, jamais un achat réel, aucune donnée de paiement, aucun Stripe.
- **Persistance séparée** `premiumRepository` (clé `patternlab.premium.v1`) chargée/enregistrée par `progressContext` ; exposé via `premium`/`activatePremium`/`deactivatePremium`/`restorePremium`.
- **Paywall** `/premium` : premium vs gratuit, cartes d'offres sélectionnables (Pass Fondateur mis en avant), CTA **« Activer — {offre} (démo) »**, « Restaurer », « Plus tard », avertissement explicite « Simulation — aucun achat réel ». État « Tu es Premium » + « Désactiver (démo) » si actif. Zéro bouton mort.
- **Un gate réel, non punitif** : les **statistiques détaillées** deviennent premium, la **vue d'ensemble reste gratuite** ; le gate n'apparaît qu'à l'ouverture des stats (après interaction), jamais au démarrage. Le cœur d'apprentissage reste entièrement gratuit. Entrée Premium depuis le Profil.
- **Analytics** : `premium_gate_hit`, `paywall_viewed`, `subscription_started`, `subscription_restored`.
- Vérifié en pilotant Chromium : stats gratuites → gate → paywall (Pass Fondateur, avertissement simulation) → « Activer » → « Tu es Premium » → stats détaillées débloquées. Voir **ADR-021**.

## LOT 16 — Analytics étendus (ce lot)
Couche typée, indépendante du fournisseur, privacy-first, sans régression, toutes validations vertes :
- **Taxonomie complétée** `src/analytics/events.ts` : liste essentielle du skill (app_opened, daily_mission_*, interaction_*, hint_requested, false_signal_identified, mastery_changed, glossary_searched, concept_viewed, favorite_added, subscription_expired…). `EVENT_CATEGORIES` source unique (lifecycle/onboarding/learning/engagement/monetization) ; test d'exhaustivité.
- **Confidentialité pure et testée** `src/analytics/privacy.ts` : `sanitizeProps` retire les clés PII/financières (email, iban, card, stripe, balance, montant, compte, broker, position…), rédige les e-mails, borne chaînes (120) et nombre de propriétés (24). Appliquée à **chaque** évènement. `glossary_searched` n'émet que `queryLength`, jamais le texte.
- **Dispatcher indépendant du fournisseur** `src/analytics/analytics.ts` : pipeline consentement → assainissement → diffusion vers des puits enregistrables (`ConsoleSink` dev, `MemorySink` borné). Un puits qui échoue n'interrompt jamais l'app. Brancher un fournisseur = un puits de plus.
- **Consentement opt-out persistant** `consentRepository` (`patternlab.consent.v1`, true par défaut) appliqué **avant** toute émission ; bascule dans le Profil (carte Confidentialité, `role=switch`). Non réinitialisé par « Réinitialiser ma progression ».
- **Évènements câblés** : app_opened, glossary_searched (longueur seulement), concept_viewed, daily_mission_started, mastery_changed.
- Vérifié en pilotant Chromium (console dev) : `glossary_searched {queryLength: 10, …}` sans le texte brut ; consentement coupé → 0 évènement diffusé. Voir **ADR-022**.

## LOT 17 — Offline complet (ce lot)
Connectivité branchable + local-first assumé, sans régression, toutes validations vertes :
- **Connectivité branchable et testée** `src/lib/connectivity.ts` : `ConnectivityStore` (magasin observable pur, ne notifie que sur changement réel), `bindPlatformSource` (web `navigator.onLine` + événements ; natif supposé en ligne, NetInfo en drop-in sans changer les appelants), singleton + hook `useConnectivity()`. Remplace `useIsOnline` (supprimé) ; bandeau global migré.
- **Disponibilité hors-ligne garantie et visible** `src/data/offline.ts` : `offlineCapabilities()` (pur) résume le contenu embarqué (compétences/leçons/exercices/glossaire/badges) + `contentReady`/`progressLocal`. Testé (tout le parcours dispo sans réseau). Carte « Mode hors-ligne » dans le Profil avec statut de connexion en direct.
- **Un vrai garde-fou réseau** : sur le paywall, « Activer »/« Restaurer » désactivés hors-ligne avec raison explicite (« Connexion requise pour finaliser un achat ») — modélise le futur achat réel. Le reste de l'app reste pleinement utilisable hors-ligne (zéro bouton mort).
- Vérifié en pilotant Chromium (offline réel via `setOffline`) : bandeau hors-ligne apparaît/disparaît, statut Profil bascule En ligne/Hors ligne, CTA d'achat gaté hors-ligne, navigation + apprentissage OK sans réseau. Voir **ADR-023**.

## LOT 18 — Accessibilité complète (ce lot)
Contraste verrouillé + titres + focus clavier + cibles tactiles, sans régression, toutes validations vertes :
- **Contraste AA exhaustif** (`contrast.test.ts`) : chaque couleur de texte neutre ≥ 4.5 sur **toutes** les surfaces (fonds profonds inclus), chaque accent-texte (primary/technical/warning/reward/bullish/bearish/neutral/primaryBright) ≥ 4.5 sur les surfaces de carte. Toutes les paires réellement utilisées passent — aucun token changé ; toute dérive future casse la CI.
- **Jetons/aides a11y purs et testés** `src/design-system/a11y.ts` : `minTouchTarget=44`, `maxFontScale=1.8`, `hitSlopFor`, `decorative`, `isHeadingVariant`.
- **Titres annoncés** : le primitif `Text` donne `role=header` au seul `h1` (un titre de navigation par écran) ; `h2`/`display` (grands nombres, emojis, icônes) volontairement non-titres pour ne pas polluer la navigation.
- **Polices dynamiques** honorées via `maxFontSizeMultiplier` (1.8, surchargeable). **Cibles tactiles** : `hitSlopFor` sur les petites puces (catégories glossaire, termes reliés). **Clavier web** : anneau `:focus-visible` (2 px) + `prefers-reduced-motion` global. **Décor masqué** : `MascotFigure decorative` (mission/réussites/premium retirés de l'arbre AT).
- Vérifié en pilotant Chromium : exactement **1 titre par écran** (h1), boutons exposés `role=button`, focus clavier avec anneau visible (2 px solid), mascotte décorative masquée. Voir **ADR-024**.

## LOT 19 — Release readiness (ce lot)
Config de publication + légal in-app + porte `release:check`, sans régression, toutes validations vertes :
- **Config `app.json`** : nom `PatternLab`, `userInterfaceStyle: dark`, couleurs de marque (splash/adaptive/`backgroundColor`/`primaryColor`), identifiants reverse-DNS `com.patternlab.app` (iOS/Android), `supportsTablet`, compliance chiffrement iOS, `description`. Assets vérifiés présents.
- **Source unique** `src/lib/appInfo.ts` (sans import, importable app + Node) : `APP_INFO`, `PRIVACY_SUMMARY`, `LEGAL_LINES` ; `config.ts` en dérive.
- **Écran légal `/a-propos`** : version, disclaimer, résumé de confidentialité, mentions légales ; lié depuis le Profil (remplace le bouton « Réglages » mort). Politique complète `docs/PRIVACY.md`.
- **Porte de publication** : logique pure testée `src/release/releaseCheck.ts` (13 invariants) + runner `scripts/release-check.mjs` (`npm run release:check`, exécution TS native Node 22), ajouté à la porte de validation. Checklist honnête `docs/RELEASE_CHECKLIST.md` (automatisé vs action humaine requise).
- Vérifié : `release:check` 13/13 ; écran À propos rendu en pilotant Chromium (version, disclaimer, confidentialité, mentions légales). Voir **ADR-025**.

## Partiel
- Gamification : quêtes du jour + jalons de série + détection de badge obtenu en place. La **célébration visuelle** (toast/modale à l'obtention) est encore réduite à l'analytics `achievement_unlocked` ; l'écran Réussites reste le lieu de constat. Quêtes hebdomadaires et coffres non couverts (base extensible).
- Lottie : dépendance + point d'intégration prêts ; rendu figures/SVG en attendant (ADR-005).
- Import APP : pilote de 18 concepts curatés ; extraction de l'export APP réel (`02_DATA_EDUCATIVES`) + montée vers 50+ = alimenter le dossier `source/` (pipeline inchangé). Le registre V2 prépare la bascule (renderer remplaçable sans toucher aux états).
- Adaptation intra-session (re-séquencement des exercices ratés) : à affiner ; la base errorTags + révision rapprochée est en place.
- Labo : un scénario (support) ; zoom/pan, zone rectangulaire, volume et replay à venir (base `interactive.ts` extensible).
- Formats restants (drag_drop, draw_level, place_invalidation, reconstruct_ohlc, candle_replay, timed_challenge, compare_setups) : à brancher progressivement (garde-fou actif).
- Flashcards rendues dans la leçon ; leur surfaçage en révision autonome viendra avec un lot ultérieur.
- Parcours : un seul monde/module pour l'instant ; l'ajout de mondes ne demandera pas de réécrire la carte (contenu piloté).
- Détection réseau : abstraction branchable en place (web opérationnel, natif supposé en ligne). La source native `@react-native-community/netinfo` reste à brancher (drop-in, sans changer les appelants). File de synchronisation vers un backend : non nécessaire (local-first, aucun backend) — l'entitlement/achat réel restera le seul point réseau.
- Laboratoire : aperçu lisible ; tracé/comparaison/replay interactifs au Lot 8.
- Exercices : 9 formats sur 12 branchés (restent : drag_drop, draw_level, timed — + variantes replay/OHLC).
- Contenu : ~8 leçons / ~20 exercices — à étoffer vers 30-40 leçons / 100-150 exercices.
- `bobo-warning` : figure enregistrée dans `IMAGES` mais pas encore affichée (conservée volontairement).

## Cassé
- Aucun connu (voir sorties lint / typecheck / test / validate:content / build web).

## Absent (par design — hors périmètre agent, autorisation requise)
- Feuille de route `patternlab-product-growth` **complète (Lots 0 → 19)**.
- Publication réelle : comptes Apple/Google, EAS build/soumission, magasin d'achat réel,
  fournisseur analytics/crash externe, source native NetInfo — voir `docs/RELEASE_CHECKLIST.md`
  (« action humaine requise »). Rien de tout cela n'est réalisé sans accord explicite.
- Builds device iOS/Android (EAS + comptes Apple/Google).

## Prochaine priorité
**Feuille de route croissance produit terminée (Lots 0 → 19).** Suites possibles, sur accord :
- **Publication** : dérouler `docs/RELEASE_CHECKLIST.md` (« action humaine requise ») — EAS,
  comptes stores, captures, soumission.
- **Contenu** : brancher les 18 concepts importés (après revue humaine) et étoffer vers
  30-40 leçons / 100-150 exercices ; nouveaux mondes.
- **Finitions** : célébration visuelle des réussites (toast/modale), historique 30 jours,
  écran « journal analytics » (dev), sémantique de section (`h2`) pour l'a11y, branchements
  natifs réels (NetInfo, analytics, achats) — tous conditionnés à autorisation.

## Risques
- Conteneur éphémère : commit local présent ; pousser après accord pour ne rien perdre.
- Art Lottie à fournir. Builds device non réalisables dans cet environnement.
