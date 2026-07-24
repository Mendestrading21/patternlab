# Preuves visuelles — parcours pilote « Comprendre un chandelier » (LOT 3)

Captures **reproductibles** du parcours de production (unité `skill.candles`). Fichiers de preuve
**non embarqués dans le build web** (`dist/` n'inclut pas ce dossier).

## Reproduction

```bash
npm run build:web
node scripts/capture-pilot.mjs docs/pilot-captures   # nécessite Chromium (Playwright)
```

Le script sert `dist/` en local (repli SPA façon GitHub Pages) et pilote Chromium à 320 / 390 / 430 /
1280 px + `prefers-reduced-motion` + hors-ligne.

## Index

| Fichier | Ce qu'il prouve |
|---|---|
| `pilot-practice-320.png` | Pratique, mobile 320 px — aucun débordement horizontal |
| `pilot-practice-390.png` | Pratique, mobile 390 × 844 |
| `pilot-practice-430.png` | Pratique, mobile 430 px |
| `pilot-practice-web.png` | Pratique, web large (1280 px) |
| `pilot-practice-reduced.png` | `prefers-reduced-motion` — équivalent informatif (rendu statique) |
| `pilot-place-line-390.png` | **4e mécanique** : placement continu d'une ligne (`place_invalidation`) — ↑/↓ clavier + « Valider mon niveau » |
| `pilot-order-shuffled-390.png` | Exercice d'ordre **réellement mélangé** (jamais présenté résolu) |
| `pilot-feedback-390.png` | Feedback contextualisé + mascotte (scène de production) |
| `pilot-offline-390.png` | État hors-ligne (contenu local, session continue) |

## Contrôles manuels mesurés à la capture

- **Débordement horizontal = 0 px** à 320 / 390 / 430 / 1280 px.
- **Erreurs console = 0** (l'avertissement d'hydratation React #418 sur les routes dynamiques est
  corrigé — voir `generateStaticParams` dans `app/session/[skillId].tsx` et `app/lesson/[id].tsx`).
- Cibles tactiles des flèches d'ordre / de placement : 44 × 44 px.
- 4 mécaniques utilisateur distinctes : choix, sélection de zone au doigt, réorganisation, placement
  continu — toutes accessibles clavier + tactile + lecteur d'écran.

Le parcours interactif complet (leçon → erreur → Bobo via l'orchestrateur → réussite → checkpoint →
progression persistée → reprise) est démontré par le test d'intégration de production
`src/integration/session.integration.test.tsx`, qui monte l'écran de session réel et clique ses vrais
contrôles.
