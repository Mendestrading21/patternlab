# ADR-075 — Fondation du dépôt TradeMy

## Statut

Accepté — 22 juillet 2026.

## Contexte

Le code PatternLab passait ses contrôles, mais le dépôt mélangeait runtime, sources graphiques,
moodboards, archive WMB, programmes agents terminés et documentation divergente. GitHub Pages
servait le dépôt `TradeMy` alors que le build référençait encore `/patternlab`, ce qui rendait les
bundles publics introuvables.

## Décision

1. Distinguer l’identité produit **PatternLab** du chemin d’hébergement du dépôt **TradeMy**.
   `config/deployment.json` devient l’unique source du chemin public.
2. Générer le manifest PWA, ajouter le fallback de routes GitHub Pages et vérifier après export
   chaque page et ressource sous `/TradeMy/`.
3. Épingler Node/npm pour local, CI, Pages et EAS ; exposer une gate unique `npm run check`.
4. Remplacer les icônes Expo par une source canonique Toto/Bobo et verrouiller les exports par
   dimension et empreinte.
5. Garder un seul skill Claude actif. Archiver les programmes terminés avec un avertissement clair et
   créer trois documents d’entrée : état, carte du dépôt et index des décisions.
6. Retirer de l’arbre courant l’archive WMB, les moodboards bruts, sources personnages lourdes et
   scripts non reproductibles. Les données pédagogiques runtime et les ADR restent inchangés.
7. Retirer les dépendances directes non importées et déclarer explicitement `@jest/globals`, utilisé
   par les tests.

## Conséquences

- Claude Code dispose d’un ordre de lecture et de sources de vérité explicites.
- Le déploiement échoue automatiquement si un ancien chemin ou une ressource manquante réapparaît.
- L’arbre courant est plus léger et ne distribue plus les références visuelles sans licence claire.
- Les fichiers supprimés restent récupérables au commit `5f34d57`. Ils restent aussi dans
  l’historique public : une purge demanderait une opération séparée et destructive.
- Ce lot ne change ni les données utilisateur, ni la progression, ni le contenu rendu.

## Alternatives écartées

- reconstruire l’application depuis zéro ;
- fusionner en bloc une ancienne branche ou un ancien skill ;
- conserver plusieurs chemins de déploiement synchronisés manuellement ;
- exécuter `npm audit fix --force` ;
- copier les images de référence dans l’interface.

## Retour arrière

La configuration et les documents peuvent être revertés comme un commit normal. Toute restauration
d’un asset retiré doit être ciblée, justifiée par son usage, sa provenance et sa licence ; ne jamais
restaurer les dossiers bruts en bloc.
