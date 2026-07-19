# ADR-035 — Montée en charge éditoriale V5 (voie JSON vers 500+)

## Statut
Accepté (V5 Lot 10 — Extension 500+, skill `patternlab-v5-master`).

## Contexte
Le Lot 9 a porté le corpus **en application** de 3 à 12 concepts (TS, `needsReview`). La roadmap V5
vise 500+ concepts. Authoring 500 concepts de qualité d'un coup est impossible et contraire à
l'obligation « qualité avant volume ». La voie retenue est **éditoriale** : des brouillons JSON
(`content/drafts/concepts-v5/`) validés puis passés en **revue humaine** avant intégration — jamais
d'auto-publication. Il fallait donc l'**infrastructure de montée en charge** (couverture, idempotence,
conformité) plutôt qu'un volume brut.

## Décision
1. **Extension du corpus éditorial** : 8 nouveaux brouillons JSON `needsReview` (le volume, profil de
   volume, RSI, moyenne mobile, stop de protection, taille de position, FOMO, accumulation Wyckoff),
   ouvrant 5 mondes éditoriaux supplémentaires (volume, indicateurs, risk, psychologie, wyckoff).
   Chacun porte `sourcePath` + `sourceHash` (idempotence). Total éditorial : **10 brouillons / 7 mondes**.
2. **Portail éditorial dans `validate:content`** : au-delà de la validation de schéma, le script
   contrôle désormais **l'idempotence** (aucun `id`/`slug` dupliqué → échec), le **vocabulaire**
   (aucun BUY/SELL ni promesse → échec), le **statut** (tous `needsReview`), et imprime un **rapport de
   couverture** par monde + progression vers 150/500. Les conflits font échouer la CI.
3. **Module de couverture pur** `src/content/coverage.ts` (testé jest) : `summarizeConcepts`,
   `coverageByCategory` (vs `CATEGORIES.target`), `coverageTotals` (jalons 150/500), `idempotenceIssues`.
   Source de vérité de la progression, utilisable partout sans I/O.
4. **Surface in-app** : carte **« Progression du contenu »** sur l'écran Parcours (barre de progression
   « 12 / 150 concepts en revue »), alimentée par `coverageTotals(summarizeConcepts(V5_CONCEPTS))` —
   verifiable, jamais un bouton mort.
5. **Documentation** : `docs/CONTENT_COVERAGE.md` (deux corpus, snapshot, workflow éditorial, cibles,
   stratégie de lots).

## Conséquences
- La route vers 500+ est **outillée et sûre** : chaque brouillon ajouté est validé (schéma + idempotence
  + vocabulaire) ; la progression est mesurée en app et en CLI ; rien n'est publié sans revue humaine.
- Séparation nette **éditorial (brouillons)** ↔ **application (rendu)** : on peut accumuler des centaines
  de brouillons sans impacter le rendu, puis intégrer par lots après revue.
- Périmètre assumé : les brouillons éditoriaux n'ont pas encore de `visualSpec` rendu (le visuel est
  produit à la revue, avec le dataset associé) ; l'intégration en `V5_CONCEPTS` reste manuelle et revue.
- Reste à faire : outil d'import assisté (APP/WMB) alimentant les brouillons, et intégration progressive
  éditorial → application lot par lot jusqu'à 150 puis 500+.
