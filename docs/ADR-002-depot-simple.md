# ADR-002 — Dépôt simple (pas de monorepo au départ)

## Statut
Accepté (P0.1).

## Contexte
Le blueprint du kit décrit un monorepo (apps/mobile, apps/admin, packages/*). Le kit
précise aussi : « commence simple, monorepo seulement si les packages partagés et
l'admin le justifient ».

## Options
- App Expo unique avec modules internes (`src/design-system`, `src/engines/*`…).
- Monorepo pnpm/turborepo dès le départ.

## Décision
**Dépôt simple** : une app Expo avec des modules internes bien séparés et découplés,
**conçus pour être extraits en packages** plus tard sans réécriture (les moteurs ne
dépendent pas de l'UI ; le contenu est séparé du code).

## Conséquences
- Démarrage rapide, moins d'outillage.
- La cible monorepo reste valable quand l'admin web + packages partagés arriveront (P1).

## Rollback
Extraire `src/engines/*` et `src/design-system` en packages est mécanique grâce au
découplage déjà en place.
