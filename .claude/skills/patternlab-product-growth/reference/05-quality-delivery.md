# 05 — Qualité, Git et livraison

## Audit initial

Avant toute modification importante :

- vérifier la branche et l'état Git ;
- identifier les changements non commités ;
- lire README, CLAUDE.md, package.json, app.json et PROJECT_STATUS ;
- inspecter les routes, moteurs, données, assets, tests et workflows ;
- comparer documentation, code, derniers commits et comportement réel ;
- exécuter les tests de référence ;
- noter les incohérences sans les masquer.

Le code exécuté et les tests font foi lorsqu'une documentation est obsolète.

## Git

- Préserver tout travail utilisateur.
- Aucun reset destructif.
- Aucune réécriture d'historique.
- Une branche dédiée pour une transformation importante.
- Un commit par lot cohérent et réversible.
- Ne pas pousser ni ouvrir de PR sans demande explicite.
- Ne jamais inclure de secret.

Exemples de commits :

- `fix: align xp calculation and progression state`
- `feat: add personalized onboarding flow`
- `refactor: introduce neutral premium design tokens`
- `feat: add interactive chart lab foundation`
- `docs: update product v2 project status`

## Validation standard

Lorsque les scripts existent :

```bash
npm run lint
npm run typecheck
npm test -- --runInBand
npm run validate:content
npm run build:web
```

Ne pas ignorer une erreur non liée sans la documenter. Corriger toute erreur causée par le lot.

## Vérification visuelle

Pour un écran ou une interaction :

- ouvrir réellement l'application ;
- tester une largeur mobile ;
- tester le web large ;
- vérifier routes, CTA, retour et boutons ;
- inspecter la console ;
- tester loading, empty, error, locked et offline selon pertinence ;
- tester reduced motion ;
- vérifier qu'aucun élément important n'est masqué ;
- ne jamais déclarer une validation non effectuée.

## Tests unitaires

Couvrir en priorité :

- XP et niveaux ;
- progression ;
- déblocage ;
- répétition espacée ;
- mastery et confidence ;
- migrations ;
- graders ;
- défis et badges ;
- entitlements ;
- import et validation du contenu.

## Tests intégration et E2E

Scénarios minimums :

1. nouvel utilisateur ;
2. onboarding interrompu puis repris ;
3. onboarding complet ;
4. première mission ;
5. première erreur ;
6. première réussite ;
7. résultat et XP cohérents ;
8. déblocage ;
9. révision ;
10. laboratoire ;
11. hors ligne ;
12. reduced motion ;
13. viewport mobile ;
14. PWA et base URL.

## Accessibilité

Vérifier :

- contraste AA ;
- tailles dynamiques ;
- labels ;
- ordre de lecture ;
- navigation clavier web ;
- focus visible ;
- cibles tactiles ;
- alternatives aux gestes ;
- description des graphiques ;
- absence d'information transmise uniquement par couleur.

## Performance

- assets optimisés et inventoriés ;
- listes virtualisées si nécessaire ;
- pas de re-render massif inutile ;
- animations sobres ;
- graphiques fluides sur appareils modestes ;
- chargement progressif ;
- pas de débordement horizontal web ;
- PWA installable et routes stables.

## Documentation à maintenir

Selon le lot :

- README.md ;
- docs/PROJECT_STATUS.md ;
- ADR ;
- docs/ASSET_INVENTORY.md ;
- docs/CONTENT_MIGRATION_REPORT.md ;
- docs/PRODUCT_V2_EXECUTION_REPORT.md ;
- CHANGELOG.md.

## Rapport de lot

```text
LOT TERMINÉ : [nom]

Problème corrigé :
- ...

Fichiers modifiés :
- ...

Fonctionnalités livrées :
- ...

Validations :
- lint :
- typecheck :
- tests :
- contenu :
- build web :
- vérification visuelle :

Commit local :
- hash
- message

Risques ou limites :
- ...

Prochaine priorité :
- ...
```

## Définition de terminé

Un lot n'est terminé que si :

- le comportement est réellement utilisable ;
- les tests pertinents passent ;
- le rendu a été vérifié lorsque visuel ;
- les boutons fonctionnent ;
- la documentation est cohérente ;
- les limites sont indiquées ;
- le changement est réversible.
