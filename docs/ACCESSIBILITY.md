# Accessibilité — posture complète PatternLab (V5)

PatternLab vise une accessibilité **complète** sur iOS, Android et web. Ce document récapitule les
garanties en place, où elles sont implémentées, et comment elles sont vérifiées.

## Contraste (WCAG AA)
- Toutes les paires texte/surface visent AA (≥ 4.5). Palette « Instrument Glass » + jetons V5
  (`advanced`, `onAdvanced`).
- **Vérifié par test** : `src/design-system/contrast.test.ts` verrouille chaque couleur de texte et
  chaque accent sur toutes les surfaces (échec CI si une couleur passe sous AA).

## Cibles tactiles
- Minimum 44 px (`A11Y.minTouchTarget`). `hitSlopFor(size)` agrandit une petite cible sans changer
  son rendu. Utilisé sur les étoiles favori, segments, puces, flèches. Testé (`a11y.test.ts`).

## Type dynamique
- Toute chaîne passe par `Text`, qui applique `maxFontSizeMultiplier = A11Y.maxFontScale` (1.8) :
  respecte le Dynamic Type sans casser la mise en page.

## Titres / navigation par en-têtes
- Seul `h1` (un titre par écran) est annoncé `header` (`isHeadingVariant`) ; les variantes surchargées
  (grands nombres, emojis) ne polluent pas la navigation par titres. Vérifié dans le DOM web
  (`role="heading"`).

## Réduction d'animation
- `useReducedMotion()` (source unique) est consommé par **tous** les composants animés (Skeleton,
  MascotFigure, CharacterAnimationController). Les surfaces V5 (visuels SVG, graphiques, journal, deck,
  carte des mondes) sont **statiques** par construction — aucune animation à réduire.

## Alternatives textuelles aux graphiques (jamais d'info par la seule couleur)
- **Visuels V5** (`VisualCard`) : `accessibilitySummary` obligatoire, affiché en texte visible ET en
  `accessibilityLabel`.
- **Graphiques en chandeliers** : `describeCandles(candles)` (pur, testé) produit un résumé
  — structure haussière/baissière/latérale + extrêmes — utilisé par `PatternChart` (`accessible`,
  role `image`) et enrichissant le label de `InteractiveChart`. `MarketReplayChart` décrit la
  progression, la dernière clôture et le volume.
- Sémantique jamais portée par la seule couleur : étoiles favori ★/☆, feedback correct/incorrect,
  repères de forme, libellés explicites.

## Alternatives aux gestes / clavier
- Le placement d'un niveau au toucher a une alternative **flèches ↑/↓** (Laboratoire, exercice
  `place_invalidation`). Boutons fléchés labellisés « Monter »/« Descendre ».
- Web : navigation clavier native (éléments focusables, rôles ARIA).

## Rôles & états
- `Button`, `SegmentedControl`, `FavoriteButton`, puces et cartes navigables portent
  `accessibilityRole` + `accessibilityLabel`/`accessibilityHint` + `accessibilityState`
  (`selected`/`disabled`). Aucun bouton mort (les états désactivés exposent une raison).
- Mascottes : décoratives → masquées (`decorative`) ; informatives → `role="image"` + label.

## Vérification
- **Tests** : contrast, a11y (touch/heading/decorative), `describeCandles`, résumés des visuels.
- **DOM web (Chromium)** : aria-labels des graphiques (InteractiveChart inclut le résumé de structure,
  MarketReplayChart, VisualCard, PatternChart), présence des en-têtes, console propre.
- **Gate CI** : lint · typecheck · tests · validate:content · release:check · build:web.

## Reste à faire
- Tests d'intégration lecteur d'écran natifs (VoiceOver/TalkBack) sur appareil réel ;
- audit clavier web exhaustif (ordre de tabulation) au fil des nouveaux écrans.
