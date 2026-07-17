# 04 — Fabrique de contenu et migration APP

## Source

Le dépôt `Mendestrading21/APP` contient la matière pédagogique historique WMB : glossaire, indicateurs, figures, guides, pages et données.

Il s'agit d'une source éditoriale, jamais d'une dépendance runtime directe.

Dossiers à inventorier selon la tâche :

```text
01_PAGES_EDUCATIVES/
02_DATA_EDUCATIVES/
03_COMPOSANTS_EDUCATIFS/
04_SEEDS_SCRIPTS/
06_SCHEMA_DB/
07_SERVER_ROUTERS/
10_SHARED_CONFIG/
```

## Interdictions d'import

Ne jamais importer :

- comptes utilisateurs ;
- emails ;
- mots de passe ;
- clés ou tokens ;
- Stripe ou abonnements ;
- coordonnées clients ;
- données personnelles ;
- notes privées ;
- secrets d'environnement.

## Pipeline

```text
inventaire
→ extraction
→ normalisation
→ déduplication
→ classification
→ découpage en micro-concepts
→ génération de brouillons
→ validation des schémas
→ revue humaine
→ publication versionnée
```

Le pipeline doit être idempotent, traçable et produire un rapport.

## Modèle de concept

Métadonnées recommandées :

- id ;
- slug ;
- title ;
- shortTitle ;
- category ;
- worldId ;
- moduleId ;
- skillId ;
- difficulty ;
- prerequisites ;
- learningObjective ;
- definition ;
- visualExplanation ;
- bullishScenario ;
- bearishScenario ;
- confirmationZone ;
- invalidation ;
- falseSignal ;
- commonMistake ;
- exercises ;
- flashcards ;
- relatedConceptIds ;
- sources ;
- sourcePath ;
- sourceHash ;
- version ;
- status ;
- reviewedBy ;
- reviewedAt ;
- locale ;
- disclaimer.

Statuts : imported, draft, needsReview, approved, published, archived.

Aucun contenu généré ou transformé automatiquement ne passe directement à `published`.

## Qualité éditoriale

Chaque concept doit expliquer, selon pertinence :

- définition simple ;
- objectif pédagogique ;
- prérequis ;
- représentation visuelle ;
- comment le reconnaître ;
- setup haussier ;
- setup baissier ;
- zone de confirmation ;
- invalidation ;
- faux signal ;
- erreur fréquente ;
- scénario éducatif ;
- concepts liés ;
- sources ;
- disclaimer.

Une fiche ne doit jamais présenter une figure comme une certitude.

## Première migration

Ne pas migrer 1 000+ éléments en une opération.

Lot pilote recommandé :

- 10 concepts de chandeliers ;
- 10 concepts tendance/support/résistance ;
- 10 figures chartistes ;
- 10 concepts de risk management ;
- 10 concepts de psychologie.

Pour chaque lot :

1. inventaire ;
2. mapping source → modèle cible ;
3. normalisation ;
4. déduplication ;
5. création en brouillon ;
6. validation des schémas ;
7. génération d'exercices en brouillon ;
8. rapport ;
9. revue humaine ;
10. publication progressive.

## 500+ concepts

La plateforme doit pouvoir accueillir 500+ concepts, mais l'utilisateur ne doit jamais voir une masse non structurée.

Organiser par :

- monde ;
- module ;
- compétence ;
- niveau ;
- prérequis ;
- relations ;
- maîtrise ;
- révision due ;
- favori ;
- recherche.

Le catalogue est une profondeur ; le parcours reste la porte d'entrée principale.

## Glossaire et fiches

Fonctionnalités cibles :

- recherche ;
- filtres ;
- favoris ;
- récemment consultés ;
- concepts liés ;
- accès depuis leçons et corrections ;
- visuel ;
- exemple ;
- faux signal ;
- erreur fréquente ;
- flashcard ;
- mini-quiz ;
- sources.

## Validation automatisée

Contrôler au minimum :

- IDs et slugs uniques ;
- références valides ;
- statut autorisé ;
- source présente ;
- disclaimer ;
- relation vers monde/module/skill ;
- absence de vocabulaire interdit ;
- champs obligatoires selon le type ;
- hash source ;
- version ;
- locale.

## Frontière éditoriale WMB

WMB conserve un glossaire public et des contenus éditoriaux pour le SEO et l'acquisition.

PatternLab transforme les notions sélectionnées en expériences interactives avec progression, exercices, graphiques et révisions.
