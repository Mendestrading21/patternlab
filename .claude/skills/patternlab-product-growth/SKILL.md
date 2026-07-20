---
name: patternlab-product-growth
description: Pilote la refonte produit, UX, apprentissage, graphiques interactifs, contenu, gamification, monétisation, qualité et croissance de PatternLab.
---

# PatternLab — Product Growth Skill

## Mission

Faire évoluer l’application existante `Mendestrading21/patternlab` en produit mobile éducatif premium, immersif, interactif, accessible et commercialisable, sans créer une application parallèle.

Le dépôt `Mendestrading21/APP` est une source éditoriale pour les contenus historiques WMB. Il ne doit jamais devenir une dépendance runtime directe.

Promesse centrale :

> Apprends à lire un graphique en cinq minutes par jour.

## Positionnement absolu

PatternLab est une application éducative. Aucun contenu ne constitue un conseil financier. Le trading comporte un risque de perte.

PatternLab n’est jamais :

- un courtier ;
- une application de signaux ;
- un terminal de trading ;
- un portefeuille réel ;
- un casino ;
- un réseau social spéculatif ;
- une promesse de gains.

Utiliser lorsque pertinent :

- setup haussier ;
- setup baissier ;
- entrée théorique ;
- zone de confirmation ;
- invalidation ;
- objectif pédagogique ;
- faux signal ;
- scénario éducatif.

Éviter :

- BUY ;
- SELL ;
- signal sûr ;
- profit garanti ;
- trade gagnant ;
- liberté financière garantie.

## Identité

- Marque : **PatternLab**.
- Toto : taureau vert, enthousiaste et curieux. Il formule une hypothèse haussière sans promettre une hausse.
- Bobo : ours rouge, prudent et analytique. Il recherche le risque, le faux signal et l’invalidation sans promettre une baisse.
- Ton : français naturel, adulte, clair, sérieux, encourageant, jamais infantilisant.
- Public : débutants, étudiants, jeunes actifs, investisseurs particuliers et intermédiaires souhaitant réviser.

## Règles de travail

1. Auditer l’état réel du dépôt avant toute décision.
2. Comparer code, derniers commits, tests et documentation ; le code exécuté fait foi.
3. Préserver les changements utilisateur.
4. Ne jamais effectuer de reset destructif ni réécrire l’historique.
5. Travailler par lots petits, testables, documentés et réversibles.
6. Tout bouton visible doit fonctionner, être clairement verrouillé ou expliquer son indisponibilité.
7. Ne jamais produire uniquement une galerie de maquettes.
8. Ne pas ajouter de backend, service ou dépendance sans besoin prouvé.
9. Les moteurs pédagogiques et graphiques restent indépendants du contenu.
10. Tout contenu importé ou généré automatiquement reste `draft` ou `needsReview` jusqu’à validation humaine.
11. Ne jamais importer comptes, emails, mots de passe, secrets, Stripe, abonnements ou données personnelles depuis WMB/APP.
12. Ne jamais connecter un courtier ni exécuter une transaction.
13. Ne jamais pousser, publier ou ouvrir une PR sans demande explicite.
14. Respecter reduced motion, contraste AA, lecteurs d’écran, clavier web et alternatives aux gestes.
15. Une compétence ne devient pas maîtrisée après une seule bonne réponse.

## Architecture produit cible

```text
LearningPath
  World
    Module
      Skill
        Concept
          Lesson
            Step
            Interaction
            Exercise
            Feedback
            Flashcard
            Review
            Assessment
```

Séparer strictement :

- XP = activité ;
- mastery = compétence réelle ;
- confidence = stabilité ;
- reviewDueAt = prochaine révision ;
- streak = régularité ;
- coins = récompenses internes ;
- errorTags = erreurs récurrentes.

## Boucle quotidienne

1. Observation d’un graphique.
2. Hypothèse ou question.
3. Explication courte.
4. Manipulation réelle.
5. Exercices adaptatifs.
6. Faux signal ou contre-exemple.
7. Résultat de maîtrise.
8. XP et récompense.
9. Révision planifiée.

Durée cible : trois à sept minutes, cinq minutes par défaut.

## Principes de marché à reprendre sans copier

- Duolingo : prochaine action claire, parcours, série, quêtes.
- Brilliant : apprendre en manipulant.
- Quizlet : adaptation aux erreurs.
- Mimo : micro-interactions et feedback immédiat.
- Investmate/Zogo : micro-apprentissage financier.
- TradingView : lisibilité des graphiques.
- Bloomberg : crédibilité et densité contrôlée.
- Apple : qualité tactile et clarté.

Refuser : copie d’écran, vies punitives, gamification manipulatrice, casino visuel, classement par profits fictifs et promesses de performance.

## Navigation recommandée

1. Accueil
2. Parcours
3. Laboratoire
4. Révisions
5. Profil

L’accueil doit présenter une seule action principale : la mission du jour.

## Onboarding cible

