# ADR-044 — Structure & Smart Money Concepts (initiative visuelle, lot 3)

## Statut
Accepté. Lot 3 de l'initiative « un signal visuel partout ». Réutilise **intégralement** le moteur
d'overlays du Lot 2 (ADR-043) — aucun nouveau code de rendu.

## Contexte
Les images de référence contiennent beaucoup de concepts de **structure avancée / SMC** (order blocks,
fair value gaps, zones d'offre/demande, balayages de liquidité, changement de caractère, faux signaux,
cassure-retest). Ces concepts sont fréquemment enseignés ; PatternLab les couvre de façon **éducative**
(jamais un signal prescriptif). Il leur manquait un schéma.

## Décision
Ajouter **8 concepts SMC** comme figures de la bibliothèque (famille **`structure-smc`**), rendus en
`chart-pattern` avec zones/guides/markers du registre `figureOverlays` :

1. **Changement de caractère (CHoCH)** — tendance baissière puis cassure du dernier sommet inférieur
   (guide + repère « CHoCH »).
2. **Zone d'offre / Zone de demande** — bandes de prix colorées (rouge/vert) où le prix a déjà réagi.
3. **Order block** — bande sur la dernière bougie avant l'impulsion.
4. **Fair value gap** — dataset à 3 bougies avec un vrai déséquilibre (haut de la 1re < bas de la 3e),
   bande « FVG (déséquilibre) ».
5. **Balayage de liquidité** — hauts égaux (guide) + pic « sweep » puis retournement.
6. **Faux signal (fakeout)** — franchissement bref d'un niveau puis retour (guide + repère).
7. **Cassure et retest** — niveau cassé puis retesté par l'arrière (guide + repère « retest »).

Le helper `band(from, to, color, label)` complète `line`/`mark` pour les zones. `VisualCard`
transmettait déjà `overlay.zones` — aucune modification de composant nécessaire.

## Conséquences
- La structure avancée dispose de schémas **lisibles et étiquetés** (zones colorées, niveaux, repères),
  tous générés en code, cadrés comme **éducatif** — vocabulaire conforme (aucun BUY/SELL/promesse).
- Le moteur d'overlays prouve sa généricité : 8 concepts ajoutés **sans toucher au rendu**.
- Galerie : **57 figures** sur 6 familles. Intégrité (overlays non orphelins, coordonnées valides,
  datasets présents, résumés accessibles) garantie par les tests existants.
- Reste : indicateurs avec sous-panneau (Lot 4), puis câblage d'un signal visuel partout (Lot 5).
  Aucun push sans accord explicite.
