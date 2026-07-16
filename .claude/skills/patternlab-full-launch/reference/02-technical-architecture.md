# 02 — Architecture technique

## Cible par défaut pour un nouveau dépôt

- Expo / React Native / TypeScript
- Expo Router
- React Native Reanimated
- architecture par domaines
- stockage local abstrait
- synchronisation future optionnelle
- EAS pour builds internes et stores
- web universel pour démonstration

## Domaines

- auth/profile
- onboarding
- learning
- exercises
- patterns
- glossary
- progression
- review
- gamification
- characters
- analytics
- content-import
- settings
- subscriptions
- admin-content

## Arborescence recommandée

```text
apps/
  mobile/
  admin/
packages/
  ui/
  design-tokens/
  learning-engine/
  exercise-engine/
  pattern-engine/
  content-schema/
  analytics/
content/
  raw-wmb/
  normalized/
  published/
assets/
  characters/
  animations/
  illustrations/
  charts/
scripts/
  import-wmb/
  validate-content/
  generate-demo/
docs/
```

Utilise un monorepo uniquement si les packages partagés et l’admin le justifient. Sinon, commence simple.

## Données

Le contenu pédagogique doit être versionné séparément du code.

États :

- raw_imported
- normalized
- draft
- needs_review
- approved
- published
- archived

## Persistance

Prototype :

- progression locale ;
- seed de démonstration ;
- repository interfaces ;
- stratégie de migration de schéma ;
- capacité de reset.

Plus tard :

- compte synchronisé ;
- API ;
- sauvegarde multi-device ;
- abonnements.

## Graphiques

Benchmark obligatoire entre SVG et Skia.

Critères :

- précision du toucher ;
- fluidité ;
- accessibilité ;
- tests ;
- export d’images ;
- performance bas de gamme ;
- compatibilité web.

## Décisions ADR

Créer au minimum :

- ADR-001 stack mobile
- ADR-002 monorepo ou dépôt simple
- ADR-003 stockage local
- ADR-004 moteur graphique
- ADR-005 animations de personnages
- ADR-006 backend et synchronisation
