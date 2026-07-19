# ADR-034 — Contenu pilote riche V5 (premier lot éditorial)

## Statut
Accepté (V5 Lot 9 — Contenu pilote riche, skill `patternlab-v5-master`).

## Contexte
Le modèle `LearningConcept` (Lot 1), le moteur de visuels (Lot 3), le glossaire premium (Lot 4) et la
carte des mondes (Lot 8) sont en place mais n'étaient alimentés que par **3 concepts amorce**. La
roadmap V5 vise 150 puis 500+ concepts. Le skill impose : **qualité avant volume** (« chaque lot doit
être réellement exploitable avant d'augmenter le volume »), revue humaine, statut `needsReview`,
conformité de vocabulaire, idempotence.

## Décision
Livrer le **premier lot éditorial riche** — un batch pleinement exploitable plutôt qu'un volume de
stubs — et poser le **portail de la fabrique de contenu** qui gardera la qualité à mesure du volume.

1. **Corpus** : `V5_CONCEPTS` passe de **3 à 12 concepts** entièrement rédigés (définition courte +
   détaillée, reconnaissance, contexte, limites, scénarios conditionnels, invalidation, faux signaux,
   erreurs fréquentes, checklist, `visualSpec`, `chartExamples`, `interactiveTemplates`, flashcards,
   mini-quiz, relations). Les 9 nouveaux : anatomie de bougie, doji, étoile filante, avalement haussier,
   double sommet, tendance haussière, cassure de structure (BOS), range, polarité (flip). Tous
   `status: 'needsReview'`, `locale: 'fr-CH'`, disclaimer présent.
2. **Visuels** : 3 nouveaux datasets OHLC déterministes (`pattern.double-top.v1`, `structure.uptrend.v1`,
   `structure.bos.v1`) ; réutilisation des datasets existants (doji, étoile filante, avalement,
   anatomie, range). Chaque concept a un `visualSpec` d'un **type rendu** (candle-anatomy /
   candlestick-pattern / chart-pattern / market-structure).
3. **Portail fabrique** `contentFactory.test.ts` : garde-fou qui monte en charge avec le corpus —
   ids/slugs uniques, intégrité (`checkConceptsIntegrity`) et vocabulaire (`conceptVocabularyIssues`)
   propres sur **tout** le corpus, tout en `needsReview`, chaque visuel rendable (type supporté + dataset
   présent), couverture des mondes ≥ 5. Chaque futur lot éditorial doit passer ce portail.
4. **Surfaçage automatique** (non destructif) : les nouveaux concepts apparaissent sans modifier d'écran —
   glossaire unifié (35 termes), carte des mondes (**5/15 mondes ouverts** : + anatomie, structure),
   fiches `/concept/[slug]` avec visuel + a11y. Contenu jamais auto-publié (needsReview).

## Conséquences
- 4× le corpus, immédiatement exploitable (visuels, flashcards, quiz, relations), conforme et testé.
- Le portail rend le passage à 150/500 sûr : le volume augmente lot par lot sans régression de qualité.
- Périmètre assumé : les mondes sans visuel rendu (volume, indicateurs, options…) restent à couvrir dans
  les lots suivants (nouveaux types de `VisualSpec` + datasets) ; la voie JSON `content/drafts/` (revue
  humaine → publication) reste la piste éditoriale parallèle vers 500+ (Lot 10).
