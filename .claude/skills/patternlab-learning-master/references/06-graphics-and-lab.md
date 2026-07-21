# Graphiques et laboratoires interactifs

## Principe

Un graphique enseigne une relation. Ne pas en ajouter pour décorer une carte. Utiliser des SVG/Views codés pour les informations exactes et réserver les illustrations raster aux mascottes et scènes narratives.

## Contrat de rendu

Chaque visuel supporte quatre modes :

- `static` : explication.
- `guided` : annotations progressives.
- `interactive` : manipulation.
- `blind` : quiz sans fuite de réponse.

Chaque mode possède un `accessibilitySummary` adapté. Le mode blind ne révèle ni titre, ni label, ni texte accessible contenant la réponse.

## Composant de graphique canonique

Composer :

- chandeliers OHLC ;
- axe prix ;
- axe temporel simplifié ;
- grille ;
- volume optionnel ;
- overlays ;
- légende activable ;
- crosshair ou sélection par point ;
- annotations accessibles ;
- état replay.

Séparer calculs purs, données déterministes et renderer React Native SVG.

## Indicateurs

### RSI

- Valeur bornée 0–100.
- Zones 30/70 et ligne 50.
- Période 14 par défaut.
- Interaction : période, replay, divergence.
- Questions : valeur, contexte, divergence, faux signal.

### MACD

- EMA rapide 12, lente 26, signal 9.
- Deux lignes + histogramme centré sur zéro.
- Interaction : couches, paramètres presets, replay.
- Questions : croisement, momentum, retard, divergence.

### Bollinger

- Moyenne 20, ±2 écarts-types.
- Interaction : période et multiplicateur.
- Scènes : squeeze, expansion, tendance le long de bande, faux retournement.

### Moyennes mobiles

- SMA/EMA, 20/50/200.
- Montrer le retard et l’effet du paramètre.
- Ne pas enseigner un croisement comme ordre automatique.

### Volume, VWAP et profil

- Volume dérivé identifié comme donnée simulée si tel est le cas.
- VWAP avec poids du volume.
- Profil : POC, zones forte/faible activité.

## Graphiques fondamentaux

- Dividende : flux de bénéfice et frise ex-date/paiement.
- PER : ratio interactif prix/BPA et comparaison de scénarios.
- Intérêt composé : courbes versements/capital/intérêts.
- Obligation : prix/rendement en sens inverse.
- Inflation/taux : chaîne causale simplifiée, sans certitude prédictive.

## Laboratoires prioritaires

1. Placer support et résistance.
2. Tracer une tendance avec deux points et valider le troisième.
3. Révéler les bougies et le volume.
4. Régler RSI et repérer une divergence.
5. Décomposer MACD.
6. Provoquer une compression Bollinger.
7. Comparer cassure et faux signal.
8. Simuler Dividende.
9. Simuler PER.

## Types d’exercices

Créer un registre unique. Finaliser les formats déclarés manquants ou les retirer du contrat public :

- `drag_drop` avec alternative boutons.
- `draw_level` avec flèches et saisie accessible.
- `timed` facultatif, jamais punitif et désactivable.

Ajouter selon besoin : `adjust_indicator`, `compare_scenarios`, `annotate_chart`, `explain_choice`. Tout nouveau format exige type, grader, renderer, données, feedback, a11y et tests.

## QA graphique

- 320, 390, 430 px et tablette.
- Font scaling 1.8.
- Contraste clair/sombre si un thème clair arrive.
- Aucune information par couleur seule.
- Pas de labels coupés ni d’axes illisibles.
- Valeurs finies, plages nulles, datasets vides et paramètres extrêmes testés.
- Snapshot visuel ou test géométrique déterministe pour chaque renderer.
