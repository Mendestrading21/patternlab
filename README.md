# PatternLab 🐂🐻

Application mobile (iOS · Android · web) d'**apprentissage financier gamifié** : lire,
comprendre et analyser les marchés quelques minutes par jour, avec deux mascottes —
**Toto** (le taureau vert, optimiste) et **Bobo** (l'ours rouge, prudent).

> PatternLab est une application éducative. **Aucun conseil en investissement, aucun
> signal d'achat/vente, aucune promesse de gain.**

## Stack

Expo SDK 57 · React Native · TypeScript strict · Expo Router · Reanimated · Lottie · SVG.
Voir les décisions dans [`docs/`](./docs) (ADR-001 à 005).

## Démarrer

```bash
npm install
npm run web       # lance l'app sur le web (cible de vérification actuelle)
npm start         # dev server (iOS / Android via Expo Go)
```

## Qualité

```bash
npm run lint             # ESLint
npm run typecheck        # TypeScript (tsc --noEmit)
npm test                 # Jest (moteurs)
npm run validate:content # valide content/ contre schemas/
npm run build:web        # export web statique (dist/)
```

## Architecture (P0.1)

```
src/
  app/            écrans Expo Router (splash, onboarding, (tabs), lesson/[id])
  design-system/  tokens sémantiques + primitives UI (thème sombre premium)
  characters/     Toto & Bobo + CharacterAnimationController (réduction d'animation)
  engines/
    learning/     leçons, maîtrise, répétition espacée (SM-2, testée)
    exercise/     registry des 12 formats (mcq + true_false branchés)
    pattern/      chart SVG reproductible + modèle de pattern
  data/           persistance locale (AsyncStorage) + seed + contexte de progression
  analytics/      logger d'événements (abstraction)
  lib/            config, garde-fou d'erreurs
content/          contenu pédagogique versionné, validé par schemas/
```

## Contenu WMB

WMB est une **source de contenu** (formations, glossaire, indicateurs, patterns), jamais
une dépendance runtime. L'import est traçable et idempotent (P1). Les données personnelles,
emails, mots de passe, Stripe et abonnements WMB **ne sont jamais importés**.

## Roadmap

**P0** fondation + tranche verticale + parcours pilote · **P1** produit complet bêta +
import WMB · **P2** compte, abonnements, TestFlight/Play, stores. Détail :
[`.claude/skills/patternlab-full-launch/reference/11-roadmap.md`](./.claude/skills/patternlab-full-launch/reference/11-roadmap.md).

## État courant

Voir [`docs/PROJECT_STATUS.md`](./docs/PROJECT_STATUS.md).
