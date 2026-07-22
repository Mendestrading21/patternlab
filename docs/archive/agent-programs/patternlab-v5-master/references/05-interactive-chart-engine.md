# 05 — Graphiques interactifs pédagogiques

## Fonctions MVP

- chandeliers OHLC ;
- volume ;
- zoom et déplacement contrôlés ;
- sélection d’une bougie ;
- sélection d’une zone ;
- ligne horizontale ;
- zone rectangulaire ;
- ligne de tendance ;
- annotations ;
- modification et suppression ;
- replay bougie par bougie ;
- correction visuelle ;
- reset ;
- résumé accessible.

## Cas d’usage

- reconnaître une bougie ou une figure ;
- tracer support/résistance ;
- placer une invalidation ;
- sélectionner une zone de confirmation ;
- distinguer cassure et faux signal ;
- reconstruire OHLC ;
- comparer deux scénarios ;
- observer volume et participation.

## Choix technique

Évaluer dans un prototype isolé :

- `react-native-svg` ;
- React Native Skia ;
- Canvas web ;
- éventuelle bibliothèque Expo compatible et maintenable.

Comparer fluidité, plateformes, gestes, accessibilité, testabilité, taille, maintenance et fallback. Documenter dans `docs/ADR-006-interactive-chart-engine.md`.

## Datasets

- synthétiques et déterministes ;
- seed explicite ;
- versionnés ;
- aucune donnée temps réel nécessaire ;
- objectif, réponse attendue et tolérance enregistrés ;
- pas de symbole réel obligatoire.

## Accessibilité

Titre, résumé, instructions, OHLC disponibles, navigation clavier, alternative aux gestes et absence d’information transmise uniquement par couleur.
