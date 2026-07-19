# ADR-030 — Moteur de graphiques interactifs V5 (benchmark + MVP)

## Statut
Accepté (V5 Lot 5 — Chart Engine MVP, skill `patternlab-v5-master`).
Répond à l'exigence « ADR-006 — interactive chart engine » du skill ; le numéro 006 étant
déjà pris dans ce dépôt (`ADR-006-fiabilite-progression.md`), l'ADR chart-engine est numérotée
**030** dans la suite séquentielle V5 (026 → 029 déjà utilisés).

## Contexte
La v1 offrait un `InteractiveChart` (tracé d'un niveau horizontal au toucher) et un `PatternChart`
statique, tous deux en `react-native-svg`. La vision V5 exige un **moteur de graphiques pédagogiques**
plus riche (volume, replay, sélection de zone, ligne de tendance, annotations…) et impose de
**documenter le choix de rendu** dans un ADR de benchmark avant d'étendre.

## Options de rendu évaluées
| Critère | react-native-svg | React Native Skia | Canvas web | Lib graphique tierce |
|---|---|---|---|---|
| Plateformes (iOS/Android/web) | ✅ natif partout (déjà installé 15.15.4) | ✅ mais poids + config web (CanvasKit/WASM) | ❌ web seul (pas natif) | ⚠️ souvent web-only ou non maintenue Expo |
| Fluidité (nos volumes : ≤ ~60 bougies statiques) | ✅ suffisante (rendu statique, pas d'animation) | ✅✅ (GPU) — utile surtout pour l'animation lourde | ✅ (web) | variable |
| Gestes | ✅ responder RN (tap/zone) déjà en place | ✅ gesture-handler | ⚠️ à recâbler web | variable |
| Accessibilité | ✅ `accessibilityLabel`/rôles sur le wrapper RN | ⚠️ canvas opaque → à reconstruire | ⚠️ canvas opaque | ⚠️ dépend de la lib |
| Testabilité | ✅✅ **géométrie pure en TS**, testée sans rendu | ✅ logique pure aussi, rendu moins introspectable | ⚠️ | ⚠️ |
| Taille / dépendances | ✅ déjà présent, 0 ajout | ➖ ajout conséquent (+WASM web) | ✅ | ➖ |
| Maintenance | ✅ écosystème Expo mainstream | ✅ Shopify, actif | ➖ | ⚠️ risque d'abandon |
| Fallback | ✅ dégradation SVG simple | ➖ | ➖ | ➖ |

## Décision
**Rester sur `react-native-svg`** pour le moteur MVP, avec une architecture **logique pure / rendu mince** :
- toute la logique (échelle, niveaux, tolérance, **volume**, **replay**) vit dans des modules TS purs
  (`interactive.ts`, `chartEngine.ts`) — déterministes, testés, sans dépendance de rendu ;
- les composants (`InteractiveChart`, `MarketReplayChart`) sont de fines enveloppes SVG.

Ainsi, migrer un jour vers **Skia** (si une animation fluide de replay/zoom devient nécessaire) ne
touchera **que la couche de rendu** : la logique et les tests restent identiques. Skia est le
**candidat de secours documenté** si le besoin d'animation/perf apparaît ; il n'est pas justifié
aujourd'hui car nos graphiques sont **statiques** (compatibles reduced-motion) et de petite taille.

## Périmètre livré ce lot (MVP)
- **Volume** : `candleVolume`/`volumeSeries`/`maxVolume` — participation synthétique déterministe
  dérivée de la géométrie de la bougie (amplitude + corps), jamais une donnée de marché réelle.
- **Replay bougie par bougie** : machine à états pure `initReplay`/`stepReplay`/`revealAll`/
  `resetReplay`/`replayAtEnd`/`replayAtStart` (bornée à [1, total]).
- **Rendu** `MarketReplayChart` : chandeliers clippés à `visibleCount` + panneau de volume ; **échelle
  calculée sur la série complète** (l'axe ne saute pas pendant le replay) ; **résumé accessible**
  (progression, dernière clôture, participation) ; statique (le replay n'avance qu'au toucher).
- **Écran** : nouveau scénario « Observe la participation (replay) » au Laboratoire (⏮/◀/▶/⏭),
  analytics `lab_started`/`lab_completed` (`scenario: 'volume_replay'`). Le bouton mort « Tracé de
  zones & replay » est remplacé (replay/volume désormais livrés ; zone/tendance/annotations restent
  annoncées comme futures, non silencieuses).

## Datasets
Synthétiques, seed explicite (`generateCandles(seed, count)`), reproductibles, sans donnée temps réel
ni symbole obligatoire. Le volume est fonction déterministe des bougies.

## Reste à faire (prochains lots)
Sélection de zone rectangulaire, ligne de tendance, annotations éditables/suppressibles, zoom/déplacement
contrôlés, correction visuelle par zone — tous réalisables en `react-native-svg` sur la même base ;
réévaluer Skia uniquement si une animation fluide devient un besoin pédagogique.

## Conséquences
- Zéro dépendance ajoutée, MVP fluide, accessible et testé ; l'architecture pure/rendu garde la porte
  ouverte à Skia sans réécrire la logique.
- La testabilité reste maximale (la géométrie et l'état de replay sont couverts par des tests purs).
