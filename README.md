# Trademy 🐂🐻

**« Ne parie pas. Comprends. »**

Application iOS, Android et web d’**éducation visuelle aux marchés financiers**. Trademy aide à comprendre les chandeliers, figures, price action, Smart Money Concepts, Wyckoff, volume, gestion du risque et psychologie grâce à des leçons courtes, des quiz, des flashcards et des laboratoires guidés par **Toto** et **Bobo**.

> Application éducative. Aucun contenu ne constitue un conseil financier. Le trading comporte un risque de perte.

Le dépôt GitHub s’appelle **TradeMy**. **PatternLab** reste uniquement un nom historique interne dans certains identifiants techniques.

## Démarrer

Prérequis : Node et npm définis dans `.nvmrc` et `package.json`.

```bash
npm ci
npm run web
npm start
```

## Vérifier tout le projet

```bash
npm run check
```

Cette commande exécute lint, TypeScript, tests Jest, validation éditoriale, garde-fous de release, build web et smoke test du chemin public `/TradeMy/`.

## Sources canoniques

- Vision : [TRADEMY_PRODUCT_VISION.md](./docs/product/TRADEMY_PRODUCT_VISION.md)
- Design : [TRADEMY_LEARNING_GLASS.md](./docs/design/TRADEMY_LEARNING_GLASS.md)
- Toto/Bobo : [TOTO_BOBO_CANON.md](./docs/product/TOTO_BOBO_CANON.md)
- Architecture 500+ concepts : [LEARNING_CONTENT_ARCHITECTURE.md](./docs/product/LEARNING_CONTENT_ARCHITECTURE.md)
- Plan Claude Code : [TRADEMY_EXECUTION_PLAN.md](./docs/product/TRADEMY_EXECUTION_PLAN.md)
- Carte du dépôt : [REPOSITORY_MAP.md](./docs/REPOSITORY_MAP.md)
- État courant : [CURRENT_STATE.md](./docs/CURRENT_STATE.md)

## Architecture

```text
src/app/            routes et écrans Expo Router
src/design-system/  tokens et composants Trademy Learning Glass
src/characters/     Toto, Bobo et réduction d’animation
src/engines/        apprentissage, exercices et moteur graphique
src/data/           contenu runtime, progression et persistance locale
content/            brouillons validés par schéma
assets/             marque et assets runtime originaux seulement
config/             déploiement et PWA
scripts/            contrôles reproductibles
docs/               vision, design, état, décisions et ADR
```

## Travail avec Claude Code

Claude commence obligatoirement par [CLAUDE.md](./CLAUDE.md). Un seul skill pédagogique est actif : `.claude/skills/patternlab-learning-master/`. Le nom du dossier reste historique ; les règles publiques de marque sont celles de Trademy.
