# Architecture pédagogique — cible 500+ concepts

## Principe

Les 500+ notions ne doivent pas être une liste plate. Chaque concept appartient à un domaine, un monde, un module et une compétence, avec prérequis et révisions.

## Unité canonique d’un concept

Champs minimum :

- id et slug stables ;
- titre, alias et résumé simple ;
- domaine, catégorie, difficulté et temps estimé ;
- prérequis et concepts suivants ;
- objectif pédagogique observable ;
- définition, mécanisme, contexte ;
- exemple, contre-exemple et faux signal ;
- zone de confirmation et invalidation ;
- type visuel + dataset déterministe ;
- script Toto/Bobo ;
- exercices et misconception tags ;
- statut éditorial draft/needsReview/published ;
- sources et date de revue ;
- avertissement éducatif.

## Distribution cible

| Domaine | Cible indicative |
|---|---:|
| Fondations et mécanique | 45 |
| Chandeliers | 65 |
| Figures chartistes | 65 |
| Price action et structure | 70 |
| Indicateurs | 55 |
| SMC et liquidité | 55 |
| Wyckoff | 35 |
| Volume et order flow | 35 |
| Risk management | 35 |
| Psychologie et journal | 25 |
| Produits et macro | 30 |

Les nombres sont une cible produit, jamais des compteurs de dépôt. Les compteurs réels restent dérivés de repoTruth.

## Niveaux

1. Voir : reconnaître les éléments.
2. Lire : décrire ce qui se passe.
3. Comprendre : expliquer la mécanique.
4. Comparer : distinguer exemple et faux signal.
5. Construire : formuler un scénario éducatif.
6. Évaluer : choisir confirmation, invalidation et risque.

## Formats d’apprentissage

Leçon guidée, identification visuelle, choix multiple, classement, vrai/faux justifié, zone à pointer, scénario à compléter, paramètres à manipuler, flashcard, examen aveugle, reformulation.

Ne déclarer un format que si grader, renderer, accessibilité et tests existent.

## Pipeline éditorial

Source revue → brouillon needsReview → validation du schéma → revue financière/pédagogique → intégration runtime → tests → publication.

Aucun contenu généré n’est publié automatiquement. Les concepts proches doivent partager des primitives visuelles et non dupliquer des textes incohérents.

## Qualité

Un concept est terminé lorsque :

- il est exact et compréhensible ;
- son visuel est original et lisible ;
- exemple et contre-exemple existent ;
- au moins un exercice mesure l’objectif ;
- une erreur produit une correction ciblée ;
- les liens de prérequis se résolvent ;
- le vocabulaire conforme et l’avertissement sont présents ;
- TypeScript, tests, contenu, build et accessibilité concernés passent.
