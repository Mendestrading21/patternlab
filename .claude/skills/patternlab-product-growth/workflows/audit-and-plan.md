# Workflow — Audit et plan sans modification

## Quand l'utiliser

Utiliser lorsque l'utilisateur demande :

- un audit ;
- un état des lieux ;
- une analyse UX ou technique ;
- un plan de refonte ;
- une roadmap ;
- un inventaire ;
- un diagnostic avant exécution.

## Règle d'arrêt

Ne modifier aucun fichier, ne créer aucun commit et ne lancer aucune migration. Produire le plan puis attendre la validation.

## Étapes

### 1. Résoudre le contexte

- dépôt et branche ;
- état Git ;
- changements utilisateur ;
- derniers commits ;
- scripts disponibles ;
- documentation structurante.

### 2. Inspecter l'état réel

Lire selon pertinence :

- README.md ;
- CLAUDE.md ;
- package.json ;
- app.json ;
- docs/PROJECT_STATUS.md ;
- docs/ADR-* ;
- .claude/skills ;
- src/app ;
- src/design-system ;
- src/characters ;
- src/engines ;
- src/data ;
- src/analytics ;
- content ;
- schemas ;
- scripts ;
- assets ;
- tests ;
- workflows GitHub.

Pour le contenu, auditer également les dossiers utiles du dépôt APP.

### 3. Établir les preuves

Distinguer :

- fonctionnel ;
- partiel ;
- cassé ;
- absent ;
- documenté mais faux ;
- codé mais non documenté ;
- visible mais non fonctionnel.

Ne pas déduire la qualité uniquement depuis les noms de fichiers.

### 4. Exécuter les validations de référence

Si l'environnement le permet, exécuter sans modifier :

```bash
npm run lint
npm run typecheck
npm test -- --runInBand
npm run validate:content
npm run build:web
```

Indiquer précisément les commandes non exécutables.

### 5. Produire le plan

Format obligatoire :

1. résumé exécutif ;
2. inventaire réel ;
3. état fonctionnel ;
4. écarts documentation/code ;
5. bugs et incohérences ;
6. forces ;
7. faiblesses ;
8. vision cible ;
9. architecture produit ;
10. écrans concernés ;
11. architecture technique ;
12. lots ordonnés ;
13. fichiers exacts ;
14. données et migrations ;
15. tests ;
16. accessibilité ;
17. analytics ;
18. critères d'acceptation ;
19. risques et rollback ;
20. décisions nécessaires.

Pour chaque lot, préciser :

- objectif utilisateur ;
- problème ;
- comportement attendu ;
- écrans ;
- fichiers ;
- données ;
- composants ;
- dépendances ;
- tests ;
- analytics ;
- accessibilité ;
- preuve attendue ;
- définition de terminé ;
- risques ;
- rollback.

### 6. Arrêt

Terminer par un tableau des décisions demandées. Ne commencer aucune implémentation.
