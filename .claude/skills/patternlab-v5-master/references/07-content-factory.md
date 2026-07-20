# 07 — Fabrique de contenu et import APP

## Dossiers sources à inventorier

- `01_PAGES_EDUCATIVES/`
- `02_DATA_EDUCATIVES/`
- `03_COMPOSANTS_EDUCATIFS/`
- `04_SEEDS_SCRIPTS/`
- `06_SCHEMA_DB/`
- `07_SERVER_ROUTERS/`
- `10_SHARED_CONFIG/`

Ne jamais importer utilisateurs, emails, mots de passe, tokens, Stripe, progressions de production ou données privées.

## Pipeline

```text
inventaire
→ extraction
→ normalisation
→ déduplication
→ classification
→ micro-concepts
→ VisualSpec
→ exercices
→ flashcards
→ validation
→ needsReview
→ revue humaine
→ publication
```

## Stratégie de lots

1. 20 fondations ;
2. 30 chandeliers ;
3. 30 figures ;
4. 25 structure/price action ;
5. 20 volume ;
6. 20 indicateurs ;
7. 15 risk management ;
8. 15 psychologie ;
9. 15 SMC ;
10. 15 Wyckoff.

Chaque lot doit être réellement exploitable avant d’augmenter le volume.

## Exigences

Chaque concept prioritaire reçoit définition, contexte, limites, VisualSpec, exemple, faux signal, erreur fréquente, flashcard, mini-quiz, relations, source et statut `needsReview`.

## Idempotence

Conserver `sourcePath` et `sourceHash`, ne pas dupliquer, produire un rapport, signaler les conflits et permettre une reprise après interruption.
