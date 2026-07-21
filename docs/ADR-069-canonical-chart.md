# ADR-069 — Graphique canonique : modes unifiés, axes & robustesse (Learning-Master Lot 5)

## Statut

Accepté — 2026-07-21. Programme `patternlab-learning-master`, Lot 5.

## Contexte

Le socle graphique existait déjà en pièces (grille, volume, replay, mode aveugle) mais sans
**vocabulaire unique** des modes de présentation, sans **axe des prix lisible** sur les fiches, et
sans garantie explicite de **robustesse** sur les jeux de données limites (vide, plat, extrême).

## Décision

- **`src/engines/visual/chartMode.ts`** (pur, testé) — source unique des **quatre modes** :
  `static` (axes + libellés), `guided` (+ overlays), `interactive` (+ manipulation), `blind`
  (énigme, rien ne fuite). `chartModeOptions(mode)` dit, pour un mode, ce qui est montré
  (showAxis/showOverlays/showLabels/blind/interactive). Les composants existants **réalisent** ces
  modes ; le module évite que chaque écran réinvente « ce mode montre-t-il les libellés ? ».
- **Axe des prix** — `CandlestickGlyphs` gagne une prop opt-in `axis` : trois repères de prix
  (max / milieu / min) au bord droit, formatés selon l'amplitude. **Opt-in** → tous les graphiques
  existants restent inchangés.
- **`VisualCard`** accepte `mode` (rétro-compat : `blind` force le mode énigme), en dérive
  `chartModeOptions`, active l'**axe** (`showAxis`) et une **légende** compacte (● hausse vert /
  ● baisse rouge) pour les visuels à bougies, et **masque tout** en mode aveugle (aucune fuite).
- **Robustesse** — `chartRobustness.test.ts` verrouille le comportement de `priceScale` /
  `candleLayout` sur dataset **vide** (échelle bornée, aucune bougie), **plat** (pas de division par
  zéro, corps visible, Y borné) et **extrême** (coordonnées finies dans la boîte) ; `yToPrice` reste
  dans `[min, max]` même hors bornes.

## Conséquences

- Les fiches à bougies affichent désormais des **repères de prix** et une **légende** — lecture plus
  claire, sans casser les autres graphiques (axe opt-in).
- Les quatre modes ont un **nom et un contrat** uniques, réutilisables par les écrans (le mode aveugle
  reste étanche, y compris au lecteur d'écran).
- La robustesse des cas limites est prouvée par test (plus de risque de NaN/rendu cassé sur données
  dégénérées).
- Gate verte : lint · typecheck · **448 tests** (+9) · validate:content 31/31 · release:check 14/14 ·
  build:web. Vérifié en pilotant Chromium (390×844) : la fiche `marteau` rend **3 repères de prix**
  (axe) dans le SVG + la **légende hausse/baisse**. Aucune publication sans accord.
