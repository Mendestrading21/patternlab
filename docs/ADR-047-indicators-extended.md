# ADR-047 — Indicateurs, extension (initiative visuelle, lot 4+)

## Statut
Accepté. Extension du Lot 4 (ADR-045) : la famille indicateurs passe de **7 à 15**.

## Contexte
Les 66 images de référence couvrent beaucoup plus d'indicateurs que le premier lot n'en avait livrés
(croisements de moyennes « golden/death cross », compression de Bollinger, rubans d'EMA, stochastique,
VWAP, ATR, divergence cachée). Le socle du Lot 4 (math pur + `IndicatorPanel` à sous-panneau) était
prévu pour ça.

## Décision
1. **Math pur** (`indicatorMath.ts`) : ajout de `stochastic` (%K/%D), `vwap`, `atr`, plus les accès
   `highsOf`/`lowsOf`. 3 nouveaux tests (bornes stochastique, VWAP dans l'enveloppe, ATR positif).
2. **Renderer** (`IndicatorPanel`) : nouveaux `kind` `ribbon` (plusieurs EMA empilées, couleurs
   graduées), `stochastic` (sous-panneau %K/%D + zones 80/20), `vwap` (ligne moyenne en superposition),
   `atr` (sous-panneau de volatilité). La divergence gagne un paramètre `pivot` (`high`/`low`) pour
   couvrir la **divergence cachée** (creux) en plus de la divergence classique (sommets).
3. **8 indicateurs** (datasets + `PATTERN_LIBRARY`, famille `indicateur`) : croisement doré, croisement
   de la mort, compression de Bollinger, ruban de moyennes, stochastique, VWAP, ATR, divergence cachée.

## Conséquences
- Couverture indicateurs bien plus complète (15), toujours calculée en code et cadrée éducatif
  (« souvent commenté », « sans direction garantie », « à lire avec le contexte »).
- Le renderer et le socle math prouvent leur extensibilité : 8 indicateurs ajoutés sans refonte.
- Galerie : **72 figures** sur 7 familles. Intégrité garantie par test (configs non orphelines,
  datasets présents). Validations vertes. Aucune image de référence copiée ; aucun push sans accord.
