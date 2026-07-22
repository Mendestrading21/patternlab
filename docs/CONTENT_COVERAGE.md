# Couverture de contenu V5 — snapshot & voie éditoriale vers 500+

Ce document est un instantané de la montée en charge du contenu V5 et décrit le workflow
éditorial (voie JSON, revue humaine) qui mène à 150 puis 500+ concepts. Il est mis à jour à
chaque lot éditorial. Deux vues coexistent : le **corpus en application** (rendu) et le
**corpus éditorial** (brouillons en revue).

## Deux corpus

| Corpus | Source | Rôle | Statut |
|---|---|---|---|
| En application | `src/data/learningContent.ts` (`V5_CONCEPTS`) | rendu dans l'app (glossaire, fiches, mondes) | `needsReview` |
| Éditorial | `content/drafts/concepts-v5/*.json` | pipeline vers publication, revue humaine | `needsReview` |

Un concept passe de l'éditorial à l'application après **revue humaine** ; rien n'est jamais
auto-publié. La conformité (vocabulaire, schéma, idempotence) est vérifiée par
`npm run validate:content` et par les tests jest.

## État courant

Les nombres historiques de ce document ne sont plus une source de vérité. Le corpus en application
est dérivé par `src/data/repoTruth.ts` et le corpus éditorial est recalculé par
`npm run validate:content`. Toute interface de progression doit consommer ces résultats plutôt qu’un
nombre recopié dans la documentation.

## Cibles par catégorie (`CATEGORIES`)

Chaque catégorie porte une cible (`target`). La couverture par catégorie et la progression vers
150/500 sont calculées par le module pur `src/content/coverage.ts` (testé) et surfacées :
- **dans l'app** : carte « Progression du contenu » de l'écran Parcours ;
- **en CLI** : `npm run validate:content` (rapport éditorial : idempotence, vocabulaire, couverture par monde).

## Workflow éditorial (idempotence)

```
brouillon JSON (needsReview, sourcePath + sourceHash)
→ validate:content (schéma + idempotence id/slug + vocabulaire)
→ revue humaine
→ intégration dans V5_CONCEPTS (rendu)
→ approved / published (jamais automatique)
```

- **Idempotence** : `sourcePath`/`sourceHash` conservés ; aucun `id`/`slug` dupliqué (échec de la
  validation en cas de conflit).
- **Reprise** : ajouter un brouillon est additif ; relancer la validation est sans effet de bord.

## Stratégie de lots (skill 07-content-factory)

20 fondations → 30 chandeliers → 30 figures → 25 structure/price action → 20 volume → 20
indicateurs → 15 risk → 15 psychologie → 15 SMC → 15 Wyckoff. **Chaque lot doit être réellement
exploitable avant d'augmenter le volume.**
