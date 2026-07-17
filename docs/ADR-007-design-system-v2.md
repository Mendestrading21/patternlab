# ADR-007 — Design System V2 (« Instrument Glass »)

## Statut
Accepté (LOT 1 — Design System V2, skill `patternlab-product-growth`).

## Contexte
Le thème V1 était sombre à dominante verte (fond `#0C1411`). Le skill fixe une
direction visuelle « Instrument Glass » : surfaces mates graphite/bleu nuit
(≈ 70 %), verre sombre contrôlé (≈ 20 %), couleur fonctionnelle parcimonieuse
(≈ 10 %), avec des états d'écran systématiques (loading, empty, error, offline,
locked, disabled) et un contraste accessible.

## Options
- Réécrire chaque écran avec des couleurs en dur.
- **Faire évoluer les tokens** en gardant les clés sémantiques stables, puis ajouter
  les primitives d'états manquantes.

## Décision
1. **Palette Instrument Glass** dans `tokens.ts` : surfaces `backgroundDeep/background/
   surface/surfaceElevated/surfaceInteractive`, bordures `borderSubtle/borderStrong`,
   accents `bullish #26C281`, `bearish #F05A67`, `technical #42B7E8`, `warning`, `reward`.
   Les clés sémantiques (`primary`, `surface`, `textPrimary`…) sont **conservées** :
   les primitives et écrans se mettent à jour sans réécriture. `bullish/bearish`
   restent distincts de `feedbackCorrect/feedbackIncorrect`.
2. **Accessibilité vérifiée** : `contrast.ts` (luminance + ratio WCAG) et
   `contrast.test.ts` verrouillent l'AA (≥ 4.5) de toutes les paires texte/surface.
   `textMuted` a été éclairci (`#8B99AB`) pour tenir l'AA sur surfaces élevées.
3. **Élévation** (`theme.elevation`) : ombres douces « verre » pour les cartes élevées.
4. **Primitives d'états** : `StateView` (loading/empty/error/offline/locked, un seul
   CTA), `Skeleton` (respecte reduced motion), `OfflineBanner` + hook `useIsOnline`
   (web : `navigator.onLine` ; natif : différé, sans nouvelle dépendance).
   `EmptyState` délègue à `StateView` ; le garde-fou d'erreurs et l'accueil (chargement)
   consomment ces états. `useReducedMotion` est centralisé dans le design system.

## Conséquences
- Une seule migration de palette met à jour toute l'app ; aucun écran cassé.
- États d'écran cohérents et accessibles, réutilisables par les prochains lots.
- Couleurs web alignées (HTML `theme-color`, `global.css`, manifest PWA).

## Rollback
Restaurer les valeurs de `palette` V1 dans `tokens.ts` (clés inchangées) ; les
primitives d'états sont additives et peuvent être retirées sans impact fonctionnel.