1. Promesse.
2. Présentation brève de Toto et Bobo.
3. Objectif principal.
4. Niveau déclaré.
5. Temps quotidien : 3, 5 ou 10 minutes.
6. Sujets d’intérêt.
7. Diagnostic facultatif.
8. Parcours recommandé.
9. Première interaction avant compte et paywall.

Stocker un modèle versionné : objectif, niveau, temps, sujets, diagnostic, compétence de départ, reprise et schemaVersion.

## Direction visuelle

Identité **Instrument Glass** :

- 70 % surfaces mates graphite/bleu nuit ;
- 20 % verre sombre contrôlé ;
- 10 % couleur fonctionnelle.

Palette indicative :

```text
backgroundDeep       #080C12
background           #0B1119
surface              #111A24
surfaceElevated      #172331
surfaceInteractive   #1C2A39
borderSubtle         #253343
borderStrong         #364A60
textPrimary          #F4F7FA
textSecondary        #AAB7C6
textMuted            #758395
bullish              #26C281
bearish              #F05A67
technical            #42B7E8
warning              #F3B94E
reward               #E8B94F
neutral              #8292A6
```

Séparer `bullish/bearish` de `feedbackCorrect/feedbackIncorrect`.

Règles :

- une priorité principale par écran ;
- éviter l’empilement interminable de cartes ;
- éviter glow et transparence excessifs ;
- réduire les emojis génériques ;
- laisser plus d’espace aux graphiques qu’aux décorations ;
- prévoir loading, empty, error, offline, locked et disabled.

## Toto et Bobo

Toto propose une hypothèse. Bobo demande ce qui manque ou invalide le scénario. L’utilisateur observe ou manipule. Le feedback explique les conditions des deux scénarios.

États : idle, welcome, explain, observe, think, debate, celebrate, encourage, confused, warning, wrongAnswer, falseSignal, levelUp, streak, review, rest, loading, offline, premium.

Ils sont utiles dans onboarding, explication, débat, erreur, faux signal, progression et réussite. Ils doivent être discrets dans réglages, listes denses et interactions graphiques précises.

Animations : courtes, contextuelles, non bloquantes, interruptibles, désactivables et compatibles reduced motion.

## Leçon V2

Une leçon peut contenir :

1. hook visuel ;
2. objectif pédagogique ;
3. observation ;
4. hypothèse ;
5. explication ;
6. exemple ;
7. interaction ;
8. feedback ;
9. erreur fréquente ;
10. faux signal ou limite ;
11. résumé ;
12. flashcard ;
13. exercice ;
14. prochaine révision ;
15. sources.

Types de steps : intro, explain, observe, compare, example, chart, interaction, question, debate, warning, commonMistake, falseSignal, summary, flashcard, checkpoint.

Toujours expliquer pourquoi la réponse est correcte, pourquoi les alternatives sont fausses, la règle à retenir et quand elle peut échouer.

## Exercices

Préserver :

- mcq ;
- true_false ;
- numeric ;
- order ;
- match ;
- find_error ;
- identify_pattern.

Ajouter progressivement :

- drag_drop ;
- select_chart_zone ;
- draw_level ;
- place_invalidation ;
- reconstruct_ohlc ;
- conditional_scenario ;
- compare_setups ;
- identify_false_signal ;
- candle_replay ;
- timed_challenge.

Chaque format possède : schéma, validation, renderer, grader pur, feedback, analytics, accessibilité, tests, fallback aux gestes et reduced motion.

## Laboratoire graphique

Fonctionnalités MVP :

- chandeliers déterministes ;
- zoom et déplacement contrôlés ;
- sélection d’une bougie ou zone ;
- ligne horizontale ;
- zone rectangulaire ;
- modification/suppression ;
- volume ;
- replay ;
- scénario éducatif ;
- correction visuelle ;
- reset.

Scénarios initiaux : tendance, support, résistance, double creux, cassure vs faux signal, invalidation et mèche de rejet.

Évaluer `react-native-svg`, React Native Skia et Canvas avec un prototype. Comparer performance, plateformes, gestes, accessibilité, export, tests et maintenance. Documenter le choix dans un ADR avant remplacement du moteur.

## Maîtrise

Statuts : new, learning, fragile, reviewing, strong, mastered.

La maîtrise dépend de plusieurs réponses, sessions, formats, difficultés et révisions.

Après une erreur : créer un errorTag, afficher une explication ciblée, adapter le prochain exercice et reprogrammer la révision.

Toute évolution de progression requiert schemaVersion, migration et tests.

## Fabrique de contenu APP

Pipeline :

```text
inventaire
→ extraction
→ normalisation
→ déduplication
→ classification
→ micro-concepts
→ brouillons
→ validation des schémas
→ revue humaine
→ publication versionnée
```

Métadonnées recommandées : id, slug, title, category, worldId, moduleId, skillId, difficulty, prerequisites, learningObjective, definition, visualExplanation, bullishScenario, bearishScenario, confirmationZone, invalidation, falseSignal, commonMistake, exercises, flashcards, relatedConceptIds, sources, sourcePath, sourceHash, version, status, reviewedBy, reviewedAt, locale, disclaimer.

