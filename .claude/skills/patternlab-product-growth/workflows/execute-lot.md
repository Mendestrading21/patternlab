# Workflow — Exécuter un lot

## Quand l'utiliser

Utiliser lorsqu'un lot ou une fonctionnalité précise doit être réellement implémenté.

Ne pas utiliser pour une demande d'audit sans modification.

## Entrée attendue

Le prompt de session doit préciser :

- le lot ou objectif ;
- les contraintes particulières ;
- si un commit local est demandé ;
- si le travail doit s'arrêter après le lot.

Si aucun lot n'est nommé, choisir la première dette bloquante prouvée par l'audit, sans démarrer plusieurs chantiers simultanément.

## Étapes obligatoires

### 1. Charger les références

- lire `SKILL.md` ;
- lire `reference/01-product-strategy.md` ;
- charger seulement les références liées au lot ;
- lire `reference/05-quality-delivery.md` ;
- consulter `reference/07-roadmap.md` pour les dépendances.

### 2. Sécuriser le dépôt

- vérifier la branche ;
- inspecter les changements non commités ;
- préserver le travail utilisateur ;
- ne jamais reset ou écraser ;
- créer une branche locale si nécessaire ;
- mesurer l'état de référence avec les tests disponibles.

### 3. Auditer la zone concernée

Avant d'écrire :

- identifier les routes, composants, données, moteurs, tests et assets concernés ;
- vérifier les usages réels ;
- repérer les duplications ;
- définir la source de vérité ;
- noter les migrations nécessaires ;
- annoncer brièvement la tranche d'exécution.

### 4. Implémenter une tranche verticale

Le lot doit livrer un comportement complet plutôt qu'une collection de composants inutilisés.

Ordre recommandé :

1. types et modèle de données ;
2. logique métier pure ;
3. migrations et repositories ;
4. composants ;
5. écran ou route ;
6. analytics ;
7. accessibilité ;
8. tests ;
9. documentation.

Ne pas disperser les constantes métier dans les écrans.

### 5. Vérifier

Exécuter lorsque disponibles :

```bash
npm run lint
npm run typecheck
npm test -- --runInBand
npm run validate:content
npm run build:web
```

Puis vérifier réellement le parcours modifié :

- mobile ;
- web ;
- routes ;
- CTA ;
- erreurs console ;
- loading/empty/error ;
- reduced motion ;
- clavier et labels selon pertinence.

Corriger toute régression causée par le lot.

### 6. Documenter

Mettre à jour selon pertinence :

- docs/PROJECT_STATUS.md ;
- ADR ;
- inventaire assets ;
- rapport de migration ;
- rapport Product V2 ;
- CHANGELOG.md.

La documentation décrit l'état réel, pas l'intention.

### 7. Commit

Si demandé et si l'environnement le permet :

- vérifier le diff ;
- exclure secrets, caches et artefacts ;
- créer un commit local unique et cohérent ;
- ne pas pousser ;
- ne pas ouvrir de PR sans demande explicite.

### 8. Rapport

```text
LOT TERMINÉ : [nom]

Problème corrigé :
- ...

Comportement livré :
- ...

Fichiers modifiés :
- ...

Validations :
- lint :
- typecheck :
- tests :
- contenu :
- build web :
- rendu mobile/web :
- accessibilité :

Commit local :
- hash
- message

Limites restantes :
- ...

Prochaine priorité :
- ...
```

## Garde-fous

S'arrêter et demander une décision uniquement si l'action exige :

- secret ou clé externe ;
- compte Apple/Google ;
- achat réel ;
- prix définitif ;
- suppression de données importante ;
- publication distante ;
- choix juridique ou commercial irréversible.

Ne pas s'arrêter pour une petite ambiguïté technique résoluble par l'audit.

## Définition de terminé

Le lot est terminé lorsque :

- le comportement est utilisable de bout en bout ;
- les tests pertinents passent ;
- le rendu a été vérifié ;
- aucun bouton mort n'a été ajouté ;
- l'accessibilité principale est traitée ;
- la documentation correspond au code ;
- les limites sont explicites ;
- le changement est réversible.
