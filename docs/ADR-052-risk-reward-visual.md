# ADR-052 — Visuel risque/rendement + monde Risk

## Statut
Accepté. Nouveau **type de visuel** (`risk-reward`) et ouverture du monde *Risk management* avec des
concepts illustrés — enrichissement « contenu + images » de l'app.

## Contexte
Les mondes conceptuels (Risk, Psychologie, Fondations…) restaient fermés car chaque concept exige un
visuel (contrainte du deck de révision), et l'app n'avait pas de schéma pour le risque. Or la gestion du
risque est centrale et se prête à un schéma clair : entrée, stop, cible, et les zones risque/rendement.

## Décision
1. **Nouveau type `risk-reward`** (ajouté à `VisualSpec.type` et `SUPPORTED_VISUAL_TYPES`). Rendu par
   `VisualCard` en réutilisant `CandlestickGlyphs` (props `levels` + `zones` déjà présentes) : trois
   niveaux (Entrée cyan, Stop rouge pointillé, Cible verte pointillée) et deux **zones colorées** —
   risque (stop→entrée) et rendement (entrée→cible). Étanche au mode énigme (`blind` masque les labels).
2. **Registre pur `riskSetups.ts`** (`RISK_SETUPS` indexé par variant : `entry`/`stop`/`target`/`ratio`),
   testé (stop < entrée < cible, dans l'amplitude du dataset) ; dataset `risk.setup.v1`.
3. **3 concepts `needsReview`** (monde `world.risk`, `cat.risk`) : **rapport risque/rendement**,
   **stop (invalidation)**, **taille de position** — cadrés « préservation du capital », sans promesse de
   gain ni BUY/SELL.

## Conséquences
- Un **nouveau type d'image** pédagogique (schéma risque/rendement), réutilisable par d'autres surfaces
  (leçons, exercices `place_invalidation`).
- Le monde *Risk* s'ouvre : la carte des mondes passe de **10/15 à 11/15**. `V5_CONCEPTS` **29 → 32**.
- Validations : lint · typecheck · tests **381** (+1) · validate:content 31 · release:check 14 · build:web.
  Vérifié en pilotant Chromium : fiche risque/rendement rendue (niveaux Entrée/Stop/Cible + zones risque/
  rendement), fiche stop, Parcours 11/15 mondes, 0 erreur console. Voir **ADR-052**.
