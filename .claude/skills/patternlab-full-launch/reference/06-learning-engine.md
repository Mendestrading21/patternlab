# 06 — Moteur d’apprentissage

## Hiérarchie

```text
LearningPath
  World
    Module
      Skill
        Lesson
          Step
          Exercise
          Review
```

## Leçon

Une leçon contient :

- objectif ;
- prérequis ;
- explication courte ;
- exemple ;
- interaction ;
- feedback ;
- erreur fréquente ;
- résumé ;
- révision planifiée ;
- sources.

## Maîtrise

Séparer :

- XP : activité ;
- mastery : compétence ;
- confidence : stabilité ;
- reviewDueAt : prochaine révision.

## Répétition espacée

Implémenter une logique versionnée et testée.

Ne pas présenter une compétence comme maîtrisée après une seule bonne réponse.

## Feedback

Toujours expliquer :

- pourquoi la réponse est correcte ;
- pourquoi les alternatives sont fausses ;
- quelle règle retenir ;
- dans quel contexte la règle peut échouer.

## Analytics

Événements minimums :

- onboarding_started/completed
- lesson_started/completed
- exercise_answered
- answer_changed
- feedback_viewed
- review_completed
- streak_updated
- path_node_unlocked
- paywall_viewed
- subscription_started
- app_error
