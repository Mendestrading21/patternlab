# ADR-053 — Visuel payoff d'option + monde Options (carte 15/15)

## Statut
Accepté. Nouveau **type de visuel** (`option-payoff`) et ouverture du dernier monde (*Options et
volatilité*) : la carte des mondes est désormais **complète (15/15)**.

## Contexte
Le monde *Options* restait fermé, faute d'un schéma adapté (les options se lisent par un diagramme de
payoff, pas par des bougies). Or le payoff en « crosse de hockey » est l'image la plus parlante pour
expliquer un call/put : perte bornée à la prime, seuil de rentabilité, gain au-delà.

## Décision
1. **Nouveau type `option-payoff`** (ajouté à `VisualSpec.type` et `SUPPORTED_VISUAL_TYPES`) rendu par un
   composant dédié **`OptionPayoff`** (SVG pur, sans dataset OHLC) : courbe de payoff call/put, ligne de
   zéro, strike, seuil de rentabilité (point), perte bornée = prime. `hideLabels` pour le mode énigme.
2. **`VisualCard`** et **`MiniVisual`** gèrent le type `option-payoff` sans `datasetKey` (rendu dédié).
   Le test du deck de révision est assoupli : `datasetKey` optionnel pour les types à rendu dédié.
3. **2 concepts `needsReview`** (monde `world.options`, `cat.options`) : **option d'achat (call)** et
   **option de vente (put)**, cadrés « notion éducative, sans exécution ni conseil », perte bornée à la
   prime, sans promesse de gain.

## Conséquences
- Un **nouveau type d'image** iconique (payoff), et le **dernier monde ouvert** : la carte des mondes
  passe à **15/15**. `V5_CONCEPTS` **36 → 38**.
- `VisualSpec` admet des types à rendu dédié sans dataset (payoff) — extensible pour d'autres schémas
  non-chandeliers à l'avenir.
- Validations : lint · typecheck · tests **381** · validate:content 31 · release:check 14 · build:web.
  Vérifié en pilotant Chromium : fiches call/put rendues (courbe de payoff + strike + seuil + perte=prime),
  Parcours **15/15 mondes**, 0 erreur console. Voir **ADR-053**.
