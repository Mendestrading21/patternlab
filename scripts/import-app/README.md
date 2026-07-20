# Import APP/WMB → brouillons de concepts

Pipeline de **migration de contenu éducatif** depuis la source APP/WMB vers PatternLab,
en **brouillons `needsReview`** (jamais publiés automatiquement).

## Principe

- Cœur **pur et testé** : `src/content/importPipeline.ts` (normalisation, classification,
  hash de contenu, garde anti-données-personnelles, brouillon, déduplication).
- Runner : `scripts/import-app/index.mjs` (I/O + idempotence), qui **réutilise** le
  pipeline via l'exécution TypeScript native de Node 22 — une seule source, aucune
  divergence.

## Étapes

```
inventaire (source/*.json)
  → normalisation → classification (5 catégories) → micro-concept
  → brouillon needsReview (origine + hash + importedAt) → déduplication
  → validation de schéma (schemas/concept.schema.json)
  → REVUE HUMAINE → publication versionnée (manuelle)
```

## Garanties

- **Aucune donnée personnelle** : `hasPersonalData` rejette tout enregistrement portant
  une clé interdite (email, password, stripe, compte, abonnement…). L'app n'importe
  jamais ce contenu (build-time only ; APP reste une source, pas une dépendance runtime).
- **Idempotent** : un contenu inchangé (même `sourceHash`) n'est pas réécrit.
- **Traçable** : chaque brouillon garde `origin.sourcePath`, `origin.sourceHash`,
  `origin.importedAt`, `origin.migrationVersion`.
- **Statut** : `needsReview` — publication uniquement après validation humaine.

## Usage

```bash
npm run import:app        # génère content/drafts/concepts/*.json
npm run validate:content  # valide aussi les concepts contre le schéma
```

## Source

`scripts/import-app/source/*.json` — pilote curaté (voix éducative WMB), représentatif
du corpus `Mendestrading21/APP` (`02_DATA_EDUCATIVES`). Pour migrer l'export réel,
remplacer/alimenter ce dossier avec les concepts extraits (mêmes champs éducatifs) —
le pipeline monte en charge sans modification de code (« ne jamais migrer 1000+ d'un
coup » : procéder par lots de catégorie).
