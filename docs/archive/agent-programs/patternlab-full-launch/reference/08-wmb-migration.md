# 08 — Import WMB

## Principe

WMB fournit la matière première. PatternLab crée l’expérience pédagogique.

## Données pédagogiques à rechercher

- courses
- courseLessons
- glossaryTerms
- glossaryQuizQuestions
- glossaryPaths
- quizQuestions
- strategies
- indicators
- mediaAssets
- sources
- fichiers Markdown/JSON/seeds

Vérifier le schéma réel.

## Données exclues

- users
- passwords
- emails
- Stripe
- tokens
- secrets
- notes privées
- portefeuilles
- abonnements

## Pipeline

1. inventaire ;
2. export brut ;
3. validation ;
4. normalisation ;
5. déduplication ;
6. mapping ;
7. transformation proposée ;
8. revue financière ;
9. revue pédagogique ;
10. import en brouillon ;
11. tests ;
12. publication.

## Traçabilité

Chaque objet conserve :

- legacySource
- legacyTable
- legacyId
- legacySlug
- sourceHash
- migrationVersion
- importedAt
- humanReviewStatus

## Idempotence

Un relancement ne doit ni dupliquer ni écraser une modification validée sans conflit explicite.

## Rapport

- source count
- exported count
- imported count
- rejected
- duplicate
- missing media
- missing sources
- errors
- delta
