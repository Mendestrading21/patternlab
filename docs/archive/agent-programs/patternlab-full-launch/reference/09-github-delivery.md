# 09 — GitHub et livraison

## Local d’abord

Dans un dossier vide :

1. initialiser Git ;
2. créer la structure ;
3. créer le projet mobile avec la commande Expo officiellement recommandée au moment de l’exécution ;
4. créer une branche de travail ;
5. ajouter `.gitignore` ;
6. créer README, CLAUDE.md, docs, CI ;
7. faire un commit initial propre.

## Dépôt distant

Ne pas créer ni pousser sans validation.

Demander :

- nom ;
- owner ;
- private/public ;
- licence ;
- GitHub Projects oui/non.

## Branches

- main
- develop uniquement si utile
- feature/*
- fix/*
- release/*

Éviter une stratégie trop lourde pour un petit projet.

## Pull requests

Chaque PR contient :

- objectif ;
- captures ;
- tests ;
- accessibilité ;
- performance ;
- risques ;
- rollback.

## CI

Exécuter au minimum :

- installation verrouillée ;
- lint ;
- typecheck ;
- tests ;
- validation contenu ;
- build web ou export de contrôle ;
- vérification secrets.

## Releases

- changelog ;
- tags ;
- build interne ;
- notes de version ;
- checklist ;
- approbation ;
- rollback.