Statuts : imported, draft, needsReview, approved, published, archived.

Première migration : 10 chandeliers, 10 tendance/support/résistance, 10 figures, 10 risk management, 10 psychologie. Ne jamais migrer 1 000+ éléments d’un coup.

## Monétisation

Gratuit : onboarding, diagnostic, premier monde, mission limitée, progression, série, glossaire de départ, quelques révisions et laboratoires.

Premium : tous les mondes, laboratoires complets, exercices avancés, révisions illimitées, statistiques, offline étendu, synchronisation future et nouveaux parcours.

Hypothèses configurables :

- Pass Fondateur : 14,99 CHF/€ ;
- mensuel : 7,99 CHF/€ ;
- annuel : 39,99 ou 44,99 CHF/€.

Afficher le paywall seulement après une première interaction et une démonstration de valeur. Aucun achat réel sans autorisation.

## Analytics

Couche typée et indépendante du fournisseur.

Événements essentiels : app_opened, onboarding_started/completed, goal_selected, diagnostic_completed, path_generated, daily_mission_started/completed, lesson_started/completed, interaction_started/completed, exercise_answered, hint_requested, feedback_viewed, false_signal_identified, review_completed, mastery_changed, streak_updated, path_node_unlocked, checkpoint_completed, achievement_unlocked, lab_started/completed, glossary_searched, concept_viewed, favorite_added, paywall_viewed, premium_gate_hit, subscription_started/restored/expired, app_error.

Minimiser les données et ne jamais envoyer d’informations financières personnelles.

## Roadmap

### Lot 0 — Fiabilité
XP, double attribution, progression, migrations, documentation et assets.

### Lot 1 — Design System V2
Palette, tokens, composants, états et accessibilité.

### Lot 2 — Navigation
Accueil, Parcours, Laboratoire, Révisions, Profil, routes et PWA.

### Lot 3 — Onboarding personnalisé
Objectif, niveau, temps, sujets, diagnostic et première interaction.

### Lot 4 — Accueil mission du jour
CTA principal, révision due, progression compacte.

### Lot 5 — Parcours immersif
Mondes, carte, nœuds, checkpoints et révisions.

### Lot 6 — Leçons V2
Steps, interactions, faux signaux et flashcards.

### Lot 7 — Exercices avancés
Registry, zones, tracés, OHLC, scénarios et replay.

### Lot 8 — Laboratoire
Benchmark, ADR, prototype et premier scénario.

### Lot 9 — Maîtrise adaptative
Mastery, confidence, errorTags et migrations.

### Lot 10 — Toto/Bobo V2
Registre d’assets, états, fréquence et reduced motion.

### Lot 11 — Migration APP pilote
Pipeline, schémas, 50 concepts et revue humaine.

### Lots 12 à 19
Glossaire, gamification, statistiques, monétisation, analytics, offline, accessibilité complète et release readiness.

Exécuter un seul lot majeur par session. Chaque lot doit être visible, testé, documenté et réversible.

## Audit sans modification

Lorsque l’utilisateur demande un audit ou un plan :

1. vérifier Git, branche, changements et derniers commits ;
2. inspecter README, CLAUDE.md, package.json, app.json, PROJECT_STATUS, ADR, routes, design system, personnages, moteurs, données, analytics, contenu, schémas, scripts, assets, tests et workflows ;
3. comparer code et documentation ;
4. lancer les validations disponibles ;
5. distinguer fonctionnel, partiel, cassé, absent et obsolète ;
6. produire un plan avec fichiers exacts, critères, tests, risques et rollback ;
7. ne modifier aucun fichier et attendre la validation.

## Exécution d’un lot

1. Charger ce skill.
2. Sécuriser le dépôt et préserver le travail existant.
3. Auditer la zone.
4. Implémenter une tranche verticale complète.
5. Ajouter types, logique pure, migrations, composants, routes, analytics, accessibilité, tests et documentation.
6. Exécuter :

```bash
npm run lint
npm run typecheck
npm test -- --runInBand
npm run validate:content
npm run build:web
```

7. Vérifier réellement mobile/web, routes, CTA, console, états et reduced motion.
8. Créer un commit local cohérent si demandé.
9. Ne jamais pousser ni ouvrir une PR sans autorisation.
10. Arrêter après le lot demandé.

## Rapport de lot

```text
LOT TERMINÉ : [nom]

Problème corrigé :
- ...

Comportement livré :
- ...

Fichiers modifiés :
- ...

Validations :
- lint :
- typecheck :
- tests :
- contenu :
- build web :
- rendu mobile/web :
- accessibilité :

Commit local :
- hash
- message

Limites restantes :
- ...

Prochaine priorité :
- ...
```

## Définition de qualité

Un changement est acceptable lorsqu’il est :

- utile à l’apprentissage ;
- cohérent avec la promesse ;
- réellement interactif lorsque nécessaire ;
- extensible à 500+ concepts ;
- accessible ;
- testé ;
- documenté ;
- sans bouton mort ;
- sans donnée inventée ;
- sans conseil financier ;
- réversible.
