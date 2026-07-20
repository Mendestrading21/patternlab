# ADR-014 — Moteur graphique du Laboratoire (benchmark svg / Skia / Canvas)

## Statut
Accepté (LOT 8 — Laboratoire interactif, skill `patternlab-product-growth`).

## Contexte
Le laboratoire passe d'un aperçu statique à une **manipulation réelle** (tracer un
niveau, corriger visuellement). Le skill impose de comparer `react-native-svg`,
React Native Skia et Canvas, puis de **documenter le choix dans un ADR avant de
remplacer le moteur**.

## Options comparées
| Critère | react-native-svg (actuel) | React Native Skia | Canvas (web) |
|---|---|---|---|
| Plateformes | iOS · Android · **web** | iOS · Android · web (via CanvasKit/WASM) | web uniquement (RN web) |
| Nouvelle dépendance | non (déjà utilisé) | **oui** (@shopify/react-native-skia + WASM sur web) | non, mais non-natif |
| Performance (≤ ~60 bougies) | suffisante | supérieure (utile pour milliers d'éléments / animations) | bonne sur web |
| Gestes / hit-testing | responder RN + calcul d'échelle | gestes riches (Skia + Reanimated) | manuel |
| Accessibilité | rôles RN standard | à réimplémenter | à réimplémenter |
| Tests | logique d'échelle **pure et testable** | idem si logique extraite | idem |
| Poids bundle web | léger | lourd (WASM) | léger |
| Maintenance | faible (déjà en place) | moyenne | moyenne |

## Décision
**Rester sur `react-native-svg`** pour le MVP interactif et **ne pas remplacer le
moteur** maintenant. La logique d'échelle prix↔Y et les niveaux cibles sont **extraits
en fonctions pures testées** (`interactive.ts`), indépendantes du moteur de rendu :
un futur passage à Skia n'imposera pas de réécrire la logique, seulement le renderer.

Réévaluer Skia **quand un besoin prouvé apparaîtra** (replay animé fluide, milliers de
bougies, gestes de zoom/pan complexes) — conformément à la règle « pas de dépendance
sans besoin prouvé ». Un nouvel ADR documentera alors le remplacement.

## Prototype livré (premier scénario)
- Scénario **« trace le support »** : graphique déterministe, tracé d'un niveau
  horizontal au **tap** (souris/touch, via le responder RN) **ou** aux flèches ↑/↓
  (chemin accessible / fallback aux gestes), **validation** avec tolérance, **correction
  visuelle** (ligne cible + feedback Toto/Bobo) et **réinitialisation**.
- `InteractiveChart` (react-native-svg) + `interactive.ts` (échelle, support/résistance,
  tolérance — purs et testés). Analytics : `lab_started`, `lab_completed`.

## Conséquences
- Aucune dépendance ajoutée ; cross-platform immédiat ; logique testée.
- Base extensible aux prochains scénarios (résistance, zone rectangulaire, replay).

## Rollback
Le renderer et le scénario sont additifs ; revenir à l'aperçu statique n'affecte pas
`interactive.ts` (réutilisable). Le remplacement éventuel du moteur fera l'objet d'un ADR.
