# ADR-050 — Fiches concept des nouvelles figures

## Statut
Accepté. Transforme une sélection des figures de la bibliothèque visuelle en `LearningConcept`
pleinement rédigés, pour qu'elles deviennent des concepts apprenables de bout en bout.

## Contexte
La bibliothèque comptait 72 figures illustrées, mais seuls 12 concepts avaient une fiche riche
(définition, reconnaissance, scénarios, flashcards, quiz). Les figures chartistes, indicateurs et SMC
n'existaient qu'en vignettes. Les mondes `world.indicators` et `world.smc` n'avaient aucun concept.

## Décision
Ajouter **6 concepts `needsReview`** à `V5_CONCEPTS`, chacun rédigé complètement et relié au visuel déjà
codé (même `variant`/`datasetKey` → overlays et panneaux d'indicateurs rendus) :

1. **Triangle ascendant** (figure, continuation) — `world.patterns`.
2. **Épaule-tête-épaule** (figure, retournement) — `world.patterns`.
3. **Drapeau haussier** (figure, continuation) — `world.patterns`.
4. **RSI** (indicateur) — `world.indicators` (monde jusque-là vide).
5. **Divergence** (indicateur/prix) — `world.indicators`.
6. **Order block** (SMC, éducatif) — `world.smc` (monde jusque-là vide).

Chaque fiche respecte le modèle V5 (reconnaissance, limites d'interprétation, scénario + invalidation,
faux signaux, checklist, flashcard, mini-quiz, relations) et la conformité de vocabulaire (aucun
BUY/SELL ni promesse ; cadrage « repère, pas un ordre » pour les indicateurs).

## Conséquences
- Ces concepts entrent **automatiquement** dans le glossaire unifié, la carte des mondes (passée de
  **5/15 à 7/15 ouverts** — indicateurs et SMC couverts), le deck de révision et — via leur `visualSpec`
  — l'entraîneur de reconnaissance. Aucun câblage supplémentaire.
- V5_CONCEPTS : **12 → 18** ; toutes les gardes tiennent (unicité, intégrité des relations, vocabulaire,
  visuels rendables). Contenu **jamais auto-publié** (`needsReview`, revue humaine avant publication).
- Validations : lint · typecheck · tests **376** · validate:content 31 · release:check 14 · build:web.
  Vérifié en pilotant Chromium : fiches `triangle-ascendant` / `rsi` / `order-block` rendues (visuel +
  overlays), Parcours « 7/15 mondes ouverts », 0 erreur console. Voir **ADR-050**.
