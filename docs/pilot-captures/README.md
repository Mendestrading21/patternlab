# Preuves visuelles — parcours pilote « Comprendre un chandelier » (LOT 3 + LOT 4-A)

Captures **reproductibles** du parcours de production (unité `skill.candles`). Fichiers de preuve
**non embarqués dans le build web** (`dist/` n'inclut pas ce dossier).

## Reproduction

```bash
npm run build:web
node scripts/capture-pilot.mjs docs/pilot-captures   # nécessite Chromium (Playwright)
```

Le script sert `dist/` en local (repli SPA façon GitHub Pages) et pilote Chromium à 320 / 390 / 430 /
1280 px + `prefers-reduced-motion` + hors-ligne. **Il échoue (code 1)** si une route attendue n'est
pas rendue, si une erreur console est relevée, ou si un débordement horizontal dépasse 0 px.

## Index (fichiers réellement produits)

| Fichier | Ce qu'il prouve |
|---|---|
| `pilot-practice-{320,390,430,web,reduced}.png` | Phase pratique — responsive, aucun débordement horizontal ; `reduced` = équivalent statique. |
| `pilot-result-{320,390,430,web,reduced}.png` | **Écran de résultat corrigé (LOT 4-A)** : icône de résultat de la FAMILLE Trademy (aucun emoji), accents du **canon d'apprentissage** (XP violet, précision bleu-info, Maîtrise violet — jamais une couleur de marché/technique), tuiles `StatTile`, **scène de mascotte vectorielle sans damier**. Responsive + reduced-motion. |
| `pilot-feedback-390.png` | Feedback contextualisé + mascotte (scène de production). |
| `pilot-place-line-390.png` | 4e mécanique : placement continu d'une ligne (`place_invalidation`) — ↑/↓ clavier. |
| `pilot-error-remediation-390.png` | Erreur → Bobo + bouton **« Réessayer autrement »** (remédiation déclenchée par l'erreur). |
| `pilot-remediation-variant-390.png` | Variante de remédiation injectée (header « REMÉDIATION », index inchangé). |
| `pilot-progression-final-390.png` | Progression finale (session réussie) — écran de résultat corrigé + célébration accessible. |
| `pilot-checkpoint-pass-390.png` | Checkpoint réussi (célébration via l'état de mascotte). |
| `pilot-checkpoint-fail-390.png` | Checkpoint échoué : résultat « à revoir » (aucune célébration). |
| `pilot-resume-390.png` | Reprise après interruption : « Exercice 2 / 6 » restauré. |
| `pilot-offline-390.png` | État hors-ligne (contenu local, session continue). |
| `lot4-monde-{390,web,reduced}.png` | **Écran de monde pilote (LOT 4)** : `ProgressWidget` premium, jalons du parcours en **icônes de la famille Trademy** (plus d'emoji). Débordement horizontal 0 px aux trois rendus. |

Réf. décisions : `docs/ADR-097-trademy-lot4-visual-foundation.md` · audit : `docs/design/LOT4_VISUAL_AUDIT.md`.

## Démontré AUSSI par le test d'intégration (preuve exécutable)

`src/integration/session.integration.test.tsx` monte l'écran de session réel et clique ses vrais
contrôles ; il prouve, en plus des captures : la **remédiation** (variante ≠ échouée ET ≠ suivante,
comptée **une seule fois**), la **reprise pendant une remédiation**, la **reprise d'une interaction
d'ordre inachevée**, la **reprise d'un checkpoint interrompu**, et la **célébration proportionnelle**
(état de mascotte `celebrate-big`), toutes **sans double comptage**.

## Déterminisme du script

Le script déclare un **manifeste exact** (22 captures), nettoie les PNG gérés avant lancement, et exige
une égalité stricte `produced == manifeste == PNG du dossier`. Il **échoue (code 1)** sur : erreur
console, pageerror, débordement horizontal > 0, mesure d'overflow impossible, route incorrecte (pathname
+ marqueur STABLE propre à l'écran), état obligatoire non atteint, capture manquante ou inattendue.

## Contrôles mesurés à la capture

- **Débordement horizontal = 0 px** à 320 / 390 / 430 / 1280 px.
- **Erreurs console / pageerror = 0.**
- Cibles tactiles des flèches : 44 × 44 px. « Découvrir la notion » : cible ≥ 44 px.
- **Aucun emoji système** dans le parcours pilote — écrans + contenu rendu, y compris toutes les
  variantes de `characterLine` (verrou `src/integration/pilotNoEmoji.test.ts`).
- **Aucun artefact** de transparence derrière les mascottes (asset PNG défectueux retiré du rendu).

## Portée honnête des preuves

- **CI GitHub** (`quality`) : lint + typecheck + tests (dont les verrous ci-dessus) + build web. Elle
  **n'exécute PAS** ce script de captures — les captures sont un contrôle **local**.
- **Texte agrandi (200 %)** : le plafond de dynamic type (cap 1,8) est vérifié par test, mais une preuve
  réelle de reflow à 200 % exige un appareil/simulateur natif (indisponible en environnement web+jest).
  Cette limite est documentée, non déduite d'un simple `maxFontSizeMultiplier`.
