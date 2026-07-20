# ADR-055 — Graphiques parfaits & 3 nouveaux types visuels (Exp-Max Lot 2)

## Statut

Accepté — 2026-07-20. Programme `patternlab-experience-max`, Lot 2.

## Contexte

Le moteur de visuels couvrait 7 des 10 types de `VisualSpec` ; `volume-profile`, `comparison` et
`cheat-sheet` étaient déclarés mais non rendus (repli « aperçu à venir »). Par ailleurs, les
graphiques en chandeliers manquaient de repères de lecture (pas de grille), ce qui nuisait à la
lisibilité sur mobile. Objectif du lot : « graphiques parfaits, un par un » + un signal visuel
réellement disponible pour tous les types.

## Options

1. Laisser les 3 types en repli textuel (statu quo — laisse des trous visuels).
2. Rendre les 3 types manquants + polir les renderers partagés, en réutilisant les datasets et la
   géométrie existants. *(retenu)*
3. Réécrire un moteur de charts tiers (hors périmètre, risque élevé).

## Décision

Option 2.
- **`volume-profile`** : module pur `volumeProfile.ts` (`buildVolumeProfile` répartit le volume
  synthétique `candleVolume` par palier de prix, POC = palier de plus fort volume) + renderer
  `VolumeProfile` (barres horizontales, POC en or).
- **`comparison`** : registre `comparisons.ts` (deux côtés → datasetKey + légende) + renderer
  `ComparisonVisual` (deux mini-graphiques côte à côte).
- **`cheat-sheet`** : registre `cheatSheets.ts` (grille de mini-schémas légendés) + renderer
  `CheatSheetVisual`.
- Dispatch ajouté à `VisualCard` ; `SUPPORTED_VISUAL_TYPES` complété (10 types) ; barrel exporté.
- **Polish** : grille horizontale subtile (5 lignes, `colors.border`, opacité 0.6) ajoutée à
  `CandlestickGlyphs` et `PatternChart` (prop `grid`, activée par défaut) → tous les graphiques de
  l'app gagnent en lisibilité. Statique (reduced-motion), a11y inchangée.
- Vitrine « Volume, comparaisons & aide-mémoire » ajoutée à la Bibliothèque visuelle.

## Conséquences

- Les 10 types de `VisualSpec` sont désormais rendus ; plus aucun repli « aperçu à venir » pour ces
  formats. Réutilisables par le contenu futur (concepts, leçons, quiz).
- Graphiques plus lisibles partout (grille). Datasets réutilisés → déterminisme conservé.
- Gate verte : lint · typecheck · **394 tests** (+8) · validate:content 31 · release:check 14 ·
  build:web. Vérifié en pilotant Chromium (390×844) : vitrine rendue (profil de volume + POC,
  comparaisons, aide-mémoire), grille visible sur les charts, 0 erreur console.

## Rollback

Réversible : retirer les 3 branches de `VisualCard` (retour au repli), supprimer les composants /
registres / module `volumeProfile`, et passer `grid={false}` (ou retirer la prop) pour revenir aux
graphiques sans grille. Aucun changement de schéma de données.
