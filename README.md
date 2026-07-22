# PatternLab 🐂🐻

Application iOS, Android et web d’**éducation visuelle aux marchés financiers**. PatternLab aide à
comprendre les chandeliers, figures, price action, Smart Money Concepts, Wyckoff, volume, gestion du
risque et psychologie à travers des leçons courtes, des quiz, des flashcards et des laboratoires
interactifs guidés par **Toto** et **Bobo**.

> PatternLab est une application éducative. Aucun contenu ne constitue un conseil financier. Le
> trading comporte un risque de perte.

## Démarrer

Prérequis : Node et npm définis dans `.nvmrc` et `package.json`.

```bash
npm ci
npm run web       # développement web
npm start         # Expo iOS / Android / web
```

## Vérifier tout le projet

```bash
npm run check
```

Cette commande exécute lint, TypeScript, tests Jest, validation éditoriale, garde-fous de release,
build web et smoke test du chemin public `/TradeMy/`.

## Architecture

```text
src/app/            routes et écrans Expo Router
src/design-system/  tokens et composants visuels
src/characters/     Toto, Bobo et réduction d’animation
src/engines/        apprentissage, exercices et moteur graphique
src/data/           contenu runtime, progression et persistance locale
content/            brouillons et exemples JSON validés par schéma
assets/             marque et assets runtime seulement
config/             configuration de déploiement et PWA
scripts/            contrôles et pipelines reproductibles
docs/               état courant, carte, décisions et ADR
```

La carte détaillée et les règles de modification sont dans
[`docs/REPOSITORY_MAP.md`](./docs/REPOSITORY_MAP.md). L’état réel du produit se trouve dans
[`docs/CURRENT_STATE.md`](./docs/CURRENT_STATE.md) ; les compteurs viennent toujours de
`src/data/repoTruth.ts`.

## Contenu et WMB

Le contenu affiché est composé dans `src/data/learningContent.ts`. Les JSON sous `content/drafts/`
sont une file éditoriale soumise à revue humaine, pas une seconde base runtime.

WMB peut alimenter cette file après extraction sélective et anonymisation. Ses scripts de base de
données, e-mails, paiements, newsletters, secrets et données personnelles ne font jamais partie de
TradeMy.

## Déploiement web

```bash
npm run build:web
```

La seule source de vérité du chemin GitHub Pages est `config/deployment.json`. Le build génère le
manifest PWA puis contrôle que toutes les ressources existent réellement sous `/TradeMy/`.

## Travail avec Claude Code

Claude commence par [`CLAUDE.md`](./CLAUDE.md). Un seul skill est actif :
`.claude/skills/patternlab-learning-master/`. Les anciens programmes sont conservés uniquement dans
`docs/archive/agent-programs/` pour la traçabilité.
