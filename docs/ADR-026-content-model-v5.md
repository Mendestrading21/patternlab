# ADR-026 — Modèle de contenu V5 (`LearningConcept`)

## Statut
Accepté (V5 Lot 1 — Schéma de contenu, skill `patternlab-v5-master`).

## Contexte
La v1 modélise le vocabulaire par `GlossaryTerm` (25 termes : slug, term, english, category,
summary, definition, example, relations). C'est insuffisant pour la vision V5 « visuelle-first » :
un concept doit porter reconnaissance, contexte, limites, scénarios **conditionnels**, invalidation,
faux signaux, visuel (`VisualSpec`), exemples de graphique, flashcards, mini-quiz, relations,
maîtrise, sources et statut de revue. Il faut aussi une taxonomie (15 mondes, 13 familles) pour
structurer 150 puis 500+ concepts — sans casser l'écran glossaire existant.

## Décision
1. **Modèle riche `LearningConcept`** (`src/data/learningConcept.ts`, pur, typé) : conforme à
   l'interface du skill (id/slug/aliases/catégorie/monde/difficulté/prérequis/objectif/définitions/
   reconnaissance/contexte/limites/scénarios/confirmation/invalidation/faux signaux/erreurs/checklist/
   `VisualSpec`/`ChartExample`/flashcards/mini-quiz/relations/sources/statut/locale/disclaimer).
2. **Registres de taxonomie** : `WORLDS` (15 mondes ordonnés) et `CATEGORIES` (13 familles, chacune
   reliée à un monde, avec un volume cible). Base des parcours et du remplissage éditorial (Lots 9–10).
3. **Garde de conformité testée** : `conceptVocabularyIssues` refuse BUY/SELL (étiquettes majuscules)
   et les promesses (« profit garanti »…). `checkConceptsIntegrity` vérifie unicité id/slug, mondes/
   catégories/skills valides, relations et prérequis résolus, disclaimer présent, `VisualSpec` avec
   résumé accessible. Un corpus non conforme fait rougir la CI.
4. **Pont non destructif** : `toGlossaryTerm` / `glossaryFromConcepts` dérivent des `GlossaryTerm`
   depuis les concepts (mapping catégorie V5 → catégorie glossaire v1, relations résolues id→slug).
   La v1 (`glossary.ts`, `seed.ts`) **reste intacte** ; l'écran glossaire n'est pas modifié ce lot
   (bascule au Lot 4). Additif, réversible.
5. **Validation de schéma** : `schemas/learning-concept.schema.json` + extension de `validate:content`
   pour les brouillons `content/drafts/concepts-v5/` (statut `needsReview`, jamais auto-publié).
6. **Amorce** : `src/data/learningContent.ts` — 3 concepts pleinement rédigés (marteau, double creux,
   support/résistance) qui exercent tout le modèle, `needsReview`, cross-liés.

## Conséquences
- Fondation prête pour le moteur visuel (Lot 3 lit `VisualSpec`/`datasetKey`), le glossaire premium
  (Lot 4 bascule sur le pont) et la montée en contenu (Lots 9–10 via la fabrique).
- Conformité éducative structurellement garantie (garde de vocabulaire au point de passage).
- Aucune régression : la v1 reste la source de l'écran glossaire jusqu'au Lot 4.

## Rollback
`learningConcept.ts`, `learningContent.ts`, le schéma et les brouillons sont additifs ; les retirer
revient à la v1 sans perte. Aucune donnée utilisateur concernée.
