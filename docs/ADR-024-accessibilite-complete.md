# ADR-024 — Accessibilité complète (contraste verrouillé, titres, focus, cibles tactiles)

## Statut
Accepté (LOT 18 — Accessibilité complète, skill `patternlab-product-growth`).

## Contexte
Des fondations existaient (reduced motion centralisé, `contrast.ts` + test partiel, rôles
et hints sur de nombreux contrôles, alternatives aux gestes du graphique). Le skill exige
une accessibilité **complète** : lecteurs d'écran, clavier web, cibles tactiles, polices
dynamiques, contraste AA sur tous les états. Il fallait combler les manques et **verrouiller
les garanties par test**.

## Décision
1. **Contraste AA verrouillé de façon exhaustive** (`contrast.test.ts`) : chaque couleur de
   texte neutre (`textPrimary/Secondary/Muted`) est vérifiée ≥ 4.5 sur **toutes** les
   surfaces (y compris fonds profonds : graphiques, bandeaux) ; chaque accent utilisé
   comme texte (`primary`, `technical`, `warning`, `reward`, `bullish`, `bearish`,
   `neutral`, `primaryBright`) est vérifié ≥ 4.5 sur les surfaces de carte. Audit préalable :
   toutes les paires réellement utilisées passent — aucun token à changer. Toute future
   dérive fera rougir la CI.
2. **Jetons et aides a11y purs et testés** `src/design-system/a11y.ts` :
   `A11Y.minTouchTarget = 44`, `A11Y.maxFontScale = 1.8`, `hitSlopFor(size)` (porte une
   petite cible à 44 sans changer son rendu), `decorative` (masque un élément décoratif aux
   technologies d'assistance), `headingA11yProps`, `isHeadingVariant`.
3. **Titres annoncés** : le primitif `Text` donne `accessibilityRole="header"` au seul
   `h1` — chaque écran expose exactement **un** titre de navigation. `h2`/`display` sont des
   variantes surchargées (grands nombres, emojis, icônes) et ne sont volontairement pas des
   titres, pour ne pas polluer la navigation par en-têtes.
4. **Polices dynamiques honorées** : `Text` applique `maxFontSizeMultiplier` (1.8 par
   défaut, surchargeable) — le dynamic type est respecté sans casser la mise en page.
5. **Cibles tactiles** : `hitSlopFor` appliqué aux petites puces pressables (catégories du
   glossaire, termes reliés) pour atteindre 44 px.
6. **Clavier web** (`global.css`) : anneau de focus visible via `:focus-visible`
   (2 px), plus une règle `prefers-reduced-motion` globale côté web.
7. **Éléments décoratifs masqués** : `MascotFigure` gagne `decorative` ; les mascottes
   purement décoratives (mission, réussites, premium) sont retirées de l'arbre
   d'accessibilité (le texte adjacent porte le sens).

## Conséquences
- Accessibilité vérifiée de bout en bout : contraste AA garanti par test, titres et rôles
  exposés, focus clavier visible, cibles tactiles conformes, décor non bruyant.
- Base réutilisable (`a11y.ts`) pour les prochains écrans ; les garanties sont opposables
  (tests) plutôt que déclaratives.

## Rollback
`a11y.ts` et l'extension de `contrast.test.ts` sont additifs ; retirer le rôle de titre du
`Text` et les `hitSlop`/`decorative` revient au comportement antérieur sans impact runtime.
