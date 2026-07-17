# 03 — Moteur pédagogique, exercices et laboratoire

## Hiérarchie

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

Le moteur reste indépendant du contenu. Ajouter un concept ou un monde ne doit pas imposer de réécrire les écrans ou graders.

## Leçon V2

Une leçon peut contenir :

1. hook visuel ;
2. objectif pédagogique ;
3. observation ;
4. hypothèse ;
5. explication courte ;
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

Types de steps recommandés : intro, explain, observe, compare, example, chart, interaction, question, debate, warning, commonMistake, falseSignal, summary, flashcard et checkpoint.

Éviter les longs paragraphes. Alterner lecture courte, visuel, geste, réponse et feedback.

## Feedback

Toujours expliquer :

- pourquoi la réponse est correcte ;
- pourquoi les alternatives sont fausses ;
- quelle règle retenir ;
- dans quel contexte la règle peut échouer ;
- quelle observation aurait invalidé le scénario.

Une mauvaise réponse doit influencer la suite de la session : tag d'erreur, explication ciblée, difficulté ajustée et révision reprogrammée.

## Maîtrise

Séparer :

- XP : activité ;
- mastery : niveau de compétence ;
- confidence : stabilité ;
- reviewDueAt : date de révision ;
- attempts : historique ;
- errorTags : erreurs récurrentes.

Statuts : new, learning, fragile, reviewing, strong, mastered.

La maîtrise dépend de plusieurs réponses, sessions, formats, difficultés et révisions. Une seule bonne réponse ne suffit jamais.

Toute évolution du modèle de progression requiert : schemaVersion, migration, tests et compatibilité avec les états existants.

## Formats d'exercices

Préserver les formats existants :

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

Chaque format possède :

- schéma de données ;
- validateur de contenu ;
- renderer ;
- grader pur ;
- feedback ;
- analytics ;
- accessibilité ;
- tests unitaires ;
- état initial, réponse, validation et correction ;
- fallback si le geste n'est pas disponible ;
- comportement reduced motion.

Ne placer aucune logique métier importante directement dans un écran.

## Interactions prioritaires

- reconstruire une bougie depuis OHLC ;
- sélectionner corps et mèches ;
- tracer support ou résistance ;
- déplacer une invalidation ;
- sélectionner une zone de confirmation ;
- comparer deux scénarios ;
- repérer une cassure prématurée ;
- identifier un faux signal ;
- corriger un scénario éducatif ;
- replay bougie par bougie.

## Laboratoire interactif

Fonctionnalités MVP :

- chandeliers déterministes ;
- zoom et déplacement contrôlés ;
- sélection d'une bougie ;
- sélection d'une zone ;
- ligne horizontale ;
- zone rectangulaire ;
- modification et suppression d'annotations ;
- volume ;
- replay ;
- scénario éducatif ;
- correction visuelle ;
- reset.

Scénarios initiaux :

- identifier une tendance ;
- tracer un support ;
- tracer une résistance ;
- reconnaître un double creux ;
- distinguer cassure et faux signal ;
- placer une invalidation ;
- observer une mèche de rejet.

## Choix technologique graphique

Évaluer au minimum :

- react-native-svg ;
- React Native Skia ;
- solution Canvas compatible web.

Comparer avec un prototype isolé :

- fluidité ;
- compatibilité iOS/Android/web ;
- gestes ;
- accessibilité ;
- qualité ;
- export ;
- testabilité ;
- maintenance ;
- taille et complexité.

Documenter la décision dans un ADR. Ne remplacer le moteur existant qu'après benchmark.

## Accessibilité graphique

Chaque graphique fournit :

- titre ;
- description ;
- résumé des données ;
- instructions ;
- labels des éléments sélectionnables ;
- alternative par liste ou choix lorsque le geste précis est impossible ;
- état compatible lecteur d'écran et clavier web.

## Analytics pédagogiques

Événements minimums : lesson_started, lesson_step_viewed, interaction_started, interaction_completed, exercise_viewed, exercise_answered, answer_changed, hint_requested, feedback_viewed, false_signal_identified, lesson_completed, review_scheduled, review_started, review_completed, mastery_changed et checkpoint_completed.
