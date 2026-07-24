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
| `pilot-error-remediation-390.png` | **Erreur** → Bobo + bouton **« Réessayer autrement »** (remédiation proposée par l'erreur) |
| `pilot-remediation-variant-390.png` | **Variante de remédiation** injectée : header « REMÉDIATION · autre exemple, même objectif », toujours « Exercice 1 / 6 » (l'index n'a pas avancé) |
| `pilot-progression-final-390.png` | **Progression finale** (session réussie 5/6) : XP · précision · maîtrise · prochaine révision + **célébration** |
| `pilot-checkpoint-pass-390.png` | **Checkpoint réussi** (6/8, « Validé ») avec **célébration** |
| `pilot-checkpoint-fail-390.png` | **Checkpoint échoué** : résultat « à revoir » (aucune célébration) |
| `pilot-resume-390.png` | **Reprise après interruption** : après rechargement, la session restaure « Exercice 2 / 6 » |
| `pilot-place-line-390.png` | **4e mécanique** : placement continu d'une ligne (`place_invalidation`) — ↑/↓ clavier |
| `pilot-order-shuffled-390.png` | Exercice d'ordre **réellement mélangé** (jamais présenté résolu) |
| `pilot-feedback-390.png` | Feedback contextualisé + mascotte (scène de production) |
| `pilot-offline-390.png` | État hors-ligne (contenu local, session continue) |
| `pilot-practice-{320,390,430,web}.png` | Responsive — aucun débordement horizontal |
| `pilot-practice-reduced.png` | `prefers-reduced-motion` — équivalent informatif (rendu statique) |

## LOT 4 — fondation visuelle (application verticale pilote)

| Fichier | Ce qu'il prouve |
|---|---|
| `lot4-monde-{390,web,reduced}.png` | Écran de **monde pilote** : `ProgressWidget` premium, **légende `MarketStatePill`** (setup haussier/baissier, confirmation, invalidation, faux signal), jalons du parcours en **icônes de la famille Trademy** (plus d'emoji). Débordement horizontal 0 px aux trois rendus. |
| `pilot-progression-final-390.png` · `pilot-result-*.png` | Écran de **résultat** revu : tuiles `StatTile` premium (icônes `bolt`/`target`/`mastery`) + séparateur `SignatureMark`. Données et a11y inchangées. |

Réf. décision : `docs/ADR-097-trademy-lot4-visual-foundation.md` · audit : `docs/design/LOT4_VISUAL_AUDIT.md`.

## Démontré AUSSI par le test d'intégration (preuve exécutable)

`src/integration/session.integration.test.tsx` monte l'écran de session réel et clique ses vrais
contrôles ; il prouve, en plus des captures : la **remédiation** (variante ≠ échouée ET ≠ suivante,
comptée **une seule fois**), la **reprise pendant une remédiation**, la **reprise d'une interaction
d'ordre inachevée** et la **reprise d'un checkpoint interrompu**, toutes **sans double comptage**.

## Contrôles manuels mesurés à la capture

- **Débordement horizontal = 0 px** à 320 / 390 / 430 / 1280 px.
- **Erreurs console = 0** (avertissement d'hydratation React #418 corrigé via `generateStaticParams`).
- Cibles tactiles des flèches : 44 × 44 px. 4 mécaniques distinctes accessibles clavier + tactile +
  lecteur d'écran.
